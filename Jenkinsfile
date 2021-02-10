pipeline {

  agent any

  triggers {
    cron(env.BRANCH_NAME == 'master' ? 'H 23 * * *' : '')
    pollSCM('H/2 * * * *')
  }

  options {
    buildDiscarder(logRotator(artifactNumToKeepStr: '10'))
    skipStagesAfterUnstable()
    disableConcurrentBuilds()
  }

  stages {
    stage('Build Docker Image') {
        steps {
            sh "npm postinstall"
            sh "docker build -t 80.86.165.30:5000/privacy:prod --target prod ."
        }
    }

    stage('Push Docker Image') {
        steps {
            sh 'docker push 80.86.165.30:5000/privacy:prod'
        }
    }

    stage('Deploy Prod') {
      steps {
        script{
          withEnv(['SUBDOMAIN=privacy', "BUILD=${currentBuild.number}"]){
            withDockerServer([credentialsId: 'docker.apps.andrena.de', uri: 'tcp://80.86.165.30:2376']) {
              sh 'docker stack deploy --prune --resolve-image always -c docker-compose.yml privacy'
            }
          }
        }
      }
    }
  }
}
