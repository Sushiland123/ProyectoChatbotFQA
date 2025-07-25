@echo off
echo 🔍 VERIFICADOR DE FORMATO GOOGLE_PRIVATE_KEY
echo ==========================================
echo.

echo Este script te ayuda a verificar si tu GOOGLE_PRIVATE_KEY
echo está correctamente formateada para Railway.
echo.

echo 📋 Tu clave actual tiene este formato:
echo -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9Dfuolzr5bIby...
echo.

echo ✅ FORMATO CORRECTO para Railway:
echo.
echo En Railway dashboard, la variable debe estar EXACTAMENTE así:
echo.
echo -----BEGIN PRIVATE KEY-----
echo MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9Dfuolzr5bIby
echo jRBXw4NB+i7eMI4VHmIZsqccOWUTDgwcpDfXo5eX6T2LvTLTMe8VXooWY9NWS9Hh
echo i2QeNCqP0/bpMhGqBfaMvinzvH2ovwb2D7Ywh0Xa0hS/JD0cT0c9Ncd1j0M41RZ2
echo dMYAXT3Htx+lIvIPZcShg4J6s7fDy/8BtKtJrtmW7rQL5zz7al8zaG7bvyFVOpWE
echo cd+6y9fntIUXgUHiWQCHuMevq/4fQ0QmvVNsloSQi9J0+i1ewcVvaRSeOgz/JcQ4
echo QsC+84q76yetb5AiL27O6UDasdhtrcxtzvpHIftvvSKCpAtP75S8mB5Q3CrCl7iI
echo uKvUVFLVAgMBAAECggEAEVvS0yCLrDJAU84LBZvwleLEYedgbGT9SfHC8U79zlmY
echo WBrl+7lMJokmewm0vHqVwscK89JXqdFNZKG5YCKXE9y5C6FqyMtCX5roXDZe7VsY
echo 5wf7SQpqqhRnDkPkDpDi8CZbeZpdaD78kITZV1g4X3mbgLysMCi+fLwIA38z7NjK
echo Fnej5tu+yS1zE/L5VtWmLEEaQvW4KR9W4sb4L0gUagVgeKV4Jg4n3iWyC2jEQzPz
echo dhC2QBZSgvBJReMJyJyxkGc59pfC9/WHYOmAPr7vjHmfIFd42aMGM4RDNZeTMYWQ
echo bFef7dPAWDHq5hy7pjTJ5SHkUucD8Igc1u0FMqMzwwKBgQD27JnGJo13KFz+x6K+
echo jyBGJczSUCqkbfxGkHqz0gs/cfcawoz6g0nQtV6y7PhyOe8mF+ZhCBZqsTvQp1m4
echo 8cmXSbWUmwrOHi8WC0eZOVbf0btQ7HutzVqoI5tRBHTzikSk+Yt3CSyxrFg7L7UT
echo r6AYqh7J4dG8GN90xhoYyK/qXwKBgQDEAN3JyEu1TuLeUxdoX3EsQ+bY7ojutiDD
echo Ib9bdgvYVVTTIm/65mVGZh7wUYDp2jdEPT8I/cHIWYDhJPmIHdHn3OCO7moJb5Z0
echo uXY5MBf8biAddgfvTV7KhHxiPXSR9/2LhK7g7D9Y9AfLkEuoDYqM/Heb1Da/QgUf
echo k3z7VPf3SwKBgQCfG0PW136uOjb6AL9QFL+SE8dP+VIQ08IL4gr+laijwBaeip/2
echo x+QndMbJekJ4r/X2UM4k1eZD52IIh90be8kPD/LOB71FpVNn2+rNw5HD9MvDUC49
echo hqYU06S/5qRJTV4AA8Am+qVu8wODV7FRNwhs/CmMolLX5hsOjpvAPoiD9wKBgAk9
echo BTcqkq70DetuvS61OO9eL/ZPn/KocPjhkVRtRvemZf4hpGeODn33+ENZhBsBpxM3
echo U85Hr6eS2GlEReKtjSRBm/AAuszBDrVnvHPLmYXTZv4cfxk/a1VeU0KKJQFwT+oQ
echo kfGWERJPRkLJBVfhc4NbrwOQSBhRs04etIhgI+PrAoGAI6ZQInCBsC/lGU/rltfS
echo fOmOLqbbOBcT/iGjI+8uHFGsKG9nRzCwTJRzFeYnaB6yg/wNYQPE5CQ0W4fNyiMe
echo NAIQbKIh4NCwDa+CTffiYvykwS4hE+si36YKCojqJARl65+pcIN9wPg0G2I21HIj
echo /zFIzT6CByeaRp38KMQ1lZM=
echo -----END PRIVATE KEY-----
echo.
echo ⚠️ IMPORTANTE:
echo 1. NO debe tener \n en el texto
echo 2. Debe tener saltos de línea REALES
echo 3. Copiar EXACTAMENTE desde el archivo JSON
echo.
echo 💡 PASOS PARA CORREGIR:
echo 1. Ve a Railway Dashboard: https://railway.app/dashboard
echo 2. Encuentra tu proyecto chatbot-bot
echo 3. Ve a Variables
echo 4. Edita GOOGLE_PRIVATE_KEY
echo 5. Copia el contenido COMPLETO desde tu archivo .json
echo 6. Redeploy el servicio
echo.
pause
