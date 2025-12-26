# Test Plan - APEX Signature v3.0.0 Multi-Input Capture

## Version Information

| Field | Value |
|-------|-------|
| Version | 3.0.0 |
| Feature | Multi-Input Capture (Draw, Upload, Webcam) |
| Author | Maxwell da Silva Oliveira |
| Date | 2025-12-23 |

---

## Test Environment Requirements

### Browsers
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

### APEX Versions
- Oracle APEX 19.2 - 24.2

### Database Versions
- Oracle 19c, 21c, 23ai

### Hardware
- Desktop with webcam (for webcam tests)
- Touch device (tablet/phone) for touch tests

---

## Test Cases

### TC-001: Draw Mode - Basic Functionality

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Configure plugin with Capture Mode = "Draw Only" | Plugin renders with canvas only, no tabs |
| 2 | Draw signature on canvas with mouse | Signature appears on canvas |
| 3 | Click Clear button | Canvas is cleared |
| 4 | Draw signature and click Save | Signature saved to database |
| 5 | Verify Dynamic Action "Signature saved to DB" fires | DA executes correctly |

**Status:** [ ] Pass / [ ] Fail

---

### TC-002: Draw Mode - Touch Device

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open page on touch device (tablet/phone) | Plugin renders correctly |
| 2 | Draw signature with finger | Signature appears smoothly |
| 3 | Draw with stylus (if available) | Pressure sensitivity works |
| 4 | Verify touch-action: none prevents scrolling | Page doesn't scroll while drawing |

**Status:** [ ] Pass / [ ] Fail

---

### TC-003: Upload Mode - Basic Functionality

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Configure plugin with Capture Mode = "Draw + Upload" | Two tabs appear: Draw and Upload |
| 2 | Click Upload tab | Upload panel is shown |
| 3 | Click upload zone | File dialog opens |
| 4 | Select PNG image | Image preview appears |
| 5 | Click X button | Image is removed, upload zone returns |
| 6 | Upload image and click Save | Image saved to database |

**Status:** [ ] Pass / [ ] Fail

---

### TC-004: Upload Mode - Drag and Drop

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Upload tab | Upload zone visible |
| 2 | Drag image file over upload zone | Zone highlights (dragover effect) |
| 3 | Drop image file | Image preview appears |
| 4 | Verify "apexsignature-image-uploaded" event fires | Event triggered with file info |

**Status:** [ ] Pass / [ ] Fail

---

### TC-005: Upload Mode - File Validation

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Try to upload non-image file (PDF, TXT) | Alert message: "Please select an image file" |
| 2 | Upload PNG file | Accepted |
| 3 | Upload JPG file | Accepted |
| 4 | Upload GIF file | Accepted |
| 5 | Upload SVG file | Accepted |

**Status:** [ ] Pass / [ ] Fail

---

### TC-006: Webcam Mode - Basic Functionality

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Configure plugin with Capture Mode = "All" | Three tabs appear: Draw, Upload, Webcam |
| 2 | Click Webcam tab | Webcam permission prompt appears |
| 3 | Allow webcam permission | Video stream displays |
| 4 | Click Capture button | Image captured, preview shown |
| 5 | Click X button | Preview removed, video stream restarts |
| 6 | Capture and click Save | Image saved to database |

**Status:** [ ] Pass / [ ] Fail

---

### TC-007: Webcam Mode - Permission Denied

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click Webcam tab | Permission prompt appears |
| 2 | Deny webcam permission | Alert message about permission |
| 3 | Verify "apexsignature-webcam-error" event fires | Event triggered with error message |

**Status:** [ ] Pass / [ ] Fail

---

### TC-008: Webcam Mode - No Webcam Available

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Use device without webcam | Webcam tab can still be shown |
| 2 | Click Webcam tab | Alert message: "Webcam is not supported" |

**Status:** [ ] Pass / [ ] Fail

---

### TC-009: Tab Switching

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Configure with Capture Mode = "All" | Three tabs visible |
| 2 | Click Upload tab | Upload panel shown, Draw panel hidden |
| 3 | Click Webcam tab | Webcam panel shown, webcam starts |
| 4 | Click Draw tab | Draw panel shown, webcam stops |
| 5 | Verify "apexsignature-mode-changed" event fires | Event triggered with mode name |

**Status:** [ ] Pass / [ ] Fail

---

### TC-010: Data Persistence Across Modes

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Draw signature in Draw mode | Signature on canvas |
| 2 | Switch to Upload mode | Signature preserved in Draw |
| 3 | Upload image | Image preview shown |
| 4 | Switch back to Draw mode | Original signature still there |
| 5 | Click Save | Currently active mode's data is saved |

**Status:** [ ] Pass / [ ] Fail

