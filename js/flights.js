// Flight-specific functionality for Flight Reservation System

// Enhanced flight search and display functionality
const FlightManager = {
    // Current search parameters
    currentSearch: null,
    
    // Search flights with advanced options
    searchFlights: function(searchParams) {
        this.currentSearch = searchParams;
        
        // Get flights from data helper
        const flights = DataHelper.buscarVuelos(
            searchParams.origin,
            searchParams.destination, 
            searchParams.date
        );
        
        // Add additional flight information
        const enhancedFlights = flights.map(flight => {
            return this.enhanceFlightData(flight);
        });
        
        // Apply filters and sorting
        let filteredFlights = this.applyAdvancedFilters(enhancedFlights, searchParams);
        
        return filteredFlights;
    },
    
    // Enhance flight data with calculated fields
    enhanceFlightData: function(flight) {
        const enhanced = { ...flight };
        
        // Calculate arrival time
        enhanced.hora_llegada = DataHelper.calcularHoraLlegada(flight.hora_salida, flight.duracion);
        
        // Add airport information
        enhanced.origen_info = DataHelper.getAeropuerto(flight.origen);
        enhanced.destino_info = DataHelper.getAeropuerto(flight.destino);
        
        // Calculate seat availability
        const asientosDisponibles = DataHelper.getAsientosDisponibles(
            flight.aerolinea, 
            flight.numero, 
            flight.fecha
        );
        enhanced.asientos_disponibles = asientosDisponibles.length;
        enhanced.ocupacion_porcentaje = Math.round((1 - asientosDisponibles.length / 80) * 100);
        
        // Add price category
        enhanced.categoria_precio = this.getPriceCategory(flight.precio);
        
        // Add duration in minutes for sorting
        enhanced.duracion_minutos = this.parseDurationToMinutes(flight.duracion);
        
        // Add departure time in minutes for sorting
        enhanced.salida_minutos = this.parseTimeToMinutes(flight.hora_salida);
        
        // Flight status simulation
        enhanced.estado = this.getFlightStatus(flight);
        
        return enhanced;
    },
    
    // Apply advanced filters
    applyAdvancedFilters: function(flights, filters) {
        let filtered = [...flights];
        
        // Price range filter
        if (filters.minPrice || filters.maxPrice) {
            filtered = filtered.filter(flight => {
                const price = flight.precio * (filters.passengers || 1);
                return (!filters.minPrice || price >= filters.minPrice) &&
                       (!filters.maxPrice || price <= filters.maxPrice);
            });
        }
        
        // Time filters
        if (filters.departureTimeStart || filters.departureTimeEnd) {
            filtered = filtered.filter(flight => {
                const departureMinutes = flight.salida_minutos;
                return (!filters.departureTimeStart || departureMinutes >= filters.departureTimeStart) &&
                       (!filters.departureTimeEnd || departureMinutes <= filters.departureTimeEnd);
            });
        }
        
        // Duration filter
        if (filters.maxDuration) {
            filtered = filtered.filter(flight => flight.duracion_minutos <= filters.maxDuration);
        }
        
        // Airline filter
        if (filters.allowedAirlines && filters.allowedAirlines.length > 0) {
            filtered = filtered.filter(flight => filters.allowedAirlines.includes(flight.aerolinea));
        }
        
        // Seat availability filter
        if (filters.minSeatsAvailable) {
            filtered = filtered.filter(flight => flight.asientos_disponibles >= filters.minSeatsAvailable);
        }
        
        return filtered;
    },
    
    // Sort flights by various criteria
    sortFlights: function(flights, sortBy, sortOrder = 'asc') {
        return flights.sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'price':
                    comparison = a.precio - b.precio;
                    break;
                case 'time':
                    comparison = a.salida_minutos - b.salida_minutos;
                    break;
                case 'duration':
                    comparison = a.duracion_minutos - b.duracion_minutos;
                    break;
                case 'airline':
                    comparison = a.aerolinea_nombre.localeCompare(b.aerolinea_nombre);
                    break;
                case 'availability':
                    comparison = b.asientos_disponibles - a.asientos_disponibles;
                    break;
                default:
                    return 0;
            }
            
            return sortOrder === 'desc' ? -comparison : comparison;
        });
    },
    
    // Get price category
    getPriceCategory: function(price) {
        if (price < 500) return 'economico';
        if (price < 1000) return 'medio';
        if (price < 1500) return 'alto';
        return 'premium';
    },
    
    // Parse duration string to minutes
    parseDurationToMinutes: function(duration) {
        const [hours, minutes] = duration.split(':').map(Number);
        return hours * 60 + minutes;
    },
    
    // Parse time string to minutes since midnight
    parseTimeToMinutes: function(time) {
        const hours = parseInt(time.substring(0, 2));
        const minutes = parseInt(time.substring(2, 4));
        return hours * 60 + minutes;
    },
    
    // Get flight status (simulated)
    getFlightStatus: function(flight) {
        // Simulate various flight statuses
        const random = Math.random();
        if (random < 0.85) return 'A tiempo';
        if (random < 0.95) return 'Retrasado';
        return 'Cancelado';
    },
    
    // Get alternative flights
    getAlternativeFlights: function(originalFlight, searchParams) {
        // Find flights on adjacent dates
        const alternatives = [];
        const originalDate = new Date(originalFlight.fecha);
        
        // Check previous and next day
        for (let i = -1; i <= 1; i++) {
            if (i === 0) continue; // Skip original date
            
            const alternativeDate = new Date(originalDate);
            alternativeDate.setDate(alternativeDate.getDate() + i);
            const dateString = alternativeDate.toISOString().split('T')[0];
            
            const dayFlights = DataHelper.buscarVuelos(
                originalFlight.origen,
                originalFlight.destino,
                dateString
            );
            
            dayFlights.forEach(flight => {
                alternatives.push({
                    ...this.enhanceFlightData({ ...flight, fecha: dateString }),
                    date_difference: i
                });
            });
        }
        
        return alternatives;
    }
};

