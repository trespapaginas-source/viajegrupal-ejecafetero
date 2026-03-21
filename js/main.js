        // =======================================================================
        // SISTEMA DE SEGURIDAD Y OFUSCACIÓN (Antispam y Anti-scrapers)
        // =======================================================================
        
        // 1. Divide tu Número de WhatsApp en 3 o 4 pedazos. 
        const _waParts = ['57', '333', '255', '5034']; // Tu número real segmentado
        
        // 2. Enlace real de Make fragmentado por seguridad
        const _urlParts = ['https://hook.us2.make.', 'com/6rdohxbgs', '1lkx95jq2kk6n', 'vdghc56ukj']; 
        
        function getWa() { return _waParts.join(''); }
        function getUrl() { return _urlParts.join(''); }

        const DEPOSIT_PRICE = 200000;
        
        let bookingState = {
            isOpen: false,
            step: 1,
            numSpots: 1,
            passengers: [], 
            currentPassengerIndex: 1,
            isBot: false 
        };

        let timerInterval = null;

        const bookingContainer = document.getElementById('bookingFlowContainer');
        const bookingBody = document.getElementById('bookingBody');
        const btnStartBooking = document.getElementById('btnStartBooking');
        const carouselTrack = document.getElementById('carouselTrack');

        window.onload = function() {
            checkActiveRetention();
            initCarousels(); 
        }

        let carouselIntervalId;
        let hotelCarouselIntervalId;
        window.isDraggingCarousel = false; 
        
        function initCarousels() {
            setupSafeTrack('carouselTrack');
            setupSafeTrack('hotelCarouselTrack');
            
            startCarouselTimer();
            startHotelCarouselTimer();

            document.querySelectorAll('#carouselTrack img, #hotelCarouselTrack img').forEach(img => {
                img.classList.remove('pointer-events-none'); 
                img.draggable = false; 
                img.classList.add('cursor-pointer');
                
                img.closest('div').onclick = function() {
                    if (window.isDraggingCarousel) return; 
                    openLightbox(img.src);
                };
            });
        }

        function setupSafeTrack(trackId) {
            const track = document.getElementById(trackId);
            if (!track) return;

            // Detectamos si el usuario está arrastrando con el dedo
            track.addEventListener('touchmove', () => { window.isDraggingCarousel = true; }, {passive: true});
            track.addEventListener('touchend', () => { setTimeout(() => window.isDraggingCarousel = false, 150); }, {passive: true});

            // Pausar auto-play si el usuario interactúa
            track.addEventListener('mouseenter', () => stopTimers(trackId));
            track.addEventListener('mouseleave', () => startTimers(trackId));
            track.addEventListener('touchstart', () => stopTimers(trackId), {passive: true});
            track.addEventListener('touchend', () => startTimers(trackId), {passive: true});
        }

        function stopTimers(trackId) {
            if (trackId === 'carouselTrack') clearInterval(carouselIntervalId);
            if (trackId === 'hotelCarouselTrack') clearInterval(hotelCarouselIntervalId);
        }
        function startTimers(trackId) {
            if (trackId === 'carouselTrack') startCarouselTimer();
            if (trackId === 'hotelCarouselTrack') startHotelCarouselTimer();
        }

        function startCarouselTimer() {
            clearInterval(carouselIntervalId);
            carouselIntervalId = setInterval(() => scrollCarousel(1), 3500); 
        }
        function startHotelCarouselTimer() {
            clearInterval(hotelCarouselIntervalId);
            hotelCarouselIntervalId = setInterval(() => scrollHotelCarousel(1), 4000); 
        }

        function scrollCarousel(direction) {
            stopTimers('carouselTrack'); // Pausar automático al tocar botones
            const track = document.getElementById('carouselTrack');
            if (!track) return;
            
            const gap = 24; // Espaciado del primer carrusel
            const itemWidth = track.children[0].offsetWidth + gap;
            
            // Calculamos exactamente qué foto está en el centro
            let currentIndex = Math.round(track.scrollLeft / itemWidth);
            let nextIndex = currentIndex + direction;
            
            // Control de topes sin pantallas en blanco
            const maxIndex = track.children.length - 1;
            if (nextIndex < 0) nextIndex = maxIndex; // Si da atrás en la primera, va a la última
            if (nextIndex > maxIndex) nextIndex = 0; // Si da adelante en la última, vuelve a la primera

            track.scrollTo({ left: nextIndex * itemWidth, behavior: 'smooth' });
        }
        
        function scrollHotelCarousel(direction) {
            stopTimers('hotelCarouselTrack');
            const track = document.getElementById('hotelCarouselTrack');
            if (!track) return;
            
            const gap = 16; // Espaciado del carrusel del hotel
            const itemWidth = track.children[0].offsetWidth + gap;
            
            let currentIndex = Math.round(track.scrollLeft / itemWidth);
            let nextIndex = currentIndex + direction;
            
            const maxIndex = track.children.length - 1;
            if (nextIndex < 0) nextIndex = maxIndex;
            if (nextIndex > maxIndex) nextIndex = 0;

            track.scrollTo({ left: nextIndex * itemWidth, behavior: 'smooth' });
        }

        function openLightbox(src) {
            const modal = document.getElementById('lightboxModal');
            const img = document.getElementById('lightboxImage');
            img.src = src;
            modal.classList.remove('hidden');
            
            clearInterval(carouselIntervalId);
            clearInterval(hotelCarouselIntervalId);

            setTimeout(() => {
                modal.classList.remove('opacity-0');
                img.classList.remove('scale-95');
                img.classList.add('scale-100');
            }, 10);
        }

        function closeLightbox(e) {
            const modal = document.getElementById('lightboxModal');
            const img = document.getElementById('lightboxImage');
            modal.classList.add('opacity-0');
            img.classList.remove('scale-100');
            img.classList.add('scale-95');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                img.src = '';
            }, 300);
        }

        // --- FUNCIONES DE MODALES LEGALES ---
        function openPrivacyModal(e) {
            e.preventDefault();
            document.getElementById('privacyModal').classList.remove('hidden');
        }
        function closePrivacyModal() {
            document.getElementById('privacyModal').classList.add('hidden');
        }

        function openTermsModal(e) {
            e.preventDefault();
            document.getElementById('termsModal').classList.remove('hidden');
        }
        function closeTermsModal() {
            document.getElementById('termsModal').classList.add('hidden');
        }

        function openCancelModal(e) {
            e.preventDefault();
            document.getElementById('cancelModal').classList.remove('hidden');
        }
        function closeCancelModal() {
            document.getElementById('cancelModal').classList.add('hidden');
        }

        function scrollToPricing() {
            document.getElementById('tarifas').scrollIntoView({ behavior: 'smooth' });
        }

        function scrollToPricingAndOpen() {
            scrollToPricing();
            if (!bookingState.isOpen) {
                setTimeout(toggleBookingFlow, 400); 
            }
        }

        // --- LÓGICA DE ACORDEÓN (ITINERARIO ESTRICTO) ---
        function toggleAccordion(id) {
            // 1. Cerramos todos los días primero (excepto el que acabamos de tocar)
            const allDays = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];
            allDays.forEach(dayId => {
                if (dayId !== id) {
                    const otherContent = document.getElementById('content-' + dayId);
                    const otherIcon = document.getElementById('icon-' + dayId);
                    if (otherContent && !otherContent.classList.contains('hidden')) {
                        otherContent.classList.add('hidden');
                        otherIcon.classList.remove('fa-minus', 'text-brand-cyan');
                        otherIcon.classList.add('fa-plus', 'text-gray-400');
                    }
                }
            });

            // 2. Abrimos o cerramos el día al que se le dio clic
            const content = document.getElementById('content-' + id);
            const icon = document.getElementById('icon-' + id);
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.classList.remove('fa-plus', 'text-gray-400');
                icon.classList.add('fa-minus', 'text-brand-cyan');
            } else {
                content.classList.add('hidden');
                icon.classList.remove('fa-minus', 'text-brand-cyan');
                icon.classList.add('fa-plus', 'text-gray-400');
            }
        }

        function formatCurrency(amount) {
            return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
        }

        function toggleBookingFlow() {
            bookingState.isOpen = !bookingState.isOpen;
            if (bookingState.isOpen) {
                if (!localStorage.getItem('retentionExpiry')) {
                    bookingState.step = 1;
                    bookingState.numSpots = 1;
                    bookingState.passengers = [];
                    bookingState.currentPassengerIndex = 1;
                    bookingState.isBot = false;
                }
                bookingContainer.classList.add('open');
                btnStartBooking.classList.add('hidden');
                renderStep();

                // --- DISPARO PIXEL: Inició el proceso de reserva ---
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'InitiateCheckout');
                }
            } else {
                bookingContainer.classList.remove('open');
                btnStartBooking.classList.remove('hidden');
            }
        }

