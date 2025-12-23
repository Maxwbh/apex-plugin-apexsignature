# Test Plan - APEX Signature v3.1.0 Document Signing

## Version Information

| Field | Value |
|-------|-------|
| Version | 3.1.0 |
| Feature | Document Signing (PDF Overlay) |
| Author | Maxwell da Silva Oliveira |
| Date | 2025-12-23 |

---

## Test Environment Requirements

### Browsers
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

### Libraries Required
- PDF.js (for PDF rendering)
- signature_pad v5.0.4

### APEX Versions
- Oracle APEX 19.2 - 24.2

---

## Test Cases

### TC-001: Document Upload - PDF

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Upload Document" button | File dialog opens |
| 2 | Select a PDF file | PDF loads and displays |
| 3 | Verify page navigation appears | "Page 1 of X" shown |
| 4 | Verify "Add Signature" button enabled | Button becomes clickable |
| 5 | Verify "Export" button enabled | Button becomes clickable |

**Status:** [ ] Pass / [ ] Fail

---

### TC-002: Document Upload - Image

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Upload Document" button | File dialog opens |
| 2 | Select PNG/JPG image | Image loads and displays |
| 3 | Verify page info shows "Page 1 of 1" | Single page shown |
| 4 | Verify image scales to fit container | Image properly sized |

**Status:** [ ] Pass / [ ] Fail

---

### TC-003: Document Upload - Drag and Drop

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Drag PDF/image over empty state area | Visual feedback on drop zone |
| 2 | Drop file | Document loads |
| 3 | Verify "apexsignature-document-loaded" event | Event fires with file info |

**Status:** [ ] Pass / [ ] Fail

---

### TC-004: PDF Page Navigation

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Upload multi-page PDF | PDF loads on page 1 |
| 2 | Click Next Page button | Page 2 displays |
| 3 | Verify page info updates | "Page 2 of X" shown |
| 4 | Click Previous Page button | Page 1 displays |
| 5 | Verify buttons disable at boundaries | Prev disabled on page 1, Next disabled on last page |

**Status:** [ ] Pass / [ ] Fail

---

### TC-005: Add Signature - Draw Mode

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Signature" button | Modal opens |
| 2 | Verify Draw tab is active | Draw panel visible |
| 3 | Draw signature on canvas | Signature appears |
| 4 | Click "Clear" button | Canvas cleared |
| 5 | Draw signature and click "Apply" | Modal closes, signature on document |

**Status:** [ ] Pass / [ ] Fail

---

### TC-006: Add Signature - Type Mode

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Signature" button | Modal opens |
| 2 | Click "Type" tab | Type panel visible |
| 3 | Type name in input field | Preview updates with typed text |
| 4 | Change font style | Preview updates with new font |
| 5 | Click "Apply Signature" | Typed signature added to document |

**Status:** [ ] Pass / [ ] Fail

---

### TC-007: Add Signature - Upload Mode

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Signature" button | Modal opens |
| 2 | Click "Upload" tab | Upload panel visible |
| 3 | Click upload zone | File dialog opens |
| 4 | Select image file | Image preview shown |
| 5 | Click X to remove | Upload zone returns |
| 6 | Upload and click "Apply" | Signature added to document |

**Status:** [ ] Pass / [ ] Fail

---

### TC-008: Signature Positioning - Drag

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add signature to document | Signature appears at default position |
| 2 | Click and drag signature | Signature moves with cursor |
| 3 | Release mouse | Signature stays at new position |
| 4 | Drag to edge of document | Signature constrained to document bounds |

**Status:** [ ] Pass / [ ] Fail

---

### TC-009: Signature Positioning - Resize

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Hover over signature | Resize handle appears |
| 2 | Click and drag resize handle | Signature resizes |
| 3 | Verify minimum size limit | Cannot resize below minimum |
| 4 | Release mouse | New size maintained |

**Status:** [ ] Pass / [ ] Fail

---

### TC-010: Signature Selection

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on signature | Signature shows selection border |
| 2 | Click elsewhere | Selection removed |
| 3 | Add multiple signatures | Each can be selected independently |

**Status:** [ ] Pass / [ ] Fail

---

