/**
 * APEX Signature Plugin - Customization Toolbar Module
 *
 * @author Daniel Hochleitner (original plugin)
 * @contributor Maxwell da Silva Oliveira - M&S do Brasil LTDA
 * @version 3.3.0
 * @license MIT
 *
 * Features:
 * - Color picker for pen color
 * - Line thickness slider
 * - Preset color buttons
 * - Eraser mode
 * - Undo/Redo functionality
 * - Save user preferences to localStorage
 *
 * LinkedIn: /maxwbh
 */

var apexSignatureToolbar = {
    // Module version
    VERSION: '3.3.0',

    // Storage key prefix for preferences
    STORAGE_PREFIX: 'apex_sig_prefs_',

    // Default colors preset
    DEFAULT_COLORS: [
        { name: 'Black', value: '#000000' },
        { name: 'Blue', value: '#0066cc' },
        { name: 'Red', value: '#cc0000' },
        { name: 'Green', value: '#006600' },
        { name: 'Purple', value: '#660099' }
    ],

    // Default thickness range
    DEFAULT_MIN_WIDTH: 0.5,
    DEFAULT_MAX_WIDTH: 5.0,
    DEFAULT_WIDTH: 2.0,

    // Undo history limit
    MAX_HISTORY: 30,

    // Store module instances
    instances: {},

    /**
     * Initialize toolbar module
     * @param {string} pRegionId - Region ID
     * @param {object} pOptions - Configuration options
     */
    init: function(pRegionId, pOptions) {
        var self = this;
        var options = pOptions || {};

        // Create instance
        this.instances[pRegionId] = {
            options: options,
            storageKey: this.STORAGE_PREFIX + (options.appId || 'default') + '_' + (options.userId || 'default'),
            currentColor: options.penColor || '#000000',
            currentWidth: options.lineWidth || this.DEFAULT_WIDTH,
            minWidth: options.minWidth || this.DEFAULT_MIN_WIDTH,
            maxWidth: options.maxWidth || this.DEFAULT_MAX_WIDTH,
            colors: options.colors || this.DEFAULT_COLORS,
            isErasing: false,
            history: [],
            historyIndex: -1,
            originalPenColor: null,
            originalMinWidth: null,
            originalMaxWidth: null
        };

        var instance = this.instances[pRegionId];

        // Load saved preferences
        this.loadPreferences(pRegionId);

        // Build toolbar UI
        this.buildToolbar(pRegionId, options);

        // Initialize undo/redo
        this.initUndoRedo(pRegionId);

        // Apply initial settings
        this.applySettings(pRegionId);

        // Trigger init event
        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-toolbar-initialized', {
                version: this.VERSION,
                color: instance.currentColor,
                width: instance.currentWidth
            });
        }

        console.log('apexSignatureToolbar v' + this.VERSION + ' initialized for region:', pRegionId);
    },

    /**
     * Build the toolbar UI
     */
    buildToolbar: function(pRegionId, pOptions) {
        var self = this;
        var instance = this.instances[pRegionId];

        var wrapper = document.getElementById(pRegionId + '_wrapper');
        if (!wrapper) {
            wrapper = document.getElementById(pRegionId + '_signature');
        }
        if (!wrapper) return;

        // Create toolbar container
        var toolbar = document.createElement('div');
        toolbar.className = 'apex-sig-toolbar';
        toolbar.id = pRegionId + '_toolbar';
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Signature customization toolbar');

        // === Color Section ===
        var colorSection = document.createElement('div');
        colorSection.className = 'apex-sig-toolbar-section apex-sig-toolbar-colors';

        // Color label
        var colorLabel = document.createElement('span');
        colorLabel.className = 'apex-sig-toolbar-label';
        colorLabel.textContent = pOptions.colorLabel || 'Color:';
        colorSection.appendChild(colorLabel);

        // Preset color buttons
        var colorPresets = document.createElement('div');
        colorPresets.className = 'apex-sig-color-presets';

        instance.colors.forEach(function(color) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'apex-sig-color-btn';
            btn.style.backgroundColor = color.value;
            btn.setAttribute('data-color', color.value);
            btn.setAttribute('title', color.name);
            btn.setAttribute('aria-label', 'Set pen color to ' + color.name);

            if (color.value === instance.currentColor) {
                btn.classList.add('active');
            }

            btn.addEventListener('click', function() {
                self.setColor(pRegionId, color.value);
            });

            colorPresets.appendChild(btn);
        });

        colorSection.appendChild(colorPresets);

        // Custom color picker
        var customColorWrapper = document.createElement('div');
        customColorWrapper.className = 'apex-sig-custom-color';

        var customColorInput = document.createElement('input');
        customColorInput.type = 'color';
        customColorInput.id = pRegionId + '_color_picker';
        customColorInput.className = 'apex-sig-color-picker';
        customColorInput.value = instance.currentColor;
        customColorInput.title = 'Custom color';
        customColorInput.setAttribute('aria-label', 'Choose custom pen color');

        customColorInput.addEventListener('input', function(e) {
            self.setColor(pRegionId, e.target.value);
        });

        customColorWrapper.appendChild(customColorInput);
        colorSection.appendChild(customColorWrapper);

        toolbar.appendChild(colorSection);

        // === Thickness Section ===
        var thicknessSection = document.createElement('div');
        thicknessSection.className = 'apex-sig-toolbar-section apex-sig-toolbar-thickness';

        // Thickness label
        var thicknessLabel = document.createElement('span');
        thicknessLabel.className = 'apex-sig-toolbar-label';
        thicknessLabel.textContent = pOptions.thicknessLabel || 'Thickness:';
        thicknessSection.appendChild(thicknessLabel);

        // Thickness slider
        var sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'apex-sig-slider-wrapper';

        var thicknessSlider = document.createElement('input');
        thicknessSlider.type = 'range';
        thicknessSlider.id = pRegionId + '_thickness_slider';
        thicknessSlider.className = 'apex-sig-thickness-slider';
        thicknessSlider.min = instance.minWidth;
        thicknessSlider.max = instance.maxWidth;
        thicknessSlider.step = '0.1';
        thicknessSlider.value = instance.currentWidth;
        thicknessSlider.setAttribute('aria-label', 'Pen thickness');

        thicknessSlider.addEventListener('input', function(e) {
            self.setThickness(pRegionId, parseFloat(e.target.value));
        });

        sliderWrapper.appendChild(thicknessSlider);

        // Thickness value display
        var thicknessValue = document.createElement('span');
        thicknessValue.className = 'apex-sig-thickness-value';
        thicknessValue.id = pRegionId + '_thickness_value';
        thicknessValue.textContent = instance.currentWidth.toFixed(1) + 'px';
        sliderWrapper.appendChild(thicknessValue);

        thicknessSection.appendChild(sliderWrapper);
        toolbar.appendChild(thicknessSection);

        // === Tools Section ===
        var toolsSection = document.createElement('div');
        toolsSection.className = 'apex-sig-toolbar-section apex-sig-toolbar-tools';

        // Eraser button
        var eraserBtn = document.createElement('button');
        eraserBtn.type = 'button';
        eraserBtn.id = pRegionId + '_eraser_btn';
        eraserBtn.className = 'apex-sig-tool-btn apex-sig-eraser-btn';
        eraserBtn.innerHTML = '<span class="apex-sig-icon">&#9003;</span> ' + (pOptions.eraserLabel || 'Eraser');
        eraserBtn.title = 'Toggle eraser mode';
        eraserBtn.setAttribute('aria-pressed', 'false');

        eraserBtn.addEventListener('click', function() {
            self.toggleEraser(pRegionId);
        });

        toolsSection.appendChild(eraserBtn);

        // Separator
        var separator1 = document.createElement('span');
        separator1.className = 'apex-sig-toolbar-separator';
        toolsSection.appendChild(separator1);

        // Undo button
        var undoBtn = document.createElement('button');
        undoBtn.type = 'button';
        undoBtn.id = pRegionId + '_undo_btn';
        undoBtn.className = 'apex-sig-tool-btn apex-sig-undo-btn';
        undoBtn.innerHTML = '<span class="apex-sig-icon">&#8630;</span> ' + (pOptions.undoLabel || 'Undo');
        undoBtn.title = 'Undo last stroke (Ctrl+Z)';
        undoBtn.disabled = true;

        undoBtn.addEventListener('click', function() {
            self.undo(pRegionId);
        });

        toolsSection.appendChild(undoBtn);

        // Redo button
        var redoBtn = document.createElement('button');
        redoBtn.type = 'button';
        redoBtn.id = pRegionId + '_redo_btn';
        redoBtn.className = 'apex-sig-tool-btn apex-sig-redo-btn';
        redoBtn.innerHTML = '<span class="apex-sig-icon">&#8631;</span> ' + (pOptions.redoLabel || 'Redo');
        redoBtn.title = 'Redo last stroke (Ctrl+Y)';
        redoBtn.disabled = true;

        redoBtn.addEventListener('click', function() {
            self.redo(pRegionId);
        });

        toolsSection.appendChild(redoBtn);

        // Separator
        var separator2 = document.createElement('span');
        separator2.className = 'apex-sig-toolbar-separator';
        toolsSection.appendChild(separator2);

        // Clear button
        var clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.id = pRegionId + '_clear_btn';
        clearBtn.className = 'apex-sig-tool-btn apex-sig-clear-btn';
        clearBtn.innerHTML = '<span class="apex-sig-icon">&#128465;</span> ' + (pOptions.clearLabel || 'Clear');
        clearBtn.title = 'Clear signature';

        clearBtn.addEventListener('click', function() {
            self.clearSignature(pRegionId);
        });

        toolsSection.appendChild(clearBtn);

        toolbar.appendChild(toolsSection);

        // Insert toolbar before the panels
        var panels = wrapper.querySelector('.apex-sig-panels');
        if (panels) {
            wrapper.insertBefore(toolbar, panels);
        } else {
            wrapper.insertBefore(toolbar, wrapper.firstChild);
        }

        // Keyboard shortcuts
        this.initKeyboardShortcuts(pRegionId);
    },

    /**
     * Initialize keyboard shortcuts
     */
    initKeyboardShortcuts: function(pRegionId) {
        var self = this;

        document.addEventListener('keydown', function(e) {
            // Only handle when signature region is focused or active
            var wrapper = document.getElementById(pRegionId + '_wrapper');
            if (!wrapper) return;

            // Check if we're in the signature area
            var isInRegion = wrapper.contains(document.activeElement) ||
                            wrapper.contains(e.target);

            if (!isInRegion) return;

            // Ctrl+Z: Undo
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                self.undo(pRegionId);
            }

            // Ctrl+Y or Ctrl+Shift+Z: Redo
            if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                self.redo(pRegionId);
            }

            // E: Toggle eraser
            if (e.key === 'e' && !e.ctrlKey && !e.altKey && e.target.tagName !== 'INPUT') {
                self.toggleEraser(pRegionId);
            }
        });
    },

    /**
     * Initialize undo/redo system
     */
    initUndoRedo: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];

        if (typeof apexSignature === 'undefined' || !apexSignature.instances[pRegionId]) {
            return;
        }

        var sigInstance = apexSignature.instances[pRegionId];
        if (!sigInstance.signaturePad) return;

        var signaturePad = sigInstance.signaturePad;

        // Save initial empty state
        this.saveToHistory(pRegionId);

        // Listen for stroke end to save history
        signaturePad.addEventListener('endStroke', function() {
            self.saveToHistory(pRegionId);
        });
    },

    /**
     * Save current state to history
     */
    saveToHistory: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        if (typeof apexSignature === 'undefined' || !apexSignature.instances[pRegionId]) {
            return;
        }

        var sigInstance = apexSignature.instances[pRegionId];
        if (!sigInstance.signaturePad) return;

        var signaturePad = sigInstance.signaturePad;
        var data = signaturePad.toData();

        // Remove any states after current index (for redo)
        instance.history = instance.history.slice(0, instance.historyIndex + 1);

        // Add new state
        instance.history.push(JSON.stringify(data));
        instance.historyIndex = instance.history.length - 1;

        // Limit history size
        if (instance.history.length > this.MAX_HISTORY) {
            instance.history.shift();
            instance.historyIndex--;
        }

        this.updateUndoRedoButtons(pRegionId);
    },

    /**
     * Update undo/redo button states
     */
    updateUndoRedoButtons: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        var undoBtn = document.getElementById(pRegionId + '_undo_btn');
        var redoBtn = document.getElementById(pRegionId + '_redo_btn');

        if (undoBtn) {
            undoBtn.disabled = instance.historyIndex <= 0;
        }

        if (redoBtn) {
            redoBtn.disabled = instance.historyIndex >= instance.history.length - 1;
        }
    },

    /**
     * Undo last stroke
     */
    undo: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance || instance.historyIndex <= 0) return;

        instance.historyIndex--;
        this.restoreFromHistory(pRegionId);

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-undo', {
                historyIndex: instance.historyIndex
            });
        }
    },

    /**
     * Redo last undone stroke
     */
    redo: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance || instance.historyIndex >= instance.history.length - 1) return;

        instance.historyIndex++;
        this.restoreFromHistory(pRegionId);

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-redo', {
                historyIndex: instance.historyIndex
            });
        }
    },

    /**
     * Restore state from history
     */
    restoreFromHistory: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        if (typeof apexSignature === 'undefined' || !apexSignature.instances[pRegionId]) {
            return;
        }

        var sigInstance = apexSignature.instances[pRegionId];
        if (!sigInstance.signaturePad) return;

        var signaturePad = sigInstance.signaturePad;
        var historyData = instance.history[instance.historyIndex];

        if (historyData) {
            var data = JSON.parse(historyData);
            signaturePad.fromData(data);
        }

        this.updateUndoRedoButtons(pRegionId);
    },

    /**
     * Set pen color
     */
    setColor: function(pRegionId, pColor) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        // Exit eraser mode if active
        if (instance.isErasing) {
            this.toggleEraser(pRegionId);
        }

        instance.currentColor = pColor;

        // Update signature pad
        if (typeof apexSignature !== 'undefined' && apexSignature.instances[pRegionId]) {
            var sigInstance = apexSignature.instances[pRegionId];
            if (sigInstance.signaturePad) {
                sigInstance.signaturePad.penColor = pColor;
            }
        }

        // Update UI
        this.updateColorUI(pRegionId, pColor);

        // Save preference
        this.savePreferences(pRegionId);

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-color-changed', {
                color: pColor
            });
        }
    },

    /**
     * Update color UI elements
     */
    updateColorUI: function(pRegionId, pColor) {
        // Update preset buttons
        var presetBtns = document.querySelectorAll('#' + pRegionId + '_toolbar .apex-sig-color-btn');
        presetBtns.forEach(function(btn) {
            if (btn.getAttribute('data-color') === pColor) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update color picker
        var colorPicker = document.getElementById(pRegionId + '_color_picker');
        if (colorPicker) {
            colorPicker.value = pColor;
        }
    },

    /**
     * Set line thickness
     */
    setThickness: function(pRegionId, pWidth) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        instance.currentWidth = pWidth;

        // Update signature pad
        if (typeof apexSignature !== 'undefined' && apexSignature.instances[pRegionId]) {
            var sigInstance = apexSignature.instances[pRegionId];
            if (sigInstance.signaturePad) {
                sigInstance.signaturePad.minWidth = pWidth * 0.5;
                sigInstance.signaturePad.maxWidth = pWidth;
            }
        }

        // Update UI
        var valueDisplay = document.getElementById(pRegionId + '_thickness_value');
        if (valueDisplay) {
            valueDisplay.textContent = pWidth.toFixed(1) + 'px';
        }

        // Save preference
        this.savePreferences(pRegionId);

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-thickness-changed', {
                width: pWidth
            });
        }
    },

    /**
     * Toggle eraser mode
     */
    toggleEraser: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        if (typeof apexSignature === 'undefined' || !apexSignature.instances[pRegionId]) {
            return;
        }

        var sigInstance = apexSignature.instances[pRegionId];
        if (!sigInstance.signaturePad) return;

        var signaturePad = sigInstance.signaturePad;
        var eraserBtn = document.getElementById(pRegionId + '_eraser_btn');

        if (instance.isErasing) {
            // Exit eraser mode - restore original settings
            instance.isErasing = false;

            signaturePad.penColor = instance.originalPenColor || instance.currentColor;
            signaturePad.minWidth = instance.originalMinWidth;
            signaturePad.maxWidth = instance.originalMaxWidth;

            if (eraserBtn) {
                eraserBtn.classList.remove('active');
                eraserBtn.setAttribute('aria-pressed', 'false');
            }

            // Remove eraser class from canvas
            var canvas = signaturePad._canvas;
            if (canvas) {
                canvas.classList.remove('apex-sig-erasing');
            }
        } else {
            // Enter eraser mode
            instance.isErasing = true;

            // Save original settings
            instance.originalPenColor = signaturePad.penColor;
            instance.originalMinWidth = signaturePad.minWidth;
            instance.originalMaxWidth = signaturePad.maxWidth;

            // Set eraser settings (white color, thicker stroke)
            var bgColor = instance.options.backgroundColor || '#ffffff';
            signaturePad.penColor = bgColor;
            signaturePad.minWidth = 10;
            signaturePad.maxWidth = 15;

            if (eraserBtn) {
                eraserBtn.classList.add('active');
                eraserBtn.setAttribute('aria-pressed', 'true');
            }

            // Add eraser class to canvas for cursor
            var canvas = signaturePad._canvas;
            if (canvas) {
                canvas.classList.add('apex-sig-erasing');
            }
        }

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-eraser-toggled', {
                isErasing: instance.isErasing
            });
        }
    },

    /**
     * Clear signature
     */
    clearSignature: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        if (typeof apexSignature !== 'undefined') {
            apexSignature.clearSignature(pRegionId);
        }

        // Reset history
        instance.history = [];
        instance.historyIndex = -1;
        this.saveToHistory(pRegionId);

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-toolbar-cleared', {});
        }
    },

    /**
     * Apply current settings to signature pad
     */
    applySettings: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        if (typeof apexSignature === 'undefined' || !apexSignature.instances[pRegionId]) {
            return;
        }

        var sigInstance = apexSignature.instances[pRegionId];
        if (!sigInstance.signaturePad) return;

        var signaturePad = sigInstance.signaturePad;

        signaturePad.penColor = instance.currentColor;
        signaturePad.minWidth = instance.currentWidth * 0.5;
        signaturePad.maxWidth = instance.currentWidth;
    },

    /**
     * Save preferences to localStorage
     */
    savePreferences: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        var prefs = {
            color: instance.currentColor,
            width: instance.currentWidth
        };

        try {
            localStorage.setItem(instance.storageKey, JSON.stringify(prefs));
        } catch (e) {
            console.warn('apexSignatureToolbar: Could not save preferences:', e);
        }
    },

    /**
     * Load preferences from localStorage
     */
    loadPreferences: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        try {
            var stored = localStorage.getItem(instance.storageKey);
            if (stored) {
                var prefs = JSON.parse(stored);
                if (prefs.color) instance.currentColor = prefs.color;
                if (prefs.width) instance.currentWidth = prefs.width;
            }
        } catch (e) {
            console.warn('apexSignatureToolbar: Could not load preferences:', e);
        }
    },

    /**
     * Get current color
     */
    getColor: function(pRegionId) {
        var instance = this.instances[pRegionId];
        return instance ? instance.currentColor : null;
    },

    /**
     * Get current thickness
     */
    getThickness: function(pRegionId) {
        var instance = this.instances[pRegionId];
        return instance ? instance.currentWidth : null;
    },

    /**
     * Check if eraser is active
     */
    isEraserActive: function(pRegionId) {
        var instance = this.instances[pRegionId];
        return instance ? instance.isErasing : false;
    },

    /**
     * Reset to default settings
     */
    resetToDefaults: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        this.setColor(pRegionId, '#000000');
        this.setThickness(pRegionId, this.DEFAULT_WIDTH);

        if (instance.isErasing) {
            this.toggleEraser(pRegionId);
        }

        // Clear saved preferences
        try {
            localStorage.removeItem(instance.storageKey);
        } catch (e) {
            // Ignore
        }

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-toolbar-reset', {});
        }
    }
};
