
SHELL := /usr/bin/env bash

# Path of compose file
COMPOSE_FILE = docker-compose.yml

# File to avoid relink
COMPOSE_TMP = .compose.tmp

# Docker compose command with flags
DOCKER_COMPOSE = docker compose -f $(COMPOSE_FILE)

RM = rm -rf

all : up

up: $(COMPOSE_TMP) logs

$(COMPOSE_TMP) : $(COMPOSE_FILE)
	$(DOCKER_COMPOSE) up -d --build
	@ touch $(COMPOSE_TMP)

start:
	$(DOCKER_COMPOSE) start

stop:
	$(DOCKER_COMPOSE) stop

# Removes containers, orphan images and anonymous volumes
down:
	$(DOCKER_COMPOSE) down
	@ docker image prune -f
	@ docker volume prune -f
	@ $(RM) $(COMPOSE_TMP)

logs:
	$(DOCKER_COMPOSE) logs -f

ps:
	docker ps

# Removes containers, images and temporary volumes
clean: down
	$(DOCKER_COMPOSE) down --rmi local

# Remove containers, images and volumes
fclean: clean
	$(DOCKER_COMPOSE) down -v

# clean, build and start
re: clean up

# full clean, build and start
ref: fclean up

.PHONY : all up start stop down logs ps clean fclean re ref
