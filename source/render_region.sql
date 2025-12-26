/*-------------------------------------
 * APEX Signature
 * Version: 3.0.0 (2025)
 * Original Author: Daniel Hochleitner
 * Contributor: Maxwell da Silva Oliveira - M&S do Brasil LTDA
 * LinkedIn: /maxwbh
 *
 * Updated for Oracle 23ai and APEX 24.2 compatibility
 * NEW: Multi-Input Capture (Draw, Upload, Webcam)
 *-------------------------------------
*/

/**
 * Render function for APEX Signature Region Plugin
 *
 * Compatibility:
 * - Oracle Database: 19c, 21c, 23ai
 * - Oracle APEX: 19.2 - 24.2
 *
 * Changes for v3.0.0:
 * - Added Multi-Input Capture modes (Draw, Upload, Webcam)
 * - Added CSS file for styling
 * - New attribute_14: Capture Mode
 */
FUNCTION render_apexsignature(p_region              IN apex_plugin.t_region,
                              p_plugin              IN apex_plugin.t_plugin,
                              p_is_printer_friendly IN BOOLEAN)
  RETURN apex_plugin.t_region_render_result IS
  -- plugin attributes
  l_width              NUMBER := p_region.attribute_01;
  l_height             NUMBER := p_region.attribute_02;
  l_line_minwidth      VARCHAR2(50) := p_region.attribute_03;
  l_line_maxwidth      VARCHAR2(50) := p_region.attribute_04;
  l_background_color   VARCHAR2(100) := p_region.attribute_05;
  l_pen_color          VARCHAR2(100) := p_region.attribute_06;
  l_logging            VARCHAR2(50) := p_region.attribute_08;
  l_clear_btn_selector VARCHAR2(100) := p_region.attribute_09;
  l_save_btn_selector  VARCHAR2(100) := p_region.attribute_10;
  l_alert_text         VARCHAR2(200) := p_region.attribute_11;
  l_show_spinner       VARCHAR2(50) := p_region.attribute_12;
  l_page_items         VARCHAR2(4000) := p_region.attribute_13;
  l_capture_mode       VARCHAR2(50) := p_region.attribute_14; -- NEW: Capture Mode
  -- other variables
  l_region_id              VARCHAR2(200);
  l_canvas_id              VARCHAR2(200);
  l_background_color_esc   VARCHAR2(100);
  l_pen_color_esc          VARCHAR2(100);
  l_clear_btn_selector_esc VARCHAR2(100);
  l_save_btn_selector_esc  VARCHAR2(100);
  l_alert_text_esc         VARCHAR2(200);
  l_page_items_esc         VARCHAR2(4000);
  l_capture_mode_esc       VARCHAR2(50);
  -- js/css file vars
  l_signaturepad_js  VARCHAR2(50);
  l_apexsignature_js VARCHAR2(50);
  l_apexsignature_css VARCHAR2(50);
  --
BEGIN
  -- Debug
  IF apex_application.g_debug THEN
    apex_plugin_util.debug_region(p_plugin => p_plugin,
                                  p_region => p_region);
    -- set js/css filenames (non-minified for debugging)
    l_apexsignature_js  := 'apexsignature';
    l_signaturepad_js   := 'signature_pad';
    l_apexsignature_css := 'apexsignature';
  ELSE
    -- use minified versions in production
    l_apexsignature_js  := 'apexsignature.min';
    l_signaturepad_js   := 'signature_pad.min';
    l_apexsignature_css := 'apexsignature'; -- CSS not minified
  END IF;

  -- set variables and defaults
  l_region_id    := apex_escape.html_attribute(p_region.static_id || '_signature');
  l_canvas_id    := l_region_id || '_canvas';
  l_logging      := NVL(l_logging, 'false');
  l_show_spinner := NVL(l_show_spinner, 'false');
  l_capture_mode := NVL(l_capture_mode, 'draw'); -- default to draw only

  -- escape input using apex_escape (Oracle 23ai / APEX 24.2 recommended approach)
  l_background_color_esc   := apex_escape.html(l_background_color);
  l_pen_color_esc          := apex_escape.html(l_pen_color);
  l_clear_btn_selector_esc := apex_escape.html(l_clear_btn_selector);
  l_save_btn_selector_esc  := apex_escape.html(l_save_btn_selector);
  l_alert_text_esc         := apex_escape.html(l_alert_text);
  l_page_items_esc         := apex_escape.html(l_page_items);
  l_capture_mode_esc       := apex_escape.html(l_capture_mode);

  --
  -- add div container for signature pad (content built by JS for multi-input)
  sys.htp.p('<div id="' || l_region_id || '" class="apex-signature-container"');
  sys.htp.p(' role="application"');
  sys.htp.p(' aria-label="' || apex_escape.html_attribute(NVL(p_region.name, 'Signature Area')) || '">');
  sys.htp.p('</div>');

  --
  -- add CSS file
  apex_css.add_file(
    p_name      => l_apexsignature_css,
    p_directory => p_plugin.file_prefix || 'css/'
  );

  --
  -- add signaturepad and apexsignature js files
  apex_javascript.add_library(
    p_name           => l_signaturepad_js,
    p_directory      => p_plugin.file_prefix || 'js/',
    p_version        => NULL,
    p_skip_extension => FALSE
  );

  apex_javascript.add_library(
    p_name           => l_apexsignature_js,
    p_directory      => p_plugin.file_prefix || 'js/',
    p_version        => NULL,
    p_skip_extension => FALSE
  );

  --
  -- onload code - initialize the signature pad with multi-input support
  apex_javascript.add_onload_code(
    p_code => 'apexSignature.apexSignatureFnc(' ||
              apex_javascript.add_value(p_region.static_id) || '{' ||
              apex_javascript.add_attribute('ajaxIdentifier', apex_plugin.get_ajax_identifier) ||
              apex_javascript.add_attribute('canvasId', l_canvas_id) ||
              apex_javascript.add_attribute('width', l_width) ||
              apex_javascript.add_attribute('height', l_height) ||
              apex_javascript.add_attribute('lineMinWidth', l_line_minwidth) ||
              apex_javascript.add_attribute('lineMaxWidth', l_line_maxwidth) ||
              apex_javascript.add_attribute('backgroundColor', l_background_color_esc) ||
              apex_javascript.add_attribute('penColor', l_pen_color_esc) ||
              apex_javascript.add_attribute('clearButton', l_clear_btn_selector_esc) ||
              apex_javascript.add_attribute('saveButton', l_save_btn_selector_esc) ||
              apex_javascript.add_attribute('emptyAlert', l_alert_text_esc) ||
              apex_javascript.add_attribute('showSpinner', l_show_spinner) ||
              apex_javascript.add_attribute('pageItems', l_page_items_esc) ||
              apex_javascript.add_attribute('captureMode', l_capture_mode_esc) ||
              apex_javascript.add_attribute('ariaLabel', apex_escape.html_attribute(NVL(p_region.name, 'Signature Area')), FALSE, FALSE) ||
              '},' ||
              apex_javascript.add_value(l_logging, FALSE) || ');'
  );
  --
  RETURN NULL;
  --
