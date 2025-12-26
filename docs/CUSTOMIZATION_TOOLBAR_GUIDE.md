# APEX Signature - Customization Toolbar Guide

**Version:** 3.3.0
**Author:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**LinkedIn:** /maxwbh

---

## Overview

The **Customization Toolbar** module provides real-time editing tools for the signature capture area. Users can change pen color, adjust line thickness, use an eraser, and undo/redo their strokes.

### Key Features

- **Color Selection**: 5 preset colors + custom color picker
- **Thickness Control**: Slider from 0.5px to 5.0px
- **Eraser Mode**: Erase parts of the signature
- **Undo/Redo**: Full stroke history with keyboard shortcuts
- **Clear Button**: Reset the signature area
- **Preference Persistence**: Save settings to localStorage
- **Keyboard Shortcuts**: Ctrl+Z, Ctrl+Y, E for eraser
- **Dark Mode Support**: Universal Theme integration
- **Responsive Design**: Works on mobile devices

---

## Quick Start

### 1. Include Required Files

Add the toolbar module after the main apexsignature files:

```html
<!-- Core signature files -->
<script src="#PLUGIN_PREFIX#js/signature_pad.min.js"></script>
<script src="#PLUGIN_PREFIX#js/apexsignature.js"></script>
<link rel="stylesheet" href="#PLUGIN_PREFIX#css/apexsignature.css">

<!-- Toolbar module -->
<script src="#PLUGIN_PREFIX#js/apexsignature-toolbar.js"></script>
<link rel="stylesheet" href="#PLUGIN_PREFIX#css/apexsignature-toolbar.css">
```

### 2. Initialize Toolbar

After the signature region is initialized, initialize the toolbar module:

```javascript
// Wait for signature initialization
apex.jQuery(document).on('apexsignature-initialized', '#YOUR_REGION_ID', function() {
    apexSignatureToolbar.init('YOUR_REGION_ID', {
        appId: '&APP_ID.',
        userId: '&APP_USER.'
    });
});
```

### 3. Basic Usage

Users can now:
1. **Select Color**: Click preset colors or use the color picker
2. **Adjust Thickness**: Drag the slider left/right
3. **Use Eraser**: Click "Eraser" button or press "E"
4. **Undo/Redo**: Click buttons or use Ctrl+Z / Ctrl+Y
5. **Clear**: Click "Clear" to start over

---

## Configuration Options

### Initialization Options

```javascript
apexSignatureToolbar.init('REGION_ID', {
    // Storage isolation
    appId: '123',              // APEX Application ID
    userId: 'ADMIN',           // APEX User ID

    // Initial settings
    penColor: '#000000',       // Starting pen color
    lineWidth: 2.0,            // Starting thickness
    minWidth: 0.5,             // Minimum thickness
    maxWidth: 5.0,             // Maximum thickness
    backgroundColor: '#ffffff', // Canvas background (for eraser)

    // Custom colors (optional)
    colors: [
        { name: 'Black', value: '#000000' },
        { name: 'Blue', value: '#0066cc' },
        { name: 'Red', value: '#cc0000' },
        { name: 'Green', value: '#006600' },
        { name: 'Purple', value: '#660099' }
    ],

    // UI Labels (for internationalization)
    colorLabel: 'Color:',
    thicknessLabel: 'Thickness:',
    eraserLabel: 'Eraser',
    undoLabel: 'Undo',
    redoLabel: 'Redo',
    clearLabel: 'Clear'
});
```

---

## UI Components

### Toolbar Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Color: [●][●][●][●][●][🎨]  Thickness: ═══●═══ 2.0px  [Eraser][↩][↪][🗑]│
└─────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

| Component | Description |
|-----------|-------------|
| Color Presets | 5 circular buttons with preset colors |
| Color Picker | Native HTML5 color picker |
| Thickness Slider | Range slider (0.5 - 5.0 px) |
| Thickness Value | Current value display |
| Eraser | Toggle button for eraser mode |
| Undo | Undo last stroke |
| Redo | Redo last undone stroke |
| Clear | Clear entire signature |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo last stroke |
| `Ctrl + Y` | Redo last undone stroke |
| `Ctrl + Shift + Z` | Redo (alternative) |
| `E` | Toggle eraser mode |

**Note:** Shortcuts only work when focus is within the signature region.

---

## API Reference

### Methods

#### init(regionId, options)
Initialize the toolbar for a region.

```javascript
apexSignatureToolbar.init('R123_SIG', {
    appId: '100',
    userId: 'JSMITH'
});
```

#### setColor(regionId, color)
Set the pen color programmatically.

