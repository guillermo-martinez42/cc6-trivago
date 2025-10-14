// Payment processing functionality for Flight Reservation System

// Show payment modal
function showPaymentModal() {
    // Update booking summary
    updateBookingSummary();
    
    // Show modal
    showModal('#payment-modal');
    
    // Clear previous form data
    clearPaymentForm();
}

// Update booking summary in payment modal
function updateBookingSummary() {
    const flight = currentBooking.flight;
    const origenInfo = DataHelper.getAeropuerto(flight.origen);
    const destinoInfo = DataHelper.getAeropuerto(flight.destino);
    const horaLlegada = DataHelper.calcularHoraLlegada(flight.hora_salida, flight.duracion);
    
    const summaryHTML = `
        <div class="space-y-3">
            <div class="flex justify-between items-center">
                <span class="font-semibold">Vuelo:</span>
                <span>${flight.aerolinea_nombre} ${flight.aerolinea}${flight.numero}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold">Ruta:</span>
                <span>${origenInfo.codigo} → ${destinoInfo.codigo}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold">Fecha:</span>
                <span>${formatDate(flight.fecha)}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold">Horario:</span>
                <span>${DataHelper.formatTime(flight.hora_salida)} - ${horaLlegada}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold">Asientos:</span>
                <span>${currentBooking.selectedSeats.join(', ')}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold">Pasajeros:</span>
                <span>${currentBooking.passengers}</span>
            </div>
            <div class="border-t pt-2">
                <div class="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span class="price-highlight">$${currentBooking.totalPrice}</span>
                </div>
            </div>
        </div>
    `;
    
    $('#booking-summary').html(summaryHTML);
}

// Clear payment form
function clearPaymentForm() {
    $('#payment-form')[0].reset();
    $('#payment-form input').removeClass('input-success input-error');
}

// Set up payment event listeners
$(document).ready(function() {
    // Close payment modal
    $('#close-payment-modal, #cancel-payment').click(function() {
        hideModal('#payment-modal');
    });
    
    // Payment form submission
    $('#payment-form').submit(handlePayment);
    
    // Real-time validation
    $('#card-number').on('blur', validateCardNumber);
    $('#card-holder').on('blur', validateCardHolder);
    $('#card-expiry').on('blur', validateExpiryDate);
    $('#card-cvv').on('blur', validateCVV);
    
    // Payment modal background click
    $('#payment-modal').click(function(e) {
        if (e.target === this) {
            hideModal('#payment-modal');
        }
    });
});

