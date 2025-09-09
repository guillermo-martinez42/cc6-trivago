# Sistema de Reservas de Vuelos (CRS) - SkyReserva

## Descripción del Proyecto

Este es un **Sistema de Reservas de Vuelos (CRS)** completo desarrollado como una aplicación web frontend que simula la funcionalidad de plataformas como Google Flights. El sistema permite a los usuarios buscar vuelos, seleccionar asientos, procesar pagos y generar boletos electrónicos.

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos personalizados
- **Tailwind CSS**: Framework de CSS para diseño responsive y moderno
- **JavaScript ES6**: Lógica de aplicación y manipulación del DOM
- **jQuery 3.7.1**: Simplificación de manipulación DOM y eventos
- **Font Awesome 6.5.0**: Iconografía moderna
- **localStorage**: Persistencia de datos del lado del cliente

## Características Principales

### 🔍 Búsqueda de Vuelos
- Formulario intuitivo con validación en tiempo real
- Selección de origen, destino, fecha y número de pasajeros
- Filtros avanzados por precio, aerolínea, horario y duración
- Ordenamiento por precio, hora de salida y disponibilidad

### ✈️ Listado de Vuelos
- Visualización clara de información de vuelos
- Datos de múltiples aerolíneas (Guatemalense, American Airlines, Iberia, Copa)
- Información detallada: horarios, duración, precios, aeronaves
- Comparación entre vuelos
- Recomendaciones personalizadas

### 🪑 Selección de Asientos
- Mapa visual del avión (20 filas x 4 asientos: A, B, C, D)
- Estados de asientos: disponible, ocupado, seleccionado
- Selección rápida por preferencias (ventana, pasillo, adelante, juntos)
- Identificación de asientos desde 1A hasta 20D

### 👤 Sistema de Usuarios
- Registro de usuarios con validación
- Autenticación de login/logout
- Datos almacenados: email, contraseña, nombre, documento de viaje
- Persistencia de sesión con localStorage

### 💳 Procesamiento de Pagos
- Formulario de tarjeta de crédito con validación Luhn
- Simulación de autorización de pagos
- Validación de fondos disponibles
- Estados: APROBADO/DENEGADO
- Soporte para Visa, Mastercard, American Express

### 🎫 Confirmación y Boletos
- Generación automática de números de boleto
- Página de confirmación completa
- Descarga de boletos en formato texto
- Historial de reservas en localStorage

## Estructura del Proyecto

```
proyecto/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos personalizados
├── js/
│   ├── data.js            # Datos de muestra y funciones helper
│   ├── main.js            # Funcionalidad principal y autenticación
│   ├── flights.js         # Gestión de vuelos y búsquedas
│   ├── seats.js           # Selección de asientos
│   └── payment.js         # Procesamiento de pagos
├── assets/
│   └── images/            # Recursos gráficos
└── README.md              # Este archivo
```

## Datos de Muestra

### Aeropuertos Disponibles
- **GUA**: La Aurora, Guatemala City
- **MIA**: Miami International Airport
- **FLW**: Flores Airport, Guatemala
- **LAX**: Los Angeles International
- **JFK**: John F. Kennedy International
- **MAD**: Madrid-Barajas Airport
- **MEX**: Mexico City International
- **PTY**: Tocumen International, Panama

### Aerolíneas
- **GU**: Guatemalense Airlines
- **AA**: American Airlines
- **IB**: Iberia
- **CM**: Copa Airlines

### Tarjetas de Crédito de Prueba
- **1234567812345678** - JUAN PEREZ (Vence: 2024-12, CVV: 123)
- **9876543210987654** - MARIA GARCIA (Vence: 2025-11, CVV: 456)
- **5555444433332222** - CARLOS RODRIGUEZ (Vence: 2026-10, CVV: 789)
- **4444333322221111** - ANA MARTINEZ (Vence: 2025-03, CVV: 321)

## Instalación y Uso

