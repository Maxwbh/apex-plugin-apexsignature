# APEX Signature - Signature Templates Guide

**Version:** 3.2.0
**Author:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**LinkedIn:** /maxwbh

---

## Overview

The **Signature Templates** module allows users to save their signatures for reuse. Signatures are stored locally in the browser using localStorage, providing a personal gallery of saved signatures that can be quickly applied.

### Key Features

- Save signatures as reusable templates
- Visual gallery with thumbnails
- Apply saved signatures with one click
- Rename and delete templates
- Import/Export templates as JSON
- Automatic thumbnail generation
- User isolation (per appId/userId)
- Dark mode support
- Full keyboard accessibility

---

## Quick Start

### 1. Include Required Files

Add the templates module after the main apexsignature files:

```html
<!-- Core signature files -->
<script src="#PLUGIN_PREFIX#js/signature_pad.min.js"></script>
<script src="#PLUGIN_PREFIX#js/apexsignature.js"></script>
<link rel="stylesheet" href="#PLUGIN_PREFIX#css/apexsignature.css">

<!-- Templates module -->
<script src="#PLUGIN_PREFIX#js/apexsignature-templates.js"></script>
<link rel="stylesheet" href="#PLUGIN_PREFIX#css/apexsignature-templates.css">
```

### 2. Initialize Templates

After the signature region is initialized, initialize the templates module:

```javascript
// Initialize after apexSignature
apexSignatureTemplates.init('YOUR_REGION_ID', {
    appId: '&APP_ID.',
    userId: '&APP_USER.'
});
```

### 3. Basic Usage

Users can now:
1. **Save Template**: Draw a signature, click "Save Template"
2. **View Gallery**: Click "My Signatures" to open gallery
3. **Apply Template**: Click on any saved signature to apply it
4. **Manage**: Rename or delete templates as needed

---

## Configuration Options

### Initialization Options

```javascript
apexSignatureTemplates.init('REGION_ID', {
    // Required: Unique identifiers for storage isolation
    appId: '123',            // APEX Application ID
    userId: 'ADMIN',         // APEX User ID

    // Optional: UI Labels (for internationalization)
    saveLabel: 'Save Template',
    galleryLabel: 'My Signatures',
    galleryTitle: 'Saved Signatures',
    clearAllLabel: 'Clear All',
    emptyMessage: 'No saved signatures yet. Create one by clicking "Save Template".'
});
```

### Storage Configuration

Templates are stored in localStorage with a key pattern:
```
apex_sig_template_{appId}_{userId}
```

This ensures:
- Templates are isolated per application
- Templates are isolated per user
- Different users on the same browser have separate storage

---

## UI Components

### Templates Toolbar

Automatically added above the signature area:

```
┌─────────────────────────────────────────────────────┐
│  [💾 Save Template]  [🖼 My Signatures (3)]         │
└─────────────────────────────────────────────────────┘
│                                                     │
│              [Signature Area]                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Gallery Modal

Opens when clicking "My Signatures":

```
┌─────────────────────────────────────────────────────┐
│  Saved Signatures                              [X]  │
├─────────────────────────────────────────────────────┤
│ ┌─────────┐  ┌─────────┐  ┌─────────┐              │
│ │[Thumb 1]│  │[Thumb 2]│  │[Thumb 3]│              │
│ ├─────────┤  ├─────────┤  ├─────────┤              │
│ │ Sign 1  │  │ Sign 2  │  │ Sign 3  │              │
│ │12/23/25 │  │12/22/25 │  │12/21/25 │              │
│ ├─────────┤  ├─────────┤  ├─────────┤              │
│ │ ✓ ✎ 🗑 │  │ ✓ ✎ 🗑 │  │ ✓ ✎ 🗑 │              │
│ └─────────┘  └─────────┘  └─────────┘              │
│                                                     │
├─────────────────────────────────────────────────────┤
│                              [🗑 Clear All]         │
└─────────────────────────────────────────────────────┘
```

### Template Item Actions

| Icon | Action | Keyboard |
|------|--------|----------|
| ✓ | Apply signature | Enter, Space |
| ✎ | Rename template | - |
| 🗑 | Delete template | Delete |

---

## API Reference

### Methods

#### init(regionId, options)
Initialize the templates module for a region.

```javascript
apexSignatureTemplates.init('R123_SIG', {
    appId: '100',
    userId: 'JSMITH'
});
```

#### saveTemplate(regionId, name)
Programmatically save current signature as template.

```javascript
apexSignatureTemplates.saveTemplate('R123_SIG', 'My Default Signature');
```

#### useTemplate(regionId, templateId)
Apply a template to the signature area.

```javascript
apexSignatureTemplates.useTemplate('R123_SIG', 'tpl_1234567890_abc123');
```

#### deleteTemplate(regionId, templateId)
Delete a specific template (with confirmation).

```javascript
apexSignatureTemplates.deleteTemplate('R123_SIG', 'tpl_1234567890_abc123');
```

#### getAllTemplates(regionId)
Get array of all saved templates.

```javascript
var templates = apexSignatureTemplates.getAllTemplates('R123_SIG');
console.log(templates);
// [{id: 'tpl_...', name: 'Sig 1', data: 'data:image/png;...', ...}, ...]
```

#### getTemplateCount(regionId)
Get number of saved templates.

```javascript
var count = apexSignatureTemplates.getTemplateCount('R123_SIG');
console.log('Saved templates:', count);
```

#### openGallery(regionId)
Programmatically open the gallery modal.

```javascript
apexSignatureTemplates.openGallery('R123_SIG');
```

#### closeGallery(regionId)
Programmatically close the gallery modal.

```javascript
apexSignatureTemplates.closeGallery('R123_SIG');
```

#### exportTemplates(regionId)
Export all templates as JSON string.

```javascript
var json = apexSignatureTemplates.exportTemplates('R123_SIG');
// Download or store the JSON
```

#### importTemplates(regionId, json)
Import templates from JSON string.

```javascript
var json = '[{"name": "Imported", "data": "data:image/png;..."}]';
var added = apexSignatureTemplates.importTemplates('R123_SIG', json);
console.log('Imported:', added, 'templates');
```

---

## Dynamic Action Events

### Available Events

| Event Name | Fired When |
|------------|------------|
| `apexsignature-templates-initialized` | Module initialized |
| `apexsignature-template-saved` | Template saved |
| `apexsignature-template-applied` | Template applied to signature |
| `apexsignature-template-renamed` | Template renamed |
| `apexsignature-template-deleted` | Template deleted |
| `apexsignature-templates-cleared` | All templates cleared |
| `apexsignature-gallery-opened` | Gallery modal opened |
| `apexsignature-gallery-closed` | Gallery modal closed |

### Event Data

Each event includes relevant data in `this.data`:

```javascript
// Template Saved Event
{
    template: {
        id: 'tpl_1234567890_abc123',
        name: 'My Signature',
        data: 'data:image/png;base64,...',
        thumbnail: 'data:image/png;base64,...',
        createdAt: '2025-12-23T10:30:00.000Z',
        mode: 'draw'
    },
    count: 5 // total templates after saving
}

// Template Deleted Event
{
    templateId: 'tpl_1234567890_abc123',
    templateName: 'My Signature',
    remainingCount: 4
}
```

### Dynamic Action Examples

#### Show Notification on Save

1. Create Dynamic Action
   - Event: Custom
   - Custom Event: `apexsignature-template-saved`
   - Selection Type: Region
   - Region: Your signature region

2. True Action: Execute JavaScript Code
```javascript
apex.message.showPageSuccess('Template "' + this.data.template.name + '" saved!');
```

#### Track Template Usage

```javascript
// On template-applied event
console.log('User applied template:', this.data.template.name);
// Send to analytics
apex.server.process('LOG_TEMPLATE_USAGE', {
    x01: this.data.template.id
});
```

---

## Integration Examples

### With Page Initialization

```javascript
// In Page Load - Execute JavaScript
(function() {
    // Wait for signature region
    apex.jQuery(document).on('apexsignature-initialized', '#R123_SIG', function(e) {
        // Initialize templates
        apexSignatureTemplates.init('R123_SIG', {
            appId: '&APP_ID.',
            userId: '&APP_USER.',
            saveLabel: apex.lang.getMessage('SAVE_TEMPLATE'),
            galleryLabel: apex.lang.getMessage('MY_SIGNATURES')
        });
    });
})();
```

### Pre-load Default Templates

```javascript
// Load company-provided default templates
var companyTemplates = [
    {
        name: 'Company Standard',
        data: 'data:image/png;base64,iVBORw0KGg...'
    },
    {
        name: 'Initials Only',
        data: 'data:image/png;base64,iVBORw0KGg...'
    }
];

