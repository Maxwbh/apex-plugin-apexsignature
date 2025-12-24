/**
 * APEX Signature Plugin - Initials Mode Module
 *
 * @author Daniel Hochleitner (original plugin)
 * @contributor Maxwell da Silva Oliveira - M&S do Brasil LTDA
 * @version 3.5.0
 * @license MIT
 *
 * Features:
 * - Compact canvas for capturing initials
 * - Auto-generate initials from full name
 * - Typed initials with custom fonts
 * - Multiple initials for multi-page documents
 * - Quick rubric mode
 * - Validation (min strokes, required)
 *
 * LinkedIn: /maxwbh
 */

var apexSignatureInitials = {
    // Module version
    VERSION: '3.5.0',

    // Input modes
    MODES: {
        DRAW: 'draw',
        TYPE: 'type'
    },

    // Default dimensions (compact)
    DEFAULT_WIDTH: 150,
    DEFAULT_HEIGHT: 80,

    // Fonts for typed initials
    FONTS: [
        { name: 'Script', value: 'Dancing Script' },
        { name: 'Elegant', value: 'Great Vibes' },
        { name: 'Classic', value: 'Allura' },
        { name: 'Modern', value: 'Pacifico' },
        { name: 'Simple', value: 'Arial' }
    ],

    // Store module instances
    instances: {},

    /**
     * Initialize initials module
     * @param {string} pRegionId - Region ID
     * @param {object} pOptions - Configuration options
     */
    init: function(pRegionId, pOptions) {
        var self = this;
        var options = pOptions || {};

        // Create instance
        this.instances[pRegionId] = {
            options: options,
            mode: options.mode || this.MODES.DRAW,
            width: options.width || this.DEFAULT_WIDTH,
            height: options.height || this.DEFAULT_HEIGHT,
            fullName: options.fullName || '',
            generatedInitials: '',
            typedInitials: '',
            selectedFont: options.font || this.FONTS[0].value,
            signaturePad: null,
            required: options.required === true,
            minStrokes: options.minStrokes || 1,
            maxLength: options.maxLength || 4,
            penColor: options.penColor || '#000000',
            backgroundColor: options.backgroundColor || '#ffffff',
            initialsData: null
        };

        var instance = this.instances[pRegionId];

        // Generate initials from name if provided
        if (instance.fullName) {
            instance.generatedInitials = this.generateInitials(instance.fullName);
        }

        // Build UI
        this.buildUI(pRegionId, options);

        // Load Google Fonts for typed mode
        this.loadFonts();

        // Trigger init event
        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-initials-initialized', {
                version: this.VERSION,
                mode: instance.mode,
                generatedInitials: instance.generatedInitials
            });
        }

        console.log('apexSignatureInitials v' + this.VERSION + ' initialized for region:', pRegionId);
    },

    /**
     * Generate initials from full name
     */
    generateInitials: function(fullName) {
        if (!fullName) return '';

        var parts = fullName.trim().split(/\s+/);
        var initials = '';

        parts.forEach(function(part) {
            if (part.length > 0) {
                initials += part.charAt(0).toUpperCase();
            }
        });

        return initials.substring(0, 4); // Max 4 characters
    },

    /**
     * Load Google Fonts
     */
    loadFonts: function() {
        if (document.getElementById('apex-sig-initials-fonts')) return;

        var link = document.createElement('link');
        link.id = 'apex-sig-initials-fonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Allura&family=Pacifico&display=swap';
        document.head.appendChild(link);
    },

    /**
     * Build the UI
     */
    buildUI: function(pRegionId, pOptions) {
        var self = this;
        var instance = this.instances[pRegionId];

        var container = document.getElementById(pRegionId + '_signature');
        if (!container) {
            container = document.getElementById(pRegionId);
        }
        if (!container) return;

        // Create wrapper
        var wrapper = document.createElement('div');
        wrapper.className = 'apex-sig-initials-wrapper';
        wrapper.id = pRegionId + '_initials_wrapper';

        // Create header with mode tabs
        var header = document.createElement('div');
        header.className = 'apex-sig-initials-header';

        var title = document.createElement('span');
        title.className = 'apex-sig-initials-title';
        title.textContent = pOptions.title || 'Initials';

        var modeTabs = document.createElement('div');
        modeTabs.className = 'apex-sig-initials-tabs';

        // Draw tab
        var drawTab = document.createElement('button');
        drawTab.type = 'button';
        drawTab.className = 'apex-sig-initials-tab' + (instance.mode === 'draw' ? ' active' : '');
        drawTab.setAttribute('data-mode', 'draw');
        drawTab.innerHTML = '<span class="apex-sig-icon">&#9998;</span> ' + (pOptions.drawLabel || 'Draw');

        // Type tab
        var typeTab = document.createElement('button');
        typeTab.type = 'button';
        typeTab.className = 'apex-sig-initials-tab' + (instance.mode === 'type' ? ' active' : '');
        typeTab.setAttribute('data-mode', 'type');
        typeTab.innerHTML = '<span class="apex-sig-icon">&#9000;</span> ' + (pOptions.typeLabel || 'Type');

        modeTabs.appendChild(drawTab);
        modeTabs.appendChild(typeTab);

        header.appendChild(title);
        header.appendChild(modeTabs);
        wrapper.appendChild(header);

        // Create panels container
        var panels = document.createElement('div');
        panels.className = 'apex-sig-initials-panels';
        panels.id = pRegionId + '_initials_panels';

        // Draw panel
        var drawPanel = document.createElement('div');
        drawPanel.className = 'apex-sig-initials-panel' + (instance.mode === 'draw' ? ' active' : '');
        drawPanel.id = pRegionId + '_initials_panel_draw';
        drawPanel.setAttribute('data-mode', 'draw');

        var canvas = document.createElement('canvas');
        canvas.id = pRegionId + '_initials_canvas';
        canvas.className = 'apex-sig-initials-canvas';
        canvas.width = instance.width;
        canvas.height = instance.height;
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', 'Initials drawing area');
        canvas.setAttribute('tabindex', '0');

        drawPanel.appendChild(canvas);
        panels.appendChild(drawPanel);

        // Type panel
        var typePanel = document.createElement('div');
        typePanel.className = 'apex-sig-initials-panel' + (instance.mode === 'type' ? ' active' : '');
        typePanel.id = pRegionId + '_initials_panel_type';
        typePanel.setAttribute('data-mode', 'type');

        // Initials input
        var inputGroup = document.createElement('div');
        inputGroup.className = 'apex-sig-initials-input-group';

        var initialsInput = document.createElement('input');
        initialsInput.type = 'text';
        initialsInput.id = pRegionId + '_initials_input';
        initialsInput.className = 'apex-sig-initials-input';
        initialsInput.placeholder = pOptions.placeholder || 'Enter initials';
        initialsInput.maxLength = instance.maxLength;
        initialsInput.value = instance.generatedInitials;
        initialsInput.setAttribute('aria-label', 'Type your initials');

        inputGroup.appendChild(initialsInput);

        // Auto-generate button (if name provided)
        if (instance.fullName) {
            var autoBtn = document.createElement('button');
            autoBtn.type = 'button';
            autoBtn.className = 'apex-sig-initials-auto-btn';
            autoBtn.innerHTML = '&#9733;';
            autoBtn.title = 'Use generated initials: ' + instance.generatedInitials;
            inputGroup.appendChild(autoBtn);

            autoBtn.addEventListener('click', function() {
                initialsInput.value = instance.generatedInitials;
                self.updateTypedPreview(pRegionId);
            });
        }

        typePanel.appendChild(inputGroup);

        // Font selector
        var fontGroup = document.createElement('div');
        fontGroup.className = 'apex-sig-initials-font-group';

        var fontLabel = document.createElement('label');
        fontLabel.textContent = pOptions.fontLabel || 'Style:';
        fontLabel.setAttribute('for', pRegionId + '_initials_font');

        var fontSelect = document.createElement('select');
        fontSelect.id = pRegionId + '_initials_font';
        fontSelect.className = 'apex-sig-initials-font-select';

        this.FONTS.forEach(function(font) {
            var option = document.createElement('option');
            option.value = font.value;
            option.textContent = font.name;
            option.style.fontFamily = font.value;
            if (font.value === instance.selectedFont) {
                option.selected = true;
            }
            fontSelect.appendChild(option);
        });

        fontGroup.appendChild(fontLabel);
        fontGroup.appendChild(fontSelect);
        typePanel.appendChild(fontGroup);

        // Preview
        var previewContainer = document.createElement('div');
        previewContainer.className = 'apex-sig-initials-preview';
        previewContainer.id = pRegionId + '_initials_preview';

        var previewCanvas = document.createElement('canvas');
        previewCanvas.id = pRegionId + '_initials_preview_canvas';
        previewCanvas.className = 'apex-sig-initials-preview-canvas';
        previewCanvas.width = instance.width;
        previewCanvas.height = instance.height;

        previewContainer.appendChild(previewCanvas);
        typePanel.appendChild(previewContainer);

        panels.appendChild(typePanel);
        wrapper.appendChild(panels);

        // Footer with actions
        var footer = document.createElement('div');
        footer.className = 'apex-sig-initials-footer';

        var clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.id = pRegionId + '_initials_clear';
        clearBtn.className = 'apex-sig-initials-btn apex-sig-initials-clear';
        clearBtn.innerHTML = '<span class="apex-sig-icon">&#128465;</span> ' + (pOptions.clearLabel || 'Clear');

        var confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.id = pRegionId + '_initials_confirm';
        confirmBtn.className = 'apex-sig-initials-btn apex-sig-initials-confirm';
        confirmBtn.innerHTML = '<span class="apex-sig-icon">&#10003;</span> ' + (pOptions.confirmLabel || 'Confirm');

        footer.appendChild(clearBtn);
        footer.appendChild(confirmBtn);
        wrapper.appendChild(footer);

        // Validation message
        var validationMsg = document.createElement('div');
        validationMsg.className = 'apex-sig-initials-validation';
        validationMsg.id = pRegionId + '_initials_validation';
        validationMsg.style.display = 'none';
        wrapper.appendChild(validationMsg);

        // Replace container content
        container.innerHTML = '';
        container.appendChild(wrapper);

        // Initialize SignaturePad for draw mode
        this.initDrawMode(pRegionId);

        // Event listeners
        this.bindEvents(pRegionId);

        // Initial typed preview
        if (instance.mode === 'type') {
            this.updateTypedPreview(pRegionId);
        }
    },

    /**
     * Initialize draw mode with SignaturePad
     */
    initDrawMode: function(pRegionId) {
        var instance = this.instances[pRegionId];
        var canvas = document.getElementById(pRegionId + '_initials_canvas');

        if (!canvas || typeof SignaturePad === 'undefined') return;

        instance.signaturePad = new SignaturePad(canvas, {
            minWidth: 1,
            maxWidth: 3,
            penColor: instance.penColor,
            backgroundColor: instance.backgroundColor,
            throttle: 16,
            minDistance: 3
        });

        // Track strokes for validation
        instance.signaturePad.addEventListener('endStroke', function() {
            instance.strokeCount = (instance.strokeCount || 0) + 1;
            this.validateInitials(pRegionId);
        }.bind(this));
    },

    /**
     * Bind event listeners
     */
    bindEvents: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];

        // Tab switching
        var tabs = document.querySelectorAll('#' + pRegionId + '_initials_wrapper .apex-sig-initials-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var mode = this.getAttribute('data-mode');
                self.switchMode(pRegionId, mode);
            });
        });

        // Initials input
        var input = document.getElementById(pRegionId + '_initials_input');
        if (input) {
            input.addEventListener('input', function() {
                instance.typedInitials = this.value.toUpperCase();
                this.value = instance.typedInitials;
                self.updateTypedPreview(pRegionId);
                self.validateInitials(pRegionId);
            });
        }

        // Font selector
        var fontSelect = document.getElementById(pRegionId + '_initials_font');
        if (fontSelect) {
            fontSelect.addEventListener('change', function() {
                instance.selectedFont = this.value;
                self.updateTypedPreview(pRegionId);
            });
        }

        // Clear button
        var clearBtn = document.getElementById(pRegionId + '_initials_clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                self.clear(pRegionId);
            });
        }

        // Confirm button
        var confirmBtn = document.getElementById(pRegionId + '_initials_confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                self.confirm(pRegionId);
            });
        }
    },

    /**
     * Switch between draw and type modes
     */
    switchMode: function(pRegionId, mode) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        instance.mode = mode;

        // Update tabs
        var tabs = document.querySelectorAll('#' + pRegionId + '_initials_wrapper .apex-sig-initials-tab');
        tabs.forEach(function(tab) {
            if (tab.getAttribute('data-mode') === mode) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update panels
        var panels = document.querySelectorAll('#' + pRegionId + '_initials_panels .apex-sig-initials-panel');
        panels.forEach(function(panel) {
            if (panel.getAttribute('data-mode') === mode) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Update preview if switching to type
        if (mode === 'type') {
            this.updateTypedPreview(pRegionId);
        }

        this.validateInitials(pRegionId);

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-initials-mode-changed', {
                mode: mode
            });
        }
    },

    /**
     * Update typed initials preview
     */
    updateTypedPreview: function(pRegionId) {
        var instance = this.instances[pRegionId];
        var input = document.getElementById(pRegionId + '_initials_input');
        var previewCanvas = document.getElementById(pRegionId + '_initials_preview_canvas');

        if (!previewCanvas || !input) return;

        var ctx = previewCanvas.getContext('2d');
        var text = input.value || '';

        // Clear canvas
        ctx.fillStyle = instance.backgroundColor;
        ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

        if (text) {
            // Draw text
            var fontSize = Math.min(instance.height * 0.6, 48);
            ctx.font = 'bold ' + fontSize + 'px ' + instance.selectedFont + ', cursive';
            ctx.fillStyle = instance.penColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText(text, previewCanvas.width / 2, previewCanvas.height / 2);
        }
    },

    /**
     * Validate initials
     */
    validateInitials: function(pRegionId) {
        var instance = this.instances[pRegionId];
        var validationEl = document.getElementById(pRegionId + '_initials_validation');

        if (!validationEl) return true;

        var isValid = true;
        var message = '';

        if (instance.mode === 'draw') {
            if (instance.required && instance.signaturePad && instance.signaturePad.isEmpty()) {
                isValid = false;
                message = 'Please draw your initials';
            } else if (instance.minStrokes > 1 && (instance.strokeCount || 0) < instance.minStrokes) {
                isValid = false;
                message = 'Please complete your initials (minimum ' + instance.minStrokes + ' strokes)';
            }
        } else if (instance.mode === 'type') {
            var input = document.getElementById(pRegionId + '_initials_input');
            var text = input ? input.value.trim() : '';

            if (instance.required && !text) {
                isValid = false;
                message = 'Please enter your initials';
            } else if (text && text.length < 1) {
                isValid = false;
                message = 'Please enter at least 1 character';
            }
        }

        if (!isValid && message) {
            validationEl.textContent = message;
            validationEl.style.display = 'block';
            validationEl.className = 'apex-sig-initials-validation error';
        } else {
            validationEl.style.display = 'none';
        }

        return isValid;
    },

    /**
     * Clear initials
     */
    clear: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        if (instance.mode === 'draw') {
            if (instance.signaturePad) {
                instance.signaturePad.clear();
            }
            instance.strokeCount = 0;
        } else if (instance.mode === 'type') {
            var input = document.getElementById(pRegionId + '_initials_input');
            if (input) {
                input.value = '';
                instance.typedInitials = '';
            }
            this.updateTypedPreview(pRegionId);
        }

        instance.initialsData = null;
        this.validateInitials(pRegionId);

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-initials-cleared', {
                mode: instance.mode
            });
        }
    },

    /**
     * Confirm initials
     */
    confirm: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];

        if (!this.validateInitials(pRegionId)) {
            return false;
        }

        // Get initials data
        this.getInitialsData(pRegionId, function(dataUrl) {
            if (dataUrl) {
                instance.initialsData = dataUrl;

                if (typeof apexSignature !== 'undefined') {
                    apexSignature.triggerEvent(pRegionId, 'apexsignature-initials-confirmed', {
                        mode: instance.mode,
                        data: dataUrl
                    });
                }

                // Show success
                var validationEl = document.getElementById(pRegionId + '_initials_validation');
                if (validationEl) {
                    validationEl.textContent = 'Initials confirmed!';
                    validationEl.style.display = 'block';
                    validationEl.className = 'apex-sig-initials-validation success';

                    setTimeout(function() {
                        validationEl.style.display = 'none';
                    }, 2000);
                }
            }
        });

        return true;
    },

    /**
     * Get initials as data URL
     */
    getInitialsData: function(pRegionId, callback) {
        var instance = this.instances[pRegionId];
        if (!instance) {
            callback(null);
            return;
        }

        if (instance.mode === 'draw') {
            if (instance.signaturePad && !instance.signaturePad.isEmpty()) {
                callback(instance.signaturePad.toDataURL('image/png'));
            } else {
                callback(null);
            }
        } else if (instance.mode === 'type') {
            var previewCanvas = document.getElementById(pRegionId + '_initials_preview_canvas');
            if (previewCanvas) {
                var input = document.getElementById(pRegionId + '_initials_input');
                if (input && input.value.trim()) {
                    callback(previewCanvas.toDataURL('image/png'));
                } else {
                    callback(null);
                }
            } else {
                callback(null);
            }
        } else {
            callback(null);
        }
    },

    /**
     * Check if initials are empty
     */
    isEmpty: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return true;

        if (instance.mode === 'draw') {
            return instance.signaturePad ? instance.signaturePad.isEmpty() : true;
        } else if (instance.mode === 'type') {
            var input = document.getElementById(pRegionId + '_initials_input');
            return !input || !input.value.trim();
        }

        return true;
    },

    /**
     * Get confirmed initials data
     */
    getConfirmedData: function(pRegionId) {
        var instance = this.instances[pRegionId];
        return instance ? instance.initialsData : null;
    },

    /**
     * Set full name (for auto-generation)
     */
    setFullName: function(pRegionId, fullName) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        instance.fullName = fullName;
        instance.generatedInitials = this.generateInitials(fullName);

        // Update input if in type mode
        if (instance.mode === 'type') {
            var input = document.getElementById(pRegionId + '_initials_input');
            if (input && !input.value) {
                input.value = instance.generatedInitials;
                this.updateTypedPreview(pRegionId);
            }
        }
    },

    /**
     * Set pen color
     */
    setPenColor: function(pRegionId, color) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        instance.penColor = color;

        if (instance.signaturePad) {
            instance.signaturePad.penColor = color;
        }

        if (instance.mode === 'type') {
            this.updateTypedPreview(pRegionId);
        }
    },

    /**
     * Get mode
     */
    getMode: function(pRegionId) {
        var instance = this.instances[pRegionId];
        return instance ? instance.mode : null;
    },

    /**
     * Set mode
     */
    setMode: function(pRegionId, mode) {
        if (mode === 'draw' || mode === 'type') {
            this.switchMode(pRegionId, mode);
        }
    }
};
