// Seat selection functionality for Flight Reservation System

// Show seat selection modal
function showSeatSelection(flight) {
    // Update flight info
    const origenInfo = DataHelper.getAeropuerto(flight.origen);
    const destinoInfo = DataHelper.getAeropuerto(flight.destino);
    const horaLlegada = DataHelper.calcularHoraLlegada(flight.hora_salida, flight.duracion);
    
    $('#flight-info').html(`
        <div class="grid grid-cols-2 gap-4">
            <div>
                <h4 class="font-semibold text-lg">${flight.aerolinea_nombre}</h4>
                <p class="text-gray-600">Vuelo ${flight.aerolinea}${flight.numero}</p>
                <p class="text-sm text-gray-500">${flight.avion}</p>
            </div>
            <div class="text-right">
                <div class="text-lg font-semibold">${origenInfo.codigo} → ${destinoInfo.codigo}</div>
                <div class="text-sm text-gray-600">${DataHelper.formatTime(flight.hora_salida)} - ${horaLlegada}</div>
                <div class="text-sm text-gray-500">${flight.fecha}</div>
            </div>
        </div>
    `);
    
    // Generate airplane seat map
    generateSeatMap(flight);
    
    // Show modal
    showModal('#seat-modal');
    
    // Reset selection
    resetSeatSelection();
}

// Generate airplane seat map
function generateSeatMap(flight) {
    const config = configuracionAsientos[flight.avion];
    if (!config) {
        $('#airplane-seats').html('<p class="text-center text-red-500">Error: Configuración de avión no encontrada</p>');
        return;
    }
    
    // Get available and occupied seats
    const asientosDisponibles = DataHelper.getAsientosDisponibles(flight.aerolinea, flight.numero, flight.fecha);
    const ocupados = asientosOcupados[`${flight.aerolinea}-${flight.numero}-${flight.fecha.replace(/-/g, '')}`] || [];
    
    let seatMapHTML = '<div class="airplane-container">';
    
    // Add airplane header
    seatMapHTML += `
        <div class="text-center mb-6">
            <h4 class="text-lg font-semibold text-gray-700">${flight.avion}</h4>
            <p class="text-sm text-gray-500">Seleccione ${currentBooking.passengers} asiento${currentBooking.passengers > 1 ? 's' : ''}</p>
        </div>
    `;
    
    // Generate seat rows
    for (let fila = 1; fila <= config.filas; fila++) {
        seatMapHTML += '<div class="seat-row">';
        
        // Row number (left side)
        seatMapHTML += `<div class="seat-row-number">${fila}</div>`;
        
        // Seats A and B
        config.asientosPorFila.slice(0, 2).forEach(posicion => {
            const seatCode = `${fila}${posicion}`;
            const isOccupied = ocupados.includes(seatCode);
            const isAvailable = !isOccupied;
            const seatClass = isOccupied ? 'occupied' : 'available';
            
            seatMapHTML += `
                <div class="seat ${seatClass}" 
                     data-seat="${seatCode}" 
                     data-row="${fila}" 
                     data-position="${posicion}"
                     ${isAvailable ? 'onclick="toggleSeat(this)"' : ''}>
                    ${seatCode}
                </div>
            `;
        });
        
        // Aisle
        seatMapHTML += '<div class="aisle"></div>';
        
        // Seats C and D
        config.asientosPorFila.slice(2, 4).forEach(posicion => {
            const seatCode = `${fila}${posicion}`;
            const isOccupied = ocupados.includes(seatCode);
            const isAvailable = !isOccupied;
            const seatClass = isOccupied ? 'occupied' : 'available';
            
            seatMapHTML += `
                <div class="seat ${seatClass}" 
                     data-seat="${seatCode}" 
                     data-row="${fila}" 
                     data-position="${posicion}"
                     ${isAvailable ? 'onclick="toggleSeat(this)"' : ''}>
                    ${seatCode}
                </div>
            `;
        });
        
        // Row number (right side)
        seatMapHTML += `<div class="seat-row-number">${fila}</div>`;
        
        seatMapHTML += '</div>';
    }
    
    seatMapHTML += '</div>';
    
    $('#airplane-seats').html(seatMapHTML);
}

// Toggle seat selection
function toggleSeat(seatElement) {
    const $seat = $(seatElement);
    const seatCode = $seat.data('seat');
    
    if ($seat.hasClass('occupied')) {
        return; // Can't select occupied seats
    }
    
    if ($seat.hasClass('selected')) {
        // Deselect seat
        $seat.removeClass('selected').addClass('available');
        currentBooking.selectedSeats = currentBooking.selectedSeats.filter(s => s !== seatCode);
    } else {
        // Check if we can select more seats
        if (currentBooking.selectedSeats.length >= currentBooking.passengers) {
            showToast(`Solo puede seleccionar ${currentBooking.passengers} asiento${currentBooking.passengers > 1 ? 's' : ''}`, 'warning');
            return;
        }
        
        // Select seat
        $seat.removeClass('available').addClass('selected');
        currentBooking.selectedSeats.push(seatCode);
    }
    
    updateSeatSelectionUI();
}

