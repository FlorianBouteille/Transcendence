NAME = transcendence


#chemin
COMPOSE_FILE = docker-compose.yml

DOCKER_COMPOSE = docker compose -f $(COMPOSE_FILE)

# -------------------------
# Règles principales
# -------------------------

all: up

up:
	$(DOCKER_COMPOSE) up --build -d

down:
	$(DOCKER_COMPOSE) down

re: down all

# -------------------------
# Règles utilitaires
# -------------------------

logs:
	$(DOCKER_COMPOSE) logs -f

ps:
	docker ps


