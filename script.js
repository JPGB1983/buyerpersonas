// Framework 4 - Kit de Buyer Personas - JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Framework 4 - Kit de Buyer Personas iniciado');

    // Initialize application
    initializeApp();

    // Set up event listeners
    setupEventListeners();

    // Load saved data if exists
    loadSavedData();
});

// Initialize application
function initializeApp() {
    // Set current date
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
    }

    // Initialize personality scales
    initializePersonalityScales();

    // Add input validation
    addInputValidation();

    // Show welcome message
    showWelcomeMessage();
}

// Set up all event listeners
function setupEventListeners() {
    // Action buttons
    const guardarBtn = document.getElementById('guardar-borrador');
    const exportarJsonBtn = document.getElementById('exportar-json');
    const exportarPdfBtn = document.getElementById('exportar-pdf');
    const limpiarBtn = document.getElementById('limpiar-formulario');

    if (guardarBtn) guardarBtn.addEventListener('click', guardarBorrador);
    if (exportarJsonBtn) exportarJsonBtn.addEventListener('click', exportarJSON);
    if (exportarPdfBtn) exportarPdfBtn.addEventListener('click', exportarPDF);
    if (limpiarBtn) limpiarBtn.addEventListener('click', limpiarFormulario);

    // Auto-save functionality
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', autoSave);
        input.addEventListener('input', debounce(autoSave, 1000));
    });

    // Special handlers for conditional inputs
    setupConditionalInputs();

    // Form validation
    setupFormValidation();

    // Keyboard shortcuts
    setupKeyboardShortcuts();
}

// Initialize personality scales with visual feedback
function initializePersonalityScales() {
    const scales = document.querySelectorAll('.scale input[type="range"]');
    scales.forEach(scale => {
        // Add value display
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'scale-value';
        valueDisplay.textContent = scale.value;
        scale.parentNode.appendChild(valueDisplay);

        // Update display on change
        scale.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
            updateScaleBackground(this);
        });

        // Initialize background
        updateScaleBackground(scale);
    });
}

// Update scale background based on value
function updateScaleBackground(scale) {
    const value = ((scale.value - scale.min) / (scale.max - scale.min)) * 100;
    scale.style.background = `linear-gradient(to right, #667eea 0%, #667eea ${value}%, #e9ecef ${value}%, #e9ecef 100%)`;
}

// Set up conditional inputs
function setupConditionalInputs() {
    // Enable "Otro" text input when checkbox is checked
    const otroCheckboxes = document.querySelectorAll('input[value="otro"]');
    otroCheckboxes.forEach(checkbox => {
        const textInput = checkbox.parentNode.querySelector('input[type="text"]');
        if (textInput) {
            textInput.disabled = !checkbox.checked;
            checkbox.addEventListener('change', function() {
                textInput.disabled = !this.checked;
                if (this.checked) {
                    textInput.focus();
                } else {
                    textInput.value = '';
                }
            });
        }
    });

    // Similar logic for "otros" in devices
    const otrosCheckbox = document.querySelector('input[value="otros"]');
    if (otrosCheckbox) {
        const otrosTextInput = document.getElementById('dispositivos-otros');
        if (otrosTextInput) {
            otrosTextInput.disabled = !otrosCheckbox.checked;
            otrosCheckbox.addEventListener('change', function() {
                otrosTextInput.disabled = !this.checked;
                if (this.checked) {
                    otrosTextInput.focus();
                } else {
                    otrosTextInput.value = '';
                }
            });
        }
    }
}

// Add input validation
function addInputValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', validateEmail);
    });

    // Number validation
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', validateNumber);
    });

    // Required field validation
    const requiredInputs = document.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', validateRequired);
    });
}

// Validation functions
function validateEmail(event) {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        showFieldError(event.target, 'Por favor ingresa un email válido');
    } else {
        clearFieldError(event.target);
    }
}

function validateNumber(event) {
    const value = event.target.value;
    const min = event.target.min;
    const max = event.target.max;

    if (value && min && parseFloat(value) < parseFloat(min)) {
        showFieldError(event.target, `El valor mínimo es ${min}`);
    } else if (value && max && parseFloat(value) > parseFloat(max)) {
        showFieldError(event.target, `El valor máximo es ${max}`);
    } else {
        clearFieldError(event.target);
    }
}

function validateRequired(event) {
    if (!event.target.value.trim()) {
        showFieldError(event.target, 'Este campo es requerido');
    } else {
        clearFieldError(event.target);
    }
}

