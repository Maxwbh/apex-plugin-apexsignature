/**
 * APEX Signature Plugin - Timestamp Overlay Module
 *
 * @author Daniel Hochleitner (original plugin)
 * @contributor Maxwell da Silva Oliveira - M&S do Brasil LTDA
 * @version 3.4.0
 * @license MIT
 *
 * Features:
 * - Add date/time overlay to signatures
 * - Configurable position (below, right, top-right, bottom-right)
 * - Configurable date/time format
 * - Optional IP address and location
 * - Optional user info
 * - Audit trail metadata
 *
 * LinkedIn: /maxwbh
 */

var apexSignatureTimestamp = {
    // Module version
    VERSION: '3.4.0',

    // Position options
    POSITIONS: {
        BELOW: 'below',
        RIGHT: 'right',
        TOP_RIGHT: 'top-right',
        BOTTOM_RIGHT: 'bottom-right'
    },

    // Default date formats
    FORMATS: {
        ISO: 'YYYY-MM-DD HH:mm:ss',
        US: 'MM/DD/YYYY hh:mm:ss A',
        EU: 'DD/MM/YYYY HH:mm:ss',
        BR: 'DD/MM/YYYY HH:mm:ss',
        SHORT: 'YYYY-MM-DD',
        TIME_ONLY: 'HH:mm:ss'
    },

    // Store module instances
    instances: {},

    /**
     * Initialize timestamp module
     * @param {string} pRegionId - Region ID
     * @param {object} pOptions - Configuration options
     */
    init: function(pRegionId, pOptions) {
        var self = this;
        var options = pOptions || {};

        // Create instance
        this.instances[pRegionId] = {
            options: options,
            enabled: options.enabled !== false,
            position: options.position || this.POSITIONS.BELOW,
            format: options.format || this.FORMATS.BR,
            includeDate: options.includeDate !== false,
            includeTime: options.includeTime !== false,
            includeIP: options.includeIP === true,
            includeUser: options.includeUser === true,
            includeLocation: options.includeLocation === true,
            fontSize: options.fontSize || 12,
            fontFamily: options.fontFamily || 'Arial, sans-serif',
            fontColor: options.fontColor || '#666666',
            prefix: options.prefix || '',
            suffix: options.suffix || '',
            userName: options.userName || '',
            ipAddress: null,
            location: null,
            metadata: {}
        };

        var instance = this.instances[pRegionId];

        // Build UI controls
        this.buildControls(pRegionId, options);

        // Fetch IP if required
        if (instance.includeIP || instance.includeLocation) {
            this.fetchIPInfo(pRegionId);
        }

        // Override save method to include timestamp
        this.hookSaveMethod(pRegionId);

        // Trigger init event
        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-timestamp-initialized', {
                version: this.VERSION,
                enabled: instance.enabled,
                position: instance.position,
                format: instance.format
            });
        }

        console.log('apexSignatureTimestamp v' + this.VERSION + ' initialized for region:', pRegionId);
    },

    /**
     * Build timestamp control UI
     */
    buildControls: function(pRegionId, pOptions) {
        var self = this;
        var instance = this.instances[pRegionId];

        // Find toolbar or wrapper
        var toolbar = document.getElementById(pRegionId + '_toolbar');
        var wrapper = document.getElementById(pRegionId + '_wrapper') ||
                     document.getElementById(pRegionId + '_signature');

        if (!wrapper) return;

        // Create timestamp controls container
        var controls = document.createElement('div');
        controls.className = 'apex-sig-timestamp-controls';
        controls.id = pRegionId + '_timestamp_controls';

        // Enable/Disable toggle
        var toggleWrapper = document.createElement('label');
        toggleWrapper.className = 'apex-sig-timestamp-toggle';

        var toggleCheckbox = document.createElement('input');
        toggleCheckbox.type = 'checkbox';
        toggleCheckbox.id = pRegionId + '_timestamp_enabled';
        toggleCheckbox.checked = instance.enabled;

        var toggleLabel = document.createElement('span');
        toggleLabel.className = 'apex-sig-timestamp-label';
        toggleLabel.textContent = pOptions.enableLabel || 'Add Timestamp';

        toggleWrapper.appendChild(toggleCheckbox);
        toggleWrapper.appendChild(toggleLabel);
        controls.appendChild(toggleWrapper);

        // Position selector
        if (pOptions.showPositionSelector !== false) {
            var positionWrapper = document.createElement('div');
            positionWrapper.className = 'apex-sig-timestamp-position';

            var positionLabel = document.createElement('span');
            positionLabel.className = 'apex-sig-timestamp-label';
            positionLabel.textContent = pOptions.positionLabel || 'Position:';

            var positionSelect = document.createElement('select');
            positionSelect.id = pRegionId + '_timestamp_position';
            positionSelect.className = 'apex-sig-timestamp-select';

            var positions = [
                { value: 'below', label: pOptions.belowLabel || 'Below' },
                { value: 'right', label: pOptions.rightLabel || 'Right' },
                { value: 'top-right', label: pOptions.topRightLabel || 'Top Right' },
                { value: 'bottom-right', label: pOptions.bottomRightLabel || 'Bottom Right' }
            ];

            positions.forEach(function(pos) {
                var option = document.createElement('option');
                option.value = pos.value;
                option.textContent = pos.label;
                if (pos.value === instance.position) {
                    option.selected = true;
                }
                positionSelect.appendChild(option);
            });

            positionWrapper.appendChild(positionLabel);
            positionWrapper.appendChild(positionSelect);
            controls.appendChild(positionWrapper);
        }

        // Preview button
        var previewBtn = document.createElement('button');
        previewBtn.type = 'button';
        previewBtn.id = pRegionId + '_timestamp_preview';
        previewBtn.className = 'apex-sig-timestamp-btn';
        previewBtn.innerHTML = '<span class="apex-sig-icon">&#128065;</span> ' + (pOptions.previewLabel || 'Preview');
        previewBtn.title = 'Preview signature with timestamp';
        controls.appendChild(previewBtn);

        // Insert controls
        if (toolbar) {
            toolbar.appendChild(controls);
        } else {
            wrapper.insertBefore(controls, wrapper.firstChild);
        }

        // Event listeners
        toggleCheckbox.addEventListener('change', function() {
            instance.enabled = this.checked;
            self.updateControlsState(pRegionId);

            apexSignature.triggerEvent(pRegionId, 'apexsignature-timestamp-toggled', {
                enabled: instance.enabled
            });
        });

        if (document.getElementById(pRegionId + '_timestamp_position')) {
            document.getElementById(pRegionId + '_timestamp_position').addEventListener('change', function() {
                instance.position = this.value;

                apexSignature.triggerEvent(pRegionId, 'apexsignature-timestamp-position-changed', {
                    position: instance.position
                });
            });
        }

        previewBtn.addEventListener('click', function() {
            self.showPreview(pRegionId);
        });

        // Initial state
        this.updateControlsState(pRegionId);
    },

    /**
     * Update controls enabled/disabled state
     */
    updateControlsState: function(pRegionId) {
        var instance = this.instances[pRegionId];
        var positionSelect = document.getElementById(pRegionId + '_timestamp_position');
        var previewBtn = document.getElementById(pRegionId + '_timestamp_preview');

        if (positionSelect) {
            positionSelect.disabled = !instance.enabled;
        }
        if (previewBtn) {
            previewBtn.disabled = !instance.enabled;
        }
    },

    /**
     * Fetch IP address and location info
     */
    fetchIPInfo: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];

        // Try to get IP from a free API
        fetch('https://api.ipify.org?format=json')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                instance.ipAddress = data.ip;
                instance.metadata.ip = data.ip;
                instance.metadata.ipFetchedAt = new Date().toISOString();

                apexSignature.triggerEvent(pRegionId, 'apexsignature-ip-fetched', {
                    ip: data.ip
                });
            })
            .catch(function(error) {
                console.warn('apexSignatureTimestamp: Could not fetch IP:', error);
                instance.ipAddress = 'N/A';
            });

        // Get location if enabled
        if (instance.includeLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    instance.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    instance.metadata.location = instance.location;
                    instance.metadata.locationFetchedAt = new Date().toISOString();

                    apexSignature.triggerEvent(pRegionId, 'apexsignature-location-fetched', {
                        location: instance.location
                    });
                },
                function(error) {
                    console.warn('apexSignatureTimestamp: Could not get location:', error);
                    instance.location = null;
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
            );
        }
    },

    /**
     * Format date according to format string
     */
    formatDate: function(date, format) {
        var d = date || new Date();

        var pad = function(num) {
            return String(num).padStart(2, '0');
        };

        var hours12 = d.getHours() % 12 || 12;
        var ampm = d.getHours() >= 12 ? 'PM' : 'AM';

        var replacements = {
            'YYYY': d.getFullYear(),
            'YY': String(d.getFullYear()).slice(-2),
            'MM': pad(d.getMonth() + 1),
            'DD': pad(d.getDate()),
            'HH': pad(d.getHours()),
            'hh': pad(hours12),
            'mm': pad(d.getMinutes()),
            'ss': pad(d.getSeconds()),
            'A': ampm,
            'a': ampm.toLowerCase()
        };

        var result = format;
        for (var key in replacements) {
            result = result.replace(new RegExp(key, 'g'), replacements[key]);
        }

        return result;
    },

    /**
     * Generate timestamp text
     */
    generateTimestampText: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return '';

        var parts = [];
        var now = new Date();

        // Date/Time
        if (instance.includeDate || instance.includeTime) {
            var dateFormat = instance.format;

            if (!instance.includeDate) {
                dateFormat = 'HH:mm:ss';
            } else if (!instance.includeTime) {
                dateFormat = dateFormat.replace(/\s*HH:mm:ss\s*/g, '').replace(/\s*hh:mm:ss\s*A?/gi, '');
            }

            parts.push(this.formatDate(now, dateFormat));
        }

        // User
        if (instance.includeUser && instance.userName) {
            parts.push(instance.userName);
        }

        // IP Address
        if (instance.includeIP && instance.ipAddress) {
            parts.push('IP: ' + instance.ipAddress);
        }

        // Location
        if (instance.includeLocation && instance.location) {
            parts.push('Loc: ' + instance.location.latitude.toFixed(4) + ', ' + instance.location.longitude.toFixed(4));
        }

        var text = parts.join(' | ');

        // Add prefix/suffix
        if (instance.prefix) {
            text = instance.prefix + ' ' + text;
        }
        if (instance.suffix) {
            text = text + ' ' + instance.suffix;
        }

        return text;
    },

    /**
     * Get current metadata for audit
     */
    getMetadata: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return {};

        var metadata = {
            timestamp: new Date().toISOString(),
            format: instance.format,
            position: instance.position,
            userAgent: navigator.userAgent
        };

        if (instance.userName) {
            metadata.userName = instance.userName;
        }

        if (instance.ipAddress) {
            metadata.ipAddress = instance.ipAddress;
        }

        if (instance.location) {
            metadata.location = instance.location;
        }

        return metadata;
    },

    /**
     * Add timestamp overlay to signature image
     */
    addTimestampToSignature: function(pRegionId, signatureDataUrl, callback) {
        var self = this;
        var instance = this.instances[pRegionId];

        if (!instance || !instance.enabled) {
            callback(signatureDataUrl);
            return;
        }

        var timestampText = this.generateTimestampText(pRegionId);
        if (!timestampText) {
            callback(signatureDataUrl);
            return;
        }

        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            var padding = 10;
            var lineHeight = instance.fontSize + 4;

            // Calculate new canvas size based on position
            var textWidth = self.measureTextWidth(timestampText, instance.fontSize, instance.fontFamily);
            var newWidth = img.width;
            var newHeight = img.height;

            switch (instance.position) {
                case 'below':
                    newHeight = img.height + lineHeight + padding;
                    break;
                case 'right':
                    newWidth = img.width + textWidth + padding * 2;
                    break;
                case 'top-right':
                case 'bottom-right':
                    // No resize needed, overlay on image
                    break;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            // Draw white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw signature
            var sigX = 0;
            var sigY = 0;

            if (instance.position === 'right') {
                // Signature on left
                sigX = 0;
            }

            ctx.drawImage(img, sigX, sigY, img.width, img.height);

            // Configure text
            ctx.font = instance.fontSize + 'px ' + instance.fontFamily;
            ctx.fillStyle = instance.fontColor;
            ctx.textBaseline = 'middle';

            // Draw timestamp text
            var textX, textY;

            switch (instance.position) {
                case 'below':
                    ctx.textAlign = 'center';
                    textX = canvas.width / 2;
                    textY = img.height + padding + lineHeight / 2;
                    break;
                case 'right':
                    ctx.textAlign = 'left';
                    textX = img.width + padding;
                    textY = canvas.height / 2;
                    break;
                case 'top-right':
                    ctx.textAlign = 'right';
                    textX = canvas.width - padding;
                    textY = padding + instance.fontSize / 2;
                    break;
                case 'bottom-right':
                    ctx.textAlign = 'right';
                    textX = canvas.width - padding;
                    textY = canvas.height - padding - instance.fontSize / 2;
                    break;
            }

            ctx.fillText(timestampText, textX, textY);

            // Return new data URL
            var newDataUrl = canvas.toDataURL('image/png');
            callback(newDataUrl);
        };

        img.onerror = function() {
            console.error('apexSignatureTimestamp: Failed to load signature image');
            callback(signatureDataUrl);
        };

        img.src = signatureDataUrl;
    },

    /**
     * Measure text width
     */
    measureTextWidth: function(text, fontSize, fontFamily) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.font = fontSize + 'px ' + fontFamily;
        return ctx.measureText(text).width;
    },

    /**
     * Hook into save method to add timestamp
     */
    hookSaveMethod: function(pRegionId) {
        var self = this;

        // Store original save2Db function
        var originalSave2Db = apexSignature.save2Db;

        // Override save2Db
        apexSignature.save2Db = function(pAjaxIdentifier, pRegionId2, pImg, callback, options) {
            var instance = self.instances[pRegionId2];

            if (instance && instance.enabled) {
                // Add timestamp to image before saving
                self.addTimestampToSignature(pRegionId2, pImg, function(newImg) {
                    // Add metadata to options
                    var newOptions = options || {};
                    newOptions.metadata = self.getMetadata(pRegionId2);

                    // Call original function with new image
                    originalSave2Db.call(apexSignature, pAjaxIdentifier, pRegionId2, newImg, callback, newOptions);
                });
            } else {
                // Call original function
                originalSave2Db.call(apexSignature, pAjaxIdentifier, pRegionId2, pImg, callback, options);
            }
        };
    },

    /**
     * Show preview with timestamp
     */
    showPreview: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];

        if (!instance) return;

        // Check if signature exists
        if (typeof apexSignature !== 'undefined' && apexSignature.isSignatureEmpty(pRegionId)) {
            apex.message.alert('Please create a signature first to preview with timestamp.');
            return;
        }

        // Get current signature
        var signatureData = apexSignature.getCurrentSignature(pRegionId);
        if (!signatureData) return;

        // Add timestamp
        this.addTimestampToSignature(pRegionId, signatureData, function(newData) {
            // Show preview modal
            self.showPreviewModal(pRegionId, newData);
        });
    },

    /**
     * Show preview modal
     */
    showPreviewModal: function(pRegionId, imageData) {
        var self = this;

        // Remove existing modal
        var existingModal = document.getElementById(pRegionId + '_timestamp_preview_modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        var modal = document.createElement('div');
        modal.className = 'apex-sig-timestamp-modal';
        modal.id = pRegionId + '_timestamp_preview_modal';

        var content = document.createElement('div');
        content.className = 'apex-sig-timestamp-modal-content';

        var header = document.createElement('div');
        header.className = 'apex-sig-timestamp-modal-header';

        var title = document.createElement('h3');
        title.textContent = 'Timestamp Preview';

        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'apex-sig-timestamp-modal-close';
        closeBtn.innerHTML = '&times;';

        header.appendChild(title);
        header.appendChild(closeBtn);

        var body = document.createElement('div');
        body.className = 'apex-sig-timestamp-modal-body';

        var previewImg = document.createElement('img');
        previewImg.src = imageData;
        previewImg.alt = 'Signature with timestamp preview';
        previewImg.className = 'apex-sig-timestamp-preview-img';

        body.appendChild(previewImg);

        var footer = document.createElement('div');
        footer.className = 'apex-sig-timestamp-modal-footer';

        var closeFooterBtn = document.createElement('button');
        closeFooterBtn.type = 'button';
        closeFooterBtn.className = 'apex-sig-timestamp-btn';
        closeFooterBtn.textContent = 'Close';

        footer.appendChild(closeFooterBtn);

        content.appendChild(header);
        content.appendChild(body);
        content.appendChild(footer);
        modal.appendChild(content);

        document.body.appendChild(modal);

        // Event listeners
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });

        closeFooterBtn.addEventListener('click', function() {
            modal.remove();
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.addEventListener('keydown', function handler(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handler);
            }
        });

        apexSignature.triggerEvent(pRegionId, 'apexsignature-timestamp-preview-shown', {
            position: this.instances[pRegionId].position
        });
    },

    /**
     * Enable timestamp
     */
    enable: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (instance) {
            instance.enabled = true;
            var checkbox = document.getElementById(pRegionId + '_timestamp_enabled');
            if (checkbox) checkbox.checked = true;
            this.updateControlsState(pRegionId);
        }
    },

    /**
     * Disable timestamp
     */
    disable: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (instance) {
            instance.enabled = false;
            var checkbox = document.getElementById(pRegionId + '_timestamp_enabled');
            if (checkbox) checkbox.checked = false;
            this.updateControlsState(pRegionId);
        }
    },

    /**
     * Check if timestamp is enabled
     */
    isEnabled: function(pRegionId) {
        var instance = this.instances[pRegionId];
        return instance ? instance.enabled : false;
    },

    /**
     * Set position
     */
    setPosition: function(pRegionId, position) {
        var instance = this.instances[pRegionId];
        if (instance && this.POSITIONS[position.toUpperCase().replace('-', '_')]) {
            instance.position = position;
            var select = document.getElementById(pRegionId + '_timestamp_position');
            if (select) select.value = position;
        }
    },

    /**
     * Set date format
     */
    setFormat: function(pRegionId, format) {
        var instance = this.instances[pRegionId];
        if (instance) {
            instance.format = format;
        }
    },

    /**
     * Set user name
     */
    setUserName: function(pRegionId, userName) {
        var instance = this.instances[pRegionId];
        if (instance) {
            instance.userName = userName;
        }
    },

    /**
     * Get signature with timestamp applied
     */
    getSignatureWithTimestamp: function(pRegionId, callback) {
        var signatureData = apexSignature.getCurrentSignature(pRegionId);
        if (!signatureData) {
            callback(null);
            return;
        }
        this.addTimestampToSignature(pRegionId, signatureData, callback);
    }
};
