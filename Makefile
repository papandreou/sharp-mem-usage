tests:
	docker-compose rm -f
	docker-compose build
	docker-compose run --rm test