// Update seat selection UI
function updateSeatSelectionUI() {
    const selectedCount = currentBooking.selectedSeats.length;
    const requiredCount = currentBooking.passengers;
    const confirmBtn = $('#confirm-seat-selection');
    
    if (selectedCount === requiredCount) {
        confirmBtn.prop('disabled', false).removeClass('disabled:opacity-50');
        if (selectedCount === 1) {
            showToast(`Asiento ${currentBooking.selectedSeats[0]} seleccionado`, 'success');
        } else {
            showToast(`${selectedCount} asientos seleccionados`, 'success');
        }
    } else {
        confirmBtn.prop('disabled', true).addClass('disabled:opacity-50');
    }
    
    // Update button text
    confirmBtn.text(`Continuar con el pago (${selectedCount}/${requiredCount})`);
}

// Reset seat selection
function resetSeatSelection() {
    currentBooking.selectedSeats = [];
    $('.seat.selected').removeClass('selected').addClass('available');
    updateSeatSelectionUI();
}

// Set up seat selection event listeners
$(document).ready(function() {
    // Close seat modal
    $('#close-seat-modal, #cancel-seat-selection').click(function() {
        hideModal('#seat-modal');
        resetSeatSelection();
    });
    
    // Confirm seat selection
    $('#confirm-seat-selection').click(function() {
        if (currentBooking.selectedSeats.length !== currentBooking.passengers) {
            showToast('Debe seleccionar todos los asientos requeridos', 'error');
            return;
        }
        
        // Proceed to payment
        hideModal('#seat-modal');
        showPaymentModal();
    });
    
    // Seat modal background click
    $('#seat-modal').click(function(e) {
        if (e.target === this) {
            hideModal('#seat-modal');
            resetSeatSelection();
        }
    });
});

// Seat selection utilities
const SeatHelper = {
    // Get seat type (window, middle, aisle)
    getSeatType: function(position) {
        const types = {
            'A': 'window',
            'B': 'middle', 
            'C': 'aisle',
            'D': 'window'
        };
        return types[position] || 'unknown';
    },
    
    // Get seat preferences
    getSeatPreferences: function(seatCode) {
        const row = parseInt(seatCode.slice(0, -1));
        const position = seatCode.slice(-1);
        const type = this.getSeatType(position);
        
        const preferences = [];
        
        // Front of plane
        if (row <= 5) {
            preferences.push('Primera fila');
        }
        
        // Exit rows (typically 12-14)
        if (row >= 12 && row <= 14) {
            preferences.push('Fila de emergencia - Espacio extra');
        }
        
        // Seat type
        if (type === 'window') {
            preferences.push('Ventana');
        } else if (type === 'aisle') {
            preferences.push('Pasillo');
        }
        
        return preferences;
    },
    
    // Check if seats are together (for multiple passengers)
    areSeatsAdjacent: function(seats) {
        if (seats.length <= 1) return true;
        
        const sortedSeats = seats.sort((a, b) => {
            const rowA = parseInt(a.slice(0, -1));
            const rowB = parseInt(b.slice(0, -1));
            if (rowA !== rowB) return rowA - rowB;
            return a.slice(-1).localeCompare(b.slice(-1));
        });
        
        for (let i = 0; i < sortedSeats.length - 1; i++) {
            const currentSeat = sortedSeats[i];
            const nextSeat = sortedSeats[i + 1];
            
            const currentRow = parseInt(currentSeat.slice(0, -1));
            const currentPos = currentSeat.slice(-1);
            const nextRow = parseInt(nextSeat.slice(0, -1));
            const nextPos = nextSeat.slice(-1);
            
            // Check if in same row and adjacent positions
            if (currentRow === nextRow) {
                const positions = ['A', 'B', 'C', 'D'];
                const currentIndex = positions.indexOf(currentPos);
                const nextIndex = positions.indexOf(nextPos);
                
                // Allow gap between B and C (aisle)
                if (Math.abs(nextIndex - currentIndex) > 1 && !(currentPos === 'B' && nextPos === 'C')) {
                    return false;
                }
            } else {
                return false; // Different rows
            }
        }
        
        return true;
    },
    
    // Auto-select adjacent seats
    autoSelectSeats: function(startSeat, count) {
        const row = parseInt(startSeat.slice(0, -1));
        const position = startSeat.slice(-1);
        const positions = ['A', 'B', 'C', 'D'];
        const startIndex = positions.indexOf(position);
        
        const selectedSeats = [];
        
        // Try to select adjacent seats in the same row
        for (let i = 0; i < count; i++) {
            let targetIndex = startIndex + i;
            
            // Skip aisle if going from B to C
            if (startIndex <= 1 && targetIndex >= 2 && i > 0) {
                targetIndex = Math.min(targetIndex, 3);
            }
            
            if (targetIndex < positions.length) {
                const seatCode = `${row}${positions[targetIndex]}`;
                const seatElement = $(`.seat[data-seat="${seatCode}"]`);
                
                if (seatElement.hasClass('available')) {
                    selectedSeats.push(seatCode);
                }
            }
        }
        
        return selectedSeats;
    }
};

