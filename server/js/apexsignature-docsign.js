/**
 * APEX Signature Plugin - Document Signing Module
 *
 * @author Maxwell da Silva Oliveira - M&S do Brasil LTDA
 * @version 3.1.0
 * @license MIT
 *
 * Features:
 * - PDF/Image document upload
 * - Signature placement via drag-and-drop
 * - Resize and reposition signatures
 * - Multiple signatures per document
 * - Multi-page PDF support
 * - Export signed document as PDF/Image
 *
 * LinkedIn: /maxwbh
 */

var apexSignatureDocSign = {
    VERSION: '3.1.0',

    // Store document instances
    instances: {},

    /**
     * Initialize Document Signing for a region
     */
    init: function(pRegionId, pOptions) {
        var self = this;
        var opts = pOptions || {};

        // Create instance
        this.instances[pRegionId] = {
            options: opts,
            document: null,
            documentType: null, // 'pdf' or 'image'
            pdfDoc: null,
            currentPage: 1,
            totalPages: 1,
            scale: 1.0,
            signatures: [],
            selectedSignature: null,
            isDragging: false,
            isResizing: false
        };

        var instance = this.instances[pRegionId];

        // Build UI
        this.buildUI(pRegionId, opts);

        // Initialize event handlers
        this.initEventHandlers(pRegionId);

        // Trigger init event
        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-docsign-initialized', {
                version: this.VERSION
            });
        }

        return instance;
    },

    /**
     * Build the Document Signing UI
     */
    buildUI: function(pRegionId, pOptions) {
        var container = document.getElementById(pRegionId + '_signature');
        if (!container) {
            container = document.getElementById(pRegionId);
        }
        if (!container) return;

        var html = `
            <div class="apex-docsign-wrapper" id="${pRegionId}_docsign_wrapper">
                <!-- Toolbar -->
                <div class="apex-docsign-toolbar" id="${pRegionId}_docsign_toolbar">
                    <div class="apex-docsign-toolbar-left">
                        <button type="button" class="apex-docsign-btn" id="${pRegionId}_upload_doc_btn" title="Upload Document">
                            <span class="apex-docsign-icon">&#128196;</span>
                            <span class="apex-docsign-btn-text">${pOptions.uploadDocText || 'Upload Document'}</span>
                        </button>
                        <input type="file" id="${pRegionId}_doc_input" class="apex-docsign-file-input"
                               accept=".pdf,image/png,image/jpeg,image/jpg,image/gif">
                    </div>
                    <div class="apex-docsign-toolbar-center">
                        <button type="button" class="apex-docsign-btn apex-docsign-page-btn" id="${pRegionId}_prev_page" title="Previous Page" disabled>
                            <span class="apex-docsign-icon">&#9664;</span>
                        </button>
                        <span class="apex-docsign-page-info" id="${pRegionId}_page_info">Page 0 of 0</span>
                        <button type="button" class="apex-docsign-btn apex-docsign-page-btn" id="${pRegionId}_next_page" title="Next Page" disabled>
                            <span class="apex-docsign-icon">&#9654;</span>
                        </button>
                    </div>
                    <div class="apex-docsign-toolbar-right">
                        <button type="button" class="apex-docsign-btn" id="${pRegionId}_add_sig_btn" title="Add Signature" disabled>
                            <span class="apex-docsign-icon">&#9998;</span>
                            <span class="apex-docsign-btn-text">${pOptions.addSignatureText || 'Add Signature'}</span>
                        </button>
                        <button type="button" class="apex-docsign-btn apex-docsign-btn-primary" id="${pRegionId}_export_btn" title="Export" disabled>
                            <span class="apex-docsign-icon">&#128190;</span>
                            <span class="apex-docsign-btn-text">${pOptions.exportText || 'Export'}</span>
                        </button>
                    </div>
                </div>

                <!-- Document Container -->
                <div class="apex-docsign-container" id="${pRegionId}_docsign_container">
                    <!-- Empty State -->
                    <div class="apex-docsign-empty" id="${pRegionId}_empty_state">
                        <div class="apex-docsign-empty-icon">&#128196;</div>
                        <p class="apex-docsign-empty-text">${pOptions.emptyText || 'Upload a PDF or image document to start signing'}</p>
                        <button type="button" class="apex-docsign-btn apex-docsign-btn-primary apex-docsign-upload-btn" id="${pRegionId}_empty_upload_btn">
                            <span class="apex-docsign-icon">&#128194;</span>
                            ${pOptions.uploadText || 'Choose File'}
                        </button>
                    </div>

                    <!-- Document Viewer -->
                    <div class="apex-docsign-viewer" id="${pRegionId}_viewer" style="display: none;">
                        <div class="apex-docsign-page-wrapper" id="${pRegionId}_page_wrapper">
                            <canvas id="${pRegionId}_doc_canvas" class="apex-docsign-canvas"></canvas>
                            <div class="apex-docsign-signatures-layer" id="${pRegionId}_signatures_layer"></div>
                        </div>
                    </div>
                </div>

                <!-- Signature Modal -->
                <div class="apex-docsign-modal" id="${pRegionId}_sig_modal" style="display: none;">
                    <div class="apex-docsign-modal-content">
                        <div class="apex-docsign-modal-header">
                            <h3>${pOptions.signatureModalTitle || 'Add Signature'}</h3>
                            <button type="button" class="apex-docsign-modal-close" id="${pRegionId}_modal_close">&times;</button>
                        </div>
                        <div class="apex-docsign-modal-body">
                            <div class="apex-docsign-sig-tabs" id="${pRegionId}_sig_tabs">
                                <button type="button" class="apex-docsign-sig-tab active" data-tab="draw">
                                    <span class="apex-docsign-icon">&#9998;</span> Draw
                                </button>
                                <button type="button" class="apex-docsign-sig-tab" data-tab="type">
                                    <span class="apex-docsign-icon">&#65;&#65;&#65;</span> Type
                                </button>
                                <button type="button" class="apex-docsign-sig-tab" data-tab="upload">
                                    <span class="apex-docsign-icon">&#128194;</span> Upload
                                </button>
                            </div>
                            <div class="apex-docsign-sig-panels">
                                <!-- Draw Panel -->
                                <div class="apex-docsign-sig-panel active" data-panel="draw">
                                    <canvas id="${pRegionId}_sig_canvas" width="400" height="200"></canvas>
                                    <div class="apex-docsign-sig-actions">
                                        <button type="button" class="apex-docsign-btn" id="${pRegionId}_clear_sig">Clear</button>
                                    </div>
                                </div>
                                <!-- Type Panel -->
                                <div class="apex-docsign-sig-panel" data-panel="type">
                                    <input type="text" id="${pRegionId}_type_input" class="apex-docsign-type-input"
                                           placeholder="${pOptions.typePlaceholder || 'Type your name...'}" maxlength="50">
                                    <div class="apex-docsign-font-select">
                                        <label>Font Style:</label>
                                        <select id="${pRegionId}_font_select" class="apex-docsign-select">
                                            <option value="'Dancing Script', cursive">Dancing Script</option>
                                            <option value="'Great Vibes', cursive">Great Vibes</option>
                                            <option value="'Pacifico', cursive">Pacifico</option>
                                            <option value="'Sacramento', cursive">Sacramento</option>
                                            <option value="'Allura', cursive">Allura</option>
                                        </select>
                                    </div>
                                    <div class="apex-docsign-type-preview" id="${pRegionId}_type_preview"></div>
                                </div>
                                <!-- Upload Panel -->
                                <div class="apex-docsign-sig-panel" data-panel="upload">
                                    <div class="apex-docsign-upload-zone" id="${pRegionId}_sig_upload_zone">
                                        <span class="apex-docsign-icon">&#128194;</span>
                                        <p>Drag & drop signature image or click to select</p>
                                        <input type="file" id="${pRegionId}_sig_upload_input" accept="image/*">
                                    </div>
                                    <div class="apex-docsign-upload-preview" id="${pRegionId}_sig_upload_preview" style="display: none;">
                                        <img id="${pRegionId}_sig_upload_img" />
                                        <button type="button" class="apex-docsign-remove-btn" id="${pRegionId}_sig_remove">&times;</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="apex-docsign-modal-footer">
                            <button type="button" class="apex-docsign-btn" id="${pRegionId}_modal_cancel">Cancel</button>
                            <button type="button" class="apex-docsign-btn apex-docsign-btn-primary" id="${pRegionId}_modal_apply">Apply Signature</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Load Google Fonts for signature
        this.loadSignatureFonts();
    },

    /**
     * Load Google Fonts for typed signatures
     */
    loadSignatureFonts: function() {
        if (document.getElementById('apex-docsign-fonts')) return;

        var link = document.createElement('link');
        link.id = 'apex-docsign-fonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Allura&family=Dancing+Script&family=Great+Vibes&family=Pacifico&family=Sacramento&display=swap';
        document.head.appendChild(link);
    },

    /**
     * Initialize all event handlers
     */
    initEventHandlers: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];

        // Document upload buttons
        var uploadBtn = document.getElementById(pRegionId + '_upload_doc_btn');
        var emptyUploadBtn = document.getElementById(pRegionId + '_empty_upload_btn');
        var docInput = document.getElementById(pRegionId + '_doc_input');

        if (uploadBtn) {
            uploadBtn.addEventListener('click', function() {
                docInput.click();
            });
        }

        if (emptyUploadBtn) {
            emptyUploadBtn.addEventListener('click', function() {
                docInput.click();
            });
        }

        if (docInput) {
            docInput.addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    self.loadDocument(pRegionId, e.target.files[0]);
                }
            });
        }

        // Page navigation
        var prevBtn = document.getElementById(pRegionId + '_prev_page');
        var nextBtn = document.getElementById(pRegionId + '_next_page');

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                self.goToPage(pRegionId, instance.currentPage - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                self.goToPage(pRegionId, instance.currentPage + 1);
            });
        }

        // Add signature button
        var addSigBtn = document.getElementById(pRegionId + '_add_sig_btn');
        if (addSigBtn) {
            addSigBtn.addEventListener('click', function() {
                self.showSignatureModal(pRegionId);
            });
        }

        // Export button
        var exportBtn = document.getElementById(pRegionId + '_export_btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                self.exportDocument(pRegionId);
            });
        }

        // Modal handlers
        this.initModalHandlers(pRegionId);

        // Signature layer handlers
        this.initSignatureLayerHandlers(pRegionId);
    },

    /**
     * Initialize modal event handlers
     */
    initModalHandlers: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];

        var modal = document.getElementById(pRegionId + '_sig_modal');
        var closeBtn = document.getElementById(pRegionId + '_modal_close');
        var cancelBtn = document.getElementById(pRegionId + '_modal_cancel');
        var applyBtn = document.getElementById(pRegionId + '_modal_apply');

        // Close modal
        var closeModal = function() {
            modal.style.display = 'none';
            if (instance.modalSignaturePad) {
                instance.modalSignaturePad.clear();
            }
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        // Tab switching
        var tabs = document.querySelectorAll('#' + pRegionId + '_sig_tabs .apex-docsign-sig-tab');
        var panels = document.querySelectorAll('#' + pRegionId + '_sig_modal .apex-docsign-sig-panel');

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var tabName = this.getAttribute('data-tab');

                tabs.forEach(function(t) { t.classList.remove('active'); });
                panels.forEach(function(p) { p.classList.remove('active'); });

                this.classList.add('active');
                document.querySelector('#' + pRegionId + '_sig_modal .apex-docsign-sig-panel[data-panel="' + tabName + '"]').classList.add('active');
            });
        });

        // Initialize signature pad in modal
        var sigCanvas = document.getElementById(pRegionId + '_sig_canvas');
        if (sigCanvas && typeof SignaturePad !== 'undefined') {
            instance.modalSignaturePad = new SignaturePad(sigCanvas, {
                minWidth: 0.5,
                maxWidth: 2.5,
                penColor: 'black',
                backgroundColor: 'rgba(255,255,255,0)'
            });
        }

        // Clear signature button
        var clearSigBtn = document.getElementById(pRegionId + '_clear_sig');
        if (clearSigBtn) {
            clearSigBtn.addEventListener('click', function() {
                if (instance.modalSignaturePad) {
                    instance.modalSignaturePad.clear();
                }
            });
        }

        // Type input preview
        var typeInput = document.getElementById(pRegionId + '_type_input');
        var fontSelect = document.getElementById(pRegionId + '_font_select');
        var typePreview = document.getElementById(pRegionId + '_type_preview');

        var updateTypePreview = function() {
            if (typePreview && typeInput && fontSelect) {
                typePreview.textContent = typeInput.value || 'Preview';
                typePreview.style.fontFamily = fontSelect.value;
            }
        };

        if (typeInput) typeInput.addEventListener('input', updateTypePreview);
        if (fontSelect) fontSelect.addEventListener('change', updateTypePreview);

        // Signature upload
        var sigUploadZone = document.getElementById(pRegionId + '_sig_upload_zone');
        var sigUploadInput = document.getElementById(pRegionId + '_sig_upload_input');
        var sigUploadPreview = document.getElementById(pRegionId + '_sig_upload_preview');
        var sigUploadImg = document.getElementById(pRegionId + '_sig_upload_img');
        var sigRemoveBtn = document.getElementById(pRegionId + '_sig_remove');

        if (sigUploadZone) {
            sigUploadZone.addEventListener('click', function() {
                sigUploadInput.click();
            });

            sigUploadZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dragover');
            });

            sigUploadZone.addEventListener('dragleave', function() {
                this.classList.remove('dragover');
            });

            sigUploadZone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
                if (e.dataTransfer.files.length > 0) {
                    self.handleSignatureUpload(pRegionId, e.dataTransfer.files[0]);
                }
            });
        }

        if (sigUploadInput) {
            sigUploadInput.addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    self.handleSignatureUpload(pRegionId, e.target.files[0]);
                }
            });
        }

        if (sigRemoveBtn) {
            sigRemoveBtn.addEventListener('click', function() {
                instance.uploadedSignature = null;
                sigUploadZone.style.display = 'flex';
                sigUploadPreview.style.display = 'none';
            });
        }

        // Apply signature
        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                self.applySignature(pRegionId);
            });
        }
    },

    /**
     * Initialize signature layer drag/resize handlers
     */
    initSignatureLayerHandlers: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];
        var sigLayer = document.getElementById(pRegionId + '_signatures_layer');

        if (!sigLayer) return;

        // Delegate events for signature elements
        sigLayer.addEventListener('mousedown', function(e) {
            var sigEl = e.target.closest('.apex-docsign-signature');
            if (!sigEl) return;

            var sigId = sigEl.getAttribute('data-sig-id');
            var sig = instance.signatures.find(function(s) { return s.id === sigId; });
            if (!sig) return;

            // Check if resize handle
            if (e.target.classList.contains('apex-docsign-resize-handle')) {
                instance.isResizing = true;
                instance.resizeStartX = e.clientX;
                instance.resizeStartY = e.clientY;
                instance.resizeStartWidth = sig.width;
                instance.resizeStartHeight = sig.height;
            } else {
                instance.isDragging = true;
                var rect = sigEl.getBoundingClientRect();
                instance.dragOffsetX = e.clientX - rect.left;
                instance.dragOffsetY = e.clientY - rect.top;
            }

            instance.selectedSignature = sig;
            self.selectSignature(pRegionId, sigId);

            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!instance.selectedSignature) return;

            var pageWrapper = document.getElementById(pRegionId + '_page_wrapper');
            if (!pageWrapper) return;

            var rect = pageWrapper.getBoundingClientRect();

            if (instance.isDragging) {
                var x = e.clientX - rect.left - instance.dragOffsetX;
                var y = e.clientY - rect.top - instance.dragOffsetY;

                // Constrain to bounds
                x = Math.max(0, Math.min(x, rect.width - instance.selectedSignature.width));
                y = Math.max(0, Math.min(y, rect.height - instance.selectedSignature.height));

                instance.selectedSignature.x = x;
                instance.selectedSignature.y = y;

                self.updateSignaturePosition(pRegionId, instance.selectedSignature.id);
            }

            if (instance.isResizing) {
                var deltaX = e.clientX - instance.resizeStartX;
                var deltaY = e.clientY - instance.resizeStartY;

                var newWidth = Math.max(50, instance.resizeStartWidth + deltaX);
                var newHeight = Math.max(30, instance.resizeStartHeight + deltaY);

                instance.selectedSignature.width = newWidth;
                instance.selectedSignature.height = newHeight;

                self.updateSignaturePosition(pRegionId, instance.selectedSignature.id);
            }
        });

        document.addEventListener('mouseup', function() {
            instance.isDragging = false;
            instance.isResizing = false;
        });

        // Delete key handler
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Delete' && instance.selectedSignature) {
                self.removeSignature(pRegionId, instance.selectedSignature.id);
            }
        });
    },

    /**
     * Load document (PDF or Image)
     */
    loadDocument: function(pRegionId, file) {
        var self = this;
        var instance = this.instances[pRegionId];

        var emptyState = document.getElementById(pRegionId + '_empty_state');
        var viewer = document.getElementById(pRegionId + '_viewer');
        var addSigBtn = document.getElementById(pRegionId + '_add_sig_btn');
        var exportBtn = document.getElementById(pRegionId + '_export_btn');

        if (file.type === 'application/pdf') {
            // Load PDF
            instance.documentType = 'pdf';
            this.loadPDF(pRegionId, file);
        } else if (file.type.startsWith('image/')) {
            // Load Image
            instance.documentType = 'image';
            this.loadImage(pRegionId, file);
        } else {
            apex.message.alert('Please upload a PDF or image file.');
            return;
        }

        // Show viewer, hide empty state
        if (emptyState) emptyState.style.display = 'none';
        if (viewer) viewer.style.display = 'block';
        if (addSigBtn) addSigBtn.disabled = false;
        if (exportBtn) exportBtn.disabled = false;

        // Clear existing signatures
        instance.signatures = [];
        var sigLayer = document.getElementById(pRegionId + '_signatures_layer');
        if (sigLayer) sigLayer.innerHTML = '';

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-document-loaded', {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size
            });
        }
    },

    /**
     * Load PDF using PDF.js
     */
    loadPDF: function(pRegionId, file) {
        var self = this;
        var instance = this.instances[pRegionId];

        var reader = new FileReader();
        reader.onload = function(e) {
            var typedArray = new Uint8Array(e.target.result);

            // Check if PDF.js is loaded
            if (typeof pdfjsLib === 'undefined') {
                apex.message.alert('PDF.js library is not loaded. Please include PDF.js for PDF support.');
                return;
            }

            pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
                instance.pdfDoc = pdf;
                instance.totalPages = pdf.numPages;
                instance.currentPage = 1;

                self.updatePageInfo(pRegionId);
                self.renderPage(pRegionId, 1);
            }).catch(function(error) {
                console.error('Error loading PDF:', error);
                apex.message.alert('Error loading PDF file.');
            });
        };
        reader.readAsArrayBuffer(file);
    },

    /**
     * Load Image document
     */
    loadImage: function(pRegionId, file) {
        var self = this;
        var instance = this.instances[pRegionId];

        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                instance.document = img;
                instance.totalPages = 1;
                instance.currentPage = 1;

                self.updatePageInfo(pRegionId);
                self.renderImage(pRegionId, img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    /**
     * Render PDF page
     */
    renderPage: function(pRegionId, pageNum) {
        var self = this;
        var instance = this.instances[pRegionId];

        if (!instance.pdfDoc) return;

        instance.pdfDoc.getPage(pageNum).then(function(page) {
            var canvas = document.getElementById(pRegionId + '_doc_canvas');
            var ctx = canvas.getContext('2d');

            var viewport = page.getViewport({ scale: instance.scale });
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            page.render(renderContext).promise.then(function() {
                instance.currentPage = pageNum;
                self.updatePageInfo(pRegionId);
                self.updateSignaturesForPage(pRegionId, pageNum);
            });
        });
    },

    /**
     * Render image document
     */
    renderImage: function(pRegionId, img) {
        var instance = this.instances[pRegionId];
        var canvas = document.getElementById(pRegionId + '_doc_canvas');
        var ctx = canvas.getContext('2d');

        // Scale to fit container
        var container = document.getElementById(pRegionId + '_docsign_container');
        var maxWidth = container.clientWidth - 40;
        var scale = Math.min(1, maxWidth / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        instance.scale = scale;
        this.updatePageInfo(pRegionId);
    },

    /**
     * Go to specific page
     */
    goToPage: function(pRegionId, pageNum) {
        var instance = this.instances[pRegionId];

        if (pageNum < 1 || pageNum > instance.totalPages) return;

        if (instance.documentType === 'pdf') {
            this.renderPage(pRegionId, pageNum);
        }
    },

    /**
     * Update page info display
     */
    updatePageInfo: function(pRegionId) {
        var instance = this.instances[pRegionId];
        var pageInfo = document.getElementById(pRegionId + '_page_info');
        var prevBtn = document.getElementById(pRegionId + '_prev_page');
        var nextBtn = document.getElementById(pRegionId + '_next_page');

        if (pageInfo) {
            pageInfo.textContent = 'Page ' + instance.currentPage + ' of ' + instance.totalPages;
        }

        if (prevBtn) prevBtn.disabled = instance.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = instance.currentPage >= instance.totalPages;
    },

    /**
     * Show signature modal
     */
    showSignatureModal: function(pRegionId) {
        var instance = this.instances[pRegionId];
        var modal = document.getElementById(pRegionId + '_sig_modal');

        if (modal) {
            modal.style.display = 'flex';

            // Reset modal state
            if (instance.modalSignaturePad) {
                instance.modalSignaturePad.clear();
            }

            var typeInput = document.getElementById(pRegionId + '_type_input');
            if (typeInput) typeInput.value = '';

            var typePreview = document.getElementById(pRegionId + '_type_preview');
            if (typePreview) typePreview.textContent = 'Preview';

            instance.uploadedSignature = null;
            var sigUploadZone = document.getElementById(pRegionId + '_sig_upload_zone');
            var sigUploadPreview = document.getElementById(pRegionId + '_sig_upload_preview');
            if (sigUploadZone) sigUploadZone.style.display = 'flex';
            if (sigUploadPreview) sigUploadPreview.style.display = 'none';

            // Reset to first tab
            var tabs = document.querySelectorAll('#' + pRegionId + '_sig_tabs .apex-docsign-sig-tab');
            var panels = document.querySelectorAll('#' + pRegionId + '_sig_modal .apex-docsign-sig-panel');
            tabs.forEach(function(t, i) { t.classList.toggle('active', i === 0); });
            panels.forEach(function(p, i) { p.classList.toggle('active', i === 0); });
        }
    },

    /**
     * Handle signature image upload
     */
    handleSignatureUpload: function(pRegionId, file) {
        var instance = this.instances[pRegionId];

        if (!file.type.startsWith('image/')) {
            apex.message.alert('Please select an image file.');
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            instance.uploadedSignature = e.target.result;

            var sigUploadZone = document.getElementById(pRegionId + '_sig_upload_zone');
            var sigUploadPreview = document.getElementById(pRegionId + '_sig_upload_preview');
            var sigUploadImg = document.getElementById(pRegionId + '_sig_upload_img');

            if (sigUploadZone) sigUploadZone.style.display = 'none';
            if (sigUploadImg) sigUploadImg.src = e.target.result;
            if (sigUploadPreview) sigUploadPreview.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    },

    /**
     * Apply signature from modal
     */
    applySignature: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];

        var activeTab = document.querySelector('#' + pRegionId + '_sig_tabs .apex-docsign-sig-tab.active');
        var tabType = activeTab ? activeTab.getAttribute('data-tab') : 'draw';

        var signatureData = null;

        if (tabType === 'draw') {
            if (instance.modalSignaturePad && !instance.modalSignaturePad.isEmpty()) {
                signatureData = instance.modalSignaturePad.toDataURL('image/png');
            }
        } else if (tabType === 'type') {
            signatureData = this.createTypedSignature(pRegionId);
        } else if (tabType === 'upload') {
            signatureData = instance.uploadedSignature;
        }

        if (!signatureData) {
            apex.message.alert('Please create a signature before applying.');
            return;
        }

        // Add signature to document
        this.addSignatureToDocument(pRegionId, signatureData);

        // Close modal
        var modal = document.getElementById(pRegionId + '_sig_modal');
        if (modal) modal.style.display = 'none';
    },

    /**
     * Create typed signature as image
     */
    createTypedSignature: function(pRegionId) {
        var typeInput = document.getElementById(pRegionId + '_type_input');
        var fontSelect = document.getElementById(pRegionId + '_font_select');

        if (!typeInput || !typeInput.value.trim()) return null;

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var text = typeInput.value.trim();
        var font = fontSelect ? fontSelect.value : "'Dancing Script', cursive";

        ctx.font = '48px ' + font;
        var metrics = ctx.measureText(text);

        canvas.width = metrics.width + 20;
        canvas.height = 80;

        ctx.font = '48px ' + font;
        ctx.fillStyle = 'black';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 10, 40);

        return canvas.toDataURL('image/png');
    },

    /**
     * Add signature to document
     */
    addSignatureToDocument: function(pRegionId, signatureData) {
        var instance = this.instances[pRegionId];
        var sigLayer = document.getElementById(pRegionId + '_signatures_layer');

        if (!sigLayer) return;

        var sigId = 'sig_' + Date.now();
        var signature = {
            id: sigId,
            data: signatureData,
            page: instance.currentPage,
            x: 50,
            y: 50,
            width: 150,
            height: 75
        };

        instance.signatures.push(signature);

        // Create signature element
        var sigEl = document.createElement('div');
        sigEl.className = 'apex-docsign-signature';
        sigEl.setAttribute('data-sig-id', sigId);
        sigEl.style.left = signature.x + 'px';
        sigEl.style.top = signature.y + 'px';
        sigEl.style.width = signature.width + 'px';
        sigEl.style.height = signature.height + 'px';

        var img = document.createElement('img');
        img.src = signatureData;
        sigEl.appendChild(img);

        var resizeHandle = document.createElement('div');
        resizeHandle.className = 'apex-docsign-resize-handle';
        sigEl.appendChild(resizeHandle);

        var deleteBtn = document.createElement('button');
        deleteBtn.className = 'apex-docsign-delete-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.title = 'Delete signature';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            apexSignatureDocSign.removeSignature(pRegionId, sigId);
        });
        sigEl.appendChild(deleteBtn);

        sigLayer.appendChild(sigEl);

        this.selectSignature(pRegionId, sigId);

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-signature-added', {
                signatureId: sigId,
                page: signature.page
            });
        }
    },

    /**
     * Select a signature
     */
    selectSignature: function(pRegionId, sigId) {
        var instance = this.instances[pRegionId];
        var sigLayer = document.getElementById(pRegionId + '_signatures_layer');

        if (!sigLayer) return;

        // Deselect all
        sigLayer.querySelectorAll('.apex-docsign-signature').forEach(function(el) {
            el.classList.remove('selected');
        });

        // Select this one
        var sigEl = sigLayer.querySelector('.apex-docsign-signature[data-sig-id="' + sigId + '"]');
        if (sigEl) {
            sigEl.classList.add('selected');
        }

        instance.selectedSignature = instance.signatures.find(function(s) { return s.id === sigId; });
    },

    /**
     * Update signature position in DOM
     */
    updateSignaturePosition: function(pRegionId, sigId) {
        var instance = this.instances[pRegionId];
        var sig = instance.signatures.find(function(s) { return s.id === sigId; });
        var sigLayer = document.getElementById(pRegionId + '_signatures_layer');

        if (!sig || !sigLayer) return;

        var sigEl = sigLayer.querySelector('.apex-docsign-signature[data-sig-id="' + sigId + '"]');
        if (sigEl) {
            sigEl.style.left = sig.x + 'px';
            sigEl.style.top = sig.y + 'px';
            sigEl.style.width = sig.width + 'px';
            sigEl.style.height = sig.height + 'px';
        }
    },

    /**
     * Update signatures visibility for current page
     */
    updateSignaturesForPage: function(pRegionId, pageNum) {
        var instance = this.instances[pRegionId];
        var sigLayer = document.getElementById(pRegionId + '_signatures_layer');

        if (!sigLayer) return;

        sigLayer.querySelectorAll('.apex-docsign-signature').forEach(function(el) {
            var sigId = el.getAttribute('data-sig-id');
            var sig = instance.signatures.find(function(s) { return s.id === sigId; });
            if (sig) {
                el.style.display = sig.page === pageNum ? 'block' : 'none';
            }
        });
    },

    /**
     * Remove signature
     */
    removeSignature: function(pRegionId, sigId) {
        var instance = this.instances[pRegionId];
        var sigLayer = document.getElementById(pRegionId + '_signatures_layer');

        instance.signatures = instance.signatures.filter(function(s) { return s.id !== sigId; });

        if (sigLayer) {
            var sigEl = sigLayer.querySelector('.apex-docsign-signature[data-sig-id="' + sigId + '"]');
            if (sigEl) sigEl.remove();
        }

        if (instance.selectedSignature && instance.selectedSignature.id === sigId) {
            instance.selectedSignature = null;
        }

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-signature-removed', {
                signatureId: sigId
            });
        }
    },

    /**
     * Export signed document
     */
    exportDocument: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];

        if (!instance.document && !instance.pdfDoc) {
            apex.message.alert('No document loaded.');
            return;
        }

        if (instance.signatures.length === 0) {
            apex.message.alert('No signatures added to document.');
            return;
        }

        // Create export canvas
        var exportCanvas = document.createElement('canvas');
        var exportCtx = exportCanvas.getContext('2d');

        var docCanvas = document.getElementById(pRegionId + '_doc_canvas');
        exportCanvas.width = docCanvas.width;
        exportCanvas.height = docCanvas.height;

        // Draw document
        exportCtx.drawImage(docCanvas, 0, 0);

        // Draw signatures for current page
        var pageSignatures = instance.signatures.filter(function(s) {
            return s.page === instance.currentPage;
        });

        var loadedImages = 0;
        var totalImages = pageSignatures.length;

        if (totalImages === 0) {
            this.downloadCanvas(pRegionId, exportCanvas);
            return;
        }

        pageSignatures.forEach(function(sig) {
            var img = new Image();
            img.onload = function() {
                exportCtx.drawImage(img, sig.x, sig.y, sig.width, sig.height);
                loadedImages++;

                if (loadedImages === totalImages) {
                    self.downloadCanvas(pRegionId, exportCanvas);
                }
            };
            img.src = sig.data;
        });
    },

    /**
     * Download canvas as image
     */
    downloadCanvas: function(pRegionId, canvas) {
        var instance = this.instances[pRegionId];

        var link = document.createElement('a');
        link.download = 'signed_document_page_' + instance.currentPage + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-document-exported', {
                page: instance.currentPage,
                signatureCount: instance.signatures.filter(function(s) {
                    return s.page === instance.currentPage;
                }).length
            });
        }
    },

    /**
     * Get signed document data URL
     */
    getSignedDocumentData: function(pRegionId) {
        var instance = this.instances[pRegionId];
        var docCanvas = document.getElementById(pRegionId + '_doc_canvas');

        if (!docCanvas) return null;

        var exportCanvas = document.createElement('canvas');
        var exportCtx = exportCanvas.getContext('2d');

        exportCanvas.width = docCanvas.width;
        exportCanvas.height = docCanvas.height;
        exportCtx.drawImage(docCanvas, 0, 0);

        // Draw signatures
        var pageSignatures = instance.signatures.filter(function(s) {
            return s.page === instance.currentPage;
        });

        // Note: For synchronous return, signatures need to be pre-loaded
        // This is a simplified version
        return exportCanvas.toDataURL('image/png');
    }
};
