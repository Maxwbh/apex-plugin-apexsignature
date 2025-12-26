prompt --application/shared_components/navigation/lists/navigation_menu
begin
--   Manifest
--     LIST: Navigation Menu
--   Manifest End
wwv_flow_imp.component_begin (
 p_version_yyyy_mm_dd=>'2024.11.30'
,p_release=>'24.2.11'
,p_default_workspace_id=>1000001
,p_default_application_id=>146
,p_default_id_offset=>123053943910939643345
,p_default_owner=>'WKSP_ASSENTADEV'
);
wwv_flow_imp_shared.create_list(
 p_id=>wwv_flow_imp.id(79904777447899956)
,p_name=>'Navigation Menu'
,p_list_status=>'PUBLIC'
,p_version_scn=>39535958866066
);
wwv_flow_imp_shared.create_list_item(
 p_id=>wwv_flow_imp.id(79916433535900018)
,p_list_item_display_sequence=>10
,p_list_item_link_text=>'Home'
,p_list_item_link_target=>'f?p=&APP_ID.:1:&APP_SESSION.::&DEBUG.:::'
,p_list_item_icon=>'fa-home'
,p_list_item_current_type=>'TARGET_PAGE'
);
wwv_flow_imp_shared.create_list_item(
 p_id=>wwv_flow_imp.id(80112388028141625)
,p_list_item_display_sequence=>20
,p_list_item_link_text=>'sign'
,p_list_item_link_target=>'f?p=&APP_ID.:2:&APP_SESSION.::&DEBUG.:::'
,p_list_item_current_type=>'COLON_DELIMITED_PAGE_LIST'
,p_list_item_current_for_pages=>'2'
);
wwv_flow_imp.component_end;
end;
/
