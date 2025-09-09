// Sample data for the Flight Reservation System

// Airports database
const aeropuertos = [
    { codigo: "GUA", nombre: "La Aurora, Guatemala City", ciudad: "Guatemala City", pais: "Guatemala" },
    { codigo: "MIA", nombre: "Miami International Airport", ciudad: "Miami", pais: "Estados Unidos" },
    { codigo: "FLW", nombre: "Flores Airport", ciudad: "Flores", pais: "Guatemala" },
    { codigo: "LAX", nombre: "Los Angeles International", ciudad: "Los Angeles", pais: "Estados Unidos" },
    { codigo: "JFK", nombre: "John F. Kennedy International", ciudad: "New York", pais: "Estados Unidos" },
    { codigo: "MAD", nombre: "Madrid-Barajas Airport", ciudad: "Madrid", pais: "España" },
    { codigo: "MEX", nombre: "Mexico City International", ciudad: "Mexico City", pais: "México" },
    { codigo: "PTY", nombre: "Tocumen International", ciudad: "Panama City", pais: "Panamá" }
];

// Airlines database with sample flights
const aerolineas = [
    {
        codigo: "CA",
        nombre: "Air China",
        vuelos: [
            {
                numero: "123",
                origen: "GUA",
                destino: "FLW",
                hora_salida: "0800",
                duracion: "01:15",
                precio: 450,
                avion: "Airbus A320",
                dias_operacion: ["lunes", "miercoles", "viernes", "domingo"]
            },
            {
                numero: "124",
                origen: "FLW",
                destino: "GUA",
                hora_salida: "1000",
                duracion: "01:15",
                precio: 450,
                avion: "Airbus A320",
                dias_operacion: ["lunes", "miercoles", "viernes", "domingo"]
            },
            {
                numero: "201",
                origen: "GUA",
                destino: "MIA",
                hora_salida: "1400",
                duracion: "03:30",
                precio: 850,
                avion: "Boeing 737",
                dias_operacion: ["martes", "jueves", "sabado"]
            },
            {
                numero: "202",
                origen: "MIA",
                destino: "GUA",
                hora_salida: "1800",
                duracion: "03:30",
                precio: 850,
                avion: "Boeing 737",
                dias_operacion: ["martes", "jueves", "sabado"]
            }
        ]
    },
    {
        codigo: "AA",
        nombre: "American Airlines",
        vuelos: [
            {
                numero: "501",
                origen: "MIA",
                destino: "LAX",
                hora_salida: "0630",
                duracion: "05:45",
                precio: 1200,
                avion: "Boeing 777",
                dias_operacion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
            },
            {
                numero: "502",
                origen: "LAX",
                destino: "MIA",
                hora_salida: "1030",
                duracion: "04:30",
                precio: 1200,
                avion: "Boeing 777",
                dias_operacion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
            },
            {
                numero: "301",
                origen: "MIA",
                destino: "JFK",
                hora_salida: "0900",
                duracion: "02:45",
                precio: 650,
                avion: "Airbus A321",
                dias_operacion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
            },
            {
                numero: "302",
                origen: "JFK",
                destino: "MIA",
                hora_salida: "1500",
                duracion: "02:45",
                precio: 650,
                avion: "Airbus A321",
                dias_operacion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
            }
        ]
    },
    {
        codigo: "QR",
        nombre: "Qatar Airways",
        vuelos: [
            {
                numero: "701",
                origen: "MAD",
                destino: "GUA",
                hora_salida: "1100",
                duracion: "10:30",
                precio: 1800,
                avion: "Airbus A350",
                dias_operacion: ["martes", "jueves", "sabado"]
            },
            {
                numero: "702",
                origen: "GUA",
                destino: "MAD",
                hora_salida: "2200",
                duracion: "11:15",
                precio: 1800,
                avion: "Airbus A350",
                dias_operacion: ["miercoles", "viernes", "domingo"]
            },
            {
                numero: "801",
                origen: "MAD",
                destino: "MEX",
                hora_salida: "1630",
                duracion: "11:45",
                precio: 1600,
                avion: "Boeing 787",
                dias_operacion: ["lunes", "miercoles", "viernes", "domingo"]
            }
        ]
    },
    {
        codigo: "JL",
        nombre: "Japan Air",
        vuelos: [
            {
                numero: "401",
                origen: "PTY",
                destino: "GUA",
                hora_salida: "0745",
                duracion: "02:15",
                precio: 520,
                avion: "Boeing 737 MAX",
                dias_operacion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
            },
            {
                numero: "402",
                origen: "GUA",
                destino: "PTY",
                hora_salida: "1130",
                duracion: "02:15",
                precio: 520,
                avion: "Boeing 737 MAX",
                dias_operacion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
            },
            {
                numero: "601",
                origen: "PTY",
                destino: "MIA",
                hora_salida: "1420",
                duracion: "02:45",
                precio: 480,
                avion: "Embraer E190",
                dias_operacion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
            }
        ]
    },
    {
        codigo: "AF",
        nombre: "Air France",
        vuelos: [
            {
                numero: "901",
                origen: "GUA",
                destino: "JFK",
                hora_salida: "0615",
                duracion: "04:45",
                precio: 1100,
                avion: "Airbus A330",
                dias_operacion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
            },
            {
                numero: "902",
                origen: "JFK",
                destino: "GUA",
                hora_salida: "1245",
                duracion: "05:15",
                precio: 1100,
                avion: "Airbus A330",
                dias_operacion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
            },
            {
                numero: "903",
                origen: "LAX",
                destino: "MAD",
                hora_salida: "1545",
                duracion: "11:20",
                precio: 1950,
                avion: "Boeing 787",
                dias_operacion: ["martes", "jueves", "sabado"]
            }
        ]
    },
    {
        codigo: "AV",
        nombre: "Avianca",
        vuelos: [
            {
                numero: "801",
                origen: "GUA",
                destino: "MEX",
                hora_salida: "0730",
                duracion: "02:30",
                precio: 380,
                avion: "Airbus A320",
                dias_operacion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
            },
            {
                numero: "802",
                origen: "MEX",
                destino: "GUA",
                hora_salida: "1115",
                duracion: "02:30",
                precio: 380,
                avion: "Airbus A320",
                dias_operacion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
            },
            {
                numero: "803",
                origen: "MEX",
                destino: "LAX",
                hora_salida: "1435",
                duracion: "04:15",
                precio: 750,
                avion: "Boeing 737",
                dias_operacion: ["miercoles", "viernes", "domingo"]
            },
            {
                numero: "804",
                origen: "LAX",
                destino: "MEX",
                hora_salida: "1920",
                duracion: "03:45",
                precio: 750,
                avion: "Boeing 737",
                dias_operacion: ["miercoles", "viernes", "domingo"]
            }
        ]
    }
];

