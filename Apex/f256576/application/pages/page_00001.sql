prompt --application/pages/page_00001
begin
--   Manifest
--     PAGE: 00001
--   Manifest End
wwv_flow_imp.component_begin (
 p_version_yyyy_mm_dd=>'2024.11.30'
,p_release=>'24.2.11'
,p_default_workspace_id=>1000001
,p_default_application_id=>146
,p_default_id_offset=>123053943910939643345
,p_default_owner=>'WKSP_ASSENTADEV'
);
wwv_flow_imp_page.create_page(
 p_id=>1
,p_name=>'Home'
,p_alias=>'HOME'
,p_step_title=>'PLUGINS'
,p_autocomplete_on_off=>'OFF'
,p_page_template_options=>'#DEFAULT#'
,p_protection_level=>'C'
,p_page_component_map=>'13'
);
wwv_flow_imp_page.create_page_plug(
 p_id=>wwv_flow_imp.id(79178109358484044)
,p_plug_name=>'New'
,p_plug_display_sequence=>10
,p_plug_display_point=>'REGION_POSITION_08'
,p_location=>null
,p_template_component_type=>'PARTIAL'
,p_plug_source_type=>'TMPL_ASSENTA,ISHAB.ESIGNDOC'
,p_ajax_items_to_submit=>'SIGNED_DOC_BLOB,SIGNED_DOC_FILE_NAME,SIGNATURE_BLOB'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'DOC_SIGN', '1',
  'EDIT_TOGGLE', '1')).to_clob
);
wwv_flow_imp_page.create_page_plug(
 p_id=>wwv_flow_imp.id(79178735234484050)
,p_plug_name=>'items'
,p_region_name=>'items_region'
,p_region_template_options=>'#DEFAULT#:t-Region--scrollBody'
,p_plug_template=>4072358936313175081
,p_plug_display_sequence=>50
,p_location=>null
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'expand_shortcuts', 'N',
  'output_as', 'HTML')).to_clob
);
wwv_flow_imp_page.create_page_plug(
 p_id=>wwv_flow_imp.id(79917364833900020)
,p_plug_name=>'PLUGINS'
,p_region_template_options=>'#DEFAULT#'
,p_plug_template=>2674017834225413037
,p_plug_display_sequence=>30
,p_plug_display_point=>'REGION_POSITION_01'
,p_location=>null
,p_plug_query_num_rows=>15
,p_region_image=>'#APP_FILES#icons/app-icon-512.png'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'expand_shortcuts', 'N',
  'output_as', 'HTML',
  'show_line_breaks', 'Y')).to_clob
);
wwv_flow_imp_page.create_report_region(
 p_id=>wwv_flow_imp.id(80096702198091001)
,p_name=>'Stored Datas'
,p_template=>4072358936313175081
,p_display_sequence=>30
,p_region_template_options=>'#DEFAULT#:t-Region--scrollBody'
,p_component_template_options=>'#DEFAULT#:t-Report--altRowsDefault:t-Report--rowHighlight'
,p_source_type=>'NATIVE_SQL_REPORT'
,p_query_type=>'SQL'
,p_source=>wwv_flow_string.join(wwv_flow_t_varchar2(
'SELECT ',
'  ID,',
'  FILENAME,',
'  DBMS_LOB.GETLENGTH(PDF_BLOB) AS BLOB_LENGTH_BYTES,',
'  ROUND(DBMS_LOB.GETLENGTH(PDF_BLOB)/1024, 2) AS SIZE_KB,',
'  ROUND(DBMS_LOB.GETLENGTH(PDF_BLOB)/1024/1024, 2) AS SIZE_MB',
'FROM ',
'  SIGNED_DOCS',
'ORDER BY ',
'  ID DESC',
'',
'',
''))
,p_ajax_enabled=>'Y'
,p_lazy_loading=>false
,p_query_row_template=>2538654340625403440
,p_query_num_rows=>15
,p_query_options=>'DERIVED_REPORT_COLUMNS'
,p_query_num_rows_type=>'NEXT_PREVIOUS_LINKS'
,p_pagination_display_position=>'BOTTOM_RIGHT'
,p_csv_output=>'N'
,p_prn_output=>'N'
,p_sort_null=>'L'
,p_plug_query_strip_html=>'N'
,p_required_patch=>wwv_flow_imp.id(79903666764899952)
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80096832151091002)
,p_query_column_id=>1
,p_column_alias=>'ID'
,p_column_display_sequence=>10
,p_column_heading=>'Id'
,p_column_alignment=>'RIGHT'
,p_heading_alignment=>'RIGHT'
,p_derived_column=>'N'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80096975680091003)
,p_query_column_id=>2
,p_column_alias=>'FILENAME'
,p_column_display_sequence=>20
,p_column_heading=>'Filename'
,p_heading_alignment=>'LEFT'
,p_derived_column=>'N'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80097018712091004)
,p_query_column_id=>3
,p_column_alias=>'BLOB_LENGTH_BYTES'
,p_column_display_sequence=>30
,p_column_heading=>'Blob Length Bytes'
,p_column_alignment=>'RIGHT'
,p_heading_alignment=>'RIGHT'
,p_derived_column=>'N'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80097102913091005)
,p_query_column_id=>4
,p_column_alias=>'SIZE_KB'
,p_column_display_sequence=>40
,p_column_heading=>'Size Kb'
,p_column_alignment=>'RIGHT'
,p_heading_alignment=>'RIGHT'
,p_derived_column=>'N'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80097261716091006)
,p_query_column_id=>5
,p_column_alias=>'SIZE_MB'
,p_column_display_sequence=>50
,p_column_heading=>'File'
,p_column_format=>'DOWNLOAD:SIGNED_DOCS:PDF_BLOB:ID:::FILENAME:::attachment::'
,p_column_alignment=>'RIGHT'
,p_heading_alignment=>'RIGHT'
,p_derived_column=>'N'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80097645646091010)
,p_query_column_id=>6
,p_column_alias=>'DERIVED$01'
,p_column_display_sequence=>60
,p_column_heading=>'&nbsp;'
,p_column_format=>'IMAGE:SIGNED_DOCS:PDF_BLOB:ID::::::::'
,p_heading_alignment=>'LEFT'
,p_derived_column=>'Y'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_report_region(
 p_id=>wwv_flow_imp.id(239208108037121307)
,p_name=>'Sign and docs'
,p_template=>4072358936313175081
,p_display_sequence=>60
,p_region_template_options=>'#DEFAULT#:t-Region--scrollBody'
,p_component_template_options=>'#DEFAULT#:t-Report--stretch:t-Report--altRowsDefault:t-Report--rowHighlight'
,p_source_type=>'NATIVE_SQL_REPORT'
,p_query_type=>'SQL'
,p_source=>wwv_flow_string.join(wwv_flow_t_varchar2(
'SELECT ',
'    ID,',
'    FILENAME,',
'    SIGNED_DATE,',
'    ROUND(DBMS_LOB.GETLENGTH(PDF_BLOB)/1024, 2) AS SIZE_KB,',
'    ROUND(DBMS_LOB.GETLENGTH(PDF_BLOB)/1024/1024, 2) AS SIZE_MB,',
'    DBMS_LOB.GETLENGTH(PDF_BLOB) AS BLOB_LENGTH_BYTES',
'FROM ',
'    SIGNED_DOCS;'))
,p_ajax_enabled=>'Y'
,p_lazy_loading=>false
,p_query_row_template=>2538654340625403440
,p_query_num_rows=>15
,p_query_options=>'DERIVED_REPORT_COLUMNS'
,p_query_num_rows_type=>'NEXT_PREVIOUS_LINKS'
,p_pagination_display_position=>'BOTTOM_RIGHT'
,p_csv_output=>'N'
,p_prn_output=>'N'
,p_sort_null=>'L'
,p_plug_query_strip_html=>'N'
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80136439891144343)
,p_query_column_id=>1
,p_column_alias=>'ID'
,p_column_display_sequence=>10
,p_column_heading=>'Id'
,p_column_alignment=>'RIGHT'
,p_heading_alignment=>'RIGHT'
,p_disable_sort_column=>'N'
,p_derived_column=>'N'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80135269979144342)
,p_query_column_id=>2
,p_column_alias=>'FILENAME'
,p_column_display_sequence=>20
,p_column_heading=>'Filename'
,p_heading_alignment=>'LEFT'
,p_disable_sort_column=>'N'
,p_derived_column=>'N'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80135663874144343)
,p_query_column_id=>3
,p_column_alias=>'SIGNED_DATE'
,p_column_display_sequence=>30
,p_column_heading=>'Signed Date'
,p_heading_alignment=>'LEFT'
,p_disable_sort_column=>'N'
,p_derived_column=>'N'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80245148159884101)
,p_query_column_id=>4
,p_column_alias=>'SIZE_KB'
,p_column_display_sequence=>40
,p_column_heading=>'Size Kb'
,p_column_alignment=>'RIGHT'
,p_heading_alignment=>'RIGHT'
,p_disable_sort_column=>'N'
,p_derived_column=>'N'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80245218268884102)
,p_query_column_id=>5
,p_column_alias=>'SIZE_MB'
,p_column_display_sequence=>50
,p_column_heading=>'Size Mb'
,p_column_alignment=>'RIGHT'
,p_heading_alignment=>'RIGHT'
,p_disable_sort_column=>'N'
,p_derived_column=>'N'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_report_columns(
 p_id=>wwv_flow_imp.id(80136018822144343)
,p_query_column_id=>6
,p_column_alias=>'BLOB_LENGTH_BYTES'
,p_column_display_sequence=>60
,p_column_heading=>'Blob Length Bytes'
,p_column_format=>'DOWNLOAD:SIGNED_DOCS:PDF_BLOB:ID:::FILENAME:::inline::'
,p_column_alignment=>'RIGHT'
,p_heading_alignment=>'RIGHT'
,p_disable_sort_column=>'N'
,p_derived_column=>'N'
,p_include_in_export=>'Y'
);
wwv_flow_imp_page.create_page_button(
 p_id=>wwv_flow_imp.id(80097300182091007)
,p_button_sequence=>10
,p_button_plug_id=>wwv_flow_imp.id(239208108037121307)
,p_button_name=>'refersh'
,p_button_action=>'DEFINED_BY_DA'
,p_button_template_options=>'#DEFAULT#'
,p_button_template_id=>4072362960822175091
,p_button_image_alt=>'Refersh'
,p_button_position=>'COPY'
,p_warn_on_unsaved_changes=>null
);
wwv_flow_imp_page.create_page_item(
 p_id=>wwv_flow_imp.id(79178290830484045)
,p_name=>'SIGNED_DOC_BLOB'
,p_data_type=>'CLOB'
,p_item_sequence=>10
,p_item_plug_id=>wwv_flow_imp.id(79178735234484050)
,p_prompt=>'Signed Doc Blob'
,p_display_as=>'NATIVE_TEXTAREA'
,p_cSize=>30
,p_cHeight=>5
,p_field_template=>1609121967514267634
,p_item_template_options=>'#DEFAULT#'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'auto_height', 'N',
  'character_counter', 'N',
  'resizable', 'Y',
  'trim_spaces', 'BOTH')).to_clob
);
wwv_flow_imp_page.create_page_item(
 p_id=>wwv_flow_imp.id(79178366880484046)
,p_name=>'SIGNED_DOC_FILE_NAME'
,p_item_sequence=>10
,p_item_plug_id=>wwv_flow_imp.id(79178735234484050)
,p_prompt=>'Signed Doc File Name'
,p_display_as=>'NATIVE_TEXT_FIELD'
,p_cSize=>30
,p_field_template=>1609121967514267634
,p_item_template_options=>'#DEFAULT#'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'disabled', 'N',
  'submit_when_enter_pressed', 'N',
  'subtype', 'TEXT',
  'trim_spaces', 'BOTH')).to_clob
);
wwv_flow_imp_page.create_page_item(
 p_id=>wwv_flow_imp.id(79178477930484047)
,p_name=>'SIGNATURE_BLOB'
,p_data_type=>'CLOB'
,p_item_sequence=>10
,p_item_plug_id=>wwv_flow_imp.id(79178735234484050)
,p_prompt=>'Signature Blob'
,p_display_as=>'NATIVE_TEXTAREA'
,p_cSize=>30
,p_cHeight=>5
,p_field_template=>1609121967514267634
,p_item_template_options=>'#DEFAULT#'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'auto_height', 'N',
  'character_counter', 'N',
  'resizable', 'Y',
  'trim_spaces', 'BOTH')).to_clob
);
wwv_flow_imp_page.create_page_da_event(
 p_id=>wwv_flow_imp.id(80097484135091008)
,p_name=>'New'
,p_event_sequence=>10
,p_triggering_element_type=>'BUTTON'
,p_triggering_button_id=>wwv_flow_imp.id(80097300182091007)
,p_bind_type=>'bind'
,p_execution_type=>'IMMEDIATE'
,p_bind_event_type=>'click'
);
wwv_flow_imp_page.create_page_da_action(
 p_id=>wwv_flow_imp.id(80097524164091009)
,p_event_id=>wwv_flow_imp.id(80097484135091008)
,p_event_result=>'TRUE'
,p_action_sequence=>10
,p_execute_on_page_init=>'N'
,p_action=>'NATIVE_REFRESH'
,p_affected_elements_type=>'REGION'
,p_affected_region_id=>wwv_flow_imp.id(239208108037121307)
,p_attribute_01=>'N'
);
wwv_flow_imp_page.create_page_process(
 p_id=>wwv_flow_imp.id(79178516535484048)
,p_process_sequence=>10
,p_process_point=>'ON_DEMAND'
,p_process_type=>'NATIVE_PLSQL'
,p_process_name=>'SAVE_SIGNED_PDF'
,p_process_sql_clob=>wwv_flow_string.join(wwv_flow_t_varchar2(
'DECLARE',
'  l_blob     BLOB;',
'BEGIN',
'',
'    l_blob := apex_web_service.clobbase642blob(:SIGNED_DOC_BLOB);',
'',
'    INSERT INTO SIGNED_DOCS (FILENAME, PDF_BLOB)',
'    VALUES (apex_application.g_x01, l_blob);',
'END;',
''))
,p_process_clob_language=>'PLSQL'
,p_internal_uid=>79178516535484048
);
wwv_flow_imp_page.create_page_process(
 p_id=>wwv_flow_imp.id(79178654565484049)
,p_process_sequence=>20
,p_process_point=>'ON_DEMAND'
,p_process_type=>'NATIVE_PLSQL'
,p_process_name=>'SAVE_SIGNED_SIGN'
,p_process_sql_clob=>wwv_flow_string.join(wwv_flow_t_varchar2(
'DECLARE',
'  l_blob     BLOB;',
'BEGIN',
'',
'    l_blob := apex_web_service.clobbase642blob(:SIGNATURE_BLOB);',
'',
'    INSERT INTO SIGNED_DOCS (FILENAME, PDF_BLOB)',
'    VALUES (apex_application.g_x01, l_blob);',
'END;',
''))
,p_process_clob_language=>'PLSQL'
,p_internal_uid=>79178654565484049
);
wwv_flow_imp.component_end;
end;
/
