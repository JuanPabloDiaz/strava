# 🔐 Autenticación con Strava OAuth2 — Guía para Desarrolladores

Esta guía explica paso a paso cómo autenticar usuarios con la API de Strava, obtener tokens, y acceder a sus actividades deportivas. Está pensada para reutilizar este proceso con múltiples cuentas de Strava.

---

## 1. 📋 Configurar tu Aplicación en Strava

1. Ve a: [https://www.strava.com/settings/api](https://www.strava.com/settings/api)
2. Crea una nueva aplicación o edita una existente.
3. Copia los siguientes datos:
   - `Client ID`
   - `Client Secret`
4. En **Authorization Callback Domain**, escribe solo el dominio base:

localhost

_⚠️ Sin `http://`, ni puerto, ni rutas._

---

## 2. 🔗 Crear el Enlace de Autorización

Arma una URL como esta:

https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:4321/exchange_token&approval_prompt=force&scope=activity:read_all

Reemplaza:

- `YOUR_CLIENT_ID`: tu ID de cliente (ej: `162278`)
- `redirect_uri`: la URL que recibiría el `code`. Puede ser algo local como `http://localhost:4321/exchange_token`.

---

## 3. ✅ Autorizar al Usuario

1. Abre el enlace anterior en el navegador.
2. El usuario autoriza tu aplicación.
3. Serás redirigido a una URL como:

http://localhost:4321/exchange_token?code=abc123…

4. Copia el valor del parámetro `code`.

---

## 4. 🔁 Intercambiar el Código por Tokens

Haz un `POST` a la API de Strava para obtener un `access_token` y `refresh_token`.

### Usando `curl`:

```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=AUTH_CODE \
  -d grant_type=authorization_code
```

Respuesta esperada:

```bash
{
"access_token": "string",
"refresh_token": "string",
"expires_at": 1716240000,
...
}
```

⸻

## 5. 💾 Guardar el refresh_token

En un archivo .env o equivalente:

```bash
# .env
STRAVA_REFRESH_TOKEN=your_refresh_token
```

Este token te permite renovar el access_token automáticamente más adelante.

⸻

## 6. 🔄 Renovar el Access Token (cuando expire)

Cada access_token dura ~6 horas. Usa el refresh_token así:

```bash
curl -X POST https://www.strava.com/oauth/token \
 -d client_id=YOUR_CLIENT_ID \
 -d client_secret=YOUR_CLIENT_SECRET \
 -d grant_type=refresh_token \
 -d refresh_token=YOUR_REFRESH_TOKEN
```

La respuesta incluirá un nuevo access_token y posiblemente un nuevo refresh_token.

⸻

## 7. ℹ️ Notas Finales

- Usa scope=activity:read_all para ver las actividades de entrenamiento.
- Cambia el redirect_uri cuando pases a producción (debe coincidir con el dominio registrado).
- Puedes repetir este proceso con diferentes cuentas Strava para obtener tokens de cada usuario.
- El parámetro approval_prompt=force fuerza que Strava siempre muestre la pantalla de autorización (útil para pruebas).

⸻

## 📁 Recursos útiles

- Strava Developer Docs: https://developers.strava.com/
- OAuth Playground: https://developers.strava.com/playground/
- Scopes disponibles: [read, read_all, profile:read_all, activity:read_all, etc.]

⸻

©️ Adaptado por Juan Pablo Díaz — jpdiaz.dev
