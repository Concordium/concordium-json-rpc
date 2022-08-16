// Expected parameters:
// - image_tag: Tag that will be used for the new image.
// - base_image: Base image that the image being built extends.
pipeline {
    agent any
    environment {
        image_repo = "concordium/json-rpc-proxy"
        image_name = "${image_repo}:${image_tag}"
    }
    stages {
        stage('dockerhub-login') {
            environment {
                // Defines 'CRED_USR' and 'CRED_PSW'
                // (see 'https://www.jenkins.io/doc/book/pipeline/jenkinsfile/#handling-credentials').
                CRED = credentials('jenkins-dockerhub')
            }
            steps {
                sh 'docker login --username "${CRED_USR}" --password "${CRED_PSW}"'
            }
        }
        stage('build-push') {
            steps {
                sh '''\
                    docker build \
                      --build-arg base_image="${base_image}" \
                      --label base_image="${base_image}" \
                      --tag="${image_name}" \
                      --pull \
                      .
                    docker push "${image_name}"
                '''.stripIndent()
            }
        }
    }
}