// Flight comparison functionality
const FlightComparison = {
    selectedFlights: [],
    
    // Add flight to comparison
    addToComparison: function(flight) {
        if (this.selectedFlights.length >= 3) {
            showToast('Solo puede comparar hasta 3 vuelos', 'warning');
            return false;
        }
        
        if (this.selectedFlights.find(f => f.aerolinea === flight.aerolinea && f.numero === flight.numero)) {
            showToast('Este vuelo ya está en la comparación', 'warning');
            return false;
        }
        
        this.selectedFlights.push(flight);
        this.updateComparisonUI();
        return true;
    },
    
    // Remove flight from comparison
    removeFromComparison: function(flightIndex) {
        this.selectedFlights.splice(flightIndex, 1);
        this.updateComparisonUI();
    },
    
    // Update comparison UI
    updateComparisonUI: function() {
        if (this.selectedFlights.length === 0) {
            $('#comparison-panel').hide();
            return;
        }
        
        const comparisonHTML = this.generateComparisonHTML();
        $('#comparison-panel').html(comparisonHTML).show();
    },
    
    // Generate comparison HTML
    generateComparisonHTML: function() {
        if (this.selectedFlights.length === 0) return '';
        
        let html = `
            <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">
                        <i class="fas fa-balance-scale mr-2"></i>Comparar Vuelos
                    </h3>
                    <button onclick="FlightComparison.clearComparison()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="grid grid-cols-${this.selectedFlights.length} gap-4">
        `;
        
        this.selectedFlights.forEach((flight, index) => {
            html += `
                <div class="border rounded p-3">
                    <div class="flex justify-between items-start mb-2">
                        <div class="font-semibold">${flight.aerolinea_nombre}</div>
                        <button onclick="FlightComparison.removeFromComparison(${index})" 
                                class="text-red-500 hover:text-red-700 text-sm">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="space-y-1 text-sm">
                        <div><strong>Vuelo:</strong> ${flight.aerolinea}${flight.numero}</div>
                        <div><strong>Salida:</strong> ${DataHelper.formatTime(flight.hora_salida)}</div>
                        <div><strong>Duración:</strong> ${flight.duracion}</div>
                        <div><strong>Precio:</strong> $${flight.precio}</div>
                        <div><strong>Asientos:</strong> ${flight.asientos_disponibles}</div>
                    </div>
                    <button onclick="selectFlightFromComparison(${index})" 
                            class="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm">
                        Seleccionar
                    </button>
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    },
    
    // Clear comparison
    clearComparison: function() {
        this.selectedFlights = [];
        this.updateComparisonUI();
    }
};

// Flight recommendations
const FlightRecommendations = {
    // Get personalized recommendations
    getRecommendations: function(searchParams, userPreferences = {}) {
        const allFlights = FlightManager.searchFlights(searchParams);
        
        // Score flights based on user preferences
        const scoredFlights = allFlights.map(flight => {
            let score = 0;
            
            // Price preference (lower prices get higher scores)
            const maxPrice = Math.max(...allFlights.map(f => f.precio));
            score += (1 - flight.precio / maxPrice) * 30;
            
            // Time preference
            if (userPreferences.preferredTime) {
                const timeDiff = Math.abs(flight.salida_minutos - userPreferences.preferredTime);
                score += Math.max(0, 20 - timeDiff / 30);
            }
            
            // Duration preference (shorter flights get higher scores)
            const maxDuration = Math.max(...allFlights.map(f => f.duracion_minutos));
            score += (1 - flight.duracion_minutos / maxDuration) * 20;
            
            // Seat availability
            score += (flight.asientos_disponibles / 80) * 15;
            
            // Airline preference
            if (userPreferences.preferredAirlines && 
                userPreferences.preferredAirlines.includes(flight.aerolinea)) {
                score += 15;
            }
            
            return { ...flight, recommendation_score: score };
        });
        
        // Sort by score and return top recommendations
        return scoredFlights
            .sort((a, b) => b.recommendation_score - a.recommendation_score)
            .slice(0, 3);
    },
    
    // Get user preferences from history
    getUserPreferences: function() {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const userTransactions = transactions.filter(t => t.usuario === currentUser?.email);
        
        if (userTransactions.length === 0) return {};
        
        // Analyze user booking patterns
        const preferences = {
            preferredAirlines: [],
            preferredTime: null,
            averagePrice: 0
        };
        
        // Calculate preferred airlines
        const airlineCounts = {};
        userTransactions.forEach(t => {
            const airline = t.vuelo.substring(0, 2);
            airlineCounts[airline] = (airlineCounts[airline] || 0) + 1;
        });
        
        preferences.preferredAirlines = Object.keys(airlineCounts)
            .sort((a, b) => airlineCounts[b] - airlineCounts[a])
            .slice(0, 2);
        
        // Calculate average price
        const totalPrice = userTransactions.reduce((sum, t) => sum + t.monto, 0);
        preferences.averagePrice = totalPrice / userTransactions.length;
        
        return preferences;
    }
};

// Advanced search filters
function setupAdvancedFilters() {
    const advancedFiltersHTML = `
        <div id="advanced-filters" class="hidden bg-gray-50 p-4 rounded-lg mt-4">
            <h4 class="font-semibold mb-3">Filtros Avanzados</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Precio mínimo</label>
                    <input type="number" id="min-price" class="w-full p-2 border border-gray-300 rounded" placeholder="0">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Precio máximo</label>
                    <input type="number" id="max-price" class="w-full p-2 border border-gray-300 rounded" placeholder="5000">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Duración máxima</label>
                    <select id="max-duration" class="w-full p-2 border border-gray-300 rounded">
                        <option value="">Cualquiera</option>
                        <option value="120">2 horas</option>
                        <option value="240">4 horas</option>
                        <option value="480">8 horas</option>
                        <option value="720">12 horas</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Hora de salida desde</label>
                    <input type="time" id="departure-time-start" class="w-full p-2 border border-gray-300 rounded">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Hora de salida hasta</label>
                    <input type="time" id="departure-time-end" class="w-full p-2 border border-gray-300 rounded">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Asientos mínimos</label>
                    <input type="number" id="min-seats" class="w-full p-2 border border-gray-300 rounded" min="1" max="80" placeholder="1">
                </div>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
                <button id="clear-filters" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Limpiar Filtros
                </button>
                <button id="apply-filters" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Aplicar Filtros
                </button>
            </div>
        </div>
    `;
    
    $('#search-section').append(advancedFiltersHTML);
    
    // Add toggle button
    const toggleButton = `
        <button id="toggle-advanced-filters" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            <i class="fas fa-filter mr-1"></i>Filtros Avanzados
        </button>
    `;
    $('#flight-search-form').after(toggleButton);
}

// Set up flight functionality when document is ready
$(document).ready(function() {
    // Advanced filters functionality is hidden per user request
    // setupAdvancedFilters();
    
    // Toggle advanced filters - commented out
    /*
    $(document).on('click', '#toggle-advanced-filters', function() {
        $('#advanced-filters').toggle();
        const icon = $(this).find('i');
        icon.toggleClass('fa-filter fa-filter-circle-xmark');
    });
    */
    
    // Apply advanced filters - commented out
    /*
    $(document).on('click', '#apply-filters', function() {
        applyAdvancedFiltersToResults();
    });
    */
    
    // Clear filters - commented out
    /*
    $(document).on('click', '#clear-filters', function() {
        clearAdvancedFilters();
    });
    */
    
    // Add flight to comparison
    $(document).on('click', '.compare-flight-btn', function(e) {
        e.stopPropagation();
        const flightCard = $(this).closest('.flight-card');
        const flight = JSON.parse(flightCard.attr('data-flight'));
        FlightComparison.addToComparison(flight);
    });
    
    // Initialize comparison panel
    $('body').append('<div id="comparison-panel" class="hidden"></div>');
});

// Apply advanced filters to current results
function applyAdvancedFiltersToResults() {
    const filters = {
        minPrice: parseInt($('#min-price').val()) || null,
        maxPrice: parseInt($('#max-price').val()) || null,
        maxDuration: parseInt($('#max-duration').val()) || null,
        departureTimeStart: timeToMinutes($('#departure-time-start').val()) || null,
        departureTimeEnd: timeToMinutes($('#departure-time-end').val()) || null,
        minSeatsAvailable: parseInt($('#min-seats').val()) || 1,
        passengers: parseInt($('#passengers').val()) || 1
    };
    
    // Get all flight cards and filter them
    $('.flight-card').each(function() {
        const flight = JSON.parse($(this).attr('data-flight'));
        const enhanced = FlightManager.enhanceFlightData(flight);
        const matchesFilters = checkFlightAgainstFilters(enhanced, filters);
        
        if (matchesFilters) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
    
    showToast('Filtros aplicados', 'success');
}

// Clear advanced filters
function clearAdvancedFilters() {
    $('#min-price, #max-price, #max-duration, #departure-time-start, #departure-time-end, #min-seats').val('');
    $('.flight-card').show();
    showToast('Filtros limpiados', 'info');
}

// Check if flight matches filters
function checkFlightAgainstFilters(flight, filters) {
    const price = flight.precio * filters.passengers;
    
    if (filters.minPrice && price < filters.minPrice) return false;
    if (filters.maxPrice && price > filters.maxPrice) return false;
    if (filters.maxDuration && flight.duracion_minutos > filters.maxDuration) return false;
    if (filters.departureTimeStart && flight.salida_minutos < filters.departureTimeStart) return false;
    if (filters.departureTimeEnd && flight.salida_minutos > filters.departureTimeEnd) return false;
    if (filters.minSeatsAvailable && flight.asientos_disponibles < filters.minSeatsAvailable) return false;
    
    return true;
}

// Utility function to convert time string to minutes
function timeToMinutes(timeString) {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// Select flight from comparison
function selectFlightFromComparison(index) {
    const flight = FlightComparison.selectedFlights[index];
    
    // Store current booking info
    currentBooking = {
        flight: flight,
        passengers: parseInt($('#passengers').val()) || 1,
        selectedSeats: [],
        totalPrice: flight.precio * (parseInt($('#passengers').val()) || 1)
    };
    
    // Show seat selection
    showSeatSelection(flight);
    
    // Clear comparison
    FlightComparison.clearComparison();
}