### TC-011: Signature Deletion - Button

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Hover over signature | Delete button (X) appears |
| 2 | Click delete button | Signature removed |
| 3 | Verify "apexsignature-signature-removed" event | Event fires with signature ID |

**Status:** [ ] Pass / [ ] Fail

---

### TC-012: Signature Deletion - Keyboard

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Select signature | Signature highlighted |
| 2 | Press Delete key | Signature removed |

**Status:** [ ] Pass / [ ] Fail

---

### TC-013: Multiple Signatures

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add first signature | Signature 1 appears |
| 2 | Add second signature | Signature 2 appears |
| 3 | Reposition both independently | Each moves separately |
| 4 | Delete one | Other remains unaffected |

**Status:** [ ] Pass / [ ] Fail

---

### TC-014: Signatures on Multiple Pages

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Upload multi-page PDF | PDF loads |
| 2 | Add signature on page 1 | Signature visible on page 1 |
| 3 | Navigate to page 2 | Page 1 signature hidden |
| 4 | Add signature on page 2 | Signature visible on page 2 |
| 5 | Navigate back to page 1 | Page 1 signature visible again |

**Status:** [ ] Pass / [ ] Fail

---

### TC-015: Export Signed Document

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add signature(s) to document | Signatures placed |
| 2 | Click "Export" button | Download starts |
| 3 | Verify downloaded file | PNG with signatures embedded |
| 4 | Verify "apexsignature-document-exported" event | Event fires |

**Status:** [ ] Pass / [ ] Fail

---

### TC-016: Modal Cancel

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Signature" | Modal opens |
| 2 | Draw/type signature | Signature created |
| 3 | Click "Cancel" | Modal closes, no signature added |
| 4 | Click X button | Modal closes |

**Status:** [ ] Pass / [ ] Fail

---

### TC-017: Empty Validation

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open signature modal | Modal opens |
| 2 | Click "Apply" without creating signature | Alert: "Please create a signature" |
| 3 | Click "Export" without signatures | Alert: "No signatures added" |

**Status:** [ ] Pass / [ ] Fail

---

### TC-018: Font Loading

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open signature modal | Modal opens |
| 2 | Switch to Type tab | Type panel visible |
| 3 | Type text and change fonts | All fonts render correctly |
| 4 | Verify Google Fonts loaded | Font styles applied |

**Status:** [ ] Pass / [ ] Fail

---

### TC-019: Dark Mode

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enable dark mode | Theme changes |
| 2 | Verify toolbar colors | Adapts to dark theme |
| 3 | Verify modal colors | Consistent dark styling |
| 4 | Verify buttons and inputs | All elements visible |

**Status:** [ ] Pass / [ ] Fail

---

### TC-020: Responsive Design

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View on desktop | Full layout with text |
| 2 | Resize to tablet (768px) | Layout adjusts |
| 3 | Resize to mobile (375px) | Compact toolbar, modal fits |
| 4 | Open modal on mobile | Modal scrollable if needed |

**Status:** [ ] Pass / [ ] Fail

---

### TC-021: Document Replace

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Upload first document | Document displays |
| 2 | Add signatures | Signatures placed |
| 3 | Upload new document | New document replaces old |
| 4 | Verify signatures cleared | Old signatures removed |

**Status:** [ ] Pass / [ ] Fail

---

### TC-022: JavaScript API

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Call `apexSignatureDocSign.init()` | Initializes component |
| 2 | Load document programmatically | Document displays |
| 3 | Call `getSignedDocumentData()` | Returns data URL |
| 4 | Verify event callbacks | All events trigger properly |

**Status:** [ ] Pass / [ ] Fail

---

## Test Summary

| Category | Total | Pass | Fail |
|----------|-------|------|------|
| Document Upload | 3 | | |
| Page Navigation | 1 | | |
| Signature Creation | 3 | | |
| Signature Manipulation | 4 | | |
| Multi-Signature | 2 | | |
| Export | 1 | | |
| Validation | 2 | | |
| UI/UX | 4 | | |
| API | 2 | | |
| **Total** | **22** | | |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA Tester | | | |
| Product Owner | | | |

---

## Notes

- PDF.js must be included for PDF support
- Google Fonts requires internet connection for type signatures
- Export currently outputs PNG per page (not combined PDF)
- Multi-page PDF export requires iterating through pages
