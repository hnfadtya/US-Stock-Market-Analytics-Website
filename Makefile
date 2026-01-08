build:
	docker-compose up --build

up:
	docker-compose up -d

down:
	docker-compose down

logs-fe:
	docker-compose logs -f frontend

logs-be:
	docker-compose logs -f backend

clean:
	docker-compose down -v
	docker-compose up --build