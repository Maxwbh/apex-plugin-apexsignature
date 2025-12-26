# Document Signing Guide - APEX Signature v3.1.0

## Overview

APEX Signature v3.1.0 introduces **Document Signing**, allowing users to:

- Upload PDF or image documents
- Place signatures anywhere on the document
- Drag and resize signatures
- Add multiple signatures
- Navigate multi-page PDFs
- Export signed documents

## Prerequisites

### PDF.js Library

For PDF support, include PDF.js before the plugin:

```html
<!-- PDF.js from CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
</script>
```

Or add to page JavaScript:
```javascript
// In Page Properties > JavaScript > File URLs
https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
```

## Quick Start

### 1. Initialize Document Signing

```javascript
// Initialize on page load
apexSignatureDocSign.init('my_region_id', {
    uploadDocText: 'Upload Document',
    addSignatureText: 'Add Signature',
    exportText: 'Export',
    emptyText: 'Upload a PDF or image to start signing'
});
```

### 2. User Workflow

1. **Upload Document** - Click button or drag-and-drop PDF/image
2. **Add Signature** - Click to open signature modal
3. **Create Signature** - Draw, type, or upload
4. **Position Signature** - Drag to desired location
5. **Resize if needed** - Use corner handle
6. **Export** - Download signed document

## Features

### Document Upload

Supported formats:
- **PDF** (.pdf) - Rendered page by page
- **Images** - PNG, JPG, JPEG, GIF

```javascript
// Programmatic document load
var file = document.querySelector('input[type="file"]').files[0];
apexSignatureDocSign.loadDocument('my_region_id', file);
```

### Signature Creation Methods

#### 1. Draw Signature

Canvas-based drawing with:
- Smooth stroke rendering
- Pressure sensitivity (if supported)
- Clear button to restart

#### 2. Type Signature

Text-based signature with:
- Multiple script fonts
- Real-time preview
- Font styles:
  - Dancing Script
  - Great Vibes
  - Pacifico
  - Sacramento
  - Allura

#### 3. Upload Signature

Import existing signature image:
- Drag and drop support
- PNG, JPG, GIF, SVG
- Preview before applying

### Signature Manipulation

#### Positioning

- **Click** to select signature
- **Drag** to move
- Constrained to document bounds

#### Resizing

- Hover to show resize handle
- Drag corner handle to resize
- Minimum size enforced

#### Deletion

- Hover and click X button
- Or select and press Delete key

### Multi-Page PDF Support

```
┌─────────────────────────────────────┐
│  ◀  Page 3 of 10  ▶                │
├─────────────────────────────────────┤
│                                     │
│       [PDF Page Content]            │
│                                     │
│       [Signatures for page 3]       │
│                                     │
└─────────────────────────────────────┘
```

- Navigate with Previous/Next buttons
- Signatures are page-specific
- Each page maintains its own signatures

## JavaScript API

### Initialize

```javascript
apexSignatureDocSign.init(regionId, options);
```

**Options:**
| Option | Type | Description |
|--------|------|-------------|
| uploadDocText | string | Upload button text |
| addSignatureText | string | Add signature button text |
| exportText | string | Export button text |
| emptyText | string | Empty state message |
| signatureModalTitle | string | Modal title |
| typePlaceholder | string | Type input placeholder |

### Get Instance

```javascript
var instance = apexSignatureDocSign.instances['my_region_id'];

// Access properties
console.log(instance.currentPage);
console.log(instance.totalPages);
console.log(instance.signatures);
```

### Navigate Pages

```javascript
// Go to specific page
apexSignatureDocSign.goToPage('my_region_id', 3);
```

### Add Signature Programmatically

```javascript
// Show signature modal
apexSignatureDocSign.showSignatureModal('my_region_id');

// Or add directly with data URL
apexSignatureDocSign.addSignatureToDocument('my_region_id', dataUrl);
```

### Remove Signature

```javascript
apexSignatureDocSign.removeSignature('my_region_id', 'sig_123456');
```

### Export

```javascript
// Trigger export (downloads file)
apexSignatureDocSign.exportDocument('my_region_id');

// Get data URL
var dataUrl = apexSignatureDocSign.getSignedDocumentData('my_region_id');
```

## Dynamic Actions

### Available Events