// --- FUNCIONALIDAD DEL BOTÓN ATRÁS (PASO 2 -> PASO 1) ---
function goBackFromStep2() {
    bookingState.step = 1;
    renderStep();
}
// --------------------------------------------------------

        function renderStep() {
            bookingBody.innerHTML = ''; 
            
            if (bookingState.step === 1) {
                bookingBody.innerHTML = `
                    <div class="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <h3 class="font-extrabold text-xl text-brand-dark">¿Cuántos cupos quieres reservar?</h3>
                        <button onclick="toggleBookingFlow()" class="text-gray-400 hover:text-brand-dark text-xl transition">&times;</button>
                    </div>
                    <p class="text-sm text-gray-500 font-medium mb-6">Depósito por persona: 200.000 COP.</p>
                    
                    <div class="flex items-center mb-8 justify-center shadow-sm rounded-xl overflow-hidden border border-gray-200 w-max mx-auto">
                        <button type="button" onclick="updateSpots(-1)" class="bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold py-4 px-6 text-xl transition">-</button>
                        <input type="number" id="spotCount" value="${bookingState.numSpots}" readonly class="w-20 text-center py-4 bg-white font-black text-2xl text-brand-dark pointer-events-none border-x border-gray-200">
                        <button type="button" onclick="updateSpots(1)" class="bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold py-4 px-6 text-xl transition">+</button>
                    </div>
                    
                    <div class="bg-brand-light/40 p-5 rounded-xl mb-8 border border-brand-cyan/20 text-center">
                        <p class="text-sm text-gray-500 mb-2 font-medium">Subtotal depósito:</p>
                        <p class="text-2xl font-black text-brand-dark tracking-tight" id="depositTotal">200.000 COP x ${bookingState.numSpots} = ${formatCurrency(DEPOSIT_PRICE * bookingState.numSpots)}</p>
                    </div>

                    <button onclick="goToStep2()" class="w-full bg-brand-cyan hover:bg-brand-dark text-white font-bold py-4 px-4 rounded-xl transition-colors shadow-md text-lg">
                        Siguiente paso
                    </button>
                `;
            } 
            else if (bookingState.step === 2) {
                let existingData = bookingState.passengers[0] || {};

                bookingBody.innerHTML = `
                    <div class="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                        <h3 class="font-extrabold text-lg md:text-xl text-brand-dark">Datos del Comprador</h3>
                        <span class="text-[10px] md:text-xs text-brand-cyan bg-brand-light px-2.5 py-1 md:px-3 md:py-1.5 rounded-full font-bold">${bookingState.numSpots} Cupo${bookingState.numSpots > 1 ? 's' : ''} total</span>
                    </div>
                    
                    ${bookingState.numSpots > 1 ? 
                    `<p class="text-xs md:text-sm text-gray-500 mb-5 font-medium bg-gray-50 p-3 rounded-lg border border-gray-200"><i class="fas fa-info-circle text-brand-cyan mr-1"></i> Solo necesitamos tus datos. Los de tus acompañantes te los pediremos por WhatsApp.</p>` 
                    : ''}

                    <form id="passengerForm" onsubmit="savePassenger(event)">
                        
                        <input type="text" id="hp_website" name="super_secreto_hp_123" tabindex="-1" autocomplete="new-password" style="position: absolute; opacity: 0; left: -9999px; pointer-events: none;">

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                            <div>
                                <label class="block text-gray-700 text-xs md:text-sm font-bold mb-1.5 md:mb-2" for="p_nombre">Nombre(s) *</label>
                                <input type="text" id="p_nombre" required value="${existingData.nombre || ''}" class="appearance-none border border-gray-200 rounded-lg md:rounded-xl w-full py-2.5 md:py-3 px-3 md:px-4 text-gray-700 leading-tight focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition text-sm" placeholder="Ej. Juan Andrés" oninput="this.value = this.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]/g, '')">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-xs md:text-sm font-bold mb-1.5 md:mb-2" for="p_apellido">Apellido(s) *</label>
                                <input type="text" id="p_apellido" required value="${existingData.apellido || ''}" class="appearance-none border border-gray-200 rounded-lg md:rounded-xl w-full py-2.5 md:py-3 px-3 md:px-4 text-gray-700 leading-tight focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition text-sm" placeholder="Ej. Pérez Gómez" oninput="this.value = this.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]/g, '')">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                            <div>
                                <label class="block text-gray-700 text-xs md:text-sm font-bold mb-1.5 md:mb-2" for="p_documento">Cédula / Documento *</label>
                                <input type="text" id="p_documento" required value="${existingData.documento || ''}" class="appearance-none border border-gray-200 rounded-lg md:rounded-xl w-full py-2.5 md:py-3 px-3 md:px-4 text-gray-700 leading-tight focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition text-sm" placeholder="Ej. 1000123456" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-xs md:text-sm font-bold mb-1.5 md:mb-2" for="p_phone">Número celular *</label>
                                <input type="tel" id="p_phone" required pattern="[0-9]{10,15}" title="Ingresa un número válido, solo dígitos." value="${existingData.phone || ''}" class="appearance-none border border-gray-200 rounded-lg md:rounded-xl w-full py-2.5 md:py-3 px-3 md:px-4 text-gray-700 leading-tight focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition text-sm" placeholder="3001234567" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                            <div>
                                <label class="block text-gray-700 text-xs md:text-sm font-bold mb-1.5 md:mb-2" for="p_email">Correo electrónico *</label>
                                <input type="email" id="p_email" required value="${existingData.email || ''}" class="appearance-none border border-gray-200 rounded-lg md:rounded-xl w-full py-2.5 md:py-3 px-3 md:px-4 text-gray-700 leading-tight focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition text-sm" placeholder="ejemplo@correo.com">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-xs md:text-sm font-bold mb-1.5 md:mb-2" for="p_ciudad">Ciudad de origen *</label>
                                <input type="text" id="p_ciudad" required value="${existingData.ciudad || ''}" class="appearance-none border border-gray-200 rounded-lg md:rounded-xl w-full py-2.5 md:py-3 px-3 md:px-4 text-gray-700 leading-tight focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition text-sm" placeholder="Ej. Bogotá">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                            <div>
                                <label class="block text-gray-700 text-xs md:text-sm font-bold mb-1.5 md:mb-2" for="p_alergias">Alergias (Opcional)</label>
                                <input type="text" id="p_alergias" value="${existingData.alergias || ''}" class="appearance-none border border-gray-200 rounded-lg md:rounded-xl w-full py-2.5 md:py-3 px-3 md:px-4 text-gray-700 leading-tight focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition text-sm" placeholder="Ej. Ninguna">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-xs md:text-sm font-bold mb-1.5 md:mb-2" for="p_requerimientos">Req. Dietéticos (Opcional)</label>
                                <input type="text" id="p_requerimientos" value="${existingData.requerimientos || ''}" class="appearance-none border border-gray-200 rounded-lg md:rounded-xl w-full py-2.5 md:py-3 px-3 md:px-4 text-gray-700 leading-tight focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition text-sm" placeholder="Ej. Vegetariano">
                            </div>
                        </div>

                        <div class="mb-5 md:mb-6">
                            <label class="block text-gray-700 text-xs md:text-sm font-bold mb-1.5 md:mb-2" for="p_contacto_emergencia">Contacto de emergencia (Nombre y Tel) *</label>
                            <input type="text" id="p_contacto_emergencia" required value="${existingData.contacto_emergencia || ''}" class="appearance-none border border-gray-200 rounded-lg md:rounded-xl w-full py-2.5 md:py-3 px-3 md:px-4 text-gray-700 leading-tight focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition text-sm" placeholder="Ej. Maria Pérez - 3009876543">
                        </div>

                        <div class="mb-6 flex items-start bg-gray-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-100">
                            <input type="checkbox" id="p_terms" required class="mt-0.5 md:mt-1 mr-2 md:mr-3 cursor-pointer w-4 h-4 md:w-5 md:h-5 accent-brand-cyan rounded">
                            <label for="p_terms" class="text-xs md:text-sm text-gray-600 cursor-pointer font-medium">
                                Acepto el tratamiento de mis <a href="#" onclick="openPrivacyModal(event)" class="text-brand-cyan font-bold underline hover:text-brand-dark transition">datos personales</a>.
                            </label>
                        </div>

                        <div class="flex gap-2 md:gap-3 mt-4">
                            <button type="button" onclick="goBackFromStep2()" class="w-1/3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-3 md:py-4 px-3 md:px-4 rounded-xl transition text-sm md:text-base">Atrás</button>
                            <button type="submit" class="w-2/3 bg-brand-cyan hover:bg-brand-dark text-white font-bold py-3 md:py-4 px-3 md:px-4 rounded-xl transition shadow-md text-sm md:text-base">
                                Siguiente paso
                            </button>
                        </div>
                    </form>
                `;
            }
            else if (bookingState.step === 3) {
                const total = DEPOSIT_PRICE * bookingState.numSpots;
                const buyer = bookingState.passengers[0];

                bookingBody.innerHTML = `
                    <div class="text-center mb-6">
                        <h3 class="font-extrabold text-2xl md:text-3xl text-brand-dark">¡Tu reserva está casi lista!</h3>
                        <p class="text-sm md:text-base text-gray-500 mt-1 font-medium">Estás a un solo paso de vivir la magia del Eje Cafetero ☕✈️</p>
                    </div>

                    <div class="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-5 md:p-8 mb-6 relative overflow-hidden">
                        <div class="absolute -left-4 top-1/2 w-8 h-8 bg-gray-50 rounded-full transform -translate-y-1/2 border-r border-gray-100 z-10"></div>
                        <div class="absolute -right-4 top-1/2 w-8 h-8 bg-gray-50 rounded-full transform -translate-y-1/2 border-l border-gray-100 z-10"></div>

                        <div class="text-center mb-6">
                            <span class="bg-brand-light text-brand-dark px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-brand-cyan/20"><i class="fas fa-ticket-alt mr-1 text-brand-cyan"></i> Voucher Provisorio</span>
                        </div>

                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <p class="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest mb-1 font-bold">A nombre de</p>
                                <p class="text-gray-800 font-black text-sm md:text-base capitalize leading-tight">${buyer.nombre} <br class="md:hidden"> ${buyer.apellido}</p>
                            </div>
                            
                            ${bookingState.numSpots > 1 ? `
                            <div class="text-right">
                                <p class="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest mb-1 font-bold">Cupos Totales</p>
                                <p class="text-gray-800 font-black text-sm md:text-base">${bookingState.numSpots} <i class="fas fa-user-friends text-brand-cyan ml-1"></i></p>
                            </div>
                            ` : ''}
                        </div>

                        <div class="border-t-2 border-dashed border-gray-200 pt-6 text-center relative z-0">
                            <p class="text-xs md:text-sm text-gray-500 uppercase tracking-widest mb-1 font-bold">Total a depositar hoy</p>
                            <p class="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter drop-shadow-sm">${formatCurrency(total)}</p>
                        </div>
                    </div>

                    <div class="bg-orange-50 p-4 md:p-5 rounded-xl md:rounded-2xl mb-6 md:mb-8 border-l-4 border-orange-400 text-xs md:text-sm text-gray-700 font-medium shadow-sm">
                        <p class="mb-2">Has reservado tu${bookingState.numSpots > 1 ? 's' : ''} cupo${bookingState.numSpots > 1 ? 's' : ''} provisionalmente. A partir de ahora cuentas con <strong class="text-orange-600">1 hora</strong> para realizar el depósito y garantizar tu reserva.</p>
                        <p class="text-[10px] md:text-xs text-gray-500 italic mt-2 md:mt-3 border-t border-orange-200/50 pt-2 md:pt-3">El pago total debe completarse como máximo 15 días antes de la salida.</p>
                    </div>

                    <div class="flex flex-col gap-3 md:gap-4">
                        <button type="button" id="btnFinalizarWs" onclick="submitBookingToAppsScript()" class="btn-whatsapp-pulse w-full text-white font-bold py-4 md:py-5 px-4 rounded-xl transition-all shadow-lg flex justify-center items-center text-lg md:text-xl border border-green-500/50">
                            <i class="fab fa-whatsapp mr-3 text-2xl md:text-3xl drop-shadow-sm"></i> Confirmar vía WhatsApp
                        </button>
                        <button type="button" onclick="bookingState.step = 2; renderStep()" class="w-full bg-transparent hover:bg-gray-50 text-gray-400 hover:text-gray-600 font-bold py-2.5 md:py-3 px-4 rounded-xl transition text-sm md:text-base">
                            Modificar datos
                        </button>
                    </div>
                `;
            }
            else if (bookingState.step === 4) {
                bookingBody.innerHTML = `
                    <div class="text-center pb-2">
                        <div class="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-cyan/20">
                            <i class="fas fa-check text-2xl text-brand-cyan"></i>
                        </div>
                        <h3 class="font-extrabold text-2xl text-brand-dark mb-3">¡Casi listo!</h3>
                        <p class="text-sm text-gray-600 mb-6 font-medium">Tienes 1 hora para realizar el depósito. Si necesitas más tiempo, indícanoslo en el chat.</p>
                        
                        <div class="bg-white border-2 border-orange-100 rounded-2xl p-6 mb-8 shadow-sm">
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tiempo restante:</p>
                            <div class="text-5xl font-black text-orange-500 font-mono tracking-wider drop-shadow-sm" id="countdownDisplay">00:59:59</div>
                        </div>
                        
                        <div class="bg-gray-50 border border-gray-200 p-5 rounded-2xl text-sm text-gray-600 text-left shadow-inner">
                            <p class="mb-3 font-bold text-gray-800"><i class="fas fa-info-circle text-brand-cyan mr-2"></i> ¿No se abrió WhatsApp?</p>
                            <p class="mb-5 font-medium leading-relaxed">Tu retención sigue activa. Para completar la reserva, vuelve a hacer clic en el botón de abajo y envía el mensaje.</p>
                            <button onclick="reopenWhatsApp()" class="w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold py-3 px-4 rounded-xl transition flex justify-center items-center text-lg">
                                <i class="fab fa-whatsapp mr-2"></i> Abrir WhatsApp
                            </button>
                        </div>
                    </div>
                `;
                startTimer();
            }
            else if (bookingState.step === 5) {
                bookingBody.innerHTML = `
                    <div class="text-center py-8">
                        <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                            <i class="fas fa-times text-4xl text-red-500"></i>
                        </div>
                        <h3 class="text-2xl font-extrabold text-gray-800 mb-3">Tu retención ha expirado</h3>
                        <p class="text-gray-500 mb-8 font-medium leading-relaxed">Los cupos quedaron liberados ya que el tiempo de 1 hora ha transcurrido. Puedes volver a intentarlo si aún hay disponibilidad.</p>
                        <button onclick="resetFlow()" class="w-full bg-brand-dark hover:bg-black text-white font-bold py-4 px-4 rounded-xl transition shadow-md text-lg">
                            Volver a intentar
                        </button>
                    </div>
                `;
            }
        }

        function submitBookingToAppsScript() {
            // Ya los datos están a salvo en Supabase. 
            // Aquí solo hacemos el efecto de carga y abrimos WhatsApp.
            const btn = document.getElementById('btnFinalizarWs');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Abriendo WhatsApp... ✈️';
            btn.disabled = true;

            setTimeout(() => {
                // Pasamos al Paso 4 (Reloj de cuenta regresiva)
                bookingState.step = 4;
                renderStep();
                // Abrimos la app de WhatsApp
                reopenWhatsApp();
            }, 800);
        }

        function updateSpots(change) {
            let newSpots = bookingState.numSpots + change;
            if (newSpots >= 1 && newSpots <= 15) {
                bookingState.numSpots = newSpots;
                document.getElementById('spotCount').value = newSpots;
                document.getElementById('depositTotal').innerText = `200.000 COP x ${newSpots} = ${formatCurrency(DEPOSIT_PRICE * newSpots)}`;
            }
        }

        function goToStep2() {
            bookingState.step = 2;
            // Solo creamos el espacio para 1 pasajero (El Comprador)
            bookingState.passengers = bookingState.passengers.slice(0, 1);
            renderStep();

            // --- DISPARO PIXEL: Llegó al formulario de datos ---
            if (typeof fbq !== 'undefined') {
                fbq('trackCustom', 'Paso2_DatosComprador');
            }
        }

        async function savePassenger(e) {
            e.preventDefault();
            
            // 1. Cambiamos el botón a estado de "Cargando"
            const btnSubmit = e.target.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Asegurando cupo...';
            btnSubmit.disabled = true;

            const hp = document.getElementById('hp_website');
            if (hp && hp.value !== '') { bookingState.isBot = true; }

            // 2. Recogemos los datos del formulario
            const nombre = document.getElementById('p_nombre').value.trim();
            const apellido = document.getElementById('p_apellido').value.trim();
            const email = document.getElementById('p_email').value;
            const phone = document.getElementById('p_phone').value;
            const documento = document.getElementById('p_documento').value;
            const ciudad = document.getElementById('p_ciudad').value;
            const alergias = document.getElementById('p_alergias').value;
            const requerimientos = document.getElementById('p_requerimientos').value;
            const contacto_emergencia = document.getElementById('p_contacto_emergencia').value;

            // Guardamos localmente en la memoria
            bookingState.passengers[0] = { 
                nombre, apellido, email, phone, documento, ciudad, alergias, requerimientos, contacto_emergencia 
            };

            // --- 3. ENVÍO SILENCIOSO A MAKE Y SUPABASE ---
            if (bookingState.isBot) {
                setTimeout(() => { bookingState.step = 3; renderStep(); }, 1500);
                return;
            }

            const buyer = bookingState.passengers[0];
            const subtotal = DEPOSIT_PRICE * bookingState.numSpots;
            const tarifaTotal = 1800000 * bookingState.numSpots;
            const urlParams = new URLSearchParams(window.location.search);

            // Armamos el paquete de datos (Incluyendo el UUID de tu plan)
            const payload = {
                fecha_registro: new Date().toLocaleDateString('es-CO'),
                nombre: buyer.nombre,       
                apellido: buyer.apellido,   
                documento: buyer.documento || "N/A",
                telefono: buyer.phone,
                email: buyer.email,
                ciudad: buyer.ciudad || "N/A",
                
                plan_seleccionado: "Viaje Eje Cafetero 12-18 Mayo 2026",
                plan_id_supabase: "731f0c92-35a4-4a9c-8586-eff8499436a1", // UUID de tu CRM  
                tarifa_total: tarifaTotal,
                abono: subtotal,
                pax: bookingState.numSpots,
                alergias: buyer.alergias || "Ninguna",
                requerimientos: buyer.requerimientos || "Ninguno",
                contacto_emergencia: buyer.contacto_emergencia || "N/A",

                utm_source: urlParams.get('utm_source') || 'organico_o_directo',
                utm_medium: urlParams.get('utm_medium') || 'N/A',
                utm_campaign: urlParams.get('utm_campaign') || 'N/A',
                utm_term: urlParams.get('utm_term') || 'N/A',
                utm_content: urlParams.get('utm_content') || 'N/A'
            };

            try {
                // Disparamos los datos hacia Make.com
                const response = await fetch(getUrl(), {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: { 'Content-Type': 'application/json' }
                });

                // --- DISPARO DEL PIXEL DE FACEBOOK (LEAD) ---
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead');
                    }

                // Preparamos el tiempo de expiración (1 hora)
                let expiryTime = Date.now() + (60 * 60 * 1000);
                localStorage.setItem('retentionExpiry', expiryTime);
                localStorage.setItem('bookingData', JSON.stringify({
                    numSpots: bookingState.numSpots,
                    passengers: bookingState.passengers,
                    timestamp: Date.now()
                }));

                // ¡Éxito! Pasamos al Paso 3 (El Voucher y botón de WhatsApp)
                bookingState.step = 3;
                renderStep();

            } catch (error) {
                console.error("Error:", error);
                alert("Ocurrió un error de conexión. Revisa tu internet e intenta nuevamente.");
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
            }
        }

        function generateWhatsAppText() {
            const total = formatCurrency(DEPOSIT_PRICE * bookingState.numSpots);
            const buyer = bookingState.passengers[0];
            
            let text = `¡Hola, buenos días! ☀️ Quisiera asegurar mi reserva para el viaje al Eje Cafetero (12–18 de mayo 2026) ☕✈️\n\n`;
            text += `*Mis datos de registro:*\n`;
            text += `👤 *Nombre:* ${buyer.nombre} ${buyer.apellido}\n`;
            text += `🪪 *Cédula:* ${buyer.documento}\n`;
            text += `📱 *Celular:* ${buyer.phone}\n`;
            text += `🎟️ *Cupos a reservar:* ${bookingState.numSpots}\n\n`;
            text += `💰 *Subtotal a depositar:* ${total} COP\n\n`;
            text += `¡Quedo atento/a a las instrucciones para realizar el pago! 🙌`;

            return encodeURIComponent(text);
        }

        function reopenWhatsApp() {
            const waUrl = `https://wa.me/${getWa()}?text=${generateWhatsAppText()}`;
            window.open(waUrl, '_blank');
        }

        function checkActiveRetention() {
            const expiry = localStorage.getItem('retentionExpiry');
            if (expiry) {
                const now = new Date().getTime();
                if (now < parseInt(expiry)) {
                    bookingState.isOpen = true;
                    bookingState.step = 4;
                    const savedData = localStorage.getItem('bookingData');
                    if(savedData) {
                        const parsed = JSON.parse(savedData);
                        bookingState.passengers = parsed.passengers;
                        bookingState.numSpots = parsed.numSpots;
                    }
                    btnStartBooking.classList.add('hidden');
                    bookingContainer.classList.add('open');
                    renderStep();
                } else {
                    localStorage.removeItem('retentionExpiry');
                    localStorage.removeItem('bookingData');
                }
            }
        }

        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            const display = document.getElementById('countdownDisplay');
            if (!display) return;

            timerInterval = setInterval(() => {
                const expiry = localStorage.getItem('retentionExpiry');
                if (!expiry) {
                    clearInterval(timerInterval);
                    return;
                }
                const now = new Date().getTime();
                const distance = parseInt(expiry) - now;
                if (distance < 0) {
                    clearInterval(timerInterval);
                    localStorage.removeItem('retentionExpiry');
                    localStorage.removeItem('bookingData');
                    bookingState.step = 5; 
                    renderStep();
                    return;
                }
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const formatted = 
                    String(hours).padStart(2, '0') + ":" + 
                    String(minutes).padStart(2, '0') + ":" + 
                    String(seconds).padStart(2, '0');
                display.innerText = formatted;
            }, 1000);
        }

        function resetFlow() {
            localStorage.removeItem('retentionExpiry');
            localStorage.removeItem('bookingData');
            bookingState.step = 1;
            renderStep();
        }

        document.addEventListener("DOMContentLoaded", () => {
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            setTimeout(() => {
                document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
            }, 100);
        });