apexSignatureTemplates.importTemplates('R123_SIG', JSON.stringify(companyTemplates));
```

### Sync with Database (Optional)

```javascript
// Save template to database when saved locally
apex.jQuery(document).on('apexsignature-template-saved', '#R123_SIG', function(e) {
    apex.server.process('SAVE_TEMPLATE_TO_DB', {
        x01: e.data.template.id,
        x02: e.data.template.name,
        x03: e.data.template.data
    });
});

// Load templates from database on init
apex.server.process('GET_USER_TEMPLATES', {}, {
    success: function(pData) {
        if (pData.templates && pData.templates.length > 0) {
            apexSignatureTemplates.importTemplates('R123_SIG', JSON.stringify(pData.templates));
        }
    }
});
```

---

## Styling Customization

### CSS Variables

The module uses Universal Theme CSS variables for theming:

```css
/* Override default colors */
.apex-sig-templates-toolbar {
    --ut-component-background-color: #f0f0f0;
    --ut-component-border-color: #cccccc;
}

.apex-sig-tpl-btn {
    --ut-palette-primary-alt: #0066cc;
}
```

### Custom Toolbar Position

```css
/* Move toolbar below signature */
.apex-sig-templates-toolbar {
    order: 1;
    margin-top: 8px;
    margin-bottom: 0;
}

.apex-sig-wrapper {
    display: flex;
    flex-direction: column;
}

.apex-sig-panels {
    order: 0;
}
```

### Custom Gallery Size

```css
/* Larger gallery modal */
.apex-sig-tpl-modal-content {
    max-width: 1000px;
    max-height: 90vh;
}

/* Larger thumbnails */
.apex-sig-tpl-thumb {
    height: 150px;
}

.apex-sig-tpl-gallery {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
```

---

## Internationalization

### Using APEX Text Messages

Define messages in Shared Components > Text Messages:

| Name | Text |
|------|------|
| APEX_SIG_SAVE_TPL | Salvar Modelo |
| APEX_SIG_MY_SIGS | Minhas Assinaturas |
| APEX_SIG_GALLERY_TITLE | Assinaturas Salvas |
| APEX_SIG_EMPTY_MSG | Nenhuma assinatura salva. |
| APEX_SIG_CLEAR_ALL | Limpar Tudo |

```javascript
apexSignatureTemplates.init('R123_SIG', {
    appId: '&APP_ID.',
    userId: '&APP_USER.',
    saveLabel: apex.lang.getMessage('APEX_SIG_SAVE_TPL'),
    galleryLabel: apex.lang.getMessage('APEX_SIG_MY_SIGS'),
    galleryTitle: apex.lang.getMessage('APEX_SIG_GALLERY_TITLE'),
    emptyMessage: apex.lang.getMessage('APEX_SIG_EMPTY_MSG'),
    clearAllLabel: apex.lang.getMessage('APEX_SIG_CLEAR_ALL')
});
```

---

## Limitations

| Limitation | Details |
|------------|---------|
| Storage Limit | localStorage typically 5-10MB per domain |
| Max Templates | 20 templates per user/app combination |
| Browser Dependency | Templates stored in browser, not synced across devices |
| No Cloud Sync | Use database integration for cross-device access |

---

## Troubleshooting

### Templates Not Saving

1. Check localStorage availability:
```javascript
try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('localStorage available');
} catch (e) {
    console.error('localStorage not available:', e);
}
```

2. Check storage quota:
```javascript
if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate().then(function(estimate) {
        console.log('Used:', estimate.usage);
        console.log('Quota:', estimate.quota);
    });
}
```

### Gallery Not Opening

1. Verify initialization:
```javascript
console.log(apexSignatureTemplates.instances['R123_SIG']);
```

2. Check for JavaScript errors in console

### Templates Not Loading

1. Check storage key:
```javascript
var key = 'apex_sig_template_' + appId + '_' + userId;
console.log('Storage key:', key);
console.log('Stored data:', localStorage.getItem(key));
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
| 3.2.0 | 2025-12-23 | Initial release of Templates module |

---

**Author:** Maxwell da Silva Oliveira
**Company:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
