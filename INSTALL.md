# APEX Signature Plugin v2.0.1 - Installation Guide

## Quick Installation

### Option 1: Import Plugin File (Recommended)
1. Navigate to **Shared Components > Plug-ins**
2. Click **Import**
3. Select `region_type_plugin_de_danielh_apexsignature.sql`
4. Follow the wizard prompts
5. After import, edit the plugin and upload the JavaScript files:
   - `server/js/signature_pad.js` and `server/js/signature_pad.min.js`
   - `server/js/apexsignature.js` and `server/js/apexsignature.min.js`

### Option 2: Manual Installation

1. **Import the Plugin SQL**
   ```sql
   @region_type_plugin_de_danielh_apexsignature.sql
   ```

2. **Upload JavaScript Files**
   - Go to **Shared Components > Plug-ins > APEX Signature**
   - Click **Files** tab
   - Upload the following files to `js/` directory:
     - `signature_pad.js`
     - `signature_pad.min.js`
     - `apexsignature.js`
     - `apexsignature.min.js`

## Upgrading from v1.x

1. Export your existing plugin configuration (note your settings)
2. Delete the old plugin
3. Import the new v2.0.1 plugin
4. Reconfigure your regions with the saved settings
5. Test Dynamic Action events (fixed in v2.0.1)

## Compatibility

| Component | Supported Versions |
|-----------|-------------------|
| Oracle Database | 19c, 21c, 23ai |
| Oracle APEX | 19.2 - 24.2 |
| Browsers | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |

## New Features in v2.0.1

- **Page Items to Submit** (Issue #13): Submit page items with signature save
- **Fixed Dynamic Action Events** (Issues #20, #21): Events now fire correctly
- **ARIA Accessibility**: Screen reader support
- **Universal Theme Integration**: CSS variables for Dark Mode
- **signature_pad v5.0.4**: Pointer Events API for better touch support

## Usage Example

### Basic Setup

1. Create a Region of type **APEX Signature**
2. Set Width/Height (e.g., 600x400)
3. Add two buttons:
   - Clear: Static ID = `btn_clear`
   - Save: Static ID = `btn_save`
4. Configure:
   - Clear Button Selector: `#btn_clear`
   - Save Button Selector: `#btn_save`

### Using Page Items to Submit

1. In plugin settings, set **Page Items to Submit**: `P1_CUSTOMER_ID,P1_ORDER_ID`
2. In PL/SQL Code, access via bind variables:
   ```sql
   INSERT INTO signatures (customer_id, order_id, signature_blob)
   VALUES (:P1_CUSTOMER_ID, :P1_ORDER_ID, l_blob);
   ```

### Dynamic Actions

Create Dynamic Actions on the region for these events:
- **Signature saved to DB**: Triggered after successful save
- **Signature saved to DB Error**: Triggered on error
- **Signature cleared**: Triggered when cleared
- **Signature Initialized**: Triggered when plugin loads
- **Stroke Begin/End**: Triggered on pen strokes

## Programmatic API

```javascript
// Get region interface
var region = apex.region('my_signature_region');

// Check if empty
if (!region.isEmpty()) {
    // Get as PNG
    var dataUrl = region.toDataURL('image/png');

    // Get as SVG
    var svg = region.toSVG();

    // Clear
    region.clear();

    // Programmatic save
    region.save();
}
```

## Support

- GitHub: https://github.com/Dani3lSun/apex-plugin-apexsignature
- Original Author: Daniel Hochleitner
- Contributor (v2.0.1): Maxwell da Silva Oliveira - M&S do Brasil LTDA
