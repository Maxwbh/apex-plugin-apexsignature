/**
 * APEX Signature Plugin - JavaScript Functions
 *
 * @author Daniel Hochleitner (original)
 * @contributor Maxwell da Silva Oliveira - M&S do Brasil LTDA
 * @version 2.0.1
 * @license MIT
 *
 * Updated for Oracle APEX 24.2 and signature_pad v5.x compatibility
 * LinkedIn: /maxwbh
 *
 * Bug Fixes:
 * - #20/#21: Fixed Dynamic Action event not firing for 'Signature Saved'
 * - #13: Added Page Items to Submit support
 */

// global namespace
var apexSignature = {
    // Plugin version
    VERSION: '2.0.1',

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
     * Trigger APEX event properly for Dynamic Actions
     * This fixes issues #20 and #21 where DA events were not firing
     * @param {string} pRegionId - Region static ID
     * @param {string} pEventName - Event name to trigger
     * @param {Object} pData - Event data
     */
    triggerEvent: function(pRegionId, pEventName, pData) {
        // Get the region element - try multiple selectors for compatibility
        var regionEl = document.getElementById(pRegionId);

        // If not found by static_id, try with _signature suffix (plugin wrapper)
        if (!regionEl) {
            regionEl = document.getElementById(pRegionId + '_signature');
        }

        // Try jQuery selector as fallback
        var $region = apex.jQuery('#' + pRegionId);
        if ($region.length === 0) {
            $region = apex.jQuery('#' + pRegionId + '_signature');
        }

        // Create event data object
        var eventData = pData || {};
        eventData.regionId = pRegionId;

        // Method 1: Use apex.event.trigger (preferred for APEX 5.1+)
        // This is the correct way to trigger events that Dynamic Actions can capture
        if (regionEl && typeof apex.event !== 'undefined' && typeof apex.event.trigger === 'function') {
            try {
                apex.event.trigger(regionEl, pEventName, eventData);
            } catch (e) {
                console.warn('apexSignature: apex.event.trigger failed:', e);
            }
        }

        // Method 2: jQuery trigger with custom event for backward compatibility
        // Some older APEX versions or custom DA may listen via jQuery
        if ($region.length > 0) {
            try {
                // Create a proper jQuery event object
                var jqEvent = apex.jQuery.Event(pEventName);
                jqEvent.data = eventData;
                $region.trigger(jqEvent, [eventData]);
            } catch (e) {
                console.warn('apexSignature: jQuery trigger failed:', e);
            }
        }

        // Method 3: Dispatch native CustomEvent for modern browsers
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
     * Fixed: Event now fires correctly for Dynamic Actions (Issue #20/#21)
     * @param {string} pAjaxIdentifier - APEX AJAX identifier
     * @param {string} pRegionId - Region ID
     * @param {string} pImg - Image data URI
     * @param {Function} callback - Callback function
     * @param {Object} options - Additional options (pageItems, etc.)
     */
    save2Db: function(pAjaxIdentifier, pRegionId, pImg, callback, options) {
        var self = this;
        var opts = options || {};

        // Convert img DataURI to base64
        var base64 = apexSignature.dataURI2base64(pImg);

        // Split base64 clob string to f01 array (30k chunks)
        var f01Array = apexSignature.clob2Array(base64, 30000, []);

        // Build APEX Ajax options
        var ajaxOptions = {
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
                // CRITICAL FIX for Issue #20/#21:
                // Use setTimeout to ensure DOM is ready and events propagate correctly
                // This ensures the Dynamic Action event handler has time to bind
                setTimeout(function() {
                    // Trigger the saved event using our robust method
                    apexSignature.triggerEvent(pRegionId, 'apexsignature-saved-db', {
                        data: pData,
                        success: true,
                        base64Length: base64.length
                    });

                    // Execute callback AFTER event is triggered
                    if (typeof callback === 'function') {
                        callback(true, pData);
                    }
                }, 10);
            },

            // ERROR function
            error: function(xhr, pMessage, pError) {
                // Use setTimeout for consistency with success handler
                setTimeout(function() {
                    // Trigger the error event
                    apexSignature.triggerEvent(pRegionId, 'apexsignature-error-db', {
                        message: pMessage,
                        error: pError,
                        success: false,
                        xhr: xhr
                    });

                    console.error('apexSignature.save2Db ERROR:', pMessage, pError);

                    // Execute callback AFTER event is triggered
                    if (typeof callback === 'function') {
                        callback(false, pMessage);
                    }
                }, 10);
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
        var self = this;
        var vOptions = pOptions;
        var vCanvas = document.getElementById(vOptions.canvasId);
        var vLogging = apexSignature.parseBoolean(pLogging);
        var vMinWidth = parseFloat(vOptions.lineMinWidth) || 0.5;
        var vMaxWidth = parseFloat(vOptions.lineMaxWidth) || 2.5;
        var vClearBtnSelector = vOptions.clearButton;
        var vSaveBtnSelector = vOptions.saveButton;
        var vEmptyAlert = vOptions.emptyAlert;
        var vShowSpinner = apexSignature.parseBoolean(vOptions.showSpinner);
        var vPageItems = vOptions.pageItems || null;

        // Validate canvas exists
        if (!vCanvas) {
            console.error('apexSignature: Canvas element not found:', vOptions.canvasId);
            return;
        }

        // Canvas dimensions
        var vCanvasWidth = vCanvas.width;
        var vCanvasHeight = vCanvas.height;
        var vClientWidth = document.documentElement.clientWidth;
        var vClientHeight = document.documentElement.clientHeight;

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
        var signaturePad = new SignaturePad(vCanvas, {
            minWidth: vMinWidth,
            maxWidth: vMaxWidth,
            backgroundColor: vOptions.backgroundColor || 'rgba(0,0,0,0)',
            penColor: vOptions.penColor || 'black',
            // New v5.x options for better touch support
            throttle: 16,
            minDistance: 5,
            velocityFilterWeight: 0.7
        });

        // Store reference for external access via apex.region API
        if (window.apex && window.apex.region) {
            apex.region.create(pRegionId, {
                type: 'apexSignature',
                signaturePad: signaturePad,
                widget: function() {
                    return signaturePad;
                },
                clear: function() {
                    signaturePad.clear();
                    apexSignature.triggerEvent(pRegionId, 'apexsignature-cleared', {});
                },
                isEmpty: function() {
                    return signaturePad.isEmpty();
                },
                toDataURL: function(type) {
                    return signaturePad.toDataURL(type || 'image/png');
                },
                toSVG: function(options) {
                    return signaturePad.toSVG(options);
                },
                save: function() {
                    // Programmatic save
                    if (!signaturePad.isEmpty()) {
                        var vImg = signaturePad.toDataURL('image/png');
                        apexSignature.save2Db(vOptions.ajaxIdentifier, pRegionId, vImg, null, {
                            pageItems: vPageItems
                        });
                    }
                }
            });
        }

        // Event listeners using new v5.x event system
        signaturePad.addEventListener('beginStroke', function(event) {
            if (vLogging) {
                console.log('apexSignatureFnc: Stroke started');
            }
            apexSignature.triggerEvent(pRegionId, 'apexsignature-stroke-begin', {
                event: event
            });
        });

        signaturePad.addEventListener('endStroke', function(event) {
            if (vLogging) {
                console.log('apexSignatureFnc: Stroke ended');
            }
            apexSignature.triggerEvent(pRegionId, 'apexsignature-stroke-end', {
                event: event
            });
        });

        // Clear button handler
        if (vClearBtnSelector) {
            apex.jQuery(document).on('click', vClearBtnSelector, function(e) {
                e.preventDefault();
                signaturePad.clear();

                apexSignature.triggerEvent(pRegionId, 'apexsignature-cleared', {});

                if (vLogging) {
                    console.log('apexSignatureFnc: Signature cleared');
                }
            });
        }

        // Save button handler
        if (vSaveBtnSelector) {
            apex.jQuery(document).on('click', vSaveBtnSelector, function(e) {
                e.preventDefault();

                var vIsEmpty = signaturePad.isEmpty();

                // Only proceed if signature is not empty
                if (!vIsEmpty) {
                    var lSpinner = null;

                    // Show wait spinner
                    if (vShowSpinner) {
                        lSpinner = apex.util.showSpinner(apex.jQuery('#' + pRegionId));
                    }

                    // Get image data
                    var vImg = signaturePad.toDataURL('image/png');

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

        // Trigger initialization complete event
        setTimeout(function() {
            apexSignature.triggerEvent(pRegionId, 'apexsignature-initialized', {
                version: apexSignature.VERSION,
                signaturePad: signaturePad
            });
        }, 0);

        if (vLogging) {
            console.log('apexSignatureFnc: Initialization complete');
        }
    }
};