```javascript
apexSignatureToolbar.setColor('R123_SIG', '#ff0000');
```

#### getColor(regionId)
Get the current pen color.

```javascript
var color = apexSignatureToolbar.getColor('R123_SIG');
console.log(color); // '#000000'
```

#### setThickness(regionId, width)
Set the line thickness programmatically.

```javascript
apexSignatureToolbar.setThickness('R123_SIG', 3.5);
```

#### getThickness(regionId)
Get the current line thickness.

```javascript
var thickness = apexSignatureToolbar.getThickness('R123_SIG');
console.log(thickness); // 2.0
```

#### toggleEraser(regionId)
Toggle eraser mode on/off.

```javascript
apexSignatureToolbar.toggleEraser('R123_SIG');
```

#### isEraserActive(regionId)
Check if eraser mode is active.

```javascript
var isErasing = apexSignatureToolbar.isEraserActive('R123_SIG');
console.log(isErasing); // false
```

#### undo(regionId)
Undo the last stroke.

```javascript
apexSignatureToolbar.undo('R123_SIG');
```

#### redo(regionId)
Redo the last undone stroke.

```javascript
apexSignatureToolbar.redo('R123_SIG');
```

#### clearSignature(regionId)
Clear the signature and reset history.

```javascript
apexSignatureToolbar.clearSignature('R123_SIG');
```

#### resetToDefaults(regionId)
Reset all settings to defaults and clear preferences.

```javascript
apexSignatureToolbar.resetToDefaults('R123_SIG');
```

---

## Dynamic Action Events

### Available Events

| Event Name | Fired When |
|------------|------------|
| `apexsignature-toolbar-initialized` | Toolbar initialized |
| `apexsignature-color-changed` | Pen color changed |
| `apexsignature-thickness-changed` | Line thickness changed |
| `apexsignature-eraser-toggled` | Eraser mode toggled |
| `apexsignature-undo` | Undo executed |
| `apexsignature-redo` | Redo executed |
| `apexsignature-toolbar-cleared` | Clear button clicked |
| `apexsignature-toolbar-reset` | Reset to defaults |

### Event Data Examples

```javascript
// Color Changed Event
{
    color: '#0066cc'
}

// Thickness Changed Event
{
    width: 3.5
}

// Eraser Toggled Event
{
    isErasing: true
}

// Undo/Redo Event
{
    historyIndex: 5
}
```

### Dynamic Action Example

#### Change Background When Eraser Active

1. Create Dynamic Action
   - Event: Custom
   - Custom Event: `apexsignature-eraser-toggled`
   - Selection Type: Region
   - Region: Your signature region

2. True Action: Execute JavaScript Code
```javascript
if (this.data.isErasing) {
    apex.jQuery('#' + this.triggeringElement.id + '_wrapper')
        .addClass('eraser-mode');
} else {
    apex.jQuery('#' + this.triggeringElement.id + '_wrapper')
        .removeClass('eraser-mode');
}
```

---

## How Eraser Works

The eraser is implemented by temporarily changing the pen color to match the canvas background (typically white). This creates a "drawing over" effect that visually erases strokes.

### Eraser Behavior

1. **Activation**: Saves current pen settings
2. **During Erase**:
   - Pen color = background color
   - Line width = 10-15px (thicker for easier erasing)
   - Cursor changes to circle indicator
3. **Deactivation**: Restores original pen settings

### Limitations

