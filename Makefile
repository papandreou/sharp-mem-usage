tests:
	docker-compose rm -f
	docker-compose build
	docker-compose run --rm -e CACHE_MEM=0 test
	docker-compose run --rm -e CACHE_MEM=5 test
	docker-compose run --rm -e CACHE_MEM=6 test
	docker-compose run --rm -e CACHE_MEM=7 test
	docker-compose run --rm -e CACHE_MEM=10 test
	docker-compose run --rm -e CACHE_MEM=20 test