// Handle payment processing
function handlePayment(e) {
    e.preventDefault();
    
    // Get form data
    const cardNumber = $('#card-number').val().replace(/\s/g, '');
    const cardHolder = $('#card-holder').val().trim().toUpperCase();
    const cardExpiry = $('#card-expiry').val().replace('-', '');
    const cardCVV = $('#card-cvv').val();
    const amount = currentBooking.totalPrice;
    
    // Validate all fields
    if (!validatePaymentForm()) {
        showToast('Por favor corrija los errores en el formulario', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = $('#payment-form button[type="submit"]');
    submitBtn.addClass('btn-loading').prop('disabled', true);
    
    // Call backend payment authorization API
    $.ajax({
        url: '/api/autorizacion',
        method: 'GET',
        data: {
            tarjeta: cardNumber,
            nombre: cardHolder,
            fecha_venc: cardExpiry,
            num_seguridad: cardCVV,
            monto: amount,
            tienda: 'TRIVAGO',
            formato: 'JSON'
        },
        success: function(response) {
            submitBtn.removeClass('btn-loading').prop('disabled', false);
            
            const authResult = response.autorizacion;
            if (authResult.status === 'APROBADO') {
                // Payment successful - proceed to reservation
                processReservation(authResult);
            } else {
                // Payment denied
                showToast('Pago denegado. Verifique su tarjeta.', 'error');
                logPaymentAttempt(cardNumber, authResult);
            }
        },
        error: function(xhr) {
            submitBtn.removeClass('btn-loading').prop('disabled', false);
            const errorMsg = xhr.responseJSON?.error || 'Error al procesar el pago';
            showToast(errorMsg, 'error');
        }
    });
}

// Process flight reservation after successful payment
function processReservation(authResult) {
    const flight = currentBooking.flight;
    const formattedDate = flight.fecha.replace(/-/g, '');
    
    // Show loading
    showLoading();
    
    // Reserve each seat with the backend
    const reservationCalls = currentBooking.selectedSeats.map(seat => {
        return $.ajax({
            url: '/api/reserva',
            method: 'GET',
            data: {
                user_id: currentUser.id,
                aerolinea: flight.aerolinea,
                vuelo: flight.numero,
                fecha: formattedDate,
                asiento: seat,
                nombre: (currentUser.full_name || currentUser.name).replace(/\s+/g, ''),
                precio: flight.precio,
                formato: 'JSON'
            }
        });
    });
    
    // Wait for all reservations
    $.when.apply($, reservationCalls).then(
        function() {
            hideLoading();
            
            // Convert arguments to array (handles single or multiple results)
            const results = reservationCalls.length === 1 ? [arguments[0]] : 
                           Array.prototype.slice.call(arguments).map(arg => arg[0]);
            
            // Generate tickets from reservation results
            const tickets = results.map((response, index) => {
                const boleto = response.boleto;
                return {
                    numero: boleto.numero,
                    pasajero: currentUser.full_name || currentUser.name,
                    documento: currentUser.travel_document || currentUser.document,
                    vuelo: {
                        aerolinea: flight.aerolinea_nombre || flight.aerolinea,
                        codigo_vuelo: `${flight.aerolinea}${flight.numero}`,
                        origen: flight.origen,
                        destino: flight.destino,
                        fecha: flight.fecha,
                        hora_salida: flight.hora_salida,
                        duracion: flight.duracion,
                        avion: flight.avion
                    },
                    asiento: currentBooking.selectedSeats[index],
                    precio: flight.precio,
                    fechaReserva: new Date().toISOString(),
                    autorizacion: authResult.numero,
                    emisor: authResult.emisor
                };
            });
            
            // Store tickets in localStorage
            saveTickets(tickets);
            
            // Show confirmation
            hideModal('#payment-modal');
            showConfirmation(tickets);
            
            // Log successful transaction
            logTransaction({
                type: 'COMPRA_BOLETOS',
                usuario: currentUser.email,
                vuelo: `${flight.aerolinea}${flight.numero}`,
                fecha: flight.fecha,
                asientos: currentBooking.selectedSeats,
                monto: currentBooking.totalPrice,
                autorizacion: authResult.numero,
                tickets: tickets.map(t => t.numero),
                timestamp: new Date().toISOString()
            });
        },
        function(xhr) {
            hideLoading();
            const errorMsg = xhr.responseJSON?.error || 'Error al procesar la reserva';
            showToast(errorMsg, 'error');
        }
    );
}

// Validation functions
function validatePaymentForm() {
    const cardNumber = validateCardNumber();
    const cardHolder = validateCardHolder();
    const expiryDate = validateExpiryDate();
    const cvv = validateCVV();
    
    return cardNumber && cardHolder && expiryDate && cvv;
}

function validateCardNumber() {
    const input = $('#card-number');
    const value = input.val().replace(/\s/g, '');
    const isValid = /^\d{16}$/.test(value) && luhnCheck(value);
    
    updateFieldValidation(input, isValid, 'Número de tarjeta inválido');
    return isValid;
}

function validateCardHolder() {
    const input = $('#card-holder');
    const value = input.val().trim();
    const isValid = value.length >= 2 && /^[A-Za-z\s]+$/.test(value);
    
    updateFieldValidation(input, isValid, 'Nombre del titular inválido');
    return isValid;
}

function validateExpiryDate() {
    const input = $('#card-expiry');
    const value = input.val().replace('-', '');
    
    if (!/^\d{6}$/.test(value)) {
        updateFieldValidation(input, false, 'Formato de fecha inválido (YYYY-MM)');
        return false;
    }
    
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(4, 6));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const isValid = year >= currentYear && 
                   month >= 1 && month <= 12 &&
                   (year > currentYear || month >= currentMonth);
    
    updateFieldValidation(input, isValid, 'Fecha de vencimiento inválida');
    return isValid;
}

function validateCVV() {
    const input = $('#card-cvv');
    const value = input.val();
    const isValid = /^\d{3}$/.test(value);
    
    updateFieldValidation(input, isValid, 'CVV debe tener 3 dígitos');
    return isValid;
}

function updateFieldValidation(input, isValid, errorMessage) {
    const fieldContainer = input.closest('div');
    let errorDiv = fieldContainer.find('.error-message');
    
    if (isValid) {
        input.removeClass('input-error').addClass('input-success');
        errorDiv.remove();
    } else {
        input.removeClass('input-success').addClass('input-error');
        if (errorDiv.length === 0) {
            fieldContainer.append(`<div class="error-message text-red-500 text-sm mt-1">${errorMessage}</div>`);
        } else {
            errorDiv.text(errorMessage);
        }
    }
}

// Luhn algorithm for credit card validation
function luhnCheck(cardNumber) {
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let n = parseInt(cardNumber.charAt(i));
        
        if (alternate) {
            n *= 2;
            if (n > 9) n = (n % 10) + 1;
        }
        
        sum += n;
        alternate = !alternate;
    }
    
    return (sum % 10) === 0;
}

