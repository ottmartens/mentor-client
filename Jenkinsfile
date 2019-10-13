node {

    stage('pull changes') {
        git 'https://github.com/ottmartens/mentor-client'
    }
        
    stage('tests') {
        echo 'no tests configured!'
    }
    
    stage('build Docker image') {
        sh 'docker build -t mentor-client .'
    }

    stage('push image to local registry') {
        sh 'docker tag mentor-server localhost:5000/mentor-client-local'
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