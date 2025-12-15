/**
 * APEX Signature Plugin - JavaScript Functions
 *
 * @author Daniel Hochleitner (original)
 * @contributor Maxwell da Silva Oliveira - M&S do Brasil LTDA
 * @version 2.0.0
 * @license MIT
 *
 * Updated for Oracle APEX 24.2 and signature_pad v5.x compatibility
 * LinkedIn: /maxwbh
 */

// global namespace
var apexSignature = {
    // Plugin version
    VERSION: '2.0.0',

    /**
     * Parse string to boolean
     * @param {string} pString - String to parse ('true' or 'false')
     * @returns {boolean|undefined} - Parsed boolean value
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
     * @param {string} clob - Large string to split
     * @param {number} size - Chunk size (default 30000)
     * @param {Array} array - Array to populate
     * @returns {Array} - Array of string chunks
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
     * @param {string} dataURI - Data URI string
     * @returns {string} - Base64 encoded string
     */
    dataURI2base64: function(dataURI) {
        return dataURI.substring(dataURI.indexOf(',') + 1);
    },

    /**
     * Save signature to database via APEX AJAX
     * @param {string} pAjaxIdentifier - APEX AJAX identifier
     * @param {string} pRegionId - Region ID
     * @param {string} pImg - Image data URI
     * @param {Function} callback - Callback function
     * @param {Object} options - Additional options (pageItems, etc.)
     */
    save2Db: function(pAjaxIdentifier, pRegionId, pImg, callback, options) {
        const opts = options || {};

        // Convert img DataURI to base64
        const base64 = apexSignature.dataURI2base64(pImg);

        // Split base64 clob string to f01 array (30k chunks)
        const f01Array = apexSignature.clob2Array(base64, 30000, []);

        // Build APEX Ajax options
        const ajaxOptions = {
            f01: f01Array
        };

        // Add page items to submit if specified (Issue #13 fix)
        if (opts.pageItems) {
            ajaxOptions.pageItems = opts.pageItems;
        }

        // APEX Ajax Call
        apex.server.plugin(pAjaxIdentifier, ajaxOptions, {
            dataType: 'text',

            // SUCCESS function
            success: function(pData) {
                // Trigger APEX event on region element
                const regionEl = document.getElementById(pRegionId);
                if (regionEl) {
                    apex.event.trigger(regionEl, 'apexsignature-saved-db', {
                        data: pData,
                        regionId: pRegionId
                    });
                }
                // Also trigger jQuery event for backward compatibility
                apex.jQuery('#' + pRegionId).trigger('apexsignature-saved-db');

                // Execute callback
                if (typeof callback === 'function') {
                    callback(true, pData);
                }
            },

            // ERROR function
            error: function(xhr, pMessage, pError) {
                // Trigger APEX error event
                const regionEl = document.getElementById(pRegionId);
                if (regionEl) {
                    apex.event.trigger(regionEl, 'apexsignature-error-db', {
                        message: pMessage,
                        error: pError,
                        regionId: pRegionId
                    });
                }
                // Also trigger jQuery event for backward compatibility
                apex.jQuery('#' + pRegionId).trigger('apexsignature-error-db');

                console.error('apexSignature.save2Db ERROR:', pMessage, pError);

                // Execute callback
                if (typeof callback === 'function') {
                    callback(false, pMessage);
                }
            }
        });
    },

    /**
     * Main initialization function called from plugin
     * @param {string} pRegionId - Region ID
     * @param {Object} pOptions - Plugin options
     * @param {string} pLogging - Enable logging ('true' or 'false')
     */
    apexSignatureFnc: function(pRegionId, pOptions, pLogging) {
        const vOptions = pOptions;
        const vCanvas = document.getElementById(vOptions.canvasId);
        const vLogging = apexSignature.parseBoolean(pLogging);
        const vMinWidth = parseFloat(vOptions.lineMinWidth) || 0.5;
        const vMaxWidth = parseFloat(vOptions.lineMaxWidth) || 2.5;
        const vClearBtnSelector = vOptions.clearButton;
        const vSaveBtnSelector = vOptions.saveButton;
        const vEmptyAlert = vOptions.emptyAlert;
        const vShowSpinner = apexSignature.parseBoolean(vOptions.showSpinner);
        const vPageItems = vOptions.pageItems || null;

        // Canvas dimensions
        const vCanvasWidth = vCanvas.width;
        const vCanvasHeight = vCanvas.height;
        const vClientWidth = document.documentElement.clientWidth;
        const vClientHeight = document.documentElement.clientHeight;

        // Logging
        if (vLogging) {
            console.log('apexSignature v' + apexSignature.VERSION + ' initialized');
            console.log('apexSignatureFnc: Options:', {
                ajaxIdentifier: vOptions.ajaxIdentifier,
                canvasId: vOptions.canvasId,
                lineMinWidth: vOptions.lineMinWidth,
                lineMaxWidth: vOptions.lineMaxWidth,
                backgroundColor: vOptions.backgroundColor,
                penColor: vOptions.penColor,
                saveButton: vOptions.saveButton,
                clearButton: vOptions.clearButton,
                emptyAlert: vOptions.emptyAlert,
                showSpinner: vOptions.showSpinner,
                pageItems: vOptions.pageItems
            });
            console.log('apexSignatureFnc: Region ID:', pRegionId);
            console.log('apexSignatureFnc: Canvas size:', vCanvasWidth, 'x', vCanvasHeight);
            console.log('apexSignatureFnc: Client size:', vClientWidth, 'x', vClientHeight);
        }

        // Resize canvas if screen is smaller than canvas
        if (vCanvasWidth > vClientWidth) {
            vCanvas.width = vClientWidth - 60;
        }
        if (vCanvasHeight > vClientHeight) {
            vCanvas.height = vClientHeight - 60;
        }

        // SIGNATURE PAD v5.x
        // Create SignaturePad instance with new API
        const signaturePad = new SignaturePad(vCanvas, {
            minWidth: vMinWidth,
            maxWidth: vMaxWidth,
            backgroundColor: vOptions.backgroundColor || 'rgba(0,0,0,0)',
            penColor: vOptions.penColor || 'black',
            // New v5.x options for better touch support
            throttle: 16,
            minDistance: 5,
            velocityFilterWeight: 0.7
        });

        // Store reference for external access
        if (window.apex && window.apex.region) {
            apex.region.create(pRegionId, {
                type: 'apexSignature',
                signaturePad: signaturePad,
                clear: function() {
                    signaturePad.clear();
                },
                isEmpty: function() {
                    return signaturePad.isEmpty();
                },
                toDataURL: function(type) {
                    return signaturePad.toDataURL(type);
                },
                toSVG: function() {
                    return signaturePad.toSVG();
                }
            });
        }

        // Event listeners using new v5.x event system
        signaturePad.addEventListener('beginStroke', function(event) {
            if (vLogging) {
                console.log('apexSignatureFnc: Stroke started');
            }
            // Trigger APEX event
            apex.jQuery('#' + pRegionId).trigger('apexsignature-stroke-begin');
        });

        signaturePad.addEventListener('endStroke', function(event) {
            if (vLogging) {
                console.log('apexSignatureFnc: Stroke ended');
            }
            // Trigger APEX event
            apex.jQuery('#' + pRegionId).trigger('apexsignature-stroke-end');
        });

        // Clear button handler
        if (vClearBtnSelector) {
            apex.jQuery(vClearBtnSelector).on('click', function(e) {
                e.preventDefault();
                signaturePad.clear();

                // Trigger APEX event
                const regionEl = document.getElementById(pRegionId);
                if (regionEl) {
                    apex.event.trigger(regionEl, 'apexsignature-cleared', {
                        regionId: pRegionId
                    });
                }
                // jQuery event for backward compatibility
                apex.jQuery('#' + pRegionId).trigger('apexsignature-cleared');

                if (vLogging) {
                    console.log('apexSignatureFnc: Signature cleared');
                }
            });
        }

        // Save button handler
        if (vSaveBtnSelector) {
            apex.jQuery(vSaveBtnSelector).on('click', function(e) {
                e.preventDefault();

                const vIsEmpty = signaturePad.isEmpty();

                // Only proceed if signature is not empty
                if (!vIsEmpty) {
                    let lSpinner = null;

                    // Show wait spinner
                    if (vShowSpinner) {
                        lSpinner = apex.util.showSpinner(apex.jQuery('#' + pRegionId));
                    }

                    // Get image data
                    const vImg = signaturePad.toDataURL('image/png');

                    if (vLogging) {
                        console.log('apexSignatureFnc: Saving signature to database...');
                    }

                    // Save to database
                    apexSignature.save2Db(
                        vOptions.ajaxIdentifier,
                        pRegionId,
                        vImg,
                        function(success, data) {
                            // Clear signature after save
                            signaturePad.clear();

                            // Remove spinner
                            if (lSpinner) {
                                lSpinner.remove();
                            }

                            if (vLogging) {
                                console.log('apexSignatureFnc: Save ' + (success ? 'successful' : 'failed'));
                            }
                        },
                        {
                            pageItems: vPageItems
                        }
                    );
                } else {
                    // Show alert for empty signature
                    if (vEmptyAlert) {
                        apex.message.alert(vEmptyAlert);
                    }
                }
            });
        }

        if (vLogging) {
            console.log('apexSignatureFnc: Initialization complete');
        }
    }
};