| Event Name | When Triggered | Data |
|------------|----------------|------|
| `apexsignature-docsign-initialized` | Component ready | version |
| `apexsignature-document-loaded` | Document uploaded | fileName, fileType, fileSize |
| `apexsignature-signature-added` | Signature placed | signatureId, page |
| `apexsignature-signature-removed` | Signature deleted | signatureId |
| `apexsignature-document-exported` | Export completed | page, signatureCount |

### Example: Show Notification on Document Load

1. Create Dynamic Action on region
2. Event: **Document Loaded** (custom event name)
3. Action: Execute JavaScript

```javascript
apex.message.showPageSuccess(
    'Document loaded: ' + this.data.fileName
);
```

### Example: Track Signatures

```javascript
// Listen for signature events
document.addEventListener('apexsignature-signature-added', function(e) {
    console.log('Signature added:', e.detail.signatureId, 'on page', e.detail.page);
});
```

## Styling

### CSS Variables

The component uses Universal Theme CSS variables:

```css
/* Customize toolbar */
.apex-docsign-toolbar {
    background: var(--ut-component-background-color);
}

/* Customize buttons */
.apex-docsign-btn-primary {
    background: var(--ut-palette-primary);
}

/* Customize signature border */
.apex-docsign-signature.selected {
    border-color: var(--ut-palette-primary);
}
```

### Custom Styling Example

```css
/* Larger signature handles */
.apex-docsign-resize-handle {
    width: 16px;
    height: 16px;
}

/* Custom delete button color */
.apex-docsign-delete-btn {
    background: #ff6b6b;
}
```

## Use Cases

### 1. Contract Signing

```javascript
// Initialize for contracts
apexSignatureDocSign.init('contract_region', {
    uploadDocText: 'Upload Contract',
    addSignatureText: 'Sign Here',
    exportText: 'Download Signed Contract'
});
```

### 2. Form Approval

```javascript
// After form completion, load preview
var formPdf = generateFormPdf();
apexSignatureDocSign.loadDocument('approval_region', formPdf);
```

### 3. Batch Document Processing

```javascript
// Process multiple documents
documents.forEach(function(doc, index) {
    var regionId = 'doc_region_' + index;
    apexSignatureDocSign.init(regionId, options);
    apexSignatureDocSign.loadDocument(regionId, doc);
});
```

## Integration with APEX

### Saving to Database

```javascript
// After signing, get data and submit
var signedDoc = apexSignatureDocSign.getSignedDocumentData('my_region');

// Set to hidden item
$s('P1_SIGNED_DOCUMENT', signedDoc);

// Submit page
apex.submit('SAVE_DOCUMENT');
```

### PL/SQL Processing

```sql
DECLARE
    l_blob BLOB;
BEGIN
    -- Convert base64 to BLOB
    l_blob := apex_web_service.clobbase642blob(
        p_clob => :P1_SIGNED_DOCUMENT
    );

    -- Save to table
    INSERT INTO signed_documents (
        document_blob,
        signed_date,
        signed_by
    ) VALUES (
        l_blob,
        SYSDATE,
        :APP_USER
    );
END;
```

## Troubleshooting

### PDF Not Loading

1. Verify PDF.js is included
2. Check browser console for errors
3. Ensure PDF is valid and not corrupted

### Signatures Not Visible

1. Check if on correct page
2. Verify signature has valid data URL
3. Check z-index conflicts

### Export Issues

1. Ensure signatures are placed
2. Check browser download permissions
3. Verify canvas security (CORS)

### Performance

- Large PDFs may be slow to render
- Consider page-by-page loading
- Limit signature image sizes

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| PDF Rendering | 90+ | 88+ | 14+ | 90+ |
| Image Upload | 90+ | 88+ | 14+ | 90+ |
| Drag/Resize | 90+ | 88+ | 14+ | 90+ |
| Export | 90+ | 88+ | 14+ | 90+ |

## Limitations

1. **PDF Export**: Currently exports as PNG per page
2. **Large PDFs**: Performance may degrade with 50+ pages
3. **Signature Data**: Stored per page, not embedded in PDF structure
4. **Print Quality**: Export resolution matches screen resolution

## Future Enhancements

- Full PDF export with embedded signatures
- Signature fields detection
- Signature validation/verification
- Batch export all pages
- Undo/Redo for signature placement

---

**Author:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**Version:** 3.1.0
**Date:** 2025-12-23
