sudo docker image build -t lola-serve . -f Dockerfile

sudo docker-compose -f docker-compose.yml up --build -d