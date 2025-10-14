import os
import psycopg2
import psycopg2.extras
import uuid
from flask import Flask, jsonify, request, send_from_directory
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, static_folder='.', static_url_path='')
bcrypt = Bcrypt(app)

# Enable CORS for all routes
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# --- MOCK DATA FOR EXTERNAL APIs ---
mock_flights_response = {
    "lista_vuelos": { "aerolinea": "AA", "fecha": "20251115", "origen": "GUA", "destino": "MIA", "vuelos": [ {"numero": "926", "hora": "0830", "precio": "380.50"}, {"numero": "1231", "hora": "1400", "precio": "410.00"} ] }
}
mock_seats_response = {
    "lista_asientos": { "aerolinea": "AA", "numero": "926", "fecha": "20251115", "origen": "GUA", "destino": "MIA", "avion": "Boeing 737", "asientos": [ {"fila": "1", "posicion": "A"}, {"fila": "1", "posicion": "B"}, {"fila": "2", "posicion": "C"}, {"fila": "2", "posicion": "D"}, {"fila": "5", "posicion": "A"}, {"fila": "10", "posicion": "B"} ] }
}

# --- DATABASE AND CORE FUNCTIONS (Unchanged) ---
def get_db_connection():
    conn = psycopg2.connect(host=os.getenv("DB_HOST"), database=os.getenv("DB_NAME"), user=os.getenv("DB_USER"), password=os.getenv("DB_PASSWORD"), port=os.getenv("DB_PORT"))
    return conn

# --- FRONTEND ROUTES ---
@app.route('/')
def serve_frontend():
    """Serves the main index.html file."""
    return send_from_directory('.', 'index.html')
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# --- API ENDPOINTS (Updated to match spec) ---
@app.route('/api/flights', methods=['GET'])
def get_flights():
    # Expected parameters: origen, destino, fecha, formato
    origen = request.args.get('origen', 'GUA')
    destino = request.args.get('destino', 'MIA') 
    fecha = request.args.get('fecha', '20251115')
    formato = request.args.get('formato', 'JSON')
    
    # Update mock response with actual parameters
    response = {
        "lista_vuelos": { 
            "aerolinea": "AA", 
            "fecha": fecha, 
            "origen": origen, 
            "destino": destino, 
            "vuelos": [ 
                {"numero": "926", "hora": "0830", "precio": "380.50"}, 
                {"numero": "1231", "hora": "1400", "precio": "410.00"} 
            ] 
        }
    }
    return jsonify(response)