function showFieldError(field, message) {
    clearFieldError(field);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 5px;';

    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc3545';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

// Set up form validation
function setupFormValidation() {
    const form = document.querySelector('.container');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateForm()) {
                exportarJSON();
            }
        });
    }
}

// Validate entire form
function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo es requerido');
            isValid = false;
        }
    });

    return isValid;
}

// Set up keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl+S or Cmd+S to save
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            guardarBorrador();
        }

        // Ctrl+E or Cmd+E to export JSON
        if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
            event.preventDefault();
            exportarJSON();
        }

        // Ctrl+P or Cmd+P to export PDF
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            event.preventDefault();
            exportarPDF();
        }
    });
}

// Collect all form data
function collectFormData() {
    const data = {
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
            framework: 'Kit de Buyer Personas'
        },
        proyecto: {
            nombre: getValue('proyecto'),
            fecha: getValue('fecha'),
            equipo: getValue('equipo'),
            objetivo: getValue('objetivo'),
            numeroPersonas: getValue('num-personas')
        },
        proposito: {
            razones: getCheckedValues('proposito'),
            propositoOtro: getValue('proposito-otro'),
            comoUsar: getValue('como-usar'),
            criteriosExito: getValue('criterios-exito')
        },
        personaPrincipal: {
            informacionBasica: {
                nombre: getValue('nombre'),
                edad: getValue('edad'),
                ubicacion: getValue('ubicacion'),
                estadoCivil: getValue('estado-civil'),
                ingresos: getValue('ingresos'),
                foto: getCheckedValue('foto')
            },
            informacionProfesional: {
                ocupacion: getValue('ocupacion'),
                industria: getValue('industria'),
                tamanoEmpresa: getValue('tamano-empresa'),
                anosExperiencia: getValue('anos-experiencia'),
                nivelResponsabilidad: getValue('nivel-responsabilidad'),
                herramientas: getValue('herramientas')
            },
            perfilPsicografico: {
                personalidad: {
                    extrovertido: getValue('extrovertido'),
                    conservador: getValue('conservador'),
                    independiente: getValue('independiente'),
                    detalles: getValue('detalles')
                },
                valores: getCheckedValues('valores'),
                intereses: getValue('intereses')
            },
            objetivosMotivaciones: {
                objetivosProfesionales: getValue('objetivos-profesionales'),
                objetivosPersonales: getValue('objetivos-personales'),
                queImpulsa: getValue('que-impulsa'),
                queInspira: getValue('que-inspira'),
                queLograr: getValue('que-lograr')
            },
            frustracionesDesafios: {
                desafiosProfesionales: getValue('desafios-profesionales'),
                desafiosProductos: getValue('desafios-productos'),
                barrerasExito: getValue('barreras-exito'),
                queMolesta: getValue('que-molesta'),
                queQuitaTiempo: getValue('que-quita-tiempo'),
                queEstresa: getValue('que-estresa')
            },
            comportamientoCompra: {
                tipoComprador: getCheckedValue('tipo-comprador'),
                tiempoDecision: getCheckedValue('tiempo-decision'),
                influenciadores: getValue('influenciadores'),
                presupuestoMin: getValue('presupuesto-min'),
                presupuestoMax: getValue('presupuesto-max'),
                sensibilidadPrecio: getCheckedValue('sensibilidad-precio'),
                factoresDecision: getCheckedValues('factores-decision'),
                canalesCompra: getCheckedValues('canales-compra')
            },
            habitosDigitales: {
                dispositivos: getCheckedValues('dispositivos'),
                dispositivosOtros: getValue('dispositivos-otros'),
                nivelTecnologico: getCheckedValue('nivel-tecnologico'),
                redesSociales: {
                    facebook: {
                        frecuencia: getValue('facebook-frecuencia'),
                        proposito: getValue('facebook-proposito')
                    },
                    linkedin: {
                        frecuencia: getValue('linkedin-frecuencia'),
                        proposito: getValue('linkedin-proposito')
                    },
                    instagram: {
                        frecuencia: getValue('instagram-frecuencia'),
                        proposito: getValue('instagram-proposito')
                    },
                    twitter: {
                        frecuencia: getValue('twitter-frecuencia'),
                        proposito: getValue('twitter-proposito')
                    },
                    youtube: {
                        frecuencia: getValue('youtube-frecuencia'),
                        proposito: getValue('youtube-proposito')
                    },
                    tiktok: {
                        frecuencia: getValue('tiktok-frecuencia'),
                        proposito: getValue('tiktok-proposito')
                    }
                },
                formatosContenido: getCheckedValues('formatos-contenido'),
                fuentesInformacion: getValue('fuentes-informacion')
            },
            comunicacionSoporte: {
                primerContacto: getValue('primer-contacto'),
                seguimiento: getValue('seguimiento'),
                soporte: getValue('soporte'),
                estiloComunicacion: getCheckedValues('estilo-comunicacion'),
                mejorMomento: getValue('mejor-momento'),
                zonaHoraria: getValue('zona-horaria'),
                diasPreferidos: getValue('dias-preferidos')
            },
            frasesYCitas: {
                citasTextuales: getValue('citas-textuales'),
                objecionesComunes: getValue('objeciones-comunes'),
                expresionesTipicas: getValue('expresiones-tipicas')
            }
        }
    };

    return data;
}

