pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['qa', 'preprod', 'prod', 'bu'], description: 'Target Test Environment')
        choice(name: 'TEST_TYPE', choices: ['smoke', 'regression', 'ui', 'api', 'all'], description: 'Type of tests to run')
    }

    tools {
        // Node.js tool must be configured in Jenkins Global Tool Configuration with name 'node'
        nodejs 'node'
    }

    environment {
        ENV = "${params.ENV}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm packages...'
                bat 'npm ci'
                echo 'Installing Playwright browsers...'
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Execute Tests') {
            steps {
                echo "Running ${params.TEST_TYPE} tests in ${params.ENV} environment..."
                script {
                    if (params.TEST_TYPE == 'all') {
                        bat 'npm run test'
                    } else {
                        bat "npm run test:${params.TEST_TYPE}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Archiving test results...'
            
            // Archive screenshots, videos, and trace zip files
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
            
            // Publish Playwright HTML Report (Requires HTML Publisher Plugin)
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
            
            // Generate and Publish Allure Report (Requires Allure Jenkins Plugin)
            script {
                try {
                    bat 'npm run allure:generate'
                    allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
                } catch (Exception e) {
                    echo "Could not compile Allure report in Jenkins: ${e.message}"
                }
            }
        }
    }
}
