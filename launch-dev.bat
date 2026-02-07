@echo off
:: Comprobar si node_modules existe, si no, instalar dependencias
if not exist node_modules (
    echo node_modules no encontrado. Instalando dependencias...
    call npm install
)

:: Iniciar el servidor de desarrollo y abrir el navegador
start /B npm run dev
timeout /t 3 /nobreak > nul
start http://localhost:3005
