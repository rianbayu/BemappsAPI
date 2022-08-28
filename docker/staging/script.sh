
docker build -t asia-southeast1-docker.pkg.dev/luriz-micro-staging/image/luriz-sso-user:1.0.0 -f docker/staging/Dockerfile .

docker push asia-southeast1-docker.pkg.dev/luriz-micro-staging/image/luriz-sso-user:1.0.0

kubectl apply -n luriz-dev-namespace  -f docker/staging/luriz-sso-user.yaml
