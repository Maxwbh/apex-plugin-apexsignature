# Matriz de Compatibilidade - APEX Signature v2.0.1

**Data:** 2025-12-16
**Autor:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**LinkedIn:** /maxwbh

---

## 1. Resumo de Compatibilidade

| Componente | Versões Suportadas | Status |
|------------|-------------------|--------|
| **Oracle Database** | 19c, 21c, 23ai (23c) | ✅ Compatível |
| **Oracle APEX** | 19.2 - 24.2 | ✅ Compatível |
| **Navegadores** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ | ✅ Compatível |

---

## 2. APIs PL/SQL - Validação

### 2.1 APIs do Oracle Database

| API | Oracle 19c | Oracle 21c | Oracle 23ai | Notas |
|-----|:----------:|:----------:|:-----------:|-------|
| `DBMS_LOB.createtemporary` | ✅ | ✅ | ✅ | Estável desde 8i |
| `DBMS_LOB.writeappend` | ✅ | ✅ | ✅ | Estável desde 8i |
| `DBMS_LOB.getlength` | ✅ | ✅ | ✅ | Estável desde 8i |
| `DBMS_LOB.freetemporary` | ✅ | ✅ | ✅ | Estável desde 9i |
| `DBMS_LOB.istemporary` | ✅ | ✅ | ✅ | Estável desde 9i |
| `SYS.HTP.p` | ✅ | ✅ | ✅ | Estável (PL/SQL Web Toolkit) |
| `TO_CHAR` | ✅ | ✅ | ✅ | Função SQL padrão |
| `SYSDATE` | ✅ | ✅ | ✅ | Função SQL padrão |
| `NVL` | ✅ | ✅ | ✅ | Função SQL padrão |
| `LENGTH` | ✅ | ✅ | ✅ | Função SQL padrão |
| `JSON_OBJECT_T` | ⚠️ 19c+ | ✅ | ✅ | Requer 19c ou superior |
| `SYS_GUID` | ✅ | ✅ | ✅ | Estável desde 8i |

### 2.2 APIs do APEX

| API | APEX 19.2 | APEX 21.x | APEX 23.x | APEX 24.2 | Notas |
|-----|:---------:|:---------:|:---------:|:---------:|-------|
| `apex_application.g_debug` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_application.g_f01` | ✅ | ✅ | ✅ | ✅ | Substituiu wwv_flow.g_f01 |
| `apex_application.g_user` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_plugin.t_region` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_plugin.t_plugin` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_plugin.get_ajax_identifier` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_plugin_util.debug_region` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_plugin_util.execute_plsql_code` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_escape.html` | ✅ | ✅ | ✅ | ✅ | Preferido sobre htf.escape_sc |
| `apex_escape.html_attribute` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_javascript.add_library` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_javascript.add_onload_code` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_javascript.add_value` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_javascript.add_attribute` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_collection.collection_exists` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_collection.create_collection` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_collection.add_member` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex_web_service.clobbase642blob` | ✅ | ✅ | ✅ | ✅ | Estável |

### 2.3 APIs Descontinuadas (NÃO usadas no plugin)

| API Antiga | Substituída Por | Status no Plugin |
|------------|-----------------|------------------|
| `wwv_flow.g_f01` | `apex_application.g_f01` | ✅ Atualizado |
| `sys.htf.escape_sc` | `apex_escape.html` | ✅ Atualizado |
| `wwv_flow_utilities.join` | N/A (apenas no export) | N/A |
| `wwv_flow_api` | `apex_*` packages | N/A (apenas no export) |

---

## 3. APIs JavaScript - Validação

### 3.1 APEX JavaScript API

| API | APEX 19.2 | APEX 21.x | APEX 23.x | APEX 24.2 | Notas |
|-----|:---------:|:---------:|:---------:|:---------:|-------|
| `apex.server.plugin` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex.jQuery` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex.util.showSpinner` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex.message.alert` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex.event.trigger` | ✅ | ✅ | ✅ | ✅ | Estável |
| `apex.region.create` | ✅ | ✅ | ✅ | ✅ | Estável |

### 3.2 Browser APIs

| API | Chrome 90+ | Firefox 88+ | Safari 14+ | Edge 90+ | Notas |
|-----|:----------:|:-----------:|:----------:|:--------:|-------|
| `PointerEvent` | ✅ | ✅ | ✅ | ✅ | Touch/Stylus |
| `CustomEvent` | ✅ | ✅ | ✅ | ✅ | Eventos customizados |
| `EventTarget` | ✅ | ✅ | ✅ | ✅ | Base de eventos |
| `Canvas 2D` | ✅ | ✅ | ✅ | ✅ | Desenho |
| `toDataURL` | ✅ | ✅ | ✅ | ✅ | Exportação PNG |
| `getBoundingClientRect` | ✅ | ✅ | ✅ | ✅ | Coordenadas |
| `document.getElementById` | ✅ | ✅ | ✅ | ✅ | DOM |
| `setTimeout` | ✅ | ✅ | ✅ | ✅ | Timers |
| `console.log/error/warn` | ✅ | ✅ | ✅ | ✅ | Debug |

---

## 4. Validação Oracle 19c

### 4.1 Funcionalidades Suportadas
- ✅ DBMS_LOB package completo
- ✅ APEX Collections
- ✅ APEX Plugin Framework
- ✅ Base64 encoding/decoding
- ✅ BLOB storage

### 4.2 Limitações
- ⚠️ JSON_OBJECT_T disponível apenas a partir do 19c
- ⚠️ Sem suporte a JSON Duality Views (23ai only)

### 4.3 Código de Teste Oracle 19c
```sql
-- Verificar versão do banco
SELECT banner FROM v$version WHERE ROWNUM = 1;

