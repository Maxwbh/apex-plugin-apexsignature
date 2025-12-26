/**
 * APEX Signature - Mobile Optimization Module
 * Version: 3.7.0
 *
 * Provides enhanced mobile experience for signature capture.
 *
 * Features:
 * - Force landscape orientation for better signing area
 * - Pinch-to-zoom gesture support
 * - Larger touch targets for buttons
 * - Fullscreen signing mode
 * - Apple Pencil / S-Pen pressure sensitivity optimization
 * - Touch gesture recognition (swipe to clear, double-tap to undo)
 * - Viewport optimization
 * - Haptic feedback support
 *
 * Dependencies:
 * - apexsignature.js (base module)
 * - signature_pad.js v5.0.4+
 *
 * @author Maxwell da Silva Oliveira
 * @company M&S do Brasil LTDA
 * @linkedin /maxwbh
 * @license MIT
 */

var apexSignatureMobile = (function() {
    'use strict';

    // ========================================
    // Constants
    // ========================================

    var VERSION = '3.7.0';

    var BREAKPOINTS = {
        MOBILE: 480,
        TABLET: 768,
        DESKTOP: 1024
    };

    var GESTURES = {
        SWIPE_LEFT: 'swipe-left',
        SWIPE_RIGHT: 'swipe-right',
        DOUBLE_TAP: 'double-tap',
        LONG_PRESS: 'long-press',
        PINCH: 'pinch'
    };

    var ORIENTATION = {
        PORTRAIT: 'portrait',
        LANDSCAPE: 'landscape'
    };

    // ========================================
    // State
    // ========================================

    var instances = {};
    var globalState = {
        isMobile: false,
        isTablet: false,
        hasTouch: false,
        hasPressure: false,
        orientation: null,
        viewportScale: 1
    };

    // ========================================
    // Device Detection
    // ========================================

    /**
     * Detect device capabilities
     */
    function detectDevice() {
        var ua = navigator.userAgent.toLowerCase();

        globalState.isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
        globalState.isTablet = /ipad|android(?!.*mobile)/i.test(ua) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        globalState.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        globalState.hasPressure = false; // Will be detected on first touch

        // Detect orientation
        detectOrientation();

        // Listen for orientation changes
        if (window.matchMedia) {
            window.matchMedia('(orientation: portrait)').addEventListener('change', function() {
                detectOrientation();
                Object.keys(instances).forEach(function(regionId) {
                    handleOrientationChange(regionId);
                });
            });
        }

        window.addEventListener('resize', debounce(function() {
            detectOrientation();
            Object.keys(instances).forEach(function(regionId) {
                handleResize(regionId);
            });
        }, 250));

        return globalState;
    }

    /**
     * Detect current orientation
     */
    function detectOrientation() {
        if (window.screen && window.screen.orientation) {
            globalState.orientation = window.screen.orientation.type.includes('portrait')
                ? ORIENTATION.PORTRAIT
                : ORIENTATION.LANDSCAPE;
        } else {
            globalState.orientation = window.innerHeight > window.innerWidth
                ? ORIENTATION.PORTRAIT
                : ORIENTATION.LANDSCAPE;
        }
        return globalState.orientation;
    }

    /**
     * Check if device is iOS
     */
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    /**
     * Check if device is Android
     */
    function isAndroid() {
        return /android/i.test(navigator.userAgent);
    }

    // ========================================
    // Utility Functions
    // ========================================

    /**
     * Debounce function
     */
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    /**
     * Calculate distance between two touch points
     */
    function getTouchDistance(touches) {
        if (touches.length < 2) return 0;
        var dx = touches[0].clientX - touches[1].clientX;
        var dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Get touch center point
     */
    function getTouchCenter(touches) {
        if (touches.length < 2) {
            return { x: touches[0].clientX, y: touches[0].clientY };
        }
        return {
            x: (touches[0].clientX + touches[1].clientX) / 2,
            y: (touches[0].clientY + touches[1].clientY) / 2
        };
    }

    /**
     * Trigger haptic feedback if available
     */
    function triggerHaptic(type) {
        if (navigator.vibrate) {
            switch (type) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(25);
                    break;
                case 'heavy':
                    navigator.vibrate(50);
                    break;
                case 'success':
                    navigator.vibrate([10, 50, 10]);
                    break;
                case 'error':
                    navigator.vibrate([50, 100, 50]);
                    break;
                default:
                    navigator.vibrate(15);
            }
        }
    }

    // ========================================
    // Gesture Recognition
    // ========================================

    /**
     * Setup gesture recognition for a region
     */
    function setupGestureRecognition(regionId, options) {
        var instance = instances[regionId];
        if (!instance) return;

        var container = document.getElementById(regionId);
        if (!container) return;

        var gestureState = {
            startX: 0,
            startY: 0,
            startTime: 0,
            lastTap: 0,
            touchCount: 0,
            initialDistance: 0,
            currentScale: 1,
            isGesture: false
        };

        instance.gestureState = gestureState;

        // Touch start
        container.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                gestureState.startX = e.touches[0].clientX;
                gestureState.startY = e.touches[0].clientY;
                gestureState.startTime = Date.now();
                gestureState.touchCount = 1;
                gestureState.isGesture = false;

                // Detect pressure support
                if (e.touches[0].force > 0) {
                    globalState.hasPressure = true;
                }
            } else if (e.touches.length === 2 && options.enablePinchZoom) {
                gestureState.initialDistance = getTouchDistance(e.touches);
                gestureState.touchCount = 2;
                gestureState.isGesture = true;
                e.preventDefault();
            }
        }, { passive: false });

        // Touch move
        container.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2 && options.enablePinchZoom && gestureState.isGesture) {
                e.preventDefault();
                var currentDistance = getTouchDistance(e.touches);
                var scale = currentDistance / gestureState.initialDistance;

                gestureState.currentScale = Math.min(Math.max(scale, 0.5), 3);

                applyZoom(regionId, gestureState.currentScale);
            }
        }, { passive: false });

        // Touch end
        container.addEventListener('touchend', function(e) {
            if (gestureState.isGesture) {
                gestureState.isGesture = false;
                return;
            }

            var endX = e.changedTouches[0].clientX;
            var endY = e.changedTouches[0].clientY;
            var endTime = Date.now();

            var deltaX = endX - gestureState.startX;
            var deltaY = endY - gestureState.startY;
            var deltaTime = endTime - gestureState.startTime;

            // Detect swipe
            if (Math.abs(deltaX) > 100 && deltaTime < 300 && Math.abs(deltaY) < 50) {
                if (deltaX < 0 && options.swipeLeftToClear) {
                    handleGesture(regionId, GESTURES.SWIPE_LEFT);
                } else if (deltaX > 0 && options.swipeRightToUndo) {
                    handleGesture(regionId, GESTURES.SWIPE_RIGHT);
                }
            }

            // Detect double tap
            if (deltaTime < 200 && Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
                if (endTime - gestureState.lastTap < 300 && options.doubleTapToUndo) {
                    handleGesture(regionId, GESTURES.DOUBLE_TAP);
                }
                gestureState.lastTap = endTime;
            }
        });

        // Long press
        var longPressTimer;
        container.addEventListener('touchstart', function(e) {
            if (options.longPressToFullscreen) {
                longPressTimer = setTimeout(function() {
                    handleGesture(regionId, GESTURES.LONG_PRESS);
                }, 500);
            }
        });

        container.addEventListener('touchend', function() {
            clearTimeout(longPressTimer);
        });

        container.addEventListener('touchmove', function() {
            clearTimeout(longPressTimer);
        });
    }

    /**
     * Handle recognized gesture
     */
    function handleGesture(regionId, gesture) {
        var instance = instances[regionId];
        if (!instance) return;

        triggerHaptic('medium');

        switch (gesture) {
            case GESTURES.SWIPE_LEFT:
                // Clear signature
                if (typeof apexSignature !== 'undefined' && apexSignature.clear) {
                    apexSignature.clear(regionId);
                }
                triggerEvent(regionId, 'gesture-clear', { gesture: gesture });
                break;

            case GESTURES.SWIPE_RIGHT:
            case GESTURES.DOUBLE_TAP:
                // Undo
                if (typeof apexSignatureToolbar !== 'undefined' && apexSignatureToolbar.undo) {
                    apexSignatureToolbar.undo(regionId);
                }
                triggerEvent(regionId, 'gesture-undo', { gesture: gesture });
                break;

            case GESTURES.LONG_PRESS:
                // Toggle fullscreen
                toggleFullscreen(regionId);
                triggerEvent(regionId, 'gesture-fullscreen', { gesture: gesture });
                break;

            case GESTURES.PINCH:
                triggerEvent(regionId, 'gesture-zoom', { gesture: gesture });
                break;
        }
    }

    // ========================================
    // Zoom & Pan
    // ========================================

    /**
     * Apply zoom to signature canvas
     */
    function applyZoom(regionId, scale) {
        var instance = instances[regionId];
        if (!instance) return;

        var canvas = document.querySelector('#' + regionId + ' canvas');
        if (!canvas) return;

        var wrapper = canvas.parentElement;
        wrapper.style.transform = 'scale(' + scale + ')';
        wrapper.style.transformOrigin = 'center center';

        instance.currentScale = scale;
        triggerEvent(regionId, 'zoom-changed', { scale: scale });
    }

    /**
     * Reset zoom
     */
    function resetZoom(regionId) {
        applyZoom(regionId, 1);
        var instance = instances[regionId];
        if (instance && instance.gestureState) {
            instance.gestureState.currentScale = 1;
        }
    }

    // ========================================
    // Fullscreen Mode
    // ========================================

    /**
     * Toggle fullscreen signing mode
     */
    function toggleFullscreen(regionId) {
        var instance = instances[regionId];
        if (!instance) return;

        if (instance.isFullscreen) {
            exitFullscreen(regionId);
        } else {
            enterFullscreen(regionId);
        }
    }

    /**
     * Enter fullscreen mode
     */
    function enterFullscreen(regionId) {
        var instance = instances[regionId];
        if (!instance) return;

        var container = document.getElementById(regionId);
        if (!container) return;

        // Create fullscreen overlay
        var overlay = document.createElement('div');
        overlay.id = regionId + '_fullscreen_overlay';
        overlay.className = 'apex-sig-mobile-fullscreen-overlay';

        // Create fullscreen container
        var fullscreenContainer = document.createElement('div');
        fullscreenContainer.className = 'apex-sig-mobile-fullscreen-container';

        // Header with close button
        var header = document.createElement('div');
        header.className = 'apex-sig-mobile-fullscreen-header';
        header.innerHTML = '<span class="apex-sig-mobile-fullscreen-title">Assine aqui</span>' +
            '<button type="button" class="apex-sig-mobile-fullscreen-close" aria-label="Fechar">' +
            '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>' +
            '</button>';

        // Signature area
        var signatureArea = document.createElement('div');
        signatureArea.className = 'apex-sig-mobile-fullscreen-signature';

        // Clone canvas
        var originalCanvas = container.querySelector('canvas');
        if (originalCanvas) {
            var clonedCanvas = document.createElement('canvas');
            clonedCanvas.width = window.innerWidth - 32;
            clonedCanvas.height = window.innerHeight - 200;
            clonedCanvas.className = 'apex-sig-mobile-fullscreen-canvas';

            signatureArea.appendChild(clonedCanvas);

            // Initialize SignaturePad on cloned canvas
            if (typeof SignaturePad !== 'undefined') {
                instance.fullscreenPad = new SignaturePad(clonedCanvas, {
                    backgroundColor: 'rgb(255, 255, 255)',
                    penColor: 'rgb(0, 0, 0)',
                    minWidth: 0.5,
                    maxWidth: 2.5
                });

                // Copy existing signature
                if (!apexSignature.isEmpty(regionId)) {
                    var dataUrl = originalCanvas.toDataURL();
                    var img = new Image();
                    img.onload = function() {
                        var ctx = clonedCanvas.getContext('2d');
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);
                        ctx.drawImage(img, 0, 0, clonedCanvas.width, clonedCanvas.height);
                        instance.fullscreenPad.fromDataURL(dataUrl);
                    };
                    img.src = dataUrl;
                }
            }
        }

        // Footer with actions
        var footer = document.createElement('div');
        footer.className = 'apex-sig-mobile-fullscreen-footer';
        footer.innerHTML =
            '<button type="button" class="apex-sig-mobile-btn apex-sig-mobile-btn-clear">Limpar</button>' +
            '<button type="button" class="apex-sig-mobile-btn apex-sig-mobile-btn-confirm">Confirmar</button>';

        // Assemble
        fullscreenContainer.appendChild(header);
        fullscreenContainer.appendChild(signatureArea);
        fullscreenContainer.appendChild(footer);
        overlay.appendChild(fullscreenContainer);
        document.body.appendChild(overlay);

        // Event handlers
        header.querySelector('.apex-sig-mobile-fullscreen-close').addEventListener('click', function() {
            exitFullscreen(regionId);
        });

        footer.querySelector('.apex-sig-mobile-btn-clear').addEventListener('click', function() {
            if (instance.fullscreenPad) {
                instance.fullscreenPad.clear();
            }
            triggerHaptic('light');
        });

        footer.querySelector('.apex-sig-mobile-btn-confirm').addEventListener('click', function() {
            confirmFullscreenSignature(regionId);
        });

        // Lock orientation to landscape if option enabled
        if (instance.options.forceLandscape) {
            lockOrientation('landscape');
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        instance.isFullscreen = true;
        instance.fullscreenOverlay = overlay;

        triggerHaptic('success');
        triggerEvent(regionId, 'fullscreen-enter', {});

        // Animate in
        requestAnimationFrame(function() {
            overlay.classList.add('apex-sig-mobile-fullscreen-overlay--visible');
        });
    }

    /**
     * Exit fullscreen mode
     */
    function exitFullscreen(regionId) {
        var instance = instances[regionId];
        if (!instance || !instance.isFullscreen) return;

        var overlay = instance.fullscreenOverlay;
        if (overlay) {
            overlay.classList.remove('apex-sig-mobile-fullscreen-overlay--visible');
            setTimeout(function() {
                overlay.remove();
            }, 300);
        }

        // Unlock orientation
        unlockOrientation();

        // Restore body scroll
        document.body.style.overflow = '';

        instance.isFullscreen = false;
        instance.fullscreenOverlay = null;
        instance.fullscreenPad = null;

        triggerEvent(regionId, 'fullscreen-exit', {});
    }

    /**
     * Confirm and transfer fullscreen signature
     */
    function confirmFullscreenSignature(regionId) {
        var instance = instances[regionId];
        if (!instance || !instance.fullscreenPad) return;

        var container = document.getElementById(regionId);
        var originalCanvas = container.querySelector('canvas');

        if (originalCanvas && !instance.fullscreenPad.isEmpty()) {
            var dataUrl = instance.fullscreenPad.toDataURL();

            // Transfer to original canvas
            if (typeof apexSignature !== 'undefined' && apexSignature.fromDataURL) {
                apexSignature.fromDataURL(regionId, dataUrl);
            } else {
                var img = new Image();
                img.onload = function() {
                    var ctx = originalCanvas.getContext('2d');
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, originalCanvas.width, originalCanvas.height);
                    ctx.drawImage(img, 0, 0, originalCanvas.width, originalCanvas.height);
                };
                img.src = dataUrl;
            }

            triggerHaptic('success');
            triggerEvent(regionId, 'fullscreen-confirmed', { dataUrl: dataUrl });
        }

        exitFullscreen(regionId);
    }

    // ========================================
    // Orientation Lock
    // ========================================

    /**
     * Lock screen orientation
     */
    function lockOrientation(orientation) {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock(orientation + '-primary').catch(function(err) {
                console.warn('Could not lock orientation:', err);
            });
        }
    }

    /**
     * Unlock screen orientation
     */
    function unlockOrientation() {
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }

    /**
     * Request landscape orientation
     */
    function requestLandscape(regionId) {
        var instance = instances[regionId];
        if (!instance) return;

        if (globalState.orientation === ORIENTATION.PORTRAIT) {
            showOrientationPrompt(regionId);
        }
    }

    /**
     * Show orientation prompt
     */
    function showOrientationPrompt(regionId) {
        var instance = instances[regionId];
        if (!instance || instance.orientationPromptShown) return;

        var container = document.getElementById(regionId);
        if (!container) return;

        var prompt = document.createElement('div');
        prompt.className = 'apex-sig-mobile-orientation-prompt';
        prompt.innerHTML =
            '<div class="apex-sig-mobile-orientation-prompt-content">' +
            '<svg class="apex-sig-mobile-orientation-icon" viewBox="0 0 24 24" width="48" height="48">' +
            '<path fill="currentColor" d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zm-6.25-.77c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75zm4.6 19.44L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-7.31.29l-3.82-3.82 1.33-1.32c-3.27-1.55-5.61-4.72-5.97-8.48h-1.5C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z"/>' +
            '</svg>' +
            '<p>Gire o dispositivo para melhor experiência</p>' +
            '<button type="button" class="apex-sig-mobile-orientation-dismiss">Continuar assim</button>' +
            '</div>';

        container.appendChild(prompt);

        prompt.querySelector('.apex-sig-mobile-orientation-dismiss').addEventListener('click', function() {
            prompt.classList.add('apex-sig-mobile-orientation-prompt--hiding');
            setTimeout(function() {
                prompt.remove();
            }, 300);
        });

        instance.orientationPromptShown = true;

        // Auto-hide when orientation changes
        var checkOrientation = function() {
            if (globalState.orientation === ORIENTATION.LANDSCAPE) {
                prompt.remove();
                window.removeEventListener('resize', checkOrientation);
            }
        };
        window.addEventListener('resize', checkOrientation);

        // Also hide on first touch
        container.addEventListener('touchstart', function hidePrompt() {
            prompt.classList.add('apex-sig-mobile-orientation-prompt--hiding');
            setTimeout(function() {
                prompt.remove();
            }, 300);
            container.removeEventListener('touchstart', hidePrompt);
        }, { once: true });
    }

    // ========================================
    // Touch Target Optimization
    // ========================================

    /**
     * Enlarge touch targets for mobile
     */
    function optimizeTouchTargets(regionId) {
        var container = document.getElementById(regionId);
        if (!container) return;

        container.classList.add('apex-sig-mobile-touch-optimized');

        // Find all buttons and make them larger
        var buttons = container.querySelectorAll('button, .apex-sig-btn, [role="button"]');
        buttons.forEach(function(btn) {
            btn.classList.add('apex-sig-mobile-touch-target');
        });
    }

    // ========================================
    // Pressure Sensitivity
    // ========================================

    /**
     * Optimize for pressure-sensitive stylus
     */
    function optimizePressureSensitivity(regionId) {
        var instance = instances[regionId];
        if (!instance) return;

        var canvas = document.querySelector('#' + regionId + ' canvas');
        if (!canvas) return;

        // Get SignaturePad instance
        var signaturePad = null;
        if (typeof apexSignature !== 'undefined' && apexSignature.getInstance) {
            var apexInstance = apexSignature.getInstance(regionId);
            signaturePad = apexInstance ? apexInstance.signaturePad : null;
        }

        if (!signaturePad) return;

        // Enable pressure for Apple Pencil / S-Pen
        canvas.addEventListener('pointermove', function(e) {
            if (e.pressure > 0 && e.pressure !== 0.5) {
                globalState.hasPressure = true;

                // Adjust line width based on pressure
                var baseWidth = instance.options.maxWidth || 2.5;
                var minWidth = instance.options.minWidth || 0.5;
                var pressureWidth = minWidth + (baseWidth - minWidth) * e.pressure;

                signaturePad.minWidth = pressureWidth * 0.5;
                signaturePad.maxWidth = pressureWidth;
            }
        });

        // Detect pointer type
        canvas.addEventListener('pointerdown', function(e) {
            instance.lastPointerType = e.pointerType;

            if (e.pointerType === 'pen') {
                // Optimize for stylus
                signaturePad.minWidth = 0.3;
                signaturePad.maxWidth = 3;
                signaturePad.velocityFilterWeight = 0.5;
            } else {
                // Reset for finger
                signaturePad.minWidth = instance.options.minWidth || 0.5;
                signaturePad.maxWidth = instance.options.maxWidth || 2.5;
                signaturePad.velocityFilterWeight = 0.7;
            }
        });
    }

    // ========================================
    // Viewport Optimization
    // ========================================

    /**
     * Prevent viewport zoom on input focus
     */
    function preventViewportZoom() {
        // Set viewport meta to prevent zoom
        var viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            var content = viewport.getAttribute('content');
            if (!content.includes('maximum-scale')) {
                viewport.setAttribute('content', content + ', maximum-scale=1.0, user-scalable=no');
            }
        }
    }

    /**
     * Restore viewport zoom capability
     */
    function restoreViewportZoom() {
        var viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            var content = viewport.getAttribute('content');
            content = content.replace(/, maximum-scale=1\.0, user-scalable=no/g, '');
            viewport.setAttribute('content', content);
        }
    }

    // ========================================
    // Resize Handling
    // ========================================

    /**
     * Handle window resize
     */
    function handleResize(regionId) {
        var instance = instances[regionId];
        if (!instance) return;

        var canvas = document.querySelector('#' + regionId + ' canvas');
        if (!canvas) return;

        // Adjust canvas size for mobile
        if (globalState.isMobile || globalState.isTablet) {
            var container = document.getElementById(regionId);
            var wrapper = container.querySelector('.apex-sig-wrapper') || container;
            var maxWidth = wrapper.clientWidth;

            if (instance.options.responsiveWidth) {
                canvas.style.width = '100%';
                canvas.style.maxWidth = maxWidth + 'px';
            }
        }

        triggerEvent(regionId, 'resize', {
            width: canvas.clientWidth,
            height: canvas.clientHeight,
            orientation: globalState.orientation
        });
    }

    /**
     * Handle orientation change
     */
    function handleOrientationChange(regionId) {
        var instance = instances[regionId];
        if (!instance) return;

        // Update canvas dimensions
        handleResize(regionId);

        // Hide orientation prompt if now landscape
        if (globalState.orientation === ORIENTATION.LANDSCAPE) {
            var prompt = document.querySelector('#' + regionId + ' .apex-sig-mobile-orientation-prompt');
            if (prompt) {
                prompt.remove();
            }
        }

        triggerEvent(regionId, 'orientation-changed', {
            orientation: globalState.orientation
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

        var fullEventName = 'apexsignature-mobile-' + eventName;

        if (typeof apex !== 'undefined' && apex.event && apex.event.trigger) {
            apex.event.trigger(container, fullEventName, data);
        } else {
            var event = new CustomEvent(fullEventName, { detail: data });
            container.dispatchEvent(event);
        }
    }

    // ========================================
    // Initialization
    // ========================================

    /**
     * Initialize mobile optimization for a region
     * @param {string} regionId - Region ID
     * @param {object} options - Configuration options
     */
    function init(regionId, options) {
        options = Object.assign({
            // Gestures
            enablePinchZoom: true,
            swipeLeftToClear: true,
            swipeRightToUndo: false,
            doubleTapToUndo: true,
            longPressToFullscreen: true,

            // Orientation
            forceLandscape: false,
            showOrientationPrompt: true,

            // Touch
            optimizeTouchTargets: true,
            enableHapticFeedback: true,

            // Pressure
            enablePressureSensitivity: true,
            minWidth: 0.5,
            maxWidth: 2.5,

            // Viewport
            preventViewportZoom: true,

            // Responsive
            responsiveWidth: true,

            // Fullscreen
            enableFullscreen: true,
            fullscreenTitle: 'Assine aqui'
        }, options);

        // Detect device
        if (Object.keys(instances).length === 0) {
            detectDevice();
        }

        // Create instance
        instances[regionId] = {
            options: options,
            isFullscreen: false,
            fullscreenOverlay: null,
            fullscreenPad: null,
            currentScale: 1,
            lastPointerType: 'touch',
            gestureState: null,
            orientationPromptShown: false
        };

        var container = document.getElementById(regionId);
        if (container) {
            container.classList.add('apex-sig-mobile-enabled');

            if (globalState.isMobile) {
                container.classList.add('apex-sig-mobile-device');
            }
            if (globalState.isTablet) {
                container.classList.add('apex-sig-tablet-device');
            }
        }

        // Setup features based on device
        if (globalState.hasTouch) {
            // Gesture recognition
            setupGestureRecognition(regionId, options);

            // Touch targets
            if (options.optimizeTouchTargets) {
                optimizeTouchTargets(regionId);
            }

            // Pressure sensitivity
            if (options.enablePressureSensitivity) {
                optimizePressureSensitivity(regionId);
            }
        }

        // Viewport zoom prevention
        if (options.preventViewportZoom && (globalState.isMobile || globalState.isTablet)) {
            preventViewportZoom();
        }

        // Orientation prompt
        if (options.showOrientationPrompt && globalState.isMobile) {
            requestLandscape(regionId);
        }

        // Initial resize
        handleResize(regionId);

        triggerEvent(regionId, 'initialized', {
            device: globalState,
            options: options
        });

        return instances[regionId];
    }

    /**
     * Destroy mobile optimization
     */
    function destroy(regionId) {
        var instance = instances[regionId];
        if (!instance) return;

        // Exit fullscreen if active
        if (instance.isFullscreen) {
            exitFullscreen(regionId);
        }

        // Restore viewport
        if (instance.options.preventViewportZoom) {
            restoreViewportZoom();
        }

        // Remove classes
        var container = document.getElementById(regionId);
        if (container) {
            container.classList.remove(
                'apex-sig-mobile-enabled',
                'apex-sig-mobile-device',
                'apex-sig-tablet-device',
                'apex-sig-mobile-touch-optimized'
            );
        }

        delete instances[regionId];

        triggerEvent(regionId, 'destroyed', {});
    }

    // ========================================
    // Public API
    // ========================================

    return {
        VERSION: VERSION,
        BREAKPOINTS: BREAKPOINTS,
        GESTURES: GESTURES,
        ORIENTATION: ORIENTATION,

        // Initialization
        init: init,
        destroy: destroy,

        // Device info
        detectDevice: detectDevice,
        getDeviceInfo: function() { return globalState; },
        isMobile: function() { return globalState.isMobile; },
        isTablet: function() { return globalState.isTablet; },
        hasTouch: function() { return globalState.hasTouch; },
        hasPressure: function() { return globalState.hasPressure; },
        getOrientation: function() { return globalState.orientation; },

        // Fullscreen
        enterFullscreen: enterFullscreen,
        exitFullscreen: exitFullscreen,
        toggleFullscreen: toggleFullscreen,
        isFullscreen: function(regionId) {
            return instances[regionId] ? instances[regionId].isFullscreen : false;
        },

        // Zoom
        applyZoom: applyZoom,
        resetZoom: resetZoom,
        getZoom: function(regionId) {
            return instances[regionId] ? instances[regionId].currentScale : 1;
        },

        // Orientation
        lockOrientation: lockOrientation,
        unlockOrientation: unlockOrientation,
        requestLandscape: requestLandscape,

        // Haptic
        triggerHaptic: triggerHaptic,

        // Instance access
        getInstance: function(regionId) {
            return instances[regionId];
        }
    };

})();

// AMD/CommonJS support
if (typeof define === 'function' && define.amd) {
    define([], function() { return apexSignatureMobile; });
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = apexSignatureMobile;
}