1. **Clonar o descargar** los archivos del proyecto
2. **Abrir** `index.html` en un navegador web moderno
3. **Registrar** una cuenta de usuario o usar el sistema como invitado
4. **Buscar** vuelos especificando origen, destino y fecha
5. **Seleccionar** el vuelo deseado
6. **Elegir** asientos en el mapa del avión
7. **Procesar** el pago con una tarjeta de prueba
8. **Recibir** confirmación y descargar boleto

## Funcionalidades Avanzadas

### Filtros de Búsqueda
- Rango de precios
- Horario de salida preferido
- Duración máxima del vuelo
- Disponibilidad mínima de asientos
- Aerolíneas específicas

### Selección Inteligente de Asientos
- Selección automática por preferencias
- Validación de asientos adyacentes para grupos
- Información sobre tipo de asiento (ventana, pasillo)
- Visualización clara del estado de ocupación

### Sistema de Notificaciones
- Toasts informativos para acciones del usuario
- Validación en tiempo real de formularios
- Mensajes de error y confirmación
- Estados de carga visual

## Validaciones Implementadas

### Formularios
- Validación de emails
- Campos obligatorios
- Formatos de fecha (ISO 8601)
- Números de tarjeta (algoritmo de Luhn)
- Códigos de seguridad
- Fechas de vencimiento

### Reservas
- Disponibilidad de asientos
- Capacidad del vuelo
- Fondos suficientes en tarjeta
- Datos de usuario válidos

## Diseño Responsive

- **Mobile-first**: Optimizado para dispositivos móviles
- **Breakpoints**: Adaptación a tablets y escritorio
- **Flexbox y Grid**: Layouts modernos y flexibles
- **Componentes adaptativos**: Modales y formularios responsive

## Compatibilidad

- **Navegadores**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Dispositivos**: Móviles, tablets, escritorio
- **Resoluciones**: Desde 320px hasta 1920px+

## API Simulada

El sistema simula las siguientes llamadas API según las especificaciones del proyecto:

### Consulta de Vuelos
```
http://aerolinea/script_lista_vuelos?origen=GUA&destino=FLW&fecha=20250909&formato=JSON
```

### Lista de Asientos
```
http://aerolinea/script_lista_asientos?aerolinea=GU&vuelo=123&fecha=20250909&formato=JSON
```

### Reserva de Boleto
```
http://aerolinea/script_reserva?aerolinea=GU&vuelo=123&fecha=20250909&asiento=1A&nombre=JuanPerez&formato=JSON
```

### Autorización de Pago
```
http://emisor/autorizacion/?tarjeta=1234567812345678&nombre=JUANPEREZ&fecha_venc=202412&num_seguridad=123&monto=600&tienda=SKYRESERVA&formato=JSON
```

## Estándares Cumplidos

- **Códigos IATA**: Aeropuertos (3 caracteres) y aerolíneas (2 caracteres)
- **Formato ISO 8601**: Fechas (YYYY-MM-DD) y horas (HHMM)
- **Identificación de asientos**: 1A a 20D
- **Números de vuelo**: 3 dígitos
- **Tarjetas de crédito**: 16 dígitos sin guiones
- **Códigos de seguridad**: 3 dígitos

## Características de Seguridad

- **Validación del lado cliente**: Filtrado de entradas
- **Algoritmo de Luhn**: Validación de tarjetas de crédito
- **Encriptación simulada**: Manejo seguro de datos sensibles
- **Sesiones temporales**: Datos no persistentes en producción

## Futuras Mejoras

- Integración con APIs reales de aerolíneas
- Sistema de notificaciones por email
- Soporte para vuelos de conexión
- Programa de lealtad y millas
- Integración con mapas interactivos
- Soporte multiidioma completo
- Modo oscuro/claro
- PWA (Progressive Web App)

## Créditos

Desarrollado como proyecto académico para el curso de Ciencias de la Computación VI - Bases de Datos, Universidad Galileo.

**Autor**: [Tu Nombre]  
**Fecha**: Septiembre 2025  
**Versión**: 1.0.0

---

## Licencia

Este proyecto es únicamente para fines educativos y no debe utilizarse en producción sin las debidas modificaciones de seguridad y integración con sistemas reales.
