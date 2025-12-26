/**
 * APEX Signature - Export Formats Module
 * Version: 3.8.0
 *
 * Provides multiple export formats and options for signature data.
 *
 * Features:
 * - Export as PNG (with transparency or white background)
 * - Export as JPEG (with quality control)
 * - Export as SVG (vector format)
 * - Export as PDF (single page document)
 * - Export as Base64 data URL
 * - Configurable resolution and dimensions
 * - Batch export multiple signatures
 * - Download or return data
 *
 * Dependencies:
 * - apexsignature.js (base module)
 * - jsPDF (optional, for PDF export)
 *
 * @author Maxwell da Silva Oliveira
 * @company M&S do Brasil LTDA
 * @linkedin /maxwbh
 * @license MIT
 */

var apexSignatureExport = (function() {
    'use strict';

    // ========================================
    // Constants
    // ========================================

    var VERSION = '3.8.0';

    var FORMATS = {
        PNG: 'png',
        JPEG: 'jpeg',
        SVG: 'svg',
        PDF: 'pdf',
        WEBP: 'webp',
        BASE64: 'base64'
    };

    var MIME_TYPES = {
        png: 'image/png',
        jpeg: 'image/jpeg',
        svg: 'image/svg+xml',
        pdf: 'application/pdf',
        webp: 'image/webp'
    };

    var DEFAULT_OPTIONS = {
        format: FORMATS.PNG,
        quality: 0.92,
        backgroundColor: '#ffffff',
        transparentBackground: false,
        width: null,    // null = original size
        height: null,
        scale: 1,
        filename: 'signature',
        includeTimestamp: false,
        includeBorder: false,
        borderColor: '#000000',
        borderWidth: 1,
        padding: 0,
        trim: false     // Remove whitespace around signature
    };

    // ========================================
    // State
    // ========================================

    var instances = {};

    // ========================================
    // Utility Functions
    // ========================================

    /**
     * Generate filename with optional timestamp
     */
    function generateFilename(baseName, format, includeTimestamp) {
        var name = baseName || 'signature';
        if (includeTimestamp) {
            var now = new Date();
            var timestamp = now.getFullYear() +
                String(now.getMonth() + 1).padStart(2, '0') +
                String(now.getDate()).padStart(2, '0') + '_' +
                String(now.getHours()).padStart(2, '0') +
                String(now.getMinutes()).padStart(2, '0') +
                String(now.getSeconds()).padStart(2, '0');
            name += '_' + timestamp;
        }
        return name + '.' + format;
    }

    /**
     * Convert data URL to Blob
     */
    function dataURLToBlob(dataURL) {
        var parts = dataURL.split(',');
        var mime = parts[0].match(/:(.*?);/)[1];
        var bstr = atob(parts[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    /**
     * Download blob as file
     */
    function downloadBlob(blob, filename) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Download data URL as file
     */
    function downloadDataURL(dataURL, filename) {
        var blob = dataURLToBlob(dataURL);
        downloadBlob(blob, filename);
    }

    /**
     * Get bounding box of signature (non-transparent pixels)
     */
    function getSignatureBounds(canvas) {
        var ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;

        var minX = canvas.width;
        var minY = canvas.height;
        var maxX = 0;
        var maxY = 0;

        for (var y = 0; y < canvas.height; y++) {
            for (var x = 0; x < canvas.width; x++) {
                var alpha = data[(y * canvas.width + x) * 4 + 3];
                if (alpha > 0) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        // Add some padding
        var padding = 10;
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(canvas.width, maxX + padding);
        maxY = Math.min(canvas.height, maxY + padding);

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    /**
     * Create canvas with applied options
     */
    function createExportCanvas(sourceCanvas, options) {
        var bounds = options.trim ? getSignatureBounds(sourceCanvas) : {
            x: 0,
            y: 0,
            width: sourceCanvas.width,
            height: sourceCanvas.height
        };

        // Calculate dimensions
        var targetWidth = options.width || (bounds.width * options.scale);
        var targetHeight = options.height || (bounds.height * options.scale);

        // Add padding
        targetWidth += options.padding * 2;
        targetHeight += options.padding * 2;

        // Create export canvas
        var exportCanvas = document.createElement('canvas');
        exportCanvas.width = targetWidth;
        exportCanvas.height = targetHeight;

        var ctx = exportCanvas.getContext('2d');

        // Fill background
        if (!options.transparentBackground) {
            ctx.fillStyle = options.backgroundColor;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        // Draw border if enabled
        if (options.includeBorder) {
            ctx.strokeStyle = options.borderColor;
            ctx.lineWidth = options.borderWidth;
            ctx.strokeRect(
                options.borderWidth / 2,
                options.borderWidth / 2,
                targetWidth - options.borderWidth,
                targetHeight - options.borderWidth
            );
        }

        // Draw signature
        var drawX = options.padding + (options.includeBorder ? options.borderWidth : 0);
        var drawY = options.padding + (options.includeBorder ? options.borderWidth : 0);
        var drawWidth = targetWidth - (options.padding * 2) - (options.includeBorder ? options.borderWidth * 2 : 0);
        var drawHeight = targetHeight - (options.padding * 2) - (options.includeBorder ? options.borderWidth * 2 : 0);

        ctx.drawImage(
            sourceCanvas,
            bounds.x, bounds.y, bounds.width, bounds.height,
            drawX, drawY, drawWidth, drawHeight
        );

        return exportCanvas;
    }

    // ========================================
    // Export Functions
    // ========================================

    /**
     * Export signature as PNG
     */
    function exportPNG(regionId, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options, { format: FORMATS.PNG });

        return new Promise(function(resolve, reject) {
            try {
                var canvas = getSignatureCanvas(regionId);
                if (!canvas) {
                    reject(new Error('Canvas not found'));
                    return;
                }

                var exportCanvas = createExportCanvas(canvas, options);
                var dataURL = exportCanvas.toDataURL('image/png');

                var result = {
                    format: FORMATS.PNG,
                    mimeType: MIME_TYPES.png,
                    dataURL: dataURL,
                    width: exportCanvas.width,
                    height: exportCanvas.height,
                    size: dataURL.length
                };

                if (options.download !== false) {
                    var filename = generateFilename(options.filename, 'png', options.includeTimestamp);
                    downloadDataURL(dataURL, filename);
                    result.filename = filename;
                }

                triggerEvent(regionId, 'exported', result);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Export signature as JPEG
     */
    function exportJPEG(regionId, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options, {
            format: FORMATS.JPEG,
            transparentBackground: false // JPEG doesn't support transparency
        });

        return new Promise(function(resolve, reject) {
            try {
                var canvas = getSignatureCanvas(regionId);
                if (!canvas) {
                    reject(new Error('Canvas not found'));
                    return;
                }

                var exportCanvas = createExportCanvas(canvas, options);
                var dataURL = exportCanvas.toDataURL('image/jpeg', options.quality);

                var result = {
                    format: FORMATS.JPEG,
                    mimeType: MIME_TYPES.jpeg,
                    dataURL: dataURL,
                    width: exportCanvas.width,
                    height: exportCanvas.height,
                    quality: options.quality,
                    size: dataURL.length
                };

                if (options.download !== false) {
                    var filename = generateFilename(options.filename, 'jpg', options.includeTimestamp);
                    downloadDataURL(dataURL, filename);
                    result.filename = filename;
                }

                triggerEvent(regionId, 'exported', result);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Export signature as WebP
     */
    function exportWebP(regionId, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options, { format: FORMATS.WEBP });

        return new Promise(function(resolve, reject) {
            try {
                var canvas = getSignatureCanvas(regionId);
                if (!canvas) {
                    reject(new Error('Canvas not found'));
                    return;
                }

                var exportCanvas = createExportCanvas(canvas, options);
                var dataURL = exportCanvas.toDataURL('image/webp', options.quality);

                var result = {
                    format: FORMATS.WEBP,
                    mimeType: MIME_TYPES.webp,
                    dataURL: dataURL,
                    width: exportCanvas.width,
                    height: exportCanvas.height,
                    quality: options.quality,
                    size: dataURL.length
                };

                if (options.download !== false) {
                    var filename = generateFilename(options.filename, 'webp', options.includeTimestamp);
                    downloadDataURL(dataURL, filename);
                    result.filename = filename;
                }

                triggerEvent(regionId, 'exported', result);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Export signature as SVG
     */
    function exportSVG(regionId, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options, { format: FORMATS.SVG });

        return new Promise(function(resolve, reject) {
            try {
                var canvas = getSignatureCanvas(regionId);
                if (!canvas) {
                    reject(new Error('Canvas not found'));
                    return;
                }

                // Get signature pad data if available
                var signaturePad = getSignaturePad(regionId);
                var svgContent;

                if (signaturePad && typeof signaturePad.toSVG === 'function') {
                    // Use native SVG export from signature_pad
                    svgContent = signaturePad.toSVG({
                        includeBackgroundColor: !options.transparentBackground
                    });
                } else {
                    // Fallback: embed canvas as image in SVG
                    var exportCanvas = createExportCanvas(canvas, options);
                    var dataURL = exportCanvas.toDataURL('image/png');

                    svgContent = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                        '<svg xmlns="http://www.w3.org/2000/svg" ' +
                        'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
                        'width="' + exportCanvas.width + '" ' +
                        'height="' + exportCanvas.height + '">\n';

                    if (!options.transparentBackground) {
                        svgContent += '  <rect width="100%" height="100%" fill="' + options.backgroundColor + '"/>\n';
                    }

                    svgContent += '  <image width="' + exportCanvas.width + '" ' +
                        'height="' + exportCanvas.height + '" ' +
                        'xlink:href="' + dataURL + '"/>\n' +
                        '</svg>';
                }

                var blob = new Blob([svgContent], { type: MIME_TYPES.svg });
                var dataURL = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)));

                var result = {
                    format: FORMATS.SVG,
                    mimeType: MIME_TYPES.svg,
                    dataURL: dataURL,
                    svgContent: svgContent,
                    width: canvas.width,
                    height: canvas.height,
                    size: svgContent.length
                };

                if (options.download !== false) {
                    var filename = generateFilename(options.filename, 'svg', options.includeTimestamp);
                    downloadBlob(blob, filename);
                    result.filename = filename;
                }

                triggerEvent(regionId, 'exported', result);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Export signature as PDF
     */
    function exportPDF(regionId, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options, { format: FORMATS.PDF });

        // PDF specific options
        var pdfOptions = {
            title: options.pdfTitle || 'Signature',
            orientation: options.pdfOrientation || 'landscape',
            pageSize: options.pdfPageSize || 'a4',
            marginTop: options.pdfMarginTop || 20,
            marginLeft: options.pdfMarginLeft || 20,
            includeDate: options.pdfIncludeDate !== false,
            includeTitle: options.pdfIncludeTitle !== false
        };

        return new Promise(function(resolve, reject) {
            try {
                var canvas = getSignatureCanvas(regionId);
                if (!canvas) {
                    reject(new Error('Canvas not found'));
                    return;
                }

                // Check for jsPDF
                if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
                    // Try to load jsPDF dynamically or use fallback
                    exportPDFFallback(regionId, canvas, options, pdfOptions, resolve, reject);
                    return;
                }

                var jsPDFLib = typeof jspdf !== 'undefined' ? jspdf.jsPDF : jsPDF;

                var exportCanvas = createExportCanvas(canvas, options);
                var imgData = exportCanvas.toDataURL('image/png');

                // Create PDF
                var pdf = new jsPDFLib({
                    orientation: pdfOptions.orientation,
                    unit: 'mm',
                    format: pdfOptions.pageSize
                });

                var pageWidth = pdf.internal.pageSize.getWidth();
                var pageHeight = pdf.internal.pageSize.getHeight();

                // Calculate signature dimensions
                var maxWidth = pageWidth - (pdfOptions.marginLeft * 2);
                var maxHeight = pageHeight - (pdfOptions.marginTop * 2) - 30; // Space for text

                var imgWidth = exportCanvas.width;
                var imgHeight = exportCanvas.height;
                var ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);

                var finalWidth = imgWidth * ratio;
                var finalHeight = imgHeight * ratio;

                var x = (pageWidth - finalWidth) / 2;
                var y = pdfOptions.marginTop;

                // Add title
                if (pdfOptions.includeTitle) {
                    pdf.setFontSize(16);
                    pdf.text(pdfOptions.title, pageWidth / 2, y, { align: 'center' });
                    y += 10;
                }

                // Add signature image
                pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

                // Add date
                if (pdfOptions.includeDate) {
                    y += finalHeight + 10;
                    pdf.setFontSize(10);
                    pdf.text('Data: ' + new Date().toLocaleString(), pdfOptions.marginLeft, y);
                }

                // Generate output
                var pdfBlob = pdf.output('blob');
                var pdfDataURL = pdf.output('dataurlstring');

                var result = {
                    format: FORMATS.PDF,
                    mimeType: MIME_TYPES.pdf,
                    dataURL: pdfDataURL,
                    blob: pdfBlob,
                    width: exportCanvas.width,
                    height: exportCanvas.height,
                    pageSize: pdfOptions.pageSize,
                    orientation: pdfOptions.orientation
                };

                if (options.download !== false) {
                    var filename = generateFilename(options.filename, 'pdf', options.includeTimestamp);
                    downloadBlob(pdfBlob, filename);
                    result.filename = filename;
                }

                triggerEvent(regionId, 'exported', result);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Fallback PDF export using print dialog
     */
    function exportPDFFallback(regionId, canvas, options, pdfOptions, resolve, reject) {
        try {
            var exportCanvas = createExportCanvas(canvas, options);
            var imgData = exportCanvas.toDataURL('image/png');

            // Create print-friendly HTML
            var printContent = '<!DOCTYPE html>' +
                '<html><head>' +
                '<title>' + pdfOptions.title + '</title>' +
                '<style>' +
                'body { margin: 0; padding: 20px; text-align: center; font-family: Arial, sans-serif; }' +
                'h1 { font-size: 18px; margin-bottom: 20px; }' +
                'img { max-width: 100%; height: auto; border: 1px solid #ddd; }' +
                '.date { margin-top: 20px; font-size: 12px; color: #666; }' +
                '@media print { body { padding: 0; } }' +
                '</style></head><body>';

            if (pdfOptions.includeTitle) {
                printContent += '<h1>' + pdfOptions.title + '</h1>';
            }

            printContent += '<img src="' + imgData + '" alt="Signature">';

            if (pdfOptions.includeDate) {
                printContent += '<p class="date">Data: ' + new Date().toLocaleString() + '</p>';
            }

            printContent += '</body></html>';

            // Open print dialog
            var printWindow = window.open('', '_blank', 'width=800,height=600');
            if (printWindow) {
                printWindow.document.write(printContent);
                printWindow.document.close();
                printWindow.focus();

                setTimeout(function() {
                    printWindow.print();
                }, 500);

                resolve({
                    format: FORMATS.PDF,
                    method: 'print-dialog',
                    message: 'Use "Save as PDF" in print dialog'
                });
            } else {
                reject(new Error('Could not open print window. Please allow popups.'));
            }
        } catch (e) {
            reject(e);
        }
    }

    /**
     * Export as Base64 data URL (no download)
     */
    function exportBase64(regionId, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options, {
            format: options.outputFormat || FORMATS.PNG,
            download: false
        });

        return new Promise(function(resolve, reject) {
            try {
                var canvas = getSignatureCanvas(regionId);
                if (!canvas) {
                    reject(new Error('Canvas not found'));
                    return;
                }

                var exportCanvas = createExportCanvas(canvas, options);
                var mimeType = MIME_TYPES[options.format] || MIME_TYPES.png;
                var dataURL = exportCanvas.toDataURL(mimeType, options.quality);

                // Extract just the base64 part if requested
                var base64Only = options.base64Only ?
                    dataURL.replace(/^data:image\/\w+;base64,/, '') :
                    dataURL;

                var result = {
                    format: FORMATS.BASE64,
                    outputFormat: options.format,
                    mimeType: mimeType,
                    dataURL: dataURL,
                    base64: base64Only,
                    width: exportCanvas.width,
                    height: exportCanvas.height,
                    size: base64Only.length
                };

                triggerEvent(regionId, 'exported', result);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    }

    // ========================================
    // Batch Export
    // ========================================

    /**
     * Export multiple signatures at once
     */
    function exportBatch(regionIds, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options);

        var promises = regionIds.map(function(regionId, index) {
            var regionOptions = Object.assign({}, options, {
                filename: options.filename + '_' + (index + 1)
            });

            switch (options.format) {
                case FORMATS.PNG:
                    return exportPNG(regionId, regionOptions);
                case FORMATS.JPEG:
                    return exportJPEG(regionId, regionOptions);
                case FORMATS.SVG:
                    return exportSVG(regionId, regionOptions);
                case FORMATS.PDF:
                    return exportPDF(regionId, regionOptions);
                case FORMATS.WEBP:
                    return exportWebP(regionId, regionOptions);
                default:
                    return exportPNG(regionId, regionOptions);
            }
        });

        return Promise.all(promises);
    }

    /**
     * Export all formats for a single signature
     */
    function exportAllFormats(regionId, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options, { download: false });

        return Promise.all([
            exportPNG(regionId, options),
            exportJPEG(regionId, options),
            exportSVG(regionId, options),
            exportWebP(regionId, options)
        ]).then(function(results) {
            return {
                png: results[0],
                jpeg: results[1],
                svg: results[2],
                webp: results[3]
            };
        });
    }

    // ========================================
    // Helper Functions
    // ========================================

    /**
     * Get canvas element from region
     */
    function getSignatureCanvas(regionId) {
        var container = document.getElementById(regionId);
        if (!container) return null;
        return container.querySelector('canvas');
    }

    /**
     * Get SignaturePad instance
     */
    function getSignaturePad(regionId) {
        if (typeof apexSignature !== 'undefined' && apexSignature.getInstance) {
            var instance = apexSignature.getInstance(regionId);
            return instance ? instance.signaturePad : null;
        }
        return null;
    }

    /**
     * Get export size estimate
     */
    function getExportSizeEstimate(regionId, format, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options, { download: false });

        var canvas = getSignatureCanvas(regionId);
        if (!canvas) return null;

        var exportCanvas = createExportCanvas(canvas, options);
        var dataURL;

        switch (format) {
            case FORMATS.JPEG:
                dataURL = exportCanvas.toDataURL('image/jpeg', options.quality);
                break;
            case FORMATS.WEBP:
                dataURL = exportCanvas.toDataURL('image/webp', options.quality);
                break;
            case FORMATS.PNG:
            default:
                dataURL = exportCanvas.toDataURL('image/png');
        }

        var base64Length = dataURL.replace(/^data:image\/\w+;base64,/, '').length;
        var sizeBytes = Math.ceil(base64Length * 0.75); // Base64 to bytes

        return {
            format: format,
            base64Length: base64Length,
            estimatedBytes: sizeBytes,
            estimatedKB: Math.round(sizeBytes / 1024 * 10) / 10,
            width: exportCanvas.width,
            height: exportCanvas.height
        };
    }

    // ========================================
    // Quick Export Presets
    // ========================================

    var PRESETS = {
        // High quality for printing
        print: {
            format: FORMATS.PNG,
            scale: 2,
            backgroundColor: '#ffffff',
            transparentBackground: false,
            trim: true,
            padding: 20
        },

        // Web optimized
        web: {
            format: FORMATS.PNG,
            scale: 1,
            transparentBackground: true,
            trim: true,
            padding: 5
        },

        // Email attachment (small file)
        email: {
            format: FORMATS.JPEG,
            quality: 0.7,
            scale: 0.75,
            backgroundColor: '#ffffff',
            trim: true
        },

        // Document embedding
        document: {
            format: FORMATS.PNG,
            scale: 1.5,
            backgroundColor: '#ffffff',
            transparentBackground: false,
            includeBorder: true,
            borderColor: '#cccccc',
            borderWidth: 1,
            padding: 10
        },

        // Archive (high quality, small)
        archive: {
            format: FORMATS.WEBP,
            quality: 0.9,
            scale: 1,
            trim: true
        },

        // Vector for scaling
        vector: {
            format: FORMATS.SVG,
            transparentBackground: true
        }
    };

    /**
     * Export using preset
     */
    function exportWithPreset(regionId, presetName, additionalOptions) {
        var preset = PRESETS[presetName];
        if (!preset) {
            return Promise.reject(new Error('Unknown preset: ' + presetName));
        }

        var options = Object.assign({}, preset, additionalOptions);
        return exportSignature(regionId, options);
    }

    /**
     * Generic export function that routes to specific format
     */
    function exportSignature(regionId, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options);

        switch (options.format) {
            case FORMATS.PNG:
                return exportPNG(regionId, options);
            case FORMATS.JPEG:
                return exportJPEG(regionId, options);
            case FORMATS.SVG:
                return exportSVG(regionId, options);
            case FORMATS.PDF:
                return exportPDF(regionId, options);
            case FORMATS.WEBP:
                return exportWebP(regionId, options);
            case FORMATS.BASE64:
                return exportBase64(regionId, options);
            default:
                return exportPNG(regionId, options);
        }
    }

    // ========================================
    // Copy to Clipboard
    // ========================================

    /**
     * Copy signature to clipboard
     */
    function copyToClipboard(regionId, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options);

        return new Promise(function(resolve, reject) {
            try {
                var canvas = getSignatureCanvas(regionId);
                if (!canvas) {
                    reject(new Error('Canvas not found'));
                    return;
                }

                var exportCanvas = createExportCanvas(canvas, options);

                exportCanvas.toBlob(function(blob) {
                    if (!blob) {
                        reject(new Error('Failed to create blob'));
                        return;
                    }

                    if (navigator.clipboard && navigator.clipboard.write) {
                        var clipboardItem = new ClipboardItem({
                            'image/png': blob
                        });

                        navigator.clipboard.write([clipboardItem])
                            .then(function() {
                                triggerEvent(regionId, 'copied', { format: 'png' });
                                resolve({ success: true, format: 'png' });
                            })
                            .catch(reject);
                    } else {
                        reject(new Error('Clipboard API not supported'));
                    }
                }, 'image/png');
            } catch (e) {
                reject(e);
            }
        });
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

        var fullEventName = 'apexsignature-export-' + eventName;

        if (typeof apex !== 'undefined' && apex.event && apex.event.trigger) {
            apex.event.trigger(container, fullEventName, data);
        } else {
            var event = new CustomEvent(fullEventName, { detail: data });
            container.dispatchEvent(event);
        }
    }

    // ========================================
    // UI Components
    // ========================================

    /**
     * Create export button with dropdown menu
     */
    function createExportButton(regionId, options) {
        options = options || {};

        var container = document.createElement('div');
        container.className = 'apex-sig-export-container';

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'apex-sig-export-btn';
        button.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Export';

        var menu = document.createElement('div');
        menu.className = 'apex-sig-export-menu';
        menu.style.display = 'none';

        var formats = [
            { format: FORMATS.PNG, label: 'PNG (Transparent)', icon: '🖼️' },
            { format: FORMATS.JPEG, label: 'JPEG (Compressed)', icon: '📷' },
            { format: FORMATS.SVG, label: 'SVG (Vector)', icon: '📐' },
            { format: FORMATS.PDF, label: 'PDF (Document)', icon: '📄' },
            { format: FORMATS.WEBP, label: 'WebP (Modern)', icon: '🌐' }
        ];

        formats.forEach(function(f) {
            var item = document.createElement('button');
            item.type = 'button';
            item.className = 'apex-sig-export-menu-item';
            item.innerHTML = f.icon + ' ' + f.label;
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                exportSignature(regionId, Object.assign({}, options, { format: f.format }));
                menu.style.display = 'none';
            });
            menu.appendChild(item);
        });

        // Add copy option
        var copyItem = document.createElement('button');
        copyItem.type = 'button';
        copyItem.className = 'apex-sig-export-menu-item apex-sig-export-menu-item--separator';
        copyItem.innerHTML = '📋 Copy to Clipboard';
        copyItem.addEventListener('click', function(e) {
            e.stopPropagation();
            copyToClipboard(regionId, options);
            menu.style.display = 'none';
        });
        menu.appendChild(copyItem);

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', function() {
            menu.style.display = 'none';
        });

        container.appendChild(button);
        container.appendChild(menu);

        return container;
    }

    /**
     * Add export button to signature region
     */
    function addExportButton(regionId, options) {
        var container = document.getElementById(regionId);
        if (!container) return null;

        var button = createExportButton(regionId, options);
        var wrapper = container.querySelector('.apex-sig-wrapper') || container;
        wrapper.appendChild(button);

        return button;
    }

    // ========================================
    // Initialization
    // ========================================

    /**
     * Initialize export module for a region
     */
    function init(regionId, options) {
        options = Object.assign({}, DEFAULT_OPTIONS, options);

        instances[regionId] = {
            options: options,
            initialized: true
        };

        // Add export button if requested
        if (options.showExportButton) {
            addExportButton(regionId, options);
        }

        triggerEvent(regionId, 'initialized', { regionId: regionId });

        return instances[regionId];
    }

    // ========================================
    // Public API
    // ========================================

    return {
        VERSION: VERSION,
        FORMATS: FORMATS,
        MIME_TYPES: MIME_TYPES,
        PRESETS: PRESETS,

        // Initialization
        init: init,

        // Export functions
        export: exportSignature,
        exportPNG: exportPNG,
        exportJPEG: exportJPEG,
        exportSVG: exportSVG,
        exportPDF: exportPDF,
        exportWebP: exportWebP,
        exportBase64: exportBase64,

        // Batch
        exportBatch: exportBatch,
        exportAllFormats: exportAllFormats,

        // Presets
        exportWithPreset: exportWithPreset,

        // Clipboard
        copyToClipboard: copyToClipboard,

        // Utilities
        getExportSizeEstimate: getExportSizeEstimate,
        dataURLToBlob: dataURLToBlob,

        // UI
        createExportButton: createExportButton,
        addExportButton: addExportButton,

        // Instance access
        getInstance: function(regionId) {
            return instances[regionId];
        }
    };

})();

// AMD/CommonJS support
if (typeof define === 'function' && define.amd) {
    define([], function() { return apexSignatureExport; });
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = apexSignatureExport;
}
