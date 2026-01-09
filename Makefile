build:
	docker-compose up --build

up:
	docker-compose up -d

down:
	docker-compose down

rebuild-fe:
	docker-compose build --no-cache frontend

logs-fe:
	docker-compose logs -f frontend

logs-be:
	docker-compose logs -f backend

clean:
	docker-compose down -v
	docker-compose up --build