@app.route('/api/seats', methods=['GET'])
def get_available_seats():
    # Expected parameters: aerolinea, vuelo, fecha, formato
    aerolinea = request.args.get('aerolinea', 'AA')
    vuelo = request.args.get('vuelo', '926')
    fecha = request.args.get('fecha', '20251115')
    formato = request.args.get('formato', 'JSON')
    
    # Update mock response with actual parameters (fixing spec inconsistencies)
    response = {
        "lista_asientos": { 
            "aerolinea": aerolinea, 
            "numero": vuelo, 
            "fecha": fecha, 
            "origen": "GUA",  # Fixed from "origin" in spec
            "destino": "MIA", # Fixed from "design" in spec
            "avion": "Boeing 737", 
            "asientos": [ 
                {"fila": "1", "posicion": "A"},  # Fixed from "file"/"position" in spec
                {"fila": "1", "posicion": "B"}, 
                {"fila": "2", "posicion": "C"}, 
                {"fila": "2", "posicion": "D"}, 
                {"fila": "5", "posicion": "A"}, 
                {"fila": "10", "posicion": "B"} 
            ] 
        }
    }
    return jsonify(response)

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    full_name, email, password, travel_document = data.get('full_name'), data.get('email'), data.get('password'), data.get('travel_document')
    if not all([full_name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (full_name, email, password_hash, travel_document) VALUES (%s, %s, %s, %s)', (full_name, email, password_hash, travel_document))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User registered successfully"}), 201
    except psycopg2.IntegrityError:
        return jsonify({"error": "Email already registered"}), 409
    except Exception as e:
        print(f"Error registering user: {e}")
        return jsonify({"error": "An internal error occurred"}), 500

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    if not all([email, password]):
        return jsonify({"error": "Missing required fields"}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute('SELECT * FROM users WHERE email = %s;', (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if user and bcrypt.check_password_hash(user['password_hash'], password):
            return jsonify({"message": "Login successful", "user": {"id": user['id'], "full_name": user['full_name'], "email": user['email']}})
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": "An internal error occurred"}), 500

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    user_id, flight_id, seat_number = data.get('user_id'), data.get('flight_id'), data.get('seat_number')
    if not all([user_id, flight_id, seat_number]):
        return jsonify({"error": "Missing required fields"}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM bookings WHERE flight_id = %s AND seat_number = %s;", (flight_id, seat_number))
        if cursor.fetchone():
            return jsonify({"error": "Seat already booked"}), 409
        ticket_number = str(uuid.uuid4().hex)[:10].upper()
        cursor.execute("INSERT INTO bookings (user_id, flight_id, seat_number, ticket_number) VALUES (%s, %s, %s, %s) RETURNING id;", (user_id, flight_id, seat_number, ticket_number))
        new_booking_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Booking successful!", "booking_id": new_booking_id, "ticket_number": ticket_number}), 201
    except Exception as e:
        print(f"Error creating booking: {e}")
        return jsonify({"error": "An internal error occurred"}), 500

@app.route('/api/reserva', methods=['GET'])
def create_ticket():
    """
    Creates a ticket reservation according to the spec format.
    Expected parameters: aerolinea, vuelo, fecha, asiento, nombre, formato
    """
    aerolinea = request.args.get('aerolinea', 'AA')
    vuelo = request.args.get('vuelo', '926')
    fecha = request.args.get('fecha', '20251115')
    asiento = request.args.get('asiento', '1A')
    nombre = request.args.get('nombre', 'JuanPerez')
    formato = request.args.get('formato', 'JSON')
    
    # Generate a mock ticket number
    ticket_number = str(uuid.uuid4().hex)[:9].upper()
    
    # Mock response according to spec (note: spec has typo "horra" instead of "hora")
    response = {
        "boleto": {
            "aerolinea": aerolinea,
            "vuelo": vuelo,
            "fecha": fecha,
            "horra": "1400",  # Using spec's typo "horra" to match exactly
            "numero": ticket_number
        }
    }
    
    return jsonify(response), 201

# --- 📝 MOCK PAYMENT ENDPOINT ---
@app.route('/api/autorizacion', methods=['GET'])
def authorize_payment():
    """
    Simulates a call to the external credit card authorization API.
    Expected parameters: tarjeta, nombre, fecha_venc, num_seguridad, monto, tienda, formato
    """
    tarjeta = request.args.get('tarjeta')
    nombre = request.args.get('nombre', 'JUANPEREZ')
    fecha_venc = request.args.get('fecha_venc', '202204')
    num_seguridad = request.args.get('num_seguridad', '123')
    monto = request.args.get('monto', '600')
    tienda = request.args.get('tienda', 'MYBOOKING')
    formato = request.args.get('formato', 'JSON')
    
    # Simple mock logic: A specific card number is always approved.
    if tarjeta == "1234567812345678":
        response = {
            "autorizacion": {
                "emisor": "VISA",
                "tarjeta": tarjeta,
                "status": "APROBADO",
                "numero": "654321" # A mock authorization number
            }
        }
        return jsonify(response), 200
    else:
        response = {
            "autorizacion": {
                "emisor": "VISA",
                "tarjeta": tarjeta,
                "status": "DENEGADO",
                "numero": "0" # Authorization number is 0 if denied 
            }
        }
        return jsonify(response), 402 # 402 Payment Required (but failed)

if __name__ == '__main__':
    app.run(debug=True)