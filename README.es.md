# 📈 App Invest: Simulador Financiero

![Dashboard Preview](./public/dashboard.png)

Simulador de inversiones de alto rendimiento optimizado con **React 19**, **React Server Components (RSC)** y **Waku**.

![React 19.2](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![Waku](https://img.shields.io/badge/Waku-1.0.0--alpha.3-orange?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)

🔗 **Demo en vivo**: [invest-simulator-rho.vercel.app](https://invest-simulator-rho.vercel.app)

## 🚀 Características Principales

- **Streaming SSR & RSC**: Renderizado instantáneo del "shell" y carga paralela de datos mediante React 19, Waku y Skeletons.
- **Eficiencia de Servidor**: Lógica de negocio, gráficos y mutaciones ejecutados íntegramente en el servidor (RSC/Server Actions).
- **Alto Rendimiento**: Paralelismo de datos y React Compiler para una experiencia fluida sin tiempos de carga perceptibles.
- **Zero-Client Fetching**: Eliminación de `useEffect`. Los datos se obtienen en Server Actions (con caché interna) y se pasan como promesas a los hijos, que las consumen con `use()` mostrando Skeletons automáticamente.
- **Persistencia Moderna**: Base de datos Turso (LibSQL) y Drizzle ORM optimizados para la nube con inicialización rápida.

## 🛠️ Stack Tecnológico

- **React 19**: Uso de `useActionState`, `useOptimistic`, `use()` y Server Components.
- **React Compiler**: Optimización automática de componentes.
- **Waku**: Framework minimalista para RSC y Streaming SSR nativo.
- **Drizzle ORM & @libsql/client/web**: Gestión type-safe de la DB con cliente web multiplataforma.
- **Turso**: Base de datos SQLite distribuida en la nube.
- **Yahoo Finance**: Fuente de datos con sistema de gestión de peticiones inteligente para garantizar la estabilidad y evitar bloqueos.
- **Lucide React**: Iconografía financiera optimizada.

## 🗄️ Sistema de Persistencia Dual

La aplicación utiliza un sistema inteligente que conmuta automáticamente entre dos tipos de base de datos **LibSQL**:

1.  **Local (Desarrollo)**: Utiliza un archivo SQLite local (`invest.db`). Ideal para desarrollo rápido sin dependencias externas. Se crea automáticamente al arrancar.
2.  **Vercel / Cloud (Turso)**: Ya que Vercel no tiene disco persistente, en producción se conecta a **Turso**. La app detecta las variables de entorno y cambia al cliente web compatible de forma transparente.

### Configuración en Vercel
Para que funcione en la nube, añade estas variables en el panel de Vercel:
- `DATABASE_URL`: Tu endpoint de Turso (`libsql://...`)
- `DATABASE_AUTH_TOKEN`: Tu token de acceso.

## � Estructura del Proyecto

```text
src/
├── components/     # Componentes UI (Layout, Modales, Shared)
├── data/           # Configuración de activos y semillas
├── db/             # Esquema y conexión a Base de Datos (SQLite/Drizzle)
├── hooks/          # Hooks de sincronización (Optimistic UI)
├── models/         # Interfaces de datos financieras
├── pages/          # Enrutamiento basado en archivos (Waku)
├── server-actions/ # Lógica de negocio y mutaciones en DB
└── utils/          # Formateadores y utilidades
```

## 📋 Modelo de Datos (Interfaces)

| Interfaz | Descripción |
|----------|-------------|
| `IAsset` | Representación de un activo financiero y su histórico. |
| `ITransaction` | Auditoría completa de movimientos (compra, venta, depósitos). |
| `IPortfolio` | Estado consolidado de la cartera y balance. |
| `ITrade` | Parámetros para la ejecución de órdenes de mercado. |

## �📦 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Modo desarrollo (Puerto 3005)
# Generará automáticamente invest.db si no existe
npm run dev

# Producción
npm run build && npm run start
```

### Scripts de Lanzamiento
- `launch-dev.sh`: Script para Linux (Chrome App Mode + Auto-install).
- `launch-dev.bat`: Script para Windows (CMD + Auto-install).

## ⚠️ Nota Legal
Este proyecto es un **simulador educativo**. Utiliza dinero ficticio y datos de mercado reales con fines puramente informativos. Las operaciones no tienen impacto en mercados financieros reales.

---

Construido con ❤️ usando **Waku** y **React 19** 🚀