---

### TC-011: Clear Button - All Modes

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Draw signature, click Clear | Canvas cleared |
| 2 | Upload image, click Clear | Image removed |
| 3 | Capture webcam, click Clear | Capture cleared, video restarts |
| 4 | Verify "apexsignature-cleared" event fires | Event triggered with mode info |

**Status:** [ ] Pass / [ ] Fail

---

### TC-012: isEmpty() API - All Modes

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Call `apex.region('id').isEmpty()` with empty canvas | Returns true |
| 2 | Draw signature, call isEmpty() | Returns false |
| 3 | Clear, call isEmpty() | Returns true |
| 4 | Upload image, call isEmpty() | Returns false |
| 5 | Capture webcam, call isEmpty() | Returns false |

**Status:** [ ] Pass / [ ] Fail

---

### TC-013: toDataURL() API - All Modes

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Draw signature, call `apex.region('id').toDataURL()` | Returns data:image/png... string |
| 2 | Upload image, call toDataURL() | Returns uploaded image as data URL |
| 3 | Capture webcam, call toDataURL() | Returns captured image as data URL |
| 4 | Empty state, call toDataURL() | Returns null |

**Status:** [ ] Pass / [ ] Fail

---

### TC-014: setMode() / getMode() API

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Call `apex.region('id').getMode()` | Returns current mode ('draw', 'upload', or 'webcam') |
| 2 | Call `apex.region('id').setMode('upload')` | Switches to upload mode |
| 3 | Call getMode() again | Returns 'upload' |
| 4 | Call setMode('webcam') | Switches to webcam, starts video |

**Status:** [ ] Pass / [ ] Fail

---

### TC-015: Universal Theme Integration

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enable Dark Mode in Universal Theme | Plugin adapts to dark colors |
| 2 | Verify tabs use UT CSS variables | Colors match theme |
| 3 | Verify upload zone uses UT colors | Consistent styling |
| 4 | Switch theme, verify plugin updates | Responsive to theme changes |

**Status:** [ ] Pass / [ ] Fail

---

### TC-016: Accessibility - Keyboard Navigation

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tab to plugin region | Focus visible on first tab |
| 2 | Press Enter on tab | Mode switches |
| 3 | Tab to canvas | Canvas receives focus |
| 4 | Tab to buttons | Clear/Save buttons focusable |
| 5 | Verify ARIA labels | Screen reader announces correctly |

**Status:** [ ] Pass / [ ] Fail

---

### TC-017: Responsive Design

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View on desktop (1920x1080) | Full layout with icons |
| 2 | View on tablet (768px) | Tabs still visible |
| 3 | View on mobile (375px) | Tabs compact, icons may hide |
| 4 | Resize window dynamically | Layout adjusts smoothly |

**Status:** [ ] Pass / [ ] Fail

---

### TC-018: Multiple Instances on Same Page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add two APEX Signature regions | Both render correctly |
| 2 | Draw on first region | Second region unaffected |
| 3 | Switch mode on second region | First region unaffected |
| 4 | Save both independently | Each saves to correct collection |

**Status:** [ ] Pass / [ ] Fail

---

### TC-019: Page Items to Submit with Multi-Input

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Configure Page Items to Submit: P1_CUSTOMER_ID | Setting saved |
| 2 | Set P1_CUSTOMER_ID = 123 | Value set |
| 3 | Draw signature and save | PL/SQL can access :P1_CUSTOMER_ID |
| 4 | Upload image and save | Same - page item accessible |
| 5 | Capture webcam and save | Same - page item accessible |

**Status:** [ ] Pass / [ ] Fail

---

### TC-020: Dynamic Actions - New Events

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create DA on "Signature Initialized" | Fires on page load |
| 2 | Create DA on "Mode Changed" | Fires when switching tabs |
| 3 | Create DA on "Image Uploaded" | Fires when file uploaded |
| 4 | Create DA on "Webcam Captured" | Fires when photo taken |
| 5 | Create DA on "Webcam Started" | Fires when video stream begins |

**Status:** [ ] Pass / [ ] Fail

---

## Test Summary

| Category | Total | Pass | Fail |
|----------|-------|------|------|
| Draw Mode | 2 | | |
| Upload Mode | 3 | | |
| Webcam Mode | 3 | | |
| Tab Switching | 2 | | |
| API Tests | 3 | | |
| UI/UX | 3 | | |
| Integration | 4 | | |
| **Total** | **20** | | |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA Tester | | | |
| Product Owner | | | |

---

## Notes

- Webcam tests require HTTPS in production (browser security requirement)
- Touch tests require physical touch device
- Pressure sensitivity requires compatible stylus (Apple Pencil, Surface Pen, etc.)