END render_apexsignature;
--
--
-- AJAX function
--
--
FUNCTION ajax_apexsignature(p_region IN apex_plugin.t_region,
                            p_plugin IN apex_plugin.t_plugin)
  RETURN apex_plugin.t_region_ajax_result IS
  --
  -- plugin attributes
  l_result     apex_plugin.t_region_ajax_result;
  l_plsql_code p_region.attribute_07%TYPE := p_region.attribute_07;
  --
BEGIN
  -- execute PL/SQL code (user-defined processing)
  -- The PL/SQL code has access to:
  --   apex_application.g_f01 - Array of base64 chunks
  --   Page items if "Page Items to Submit" was configured
  apex_plugin_util.execute_plsql_code(p_plsql_code => l_plsql_code);
  --
  -- Return success response
  sys.htp.p('{"success":true}');
  --
  RETURN NULL;
  --
END ajax_apexsignature;


/*-------------------------------------
 * Default PL/SQL Code for attribute_07
 * (This is the default code that processes the signature)
 *
 * Updated for Oracle 23ai compatibility:
 * - Uses apex_application.g_f01 instead of wwv_flow.g_f01
 * - Compatible with APEX 19.2 - 24.2
 *-------------------------------------
*/
/*
DECLARE
  -- Variables
  l_collection_name VARCHAR2(100);
  l_clob            CLOB;
  l_blob            BLOB;
  l_filename        VARCHAR2(100);
  l_mime_type       VARCHAR2(100);
  l_token           VARCHAR2(32000);
  --
BEGIN
  -- Set defaults
  l_filename  := 'signature_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '.png';
  l_mime_type := 'image/png';

  -- Build CLOB from f01 30k Array
  DBMS_LOB.createtemporary(l_clob, FALSE, DBMS_LOB.SESSION);

  FOR i IN 1 .. apex_application.g_f01.COUNT LOOP
    l_token := apex_application.g_f01(i);

    IF LENGTH(l_token) > 0 THEN
      DBMS_LOB.writeappend(l_clob, LENGTH(l_token), l_token);
    END IF;
  END LOOP;

  -- Convert base64 CLOB to BLOB
  l_blob := apex_web_service.clobbase642blob(p_clob => l_clob);

  -- Create collection
  l_collection_name := 'APEX_SIGNATURE';

  IF NOT apex_collection.collection_exists(p_collection_name => l_collection_name) THEN
    apex_collection.create_collection(l_collection_name);
  END IF;

  -- Add collection member
  IF DBMS_LOB.getlength(lob_loc => l_blob) IS NOT NULL THEN
    apex_collection.add_member(
      p_collection_name => l_collection_name,
      p_c001            => l_filename,
      p_c002            => l_mime_type,
      p_d001            => SYSDATE,
      p_blob001         => l_blob
    );
  END IF;

  -- Cleanup
  IF DBMS_LOB.istemporary(l_clob) = 1 THEN
    DBMS_LOB.freetemporary(l_clob);
  END IF;
END;
*/
