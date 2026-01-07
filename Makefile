build:
	docker-compose up --build

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker-compose up --build