- Eraser draws over existing strokes (doesn't truly delete)
- Works best with solid background colors
- Multiple erase passes may be needed

---

## Undo/Redo System

### How It Works

1. **History Tracking**: Each completed stroke is saved to history
2. **Maximum History**: 30 states (configurable via `MAX_HISTORY`)
3. **New Stroke**: Clears any redo history

### History States

```
Initial State → Stroke 1 → Stroke 2 → Stroke 3
                    ↑           ↑           ↑
               historyIndex = 0, 1, or 2

After Undo (from 2):
Initial State → Stroke 1 → [Stroke 2]
                    ↑
               historyIndex = 0

After Redo:
Initial State → Stroke 1 → Stroke 2
                                ↑
                        historyIndex = 1
```

---

## Styling Customization

### CSS Variables

```css
/* Override default toolbar colors */
.apex-sig-toolbar {
    --ut-component-background-color: #f0f4f8;
    --ut-component-border-color: #cfd8dc;
}

/* Custom slider track color */
.apex-sig-thickness-slider {
    background: linear-gradient(to right, #e0e0e0, #1a73e8);
}

/* Custom button style */
.apex-sig-tool-btn {
    --ut-palette-primary-alt: #00897b;
}
```

### Custom Color Presets

```javascript
apexSignatureToolbar.init('R123_SIG', {
    colors: [
        { name: 'Company Blue', value: '#003366' },
        { name: 'Company Red', value: '#cc0033' },
        { name: 'Signature Black', value: '#1a1a1a' },
        { name: 'Signature Blue', value: '#000066' },
        { name: 'Faded Gray', value: '#666666' }
    ]
});
```

### Hide Specific Tools

```css
/* Hide eraser button */
.apex-sig-eraser-btn {
    display: none !important;
}

/* Hide undo/redo buttons */
.apex-sig-undo-btn,
.apex-sig-redo-btn {
    display: none !important;
}
```

---

## Integration Examples

### With Templates Module

```javascript
// Initialize both modules
apex.jQuery(document).on('apexsignature-initialized', '#R123_SIG', function() {
    // Initialize toolbar first
    apexSignatureToolbar.init('R123_SIG', {
        appId: '&APP_ID.',
        userId: '&APP_USER.'
    });

    // Then templates
    apexSignatureTemplates.init('R123_SIG', {
        appId: '&APP_ID.',
        userId: '&APP_USER.'
    });
});
```

### Sync Color with APEX Item

```javascript
// Update APEX item when color changes
apex.jQuery(document).on('apexsignature-color-changed', '#R123_SIG', function(e) {
    apex.item('P1_PEN_COLOR').setValue(e.data.color);
});

// Set color from APEX item value
var savedColor = apex.item('P1_PEN_COLOR').getValue();
if (savedColor) {
    apexSignatureToolbar.setColor('R123_SIG', savedColor);
}
```

### Disable Toolbar Based on Condition

```javascript
// Disable toolbar when in view mode
if (apex.item('P1_MODE').getValue() === 'VIEW') {
    apex.jQuery('#R123_SIG_toolbar').find('button, input').prop('disabled', true);
    apex.jQuery('#R123_SIG_toolbar').css('opacity', '0.5');
}
```

---

## Internationalization

### Using APEX Text Messages

Define messages in Shared Components > Text Messages:

| Name | English | Portuguese |
|------|---------|------------|
| APEX_SIG_COLOR | Color: | Cor: |
| APEX_SIG_THICKNESS | Thickness: | Espessura: |
| APEX_SIG_ERASER | Eraser | Borracha |
| APEX_SIG_UNDO | Undo | Desfazer |
| APEX_SIG_REDO | Redo | Refazer |
| APEX_SIG_CLEAR | Clear | Limpar |

```javascript
apexSignatureToolbar.init('R123_SIG', {
    colorLabel: apex.lang.getMessage('APEX_SIG_COLOR'),
    thicknessLabel: apex.lang.getMessage('APEX_SIG_THICKNESS'),
    eraserLabel: apex.lang.getMessage('APEX_SIG_ERASER'),
    undoLabel: apex.lang.getMessage('APEX_SIG_UNDO'),
    redoLabel: apex.lang.getMessage('APEX_SIG_REDO'),
    clearLabel: apex.lang.getMessage('APEX_SIG_CLEAR')
});
```

---

## Responsive Behavior

### Breakpoints

| Viewport | Layout |
|----------|--------|
| > 768px | Single row, all tools visible |
| 481-768px | Two rows, tools on second row |
| ≤ 480px | Stacked vertical layout |

### Mobile Considerations

- Slider works with touch drag
- Buttons sized for touch (44x44px minimum)
- Color picker uses native mobile picker
- Keyboard shortcuts disabled on touch devices

---

## Troubleshooting

### Undo Not Working

1. Check if toolbar is initialized after signature:
```javascript
console.log(apexSignatureToolbar.instances['R123_SIG']);
```

2. Verify history is being saved:
```javascript
console.log(apexSignatureToolbar.instances['R123_SIG'].history);
```

### Color Not Changing

1. Check eraser mode is off:
```javascript
console.log(apexSignatureToolbar.isEraserActive('R123_SIG'));
```

2. Verify signature pad reference:
```javascript
console.log(apexSignature.instances['R123_SIG'].signaturePad.penColor);
```

### Preferences Not Saving

1. Check localStorage availability:
```javascript
try {
    localStorage.setItem('test', 'test');
    console.log('localStorage available');
} catch (e) {
    console.error('localStorage blocked');
}
```

2. Check storage key:
```javascript
var key = 'apex_sig_prefs_' + appId + '_' + userId;
console.log('Prefs:', localStorage.getItem(key));
```

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
| 3.3.0 | 2025-12-24 | Initial release of Toolbar module |

---

**Author:** Maxwell da Silva Oliveira
**Company:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
