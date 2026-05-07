#docker remove image and container
docker rm -f express_app vue_app
docker rmi my-backend:1.0 my_frontend:1.0

#docker build and run
docker-compose up --build
