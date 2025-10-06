pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('docker-hub creds')
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
                    docker push nikhil0612/backend-rapid:latest
                    docker push nikhil0612/frontend-rapid:latest
                '''
            }
        }

        stage('Deploy on EC2') {
            steps {
                sh '''
                    cd /home/ubuntu
                    docker-compose pull
                    docker-compose up -d
                '''
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
