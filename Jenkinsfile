pipeline {
    agent any

    environment {
        EC2_HOST = '13.203.221.175'
        DOCKERHUB_CREDS = credentials('44d64fbd-fc4d-48de-b4b5-e14791ef332d')
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/CATEPX/RAPID.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t nikhil0612/backend-rapid:latest .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t nikhil0612/frontend-rapid:latest .'
                }
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                sh '''
                    echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
                    docker push nikhil0612/backend:latest
                    docker push nikhil0612/frontend:latest
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ba493553-19b6-44dd-acc7-c0642a18648e']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                            cd /home/ubuntu &&
                            docker-compose pull &&
                            docker-compose up -d
                        '
                    '''
                }
            }
        }

    }

    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check logs."
        }
    }
}
