# Sistema de Reservas de Vuelos - TRIVAGO

Sistema completo de reserva de boletos aéreos con frontend web y backend API REST.

## Características

- ✈️ Búsqueda de vuelos por origen, destino y fecha
- 💺 Selección visual de asientos
- 💳 Procesamiento de pagos con tarjeta de crédito
- 🎫 Generación y descarga de boletos electrónicos en PDF
- 👤 Sistema de autenticación de usuarios
- 📱 Interfaz responsive y moderna

## Tecnologías Utilizadas

### Backend
- **Flask**: Framework web de Python
- **Flask-Bcrypt**: Encriptación de contraseñas
- **psycopg2**: Adaptador de PostgreSQL para Python
- **python-dotenv**: Gestión de variables de entorno

### Frontend
- **HTML5**: Estructura de la aplicación
- **Tailwind CSS**: Framework de estilos
- **jQuery**: Manipulación del DOM y AJAX
- **Font Awesome**: Iconos
- **jsPDF**: Generación de documentos PDF
- **QRCode.js**: Creación de códigos QR

## Cómo Empezar

Para una guía detallada de instalación y configuración, por favor consulte el archivo `QUICKSTART.md`.

## Uso

### Iniciar el servidor

```bash
# Asegúrese de que su entorno virtual esté activado
python app.py
```

El servidor estará disponible en `http://localhost:5000`.

### Acceder a la aplicación

Abra un navegador y visite `http://localhost:5000`.

## API Endpoints

A continuación se detallan los endpoints principales de la API:

### Autenticación
- `POST /api/register`: Registrar un nuevo usuario.
- `POST /api/login`: Autenticar un usuario y obtener sus datos.

### Vuelos y Asientos
- `GET /api/flights`: Buscar vuelos disponibles.
- `GET /api/seats`: Obtener los asientos disponibles para un vuelo específico.

### Reservas y Pagos
- `GET /api/reserva`: Crear una nueva reserva y generar un boleto.
- `GET /api/autorizacion`: Simular la autorización de un pago con tarjeta de crédito.

### Bookings de Usuario
- `GET /api/users/<id>/bookings`: Obtener todos los boletos comprados por un usuario.
