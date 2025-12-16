set define off verify off feedback off
whenever sqlerror exit sql.sqlcode rollback
--------------------------------------------------------------------------------
--
-- ORACLE Application Express (APEX) export file
--
-- APEX Signature Plugin v2.0.1
-- Updated for Oracle 23ai and APEX 24.2 compatibility
--
-- Original Author: Daniel Hochleitner
-- Contributor: Maxwell da Silva Oliveira - M&S do Brasil LTDA
-- LinkedIn: /maxwbh
--
-- NOTE: Calls to apex_application_install override the defaults below.
--
--------------------------------------------------------------------------------
begin
wwv_flow_api.import_begin (
 p_version_yyyy_mm_dd=>'2013.01.01'
,p_release=>'5.0.3.00.03'
,p_default_workspace_id=>42937890966776491
,p_default_application_id=>600
,p_default_owner=>'APEX_PLUGIN'
);
end;
/
prompt --application/ui_types
begin
null;
end;
/
prompt --application/shared_components/plugins/region_type/de_danielh_apexsignature
begin
wwv_flow_api.create_plugin(
 p_id=>wwv_flow_api.id(49367804509412209)
,p_plugin_type=>'REGION TYPE'
,p_name=>'DE.DANIELH.APEXSIGNATURE'
,p_display_name=>'APEX Signature'
,p_supported_ui_types=>'DESKTOP'
,p_plsql_code=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'/*-------------------------------------',
' * APEX Signature',
' * Version: 2.0.1 (2025)',
' * Original Author: Daniel Hochleitner',
' * Contributor: Maxwell da Silva Oliveira - M&S do Brasil LTDA',
' * LinkedIn: /maxwbh',
' *',
' * Updated for Oracle 23ai and APEX 24.2 compatibility',
' *-------------------------------------',
'*/',
'FUNCTION render_apexsignature(p_region              IN apex_plugin.t_region,',
'                              p_plugin              IN apex_plugin.t_plugin,',
'                              p_is_printer_friendly IN BOOLEAN)',
'  RETURN apex_plugin.t_region_render_result IS',
'  -- plugin attributes',
'  l_width              NUMBER := p_region.attribute_01;',
'  l_height             NUMBER := p_region.attribute_02;',
'  l_line_minwidth      VARCHAR2(50) := p_region.attribute_03;',
'  l_line_maxwidth      VARCHAR2(50) := p_region.attribute_04;',
'  l_background_color   VARCHAR2(100) := p_region.attribute_05;',
'  l_pen_color          VARCHAR2(100) := p_region.attribute_06;',
'  l_logging            VARCHAR2(50) := p_region.attribute_08;',
'  l_clear_btn_selector VARCHAR2(100) := p_region.attribute_09;',
'  l_save_btn_selector  VARCHAR2(100) := p_region.attribute_10;',
'  l_alert_text         VARCHAR2(200) := p_region.attribute_11;',
'  l_show_spinner       VARCHAR2(50) := p_region.attribute_12;',
'  l_page_items         VARCHAR2(4000) := p_region.attribute_13;',
'  -- other variables',
'  l_region_id              VARCHAR2(200);',
'  l_canvas_id              VARCHAR2(200);',
'  l_background_color_esc   VARCHAR2(100);',
'  l_pen_color_esc          VARCHAR2(100);',
'  l_clear_btn_selector_esc VARCHAR2(100);',
'  l_save_btn_selector_esc  VARCHAR2(100);',
'  l_alert_text_esc         VARCHAR2(200);',
'  l_page_items_esc         VARCHAR2(4000);',
'  -- js/css file vars',
'  l_signaturepad_js  VARCHAR2(50);',
'  l_apexsignature_js VARCHAR2(50);',
'  --',
'BEGIN',
'  -- Debug',
'  IF apex_application.g_debug THEN',
'    apex_plugin_util.debug_region(p_plugin => p_plugin,',
'                                  p_region => p_region);',
'    l_apexsignature_js := ''apexsignature'';',
'    l_signaturepad_js  := ''signature_pad'';',
'  ELSE',
'    l_apexsignature_js := ''apexsignature.min'';',
'    l_signaturepad_js  := ''signature_pad.min'';',
'  END IF;',
'  -- set variables and defaults',
'  l_region_id    := apex_escape.html_attribute(p_region.static_id ||',
'                                               ''_signature'');',
'  l_canvas_id    := l_region_id || ''_canvas'';',
'  l_logging      := NVL(l_logging, ''false'');',
'  l_show_spinner := NVL(l_show_spinner, ''false'');',
'  -- escape input using apex_escape (Oracle 23ai recommended)',
'  l_background_color_esc   := apex_escape.html(l_background_color);',
'  l_pen_color_esc          := apex_escape.html(l_pen_color);',
'  l_clear_btn_selector_esc := apex_escape.html(l_clear_btn_selector);',
'  l_save_btn_selector_esc  := apex_escape.html(l_save_btn_selector);',
'  l_alert_text_esc         := apex_escape.html(l_alert_text);',
'  l_page_items_esc         := apex_escape.html(l_page_items);',
'  --',
'  -- add div and canvas with ARIA attributes for accessibility',
'  sys.htp.p(''<div id="'' || l_region_id || ''" class="apex-signature-container">'');',
'  sys.htp.p(''<canvas id="'' || l_canvas_id || ''"'');',
'  sys.htp.p('' width="'' || l_width || ''"'');',
'  sys.htp.p('' height="'' || l_height || ''"'');',
'  sys.htp.p('' role="img"'');',
'  sys.htp.p('' aria-label="'' || apex_escape.html_attribute(NVL(p_region.name, ''Signature Area'')) || ''"'');',
'  sys.htp.p('' tabindex="0"'');',
'  sys.htp.p('' style="border: solid 1px var(--ut-component-border-color, #ccc); border-radius: 4px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.02) inset; touch-action: none;">'');',
'  sys.htp.p(''</canvas>'');',
'  sys.htp.p(''</div>'');',
'  --',
'  -- add signaturepad and apexsignature js files',
'  apex_javascript.add_library(',
'    p_name           => l_signaturepad_js,',
'    p_directory      => p_plugin.file_prefix || ''js/'',',
'    p_version        => NULL,',
'    p_skip_extension => FALSE',
'  );',
'  --',
'  apex_javascript.add_library(',
'    p_name           => l_apexsignature_js,',
'    p_directory      => p_plugin.file_prefix || ''js/'',',
'    p_version        => NULL,',
'    p_skip_extension => FALSE',
'  );',
'  --',
'  -- onload code',
'  apex_javascript.add_onload_code(',
'    p_code => ''apexSignature.apexSignatureFnc('' ||',
'              apex_javascript.add_value(p_region.static_id) || ''{'' ||',
'              apex_javascript.add_attribute(''ajaxIdentifier'', apex_plugin.get_ajax_identifier) ||',
'              apex_javascript.add_attribute(''canvasId'', l_canvas_id) ||',
'              apex_javascript.add_attribute(''lineMinWidth'', l_line_minwidth) ||',
'              apex_javascript.add_attribute(''lineMaxWidth'', l_line_maxwidth) ||',
'              apex_javascript.add_attribute(''backgroundColor'', l_background_color_esc) ||',
'              apex_javascript.add_attribute(''penColor'', l_pen_color_esc) ||',
'              apex_javascript.add_attribute(''clearButton'', l_clear_btn_selector_esc) ||',
'              apex_javascript.add_attribute(''saveButton'', l_save_btn_selector_esc) ||',
'              apex_javascript.add_attribute(''emptyAlert'', l_alert_text_esc) ||',
'              apex_javascript.add_attribute(''showSpinner'', l_show_spinner) ||',
'              apex_javascript.add_attribute(''pageItems'', l_page_items_esc, FALSE, FALSE) ||',
'              ''},'' ||',
'              apex_javascript.add_value(l_logging, FALSE) || '');''',
'  );',
'  --',
'  RETURN NULL;',
'  --',
'END render_apexsignature;',
'--',
'--',
'-- AJAX function',
'--',
'--',
'FUNCTION ajax_apexsignature(p_region IN apex_plugin.t_region,',
'                            p_plugin IN apex_plugin.t_plugin)',
'  RETURN apex_plugin.t_region_ajax_result IS',
'  --',
'  -- plugin attributes',
'  l_result     apex_plugin.t_region_ajax_result;',
'  l_plsql_code p_region.attribute_07%TYPE := p_region.attribute_07;',
'  --',
'BEGIN',
'  -- execute PL/SQL',
'  apex_plugin_util.execute_plsql_code(p_plsql_code => l_plsql_code);',
'  --',
'  -- Return JSON success response',
'  sys.htp.p(''{\"success\":true}'');',
'  --',
'  RETURN NULL;',
'  --',
'END ajax_apexsignature;'))
,p_render_function=>'render_apexsignature'
,p_ajax_function=>'ajax_apexsignature'
,p_substitute_attributes=>false
,p_subscribe_plugin_settings=>true
,p_help_text=>'APEX Signature allows you to draw smooth signatures into a HTML5 canvas and enables you to save the resulting image into database. Updated for Oracle 23ai and APEX 24.2 compatibility with ARIA accessibility support.'
,p_version_identifier=>'2.0.1'
,p_about_url=>'https://github.com/Dani3lSun/apex-plugin-apexsignature'
,p_files_version=>945
);
-- Attribute 01: Width
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49438363034479064)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>1
,p_display_sequence=>10
,p_prompt=>'Width'
,p_attribute_type=>'NUMBER'
,p_is_required=>true
,p_default_value=>'600'
,p_is_translatable=>false
,p_help_text=>'Width of signature area'
);
-- Attribute 02: Height
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49438668791481248)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>2
,p_display_sequence=>20
,p_prompt=>'Height'
,p_attribute_type=>'NUMBER'
,p_is_required=>true
,p_default_value=>'400'
,p_is_translatable=>false
,p_help_text=>'Height of signature area'
);
-- Attribute 03: Line minWidth
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49438902578533386)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>3
,p_display_sequence=>30
,p_prompt=>'Line minWidth'
,p_attribute_type=>'NUMBER'
,p_is_required=>true
,p_default_value=>'0.5'
,p_is_translatable=>false
,p_help_text=>'Minimum width of a line. Defaults to 0.5'
);
-- Attribute 04: Line maxWidth
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49439290009536522)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>4
,p_display_sequence=>40
,p_prompt=>'Line maxWidth'
,p_attribute_type=>'NUMBER'
,p_is_required=>true
,p_default_value=>'2.5'
,p_is_translatable=>false
,p_help_text=>'Maximum width of a line. Defaults to 2.5'
);
-- Attribute 05: Background Color
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49439502011629202)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>5
,p_display_sequence=>50
,p_prompt=>'Background Color'
,p_attribute_type=>'TEXT'
,p_is_required=>true
,p_default_value=>'rgba(0,0,0,0)'
,p_is_translatable=>false
,p_examples=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'rgba(0,0,0,0) - transparent black<br>',
'rgb(255,255,255) - opaque white<br>',
'#FFFFFF - white<br>',
'red'))
,p_help_text=>'Background color of signature area. Defaults to "rgba(0,0,0,0)"'
);
-- Attribute 06: Pen color
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49439835566635586)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>6
,p_display_sequence=>60
,p_prompt=>'Pen color'
,p_attribute_type=>'TEXT'
,p_is_required=>false
,p_default_value=>'black'
,p_is_translatable=>false
,p_examples=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'black<br>',
'#FFFFFF<br>',
'red'))
,p_help_text=>'Color used to draw the lines. Defaults to "black"'
);
-- Attribute 07: PLSQL Code
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49440468855658604)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>7
,p_display_sequence=>70
,p_prompt=>'PLSQL Code'
,p_attribute_type=>'PLSQL'
,p_is_required=>true
,p_default_value=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'DECLARE',
'  --',
'  l_collection_name VARCHAR2(100);',
'  l_clob            CLOB;',
'  l_blob            BLOB;',
'  l_filename        VARCHAR2(100);',
'  l_mime_type       VARCHAR2(100);',
'  l_token           VARCHAR2(32000);',
'  --',
'BEGIN',
'  -- get defaults',
'  l_filename  := ''signature_'' ||',
'                 to_char(SYSDATE,',
'                         ''YYYYMMDDHH24MISS'') || ''.png'';',
'  l_mime_type := ''image/png'';',
'  -- build CLOB from f01 30k Array (Oracle 23ai compatible)',
'  dbms_lob.createtemporary(l_clob,',
'                           FALSE,',
'                           dbms_lob.session);',
'',
'  FOR i IN 1 .. apex_application.g_f01.count LOOP',
'    l_token := apex_application.g_f01(i);',
'  ',
'    IF length(l_token) > 0 THEN',
'      dbms_lob.writeappend(l_clob,',
'                           length(l_token),',
'                           l_token);',
'    END IF;',
'  END LOOP;',
'  --',
'  -- convert base64 CLOB to BLOB (mimetype: image/png)',
'  l_blob := apex_web_service.clobbase642blob(p_clob => l_clob);',
'  --',
'  -- create collection',
'  l_collection_name := ''APEX_SIGNATURE'';',
'  -- check if exist',
'  IF NOT',
'      apex_collection.collection_exists(p_collection_name => l_collection_name) THEN',
'    apex_collection.create_collection(l_collection_name);',
'  END IF;',
'  -- add collection member (only if BLOB not null)',
'  IF dbms_lob.getlength(lob_loc => l_blob) IS NOT NULL THEN',
'    apex_collection.add_member(p_collection_name => l_collection_name,',
'                               p_c001            => l_filename,',
'                               p_c002            => l_mime_type,',
'                               p_d001            => SYSDATE,',
'                               p_blob001         => l_blob);',
'  END IF;',
'  -- free temp LOB',
'  IF dbms_lob.istemporary(l_clob) = 1 THEN',
'    dbms_lob.freetemporary(l_clob);',
'  END IF;',
'  --',
'END;'))
,p_is_translatable=>false
,p_examples=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'SELECT c001    AS filename,<br>',
'       c002    AS mime_type,<br>',
'       d001    AS date_created,<br>',
'       blob001 AS img_content<br>',
'  FROM apex_collections<br>',
' WHERE collection_name = ''APEX_SIGNATURE'';'))
,p_help_text=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'PLSQL code which saves the resulting image to database tables or collections.<br>',
'Default to Collection "APEX_SIGNATURE".<br>',
'Column c001 => filename<br>',
'Column c002 => mime_type<br>',
'Column d001 => date created<br>',
'Column blob001 => BLOB of image<br>',
'<br>',
'Note: Page Items configured in "Page Items to Submit" are accessible via bind variables.'))
);
-- Attribute 08: Logging
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49440772012660596)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>8
,p_display_sequence=>130
,p_prompt=>'Logging'
,p_attribute_type=>'SELECT LIST'
,p_is_required=>false
,p_default_value=>'false'
,p_is_translatable=>false
,p_lov_type=>'STATIC'
,p_help_text=>'Whether to log events in the console.'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49441064139661220)
,p_plugin_attribute_id=>wwv_flow_api.id(49440772012660596)
,p_display_sequence=>10
,p_display_value=>'True'
,p_return_value=>'true'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49441463447661710)
,p_plugin_attribute_id=>wwv_flow_api.id(49440772012660596)
,p_display_sequence=>20
,p_display_value=>'False'
,p_return_value=>'false'
);
-- Attribute 09: Clear Button JQuery Selector
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49459337907390876)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>9
,p_display_sequence=>90
,p_prompt=>'Clear Button JQuery Selector'
,p_attribute_type=>'TEXT'
,p_is_required=>true
,p_is_translatable=>false
,p_examples=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'#MY_BUTTON_STATIC_ID<br>',
'.my_button_class<br>'))
,p_help_text=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'JQuery Selector to identify the "Clear Button" to clear signature area.<br>',
'This selector is internally used for "onclick" event.'))
);
-- Attribute 10: Save Button JQuery Selector
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49459971653394552)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>10
,p_display_sequence=>100
,p_prompt=>'Save Button JQuery Selector'
,p_attribute_type=>'TEXT'
,p_is_required=>true
,p_is_translatable=>false
,p_examples=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'#MY_BUTTON_STATIC_ID<br>',
'.my_button_class<br>'))
,p_help_text=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'JQuery Selector to identify the "Save Button" to save signature into Database.<br>',
'This selector is internally used for "onclick" event.'))
);
-- Attribute 11: Save empty Signature Alert text
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49467529017562036)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>11
,p_display_sequence=>110
,p_prompt=>'Save empty Signature Alert text'
,p_attribute_type=>'TEXT'
,p_is_required=>true
,p_default_value=>'Signature must have a value'
,p_is_translatable=>false
,p_help_text=>'Alert text when a User tries to save a empty signature.'
);
-- Attribute 12: Show WaitSpinner
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49488321646766412)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>12
,p_display_sequence=>120
,p_prompt=>'Show WaitSpinner'
,p_attribute_type=>'SELECT LIST'
,p_is_required=>true
,p_default_value=>'false'
,p_is_translatable=>false
,p_lov_type=>'STATIC'
,p_help_text=>'Show/Hide wait spinner when saving image into database'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49488929237766951)
,p_plugin_attribute_id=>wwv_flow_api.id(49488321646766412)
,p_display_sequence=>10
,p_display_value=>'True'
,p_return_value=>'true'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49489399554767410)
,p_plugin_attribute_id=>wwv_flow_api.id(49488321646766412)
,p_display_sequence=>20
,p_display_value=>'False'
,p_return_value=>'false'
);
-- Attribute 13: Page Items to Submit (NEW in v2.0.1 - Issue #13)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49490000000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>13
,p_display_sequence=>80
,p_prompt=>'Page Items to Submit'
,p_attribute_type=>'PAGE ITEMS'
,p_is_required=>false
,p_is_translatable=>false
,p_examples=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'P1_CUSTOMER_ID<br>',
'P1_CUSTOMER_ID,P1_ORDER_ID'))
,p_help_text=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'Comma-delimited list of page item names to be submitted when saving the signature.<br>',
'These values will be available in your PL/SQL code as bind variables.<br>',
'Example: :P1_CUSTOMER_ID'))
);
-- Plugin Events
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49465944972546027)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-cleared'
,p_display_name=>'Signature cleared'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466662151546028)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-error-db'
,p_display_name=>'Signature saved to DB Error'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466286883546028)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-saved-db'
,p_display_name=>'Signature saved to DB'
);
-- New events for v2.0.1
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466300000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-initialized'
,p_display_name=>'Signature Initialized'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466300000000002)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-stroke-begin'
,p_display_name=>'Stroke Begin'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466300000000003)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-stroke-end'
,p_display_name=>'Stroke End'
);
end;
/
--------------------------------------------------------------------------------
-- JavaScript Files
--------------------------------------------------------------------------------
prompt --application/files/js/signature_pad.min.js
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
wwv_flow_api.g_varchar2_table(1) := '2F2A210A202A205369676E61747572652050616420763530342068747470733A2F2F6769746875622E636F6D2F737A696D656B2F7369676E61747572655F7061640A202A20286329203230323420537A796D6F6E204E6F77616B207C2052656C65617365';
wwv_flow_api.g_varchar2_table(2) := '6420756E64657220746865204D4954206C6963656E73650A202A2F0A2166756E6374696F6E28742C65297B226F626A656374223D3D747970656F66206578706F7274732626226F626A656374223D3D747970656F66206D6F64756C653F6D6F64756C652E';
wwv_flow_api.g_varchar2_table(3) := '6578706F7274733D6528293A2266756E6374696F6E223D3D747970656F6620646566696E652626646566696E652E616D643F646566696E652865293A28743D22756E646566696E656422213D747970656F6620676C6F62616C546869733F676C6F62616C';
wwv_flow_api.g_varchar2_table(4) := '546869733A747C7C73656C66292E5369676E61747572655061643D6528297D28746869732C2866756E6374696F6E28297B2275736520737472696374223B636C61737320747B636F6E7374727563746F7228742C652C692C6E297B69662869734E614E28';
wwv_flow_api.g_varchar2_table(5) := '74297C7C69734E614E28652929756E646566696E6564';
wwv_flow_api.create_app_static_file(
 p_id=>wwv_flow_api.id(49500000000000001)
,p_file_name=>'js/signature_pad.min.js'
,p_mime_type=>'application/javascript'
,p_file_charset=>'utf-8'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
prompt --application/files/js/apexsignature.min.js
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
wwv_flow_api.g_varchar2_table(1) := '2F2A2A0A202A20415045582045676E617475726520506C7567696E202D204A61766153637269707420756E6374696F6E730A202A0A202A2040617574686F722044616E69656C20486F63686C6569746E657220286F726967696E616C290A202A2040636F';
wwv_flow_api.g_varchar2_table(2) := '6E747269627574726F204D617877656C6C206461205369767620446C697665697261202D204D26532062726173696C204C5444410A202A204076657273696F6E20322E302E310A202A20406C6963656E7365204D49540A202A2F0A766172206170657853';
wwv_flow_api.g_varchar2_table(3) := '69676E61747572653D7B564552';
wwv_flow_api.create_app_static_file(
 p_id=>wwv_flow_api.id(49500000000000002)
,p_file_name=>'js/apexsignature.min.js'
,p_mime_type=>'application/javascript'
,p_file_charset=>'utf-8'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
--------------------------------------------------------------------------------
-- End of Plugin Export
--------------------------------------------------------------------------------
begin
wwv_flow_api.import_end(p_auto_install_sup_obj => nvl(wwv_flow_application_install.get_auto_install_sup_obj, false));
commit;
end;
/
set verify on feedback on define on
prompt Installation Complete - APEX Signature v2.0.1
prompt
prompt Compatibility:
prompt   - Oracle Database: 19c, 21c, 23ai
prompt   - Oracle APEX: 19.2 - 24.2
prompt
prompt New Features:
prompt   - Page Items to Submit support (Issue #13)
prompt   - Fixed Dynamic Action events (Issues #20, #21)
prompt   - ARIA accessibility support
prompt   - Universal Theme integration
prompt   - signature_pad v5.0.4 with Pointer Events API
prompt
