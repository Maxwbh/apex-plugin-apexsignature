# APEX Signature - Initials Mode Guide

**Version:** 3.5.0
**Author:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**LinkedIn:** /maxwbh

---

## Overview

The **Initials Mode** module provides a compact component for capturing initials (rubricas). It's designed for use cases where a full signature isn't needed, such as:

- Multi-page document rubrics
- Quick approval workflows
- Checkbox-style confirmations
- Legal document initialing

### Key Features

- **Compact Canvas**: Smaller area optimized for initials (150x80px default)
- **Draw Mode**: Freehand drawing of initials
- **Type Mode**: Typed initials with stylized fonts
- **Auto-Generate**: Automatically generate initials from full name
- **Validation**: Required fields, minimum strokes
- **Multiple Fonts**: 5 script fonts for typed initials

---

## Quick Start

### 1. Include Required Files

```html
<!-- Core signature files -->
<script src="#PLUGIN_PREFIX#js/signature_pad.min.js"></script>
<script src="#PLUGIN_PREFIX#js/apexsignature.js"></script>

<!-- Initials module -->
<script src="#PLUGIN_PREFIX#js/apexsignature-initials.js"></script>
<link rel="stylesheet" href="#PLUGIN_PREFIX#css/apexsignature-initials.css">
```

### 2. Initialize Initials

```javascript
apexSignatureInitials.init('YOUR_REGION_ID', {
    mode: 'draw',
    fullName: '&APP_USER_FULL_NAME.',
    required: true
});
```

### 3. Basic Usage

1. **Draw Mode**: Draw your initials in the compact canvas
2. **Type Mode**: Enter initials, choose a font, see preview
3. **Clear**: Reset and start over
4. **Confirm**: Capture and validate initials

---

## Configuration Options

### Full Configuration

```javascript
apexSignatureInitials.init('REGION_ID', {
    // Initial mode
    mode: 'draw',              // 'draw' or 'type'

    // Canvas dimensions
    width: 150,                // Canvas width (pixels)
    height: 80,                // Canvas height (pixels)

    // Auto-generate from name
    fullName: 'John Doe',      // Full name for auto-generation

    // Drawing options
    penColor: '#000000',       // Pen color
    backgroundColor: '#ffffff', // Canvas background

    // Validation
    required: true,            // Initials required
    minStrokes: 1,             // Minimum strokes for draw mode
    maxLength: 4,              // Maximum characters for type mode

    // Default font for type mode
    font: 'Dancing Script',    // Default font

    // UI Labels (for i18n)
    title: 'Initials',
    drawLabel: 'Draw',
    typeLabel: 'Type',
    placeholder: 'Enter initials',
    fontLabel: 'Style:',
    clearLabel: 'Clear',
    confirmLabel: 'Confirm'
});
```

---

## UI Components

### Compact Layout

```
┌─────────────────────────────────┐
│ Initials    [Draw] [Type]       │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │      [Canvas Area]      │    │
│  │                         │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│  [Clear]         [Confirm]      │
└─────────────────────────────────┘
```

### Draw Mode

Users draw their initials freehand:
- Compact canvas optimized for quick marks
- Touch and stylus support
- Pressure sensitivity (where supported)

### Type Mode

Users type and style their initials:
- Text input (auto-uppercase)
- Font selection dropdown
- Real-time preview

```
┌─────────────────────────────────┐
│ Initials    [Draw] [Type]       │
├─────────────────────────────────┤
│  ┌─────────────────┐ [★]        │
│  │      MSO        │            │
│  └─────────────────┘            │
│  Style: [Dancing Script ▼]      │
│  ┌─────────────────────────┐    │
│  │        𝓜𝓢𝓞              │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│  [Clear]         [Confirm]      │
└─────────────────────────────────┘
```

---

## Available Fonts

