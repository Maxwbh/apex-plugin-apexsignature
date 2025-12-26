prompt --application/plugin_settings
begin
wwv_flow_imp.component_begin (
 p_version_yyyy_mm_dd=>'2024.11.30'
,p_release=>'24.2.11'
,p_default_workspace_id=>1000001
,p_default_application_id=>146
,p_default_id_offset=>123053943910939643345
,p_default_owner=>'WKSP_ASSENTADEV'
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79899468476899948)
,p_plugin_type=>'REGION TYPE'
,p_plugin=>'NATIVE_DISPLAY_SELECTOR'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'include_slider', 'Y')).to_clob
,p_version_scn=>39535937006487
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79899712886899949)
,p_plugin_type=>'ITEM TYPE'
,p_plugin=>'NATIVE_COLOR_PICKER'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'display_as', 'POPUP',
  'mode', 'FULL')).to_clob
,p_version_scn=>39535937006506
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79900017985899949)
,p_plugin_type=>'ITEM TYPE'
,p_plugin=>'NATIVE_YES_NO'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'display_style', 'SWITCH_CB',
  'off_value', 'N',
  'on_value', 'Y')).to_clob
,p_version_scn=>39535937006510
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79900382855899949)
,p_plugin_type=>'ITEM TYPE'
,p_plugin=>'NATIVE_DATE_PICKER_APEX'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'appearance_behavior', 'MONTH-PICKER:YEAR-PICKER:TODAY-BUTTON',
  'days_outside_month', 'VISIBLE',
  'show_on', 'FOCUS',
  'time_increment', '15')).to_clob
,p_version_scn=>39535937006514
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79900628819899949)
,p_plugin_type=>'REGION TYPE'
,p_plugin=>'NATIVE_MAP_REGION'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'use_vector_tile_layers', 'Y')).to_clob
,p_version_scn=>39535937006520
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79900933447899949)
,p_plugin_type=>'ITEM TYPE'
,p_plugin=>'NATIVE_STAR_RATING'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'default_icon', 'fa-star',
  'tooltip', '#VALUE#')).to_clob
,p_version_scn=>39535937006525
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79901202488899950)
,p_plugin_type=>'WEB SOURCE TYPE'
,p_plugin=>'NATIVE_ADFBC'
,p_version_scn=>39535937006531
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79901520744899950)
,p_plugin_type=>'ITEM TYPE'
,p_plugin=>'NATIVE_SINGLE_CHECKBOX'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'checked_value', 'Y',
  'unchecked_value', 'N')).to_clob
,p_version_scn=>39535937006538
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79901827939899950)
,p_plugin_type=>'PROCESS TYPE'
,p_plugin=>'NATIVE_GEOCODING'
,p_attribute_01=>'RELAX_HOUSE_NUMBER'
,p_version_scn=>39535937006543
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79902116640899950)
,p_plugin_type=>'ITEM TYPE'
,p_plugin=>'NATIVE_SELECT_MANY'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'display_values_as', 'separated')).to_clob
,p_version_scn=>39535937006546
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79902414684899950)
,p_plugin_type=>'REGION TYPE'
,p_plugin=>'NATIVE_IR'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'actions_menu_structure', 'IG')).to_clob
,p_version_scn=>39535937006552
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79902773021899950)
,p_plugin_type=>'ITEM TYPE'
,p_plugin=>'NATIVE_GEOCODED_ADDRESS'
,p_attributes=>wwv_flow_t_plugin_attributes(wwv_flow_t_varchar2(
  'background', 'default',
  'display_as', 'LIST',
  'map_preview', 'POPUP:ITEM',
  'match_mode', 'RELAX_HOUSE_NUMBER',
  'show_coordinates', 'N')).to_clob
,p_version_scn=>39535937006555
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79903003073899951)
,p_plugin_type=>'WEB SOURCE TYPE'
,p_plugin=>'NATIVE_BOSS'
,p_version_scn=>39535937006558
);
wwv_flow_imp_shared.create_plugin_setting(
 p_id=>wwv_flow_imp.id(79903363299899951)
,p_plugin_type=>'DYNAMIC ACTION'
,p_plugin=>'NATIVE_OPEN_AI_ASSISTANT'
,p_version_scn=>39535937006567
);
wwv_flow_imp.component_end;
end;
/