// Show confirmation modal
function showConfirmation(tickets) {
    const ticket = tickets[0]; // Show first ticket details
    const flight = ticket.vuelo;
    const origenInfo = DataHelper.getAeropuerto(flight.origen);
    const destinoInfo = DataHelper.getAeropuerto(flight.destino);
    const horaLlegada = DataHelper.calcularHoraLlegada(flight.hora_salida, flight.duracion);
    
    const ticketDetailsHTML = `
        <div class="space-y-3">
            <div class="text-center mb-4">
                <div class="text-2xl font-bold text-green-600">${ticket.numero}</div>
                <div class="text-sm text-gray-500">Número de boleto</div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <div class="font-semibold text-gray-700">Pasajero:</div>
                    <div>${ticket.pasajero}</div>
                </div>
                <div>
                    <div class="font-semibold text-gray-700">Documento:</div>
                    <div>${ticket.documento}</div>
                </div>
                <div>
                    <div class="font-semibold text-gray-700">Vuelo:</div>
                    <div>${flight.aerolinea} ${flight.codigo_vuelo}</div>
                </div>
                <div>
                    <div class="font-semibold text-gray-700">Fecha:</div>
                    <div>${formatDate(flight.fecha)}</div>
                </div>
                <div>
                    <div class="font-semibold text-gray-700">Ruta:</div>
                    <div>${origenInfo.codigo} → ${destinoInfo.codigo}</div>
                </div>
                <div>
                    <div class="font-semibold text-gray-700">Horario:</div>
                    <div>${DataHelper.formatTime(flight.hora_salida)} - ${horaLlegada}</div>
                </div>
                <div>
                    <div class="font-semibold text-gray-700">Asiento${tickets.length > 1 ? 's' : ''}:</div>
                    <div>${tickets.map(t => t.asiento).join(', ')}</div>
                </div>
                <div>
                    <div class="font-semibold text-gray-700">Aeronave:</div>
                    <div>${flight.avion}</div>
                </div>
            </div>
            
            ${tickets.length > 1 ? `
                <div class="mt-4 p-3 bg-blue-50 rounded">
                    <div class="text-sm text-blue-800">
                        <i class="fas fa-info-circle mr-1"></i>
                        Se han emitido ${tickets.length} boletos para este vuelo.
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    $('#ticket-details').html(ticketDetailsHTML);
    showModal('#confirmation-modal');
}

// Save tickets to localStorage
function saveTickets(tickets) {
    const savedTickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    const userTickets = savedTickets.filter(t => t.userId !== currentUser.id);
    
    tickets.forEach(ticket => {
        ticket.userId = currentUser.id;
        userTickets.push(ticket);
    });
    
    localStorage.setItem('userTickets', JSON.stringify(userTickets));
}

// Set up confirmation modal event listeners
$(document).ready(function() {
    // Download ticket
    $('#download-ticket').click(function() {
        generateTicketPDF();
    });
    
    // Confirmation modal background click
    $('#confirmation-modal').click(function(e) {
        if (e.target === this) {
            hideModal('#confirmation-modal');
            resetSearchForm();
        }
    });
});