// Valid credit cards database
const tarjetasValidas = [
    {
        numero: "1234567812345678",
        titular: "JUAN PEREZ",
        vencimiento: "202412",
        codigo: "123",
        limite: 5000,
        disponible: 3000,
        emisor: "VISA"
    },
    {
        numero: "9876543210987654",
        titular: "MARIA GARCIA",
        vencimiento: "202511",
        codigo: "456",
        limite: 8000,
        disponible: 6500,
        emisor: "MAST"
    },
    {
        numero: "5555444433332222",
        titular: "CARLOS RODRIGUEZ",
        vencimiento: "202610",
        codigo: "789",
        limite: 3000,
        disponible: 2800,
        emisor: "VISA"
    },
    {
        numero: "4444333322221111",
        titular: "ANA MARTINEZ",
        vencimiento: "202503",
        codigo: "321",
        limite: 10000,
        disponible: 8200,
        emisor: "MAST"
    },
    {
        numero: "1111222233334444",
        titular: "LUIS GOMEZ",
        vencimiento: "202409",
        codigo: "654",
        limite: 6000,
        disponible: 4500,
        emisor: "AMEX"
    }
];

// Seat configuration for airplanes (20 rows x 4 seats: A, B, C, D)
const configuracionAsientos = {
    "Airbus A320": {
        filas: 20,
        asientosPorFila: ["A", "B", "C", "D"],
        tipoAvion: "Airbus A320"
    },
    "Boeing 737": {
        filas: 20,
        asientosPorFila: ["A", "B", "C", "D"],
        tipoAvion: "Boeing 737"
    },
    "Boeing 777": {
        filas: 20,
        asientosPorFila: ["A", "B", "C", "D"],
        tipoAvion: "Boeing 777"
    },
    "Airbus A321": {
        filas: 20,
        asientosPorFila: ["A", "B", "C", "D"],
        tipoAvion: "Airbus A321"
    },
    "Airbus A350": {
        filas: 20,
        asientosPorFila: ["A", "B", "C", "D"],
        tipoAvion: "Airbus A350"
    },
    "Boeing 787": {
        filas: 20,
        asientosPorFila: ["A", "B", "C", "D"],
        tipoAvion: "Boeing 787"
    },
    "Boeing 737 MAX": {
        filas: 20,
        asientosPorFila: ["A", "B", "C", "D"],
        tipoAvion: "Boeing 737 MAX"
    },
    "Embraer E190": {
        filas: 20,
        asientosPorFila: ["A", "B", "C", "D"],
        tipoAvion: "Embraer E190"
    }
};

