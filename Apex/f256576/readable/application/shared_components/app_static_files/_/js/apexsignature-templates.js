/**
 * APEX Signature Plugin - Signature Templates Module
 *
 * @author Daniel Hochleitner (original plugin)
 * @contributor Maxwell da Silva Oliveira - M&S do Brasil LTDA
 * @version 3.2.0
 * @license MIT
 *
 * Features:
 * - Save signatures as reusable templates
 * - Gallery view of saved signatures
 * - Select saved signature to apply
 * - Edit/delete saved signatures
 * - LocalStorage persistence with optional APEX item sync
 *
 * LinkedIn: /maxwbh
 */

var apexSignatureTemplates = {
    // Module version
    VERSION: '3.2.0',

    // Storage key prefix
    STORAGE_PREFIX: 'apex_sig_template_',

    // Maximum templates per user
    MAX_TEMPLATES: 20,

    // Thumbnail size
    THUMB_WIDTH: 150,
    THUMB_HEIGHT: 80,

    // Store module instances
    instances: {},

    /**
     * Initialize templates module
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
            templates: [],
            isGalleryOpen: false
        };

        var instance = this.instances[pRegionId];

        // Load templates from storage
        this.loadTemplates(pRegionId);

        // Build UI button
        this.buildTemplateButton(pRegionId, options);

        // Build gallery modal
        this.buildGalleryModal(pRegionId, options);

        // Trigger init event
        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-templates-initialized', {
                version: this.VERSION,
                templateCount: instance.templates.length
            });
        }

        console.log('apexSignatureTemplates v' + this.VERSION + ' initialized for region:', pRegionId);
    },

    /**
     * Build template action button
     */
    buildTemplateButton: function(pRegionId, pOptions) {
        var self = this;
        var wrapper = document.getElementById(pRegionId + '_wrapper');
        if (!wrapper) {
            wrapper = document.getElementById(pRegionId + '_signature');
        }
        if (!wrapper) return;

        // Create toolbar container if not exists
        var toolbar = document.getElementById(pRegionId + '_templates_toolbar');
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.className = 'apex-sig-templates-toolbar';
            toolbar.id = pRegionId + '_templates_toolbar';
            wrapper.insertBefore(toolbar, wrapper.firstChild);
        }

        // Save Template button
        var saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'apex-sig-tpl-btn apex-sig-tpl-save';
        saveBtn.id = pRegionId + '_tpl_save';
        saveBtn.innerHTML = '<span class="apex-sig-icon">&#128190;</span> ' + (pOptions.saveLabel || 'Save Template');
        saveBtn.title = 'Save current signature as template';
        toolbar.appendChild(saveBtn);

        // Gallery button
        var galleryBtn = document.createElement('button');
        galleryBtn.type = 'button';
        galleryBtn.className = 'apex-sig-tpl-btn apex-sig-tpl-gallery';
        galleryBtn.id = pRegionId + '_tpl_gallery';
        galleryBtn.innerHTML = '<span class="apex-sig-icon">&#128444;</span> ' + (pOptions.galleryLabel || 'My Signatures');
        galleryBtn.title = 'Open saved signatures gallery';
        toolbar.appendChild(galleryBtn);

        // Template count badge
        var badge = document.createElement('span');
        badge.className = 'apex-sig-tpl-badge';
        badge.id = pRegionId + '_tpl_badge';
        badge.textContent = this.instances[pRegionId].templates.length;
        galleryBtn.appendChild(badge);

        // Event listeners
        saveBtn.addEventListener('click', function() {
            self.showSaveDialog(pRegionId);
        });

        galleryBtn.addEventListener('click', function() {
            self.openGallery(pRegionId);
        });
    },

    /**
     * Build gallery modal
     */
    buildGalleryModal: function(pRegionId, pOptions) {
        var self = this;

        // Create modal container
        var modal = document.createElement('div');
        modal.className = 'apex-sig-tpl-modal';
        modal.id = pRegionId + '_tpl_modal';
        modal.style.display = 'none';

        // Modal content
        var modalContent = document.createElement('div');
        modalContent.className = 'apex-sig-tpl-modal-content';

        // Modal header
        var header = document.createElement('div');
        header.className = 'apex-sig-tpl-modal-header';

        var title = document.createElement('h3');
        title.className = 'apex-sig-tpl-modal-title';
        title.textContent = pOptions.galleryTitle || 'My Saved Signatures';

        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'apex-sig-tpl-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.title = 'Close';

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Gallery container
        var gallery = document.createElement('div');
        gallery.className = 'apex-sig-tpl-gallery';
        gallery.id = pRegionId + '_tpl_gallery_container';

        // Empty state
        var emptyState = document.createElement('div');
        emptyState.className = 'apex-sig-tpl-empty';
        emptyState.id = pRegionId + '_tpl_empty';
        emptyState.innerHTML = '<span class="apex-sig-tpl-empty-icon">&#128221;</span><p>' +
            (pOptions.emptyMessage || 'No saved signatures yet. Create one by clicking "Save Template".') + '</p>';

        gallery.appendChild(emptyState);

        // Modal footer
        var footer = document.createElement('div');
        footer.className = 'apex-sig-tpl-modal-footer';

        var clearAllBtn = document.createElement('button');
        clearAllBtn.type = 'button';
        clearAllBtn.className = 'apex-sig-tpl-btn apex-sig-tpl-danger';
        clearAllBtn.id = pRegionId + '_tpl_clear_all';
        clearAllBtn.innerHTML = '<span class="apex-sig-icon">&#128465;</span> ' + (pOptions.clearAllLabel || 'Clear All');
        clearAllBtn.title = 'Delete all saved signatures';

        footer.appendChild(clearAllBtn);

        modalContent.appendChild(header);
        modalContent.appendChild(gallery);
        modalContent.appendChild(footer);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);

        // Event listeners
        closeBtn.addEventListener('click', function() {
            self.closeGallery(pRegionId);
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                self.closeGallery(pRegionId);
            }
        });

        clearAllBtn.addEventListener('click', function() {
            self.confirmClearAll(pRegionId);
        });

        // Keyboard support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && self.instances[pRegionId] && self.instances[pRegionId].isGalleryOpen) {
                self.closeGallery(pRegionId);
            }
        });
    },

    /**
     * Load templates from localStorage
     */
    loadTemplates: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return [];

        try {
            var stored = localStorage.getItem(instance.storageKey);
            if (stored) {
                instance.templates = JSON.parse(stored);
            } else {
                instance.templates = [];
            }
        } catch (e) {
            console.error('apexSignatureTemplates: Error loading templates:', e);
            instance.templates = [];
        }

        return instance.templates;
    },

    /**
     * Save templates to localStorage
     */
    saveTemplates: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return false;

        try {
            localStorage.setItem(instance.storageKey, JSON.stringify(instance.templates));
            this.updateBadge(pRegionId);
            return true;
        } catch (e) {
            console.error('apexSignatureTemplates: Error saving templates:', e);
            if (e.name === 'QuotaExceededError') {
                apex.message.alert('Storage quota exceeded. Please delete some templates.');
            }
            return false;
        }
    },

    /**
     * Update badge count
     */
    updateBadge: function(pRegionId) {
        var instance = this.instances[pRegionId];
        var badge = document.getElementById(pRegionId + '_tpl_badge');
        if (badge && instance) {
            badge.textContent = instance.templates.length;
            badge.style.display = instance.templates.length > 0 ? 'inline-block' : 'none';
        }
    },

    /**
     * Show save template dialog
     */
    showSaveDialog: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];

        // Check if signature exists
        if (typeof apexSignature !== 'undefined' && apexSignature.isSignatureEmpty(pRegionId)) {
            apex.message.alert('Please create a signature first before saving as template.');
            return;
        }

        // Check max templates
        if (instance.templates.length >= this.MAX_TEMPLATES) {
            apex.message.alert('Maximum number of templates (' + this.MAX_TEMPLATES + ') reached. Please delete some templates first.');
            return;
        }

        // Prompt for name
        var defaultName = 'Signature ' + (instance.templates.length + 1);

        // Create custom dialog
        var dialog = document.createElement('div');
        dialog.className = 'apex-sig-tpl-dialog';
        dialog.id = pRegionId + '_save_dialog';
        dialog.innerHTML = [
            '<div class="apex-sig-tpl-dialog-content">',
            '  <h4>Save Signature as Template</h4>',
            '  <div class="apex-sig-tpl-form-group">',
            '    <label for="' + pRegionId + '_tpl_name">Template Name:</label>',
            '    <input type="text" id="' + pRegionId + '_tpl_name" class="apex-sig-tpl-input" ',
            '           value="' + defaultName + '" maxlength="50" placeholder="Enter template name">',
            '  </div>',
            '  <div class="apex-sig-tpl-dialog-actions">',
            '    <button type="button" class="apex-sig-tpl-btn apex-sig-tpl-cancel">Cancel</button>',
            '    <button type="button" class="apex-sig-tpl-btn apex-sig-tpl-primary">Save</button>',
            '  </div>',
            '</div>'
        ].join('\n');

        document.body.appendChild(dialog);

        var input = document.getElementById(pRegionId + '_tpl_name');
        input.focus();
        input.select();

        // Event handlers
        var cancelBtn = dialog.querySelector('.apex-sig-tpl-cancel');
        var saveBtn = dialog.querySelector('.apex-sig-tpl-primary');

        cancelBtn.addEventListener('click', function() {
            dialog.remove();
        });

        saveBtn.addEventListener('click', function() {
            var name = input.value.trim();
            if (name) {
                self.saveTemplate(pRegionId, name);
                dialog.remove();
            } else {
                input.focus();
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                saveBtn.click();
            } else if (e.key === 'Escape') {
                cancelBtn.click();
            }
        });

        dialog.addEventListener('click', function(e) {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    },

    /**
     * Save current signature as template
     */
    saveTemplate: function(pRegionId, pName) {
        var self = this;
        var instance = this.instances[pRegionId];

        if (typeof apexSignature === 'undefined') {
            console.error('apexSignatureTemplates: apexSignature not available');
            return false;
        }

        var signatureData = apexSignature.getCurrentSignature(pRegionId);
        if (!signatureData) {
            apex.message.alert('No signature to save.');
            return false;
        }

        // Create thumbnail
        this.createThumbnail(signatureData, function(thumbnailData) {
            var template = {
                id: self.generateId(),
                name: pName,
                data: signatureData,
                thumbnail: thumbnailData,
                createdAt: new Date().toISOString(),
                mode: apexSignature.instances[pRegionId] ?
                      apexSignature.instances[pRegionId].currentMode : 'draw'
            };

            instance.templates.push(template);
            self.saveTemplates(pRegionId);

            apex.message.showPageSuccess('Template "' + pName + '" saved successfully.');

            apexSignature.triggerEvent(pRegionId, 'apexsignature-template-saved', {
                template: template,
                count: instance.templates.length
            });
        });

        return true;
    },

    /**
     * Create thumbnail from signature data
     */
    createThumbnail: function(pDataUrl, callback) {
        var self = this;
        var img = new Image();

        img.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = self.THUMB_WIDTH;
            canvas.height = self.THUMB_HEIGHT;

            var ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Calculate aspect ratio
            var scale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
            ) * 0.9;

            var x = (canvas.width - img.width * scale) / 2;
            var y = (canvas.height - img.height * scale) / 2;

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            callback(canvas.toDataURL('image/png'));
        };

        img.onerror = function() {
            callback(pDataUrl);
        };

        img.src = pDataUrl;
    },

    /**
     * Generate unique ID
     */
    generateId: function() {
        return 'tpl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Open gallery modal
     */
    openGallery: function(pRegionId) {
        var instance = this.instances[pRegionId];
        var modal = document.getElementById(pRegionId + '_tpl_modal');

        if (!modal || !instance) return;

        this.renderGallery(pRegionId);
        modal.style.display = 'flex';
        instance.isGalleryOpen = true;

        // Focus first item for accessibility
        setTimeout(function() {
            var firstItem = modal.querySelector('.apex-sig-tpl-item');
            if (firstItem) {
                firstItem.focus();
            }
        }, 100);

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-gallery-opened', {
                count: instance.templates.length
            });
        }
    },

    /**
     * Close gallery modal
     */
    closeGallery: function(pRegionId) {
        var instance = this.instances[pRegionId];
        var modal = document.getElementById(pRegionId + '_tpl_modal');

        if (modal) {
            modal.style.display = 'none';
        }

        if (instance) {
            instance.isGalleryOpen = false;
        }

        if (typeof apexSignature !== 'undefined') {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-gallery-closed', {});
        }
    },

    /**
     * Render gallery items
     */
    renderGallery: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];
        var container = document.getElementById(pRegionId + '_tpl_gallery_container');
        var emptyState = document.getElementById(pRegionId + '_tpl_empty');
        var clearAllBtn = document.getElementById(pRegionId + '_tpl_clear_all');

        if (!container || !instance) return;

        // Clear existing items (keep empty state)
        var items = container.querySelectorAll('.apex-sig-tpl-item');
        items.forEach(function(item) {
            item.remove();
        });

        if (instance.templates.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            if (clearAllBtn) clearAllBtn.style.display = 'none';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (clearAllBtn) clearAllBtn.style.display = 'inline-flex';

        // Sort by creation date (newest first)
        var sorted = instance.templates.slice().sort(function(a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        sorted.forEach(function(template) {
            var item = self.createGalleryItem(pRegionId, template);
            container.appendChild(item);
        });
    },

    /**
     * Create gallery item element
     */
    createGalleryItem: function(pRegionId, pTemplate) {
        var self = this;

        var item = document.createElement('div');
        item.className = 'apex-sig-tpl-item';
        item.id = pRegionId + '_tpl_item_' + pTemplate.id;
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Select signature: ' + pTemplate.name);

        // Thumbnail
        var thumb = document.createElement('div');
        thumb.className = 'apex-sig-tpl-thumb';

        var img = document.createElement('img');
        img.src = pTemplate.thumbnail || pTemplate.data;
        img.alt = pTemplate.name;

        thumb.appendChild(img);

        // Info
        var info = document.createElement('div');
        info.className = 'apex-sig-tpl-info';

        var name = document.createElement('span');
        name.className = 'apex-sig-tpl-name';
        name.textContent = pTemplate.name;
        name.title = pTemplate.name;

        var date = document.createElement('span');
        date.className = 'apex-sig-tpl-date';
        date.textContent = this.formatDate(pTemplate.createdAt);

        info.appendChild(name);
        info.appendChild(date);

        // Actions
        var actions = document.createElement('div');
        actions.className = 'apex-sig-tpl-actions';

        var useBtn = document.createElement('button');
        useBtn.type = 'button';
        useBtn.className = 'apex-sig-tpl-action apex-sig-tpl-use';
        useBtn.innerHTML = '&#10003;';
        useBtn.title = 'Use this signature';

        var editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'apex-sig-tpl-action apex-sig-tpl-edit';
        editBtn.innerHTML = '&#9998;';
        editBtn.title = 'Rename template';

        var deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'apex-sig-tpl-action apex-sig-tpl-delete';
        deleteBtn.innerHTML = '&#128465;';
        deleteBtn.title = 'Delete template';

        actions.appendChild(useBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(thumb);
        item.appendChild(info);
        item.appendChild(actions);

        // Event listeners
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.apex-sig-tpl-action')) {
                self.useTemplate(pRegionId, pTemplate.id);
            }
        });

        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                self.useTemplate(pRegionId, pTemplate.id);
            }
        });

        useBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            self.useTemplate(pRegionId, pTemplate.id);
        });

        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            self.renameTemplate(pRegionId, pTemplate.id);
        });

        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            self.deleteTemplate(pRegionId, pTemplate.id);
        });

        return item;
    },

    /**
     * Format date for display
     */
    formatDate: function(pIsoDate) {
        try {
            var date = new Date(pIsoDate);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        } catch (e) {
            return '';
        }
    },

    /**
     * Use template (apply to signature area)
     */
    useTemplate: function(pRegionId, pTemplateId) {
        var self = this;
        var instance = this.instances[pRegionId];

        var template = instance.templates.find(function(t) {
            return t.id === pTemplateId;
        });

        if (!template) {
            console.error('apexSignatureTemplates: Template not found:', pTemplateId);
            return;
        }

        // Apply to signature pad
        if (typeof apexSignature !== 'undefined' && apexSignature.instances[pRegionId]) {
            var sigInstance = apexSignature.instances[pRegionId];

            // Switch to draw mode if needed
            if (sigInstance.currentMode !== 'draw') {
                apexSignature.switchMode(pRegionId, 'draw', false);
            }

            // Load signature data
            if (sigInstance.signaturePad) {
                var img = new Image();
                img.onload = function() {
                    var canvas = sigInstance.signaturePad._canvas;
                    var ctx = canvas.getContext('2d');

                    // Clear and draw
                    sigInstance.signaturePad.clear();

                    // Calculate scaling to fit
                    var scale = Math.min(
                        canvas.width / img.width,
                        canvas.height / img.height
                    ) * 0.9;

                    var x = (canvas.width - img.width * scale) / 2;
                    var y = (canvas.height - img.height * scale) / 2;

                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

                    // Mark as not empty
                    sigInstance.signaturePad._data = [{}]; // Trick to mark as not empty

                    apexSignature.triggerEvent(pRegionId, 'apexsignature-template-applied', {
                        template: template
                    });

                    apex.message.showPageSuccess('Template "' + template.name + '" applied.');
                };
                img.src = template.data;
            }
        }

        this.closeGallery(pRegionId);
    },

    /**
     * Rename template
     */
    renameTemplate: function(pRegionId, pTemplateId) {
        var self = this;
        var instance = this.instances[pRegionId];

        var template = instance.templates.find(function(t) {
            return t.id === pTemplateId;
        });

        if (!template) return;

        // Create rename dialog
        var dialog = document.createElement('div');
        dialog.className = 'apex-sig-tpl-dialog';
        dialog.id = pRegionId + '_rename_dialog';
        dialog.innerHTML = [
            '<div class="apex-sig-tpl-dialog-content">',
            '  <h4>Rename Template</h4>',
            '  <div class="apex-sig-tpl-form-group">',
            '    <label for="' + pRegionId + '_tpl_rename">New Name:</label>',
            '    <input type="text" id="' + pRegionId + '_tpl_rename" class="apex-sig-tpl-input" ',
            '           value="' + template.name + '" maxlength="50">',
            '  </div>',
            '  <div class="apex-sig-tpl-dialog-actions">',
            '    <button type="button" class="apex-sig-tpl-btn apex-sig-tpl-cancel">Cancel</button>',
            '    <button type="button" class="apex-sig-tpl-btn apex-sig-tpl-primary">Save</button>',
            '  </div>',
            '</div>'
        ].join('\n');

        document.body.appendChild(dialog);

        var input = document.getElementById(pRegionId + '_tpl_rename');
        input.focus();
        input.select();

        var cancelBtn = dialog.querySelector('.apex-sig-tpl-cancel');
        var saveBtn = dialog.querySelector('.apex-sig-tpl-primary');

        cancelBtn.addEventListener('click', function() {
            dialog.remove();
        });

        saveBtn.addEventListener('click', function() {
            var newName = input.value.trim();
            if (newName && newName !== template.name) {
                template.name = newName;
                self.saveTemplates(pRegionId);
                self.renderGallery(pRegionId);

                apexSignature.triggerEvent(pRegionId, 'apexsignature-template-renamed', {
                    template: template
                });
            }
            dialog.remove();
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                saveBtn.click();
            } else if (e.key === 'Escape') {
                cancelBtn.click();
            }
        });

        dialog.addEventListener('click', function(e) {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    },

    /**
     * Delete template
     */
    deleteTemplate: function(pRegionId, pTemplateId) {
        var self = this;
        var instance = this.instances[pRegionId];

        var templateIndex = instance.templates.findIndex(function(t) {
            return t.id === pTemplateId;
        });

        if (templateIndex === -1) return;

        var template = instance.templates[templateIndex];

        apex.message.confirm('Are you sure you want to delete "' + template.name + '"?', function(okPressed) {
            if (okPressed) {
                instance.templates.splice(templateIndex, 1);
                self.saveTemplates(pRegionId);
                self.renderGallery(pRegionId);

                if (typeof apexSignature !== 'undefined') {
                    apexSignature.triggerEvent(pRegionId, 'apexsignature-template-deleted', {
                        templateId: pTemplateId,
                        templateName: template.name,
                        remainingCount: instance.templates.length
                    });
                }

                apex.message.showPageSuccess('Template deleted.');
            }
        });
    },

    /**
     * Confirm clear all templates
     */
    confirmClearAll: function(pRegionId) {
        var self = this;
        var instance = this.instances[pRegionId];

        if (instance.templates.length === 0) return;

        apex.message.confirm(
            'Are you sure you want to delete all ' + instance.templates.length + ' saved signatures? This cannot be undone.',
            function(okPressed) {
                if (okPressed) {
                    instance.templates = [];
                    self.saveTemplates(pRegionId);
                    self.renderGallery(pRegionId);

                    if (typeof apexSignature !== 'undefined') {
                        apexSignature.triggerEvent(pRegionId, 'apexsignature-templates-cleared', {});
                    }

                    apex.message.showPageSuccess('All templates deleted.');
                }
            }
        );
    },

    /**
     * Get template by ID
     */
    getTemplate: function(pRegionId, pTemplateId) {
        var instance = this.instances[pRegionId];
        if (!instance) return null;

        return instance.templates.find(function(t) {
            return t.id === pTemplateId;
        });
    },

    /**
     * Get all templates
     */
    getAllTemplates: function(pRegionId) {
        var instance = this.instances[pRegionId];
        return instance ? instance.templates.slice() : [];
    },

    /**
     * Get template count
     */
    getTemplateCount: function(pRegionId) {
        var instance = this.instances[pRegionId];
        return instance ? instance.templates.length : 0;
    },

    /**
     * Import templates from JSON
     */
    importTemplates: function(pRegionId, pJson) {
        var self = this;
        var instance = this.instances[pRegionId];

        try {
            var imported = typeof pJson === 'string' ? JSON.parse(pJson) : pJson;

            if (!Array.isArray(imported)) {
                throw new Error('Invalid format: expected array');
            }

            var added = 0;
            imported.forEach(function(tpl) {
                if (tpl.data && instance.templates.length < self.MAX_TEMPLATES) {
                    instance.templates.push({
                        id: self.generateId(),
                        name: tpl.name || 'Imported ' + (instance.templates.length + 1),
                        data: tpl.data,
                        thumbnail: tpl.thumbnail || tpl.data,
                        createdAt: tpl.createdAt || new Date().toISOString(),
                        mode: tpl.mode || 'draw'
                    });
                    added++;
                }
            });

            if (added > 0) {
                this.saveTemplates(pRegionId);
                apex.message.showPageSuccess(added + ' template(s) imported.');
            }

            return added;
        } catch (e) {
            console.error('apexSignatureTemplates: Import error:', e);
            apex.message.alert('Error importing templates: ' + e.message);
            return 0;
        }
    },

    /**
     * Export templates to JSON
     */
    exportTemplates: function(pRegionId) {
        var instance = this.instances[pRegionId];
        if (!instance) return null;

        return JSON.stringify(instance.templates, null, 2);
    }
};
