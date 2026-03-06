#!/bin/bash

# Script pour générer des certificats SSL auto-signés

SSL_DIR="./nginx/ssl"
DOMAIN="localhost"
DAYS=365

mkdir -p "$SSL_DIR"

# Générer une clé privée et un certificat auto-signé
openssl req -x509 -nodes -days $DAYS -newkey rsa:2048 \
    -keyout "$SSL_DIR/nginx-selfsigned.key" \
    -out "$SSL_DIR/nginx-selfsigned.crt" \
    -subj "/C=FR/ST=France/L=Paris/O=Transcendence/OU=Dev/CN=$DOMAIN" \
    -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"

# Générer les paramètres Diffie-Hellman (optionnel mais recommandé)
openssl dhparam -out "$SSL_DIR/dhparam.pem" 2048

echo "✅ Certificats SSL générés dans $SSL_DIR/"
echo "⚠️  ATTENTION: Ce sont des certificats auto-signés pour le développement uniquement!"