// Sample occupied seats by flight (for demonstration)
const asientosOcupados = {
    "CA-123-20250909": ["1A", "1B", "2C", "3A", "5B", "7D", "10A", "12C", "15B", "18A"],
    "CA-124-20250909": ["2A", "3B", "4C", "6A", "8B", "9D", "11A", "13C", "16B", "19A"],
    "AA-501-20250909": ["1A", "1B", "1C", "2A", "3B", "4D", "5A", "6C", "7B", "8A", "9D", "10B", "11A", "12C", "14B", "16A"],
    "AA-302-20250909": ["2B", "3A", "4C", "5D", "7A", "8B", "9C", "11A", "12D", "14B", "15A", "17C", "19B"],
    "QR-701-20250909": ["1A", "1B", "1C", "1D", "2A", "2B", "3C", "4A", "5B", "6D", "7A", "8C", "9B", "10A"],
    "JL-401-20250909": ["3A", "4B", "5C", "6A", "7D", "9B", "10A", "11C", "13B", "14A", "16C", "17D"],
    "AF-901-20250909": ["1A", "2B", "3C", "4D", "6A", "7B", "9C", "11A", "13D", "15B", "17A", "19C"],
    "AV-801-20250909": ["2A", "4B", "6C", "8D", "10A", "12B", "14C", "16D", "18A", "20B"]
};

// Credit card issuers
const emisoresTarjeta = [
    {
        codigo: "VISA",
        nombre: "Visa International",
        host: "visa-processor.com",
        script_autorizacion: "authorize_payment"
    },
    {
        codigo: "MAST",
        nombre: "Mastercard",
        host: "mastercard-processor.com", 
        script_autorizacion: "process_payment"
    },
    {
        codigo: "AMEX",
        nombre: "American Express",
        host: "amex-processor.com",
        script_autorizacion: "validate_transaction"
    }
];

