node {

    stage('pull changes') {
        git 'https://github.com/ottmartens/mentor-client'
    }
    
    stage('build Docker image') {
        sh 'docker build -t mentor-client .'
    }

    stage('push image to local registry') {
        sh 'docker tag mentor-client localhost:5000/mentor-client-local'
        sh 'docker push localhost:5000/mentor-client-local'
    }

    stage('remove old local images') {
        sh 'docker image remove mentor-client'
        sh 'docker image remove localhost:5000/mentor-client-local'
    }
    
    stage('deploy & reload service') {          
        sh 'docker stack deploy -c docker-compose.yml mentor'
    }
}