-- Verificar APEX version
SELECT version_no FROM apex_release;

-- Testar DBMS_LOB
DECLARE
  l_clob CLOB;
BEGIN
  DBMS_LOB.createtemporary(l_clob, FALSE, DBMS_LOB.SESSION);
  DBMS_LOB.writeappend(l_clob, 4, 'test');
  DBMS_LOB.freetemporary(l_clob);
  DBMS_OUTPUT.put_line('DBMS_LOB: OK');
END;
/

-- Testar apex_web_service
DECLARE
  l_blob BLOB;
BEGIN
  l_blob := apex_web_service.clobbase642blob(p_clob => 'dGVzdA==');
  DBMS_OUTPUT.put_line('apex_web_service: OK - Length: ' || DBMS_LOB.getlength(l_blob));
END;
/

-- Testar apex_escape
BEGIN
  DBMS_OUTPUT.put_line('apex_escape: ' || apex_escape.html('<script>'));
END;
/
```

---

## 5. Validação Oracle 23ai (23c)

### 5.1 Novas Funcionalidades Disponíveis
- ✅ JSON Duality Views (opcional)
- ✅ JSON_OBJECT_T melhorado
- ✅ Property Graphs (opcional)
- ✅ AI Vector Search (opcional)

### 5.2 Funcionalidades Usadas no Plugin
- ✅ DBMS_LOB (sem mudanças)
- ✅ APEX APIs (sem mudanças)
- ✅ JSON_OBJECT_T (exemplo opcional)

### 5.3 Código de Teste Oracle 23ai
```sql
-- Verificar versão
SELECT banner FROM v$version WHERE ROWNUM = 1;

-- Testar JSON_OBJECT_T (Oracle 23ai)
DECLARE
  l_json JSON_OBJECT_T;
BEGIN
  l_json := JSON_OBJECT_T();
  l_json.put('test', 'value');
  DBMS_OUTPUT.put_line('JSON_OBJECT_T: OK - ' || l_json.to_string());
END;
/

-- Testar compatibilidade APEX 24.2
DECLARE
  l_version VARCHAR2(20);
BEGIN
  SELECT version_no INTO l_version FROM apex_release;
  DBMS_OUTPUT.put_line('APEX Version: ' || l_version);
END;
/
```

---

## 6. Validação APEX 24.2

### 6.1 Novos Recursos do APEX 24.2 Suportados
- ✅ Universal Theme CSS Variables
- ✅ Dark Mode support
- ✅ ARIA accessibility
- ✅ Improved event system
- ✅ apex.region API

### 6.2 Recursos Específicos do Plugin
| Recurso | Status | Implementação |
|---------|--------|---------------|
| Dark Mode | ✅ | CSS Variables `--ut-component-border-color` |
| Responsividade | ✅ | Canvas resize automático |
| Touch/Stylus | ✅ | Pointer Events API |
| Acessibilidade | ✅ | ARIA role, label, tabindex |
| Dynamic Actions | ✅ | Eventos customizados funcionais |

### 6.3 CSS Variables Usadas
```css
/* Universal Theme variables usadas */
--ut-component-border-color  /* Borda do canvas */
```

---

## 7. Checklist de Validação

### 7.1 Oracle 19c
- [ ] Plugin instalado sem erros
- [ ] Assinatura desenha corretamente
- [ ] Assinatura salva no banco
- [ ] Evento DA dispara
- [ ] APEX Collection criada

### 7.2 Oracle 21c
- [ ] Plugin instalado sem erros
- [ ] Assinatura desenha corretamente
- [ ] Assinatura salva no banco
- [ ] Evento DA dispara
- [ ] APEX Collection criada

### 7.3 Oracle 23ai
- [ ] Plugin instalado sem erros
- [ ] Assinatura desenha corretamente
- [ ] Assinatura salva no banco
- [ ] Evento DA dispara
- [ ] APEX Collection criada
- [ ] JSON storage (opcional)

### 7.4 APEX 24.2
- [ ] Dark Mode funciona
- [ ] Responsividade OK
- [ ] Touch/Stylus funciona
- [ ] ARIA attributes presentes
- [ ] apex.region API funciona

---

## 8. Breaking Changes

### De v1.1 para v2.0.1
| Mudança | Impacto | Ação Necessária |
|---------|---------|-----------------|
| signature_pad 1.5.3 → 5.0.4 | Baixo | Nenhuma (backward compatible) |
| Novo evento `apexsignature-initialized` | Nenhum | Opcional |
| Novos eventos stroke-begin/end | Nenhum | Opcional |
| Page Items to Submit | Nenhum | Opcional (novo atributo) |

### Compatibilidade Retroativa
- ✅ Eventos jQuery ainda funcionam
- ✅ Código PL/SQL existente funciona
- ✅ Configurações do plugin mantidas

---

## 9. Suporte e Documentação

### Links Úteis
- [Oracle APEX 24.2 Release Notes](https://docs.oracle.com/en/database/oracle/apex/24.2/)
- [Oracle 23ai New Features](https://docs.oracle.com/en/database/oracle/oracle-database/23/)
- [signature_pad v5.x Documentation](https://github.com/szimek/signature_pad)

### Contato
- **GitHub Issues:** https://github.com/Dani3lSun/apex-plugin-apexsignature/issues
- **Autor Original:** Daniel Hochleitner
- **Contribuidor v2.0.1:** Maxwell da Silva Oliveira (LinkedIn: /maxwbh)

---

**Documento validado em:** 2025-12-16
**Versão do Plugin:** 2.0.1