// Add quick seat selection helpers
function addSeatSelectionHelpers() {
    const helpersHTML = `
        <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <h5 class="font-semibold text-gray-700 mb-2">Selección rápida:</h5>
            <div class="flex flex-wrap gap-2">
                <button class="quick-select-btn" data-preference="window">
                    <i class="fas fa-eye mr-1"></i>Ventana
                </button>
                <button class="quick-select-btn" data-preference="aisle">
                    <i class="fas fa-walking mr-1"></i>Pasillo
                </button>
                <button class="quick-select-btn" data-preference="front">
                    <i class="fas fa-arrow-up mr-1"></i>Adelante
                </button>
                <button class="quick-select-btn" data-preference="together">
                    <i class="fas fa-users mr-1"></i>Juntos
                </button>
            </div>
        </div>
    `;
    
    $('#airplane-seats').before(helpersHTML);
}

// Handle quick seat selection
$(document).on('click', '.quick-select-btn', function() {
    const preference = $(this).data('preference');
    quickSelectSeats(preference);
});

function quickSelectSeats(preference) {
    // Reset current selection
    resetSeatSelection();
    
    const availableSeats = $('.seat.available');
    let selectedSeats = [];
    
    switch (preference) {
        case 'window':
            availableSeats.each(function() {
                const position = $(this).data('position');
                if ((position === 'A' || position === 'D') && selectedSeats.length < currentBooking.passengers) {
                    selectedSeats.push($(this).data('seat'));
                    $(this).removeClass('available').addClass('selected');
                }
            });
            break;
            
        case 'aisle':
            availableSeats.each(function() {
                const position = $(this).data('position');
                if ((position === 'B' || position === 'C') && selectedSeats.length < currentBooking.passengers) {
                    selectedSeats.push($(this).data('seat'));
                    $(this).removeClass('available').addClass('selected');
                }
            });
            break;
            
        case 'front':
            availableSeats.each(function() {
                const row = $(this).data('row');
                if (row <= 5 && selectedSeats.length < currentBooking.passengers) {
                    selectedSeats.push($(this).data('seat'));
                    $(this).removeClass('available').addClass('selected');
                }
            });
            break;
            
        case 'together':
            // Find adjacent available seats
            for (let row = 1; row <= 20; row++) {
                const rowSeats = [
                    $(`.seat[data-seat="${row}A"]`),
                    $(`.seat[data-seat="${row}B"]`),
                    $(`.seat[data-seat="${row}C"]`),
                    $(`.seat[data-seat="${row}D"]`)
                ];
                
                // Check AB or CD pairs first
                if (currentBooking.passengers <= 2) {
                    if (rowSeats[0].hasClass('available') && rowSeats[1].hasClass('available')) {
                        for (let i = 0; i < Math.min(2, currentBooking.passengers); i++) {
                            selectedSeats.push(rowSeats[i].data('seat'));
                            rowSeats[i].removeClass('available').addClass('selected');
                        }
                        break;
                    }
                    if (rowSeats[2].hasClass('available') && rowSeats[3].hasClass('available')) {
                        for (let i = 2; i < Math.min(4, 2 + currentBooking.passengers); i++) {
                            selectedSeats.push(rowSeats[i].data('seat'));
                            rowSeats[i].removeClass('available').addClass('selected');
                        }
                        break;
                    }
                }
                
                // Check for larger groups
                if (currentBooking.passengers > 2) {
                    let consecutive = 0;
                    let startIndex = 0;
                    
                    for (let i = 0; i < rowSeats.length; i++) {
                        if (rowSeats[i].hasClass('available')) {
                            if (consecutive === 0) startIndex = i;
                            consecutive++;
                            
                            if (consecutive >= currentBooking.passengers) {
                                for (let j = startIndex; j < startIndex + currentBooking.passengers; j++) {
                                    selectedSeats.push(rowSeats[j].data('seat'));
                                    rowSeats[j].removeClass('available').addClass('selected');
                                }
                                break;
                            }
                        } else {
                            consecutive = 0;
                        }
                    }
                    
                    if (selectedSeats.length === currentBooking.passengers) break;
                }
            }
            break;
    }
    
    currentBooking.selectedSeats = selectedSeats;
    updateSeatSelectionUI();
    
    if (selectedSeats.length < currentBooking.passengers) {
        showToast(`Solo se pudieron seleccionar ${selectedSeats.length} de ${currentBooking.passengers} asientos con esta preferencia`, 'warning');
    }
}