| Font Name | CSS Family | Style |
|-----------|------------|-------|
| Script | Dancing Script | Casual, flowing |
| Elegant | Great Vibes | Formal, decorative |
| Classic | Allura | Traditional script |
| Modern | Pacifico | Contemporary |
| Simple | Arial | Clean, professional |

---

## Auto-Generation

The module can automatically generate initials from a full name:

```javascript
apexSignatureInitials.init('R123', {
    fullName: 'Maxwell da Silva Oliveira'
});

// Generated: "MDSO" (first letter of each word, max 4)
```

### Generation Rules

1. Split name by whitespace
2. Take first letter of each word
3. Convert to uppercase
4. Limit to 4 characters

### Examples

| Full Name | Generated |
|-----------|-----------|
| John Doe | JD |
| Maria da Silva | MDS |
| José Carlos de Souza Lima | JCDS |
| A | A |

---

## API Reference

### Methods

#### init(regionId, options)
Initialize the initials module.

```javascript
apexSignatureInitials.init('R123_INITIALS', {
    mode: 'draw',
    fullName: 'John Doe'
});
```

#### clear(regionId)
Clear the current initials.

```javascript
apexSignatureInitials.clear('R123_INITIALS');
```

#### confirm(regionId)
Validate and confirm initials.

```javascript
var success = apexSignatureInitials.confirm('R123_INITIALS');
if (success) {
    console.log('Initials confirmed!');
}
```

#### isEmpty(regionId)
Check if initials are empty.

```javascript
if (apexSignatureInitials.isEmpty('R123_INITIALS')) {
    console.log('Please provide initials');
}
```

#### getMode(regionId) / setMode(regionId, mode)
Get or set current mode.

```javascript
var mode = apexSignatureInitials.getMode('R123_INITIALS');
apexSignatureInitials.setMode('R123_INITIALS', 'type');
```

#### getInitialsData(regionId, callback)
Get initials as data URL.

```javascript
apexSignatureInitials.getInitialsData('R123_INITIALS', function(dataUrl) {
    if (dataUrl) {
        document.getElementById('preview').src = dataUrl;
    }
});
```

#### getConfirmedData(regionId)
Get confirmed initials data URL.

```javascript
var data = apexSignatureInitials.getConfirmedData('R123_INITIALS');
```

#### setFullName(regionId, fullName)
Set full name for auto-generation.

```javascript
apexSignatureInitials.setFullName('R123_INITIALS', 'New User Name');
```

#### setPenColor(regionId, color)
Change pen color.

```javascript
apexSignatureInitials.setPenColor('R123_INITIALS', '#0066cc');
```

---

## Dynamic Action Events

### Available Events

| Event Name | Fired When |
|------------|------------|
| `apexsignature-initials-initialized` | Module initialized |
| `apexsignature-initials-mode-changed` | Mode switched |
| `apexsignature-initials-confirmed` | Initials confirmed |
| `apexsignature-initials-cleared` | Initials cleared |

### Event Data

```javascript
// Initials Confirmed Event
{
    mode: 'draw',
    data: 'data:image/png;base64,...'
}

// Mode Changed Event
{
    mode: 'type'
}
```

### Dynamic Action Example

```javascript
// On initials-confirmed
var initialsData = this.data.data;
apex.item('P1_INITIALS_DATA').setValue(initialsData);
```

---

## Validation

### Required Initials

```javascript
apexSignatureInitials.init('R123', {
    required: true
});
```

When required, users must provide initials before confirming.

### Minimum Strokes (Draw Mode)

```javascript
apexSignatureInitials.init('R123', {
    minStrokes: 2  // At least 2 strokes required
});
```

Useful for ensuring users make meaningful marks, not just a single dot.

### Maximum Length (Type Mode)

```javascript
apexSignatureInitials.init('R123', {
    maxLength: 3  // Maximum 3 characters
});
```

---

## Use Cases

### Multi-Page Document Rubric