// Helper functions for data collection
function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
}

function getCheckedValue(name) {
    const element = document.querySelector(`input[name="${name}"]:checked`);
    return element ? element.value : '';
}

function getCheckedValues(name) {
    const elements = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(elements).map(el => el.value);
}

// Auto-save functionality
function autoSave() {
    const data = collectFormData();
    localStorage.setItem('buyerPersonaDraft', JSON.stringify(data));
    showMessage('Borrador guardado automáticamente', 'success');
}

// Debounce function to limit auto-save frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Save draft manually
function guardarBorrador() {
    try {
        const data = collectFormData();
        localStorage.setItem('buyerPersonaDraft', JSON.stringify(data));
        showMessage('Borrador guardado exitosamente', 'success');
    } catch (error) {
        console.error('Error al guardar borrador:', error);
        showMessage('Error al guardar borrador', 'error');
    }
}

// Load saved data
function loadSavedData() {
    try {
        const savedData = localStorage.getItem('buyerPersonaDraft');
        if (savedData) {
            const data = JSON.parse(savedData);
            populateForm(data);
            showMessage('Borrador cargado', 'success');
        }
    } catch (error) {
        console.error('Error al cargar datos guardados:', error);
    }
}

// Populate form with saved data
function populateForm(data) {
    // Project info
    if (data.proyecto) {
        setValue('proyecto', data.proyecto.nombre);
        setValue('fecha', data.proyecto.fecha);
        setValue('equipo', data.proyecto.equipo);
        setValue('objetivo', data.proyecto.objetivo);
        setValue('num-personas', data.proyecto.numeroPersonas);
    }

    // Purpose
    if (data.proposito) {
        setCheckedValues('proposito', data.proposito.razones);
        setValue('proposito-otro', data.proposito.propositoOtro);
        setValue('como-usar', data.proposito.comoUsar);
        setValue('criterios-exito', data.proposito.criteriosExito);
    }

    // Main persona
    if (data.personaPrincipal) {
        const persona = data.personaPrincipal;

        // Basic info
        if (persona.informacionBasica) {
            const basic = persona.informacionBasica;
            setValue('nombre', basic.nombre);
            setValue('edad', basic.edad);
            setValue('ubicacion', basic.ubicacion);
            setValue('estado-civil', basic.estadoCivil);
            setValue('ingresos', basic.ingresos);
            setCheckedValue('foto', basic.foto);
        }

        // Professional info
        if (persona.informacionProfesional) {
            const prof = persona.informacionProfesional;
            setValue('ocupacion', prof.ocupacion);
            setValue('industria', prof.industria);
            setValue('tamano-empresa', prof.tamanoEmpresa);
            setValue('anos-experiencia', prof.anosExperiencia);
            setValue('nivel-responsabilidad', prof.nivelResponsabilidad);
            setValue('herramientas', prof.herramientas);
        }

        // Continue with other sections...
        // (Additional population logic would continue here)
    }
}

// Helper functions for form population
function setValue(id, value) {
    const element = document.getElementById(id);
    if (element && value) {
        element.value = value;
    }
}

function setCheckedValue(name, value) {
    const element = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (element) {
        element.checked = true;
    }
}

function setCheckedValues(name, values) {
    if (Array.isArray(values)) {
        values.forEach(value => {
            const element = document.querySelector(`input[name="${name}"][value="${value}"]`);
            if (element) {
                element.checked = true;
            }
        });
    }
}

