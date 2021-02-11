import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
var cors = require('cors');
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer);

const rawQuestions = [
  'Hast du schon mehr als 2 andrena Standorte gesehen?',
  'Hast du seit Mai 2020 mehr als 5 ganze Tage im Büro gearbeitet?',
  'Hast du schon mal ein Meeting auf laut gestellt und was anderes gemacht?',
  'Hast du schon mal mehr als 50% eines Arbeitstages vom Sofa aus gearbeitet?',
  'Trägst du im Allgemeinen im Home Office eine Jogginghose (oder vergleichbares)?',
  'Hast du schon mal in Schlafkleidung gearbeitet?',
  'Duschst du im Home Office seltener als vorher?',
  'Bist du schon mal einem Meeting auf dem Klo gefolgt?',
];
const TOTAL_ROUNDS = rawQuestions.length;

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

  isAnsweredAndEstimated(){
    return (this.answer === "yes" || this.answer === "no") && (typeof this.estimate !== 'undefined' && this.estimate >= 0 && this.estimate <= 100);
  }
}

const BUCKET_COUNT = 20;
class Statistics {
  id: number;
  yesAnswers = 0;
  noAnswers = 0;
  percentage = 50;
  estimates: number[] = Array.from({length: BUCKET_COUNT}, (x,i) => 0);

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

  addEstimate(estimate: number) {
    if (estimate >= 0 && estimate <= 100) {
      let bucket = Math.trunc(estimate / 100 * BUCKET_COUNT);
      if (bucket === BUCKET_COUNT)
        bucket = BUCKET_COUNT-1; // put the single value of 100% in the last category e.g. for buckets of 10: 90 <= e < 100;
      this.estimates[bucket]++;
    }
  }

  updatePercentage(){
    var total = this.yesAnswers + this.noAnswers;
    if (total > 0)
      this.percentage = Math.round(this.yesAnswers / total * 100);
  }
}

class Player {
  socket: Socket;
  answers: Answer[];
  statistics: Statistics[];
  score: number = 0;
  scoredEstimates: number = 0;
  name: string;
  constructor(socket: Socket) {
    this.socket = socket;
    this.answers = Array.from({length: TOTAL_ROUNDS}, (x,i) => new Answer(i));
    this.statistics = new Array(questions.length);
    this.name = socket.id;
  }

  isAdmin(): boolean {
    return this.name === "Sergej";
  }
}

const questions: Question[] = [];
const statistics: Statistics[] = [];

var currentRoundIndex = -1;
var dirty = true;
var players = {};
var disconnectedPlayers = {};

function nextQuestion(){
  if (currentRoundIndex < TOTAL_ROUNDS) {
    if (currentRoundIndex >= 0)
      finalizeCurrentQuestion();
    currentRoundIndex++;
    console.log("switching to question "+currentRoundIndex);
  }
  if (currentRoundIndex < TOTAL_ROUNDS) {
    questions.push(new Question(currentRoundIndex, rawQuestions[currentRoundIndex]));
    statistics.push(new Statistics(currentRoundIndex));
  }
  dirty = true;
  sendUpdateToAllSockets();
}

function finalizeCurrentQuestion(){
  questions[currentRoundIndex].isActive = false;
  Object.values(players).forEach(finalizeCurrentQuestionForPlayer);
}

function finalizeCurrentQuestionForPlayer(player: Player) {
  computeScore(player);
  if (player.statistics.length != statistics.length)
    player.statistics = statistics.slice();
}

function computeDifference(player: Player, questionIndex: number) {
  var realValue = statistics[questionIndex].percentage;
  var estimate = player.answers[questionIndex].estimate;
  if (!estimate && estimate !== 0) {
    estimate = (realValue < 50)? 100: 0;
  }
  return  Math.abs(realValue - estimate);
}

function computeScore(player: Player) {
  player.scoredEstimates++;
  player.score += computeDifference(player, currentRoundIndex);
}

function sendUpdateToAllSockets() {
  if (dirty) {
    dirty = false;
    io.emit("questions", questions);
    Object.values(players).forEach(sendUpdatesToSocket);
    io.emit("scores", computeCurrentScores());
  }
}

function sendUpdatesToSocket(player: Player) {
  player.socket.emit("statistics", player.statistics);
}

function computeCurrentScores(){
  var scores = Object.values(players).map((player: Player) => {return {playerName: player.name, score: player.score, id: player.socket.id}})
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
    console.log("Illegal answer id received: " + id + " but current id is " + currentRoundIndex);
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
    console.log("Illegal answer id received: " + id + " but current id is " + currentRoundIndex);
    return false;
  }

  return true;
}

function isAdmin(player: Player) {
  return player.name === "Sergej";
}

io.on("connection", (socket: Socket) => {
  console.log("client connected " + socket.id);
  var player = new Player(socket);
  players[socket.id] = player;
  socket.emit("questions", questions);

  if (player.scoredEstimates < currentRoundIndex) {
    var score = 0;
    for(var i=0; i < currentRoundIndex; i++) {
      score += computeDifference(player, i);
    }
    player.scoredEstimates = currentRoundIndex+1;
    player.score = score;
  }
  player.statistics = statistics.slice(0, currentRoundIndex);
  dirty=true;

  socket.on("disconnect", _reason => {
    disconnectedPlayers[socket.id] = players[socket.id];
    delete players[socket.id];
    console.log("player dicsonnected "+socket.id);
  })

  socket.on("answer", a => {
    if (isAnswerValid(a)) {
      var player = players[socket.id];
      player.answers[a.id].answer =  a.answer;
      statistics[a.id].addAnswer(a.answer);
      if (player.answers[a.id].isAnsweredAndEstimated()) {
        player.statistics[a.id] = statistics[a.id];
      }
      dirty = true;
      socket.emit("answers", player.answers);
      sendUpdatesToSocket(player);
    }
  })

  socket.on("estimate", a => {
    if (isEstimateValid(a)) {
      var player = players[socket.id];
      player.answers[a.id].estimate =  a.estimate;

      if (player.answers[a.id].isAnsweredAndEstimated()) {
        player.statistics[a.id] = statistics[a.id];
        statistics[a.id].addEstimate(a.estimate);
      }
      dirty = true;
      socket.emit("answers", player.answers);
      sendUpdatesToSocket(player);
    }
  })

  socket.on("name", name => {
    var player = players[socket.id];
    player.name = name;
    dirty = true;
    if (isAdmin(player))
      socket.emit("you are admin");
  })

  socket.on("restore player by id", id => {
    if (id) {
      var old: Player = disconnectedPlayers[id];
      if (old) {
        console.log("restoring old player "+old.name);
        old.socket = socket;
        players[socket.id] = old;
        dirty = true;
        sendUpdatesToSocket(players[socket.id]);
        if (isAdmin(players[socket.id]))
          socket.emit("you are admin");
      } else {
        socket.emit("restore player not possible")
      }
    }
  })

  socket.on("next question", () => {
    if (players[socket.id].isAdmin()) {
      nextQuestion();
    }
  });
})

setInterval(sendUpdateToAllSockets, 1000);


//////////////// Server setup
const PORT = process.env.PORT || 3001;

app.use(express.static(__dirname+'/client'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

httpServer.listen(PORT, () => console.log('listening on port ' + PORT));
