/**
 * APEX Signature - Verification Module
 * Version: 3.6.0
 *
 * Provides signature verification, integrity checking, and audit trail capabilities.
 *
 * Features:
 * - SHA-256 hash generation for signature integrity
 * - Comprehensive audit metadata (timestamp, IP, user agent, geolocation)
 * - Signature comparison and similarity detection
 * - Tamper detection with hash verification
 * - Audit log with complete signing history
 * - Digital certificate preparation (future-ready)
 *
 * Dependencies:
 * - Web Crypto API (native browser)
 * - apexsignature.js (base module)
 *
 * @author Maxwell da Silva Oliveira
 * @company M&S do Brasil LTDA
 * @linkedin /maxwbh
 * @license MIT
 */

var apexSignatureVerification = (function() {
    'use strict';

    // ========================================
    // Constants
    // ========================================

    var VERSION = '3.6.0';

    var HASH_ALGORITHM = 'SHA-256';

    var STORAGE_KEY_PREFIX = 'apex_sig_audit_';

    var STATUS = {
        VALID: 'valid',
        INVALID: 'invalid',
        TAMPERED: 'tampered',
        UNKNOWN: 'unknown',
        PENDING: 'pending'
    };

    var VERIFICATION_TYPES = {
        HASH: 'hash',
        VISUAL: 'visual',
        METADATA: 'metadata',
        FULL: 'full'
    };

    // ========================================
    // State
    // ========================================

    var instances = {};
    var auditLogs = {};

    // ========================================
    // Utility Functions
    // ========================================

    /**
     * Generate UUID v4
     */
    function generateUUID() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Get current ISO timestamp
     */
    function getTimestamp() {
        return new Date().toISOString();
    }

    /**
     * Convert ArrayBuffer to hex string
     */
    function bufferToHex(buffer) {
        var bytes = new Uint8Array(buffer);
        var hex = [];
        for (var i = 0; i < bytes.length; i++) {
            hex.push(bytes[i].toString(16).padStart(2, '0'));
        }
        return hex.join('');
    }

    /**
     * Convert base64 to ArrayBuffer
     */
    function base64ToArrayBuffer(base64) {
        // Remove data URL prefix if present
        var cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
        var binaryString = atob(cleanBase64);
        var bytes = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    /**
     * Get storage key for audit logs
     */
    function getStorageKey(regionId) {
        var appId = $v('pFlowId') || 'app';
        return STORAGE_KEY_PREFIX + appId + '_' + regionId;
    }

    // ========================================
    // Hash Generation
    // ========================================

    /**
     * Generate SHA-256 hash of signature data
     * @param {string} signatureData - Base64 encoded signature image
     * @returns {Promise<string>} - Hex encoded hash
     */
    function generateHash(signatureData) {
        return new Promise(function(resolve, reject) {
            if (!signatureData) {
                reject(new Error('No signature data provided'));
                return;
            }

            // Check for Web Crypto API support
            if (!window.crypto || !window.crypto.subtle) {
                // Fallback to simple checksum for older browsers
                resolve(generateSimpleChecksum(signatureData));
                return;
            }

            try {
                var buffer = base64ToArrayBuffer(signatureData);

                crypto.subtle.digest(HASH_ALGORITHM, buffer)
                    .then(function(hashBuffer) {
                        var hashHex = bufferToHex(hashBuffer);
                        resolve(hashHex);
                    })
                    .catch(function(err) {
                        console.warn('Crypto digest failed, using fallback:', err);
                        resolve(generateSimpleChecksum(signatureData));
                    });
            } catch (e) {
                console.warn('Hash generation error, using fallback:', e);
                resolve(generateSimpleChecksum(signatureData));
            }
        });
    }

    /**
     * Generate simple checksum (fallback for older browsers)
     */
    function generateSimpleChecksum(data) {
        var hash = 0;
        var cleanData = data.replace(/^data:image\/\w+;base64,/, '');
        for (var i = 0; i < cleanData.length; i++) {
            var char = cleanData.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return 'simple_' + Math.abs(hash).toString(16).padStart(8, '0');
    }

    /**
     * Generate content hash from canvas pixels
     */
    function generateCanvasHash(canvas) {
        return new Promise(function(resolve, reject) {
            if (!canvas) {
                reject(new Error('No canvas provided'));
                return;
            }

            try {
                var ctx = canvas.getContext('2d');
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var data = imageData.data;

                // Create a simplified representation for hashing
                var pixelData = new Uint8Array(data.length);
                for (var i = 0; i < data.length; i++) {
                    pixelData[i] = data[i];
                }

                if (window.crypto && window.crypto.subtle) {
                    crypto.subtle.digest(HASH_ALGORITHM, pixelData.buffer)
                        .then(function(hashBuffer) {
                            resolve(bufferToHex(hashBuffer));
                        })
                        .catch(reject);
                } else {
                    // Fallback
                    var hash = 0;
                    for (var j = 0; j < pixelData.length; j += 100) {
                        hash = ((hash << 5) - hash) + pixelData[j];
                        hash = hash & hash;
                    }
                    resolve('canvas_' + Math.abs(hash).toString(16).padStart(8, '0'));
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    // ========================================
    // Metadata Collection
    // ========================================

    /**
     * Collect comprehensive audit metadata
     * @param {object} options - Collection options
     * @returns {Promise<object>} - Metadata object
     */
    function collectMetadata(options) {
        options = options || {};

        var metadata = {
            id: generateUUID(),
            timestamp: getTimestamp(),
            timestampUnix: Date.now(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: window.screen.width + 'x' + window.screen.height,
            colorDepth: window.screen.colorDepth,
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            online: navigator.onLine,
            // APEX specific
            apexAppId: $v('pFlowId') || null,
            apexPageId: $v('pFlowStepId') || null,
            apexSessionId: $v('pInstance') || null,
            apexUsername: $v('APP_USER') || null
        };

        // Return promise for async operations
        return new Promise(function(resolve) {
            var promises = [];

            // Get IP address if enabled
            if (options.includeIP !== false) {
                promises.push(
                    getIPAddress()
                        .then(function(ip) { metadata.ipAddress = ip; })
                        .catch(function() { metadata.ipAddress = null; })
                );
            }

            // Get geolocation if enabled
            if (options.includeGeolocation) {
                promises.push(
                    getGeolocation()
                        .then(function(geo) { metadata.geolocation = geo; })
                        .catch(function() { metadata.geolocation = null; })
                );
            }

            // Wait for all async operations
            Promise.all(promises).then(function() {
                resolve(metadata);
            });
        });
    }

    /**
     * Get public IP address
     */
    function getIPAddress() {
        return new Promise(function(resolve, reject) {
            // Try multiple IP services
            var services = [
                'https://api.ipify.org?format=json',
                'https://api.ip.sb/jsonip',
                'https://api.myip.com'
            ];

            var attempts = 0;

            function tryService(index) {
                if (index >= services.length) {
                    reject(new Error('Could not get IP address'));
                    return;
                }

                fetch(services[index], { timeout: 5000 })
                    .then(function(response) { return response.json(); })
                    .then(function(data) {
                        resolve(data.ip || data.origin || 'unknown');
                    })
                    .catch(function() {
                        tryService(index + 1);
                    });
            }

            tryService(0);
        });
    }

    /**
     * Get geolocation
     */
    function getGeolocation() {
        return new Promise(function(resolve, reject) {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    });
                },
                function(error) {
                    reject(error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }

    // ========================================
    // Signature Record
    // ========================================

    /**
     * Create a complete signature record with hash and metadata
     * @param {string} regionId - Region ID
     * @param {string} signatureData - Base64 signature data
     * @param {object} options - Options
     * @returns {Promise<object>} - Signature record
     */
    function createSignatureRecord(regionId, signatureData, options) {
        options = options || {};

        return new Promise(function(resolve, reject) {
            if (!signatureData) {
                reject(new Error('No signature data provided'));
                return;
            }

            var record = {
                regionId: regionId,
                signatureData: options.includeData !== false ? signatureData : null,
                dataSize: signatureData.length,
                createdAt: getTimestamp()
            };

            // Generate hash and collect metadata in parallel
            Promise.all([
                generateHash(signatureData),
                collectMetadata(options)
            ]).then(function(results) {
                record.hash = results[0];
                record.hashAlgorithm = HASH_ALGORITHM;
                record.metadata = results[1];
                record.status = STATUS.VALID;
                record.verified = true;
                record.verifiedAt = null;

                // Store in instance
                if (!instances[regionId]) {
                    instances[regionId] = {};
                }
                instances[regionId].currentRecord = record;

                // Add to audit log
                addToAuditLog(regionId, 'signature_created', record);

                // Trigger event
                triggerEvent(regionId, 'verification-record-created', { record: record });

                resolve(record);
            }).catch(reject);
        });
    }

    // ========================================
    // Verification Functions
    // ========================================

    /**
     * Verify signature integrity by comparing hash
     * @param {string} signatureData - Current signature data
     * @param {string} expectedHash - Expected hash value
     * @returns {Promise<object>} - Verification result
     */
    function verifyHash(signatureData, expectedHash) {
        return new Promise(function(resolve, reject) {
            if (!signatureData || !expectedHash) {
                resolve({
                    valid: false,
                    status: STATUS.INVALID,
                    message: 'Missing signature data or expected hash',
                    timestamp: getTimestamp()
                });
                return;
            }

            generateHash(signatureData)
                .then(function(currentHash) {
                    var isValid = currentHash === expectedHash;

                    resolve({
                        valid: isValid,
                        status: isValid ? STATUS.VALID : STATUS.TAMPERED,
                        currentHash: currentHash,
                        expectedHash: expectedHash,
                        message: isValid ? 'Signature integrity verified' : 'Signature has been tampered with',
                        timestamp: getTimestamp()
                    });
                })
                .catch(function(err) {
                    resolve({
                        valid: false,
                        status: STATUS.UNKNOWN,
                        message: 'Verification error: ' + err.message,
                        timestamp: getTimestamp()
                    });
                });
        });
    }

    /**
     * Verify a complete signature record
     * @param {object} record - Signature record to verify
     * @param {string} signatureData - Current signature data
     * @returns {Promise<object>} - Verification result
     */
    function verifyRecord(record, signatureData) {
        return new Promise(function(resolve) {
            if (!record || !record.hash) {
                resolve({
                    valid: false,
                    status: STATUS.INVALID,
                    message: 'Invalid record format',
                    timestamp: getTimestamp()
                });
                return;
            }

            var result = {
                recordId: record.metadata ? record.metadata.id : null,
                checks: [],
                timestamp: getTimestamp()
            };

            // Hash verification
            verifyHash(signatureData, record.hash)
                .then(function(hashResult) {
                    result.checks.push({
                        type: 'hash_integrity',
                        passed: hashResult.valid,
                        details: hashResult
                    });

                    // Metadata verification
                    if (record.metadata) {
                        var metadataValid = record.metadata.id && record.metadata.timestamp;
                        result.checks.push({
                            type: 'metadata_present',
                            passed: metadataValid,
                            details: {
                                hasId: !!record.metadata.id,
                                hasTimestamp: !!record.metadata.timestamp,
                                hasUserAgent: !!record.metadata.userAgent
                            }
                        });
                    }

                    // Calculate overall result
                    var allPassed = result.checks.every(function(check) {
                        return check.passed;
                    });

                    result.valid = allPassed;
                    result.status = allPassed ? STATUS.VALID : STATUS.TAMPERED;
                    result.message = allPassed
                        ? 'All verification checks passed'
                        : 'One or more verification checks failed';

                    resolve(result);
                });
        });
    }

    /**
     * Compare two signatures for similarity
     * @param {string} signature1 - First signature (base64)
     * @param {string} signature2 - Second signature (base64)
     * @returns {Promise<object>} - Comparison result
     */
    function compareSignatures(signature1, signature2) {
        return new Promise(function(resolve, reject) {
            if (!signature1 || !signature2) {
                reject(new Error('Two signatures required for comparison'));
                return;
            }

            Promise.all([
                generateHash(signature1),
                generateHash(signature2)
            ]).then(function(hashes) {
                var exactMatch = hashes[0] === hashes[1];

                // Visual comparison using canvas
                compareVisually(signature1, signature2)
                    .then(function(similarity) {
                        resolve({
                            exactMatch: exactMatch,
                            hash1: hashes[0],
                            hash2: hashes[1],
                            visualSimilarity: similarity,
                            similarityPercent: Math.round(similarity * 100),
                            timestamp: getTimestamp()
                        });
                    })
                    .catch(function() {
                        resolve({
                            exactMatch: exactMatch,
                            hash1: hashes[0],
                            hash2: hashes[1],
                            visualSimilarity: exactMatch ? 1 : 0,
                            similarityPercent: exactMatch ? 100 : 0,
                            timestamp: getTimestamp()
                        });
                    });
            }).catch(reject);
        });
    }

    /**
     * Compare two images visually
     */
    function compareVisually(image1, image2) {
        return new Promise(function(resolve, reject) {
            var canvas1 = document.createElement('canvas');
            var canvas2 = document.createElement('canvas');
            var ctx1 = canvas1.getContext('2d');
            var ctx2 = canvas2.getContext('2d');

            var img1 = new Image();
            var img2 = new Image();

            var loaded = 0;

            function checkComparison() {
                loaded++;
                if (loaded < 2) return;

                // Normalize sizes
                var width = 100;
                var height = 50;
                canvas1.width = canvas2.width = width;
                canvas1.height = canvas2.height = height;

                ctx1.drawImage(img1, 0, 0, width, height);
                ctx2.drawImage(img2, 0, 0, width, height);

                var data1 = ctx1.getImageData(0, 0, width, height).data;
                var data2 = ctx2.getImageData(0, 0, width, height).data;

                var matches = 0;
                var total = data1.length / 4; // RGBA pixels

                for (var i = 0; i < data1.length; i += 4) {
                    // Compare alpha channel (signature vs background)
                    var alpha1 = data1[i + 3] > 128 ? 1 : 0;
                    var alpha2 = data2[i + 3] > 128 ? 1 : 0;
                    if (alpha1 === alpha2) matches++;
                }

                resolve(matches / total);
            }

            img1.onload = checkComparison;
            img2.onload = checkComparison;
            img1.onerror = reject;
            img2.onerror = reject;

            img1.src = image1;
            img2.src = image2;
        });
    }

    // ========================================
    // Audit Log
    // ========================================

    /**
     * Add entry to audit log
     */
    function addToAuditLog(regionId, action, data) {
        if (!auditLogs[regionId]) {
            auditLogs[regionId] = [];
        }

        var entry = {
            id: generateUUID(),
            timestamp: getTimestamp(),
            action: action,
            data: data
        };

        auditLogs[regionId].push(entry);

        // Persist to localStorage
        saveAuditLog(regionId);

        return entry;
    }

    /**
     * Save audit log to localStorage
     */
    function saveAuditLog(regionId) {
        try {
            var key = getStorageKey(regionId);
            var log = auditLogs[regionId] || [];
            // Keep only last 100 entries
            if (log.length > 100) {
                log = log.slice(-100);
                auditLogs[regionId] = log;
            }
            localStorage.setItem(key, JSON.stringify(log));
        } catch (e) {
            console.warn('Failed to save audit log:', e);
        }
    }

    /**
     * Load audit log from localStorage
     */
    function loadAuditLog(regionId) {
        try {
            var key = getStorageKey(regionId);
            var data = localStorage.getItem(key);
            if (data) {
                auditLogs[regionId] = JSON.parse(data);
            }
        } catch (e) {
            console.warn('Failed to load audit log:', e);
            auditLogs[regionId] = [];
        }
    }

    /**
     * Get audit log for region
     */
    function getAuditLog(regionId, options) {
        options = options || {};
        loadAuditLog(regionId);

        var log = auditLogs[regionId] || [];

        // Filter by action if specified
        if (options.action) {
            log = log.filter(function(entry) {
                return entry.action === options.action;
            });
        }

        // Filter by date range
        if (options.from) {
            var fromDate = new Date(options.from).getTime();
            log = log.filter(function(entry) {
                return new Date(entry.timestamp).getTime() >= fromDate;
            });
        }

        if (options.to) {
            var toDate = new Date(options.to).getTime();
            log = log.filter(function(entry) {
                return new Date(entry.timestamp).getTime() <= toDate;
            });
        }

        // Limit results
        if (options.limit) {
            log = log.slice(-options.limit);
        }

        return log;
    }

    /**
     * Clear audit log
     */
    function clearAuditLog(regionId) {
        auditLogs[regionId] = [];
        try {
            var key = getStorageKey(regionId);
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Failed to clear audit log:', e);
        }

        addToAuditLog(regionId, 'audit_log_cleared', { clearedAt: getTimestamp() });
    }

    // ========================================
    // Verification Badge UI
    // ========================================

    /**
     * Create verification badge element
     */
    function createVerificationBadge(status, options) {
        options = options || {};

        var badge = document.createElement('div');
        badge.className = 'apex-sig-verification-badge apex-sig-verification-badge--' + status;

        var icon = '';
        var text = '';

        switch (status) {
            case STATUS.VALID:
                icon = '<svg class="apex-sig-verification-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>';
                text = options.validText || 'Verified';
                break;
            case STATUS.INVALID:
                icon = '<svg class="apex-sig-verification-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>';
                text = options.invalidText || 'Invalid';
                break;
            case STATUS.TAMPERED:
                icon = '<svg class="apex-sig-verification-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
                text = options.tamperedText || 'Tampered';
                break;
            case STATUS.PENDING:
                icon = '<svg class="apex-sig-verification-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
                text = options.pendingText || 'Pending';
                break;
            default:
                icon = '<svg class="apex-sig-verification-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
                text = options.unknownText || 'Unknown';
        }

        badge.innerHTML = icon + '<span class="apex-sig-verification-text">' + text + '</span>';

        if (options.showTimestamp) {
            var timestamp = document.createElement('span');
            timestamp.className = 'apex-sig-verification-timestamp';
            timestamp.textContent = new Date().toLocaleString();
            badge.appendChild(timestamp);
        }

        return badge;
    }

    /**
     * Show verification result in UI
     */
    function showVerificationResult(regionId, result, options) {
        options = options || {};

        var container = document.getElementById(regionId);
        if (!container) return;

        // Remove existing badge
        var existingBadge = container.querySelector('.apex-sig-verification-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        // Create new badge
        var badge = createVerificationBadge(result.status, options);

        // Position
        var position = options.position || 'top-right';
        badge.classList.add('apex-sig-verification-badge--' + position);

        // Add to container
        var wrapper = container.querySelector('.apex-sig-wrapper') || container;
        wrapper.style.position = 'relative';
        wrapper.appendChild(badge);

        // Auto-hide if specified
        if (options.autoHide) {
            setTimeout(function() {
                badge.classList.add('apex-sig-verification-badge--hiding');
                setTimeout(function() {
                    badge.remove();
                }, 300);
            }, options.autoHide);
        }

        // Log verification
        addToAuditLog(regionId, 'verification_displayed', {
            status: result.status,
            result: result
        });

        return badge;
    }

    // ========================================
    // Certificate Preparation (Future)
    // ========================================

    /**
     * Prepare signature for digital certificate
     * Note: This is a placeholder for future certificate integration
     */
    function prepareCertificateData(record) {
        return {
            version: VERSION,
            signatureHash: record.hash,
            hashAlgorithm: record.hashAlgorithm,
            timestamp: record.metadata.timestamp,
            timestampUnix: record.metadata.timestampUnix,
            signer: {
                username: record.metadata.apexUsername,
                sessionId: record.metadata.apexSessionId,
                ipAddress: record.metadata.ipAddress,
                userAgent: record.metadata.userAgent
            },
            application: {
                appId: record.metadata.apexAppId,
                pageId: record.metadata.apexPageId
            },
            // Placeholder for certificate fields
            certificate: {
                issuer: null,
                serialNumber: null,
                validFrom: null,
                validTo: null,
                signature: null
            },
            _ready: false,
            _message: 'Certificate integration not yet implemented'
        };
    }

    // ========================================
    // Export Functions
    // ========================================

    /**
     * Export verification record as JSON
     */
    function exportRecord(record) {
        if (!record) return null;

        return JSON.stringify(record, null, 2);
    }

    /**
     * Export audit log as JSON
     */
    function exportAuditLog(regionId) {
        var log = getAuditLog(regionId);
        return JSON.stringify(log, null, 2);
    }

    /**
     * Import verification record
     */
    function importRecord(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error('Failed to import record:', e);
            return null;
        }
    }

    // ========================================
    // Event Handling
    // ========================================

    /**
     * Trigger custom event
     */
    function triggerEvent(regionId, eventName, data) {
        var container = document.getElementById(regionId);
        if (!container) return;

        var fullEventName = 'apexsignature-' + eventName;

        // Use APEX event if available
        if (typeof apex !== 'undefined' && apex.event && apex.event.trigger) {
            apex.event.trigger(container, fullEventName, data);
        } else {
            // Fallback to native event
            var event = new CustomEvent(fullEventName, { detail: data });
            container.dispatchEvent(event);
        }
    }

    // ========================================
    // Initialization
    // ========================================

    /**
     * Initialize verification for a signature region
     * @param {string} regionId - Region ID
     * @param {object} options - Configuration options
     */
    function init(regionId, options) {
        options = options || {};

        instances[regionId] = {
            options: options,
            currentRecord: null,
            initialized: true
        };

        // Load existing audit log
        loadAuditLog(regionId);

        // Add initialization entry
        addToAuditLog(regionId, 'verification_initialized', {
            options: options,
            version: VERSION
        });

        // Listen for signature changes
        var container = document.getElementById(regionId);
        if (container) {
            container.addEventListener('apexsignature-change', function(e) {
                if (options.autoVerify) {
                    // Re-verify on change
                    addToAuditLog(regionId, 'signature_modified', {
                        timestamp: getTimestamp()
                    });
                }
            });

            container.addEventListener('apexsignature-clear', function(e) {
                addToAuditLog(regionId, 'signature_cleared', {
                    timestamp: getTimestamp()
                });
                instances[regionId].currentRecord = null;
            });
        }

        triggerEvent(regionId, 'verification-initialized', { regionId: regionId });

        return instances[regionId];
    }

    // ========================================
    // Public API
    // ========================================

    return {
        VERSION: VERSION,
        STATUS: STATUS,
        VERIFICATION_TYPES: VERIFICATION_TYPES,

        // Initialization
        init: init,

        // Hash functions
        generateHash: generateHash,
        generateCanvasHash: generateCanvasHash,

        // Metadata
        collectMetadata: collectMetadata,

        // Record management
        createSignatureRecord: createSignatureRecord,
        exportRecord: exportRecord,
        importRecord: importRecord,

        // Verification
        verifyHash: verifyHash,
        verifyRecord: verifyRecord,
        compareSignatures: compareSignatures,

        // Audit log
        getAuditLog: getAuditLog,
        clearAuditLog: clearAuditLog,
        exportAuditLog: exportAuditLog,

        // UI
        createVerificationBadge: createVerificationBadge,
        showVerificationResult: showVerificationResult,

        // Certificate (future)
        prepareCertificateData: prepareCertificateData,

        // Instance access
        getInstance: function(regionId) {
            return instances[regionId];
        },

        getCurrentRecord: function(regionId) {
            return instances[regionId] ? instances[regionId].currentRecord : null;
        }
    };

})();

// AMD/CommonJS support
if (typeof define === 'function' && define.amd) {
    define([], function() { return apexSignatureVerification; });
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = apexSignatureVerification;
}