// Export to JSON
function exportarJSON() {
    try {
        const data = collectFormData();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `buyer-persona-${data.personaPrincipal.informacionBasica.nombre || 'sin-nombre'}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showMessage('JSON exportado exitosamente', 'success');
    } catch (error) {
        console.error('Error al exportar JSON:', error);
        showMessage('Error al exportar JSON', 'error');
    }
}

// Export to PDF (simplified version)
function exportarPDF() {
    try {
        // Hide action buttons for printing
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) {
            actionButtons.style.display = 'none';
        }

        // Print the page
        window.print();

        // Restore action buttons
        setTimeout(() => {
            if (actionButtons) {
                actionButtons.style.display = 'flex';
            }
        }, 1000);

        showMessage('Documento preparado para imprimir/guardar como PDF', 'success');
    } catch (error) {
        console.error('Error al exportar PDF:', error);
        showMessage('Error al preparar PDF', 'error');
    }
}

// Clear form
function limpiarFormulario() {
    if (confirm('¿Estás seguro de que quieres limpiar todo el formulario? Esta acción no se puede deshacer.')) {
        try {
            // Clear all inputs
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });

            // Reset personality scales
            const scales = document.querySelectorAll('input[type="range"]');
            scales.forEach(scale => {
                scale.value = 3;
                updateScaleBackground(scale);
                const valueDisplay = scale.parentNode.querySelector('.scale-value');
                if (valueDisplay) {
                    valueDisplay.textContent = '3';
                }
            });

            // Clear localStorage
            localStorage.removeItem('buyerPersonaDraft');

            // Set current date
            const fechaInput = document.getElementById('fecha');
            if (fechaInput) {
                fechaInput.value = new Date().toISOString().split('T')[0];
            }

            showMessage('Formulario limpiado exitosamente', 'success');
        } catch (error) {
            console.error('Error al limpiar formulario:', error);
            showMessage('Error al limpiar formulario', 'error');
        }
    }
}

// Show messages to user
function showMessage(text, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}-message`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            message.style.backgroundColor = '#28a745';
            break;
        case 'error':
            message.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            message.style.backgroundColor = '#ffc107';
            message.style.color = '#000';
            break;
        default:
            message.style.backgroundColor = '#17a2b8';
    }

    document.body.appendChild(message);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => message.remove(), 300);
        }
    }, 3000);
}

// Show welcome message
function showWelcomeMessage() {
    setTimeout(() => {
        showMessage('¡Bienvenido al Kit de Buyer Personas! Los datos se guardan automáticamente.', 'info');
    }, 1000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .scale-value {
        font-weight: bold;
        color: #667eea;
        margin-left: 10px;
        min-width: 20px;
        text-align: center;
    }

    .field-error {
        animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
        0%, 20%, 40%, 60%, 80% {
            transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
        }
    }
`;
document.head.appendChild(style);

// Add progress indicator
function addProgressIndicator() {
    const container = document.querySelector('.container');
    if (container) {
        const progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <span class="progress-text">0% completado</span>
            </div>
        `;
        progressBar.style.cssText = `
            position: sticky;
            top: 0;
            background: #fff;
            padding: 15px;
            border-bottom: 2px solid #e9ecef;
            z-index: 100;
            margin-bottom: 20px;
        `;

        container.insertBefore(progressBar, container.firstChild);

        // Update progress on input changes
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', updateProgress);
            input.addEventListener('change', updateProgress);
        });

        updateProgress();
    }
}

// Update progress indicator
function updateProgress() {
    const inputs = document.querySelectorAll('input, select, textarea');
    let filledInputs = 0;

    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            // For checkbox/radio groups, check if at least one is selected
            const name = input.name;
            if (name && document.querySelector(`input[name="${name}"]:checked`)) {
                // Count each group only once
                if (!input.dataset.counted) {
                    const groupInputs = document.querySelectorAll(`input[name="${name}"]`);
                    groupInputs.forEach(groupInput => {
                        groupInput.dataset.counted = 'true';
                    });
                    filledInputs++;
                }
            }
        } else if (input.value.trim() !== '') {
            filledInputs++;
        }
    });

    const progressPercentage = Math.round((filledInputs / inputs.length) * 100);
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    if (progressFill && progressText) {
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progressPercentage}% completado`;
    }
}

// Initialize progress indicator after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addProgressIndicator, 500);
});

console.log('Framework 4 - Kit de Buyer Personas JavaScript cargado exitosamente');