// Helper functions for data manipulation
const DataHelper = {
    // Get airport by code
    getAeropuerto: function(codigo) {
        return aeropuertos.find(airport => airport.codigo === codigo);
    },

    // Get airline by code
    getAerolinea: function(codigo) {
        return aerolineas.find(airline => airline.codigo === codigo);
    },

    // Search flights
    buscarVuelos: function(origen, destino, fecha) {
        const vuelosDisponibles = [];
        const dayOfWeek = this.getDayOfWeek(fecha);
        
        aerolineas.forEach(aerolinea => {
            aerolinea.vuelos.forEach(vuelo => {
                if (vuelo.origen === origen && 
                    vuelo.destino === destino && 
                    vuelo.dias_operacion.includes(dayOfWeek)) {
                    vuelosDisponibles.push({
                        aerolinea: aerolinea.codigo,
                        aerolinea_nombre: aerolinea.nombre,
                        numero: vuelo.numero,
                        origen: vuelo.origen,
                        destino: vuelo.destino,
                        hora_salida: vuelo.hora_salida,
                        duracion: vuelo.duracion,
                        precio: vuelo.precio,
                        avion: vuelo.avion,
                        fecha: fecha
                    });
                }
            });
        });
        
        return vuelosDisponibles;
    },

    // Get day of week in Spanish
    getDayOfWeek: function(dateString) {
        const date = new Date(dateString);
        const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        return days[date.getDay()];
    },

    // Get available seats for a flight
    getAsientosDisponibles: function(aerolinea, vuelo, fecha) {
        const flightKey = `${aerolinea}-${vuelo}-${fecha.replace(/-/g, '')}`;
        const ocupados = asientosOcupados[flightKey] || [];
        const disponibles = [];
        
        // Get airplane configuration
        const vueloInfo = this.getVueloInfo(aerolinea, vuelo);
        if (!vueloInfo) return [];
        
        const config = configuracionAsientos[vueloInfo.avion];
        if (!config) return [];
        
        // Generate all seats
        for (let fila = 1; fila <= config.filas; fila++) {
            config.asientosPorFila.forEach(posicion => {
                const asiento = `${fila}${posicion}`;
                if (!ocupados.includes(asiento)) {
                    disponibles.push({
                        fila: fila,
                        posicion: posicion,
                        codigo: asiento
                    });
                }
            });
        }
        
        return disponibles;
    },

    // Get flight information
    getVueloInfo: function(codigoAerolinea, numeroVuelo) {
        const aerolinea = this.getAerolinea(codigoAerolinea);
        if (!aerolinea) return null;
        
        return aerolinea.vuelos.find(v => v.numero === numeroVuelo);
    },

    // Validate credit card
    validarTarjeta: function(numero, titular, vencimiento, codigo, monto) {
        const tarjeta = tarjetasValidas.find(t => 
            t.numero === numero.replace(/\s/g, '') &&
            t.titular.toUpperCase() === titular.toUpperCase() &&
            t.vencimiento === vencimiento.replace('-', '') &&
            t.codigo === codigo
        );
        
        if (!tarjeta) {
            return {
                status: "DENEGADO",
                numero: "0",
                mensaje: "Tarjeta no válida"
            };
        }
        
        // Check expiration
        const fechaVenc = new Date(`20${vencimiento.substr(2, 2)}-${vencimiento.substr(4, 2)}-01`);
        const hoy = new Date();
        if (fechaVenc < hoy) {
            return {
                status: "DENEGADO",
                numero: "0",
                mensaje: "Tarjeta vencida"
            };
        }
        
        // Check available funds
        if (tarjeta.disponible < monto) {
            return {
                status: "DENEGADO",
                numero: "0",
                mensaje: "Fondos insuficientes"
            };
        }
        
        // Simulate successful authorization
        const numeroAutorizacion = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        
        // Update available funds (in a real system, this would be persisted)
        tarjeta.disponible -= monto;
        
        return {
            status: "APROBADO",
            numero: numeroAutorizacion,
            emisor: tarjeta.emisor,
            mensaje: "Transacción aprobada"
        };
    },

    // Generate ticket number
    generarBoleto: function(aerolinea, vuelo, fecha) {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${aerolinea}${vuelo}${timestamp.slice(-6)}${random}`;
    },

    // Reserve seat (simulate seat reservation)
    reservarAsiento: function(aerolinea, vuelo, fecha, asiento, nombrePasajero) {
        const flightKey = `${aerolinea}-${vuelo}-${fecha.replace(/-/g, '')}`;
        
        // Initialize if doesn't exist
        if (!asientosOcupados[flightKey]) {
            asientosOcupados[flightKey] = [];
        }
        
        // Check if seat is available
        if (asientosOcupados[flightKey].includes(asiento)) {
            return {
                success: false,
                mensaje: "Asiento no disponible"
            };
        }
        
        // Reserve the seat
        asientosOcupados[flightKey].push(asiento);
        
        // Generate ticket number
        const numeroBoleto = this.generarBoleto(aerolinea, vuelo, fecha);
        
        return {
            success: true,
            boleto: {
                numero: numeroBoleto,
                aerolinea: aerolinea,
                vuelo: vuelo,
                fecha: fecha,
                asiento: asiento,
                pasajero: nombrePasajero,
                timestamp: new Date().toISOString()
            }
        };
    },

    // Format time (HHMM to HH:MM)
    formatTime: function(time) {
        if (time.length === 4) {
            return `${time.substr(0, 2)}:${time.substr(2, 2)}`;
        }
        return time;
    },

    // Calculate arrival time
    calcularHoraLlegada: function(horaSalida, duracion) {
        const [salidaHora, salidaMin] = horaSalida.match(/.{2}/g).map(Number);
        const [durHoras, durMin] = duracion.split(':').map(Number);
        
        const totalMinutos = (salidaHora * 60 + salidaMin) + (durHoras * 60 + durMin);
        const llegadaHora = Math.floor(totalMinutos / 60) % 24;
        const llegadaMin = totalMinutos % 60;
        
        return `${llegadaHora.toString().padStart(2, '0')}:${llegadaMin.toString().padStart(2, '0')}`;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        aeropuertos,
        aerolineas,
        tarjetasValidas,
        configuracionAsientos,
        asientosOcupados,
        emisoresTarjeta,
        DataHelper
    };
}