// Generate ticket PDF
function generateTicketPDF() {
    const { jsPDF } = window.jspdf;
    const tickets = JSON.parse(localStorage.getItem('userTickets') || '[]')
        .filter(t => t.userId === currentUser.id)
        .slice(-currentBooking.passengers); // Get latest tickets for the booking

    if (tickets.length === 0) {
        showToast('No se encontraron tickets para descargar', 'error');
        return;
    }

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [210, 99] // Standard ticket size
    });
    
    tickets.forEach((ticket, index) => {
        if (index > 0) {
            doc.addPage();
        }

        const flight = ticket.vuelo;
        const origenInfo = DataHelper.getAeropuerto(flight.origen);
        const destinoInfo = DataHelper.getAeropuerto(flight.destino);

        // --- PDF Design ---
        doc.setFillColor(30, 88, 140); // Dark Blue
        doc.rect(0, 0, 210, 99, 'F');
        
        // Left Side
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('SkyReserva', 10, 15);
        doc.setFontSize(10);
        doc.text('Boarding Pass', 10, 20);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Passenger', 10, 30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(ticket.pasajero.toUpperCase(), 10, 36);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('From', 10, 45);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(`${origenInfo.codigo}`, 10, 52);
        doc.setFontSize(8);
        doc.text(origenInfo.ciudad, 10, 57);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('To', 60, 45);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(`${destinoInfo.codigo}`, 60, 52);
        doc.setFontSize(8);
        doc.text(destinoInfo.ciudad, 60, 57);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Date', 10, 68);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(formatDateForPDF(flight.fecha), 10, 74);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Departure', 50, 68);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(DataHelper.formatTime(flight.hora_salida), 50, 74);
        
        // Dotted line separator
        doc.setLineDashPattern([1, 1], 0);
        doc.setDrawColor(255, 255, 255);
        doc.line(140, 5, 140, 94);
        doc.setLineDashPattern([], 0);

        // Right Side (Stub)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('TRIVAGO', 145, 15);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Flight', 145, 25);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(flight.codigo_vuelo, 145, 31);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Seat', 180, 25);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(ticket.asiento, 180, 31);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Passenger', 145, 40);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(ticket.pasajero.toUpperCase(), 145, 46);

        // QR Code
        const qrContainer = document.createElement('div');
        new QRCode(qrContainer, {
            text: `TICKET:${ticket.numero},FLIGHT:${flight.codigo_vuelo},SEAT:${ticket.asiento}`,
            width: 40,
            height: 40,
            colorDark : "#ffffff",
            colorLight : "#1e588c",
        });

        // Get data from canvas instead of img for reliability
        const canvas = qrContainer.querySelector('canvas');
        if (canvas) {
            const qrImage = canvas.toDataURL('image/png');
            doc.addImage(qrImage, 'PNG', 155, 55, 40, 40);
        } else {
            console.error('QR Code canvas not found!');
        }
    });

    doc.save(`boleto-${tickets[0].numero}.pdf`);
    showToast('Boleto descargado correctamente', 'success');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const correctedDate = new Date(date.getTime() + userTimezoneOffset);
    return correctedDate.toLocaleDateString('es-GT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateForPDF(dateString) {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const correctedDate = new Date(date.getTime() + userTimezoneOffset);
    return correctedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function logTransaction(transaction) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function logPaymentAttempt(cardNumber, authResult) {
    const attempts = JSON.parse(localStorage.getItem('paymentAttempts') || '[]');
    attempts.push({
        cardNumber: cardNumber.slice(-4), // Only store last 4 digits
        result: authResult.status,
        mensaje: authResult.mensaje,
        usuario: currentUser.email,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('paymentAttempts', JSON.stringify(attempts));
}

// Payment helper functions
const PaymentHelper = {
    // Get card type from number
    getCardType: function(cardNumber) {
        const patterns = {
            'visa': /^4/,
            'mastercard': /^5[1-5]/,
            'amex': /^3[47]/,
            'discover': /^6(?:011|5)/
        };
        
        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(cardNumber)) {
                return type;
            }
        }
        return 'unknown';
    },
    
    // Format card number for display
    formatCardForDisplay: function(cardNumber) {
        return '**** **** **** ' + cardNumber.slice(-4);
    },
    
    // Generate authorization number
    generateAuthNumber: function() {
        return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    }
};
