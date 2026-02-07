#!/bin/bash
cd "$(dirname "$0")"

# Comprobar si node_modules existe, si no, instalar dependencias
if [ ! -d "node_modules" ]; then
    echo "node_modules no encontrado. Instalando dependencias..."
    npm install
fi

# Matar proceso previo si existe
fuser -k 3005/tcp || true

# Lanzar servidor en background, silenciando output para no llenar logs
# Usamos nohup para que sobreviva si la terminal se cierra, aunque desde .desktop no hay terminal
nohup npm run dev > /dev/null 2>&1 &

# Esperar a que el servidor arranque (Waku suele ser rápido)
sleep 3

# Abrir Chrome en modo aplicación (sin barras de navegación)
google-chrome --app=http://localhost:3005
