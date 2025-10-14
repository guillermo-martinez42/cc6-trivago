// Main JavaScript file for Flight Reservation System
// Handles general functionality, user authentication, and navigation

$(document).ready(function() {
    // Initialize the application
    initializeApp();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check user session
    checkUserSession();
});

// Global variables
let currentUser = null;
let currentBooking = null;

// Initialize application
function initializeApp() {
    // Populate airport dropdowns
    populateAirports();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    $('#departure-date').attr('min', today);
    
    // Initialize toast container
    if ($('#toast-container').length === 0) {
        $('body').append('<div id="toast-container" class="fixed top-4 right-4 z-50 space-y-2"></div>');
    }
}

// Set up event listeners
function setupEventListeners() {
    // Authentication
    $('#login-btn').click(() => showModal('#login-modal'));
    $('#register-btn').click(() => showModal('#register-modal'));
    $('#logout-btn').click(logout);
    
    // Modal close buttons
    $('.modal-close, [id$="-modal"] button[id^="close-"]').click(function() {
        const modalId = $(this).closest('[id$="-modal"]').attr('id');
        hideModal(`#${modalId}`);
    });
    
    // Authentication form switches
    $('#switch-to-register').click(() => {
        hideModal('#login-modal');
        showModal('#register-modal');
    });
    
    $('#switch-to-login').click(() => {
        hideModal('#register-modal');
        showModal('#login-modal');
    });
    
    // Form submissions
    $('#login-form').submit(handleLogin);
    $('#register-form').submit(handleRegister);
    $('#flight-search-form').submit(handleFlightSearch);
    
    // Results filtering and sorting
    $('#sort-filter').change(sortFlights);
    $('#airline-filter').change(filterByAirline);
    
    // Modal background clicks
    $('[id$="-modal"]').click(function(e) {
        if (e.target === this) {
            hideModal(`#${$(this).attr('id')}`);
        }
    });
    
    // Input formatting
    $('#card-number').on('input', formatCardNumber);
    $('#card-expiry').on('input', formatExpiryDate);
    $('#card-cvv').on('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 3);
    });
    
    // New search button
    $('#new-search').click(() => {
        hideModal('#confirmation-modal');
        resetSearchForm();
    });
}

// Populate airport dropdowns
function populateAirports() {
    const originSelect = $('#origin');
    const destinationSelect = $('#destination');
    
    originSelect.empty().append('<option value="">Seleccionar origen</option>');
    destinationSelect.empty().append('<option value="">Seleccionar destino</option>');
    
    aeropuertos.forEach(airport => {
        const option = `<option value="${airport.codigo}">${airport.codigo} - ${airport.nombre}</option>`;
        originSelect.append(option);
        destinationSelect.append(option);
    });
}

// User Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = $('#login-email').val();
    const password = $('#login-password').val();
    
    showLoading();
    
    // Call backend API
    $.ajax({
        url: '/api/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: email,
            password: password
        }),
        success: function(response) {
            hideLoading();
            currentUser = response.user;
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            updateUserInterface();
            hideModal('#login-modal');
            showToast('Sesión iniciada correctamente', 'success');
        },
        error: function(xhr) {
            hideLoading();
            const errorMsg = xhr.responseJSON?.error || 'Email o contraseña incorrectos';
            showToast(errorMsg, 'error');
        }
    });
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = $('#register-name').val();
    const email = $('#register-email').val();
    const password = $('#register-password').val();
    const document = $('#register-document').val();
    
    showLoading();
    
    // Call backend API
    $.ajax({
        url: '/api/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            full_name: name,
            email: email,
            password: password,
            travel_document: document
        }),
        success: function(response) {
            hideLoading();
            showToast('Cuenta creada correctamente. Por favor inicie sesión.', 'success');
            hideModal('#register-modal');
            showModal('#login-modal');
            // Pre-fill login form
            $('#login-email').val(email);
        },
        error: function(xhr) {
            hideLoading();
            const errorMsg = xhr.responseJSON?.error || 'Error al crear la cuenta';
            showToast(errorMsg, 'error');
        }
    });
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showToast('Sesión cerrada', 'info');
}

function checkUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
}

function updateUserInterface() {
    if (currentUser) {
        $('#guest-menu').hide();
        $('#logged-in-menu').show();
        $('#user-welcome').text(`Bienvenido, ${currentUser.full_name || currentUser.name}`);
    } else {
        $('#guest-menu').show();
        $('#logged-in-menu').hide();
    }
}

