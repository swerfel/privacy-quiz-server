import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
var cors = require('cors');
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer);

// QUESTIONS

type AnswerType = "yes" | "no";

class Question {
  id: number;
  question: string;
  isActive: boolean;

  constructor(id: number, question: string) {
    this.id = id;
    this.question = question;
    this.isActive = true;
  }
}

class Answer {
  id: number;
  answer?: AnswerType;
  estimate?: number;

  constructor(id: number) {
    this.id = id;
  }

  isEverythingAnswered(){
    return (this.answer === "yes" || this.answer === "no") && (typeof this.estimate !== 'undefined' && this.estimate >= 0 && this.estimate <= 100);
  }
}

class Statistics {
  id: number;
  yesAnswers = 0;
  noAnswers = 0;
  percentage = 50;

  constructor(id: number) {
    this.id = id;
  }

  addAnswer(answer: AnswerType){
    if (answer === "yes") {
      this.yesAnswers++;
    } else if (answer === "no") {
      this.noAnswers++;
    }
    this.updatePercentage();
  }

  updatePercentage(){
    var total = this.yesAnswers + this.noAnswers;
    if (total > 0)
      this.percentage = Math.round(this.yesAnswers / total * 100);
  }
}

class Client {
  socket: Socket;
  answers: Answer[];
  statistics: Statistics[];
  score: number = 0;
  scoredEstimates: number = 0;
  name: string;
  constructor(socket: Socket) {
    this.socket = socket;
    this.answers = rawQuestions.map((_q, index) => new Answer(index));
    this.statistics = new Array(questions.length);
    this.name = socket.id;
  }
}

const rawQuestions = [
  'Hast du schon mal im Büro geschlafen?',
  'Hast du schon mal bei andrena geduscht?',
  'Hast du schon mal eine Spülmaschine nicht ausgeräumt, obwohl du dafür die Zeit gehabt hättest?',
  'Hast du schon mal ein privates Packet zu andrena bestellt?',
  'Hast du schon mal dein Essen im Kühlschrank vergessen?',
  'Hast du schon mal beim Kickern gemogelt?',
  'Hast du schon mal einen Arbeitstag mit einem Bier/Wein begonnen?',
  'Bist du schon mal einem Meeting auf dem Klo gefolgt?',
];
const questions: Question[] = [];
const statistics: Statistics[] = [];

var currentQuestionIndex = -1;
var dirty = true;
var clients = {};
var disconnectedClients = {};

function nextQuestion(){
  if (currentQuestionIndex < rawQuestions.length) {
    if (currentQuestionIndex >= 0)
      finalizeCurrentQuestion();
    currentQuestionIndex++;
  }
  if (currentQuestionIndex < rawQuestions.length) {
    questions.push(new Question(currentQuestionIndex, rawQuestions[currentQuestionIndex]));
    statistics.push(new Statistics(currentQuestionIndex));
  }
  console.log("switching to question "+currentQuestionIndex);
  dirty = true;
  sendUpdateToAllSockets();
}

function finalizeCurrentQuestion(){
  questions[currentQuestionIndex].isActive = false;
  Object.values(clients).forEach(computeScore);
  console.log(statistics[currentQuestionIndex]);
}

function computeDifference(client: Client, questionIndex: number) {
  var realValue = statistics[questionIndex].percentage;
  var estimate = client.answers[questionIndex].estimate;
  if (!estimate) {
    estimate = (realValue < 50)? 100: 0;
  }
  return  Math.abs(realValue - estimate);
}

function computeScore(client: Client) {
  client.scoredEstimates++;
  client.score += computeDifference(client, currentQuestionIndex);
}

function sendUpdateToAllSockets() {
  if (dirty) {
    dirty = false;
    io.emit("questions", questions);
    Object.values(clients).forEach(sendUpdatesToSocket);
    io.emit("scores", computeCurrentScores());
  }
}

function sendUpdatesToSocket(client: Client) {
  client.socket.emit("statistics", client.statistics);
}

function computeCurrentScores(){
  var scores = Object.values(clients).map((client: Client) => {return {playerName: client.name, score: client.score, id: client.socket.id}})
  scores.sort(function(a, b){
    if (a.score != b.score)
      return a.score - b.score;
    var x = a.playerName.toLowerCase();
    var y = b.playerName.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  });
  return scores;
}

function isAnswerValid(answerObj: Answer) {
  var a = answerObj.answer
  if (!(a === "yes" || a === "no")){
    console.log("Illegal answer received:" + a);
    return false;
  }

  var id = answerObj.id;
  if ( id < 0 || id > questions.length || !questions[id].isActive ) {
    console.log("Illegal answer id received: " + id + " but current id is " + currentQuestionIndex);
    return false;
  }

  return true;
}

function isEstimateValid(answerObj: Answer) {
  var estimate = answerObj.estimate
  if (!(typeof estimate !== 'undefined' && estimate >= 0 && estimate <= 100)){
    console.log("Illegal estimate received:" + estimate);
    return false;
  }

  var id = answerObj.id;
  if ( id < 0 || id > questions.length || !questions[id].isActive ) {
    console.log("Illegal answer id received: " + id + " but current id is " + currentQuestionIndex);
    return false;
  }

  return true;
}

io.on("connection", (socket: Socket) => {
  console.log("client connected " + socket.id);
  clients[socket.id] = new Client(socket);
  socket.emit("questions", questions);
  if (clients[socket.id].scoredEstimates < currentQuestionIndex) {
    var score = 0;
    for(var i=0; i < currentQuestionIndex; i++) {
      score += computeDifference(clients[socket.id], i);
    }
    clients[socket.id].scoredEstimates = currentQuestionIndex+1;
    clients[socket.id].score = score;
  }
  dirty=true;

  socket.on("disconnect", _reason => {
    disconnectedClients[socket.id] = clients[socket.id];
    delete clients[socket.id];
  })

  socket.on("answer", a => {
    if (isAnswerValid(a)) {
      var client = clients[socket.id];
      client.answers[a.id].answer =  a.answer;
      statistics[a.id].addAnswer(a.answer);
      if (client.answers[a.id].isEverythingAnswered()) {
        client.statistics[a.id] = statistics[a.id];
      }
      dirty = true;
      socket.emit("answers", client.answers);
    }
  })

  socket.on("estimate", a => {
    if (isEstimateValid(a)) {
      var client = clients[socket.id];
      client.answers[a.id].estimate =  a.estimate;

      if (client.answers[a.id].isEverythingAnswered()) {
        client.statistics[a.id] = statistics[a.id];
      }
      dirty = true;
      socket.emit("answers", client.answers);
    }
  })

  socket.on("name", name => {
    var client = clients[socket.id];
    client.name = name;
    dirty = true;
    if (name === "Sergej")
      socket.emit("you are admin");
  })

  socket.on("restore by id", id => {
    if (id) {
      var old = disconnectedClients[id];
      if (old) {
        old.socket = socket;
        clients[socket.id] = old;
        dirty = true;
      }
    }
  })

  socket.on("next question", () => {
    if (clients[socket.id].name === "Sergej") {
      nextQuestion();
    }
  });
})

setInterval(sendUpdateToAllSockets, 1000);


//////////////// Server setup
const PORT = process.env.PORT || 3001;

app.use(express.static(__dirname+'/../client'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../client/index.html');
});

httpServer.listen(PORT, () => console.log('listening on port ' + PORT));
