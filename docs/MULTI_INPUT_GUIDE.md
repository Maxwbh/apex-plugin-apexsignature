# Multi-Input Capture Guide - APEX Signature v3.0.0

## Overview

APEX Signature v3.0.0 introduces **Multi-Input Capture**, allowing users to provide signatures through three different methods:

1. **Draw** - Traditional drawing on canvas (mouse, touch, stylus)
2. **Upload** - Upload an existing signature image
3. **Webcam** - Capture signature/photo via webcam

## Configuration

### Plugin Attribute: Capture Mode

| Value | Description |
|-------|-------------|
| `draw` | Draw mode only (default, backward compatible) |
| `upload` | Upload mode only |
| `webcam` | Webcam mode only |
| `draw_upload` | Draw and Upload modes |
| `draw_webcam` | Draw and Webcam modes |
| `all` | All three modes |

### Setting Capture Mode in APEX

1. Navigate to your page in Page Designer
2. Select the APEX Signature region
3. In the Attributes section, find **Capture Mode**
4. Select the desired mode combination

## User Interface

### Tab Navigation

When multiple modes are enabled, the plugin displays tabs for switching between modes:

```
┌──────────┬──────────┬──────────┐
│  ✎ Draw  │ 📁 Upload│ 📷 Webcam│
├──────────┴──────────┴──────────┤
│                                 │
│      [Active Mode Content]      │
│                                 │
└─────────────────────────────────┘
```

### Draw Mode

The default drawing canvas with:
- Smooth signature drawing
- Mouse, touch, and stylus support
- Pressure sensitivity (with compatible stylus)
- Configurable pen color and thickness

### Upload Mode

Drag-and-drop or click-to-upload interface:

```
┌─────────────────────────────────┐
│           📁                     │
│                                 │
│  Drag & drop an image or       │
│  click to select               │
│                                 │
└─────────────────────────────────┘
```

**Supported formats:** PNG, JPG, GIF, SVG

### Webcam Mode

Live video capture interface:

```
┌─────────────────────────────────┐
│                                 │
│      [Live Video Feed]          │
│                                 │
├─────────────────────────────────┤
│      [📷 Capture Button]        │
└─────────────────────────────────┘
```

**Note:** Webcam requires HTTPS in production environments (browser security requirement).

## JavaScript API

### Get Current Mode

```javascript
var mode = apex.region('my_signature').getMode();
// Returns: 'draw', 'upload', or 'webcam'
```

### Set Mode Programmatically

```javascript
apex.region('my_signature').setMode('upload');
```

### Check if Empty

```javascript
if (apex.region('my_signature').isEmpty()) {
    apex.message.alert('Please provide a signature');
}
```

### Get Signature Data

```javascript
var dataUrl = apex.region('my_signature').toDataURL();
// Returns data:image/png;base64,... or null if empty
```

### Clear Current Mode

```javascript
apex.region('my_signature').clear();
```

### Programmatic Save

```javascript
apex.region('my_signature').save();
```

## Dynamic Actions

### Available Events

| Event Name | When Triggered |
|------------|----------------|
| `apexsignature-initialized` | Plugin loaded and ready |
| `apexsignature-mode-changed` | User switched tabs |
| `apexsignature-image-uploaded` | File uploaded |
| `apexsignature-upload-cleared` | Uploaded image removed |
| `apexsignature-webcam-started` | Webcam stream began |
| `apexsignature-webcam-captured` | Photo captured |
| `apexsignature-webcam-cleared` | Captured photo removed |
| `apexsignature-webcam-error` | Webcam access failed |
| `apexsignature-saved-db` | Signature saved successfully |
| `apexsignature-error-db` | Save failed |
| `apexsignature-cleared` | Signature cleared |

### Example: Show Message on Mode Change

1. Create Dynamic Action on APEX Signature region
2. Event: **Mode Changed**
3. Action: Execute JavaScript Code

```javascript
var mode = this.data.mode;
apex.message.showPageSuccess('Switched to ' + mode + ' mode');
```

### Example: Validate Upload File Size

1. Create Dynamic Action on region
2. Event: **Image Uploaded**
3. Action: Execute JavaScript Code

```javascript
var fileSize = this.data.fileSize;
if (fileSize > 5 * 1024 * 1024) { // 5MB
    apex.message.alert('File too large. Maximum 5MB allowed.');
    apex.region('my_signature').clear();
}
```

## Styling Customization

### CSS Variables (Universal Theme Compatible)

The plugin uses CSS variables for theming:

```css
/* Customize tab colors */
.apex-sig-tab.active {
    color: var(--ut-palette-primary, #0572ce);
    border-bottom-color: var(--ut-palette-primary, #0572ce);
}

/* Customize upload zone */
.apex-sig-upload-zone {
    border-color: var(--ut-component-border-color, #ccc);
    background: var(--ut-component-background-color, #fafafa);
}

/* Customize capture button */
.apex-sig-capture-btn {
    background: var(--ut-palette-primary, #0572ce);
}
```

### Dark Mode Support

The plugin automatically adapts to Universal Theme dark mode. No additional configuration needed.

## Use Cases

### 1. HR Onboarding

Enable all modes so employees can:
- Draw signature on tablet
- Upload existing signature image
- Take photo for ID verification

```
Capture Mode: all
```

### 2. Contract Signing

Draw mode only for authentic signatures:

```
Capture Mode: draw
```

### 3. Document Verification

Upload mode for existing signed documents:

```
Capture Mode: upload
```

### 4. Identity Verification

Webcam mode for photo capture:

```
Capture Mode: webcam
```

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Draw | 90+ | 88+ | 14+ | 90+ |
| Upload | 90+ | 88+ | 14+ | 90+ |
| Webcam | 90+ | 88+ | 14.1+ | 90+ |
| Pressure | 90+ | 88+ | 14.1+ | 90+ |

**Note:** Webcam requires getUserMedia API which needs HTTPS in production.

## Troubleshooting

### Webcam Not Working

1. Check browser permissions (Settings > Privacy > Camera)
2. Ensure HTTPS (required for webcam)
3. Try different browser
4. Check console for errors

### Upload Not Accepting Files

1. Verify file type (PNG, JPG, GIF, SVG only)
2. Check file size (browser may have limits)
3. Ensure JavaScript is enabled

### Tabs Not Showing

1. Verify Capture Mode is set to multi-mode value
2. Check for JavaScript errors in console
3. Ensure plugin files are uploaded correctly

## Migration from v2.x

### Backward Compatibility

- Default `Capture Mode = draw` maintains v2.x behavior
- Existing configurations continue to work
- No breaking changes to existing API

### New Features to Enable

1. Update Capture Mode attribute for multi-input
2. Add new Dynamic Actions for new events (optional)
3. Update CSS if custom styling was applied

---

**Author:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**Version:** 3.0.0
**Date:** 2025-12-23
