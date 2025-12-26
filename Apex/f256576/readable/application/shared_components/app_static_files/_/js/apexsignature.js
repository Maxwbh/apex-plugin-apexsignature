/**
 * APEX Signature Plugin - JavaScript Functions
 *
 * @author Daniel Hochleitner (original)
 * @contributor Maxwell da Silva Oliveira - M&S do Brasil LTDA
 * @version 3.0.0
 * @license MIT
 *
 * Updated for Oracle APEX 24.2 and signature_pad v5.x compatibility
 * LinkedIn: /maxwbh
 *
 * Features:
 * - Multi-Input Capture: Draw, Upload, Webcam
 * - Bug Fixes: #20/#21 Dynamic Action events, #13 Page Items to Submit
 */

// global namespace
var apexSignature = {
    // Plugin version
    VERSION: '3.0.0',

    // Capture modes
    MODES: {
        DRAW: 'draw',
        UPLOAD: 'upload',
        WEBCAM: 'webcam'
    },

    // Store instances
    instances: {},

    /**
     * Parse string to boolean
     */
    parseBoolean: function(pString) {
        if (typeof pString === 'boolean') {
            return pString;
        }
        if (typeof pString !== 'string') {
            return undefined;
        }
        const lowerStr = pString.toLowerCase();
        if (lowerStr === 'true') {
            return true;
        }
        if (lowerStr === 'false') {
            return false;
        }
        return undefined;
    },

    /**
     * Builds a JS array from long string (for CLOB transmission)
     */
    clob2Array: function(clob, size, array) {
        const chunkSize = size || 30000;
        const loopCount = Math.floor(clob.length / chunkSize) + 1;
        for (let i = 0; i < loopCount; i++) {
            array.push(clob.slice(chunkSize * i, chunkSize * (i + 1)));
        }
        return array;
    },

    /**
     * Converts DataURI to base64 string
     */
    dataURI2base64: function(dataURI) {
        return dataURI.substring(dataURI.indexOf(',') + 1);
    },

    /**
     * Trigger APEX event properly for Dynamic Actions
     */
    triggerEvent: function(pRegionId, pEventName, pData) {
        var regionEl = document.getElementById(pRegionId);
        if (!regionEl) {
            regionEl = document.getElementById(pRegionId + '_signature');
        }

        var $region = apex.jQuery('#' + pRegionId);
        if ($region.length === 0) {
            $region = apex.jQuery('#' + pRegionId + '_signature');
        }

        var eventData = pData || {};
        eventData.regionId = pRegionId;

        // Method 1: apex.event.trigger
        if (regionEl && typeof apex.event !== 'undefined' && typeof apex.event.trigger === 'function') {
            try {
                apex.event.trigger(regionEl, pEventName, eventData);
            } catch (e) {
                console.warn('apexSignature: apex.event.trigger failed:', e);
            }
        }

        // Method 2: jQuery trigger
        if ($region.length > 0) {
            try {
                var jqEvent = apex.jQuery.Event(pEventName);
                jqEvent.data = eventData;
                $region.trigger(jqEvent, [eventData]);
            } catch (e) {
                console.warn('apexSignature: jQuery trigger failed:', e);
            }
        }

        // Method 3: CustomEvent
        if (regionEl) {
            try {
                var customEvent = new CustomEvent(pEventName, {
                    bubbles: true,
                    cancelable: true,
                    detail: eventData
                });
                regionEl.dispatchEvent(customEvent);
            } catch (e) {
                console.warn('apexSignature: CustomEvent dispatch failed:', e);
            }
        }
    },

    /**
     * Save signature to database via APEX AJAX
     */
    save2Db: function(pAjaxIdentifier, pRegionId, pImg, callback, options) {
        var opts = options || {};
        var base64 = apexSignature.dataURI2base64(pImg);
        var f01Array = apexSignature.clob2Array(base64, 30000, []);

        var ajaxOptions = {
            f01: f01Array
        };

        if (opts.pageItems) {
            ajaxOptions.pageItems = opts.pageItems;
        }

        apex.server.plugin(pAjaxIdentifier, ajaxOptions, {
            dataType: 'text',
            success: function(pData) {
                setTimeout(function() {
                    apexSignature.triggerEvent(pRegionId, 'apexsignature-saved-db', {
                        data: pData,
                        success: true,
                        base64Length: base64.length
                    });
                    if (typeof callback === 'function') {
                        callback(true, pData);
                    }
                }, 10);
            },
            error: function(xhr, pMessage, pError) {
                setTimeout(function() {
                    apexSignature.triggerEvent(pRegionId, 'apexsignature-error-db', {
                        message: pMessage,
                        error: pError,
                        success: false,
                        xhr: xhr
                    });
                    console.error('apexSignature.save2Db ERROR:', pMessage, pError);
                    if (typeof callback === 'function') {
                        callback(false, pMessage);
                    }
                }, 10);
            }
        });
    },

    /**
     * Build the Multi-Input UI with tabs
     */
    buildMultiInputUI: function(pRegionId, pOptions) {
        var container = document.getElementById(pRegionId + '_signature');
        if (!container) return null;

        var enabledModes = pOptions.captureModes || ['draw'];
        var labels = pOptions.labels || {
            draw: 'Draw',
            upload: 'Upload',
            webcam: 'Webcam'
        };

        // Create wrapper
        var wrapper = document.createElement('div');
        wrapper.className = 'apex-sig-wrapper';
        wrapper.id = pRegionId + '_wrapper';

        // Create tabs container (only if multiple modes)
        if (enabledModes.length > 1) {
            var tabsContainer = document.createElement('div');
            tabsContainer.className = 'apex-sig-tabs';
            tabsContainer.id = pRegionId + '_tabs';

            enabledModes.forEach(function(mode, index) {
                var tab = document.createElement('button');
                tab.type = 'button';
                tab.className = 'apex-sig-tab' + (index === 0 ? ' active' : '');
                tab.setAttribute('data-mode', mode);
                tab.id = pRegionId + '_tab_' + mode;

                // Icons
                var icon = '';
                if (mode === 'draw') icon = '<span class="apex-sig-icon">&#9998;</span> ';
                if (mode === 'upload') icon = '<span class="apex-sig-icon">&#128194;</span> ';
                if (mode === 'webcam') icon = '<span class="apex-sig-icon">&#128247;</span> ';

                tab.innerHTML = icon + labels[mode];
                tabsContainer.appendChild(tab);
            });

            wrapper.appendChild(tabsContainer);
        }

        // Create panels container
        var panelsContainer = document.createElement('div');
        panelsContainer.className = 'apex-sig-panels';
        panelsContainer.id = pRegionId + '_panels';

        // Draw panel
        if (enabledModes.includes('draw')) {
            var drawPanel = document.createElement('div');
            drawPanel.className = 'apex-sig-panel active';
            drawPanel.id = pRegionId + '_panel_draw';
            drawPanel.setAttribute('data-mode', 'draw');

            var canvas = document.createElement('canvas');
            canvas.id = pOptions.canvasId;
            canvas.width = pOptions.width || 600;
            canvas.height = pOptions.height || 400;
            canvas.className = 'apex-sig-canvas';
            canvas.setAttribute('role', 'img');
            canvas.setAttribute('aria-label', pOptions.ariaLabel || 'Signature Area');
            canvas.setAttribute('tabindex', '0');

            drawPanel.appendChild(canvas);
            panelsContainer.appendChild(drawPanel);
        }

        // Upload panel
        if (enabledModes.includes('upload')) {
            var uploadPanel = document.createElement('div');
            uploadPanel.className = 'apex-sig-panel';
            uploadPanel.id = pRegionId + '_panel_upload';
            uploadPanel.setAttribute('data-mode', 'upload');

            var uploadZone = document.createElement('div');
            uploadZone.className = 'apex-sig-upload-zone';
            uploadZone.id = pRegionId + '_upload_zone';

            var uploadIcon = document.createElement('div');
            uploadIcon.className = 'apex-sig-upload-icon';
            uploadIcon.innerHTML = '&#128194;';

            var uploadText = document.createElement('p');
            uploadText.className = 'apex-sig-upload-text';
            uploadText.textContent = pOptions.uploadText || 'Drag & drop an image or click to select';

            var uploadInput = document.createElement('input');
            uploadInput.type = 'file';
            uploadInput.id = pRegionId + '_upload_input';
            uploadInput.className = 'apex-sig-upload-input';
            uploadInput.accept = 'image/png,image/jpeg,image/gif,image/svg+xml';

            var uploadPreview = document.createElement('div');
            uploadPreview.className = 'apex-sig-upload-preview';
            uploadPreview.id = pRegionId + '_upload_preview';
            uploadPreview.style.display = 'none';

            var previewImg = document.createElement('img');
            previewImg.id = pRegionId + '_upload_img';
            previewImg.className = 'apex-sig-preview-img';

            var removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'apex-sig-remove-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.title = 'Remove image';

            uploadPreview.appendChild(previewImg);
            uploadPreview.appendChild(removeBtn);

            uploadZone.appendChild(uploadIcon);
            uploadZone.appendChild(uploadText);
            uploadZone.appendChild(uploadInput);

            uploadPanel.appendChild(uploadZone);
            uploadPanel.appendChild(uploadPreview);
            panelsContainer.appendChild(uploadPanel);
        }

        // Webcam panel
        if (enabledModes.includes('webcam')) {
            var webcamPanel = document.createElement('div');
            webcamPanel.className = 'apex-sig-panel';
            webcamPanel.id = pRegionId + '_panel_webcam';
            webcamPanel.setAttribute('data-mode', 'webcam');

            var videoContainer = document.createElement('div');
            videoContainer.className = 'apex-sig-video-container';

            var video = document.createElement('video');
            video.id = pRegionId + '_video';
            video.className = 'apex-sig-video';
            video.setAttribute('autoplay', '');
            video.setAttribute('playsinline', '');

            var captureCanvas = document.createElement('canvas');
            captureCanvas.id = pRegionId + '_capture_canvas';
            captureCanvas.className = 'apex-sig-capture-canvas';
            captureCanvas.style.display = 'none';

            var webcamPreview = document.createElement('div');
            webcamPreview.className = 'apex-sig-webcam-preview';
            webcamPreview.id = pRegionId + '_webcam_preview';
            webcamPreview.style.display = 'none';

            var webcamImg = document.createElement('img');
            webcamImg.id = pRegionId + '_webcam_img';
            webcamImg.className = 'apex-sig-preview-img';

            var webcamRemoveBtn = document.createElement('button');
            webcamRemoveBtn.type = 'button';
            webcamRemoveBtn.className = 'apex-sig-remove-btn';
            webcamRemoveBtn.innerHTML = '&times;';
            webcamRemoveBtn.title = 'Remove capture';

            webcamPreview.appendChild(webcamImg);
            webcamPreview.appendChild(webcamRemoveBtn);

            var captureBtn = document.createElement('button');
            captureBtn.type = 'button';
            captureBtn.id = pRegionId + '_capture_btn';
            captureBtn.className = 'apex-sig-capture-btn';
            captureBtn.innerHTML = '<span class="apex-sig-icon">&#128247;</span> ' + (pOptions.captureText || 'Capture');

            videoContainer.appendChild(video);
            videoContainer.appendChild(captureCanvas);
            videoContainer.appendChild(captureBtn);

            webcamPanel.appendChild(videoContainer);
            webcamPanel.appendChild(webcamPreview);
            panelsContainer.appendChild(webcamPanel);
        }

        wrapper.appendChild(panelsContainer);

        // Replace container content
        container.innerHTML = '';
        container.appendChild(wrapper);

        return wrapper;
    },

    /**
     * Initialize Upload functionality
     */
    initUpload: function(pRegionId, pOptions, pLogging) {
        var self = this;
        var instance = this.instances[pRegionId];

        var uploadZone = document.getElementById(pRegionId + '_upload_zone');
        var uploadInput = document.getElementById(pRegionId + '_upload_input');
        var uploadPreview = document.getElementById(pRegionId + '_upload_preview');
        var previewImg = document.getElementById(pRegionId + '_upload_img');
        var removeBtn = uploadPreview ? uploadPreview.querySelector('.apex-sig-remove-btn') : null;

        if (!uploadZone || !uploadInput) return;

        // Click to upload
        uploadZone.addEventListener('click', function(e) {
            if (e.target !== uploadInput) {
                uploadInput.click();
            }
        });

        // Drag and drop
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.remove('dragover');

            var files = e.dataTransfer.files;
            if (files.length > 0) {
                self.handleUploadFile(pRegionId, files[0], pLogging);
            }
        });

        // File input change
        uploadInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                self.handleUploadFile(pRegionId, e.target.files[0], pLogging);
            }
        });

        // Remove button
        if (removeBtn) {
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                self.clearUpload(pRegionId);
            });
        }
    },

    /**
     * Handle uploaded file
     */
    handleUploadFile: function(pRegionId, file, pLogging) {
        var self = this;
        var instance = this.instances[pRegionId];

        if (!file.type.match(/image.*/)) {
            apex.message.alert('Please select an image file (PNG, JPG, GIF, SVG)');
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            var dataUrl = e.target.result;
            instance.uploadedImage = dataUrl;

            var uploadZone = document.getElementById(pRegionId + '_upload_zone');
            var uploadPreview = document.getElementById(pRegionId + '_upload_preview');
            var previewImg = document.getElementById(pRegionId + '_upload_img');

            if (uploadZone) uploadZone.style.display = 'none';
            if (previewImg) previewImg.src = dataUrl;
            if (uploadPreview) uploadPreview.style.display = 'flex';

            if (pLogging) {
                console.log('apexSignature: Image uploaded, size:', file.size, 'bytes');
            }

            apexSignature.triggerEvent(pRegionId, 'apexsignature-image-uploaded', {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
            });
        };
        reader.readAsDataURL(file);
    },

    /**
     * Clear uploaded image
     */
    clearUpload: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (instance) {
            instance.uploadedImage = null;
        }

        var uploadZone = document.getElementById(pRegionId + '_upload_zone');
        var uploadPreview = document.getElementById(pRegionId + '_upload_preview');
        var uploadInput = document.getElementById(pRegionId + '_upload_input');

        if (uploadZone) uploadZone.style.display = 'flex';
        if (uploadPreview) uploadPreview.style.display = 'none';
        if (uploadInput) uploadInput.value = '';

        apexSignature.triggerEvent(pRegionId, 'apexsignature-upload-cleared', {});
    },

    /**
     * Initialize Webcam functionality
     */
    initWebcam: function(pRegionId, pOptions, pLogging) {
        var self = this;
        var instance = this.instances[pRegionId];

        var video = document.getElementById(pRegionId + '_video');
        var captureCanvas = document.getElementById(pRegionId + '_capture_canvas');
        var captureBtn = document.getElementById(pRegionId + '_capture_btn');
        var webcamPreview = document.getElementById(pRegionId + '_webcam_preview');
        var webcamImg = document.getElementById(pRegionId + '_webcam_img');
        var removeBtn = webcamPreview ? webcamPreview.querySelector('.apex-sig-remove-btn') : null;

        if (!video || !captureBtn) return;

        // Set canvas size
        if (captureCanvas) {
            captureCanvas.width = pOptions.width || 600;
            captureCanvas.height = pOptions.height || 400;
        }

        // Capture button
        captureBtn.addEventListener('click', function() {
            self.captureWebcam(pRegionId, pLogging);
        });

        // Remove button
        if (removeBtn) {
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                self.clearWebcam(pRegionId);
            });
        }
    },

    /**
     * Start webcam stream
     */
    startWebcam: function(pRegionId, pLogging) {
        var self = this;
        var instance = this.instances[pRegionId];
        var video = document.getElementById(pRegionId + '_video');

        if (!video) return;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            })
            .then(function(stream) {
                instance.webcamStream = stream;
                video.srcObject = stream;
                video.play();

                if (pLogging) {
                    console.log('apexSignature: Webcam started');
                }

                apexSignature.triggerEvent(pRegionId, 'apexsignature-webcam-started', {});
            })
            .catch(function(err) {
                console.error('apexSignature: Webcam error:', err);
                apex.message.alert('Unable to access webcam. Please check permissions.');

                apexSignature.triggerEvent(pRegionId, 'apexsignature-webcam-error', {
                    error: err.message
                });
            });
        } else {
            apex.message.alert('Webcam is not supported in this browser.');
        }
    },

    /**
     * Stop webcam stream
     */
    stopWebcam: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (instance && instance.webcamStream) {
            instance.webcamStream.getTracks().forEach(function(track) {
                track.stop();
            });
            instance.webcamStream = null;
        }
    },

    /**
     * Capture image from webcam
     */
    captureWebcam: function(pRegionId, pLogging) {
        var self = this;
        var instance = this.instances[pRegionId];

        var video = document.getElementById(pRegionId + '_video');
        var captureCanvas = document.getElementById(pRegionId + '_capture_canvas');
        var videoContainer = video ? video.parentElement : null;
        var webcamPreview = document.getElementById(pRegionId + '_webcam_preview');
        var webcamImg = document.getElementById(pRegionId + '_webcam_img');

        if (!video || !captureCanvas) return;

        var ctx = captureCanvas.getContext('2d');

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);

        // Get data URL
        var dataUrl = captureCanvas.toDataURL('image/png');
        instance.capturedImage = dataUrl;

        // Show preview
        if (videoContainer) videoContainer.style.display = 'none';
        if (webcamImg) webcamImg.src = dataUrl;
        if (webcamPreview) webcamPreview.style.display = 'flex';

        // Stop webcam
        this.stopWebcam(pRegionId);

        if (pLogging) {
            console.log('apexSignature: Webcam image captured');
        }

        apexSignature.triggerEvent(pRegionId, 'apexsignature-webcam-captured', {});
    },

    /**
     * Clear webcam capture
     */
    clearWebcam: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (instance) {
            instance.capturedImage = null;
        }

        var video = document.getElementById(pRegionId + '_video');
        var videoContainer = video ? video.parentElement : null;
        var webcamPreview = document.getElementById(pRegionId + '_webcam_preview');

        if (videoContainer) videoContainer.style.display = 'block';
        if (webcamPreview) webcamPreview.style.display = 'none';

        // Restart webcam
        this.startWebcam(pRegionId, false);

        apexSignature.triggerEvent(pRegionId, 'apexsignature-webcam-cleared', {});
    },

    /**
     * Switch between capture modes
     */
    switchMode: function(pRegionId, mode, pLogging) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        var tabs = document.querySelectorAll('#' + pRegionId + '_tabs .apex-sig-tab');
        var panels = document.querySelectorAll('#' + pRegionId + '_panels .apex-sig-panel');

        // Update tabs
        tabs.forEach(function(tab) {
            if (tab.getAttribute('data-mode') === mode) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update panels
        panels.forEach(function(panel) {
            if (panel.getAttribute('data-mode') === mode) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Handle webcam
        if (mode === 'webcam') {
            this.startWebcam(pRegionId, pLogging);
        } else {
            this.stopWebcam(pRegionId);
        }

        instance.currentMode = mode;

        if (pLogging) {
            console.log('apexSignature: Switched to mode:', mode);
        }

        apexSignature.triggerEvent(pRegionId, 'apexsignature-mode-changed', {
            mode: mode
        });
    },

    /**
     * Get current signature data based on active mode
     */
    getCurrentSignature: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return null;

        var mode = instance.currentMode || 'draw';

        if (mode === 'draw') {
            if (instance.signaturePad && !instance.signaturePad.isEmpty()) {
                return instance.signaturePad.toDataURL('image/png');
            }
        } else if (mode === 'upload') {
            return instance.uploadedImage || null;
        } else if (mode === 'webcam') {
            return instance.capturedImage || null;
        }

        return null;
    },

    /**
     * Check if signature is empty
     */
    isSignatureEmpty: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return true;

        var mode = instance.currentMode || 'draw';

        if (mode === 'draw') {
            return instance.signaturePad ? instance.signaturePad.isEmpty() : true;
        } else if (mode === 'upload') {
            return !instance.uploadedImage;
        } else if (mode === 'webcam') {
            return !instance.capturedImage;
        }

        return true;
    },

    /**
     * Clear current signature
     */
    clearSignature: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return;

        var mode = instance.currentMode || 'draw';

        if (mode === 'draw' && instance.signaturePad) {
            instance.signaturePad.clear();
        } else if (mode === 'upload') {
            this.clearUpload(pRegionId);
        } else if (mode === 'webcam') {
            this.clearWebcam(pRegionId);
        }

        apexSignature.triggerEvent(pRegionId, 'apexsignature-cleared', { mode: mode });
    },

    /**
     * Main initialization function
     */
    apexSignatureFnc: function(pRegionId, pOptions, pLogging) {
        var self = this;
        var vOptions = pOptions;
        var vLogging = apexSignature.parseBoolean(pLogging);

        // Parse capture modes
        var captureModes = ['draw']; // default
        if (vOptions.captureMode) {
            if (vOptions.captureMode === 'all') {
                captureModes = ['draw', 'upload', 'webcam'];
            } else if (vOptions.captureMode === 'draw_upload') {
                captureModes = ['draw', 'upload'];
            } else if (vOptions.captureMode === 'draw_webcam') {
                captureModes = ['draw', 'webcam'];
            } else {
                captureModes = [vOptions.captureMode];
            }
        }

        vOptions.captureModes = captureModes;
        vOptions.width = parseInt(vOptions.width) || 600;
        vOptions.height = parseInt(vOptions.height) || 400;

        // Create instance
        this.instances[pRegionId] = {
            options: vOptions,
            currentMode: captureModes[0],
            signaturePad: null,
            uploadedImage: null,
            capturedImage: null,
            webcamStream: null
        };

        var instance = this.instances[pRegionId];

        // Build UI
        this.buildMultiInputUI(pRegionId, vOptions);

        // Initialize Draw mode
        if (captureModes.includes('draw')) {
            var vCanvas = document.getElementById(vOptions.canvasId);
            if (vCanvas) {
                var vMinWidth = parseFloat(vOptions.lineMinWidth) || 0.5;
                var vMaxWidth = parseFloat(vOptions.lineMaxWidth) || 2.5;

                // Resize canvas if needed
                var vClientWidth = document.documentElement.clientWidth;
                if (vOptions.width > vClientWidth) {
                    vCanvas.width = vClientWidth - 60;
                }

                // Create SignaturePad
                var signaturePad = new SignaturePad(vCanvas, {
                    minWidth: vMinWidth,
                    maxWidth: vMaxWidth,
                    backgroundColor: vOptions.backgroundColor || 'rgba(0,0,0,0)',
                    penColor: vOptions.penColor || 'black',
                    throttle: 16,
                    minDistance: 5,
                    velocityFilterWeight: 0.7
                });

                instance.signaturePad = signaturePad;

                // SignaturePad events
                signaturePad.addEventListener('beginStroke', function(event) {
                    if (vLogging) console.log('apexSignatureFnc: Stroke started');
                    apexSignature.triggerEvent(pRegionId, 'apexsignature-stroke-begin', { event: event });
                });

                signaturePad.addEventListener('endStroke', function(event) {
                    if (vLogging) console.log('apexSignatureFnc: Stroke ended');
                    apexSignature.triggerEvent(pRegionId, 'apexsignature-stroke-end', { event: event });
                });
            }
        }

        // Initialize Upload mode
        if (captureModes.includes('upload')) {
            this.initUpload(pRegionId, vOptions, vLogging);
        }

        // Initialize Webcam mode
        if (captureModes.includes('webcam')) {
            this.initWebcam(pRegionId, vOptions, vLogging);
        }

        // Tab switching
        if (captureModes.length > 1) {
            var tabs = document.querySelectorAll('#' + pRegionId + '_tabs .apex-sig-tab');
            tabs.forEach(function(tab) {
                tab.addEventListener('click', function() {
                    var mode = this.getAttribute('data-mode');
                    self.switchMode(pRegionId, mode, vLogging);
                });
            });
        }

        // Register APEX region
        if (window.apex && window.apex.region) {
            apex.region.create(pRegionId, {
                type: 'apexSignature',
                widget: function() {
                    return instance.signaturePad;
                },
                clear: function() {
                    self.clearSignature(pRegionId);
                },
                isEmpty: function() {
                    return self.isSignatureEmpty(pRegionId);
                },
                toDataURL: function(type) {
                    return self.getCurrentSignature(pRegionId);
                },
                getMode: function() {
                    return instance.currentMode;
                },
                setMode: function(mode) {
                    self.switchMode(pRegionId, mode, vLogging);
                },
                save: function() {
                    var imgData = self.getCurrentSignature(pRegionId);
                    if (imgData) {
                        apexSignature.save2Db(vOptions.ajaxIdentifier, pRegionId, imgData, null, {
                            pageItems: vOptions.pageItems
                        });
                    }
                }
            });
        }

        // Clear button
        if (vOptions.clearButton) {
            apex.jQuery(document).on('click', vOptions.clearButton, function(e) {
                e.preventDefault();
                self.clearSignature(pRegionId);
                if (vLogging) console.log('apexSignatureFnc: Signature cleared');
            });
        }

        // Save button
        if (vOptions.saveButton) {
            apex.jQuery(document).on('click', vOptions.saveButton, function(e) {
                e.preventDefault();

                if (!self.isSignatureEmpty(pRegionId)) {
                    var lSpinner = null;
                    if (apexSignature.parseBoolean(vOptions.showSpinner)) {
                        lSpinner = apex.util.showSpinner(apex.jQuery('#' + pRegionId));
                    }

                    var vImg = self.getCurrentSignature(pRegionId);

                    if (vLogging) console.log('apexSignatureFnc: Saving signature...');

                    apexSignature.save2Db(
                        vOptions.ajaxIdentifier,
                        pRegionId,
                        vImg,
                        function(success, data) {
                            self.clearSignature(pRegionId);
                            if (lSpinner) lSpinner.remove();
                            if (vLogging) console.log('apexSignatureFnc: Save ' + (success ? 'successful' : 'failed'));
                        },
                        { pageItems: vOptions.pageItems }
                    );
                } else {
                    if (vOptions.emptyAlert) {
                        apex.message.alert(vOptions.emptyAlert);
                    }
                }
            });
        }

        // Trigger init event
        setTimeout(function() {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-initialized', {
                version: apexSignature.VERSION,
                modes: captureModes,
                currentMode: instance.currentMode
            });
        }, 0);

        if (vLogging) {
            console.log('apexSignature v' + apexSignature.VERSION + ' initialized');
            console.log('apexSignatureFnc: Capture modes:', captureModes);
        }
    }
};
