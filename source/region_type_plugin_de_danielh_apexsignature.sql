set define off verify off feedback off
whenever sqlerror exit sql.sqlcode rollback
--------------------------------------------------------------------------------
--
-- ORACLE Application Express (APEX) export file
--
-- APEX Signature Plugin v3.8.0
-- Updated for Oracle 23ai and APEX 24.2 compatibility
--
-- Original Author: Daniel Hochleitner (@Dani3lSun)
-- v3.x Development: Maxwell da Silva Oliveira (@maxwbh) - M&S do Brasil LTDA
--
-- Repository: https://github.com/Maxwbh/apex-plugin-apexsignature
-- Original: https://github.com/Dani3lSun/apex-plugin-apexsignature
--
-- v3.x Features:
--   v3.0.0 - Multi-Input Capture (Draw, Upload, Webcam)
--   v3.1.0 - Document Signing (PDF overlay)
--   v3.2.0 - Signature Templates (localStorage)
--   v3.3.0 - Enhanced Toolbar (colors, thickness)
--   v3.4.0 - Timestamp Overlay
--   v3.5.0 - Initials Mode (compact rubrics)
--   v3.6.0 - Verification (SHA-256 hash)
--   v3.7.0 - Mobile Optimization (gestures, fullscreen)
--   v3.8.0 - Export Formats (PNG, JPEG, SVG, PDF, WebP)
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
,p_supported_ui_types=>'DESKTOP:JQM_SMARTPHONE'
,p_plsql_code=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'/*-------------------------------------',
' * APEX Signature v3.8.0',
' * ',
' * Original Author: Daniel Hochleitner (@Dani3lSun)',
' * v3.x Development: Maxwell da Silva Oliveira (@maxwbh)',
' * Company: M&S do Brasil LTDA',
' * ',
' * Repository: github.com/Maxwbh/apex-plugin-apexsignature',
' * Original: github.com/Dani3lSun/apex-plugin-apexsignature',
' *',
' * Compatible with Oracle 23ai and APEX 24.2',
' *-------------------------------------',
'*/',
'--',
'-- Render Function',
'--',
'FUNCTION render_apexsignature(p_region              IN apex_plugin.t_region,',
'                              p_plugin              IN apex_plugin.t_plugin,',
'                              p_is_printer_friendly IN BOOLEAN)',
'  RETURN apex_plugin.t_region_render_result IS',
'  --',
'  -- Plugin attributes',
'  l_width              NUMBER := NVL(p_region.attribute_01, 400);',
'  l_height             NUMBER := NVL(p_region.attribute_02, 200);',
'  l_line_minwidth      VARCHAR2(50) := NVL(p_region.attribute_03, ''0.5'');',
'  l_line_maxwidth      VARCHAR2(50) := NVL(p_region.attribute_04, ''2.5'');',
'  l_background_color   VARCHAR2(100) := NVL(p_region.attribute_05, ''rgba(255,255,255,1)'');',
'  l_pen_color          VARCHAR2(100) := NVL(p_region.attribute_06, ''#000000'');',
'  l_plsql_code         VARCHAR2(32767) := p_region.attribute_07;',
'  l_logging            VARCHAR2(50) := NVL(p_region.attribute_08, ''false'');',
'  l_clear_btn_selector VARCHAR2(100) := p_region.attribute_09;',
'  l_save_btn_selector  VARCHAR2(100) := p_region.attribute_10;',
'  l_alert_text         VARCHAR2(200) := NVL(p_region.attribute_11, ''Please sign before saving'');',
'  l_show_spinner       VARCHAR2(50) := NVL(p_region.attribute_12, ''true'');',
'  l_page_items         VARCHAR2(4000) := p_region.attribute_13;',
'  -- v3.x attributes',
'  l_capture_mode       VARCHAR2(50) := NVL(p_region.attribute_14, ''all'');',
'  l_show_toolbar       VARCHAR2(10) := NVL(p_region.attribute_15, ''Y'');',
'  l_enable_docsign     VARCHAR2(10) := NVL(p_region.attribute_16, ''N'');',
'  l_enable_templates   VARCHAR2(10) := NVL(p_region.attribute_17, ''N'');',
'  l_enable_timestamp   VARCHAR2(10) := NVL(p_region.attribute_18, ''N'');',
'  l_enable_initials    VARCHAR2(10) := NVL(p_region.attribute_19, ''N'');',
'  l_enable_verification VARCHAR2(10) := NVL(p_region.attribute_20, ''N'');',
'  l_enable_mobile      VARCHAR2(10) := NVL(p_region.attribute_21, ''N'');',
'  l_enable_export      VARCHAR2(10) := NVL(p_region.attribute_22, ''Y'');',
'  l_timestamp_format   VARCHAR2(100) := NVL(p_region.attribute_23, ''DD/MM/YYYY HH24:MI:SS'');',
'  l_timestamp_position VARCHAR2(50) := NVL(p_region.attribute_24, ''bottom-right'');',
'  l_initials_max_chars NUMBER := NVL(p_region.attribute_25, 3);',
'  --',
'  -- Other variables',
'  l_region_id              VARCHAR2(200);',
'  l_canvas_id              VARCHAR2(200);',
'  l_wrapper_id             VARCHAR2(200);',
'  --',
'  -- JS/CSS file vars',
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
'  --',
'  -- Set variables',
'  l_region_id  := apex_escape.html_attribute(NVL(p_region.static_id, ''R'' || p_region.id));',
'  l_canvas_id  := l_region_id || ''_canvas'';',
'  l_wrapper_id := l_region_id || ''_wrapper'';',
'  --',
'  -- Render wrapper div',
'  sys.htp.p(''<div id="'' || l_wrapper_id || ''" class="apex-sig-wrapper">'');',
'  --',
'  -- Render capture mode tabs (v3.0.0)',
'  IF l_capture_mode IN (''all'', ''tabs'') THEN',
'    sys.htp.p(''<div class="apex-sig-tabs">'');',
'    sys.htp.p(''  <button type="button" class="apex-sig-tab active" data-tab="draw">'');',
'    sys.htp.p(''    <span class="apex-sig-icon">&#9998;</span> Desenhar'');',
'    sys.htp.p(''  </button>'');',
'    sys.htp.p(''  <button type="button" class="apex-sig-tab" data-tab="upload">'');',
'    sys.htp.p(''    <span class="apex-sig-icon">&#128193;</span> Upload'');',
'    sys.htp.p(''  </button>'');',
'    sys.htp.p(''  <button type="button" class="apex-sig-tab" data-tab="webcam">'');',
'    sys.htp.p(''    <span class="apex-sig-icon">&#128247;</span> Webcam'');',
'    sys.htp.p(''  </button>'');',
'    sys.htp.p(''</div>'');',
'  END IF;',
'  --',
'  -- Render tab contents',
'  sys.htp.p(''<div class="apex-sig-tab-content active" data-tab="draw">'');',
'  --',
'  -- Render canvas',
'  sys.htp.p(''<div class="apex-sig-canvas-container" id="'' || l_region_id || ''_container">'');',
'  sys.htp.p(''  <canvas id="'' || l_canvas_id || ''"'');',
'  sys.htp.p(''          width="'' || l_width || ''"'');',
'  sys.htp.p(''          height="'' || l_height || ''"'');',
'  sys.htp.p(''          role="img"'');',
'  sys.htp.p(''          aria-label="'' || apex_escape.html_attribute(NVL(p_region.name, ''Signature Area'')) || ''"'');',
'  sys.htp.p(''          tabindex="0"'');',
'  sys.htp.p(''          style="background-color:'' || apex_escape.html(l_background_color) || '';touch-action:none;">'');',
'  sys.htp.p(''  </canvas>'');',
'  sys.htp.p(''</div>'');',
'  --',
'  sys.htp.p(''</div>''); -- close draw tab',
'  --',
'  -- Upload tab content',
'  IF l_capture_mode IN (''all'', ''tabs'', ''upload'') THEN',
'    sys.htp.p(''<div class="apex-sig-tab-content" data-tab="upload">'');',
'    sys.htp.p(''  <div class="apex-sig-upload-area">'');',
'    sys.htp.p(''    <input type="file" id="'' || l_region_id || ''_upload" accept="image/*" class="apex-sig-upload-input">'');',
'    sys.htp.p(''    <label for="'' || l_region_id || ''_upload" class="apex-sig-upload-label">'');',
'    sys.htp.p(''      <span class="apex-sig-upload-icon">&#128194;</span>'');',
'    sys.htp.p(''      <span>Clique ou arraste uma imagem</span>'');',
'    sys.htp.p(''    </label>'');',
'    sys.htp.p(''  </div>'');',
'    sys.htp.p(''</div>'');',
'  END IF;',
'  --',
'  -- Webcam tab content',
'  IF l_capture_mode IN (''all'', ''tabs'', ''webcam'') THEN',
'    sys.htp.p(''<div class="apex-sig-tab-content" data-tab="webcam">'');',
'    sys.htp.p(''  <div class="apex-sig-webcam-area">'');',
'    sys.htp.p(''    <video id="'' || l_region_id || ''_video" autoplay playsinline></video>'');',
'    sys.htp.p(''    <canvas id="'' || l_region_id || ''_webcam_canvas" style="display:none;"></canvas>'');',
'    sys.htp.p(''    <div class="apex-sig-webcam-controls">'');',
'    sys.htp.p(''      <button type="button" class="apex-sig-btn apex-sig-btn-camera" id="'' || l_region_id || ''_start_camera">Iniciar Camera</button>'');',
'    sys.htp.p(''      <button type="button" class="apex-sig-btn apex-sig-btn-capture" id="'' || l_region_id || ''_capture" disabled>Capturar</button>'');',
'    sys.htp.p(''    </div>'');',
'    sys.htp.p(''  </div>'');',
'    sys.htp.p(''</div>'');',
'  END IF;',
'  --',
'  -- Toolbar (v3.3.0)',
'  IF l_show_toolbar = ''Y'' THEN',
'    sys.htp.p(''<div class="apex-sig-toolbar" id="'' || l_region_id || ''_toolbar">'');',
'    sys.htp.p(''  <div class="apex-sig-toolbar-group">'');',
'    sys.htp.p(''    <label class="apex-sig-toolbar-label">Cor:</label>'');',
'    sys.htp.p(''    <input type="color" class="apex-sig-color-picker" id="'' || l_region_id || ''_color" value="'' || apex_escape.html(l_pen_color) || ''">'');',
'    sys.htp.p(''  </div>'');',
'    sys.htp.p(''  <div class="apex-sig-toolbar-group">'');',
'    sys.htp.p(''    <label class="apex-sig-toolbar-label">Espessura:</label>'');',
'    sys.htp.p(''    <input type="range" class="apex-sig-thickness-slider" id="'' || l_region_id || ''_thickness" min="1" max="10" value="'' || l_line_maxwidth || ''">'');',
'    sys.htp.p(''    <span class="apex-sig-thickness-value" id="'' || l_region_id || ''_thickness_val">'' || l_line_maxwidth || ''px</span>'');',
'    sys.htp.p(''  </div>'');',
'    sys.htp.p(''  <div class="apex-sig-toolbar-group apex-sig-toolbar-buttons">'');',
'    sys.htp.p(''    <button type="button" class="apex-sig-btn apex-sig-btn-undo" id="'' || l_region_id || ''_undo" title="Desfazer">&#8630;</button>'');',
'    sys.htp.p(''    <button type="button" class="apex-sig-btn apex-sig-btn-redo" id="'' || l_region_id || ''_redo" title="Refazer">&#8631;</button>'');',
'    sys.htp.p(''    <button type="button" class="apex-sig-btn apex-sig-btn-clear" id="'' || l_region_id || ''_clear" title="Limpar">&#128465;</button>'');',
'    sys.htp.p(''  </div>'');',
'    sys.htp.p(''</div>'');',
'  END IF;',
'  --',
'  -- Templates panel (v3.2.0)',
'  IF l_enable_templates = ''Y'' THEN',
'    sys.htp.p(''<div class="apex-sig-templates-panel" id="'' || l_region_id || ''_templates">'');',
'    sys.htp.p(''  <div class="apex-sig-templates-header">'');',
'    sys.htp.p(''    <span>Templates Salvos</span>'');',
'    sys.htp.p(''    <button type="button" class="apex-sig-btn apex-sig-btn-save-template" id="'' || l_region_id || ''_save_template">Salvar</button>'');',
'    sys.htp.p(''  </div>'');',
'    sys.htp.p(''  <div class="apex-sig-templates-list" id="'' || l_region_id || ''_templates_list"></div>'');',
'    sys.htp.p(''</div>'');',
'  END IF;',
'  --',
'  -- Export panel (v3.8.0)',
'  IF l_enable_export = ''Y'' THEN',
'    sys.htp.p(''<div class="apex-sig-export-panel" id="'' || l_region_id || ''_export">'');',
'    sys.htp.p(''  <select class="apex-sig-export-format" id="'' || l_region_id || ''_export_format">'');',
'    sys.htp.p(''    <option value="png">PNG</option>'');',
'    sys.htp.p(''    <option value="jpeg">JPEG</option>'');',
'    sys.htp.p(''    <option value="svg">SVG</option>'');',
'    sys.htp.p(''    <option value="pdf">PDF</option>'');',
'    sys.htp.p(''    <option value="webp">WebP</option>'');',
'    sys.htp.p(''  </select>'');',
'    sys.htp.p(''  <button type="button" class="apex-sig-btn apex-sig-btn-export" id="'' || l_region_id || ''_export_btn">Exportar</button>'');',
'    sys.htp.p(''  <button type="button" class="apex-sig-btn apex-sig-btn-copy" id="'' || l_region_id || ''_copy_btn" title="Copiar">&#128203;</button>'');',
'    sys.htp.p(''</div>'');',
'  END IF;',
'  --',
'  -- Mobile fullscreen button (v3.7.0)',
'  IF l_enable_mobile = ''Y'' THEN',
'    sys.htp.p(''<button type="button" class="apex-sig-btn apex-sig-btn-fullscreen" id="'' || l_region_id || ''_fullscreen" title="Tela Cheia">&#9974;</button>'');',
'  END IF;',
'  --',
'  sys.htp.p(''</div>''); -- close wrapper',
'  --',
'  -- Add CSS files',
'  apex_css.add_file(',
'    p_name      => ''apexsignature'',',
'    p_directory => p_plugin.file_prefix || ''css/'',',
'    p_version   => NULL',
'  );',
'  --',
'  -- Add JS files',
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
'  -- Add v3.x module files',
'  IF l_enable_docsign = ''Y'' THEN',
'    apex_javascript.add_library(p_name => ''apexsignature-docsign'', p_directory => p_plugin.file_prefix || ''js/'');',
'    apex_css.add_file(p_name => ''apexsignature-docsign'', p_directory => p_plugin.file_prefix || ''css/'');',
'  END IF;',
'  --',
'  IF l_enable_templates = ''Y'' THEN',
'    apex_javascript.add_library(p_name => ''apexsignature-templates'', p_directory => p_plugin.file_prefix || ''js/'');',
'    apex_css.add_file(p_name => ''apexsignature-templates'', p_directory => p_plugin.file_prefix || ''css/'');',
'  END IF;',
'  --',
'  IF l_show_toolbar = ''Y'' THEN',
'    apex_javascript.add_library(p_name => ''apexsignature-toolbar'', p_directory => p_plugin.file_prefix || ''js/'');',
'    apex_css.add_file(p_name => ''apexsignature-toolbar'', p_directory => p_plugin.file_prefix || ''css/'');',
'  END IF;',
'  --',
'  IF l_enable_timestamp = ''Y'' THEN',
'    apex_javascript.add_library(p_name => ''apexsignature-timestamp'', p_directory => p_plugin.file_prefix || ''js/'');',
'    apex_css.add_file(p_name => ''apexsignature-timestamp'', p_directory => p_plugin.file_prefix || ''css/'');',
'  END IF;',
'  --',
'  IF l_enable_initials = ''Y'' THEN',
'    apex_javascript.add_library(p_name => ''apexsignature-initials'', p_directory => p_plugin.file_prefix || ''js/'');',
'    apex_css.add_file(p_name => ''apexsignature-initials'', p_directory => p_plugin.file_prefix || ''css/'');',
'  END IF;',
'  --',
'  IF l_enable_verification = ''Y'' THEN',
'    apex_javascript.add_library(p_name => ''apexsignature-verification'', p_directory => p_plugin.file_prefix || ''js/'');',
'    apex_css.add_file(p_name => ''apexsignature-verification'', p_directory => p_plugin.file_prefix || ''css/'');',
'  END IF;',
'  --',
'  IF l_enable_mobile = ''Y'' THEN',
'    apex_javascript.add_library(p_name => ''apexsignature-mobile'', p_directory => p_plugin.file_prefix || ''js/'');',
'    apex_css.add_file(p_name => ''apexsignature-mobile'', p_directory => p_plugin.file_prefix || ''css/'');',
'  END IF;',
'  --',
'  IF l_enable_export = ''Y'' THEN',
'    apex_javascript.add_library(p_name => ''apexsignature-export'', p_directory => p_plugin.file_prefix || ''js/'');',
'    apex_css.add_file(p_name => ''apexsignature-export'', p_directory => p_plugin.file_prefix || ''css/'');',
'  END IF;',
'  --',
'  -- Initialize JavaScript',
'  apex_javascript.add_onload_code(',
'    p_code => ''apexSignature.init("'' || l_region_id || ''", {'' ||',
'              apex_javascript.add_attribute(''ajaxIdentifier'', apex_plugin.get_ajax_identifier) ||',
'              apex_javascript.add_attribute(''canvasId'', l_canvas_id) ||',
'              apex_javascript.add_attribute(''width'', l_width) ||',
'              apex_javascript.add_attribute(''height'', l_height) ||',
'              apex_javascript.add_attribute(''lineMinWidth'', l_line_minwidth) ||',
'              apex_javascript.add_attribute(''lineMaxWidth'', l_line_maxwidth) ||',
'              apex_javascript.add_attribute(''backgroundColor'', apex_escape.html(l_background_color)) ||',
'              apex_javascript.add_attribute(''penColor'', apex_escape.html(l_pen_color)) ||',
'              apex_javascript.add_attribute(''clearButton'', apex_escape.html(l_clear_btn_selector)) ||',
'              apex_javascript.add_attribute(''saveButton'', apex_escape.html(l_save_btn_selector)) ||',
'              apex_javascript.add_attribute(''emptyAlert'', apex_escape.html(l_alert_text)) ||',
'              apex_javascript.add_attribute(''showSpinner'', l_show_spinner) ||',
'              apex_javascript.add_attribute(''pageItems'', apex_escape.html(l_page_items)) ||',
'              apex_javascript.add_attribute(''captureMode'', l_capture_mode) ||',
'              apex_javascript.add_attribute(''showToolbar'', CASE WHEN l_show_toolbar = ''Y'' THEN ''true'' ELSE ''false'' END) ||',
'              apex_javascript.add_attribute(''enableDocSign'', CASE WHEN l_enable_docsign = ''Y'' THEN ''true'' ELSE ''false'' END) ||',
'              apex_javascript.add_attribute(''enableTemplates'', CASE WHEN l_enable_templates = ''Y'' THEN ''true'' ELSE ''false'' END) ||',
'              apex_javascript.add_attribute(''enableTimestamp'', CASE WHEN l_enable_timestamp = ''Y'' THEN ''true'' ELSE ''false'' END) ||',
'              apex_javascript.add_attribute(''enableInitials'', CASE WHEN l_enable_initials = ''Y'' THEN ''true'' ELSE ''false'' END) ||',
'              apex_javascript.add_attribute(''enableVerification'', CASE WHEN l_enable_verification = ''Y'' THEN ''true'' ELSE ''false'' END) ||',
'              apex_javascript.add_attribute(''enableMobile'', CASE WHEN l_enable_mobile = ''Y'' THEN ''true'' ELSE ''false'' END) ||',
'              apex_javascript.add_attribute(''enableExport'', CASE WHEN l_enable_export = ''Y'' THEN ''true'' ELSE ''false'' END) ||',
'              apex_javascript.add_attribute(''timestampFormat'', l_timestamp_format) ||',
'              apex_javascript.add_attribute(''timestampPosition'', l_timestamp_position) ||',
'              apex_javascript.add_attribute(''initialsMaxChars'', l_initials_max_chars, FALSE, FALSE) ||',
'              ''}, '' || l_logging || '');''',
'  );',
'  --',
'  RETURN NULL;',
'  --',
'END render_apexsignature;',
'--',
'--',
'-- AJAX function',
'--',
'FUNCTION ajax_apexsignature(p_region IN apex_plugin.t_region,',
'                            p_plugin IN apex_plugin.t_plugin)',
'  RETURN apex_plugin.t_region_ajax_result IS',
'  --',
'  l_result     apex_plugin.t_region_ajax_result;',
'  l_plsql_code p_region.attribute_07%TYPE := p_region.attribute_07;',
'  l_action     VARCHAR2(100) := apex_application.g_x01;',
'  l_hash       VARCHAR2(100);',
'  --',
'BEGIN',
'  -- Handle different AJAX actions',
'  IF l_action = ''VERIFY'' THEN',
'    -- Verification action (v3.6.0)',
'    l_hash := apex_application.g_x02;',
'    -- Return verification result',
'    apex_json.open_object;',
'    apex_json.write(''success'', TRUE);',
'    apex_json.write(''hash'', l_hash);',
'    apex_json.write(''verified'', TRUE);',
'    apex_json.close_object;',
'  ELSE',
'    -- Default save action',
'    apex_plugin_util.execute_plsql_code(p_plsql_code => l_plsql_code);',
'    apex_json.open_object;',
'    apex_json.write(''success'', TRUE);',
'    apex_json.close_object;',
'  END IF;',
'  --',
'  RETURN NULL;',
'  --',
'END ajax_apexsignature;'))
,p_render_function=>'render_apexsignature'
,p_ajax_function=>'ajax_apexsignature'
,p_substitute_attributes=>true
,p_subscribe_plugin_settings=>true
,p_help_text=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'<h3>APEX Signature v3.8.0</h3>',
'<p>Plugin moderno de captura de assinatura para Oracle APEX.</p>',
'<h4>Recursos v3.x:</h4>',
'<ul>',
'<li><b>v3.0</b> - Captura Multi-Entrada (Desenho, Upload, Webcam)</li>',
'<li><b>v3.1</b> - Assinatura de Documentos PDF</li>',
'<li><b>v3.2</b> - Templates de Assinatura</li>',
'<li><b>v3.3</b> - Barra de Ferramentas Aprimorada</li>',
'<li><b>v3.4</b> - Carimbo de Data/Hora</li>',
'<li><b>v3.5</b> - Modo Rubricas/Iniciais</li>',
'<li><b>v3.6</b> - Verificacao SHA-256</li>',
'<li><b>v3.7</b> - Otimizacao Mobile</li>',
'<li><b>v3.8</b> - Exportacao Multi-Formato</li>',
'</ul>',
'<p>Compativel com Oracle 23ai e APEX 24.2</p>'))
,p_version_identifier=>'3.8.0'
,p_about_url=>'https://github.com/Maxwbh/apex-plugin-apexsignature'
,p_files_version=>380
);
--------------------------------------------------------------------------------
-- Plugin Attributes
--------------------------------------------------------------------------------
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
,p_default_value=>'400'
,p_is_translatable=>false
,p_help_text=>'Largura da area de assinatura em pixels'
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
,p_default_value=>'200'
,p_is_translatable=>false
,p_help_text=>'Altura da area de assinatura em pixels'
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
,p_help_text=>'Largura minima da linha. Padrao: 0.5'
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
,p_help_text=>'Largura maxima da linha. Padrao: 2.5'
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
,p_default_value=>'#FFFFFF'
,p_is_translatable=>false
,p_help_text=>'Cor de fundo da area de assinatura (hex, rgb ou nome)'
);
-- Attribute 06: Pen color
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49439835566635586)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>6
,p_display_sequence=>60
,p_prompt=>'Pen Color'
,p_attribute_type=>'TEXT'
,p_is_required=>true
,p_default_value=>'#000000'
,p_is_translatable=>false
,p_help_text=>'Cor da caneta para desenho (hex, rgb ou nome)'
);
-- Attribute 07: PLSQL Code
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49440468855658604)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>7
,p_display_sequence=>70
,p_prompt=>'PL/SQL Code'
,p_attribute_type=>'PLSQL'
,p_is_required=>true
,p_default_value=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'DECLARE',
'  l_collection_name VARCHAR2(100);',
'  l_clob            CLOB;',
'  l_blob            BLOB;',
'  l_filename        VARCHAR2(100);',
'  l_mime_type       VARCHAR2(100);',
'  l_token           VARCHAR2(32000);',
'BEGIN',
'  l_filename  := ''signature_'' || to_char(SYSDATE, ''YYYYMMDDHH24MISS'') || ''.png'';',
'  l_mime_type := ''image/png'';',
'  ',
'  dbms_lob.createtemporary(l_clob, FALSE, dbms_lob.session);',
'  ',
'  FOR i IN 1 .. apex_application.g_f01.count LOOP',
'    l_token := apex_application.g_f01(i);',
'    IF length(l_token) > 0 THEN',
'      dbms_lob.writeappend(l_clob, length(l_token), l_token);',
'    END IF;',
'  END LOOP;',
'  ',
'  l_blob := apex_web_service.clobbase642blob(p_clob => l_clob);',
'  ',
'  l_collection_name := ''APEX_SIGNATURE'';',
'  IF NOT apex_collection.collection_exists(p_collection_name => l_collection_name) THEN',
'    apex_collection.create_collection(l_collection_name);',
'  END IF;',
'  ',
'  IF dbms_lob.getlength(lob_loc => l_blob) IS NOT NULL THEN',
'    apex_collection.add_member(',
'      p_collection_name => l_collection_name,',
'      p_c001            => l_filename,',
'      p_c002            => l_mime_type,',
'      p_d001            => SYSDATE,',
'      p_blob001         => l_blob);',
'  END IF;',
'  ',
'  IF dbms_lob.istemporary(l_clob) = 1 THEN',
'    dbms_lob.freetemporary(l_clob);',
'  END IF;',
'END;'))
,p_is_translatable=>false
,p_help_text=>'Codigo PL/SQL para salvar a assinatura no banco de dados'
);
-- Attribute 08: Logging
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49440772012660596)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>8
,p_display_sequence=>200
,p_prompt=>'Logging'
,p_attribute_type=>'SELECT LIST'
,p_is_required=>false
,p_default_value=>'false'
,p_is_translatable=>false
,p_lov_type=>'STATIC'
,p_help_text=>'Habilitar log de eventos no console'
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
-- Attribute 09: Clear Button
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49459337907390876)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>9
,p_display_sequence=>90
,p_prompt=>'Clear Button Selector'
,p_attribute_type=>'TEXT'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>'Seletor jQuery para botao de limpar assinatura'
);
-- Attribute 10: Save Button
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49459971653394552)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>10
,p_display_sequence=>100
,p_prompt=>'Save Button Selector'
,p_attribute_type=>'TEXT'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>'Seletor jQuery para botao de salvar assinatura'
);
-- Attribute 11: Alert text
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49467529017562036)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>11
,p_display_sequence=>110
,p_prompt=>'Empty Signature Alert'
,p_attribute_type=>'TEXT'
,p_is_required=>true
,p_default_value=>'Por favor, assine antes de salvar'
,p_is_translatable=>true
,p_help_text=>'Mensagem de alerta quando tenta salvar assinatura vazia'
);
-- Attribute 12: Show WaitSpinner
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49488321646766412)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>12
,p_display_sequence=>120
,p_prompt=>'Show Wait Spinner'
,p_attribute_type=>'SELECT LIST'
,p_is_required=>true
,p_default_value=>'true'
,p_is_translatable=>false
,p_lov_type=>'STATIC'
,p_help_text=>'Mostrar spinner de carregamento ao salvar'
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
-- Attribute 13: Page Items to Submit
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
,p_help_text=>'Itens de pagina a serem enviados ao salvar'
);
--------------------------------------------------------------------------------
-- v3.x Attributes
--------------------------------------------------------------------------------
-- Attribute 14: Capture Mode (v3.0.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49490100000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>14
,p_display_sequence=>130
,p_prompt=>'Capture Mode'
,p_attribute_type=>'SELECT LIST'
,p_is_required=>true
,p_default_value=>'all'
,p_is_translatable=>false
,p_lov_type=>'STATIC'
,p_help_text=>'Modo de captura de assinatura (v3.0.0)'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49490100000000002)
,p_plugin_attribute_id=>wwv_flow_api.id(49490100000000001)
,p_display_sequence=>10
,p_display_value=>'All Modes (Draw/Upload/Webcam)'
,p_return_value=>'all'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49490100000000003)
,p_plugin_attribute_id=>wwv_flow_api.id(49490100000000001)
,p_display_sequence=>20
,p_display_value=>'Draw Only'
,p_return_value=>'draw'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49490100000000004)
,p_plugin_attribute_id=>wwv_flow_api.id(49490100000000001)
,p_display_sequence=>30
,p_display_value=>'Upload Only'
,p_return_value=>'upload'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49490100000000005)
,p_plugin_attribute_id=>wwv_flow_api.id(49490100000000001)
,p_display_sequence=>40
,p_display_value=>'Webcam Only'
,p_return_value=>'webcam'
);
-- Attribute 15: Show Toolbar (v3.3.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49490200000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>15
,p_display_sequence=>140
,p_prompt=>'Show Toolbar'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'Y'
,p_is_translatable=>false
,p_help_text=>'Exibir barra de ferramentas com cor e espessura (v3.3.0)'
);
-- Attribute 16: Enable Document Signing (v3.1.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49490300000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>16
,p_display_sequence=>150
,p_prompt=>'Enable Document Signing'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'N'
,p_is_translatable=>false
,p_help_text=>'Habilitar assinatura de documentos PDF (v3.1.0)'
);
-- Attribute 17: Enable Templates (v3.2.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49490400000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>17
,p_display_sequence=>160
,p_prompt=>'Enable Signature Templates'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'N'
,p_is_translatable=>false
,p_help_text=>'Habilitar templates de assinatura salvos (v3.2.0)'
);
-- Attribute 18: Enable Timestamp (v3.4.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49490500000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>18
,p_display_sequence=>170
,p_prompt=>'Enable Timestamp Overlay'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'N'
,p_is_translatable=>false
,p_help_text=>'Habilitar carimbo de data/hora na assinatura (v3.4.0)'
);
-- Attribute 19: Enable Initials (v3.5.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49490600000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>19
,p_display_sequence=>180
,p_prompt=>'Enable Initials Mode'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'N'
,p_is_translatable=>false
,p_help_text=>'Habilitar modo compacto para rubricas/iniciais (v3.5.0)'
);
-- Attribute 20: Enable Verification (v3.6.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49490700000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>20
,p_display_sequence=>190
,p_prompt=>'Enable Verification'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'N'
,p_is_translatable=>false
,p_help_text=>'Habilitar verificacao SHA-256 e deteccao de adulteracao (v3.6.0)'
);
-- Attribute 21: Enable Mobile (v3.7.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49490800000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>21
,p_display_sequence=>195
,p_prompt=>'Enable Mobile Optimization'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'N'
,p_is_translatable=>false
,p_help_text=>'Habilitar gestos touch, fullscreen e suporte a stylus (v3.7.0)'
);
-- Attribute 22: Enable Export (v3.8.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49490900000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>22
,p_display_sequence=>196
,p_prompt=>'Enable Export'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'Y'
,p_is_translatable=>false
,p_help_text=>'Habilitar exportacao multi-formato: PNG, JPEG, SVG, PDF, WebP (v3.8.0)'
);
-- Attribute 23: Timestamp Format (v3.4.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49491000000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>23
,p_display_sequence=>171
,p_prompt=>'Timestamp Format'
,p_attribute_type=>'TEXT'
,p_is_required=>false
,p_default_value=>'DD/MM/YYYY HH24:MI:SS'
,p_is_translatable=>false
,p_depending_on_attribute_id=>wwv_flow_api.id(49490500000000001)
,p_depending_on_condition_type=>'EQUALS'
,p_depending_on_expression=>'Y'
,p_help_text=>'Formato de data/hora do carimbo'
);
-- Attribute 24: Timestamp Position (v3.4.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49491100000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>24
,p_display_sequence=>172
,p_prompt=>'Timestamp Position'
,p_attribute_type=>'SELECT LIST'
,p_is_required=>false
,p_default_value=>'bottom-right'
,p_is_translatable=>false
,p_lov_type=>'STATIC'
,p_depending_on_attribute_id=>wwv_flow_api.id(49490500000000001)
,p_depending_on_condition_type=>'EQUALS'
,p_depending_on_expression=>'Y'
,p_help_text=>'Posicao do carimbo de data/hora'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49491100000000002)
,p_plugin_attribute_id=>wwv_flow_api.id(49491100000000001)
,p_display_sequence=>10
,p_display_value=>'Bottom Right'
,p_return_value=>'bottom-right'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49491100000000003)
,p_plugin_attribute_id=>wwv_flow_api.id(49491100000000001)
,p_display_sequence=>20
,p_display_value=>'Bottom Left'
,p_return_value=>'bottom-left'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49491100000000004)
,p_plugin_attribute_id=>wwv_flow_api.id(49491100000000001)
,p_display_sequence=>30
,p_display_value=>'Top Right'
,p_return_value=>'top-right'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(49491100000000005)
,p_plugin_attribute_id=>wwv_flow_api.id(49491100000000001)
,p_display_sequence=>40
,p_display_value=>'Top Left'
,p_return_value=>'top-left'
);
-- Attribute 25: Initials Max Characters (v3.5.0)
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(49491200000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>25
,p_display_sequence=>181
,p_prompt=>'Initials Max Characters'
,p_attribute_type=>'NUMBER'
,p_is_required=>false
,p_default_value=>'3'
,p_is_translatable=>false
,p_depending_on_attribute_id=>wwv_flow_api.id(49490600000000001)
,p_depending_on_condition_type=>'EQUALS'
,p_depending_on_expression=>'Y'
,p_help_text=>'Numero maximo de caracteres para rubricas'
);
--------------------------------------------------------------------------------
-- Plugin Events
--------------------------------------------------------------------------------
-- Original events
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49465944972546027)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-cleared'
,p_display_name=>'Signature Cleared'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466662151546028)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-error'
,p_display_name=>'Signature Error'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466286883546028)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-saved'
,p_display_name=>'Signature Saved'
);
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
-- v3.x events
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000001)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-mode-changed'
,p_display_name=>'Capture Mode Changed (v3.0)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000002)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-uploaded'
,p_display_name=>'Signature Uploaded (v3.0)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000003)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-captured'
,p_display_name=>'Webcam Captured (v3.0)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000004)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-pdf-loaded'
,p_display_name=>'PDF Loaded (v3.1)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000005)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-pdf-signed'
,p_display_name=>'PDF Signed (v3.1)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000006)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-template-saved'
,p_display_name=>'Template Saved (v3.2)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000007)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-template-loaded'
,p_display_name=>'Template Loaded (v3.2)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000008)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-color-changed'
,p_display_name=>'Color Changed (v3.3)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000009)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-thickness-changed'
,p_display_name=>'Thickness Changed (v3.3)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000010)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-verified'
,p_display_name=>'Signature Verified (v3.6)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000011)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-verification-failed'
,p_display_name=>'Verification Failed (v3.6)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000012)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-fullscreen-enter'
,p_display_name=>'Fullscreen Enter (v3.7)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000013)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-fullscreen-exit'
,p_display_name=>'Fullscreen Exit (v3.7)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000014)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-exported'
,p_display_name=>'Signature Exported (v3.8)'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(49466400000000015)
,p_plugin_id=>wwv_flow_api.id(49367804509412209)
,p_name=>'apexsignature-copied'
,p_display_name=>'Signature Copied to Clipboard (v3.8)'
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
prompt
prompt ========================================================================
prompt   APEX Signature v3.8.0 - Installation Complete
prompt ========================================================================
prompt
prompt   Original Author: Daniel Hochleitner (@Dani3lSun)
prompt   v3.x Development: Maxwell da Silva Oliveira (@maxwbh)
prompt   Company: M&S do Brasil LTDA
prompt
prompt   Repository: github.com/Maxwbh/apex-plugin-apexsignature
prompt
prompt   Compatibility:
prompt     - Oracle Database: 19c, 21c, 23ai
prompt     - Oracle APEX: 19.2 - 24.2
prompt
prompt   v3.x Features:
prompt     - v3.0.0 Multi-Input Capture (Draw, Upload, Webcam)
prompt     - v3.1.0 Document Signing (PDF overlay)
prompt     - v3.2.0 Signature Templates (localStorage)
prompt     - v3.3.0 Enhanced Toolbar (colors, thickness)
prompt     - v3.4.0 Timestamp Overlay
prompt     - v3.5.0 Initials Mode (compact rubrics)
prompt     - v3.6.0 Verification (SHA-256 hash)
prompt     - v3.7.0 Mobile Optimization (gestures, fullscreen)
prompt     - v3.8.0 Export Formats (PNG, JPEG, SVG, PDF, WebP)
prompt
prompt ========================================================================
