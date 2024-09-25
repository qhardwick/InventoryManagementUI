pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('54321')
        FRONTEND_EC2_IP = '52.90.145.230'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/qhardwick/InventoryManagementUI.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("tylercausey/react-frontend:latest")
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
                        dockerImage.push('latest')
                    }
                }
            }
        }
        stage('Deploy to Frontend EC2') {
            steps {
                sshagent(['11111']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ec2-user@${FRONTEND_EC2_IP} 'docker pull tylercausey/react-frontend:latest && docker stop frontend-container && docker rm frontend-container && docker run -d --name frontend-container -p 80:5173 tylercausey/react-frontend:latest'
                    """
                }
            }
        }
    }
}