// Flight Search Functions
function handleFlightSearch(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showToast('Debe iniciar sesión para buscar vuelos', 'warning');
        showModal('#login-modal');
        return;
    }
    
    const origin = $('#origin').val();
    const destination = $('#destination').val();
    const date = $('#departure-date').val();
    const passengers = $('#passengers').val();
    
    if (!origin || !destination || !date) {
        showToast('Por favor complete todos los campos', 'error');
        return;
    }
    
    if (origin === destination) {
        showToast('El origen y destino deben ser diferentes', 'error');
        return;
    }
    
    showLoading();
    
    // Convert date from YYYY-MM-DD to YYYYMMDD
    const formattedDate = date.replace(/-/g, '');
    
    // Call backend API
    $.ajax({
        url: '/api/flights',
        method: 'GET',
        data: {
            origen: origin,
            destino: destination,
            fecha: formattedDate,
            formato: 'JSON'
        },
        success: function(response) {
            hideLoading();
            // Extract flights from response
            const vuelosData = response.lista_vuelos;
            if (vuelosData && vuelosData.vuelos) {
                // Transform API response to match frontend format
                const flights = vuelosData.vuelos.map(vuelo => ({
                    aerolinea: vuelosData.aerolinea,
                    aerolinea_nombre: vuelosData.aerolinea, // Will use mock name for now
                    numero: vuelo.numero,
                    origen: vuelosData.origen,
                    destino: vuelosData.destino,
                    hora_salida: vuelo.hora,
                    duracion: '03:00', // Mock duration
                    precio: parseFloat(vuelo.precio),
                    avion: 'Boeing 737',
                    fecha: date
                }));
                
                displayFlightResults(flights, passengers);
                
                if (flights.length === 0) {
                    showToast('No se encontraron vuelos para la fecha seleccionada', 'info');
                }
            } else {
                showToast('No se encontraron vuelos', 'info');
                displayFlightResults([], passengers);
            }
        },
        error: function(xhr) {
            hideLoading();
            const errorMsg = xhr.responseJSON?.error || 'Error al buscar vuelos';
            showToast(errorMsg, 'error');
        }
    });
}

function displayFlightResults(flights, passengers) {
    const resultsSection = $('#results-section');
    const flightsList = $('#flights-list');
    const airlineFilter = $('#airline-filter');
    
    // Clear previous results
    flightsList.empty();
    
    // Update airline filter
    airlineFilter.empty().append('<option value="">Todas las aerolíneas</option>');
    const airlines = [...new Set(flights.map(f => f.aerolinea))];
    airlines.forEach(airline => {
        const aerolinea = DataHelper.getAerolinea(airline);
        airlineFilter.append(`<option value="${airline}">${aerolinea.nombre}</option>`);
    });
    
    if (flights.length === 0) {
        flightsList.html(`
            <div class="text-center py-12">
                <i class="fas fa-plane-slash text-6xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600">No se encontraron vuelos</h3>
                <p class="text-gray-500">Intente con diferentes fechas o destinos</p>
            </div>
        `);
    } else {
        flights.forEach(flight => {
            const flightCard = createFlightCard(flight, passengers);
            flightsList.append(flightCard);
        });
    }
    
    // Show results section
    resultsSection.removeClass('hidden').addClass('fade-in');
    
    // Scroll to results
    $('html, body').animate({
        scrollTop: resultsSection.offset().top - 100
    }, 500);
}

function createFlightCard(flight, passengers) {
    const origenInfo = DataHelper.getAeropuerto(flight.origen);
    const destinoInfo = DataHelper.getAeropuerto(flight.destino);
    const horaLlegada = DataHelper.calcularHoraLlegada(flight.hora_salida, flight.duracion);
    const precioTotal = flight.precio * parseInt(passengers);
    
    return $(`
        <div class="flight-card bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer" 
             data-flight='${JSON.stringify(flight)}' data-passengers="${passengers}">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="airline-logo">
                        ${flight.aerolinea}
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg text-gray-800">${flight.aerolinea_nombre}</h3>
                        <p class="text-sm text-gray-600">Vuelo ${flight.aerolinea}${flight.numero}</p>
                        <p class="text-xs text-gray-500">${flight.avion}</p>
                    </div>
                </div>
                
                <div class="flex items-center space-x-8">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-gray-800">${DataHelper.formatTime(flight.hora_salida)}</div>
                        <div class="text-sm text-gray-600">${flight.origen}</div>
                        <div class="text-xs text-gray-500">${origenInfo.ciudad}</div>
                    </div>
                    
                    <div class="flex flex-col items-center">
                        <div class="text-sm text-gray-600">${flight.duracion}</div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-px bg-gray-400"></div>
                            <i class="fas fa-plane text-gray-400"></i>
                            <div class="w-4 h-px bg-gray-400"></div>
                        </div>
                        <div class="text-xs text-gray-500">Directo</div>
                    </div>
                    
                    <div class="text-center">
                        <div class="text-2xl font-bold text-gray-800">${horaLlegada}</div>
                        <div class="text-sm text-gray-600">${flight.destino}</div>
                        <div class="text-xs text-gray-500">${destinoInfo.ciudad}</div>
                    </div>
                </div>
                
                <div class="text-right">
                    <div class="text-3xl font-bold price-highlight">$${precioTotal}</div>
                    <div class="text-sm text-gray-600">Total para ${passengers} pasajero${passengers > 1 ? 's' : ''}</div>
                    <button class="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold select-flight-btn">
                        Seleccionar
                    </button>
                </div>
            </div>
        </div>
    `);
}

