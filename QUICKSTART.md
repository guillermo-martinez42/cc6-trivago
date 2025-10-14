# 🚀 Guía Rápida de Inicio

## Inicio Rápido en 5 Pasos

### 1️⃣ Activar Entorno Virtual (si ya está creado)

```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate
```

### 2️⃣ Verificar que PostgreSQL esté Corriendo

- Abrir pgAdmin o servicios de Windows
- Verificar que el servicio PostgreSQL esté activo

### 3️⃣ Verificar el archivo `.env`

Debe existir un archivo `.env` con:

```env
DB_HOST=localhost
DB_NAME=flight_reservation
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_PORT=5432
```

### 4️⃣ Iniciar el Servidor

```bash
python app.py
```

Deberías ver:
```
* Running on http://127.0.0.1:5000
* Debugger is active!
```

### 5️⃣ Abrir en el Navegador

```
http://localhost:5000
```

## ✅ Verificación Rápida

### Probar Registro
1. Click en "Registrarse"
2. Llenar formulario
3. Deberías ver mensaje de éxito

### Probar Login
1. Click en "Iniciar Sesión"
2. Usar credenciales del paso anterior
3. Deberías ver "Bienvenido, [Nombre]"

### Probar Búsqueda
1. Origen: **GUA**
2. Destino: **MIA**
3. Fecha: Cualquier fecha futura
4. Click "Buscar Vuelos"
5. Deberían aparecer 2 vuelos

### Probar Reserva Completa
1. Click "Seleccionar" en un vuelo
2. Seleccionar un asiento verde
3. Click "Continuar con el pago"
4. Datos de tarjeta:
   - Número: **1234 5678 1234 5678**
   - Titular: **JUAN PEREZ**
   - Vencimiento: **2024-12**
   - CVV: **123**
5. Click "Pagar Ahora"
6. Deberías ver confirmación con número de boleto

## 🔧 Solución Rápida de Problemas

### No inicia el servidor
```bash
# Reinstalar dependencias
pip install flask flask-bcrypt python-dotenv psycopg2-binary
```

### Error de base de datos
```sql
-- En PostgreSQL/pgAdmin
CREATE DATABASE flight_reservation;
```

### Puerto 5000 ocupado
```python
# En app.py, cambiar la última línea a:
app.run(debug=True, port=5001)
```

### Página en blanco
- Presionar F12 en el navegador
- Ver la consola para errores
- Verificar que los archivos JS/CSS estén cargando

## 📁 Archivos Importantes

```
pj1/
├── app.py          ← Iniciar con: python app.py
├── .env            ← Verificar credenciales de DB
├── index.html      ← Página principal
├── js/
│   ├── main.js     ← Autenticación
│   ├── seats.js    ← Selección de asientos
│   └── payment.js  ← Procesamiento de pagos
```

## 🎯 Datos de Prueba Rápidos

| Elemento | Valor |
|----------|-------|
| Tarjeta | 1234567812345678 |
| CVV | 123 |
| Vencimiento | 2024-12 |
| Origen | GUA |
| Destino | MIA |

## 📚 Más Información

- **Instalación Completa**: Ver `SETUP.md`
- **Cambios Realizados**: Ver `CHANGES_SUMMARY.md`
- **Documentación API**: Ver `README.md`

## 🆘 Ayuda

Si algo no funciona:

1. **Revisar la consola del navegador** (F12)
2. **Revisar la terminal** donde corre Flask
3. **Verificar PostgreSQL** está activo
4. **Verificar .env** tiene las credenciales correctas

---

**¡Listo para usar!** 🎉