```javascript
// Initialize for each page
for (var i = 1; i <= 5; i++) {
    apexSignatureInitials.init('PAGE_' + i + '_INITIALS', {
        mode: 'draw',
        fullName: apex.item('P1_SIGNER_NAME').getValue(),
        required: true,
        width: 100,
        height: 50
    });
}
```

### Approval Workflow

```javascript
apexSignatureInitials.init('APPROVAL_INITIALS', {
    mode: 'type',
    fullName: '&APP_USER.',
    required: true,
    title: 'Approval'
});

// On confirm
apex.jQuery(document).on('apexsignature-initials-confirmed', '#APPROVAL_INITIALS', function(e) {
    apex.server.process('APPROVE_ITEM', {
        x01: e.data.data
    });
});
```

### Quick Checkbox Alternative

```javascript
apexSignatureInitials.init('AGREEMENT_INITIALS', {
    mode: 'draw',
    required: true,
    width: 80,
    height: 40,
    title: 'I Agree'
});
```

---

## Styling Customization

### Custom Dimensions

```javascript
apexSignatureInitials.init('R123', {
    width: 200,
    height: 100
});
```

### Custom Colors

```javascript
apexSignatureInitials.init('R123', {
    penColor: '#0066cc',
    backgroundColor: '#f0f8ff'
});
```

### CSS Customization

```css
/* Larger wrapper */
.apex-sig-initials-wrapper {
    max-width: 300px;
}

/* Custom canvas border */
.apex-sig-initials-canvas {
    border: 2px dashed #0066cc;
    border-radius: 8px;
}

/* Custom confirm button */
.apex-sig-initials-confirm {
    background: linear-gradient(135deg, #28a745 0%, #218838 100%);
}

/* Inline layout */
.my-inline-initials .apex-sig-initials-wrapper {
    display: flex;
    flex-direction: row;
    max-width: none;
}
```

---

## Internationalization

```javascript
apexSignatureInitials.init('R123', {
    title: apex.lang.getMessage('APEX_SIG_INITIALS'),
    drawLabel: apex.lang.getMessage('APEX_SIG_DRAW'),
    typeLabel: apex.lang.getMessage('APEX_SIG_TYPE'),
    placeholder: apex.lang.getMessage('APEX_SIG_ENTER_INITIALS'),
    fontLabel: apex.lang.getMessage('APEX_SIG_STYLE'),
    clearLabel: apex.lang.getMessage('APEX_SIG_CLEAR'),
    confirmLabel: apex.lang.getMessage('APEX_SIG_CONFIRM')
});
```

---

## Integration Examples

### With Signature Region

```javascript
// Main signature
apexSignature.apexSignatureFnc('MAIN_SIGNATURE', options, true);

// Initials
apexSignatureInitials.init('INITIALS_REGION', {
    fullName: '&APP_USER_FULL_NAME.'
});

// On page submit, get both
var signatureData = apexSignature.getCurrentSignature('MAIN_SIGNATURE');
var initialsData = apexSignatureInitials.getConfirmedData('INITIALS_REGION');
```

### With Timestamp

```javascript
// Initialize both
apexSignatureInitials.init('INITIALS_REGION', { ... });
apexSignatureTimestamp.init('INITIALS_REGION', {
    enabled: true,
    position: 'below'
});
```

---

## Troubleshooting

### Canvas Not Drawing

1. Check SignaturePad is loaded:
```javascript
console.log(typeof SignaturePad);
```

2. Verify canvas element:
```javascript
console.log(document.getElementById('REGION_ID_initials_canvas'));
```

### Fonts Not Loading

1. Check network for Google Fonts:
```javascript
// Should see fonts loading in Network tab
```

2. Manually load fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
```

### Initials Not Confirming

1. Check validation:
```javascript
apexSignatureInitials.isEmpty('REGION_ID');
```

2. Check console for errors

---

## Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 12+ |
| Edge | 79+ |
| IE | Not Supported |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.5.0 | 2025-12-24 | Initial release of Initials Mode module |

---

**Author:** Maxwell da Silva Oliveira
**Company:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
