pipeline {
    agent any
    parameters {
        string(name: 'EC2_HOST', description: 'EC2 instance IP')
    }
    environment {
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
                    bat 'docker build -t nikhil0612/backend-rapid:latest .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    bat 'docker build -t nikhil0612/frontend-rapid:latest .'
                }
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                bat """
                    echo %DOCKERHUB_CREDS_PSW% | docker login -u %DOCKERHUB_CREDS_USR% --password-stdin
                    docker push nikhil0612/backend-rapid:latest
                    docker push nikhil0612/frontend-rapid:latest
                """
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ba493553-19b6-44dd-acc7-c0642a18648e',
                                                keyFileVariable: 'SSH_KEY',
                                                usernameVariable: 'SSH_USER')]) {
                    bat """
                        :: Use ssh with relaxed permissions check
                        ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o IdentitiesOnly=yes %SSH_USER%@${EC2_HOST} ^
                        "cd /home/ubuntu && docker-compose pull && docker-compose up -d"
                    """
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
