prompt --application/shared_components/logic/build_options
begin
--   Manifest
--     BUILD OPTIONS: 256576
--   Manifest End
wwv_flow_imp.component_begin (
 p_version_yyyy_mm_dd=>'2024.11.30'
,p_release=>'24.2.11'
,p_default_workspace_id=>1000001
,p_default_application_id=>146
,p_default_id_offset=>123053943910939643345
,p_default_owner=>'WKSP_ASSENTADEV'
);
wwv_flow_imp_shared.create_build_option(
 p_id=>wwv_flow_imp.id(79903666764899952)
,p_build_option_name=>'Commented Out'
,p_build_option_status=>'EXCLUDE'
,p_version_scn=>39535937006600
);
wwv_flow_imp.component_end;
end;
/
