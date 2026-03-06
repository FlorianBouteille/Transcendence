# Configuration HTTPS pour Transcendence

## 🔒 Certificats SSL

Ce projet utilise HTTPS avec des certificats auto-signés pour le développement local.

### Génération des certificats

Les certificats sont générés automatiquement lors du premier lancement via le script :

```bash
./nginx/generate-ssl.sh
```

### Accès à l'application

- **HTTPS** : https://localhost:8443
- **HTTP** : http://localhost:8080 (redirige automatiquement vers HTTPS)

### ⚠️ Avertissement du navigateur

Les certificats étant auto-signés, votre navigateur affichera un avertissement de sécurité. C'est normal pour le développement local.

**Pour accepter le certificat :**

#### Chrome/Edge
1. Cliquez sur "Avancé"
2. Cliquez sur "Continuer vers localhost (dangereux)"

#### Firefox
1. Cliquez sur "Avancé"
2. Cliquez sur "Accepter le risque et continuer"

#### Safari
1. Cliquez sur "Afficher les détails"
2. Cliquez sur "Visiter ce site web"

### 🔧 Configuration

Les ports peuvent être personnalisés dans le fichier `.env` :

```bash
NGINX_PORT=8080        # Port HTTP
NGINX_SSL_PORT=8443    # Port HTTPS
```

### 🚀 Production

**IMPORTANT** : Pour la production, utilisez des certificats valides :

- **Let's Encrypt** (gratuit) : https://letsencrypt.org/
- **Certbot** : https://certbot.eff.org/

Remplacez les certificats dans `nginx/ssl/` par vos certificats de production et modifiez les chemins dans `nginx/nginx.conf` si nécessaire.

### 📝 Fichiers SSL

- `nginx/ssl/nginx-selfsigned.crt` - Certificat SSL
- `nginx/ssl/nginx-selfsigned.key` - Clé privée SSL
- `nginx/ssl/dhparam.pem` - Paramètres Diffie-Hellman

**Note** : Ces fichiers sont exclus du versioning Git pour des raisons de sécurité (.gitignore).
