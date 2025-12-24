# APEX Signature - Timestamp Overlay Guide

**Version:** 3.4.0
**Author:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**LinkedIn:** /maxwbh

---

## Overview

The **Timestamp Overlay** module allows you to automatically add date, time, and audit information to signatures. This is essential for legal compliance, audit trails, and document authenticity.

### Key Features

- **Automatic Timestamp**: Add date/time when signature is saved
- **Multiple Positions**: Below, Right, Top-Right, Bottom-Right
- **Configurable Formats**: ISO, US, EU, BR, or custom
- **Audit Information**: IP address, geolocation, user name
- **Preview**: View signature with timestamp before saving
- **Metadata Export**: Complete audit trail for database storage

---

## Quick Start

### 1. Include Required Files

```html
<!-- Core signature files -->
<script src="#PLUGIN_PREFIX#js/signature_pad.min.js"></script>
<script src="#PLUGIN_PREFIX#js/apexsignature.js"></script>
<link rel="stylesheet" href="#PLUGIN_PREFIX#css/apexsignature.css">

<!-- Timestamp module -->
<script src="#PLUGIN_PREFIX#js/apexsignature-timestamp.js"></script>
<link rel="stylesheet" href="#PLUGIN_PREFIX#css/apexsignature-timestamp.css">
```

### 2. Initialize Timestamp

```javascript
apex.jQuery(document).on('apexsignature-initialized', '#YOUR_REGION_ID', function() {
    apexSignatureTimestamp.init('YOUR_REGION_ID', {
        enabled: true,
        position: 'below',
        format: 'DD/MM/YYYY HH:mm:ss',
        userName: '&APP_USER.'
    });
});
```

### 3. Basic Usage

1. Draw your signature
2. Toggle "Add Timestamp" checkbox (if needed)
3. Select position from dropdown
4. Click "Preview" to see result
5. Save - timestamp is automatically applied

---

## Configuration Options

### Full Configuration

```javascript
apexSignatureTimestamp.init('REGION_ID', {
    // Enable/disable
    enabled: true,              // Default: true

    // Position
    position: 'below',          // 'below', 'right', 'top-right', 'bottom-right'

    // Date/Time format
    format: 'DD/MM/YYYY HH:mm:ss',
    includeDate: true,          // Include date
    includeTime: true,          // Include time

    // Audit information
    includeUser: true,          // Include user name
    userName: 'John Doe',       // User name to display
    includeIP: true,            // Fetch and include IP address
    includeLocation: false,     // Request geolocation (requires permission)

    // Text styling
    fontSize: 12,               // Font size in pixels
    fontFamily: 'Arial, sans-serif',
    fontColor: '#666666',       // Gray color

    // Prefix/Suffix
    prefix: 'Signed:',          // Text before timestamp
    suffix: '',                 // Text after timestamp

    // UI Labels (for i18n)
    enableLabel: 'Add Timestamp',
    positionLabel: 'Position:',
    belowLabel: 'Below',
    rightLabel: 'Right',
    topRightLabel: 'Top Right',
    bottomRightLabel: 'Bottom Right',
    previewLabel: 'Preview',

    // Show/hide controls
    showPositionSelector: true  // Show position dropdown
});
```

---

## Position Options

### Below (Default)

Timestamp appears centered below the signature.

```
┌─────────────────────────┐
│                         │
│    [Signature Here]     │
│                         │
├─────────────────────────┤
│  24/12/2025 14:30:00    │
└─────────────────────────┘
```

### Right

Timestamp appears to the right of the signature.

```
┌─────────────────────────────────────────┐
│                         │               │
│    [Signature Here]     │ 24/12/2025    │
│                         │ 14:30:00      │
└─────────────────────────────────────────┘
```

### Top-Right

Timestamp overlays in the top-right corner.

```
┌─────────────────────────┐
│          24/12/2025 14:30:00 │
│                         │
│    [Signature Here]     │
│                         │
└─────────────────────────┘
```

### Bottom-Right

Timestamp overlays in the bottom-right corner.

```
┌─────────────────────────┐
│                         │
│    [Signature Here]     │
│                         │
│          24/12/2025 14:30:00 │
└─────────────────────────┘
```

---

## Date Format Tokens

| Token | Description | Example |
|-------|-------------|---------|
| YYYY | 4-digit year | 2025 |
| YY | 2-digit year | 25 |
| MM | Month (01-12) | 12 |
| DD | Day (01-31) | 24 |
| HH | Hour 24h (00-23) | 14 |
| hh | Hour 12h (01-12) | 02 |
| mm | Minutes (00-59) | 30 |
| ss | Seconds (00-59) | 45 |
| A | AM/PM uppercase | PM |
| a | am/pm lowercase | pm |

### Preset Formats