// Flight filtering and sorting
function sortFlights() {
    const sortBy = $('#sort-filter').val();
    const flightCards = $('.flight-card').get();
    
    flightCards.sort((a, b) => {
        const flightA = JSON.parse($(a).attr('data-flight'));
        const flightB = JSON.parse($(b).attr('data-flight'));
        const passengersA = parseInt($(a).attr('data-passengers'));
        const passengersB = parseInt($(b).attr('data-passengers'));
        
        if (sortBy === 'price') {
            return (flightA.precio * passengersA) - (flightB.precio * passengersB);
        } else if (sortBy === 'time') {
            return flightA.hora_salida.localeCompare(flightB.hora_salida);
        }
        return 0;
    });
    
    const flightsList = $('#flights-list');
    flightsList.empty();
    flightCards.forEach(card => flightsList.append(card));
}

function filterByAirline() {
    const selectedAirline = $('#airline-filter').val();
    
    $('.flight-card').each(function() {
        const flight = JSON.parse($(this).attr('data-flight'));
        if (!selectedAirline || flight.aerolinea === selectedAirline) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

// Utility Functions
function showModal(modalId) {
    $(modalId).removeClass('hidden').addClass('modal-enter');
    $('body').addClass('overflow-hidden');
}

function hideModal(modalId) {
    $(modalId).addClass('modal-exit');
    setTimeout(() => {
        $(modalId).addClass('hidden').removeClass('modal-enter modal-exit');
        $('body').removeClass('overflow-hidden');
    }, 300);
}

function showLoading() {
    $('#loading-overlay').removeClass('hidden');
}

function hideLoading() {
    $('#loading-overlay').addClass('hidden');
}

function showToast(message, type = 'info') {
    const toastId = 'toast-' + Date.now();
    const iconClass = {
        'success': 'fas fa-check-circle text-green-500',
        'error': 'fas fa-exclamation-circle text-red-500',
        'warning': 'fas fa-exclamation-triangle text-yellow-500',
        'info': 'fas fa-info-circle text-blue-500'
    }[type];
    
    const backgroundColor = {
        'success': 'bg-green-50 border-green-200',
        'error': 'bg-red-50 border-red-200', 
        'warning': 'bg-yellow-50 border-yellow-200',
        'info': 'bg-blue-50 border-blue-200'
    }[type];
    
    const toast = $(`
        <div id="${toastId}" class="toast ${backgroundColor} border rounded-lg p-4 shadow-lg max-w-sm">
            <div class="flex items-center space-x-3">
                <i class="${iconClass}"></i>
                <span class="text-gray-800 font-medium">${message}</span>
                <button class="ml-auto text-gray-500 hover:text-gray-700" onclick="removeToast('${toastId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `);
    
    $('#toast-container').append(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => removeToast(toastId), 5000);
}

function removeToast(toastId) {
    const toast = $(`#${toastId}`);
    toast.addClass('removing');
    setTimeout(() => toast.remove(), 300);
}

function formatCardNumber() {
    let value = this.value.replace(/\s/g, '').replace(/\D/g, '');
    value = value.substring(0, 16);
    value = value.replace(/(.{4})/g, '$1 ');
    this.value = value.trim();
}

function formatExpiryDate() {
    let value = this.value.replace(/\D/g, '');
    if (value.length >= 4) {
        value = value.substring(0, 4) + '-' + value.substring(4, 6);
    }
    this.value = value.substring(0, 7);
}

function resetSearchForm() {
    $('#flight-search-form')[0].reset();
    $('#results-section').addClass('hidden');
    const today = new Date().toISOString().split('T')[0];
    $('#departure-date').attr('min', today);
}

// Handle flight card clicks
$(document).on('click', '.flight-card', function(e) {
    if (!$(e.target).hasClass('select-flight-btn')) {
        $(this).find('.select-flight-btn').click();
    }
});

// Handle select flight button clicks
$(document).on('click', '.select-flight-btn', function(e) {
    e.stopPropagation();
    
    const flightCard = $(this).closest('.flight-card');
    const flight = JSON.parse(flightCard.attr('data-flight'));
    const passengers = flightCard.attr('data-passengers');
    
    // Store current booking info
    currentBooking = {
        flight: flight,
        passengers: parseInt(passengers),
        selectedSeats: [],
        totalPrice: flight.precio * parseInt(passengers)
    };
    
    // Show seat selection
    showSeatSelection(flight);
});