```javascript
// Brazilian
format: 'DD/MM/YYYY HH:mm:ss'  // 24/12/2025 14:30:45

// American
format: 'MM/DD/YYYY hh:mm:ss A'  // 12/24/2025 02:30:45 PM

// European
format: 'DD/MM/YYYY HH:mm:ss'  // 24/12/2025 14:30:45

// ISO
format: 'YYYY-MM-DD HH:mm:ss'  // 2025-12-24 14:30:45

// Short date only
format: 'YYYY-MM-DD'  // 2025-12-24

// Time only
format: 'HH:mm:ss'  // 14:30:45
```

---

## Audit Information

### IP Address

Fetches user's public IP address automatically:

```javascript
apexSignatureTimestamp.init('REGION_ID', {
    includeIP: true
});

// Result: "24/12/2025 14:30:00 | IP: 189.45.123.78"
```

**Note:** Uses the ipify.org API. For production, consider using your own endpoint.

### Geolocation

Requests user's location (requires browser permission):

```javascript
apexSignatureTimestamp.init('REGION_ID', {
    includeLocation: true
});

// Result: "24/12/2025 14:30:00 | Loc: -23.5505, -46.6333"
```

**Privacy Notice:** Always inform users when collecting location data.

### User Name

Includes the current user's name:

```javascript
apexSignatureTimestamp.init('REGION_ID', {
    includeUser: true,
    userName: '&APP_USER.'  // APEX substitution
});

// Result: "24/12/2025 14:30:00 | ADMIN"
```

### Combined Audit Trail

```javascript
apexSignatureTimestamp.init('REGION_ID', {
    includeUser: true,
    userName: 'John Doe',
    includeIP: true,
    includeLocation: true,
    prefix: 'Signed by'
});

// Result: "Signed by 24/12/2025 14:30:00 | John Doe | IP: 189.45.123.78 | Loc: -23.55, -46.63"
```

---

## API Reference

### Methods

#### init(regionId, options)
Initialize the timestamp module.

```javascript
apexSignatureTimestamp.init('R123_SIG', {
    enabled: true,
    position: 'below'
});
```

#### enable(regionId) / disable(regionId)
Enable or disable timestamp overlay.

```javascript
apexSignatureTimestamp.enable('R123_SIG');
apexSignatureTimestamp.disable('R123_SIG');
```

#### isEnabled(regionId)
Check if timestamp is enabled.

```javascript
if (apexSignatureTimestamp.isEnabled('R123_SIG')) {
    console.log('Timestamp will be added');
}
```

#### setPosition(regionId, position)
Set timestamp position.

```javascript
apexSignatureTimestamp.setPosition('R123_SIG', 'right');
// Options: 'below', 'right', 'top-right', 'bottom-right'
```

#### setFormat(regionId, format)
Set date/time format.

```javascript
apexSignatureTimestamp.setFormat('R123_SIG', 'YYYY-MM-DD HH:mm');
```

#### setUserName(regionId, userName)
Set the user name for audit.

```javascript
apexSignatureTimestamp.setUserName('R123_SIG', 'Jane Smith');
```

#### getMetadata(regionId)
Get complete audit metadata.

```javascript
var metadata = apexSignatureTimestamp.getMetadata('R123_SIG');
console.log(metadata);
// {
//   timestamp: "2025-12-24T14:30:00.000Z",
//   format: "DD/MM/YYYY HH:mm:ss",
//   position: "below",
//   userAgent: "Mozilla/5.0...",
//   userName: "ADMIN",
//   ipAddress: "189.45.123.78",
//   location: { latitude: -23.55, longitude: -46.63, accuracy: 100 }
// }
```

#### getSignatureWithTimestamp(regionId, callback)
Get signature image with timestamp applied.

```javascript
apexSignatureTimestamp.getSignatureWithTimestamp('R123_SIG', function(dataUrl) {
    if (dataUrl) {
        // Use the image with timestamp
        document.getElementById('preview').src = dataUrl;
    }
});
```

#### showPreview(regionId)
Open the preview modal.

```javascript
apexSignatureTimestamp.showPreview('R123_SIG');
```

---

## Dynamic Action Events

### Available Events

| Event Name | Fired When |
|------------|------------|
| `apexsignature-timestamp-initialized` | Module initialized |
| `apexsignature-timestamp-toggled` | Enabled/disabled |
| `apexsignature-timestamp-position-changed` | Position changed |
| `apexsignature-ip-fetched` | IP address retrieved |
| `apexsignature-location-fetched` | Geolocation retrieved |
| `apexsignature-timestamp-preview-shown` | Preview modal opened |

### Event Data Examples

```javascript
// Timestamp Toggled
{ enabled: true }

// Position Changed
{ position: 'right' }

// IP Fetched
{ ip: '189.45.123.78' }

// Location Fetched
{ location: { latitude: -23.55, longitude: -46.63, accuracy: 100 } }
```

---

## Integration with Save

The timestamp module automatically hooks into the signature save process. When a signature is saved:

1. If timestamp is enabled, it adds the timestamp overlay to the image
2. It includes audit metadata in the save request

### Accessing Metadata on Server

In your PL/SQL AJAX callback, you can access metadata:

```sql
DECLARE
    l_metadata CLOB;
BEGIN
    -- Metadata is passed in the options
    l_metadata := APEX_APPLICATION.G_X01;

    -- Parse and store for audit
    INSERT INTO signature_audit (
        signature_id,
        signed_at,
        ip_address,
        user_agent,
        user_name
    ) VALUES (
        :P1_SIGNATURE_ID,
        SYSTIMESTAMP,
        JSON_VALUE(l_metadata, '$.ipAddress'),
        JSON_VALUE(l_metadata, '$.userAgent'),
        JSON_VALUE(l_metadata, '$.userName')
    );
END;
```

---

## Styling Customization

### Font Customization

```javascript
apexSignatureTimestamp.init('R123_SIG', {
    fontSize: 14,
    fontFamily: 'Courier New, monospace',
    fontColor: '#333333'
});
```

### Using Custom Fonts

```html
<!-- Load Google Font -->
<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet">

<script>
apexSignatureTimestamp.init('R123_SIG', {
    fontFamily: 'Roboto Mono, monospace'
});
</script>
```

### CSS Customization

```css
/* Custom toggle style */
.apex-sig-timestamp-toggle input[type="checkbox"] {
    accent-color: #00897b;
}

/* Custom button style */
.apex-sig-timestamp-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
}

/* Custom modal */
.apex-sig-timestamp-modal-content {
    border-radius: 16px;
}
```

---

## Use Cases

### Legal Documents

```javascript
apexSignatureTimestamp.init('R123_SIG', {
    enabled: true,
    position: 'below',
    format: 'DD/MM/YYYY HH:mm:ss',
    includeUser: true,
    userName: '&APP_USER.',
    includeIP: true,
    prefix: 'Digitally signed by',
    fontColor: '#000000'
});
```

### Medical Records

```javascript
apexSignatureTimestamp.init('R123_SIG', {
    enabled: true,
    position: 'bottom-right',
    format: 'YYYY-MM-DD HH:mm:ss',
    includeUser: true,
    userName: apex.item('P1_DOCTOR_NAME').getValue(),
    prefix: 'Dr.',
    suffix: '(Digital Signature)'
});
```

### Financial Approvals

```javascript
apexSignatureTimestamp.init('R123_SIG', {
    enabled: true,
    position: 'below',
    format: 'DD/MM/YYYY HH:mm:ss',
    includeUser: true,
    includeIP: true,
    includeLocation: true,  // For compliance
    userName: '&APP_USER.',
    prefix: 'Approved:'
});
```

---

## Internationalization

### Using APEX Text Messages

```javascript
apexSignatureTimestamp.init('R123_SIG', {
    enableLabel: apex.lang.getMessage('APEX_SIG_ADD_TIMESTAMP'),
    positionLabel: apex.lang.getMessage('APEX_SIG_POSITION'),
    belowLabel: apex.lang.getMessage('APEX_SIG_BELOW'),
    rightLabel: apex.lang.getMessage('APEX_SIG_RIGHT'),
    topRightLabel: apex.lang.getMessage('APEX_SIG_TOP_RIGHT'),
    bottomRightLabel: apex.lang.getMessage('APEX_SIG_BOTTOM_RIGHT'),
    previewLabel: apex.lang.getMessage('APEX_SIG_PREVIEW'),
    prefix: apex.lang.getMessage('APEX_SIG_SIGNED_PREFIX')
});
```

---

## Security Considerations

1. **IP Address**: Consider privacy regulations (GDPR, LGPD) when storing IP addresses
2. **Geolocation**: Always request explicit consent before enabling location tracking
3. **User Name**: Validate user identity server-side, don't rely solely on client-side data
4. **Metadata Integrity**: Consider signing or hashing metadata to prevent tampering

---

## Troubleshooting

### IP Not Fetching

1. Check network connectivity
2. Verify ipify.org is not blocked
3. Check browser console for errors

```javascript
// Manual IP check
fetch('https://api.ipify.org?format=json')
    .then(r => r.json())
    .then(d => console.log('IP:', d.ip));
```

### Location Not Working

1. Check browser permissions
2. Verify HTTPS (geolocation requires secure context)
3. User may have denied permission

```javascript
// Check geolocation support
if (navigator.geolocation) {
    console.log('Geolocation supported');
} else {
    console.log('Geolocation not supported');
}
```

### Timestamp Not Appearing

1. Verify module is initialized after apexSignature
2. Check if enabled is true
3. Verify signature is not empty before preview

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
| 3.4.0 | 2025-12-24 | Initial release of Timestamp Overlay module |

---

**Author:** Maxwell da Silva Oliveira
**Company:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
