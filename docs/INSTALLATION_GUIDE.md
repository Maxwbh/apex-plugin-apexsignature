# Guia de Instalacao - APEX Signature v3.8.0

**Versao**: 3.8.0
**Autor**: Maxwell da Silva Oliveira (@maxwbh)
**Empresa**: M&S do Brasil LTDA
**Repositorio**: [github.com/Maxwbh/apex-plugin-apexsignature](https://github.com/Maxwbh/apex-plugin-apexsignature)

---

## Indice

1. [Requisitos](#requisitos)
2. [Download](#download)
3. [Instalacao Rapida](#instalacao-rapida)
4. [Instalacao Manual Completa](#instalacao-manual-completa)
5. [Configuracao do Plugin](#configuracao-do-plugin)
6. [Criar Tabela de Assinaturas](#criar-tabela-de-assinaturas)
7. [Primeira Utilizacao](#primeira-utilizacao)
8. [Resolucao de Problemas](#resolucao-de-problemas)

---

## Requisitos

### Software Necessario

| Componente | Versao Minima | Versao Recomendada |
|------------|---------------|-------------------|
| Oracle Database | 19c | 23ai |
| Oracle APEX | 22.2 | 24.2 |
| Navegador moderno | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |

### Bibliotecas JavaScript (Incluidas)

| Biblioteca | Versao | Funcionalidade |
|------------|--------|----------------|
| signature_pad.js | 5.0.4 | Captura de assinatura |
| PDF.js | 2.10.377 | Renderizacao de PDF |
| pdf-lib | 1.17.1 | Manipulacao de PDF |
| jsPDF | 2.5.1 | Geracao de PDF |

---

## Download

### Opcao 1: Clone do Repositorio (Recomendado)

```bash
git clone https://github.com/Maxwbh/apex-plugin-apexsignature.git
cd apex-plugin-apexsignature
```

### Opcao 2: Download ZIP

1. Acesse [github.com/Maxwbh/apex-plugin-apexsignature](https://github.com/Maxwbh/apex-plugin-apexsignature)
2. Clique em "Code" > "Download ZIP"
3. Extraia o arquivo

### Opcao 3: Release Especifica

1. Acesse [Releases](https://github.com/Maxwbh/apex-plugin-apexsignature/releases)
2. Baixe a versao desejada (v3.8.0)

---

## Instalacao Rapida

### Passo 1: Importar Plugin

1. Acesse sua aplicacao APEX
2. Navegue para: **Componentes Compartilhados** > **Plugins**
3. Clique em **Importar**
4. Selecione o arquivo: `source/region_type_plugin_de_danielh_apexsignature.sql`
5. Clique em **Proximo** e depois **Instalar Plugin**

### Passo 2: Criar Regiao

1. Edite uma pagina no Page Designer
2. Clique com botao direito em "Body" > **Criar Regiao**
3. Tipo: **APEX Signature [Plug-In]**
4. Titulo: "Assinatura"
5. Salve a pagina

### Passo 3: Testar

1. Execute a pagina
2. Desenhe uma assinatura
3. A assinatura deve aparecer no canvas

---

## Instalacao Manual Completa

Para utilizar todos os modulos v3.x, siga os passos abaixo:

### Passo 1: Importar Plugin Base

```
Componentes Compartilhados > Plugins > Importar
Arquivo: source/region_type_plugin_de_danielh_apexsignature.sql
```

### Passo 2: Fazer Upload dos Arquivos JavaScript

Navegue para: **Componentes Compartilhados** > **Arquivos de Aplicacao Estaticos**

Faca upload dos seguintes arquivos da pasta `server/js/`:

| Arquivo | Descricao |
|---------|-----------|
| `signature_pad.min.js` | Biblioteca principal |
| `apexsignature.js` | Modulo core |
| `apexsignature-docsign.js` | Assinatura de documentos |
| `apexsignature-templates.js` | Templates de assinatura |
| `apexsignature-toolbar.js` | Barra de ferramentas |
| `apexsignature-timestamp.js` | Carimbo de data/hora |
| `apexsignature-initials.js` | Modo rubricas |
| `apexsignature-verification.js` | Verificacao SHA-256 |
| `apexsignature-mobile.js` | Otimizacao mobile |
| `apexsignature-export.js` | Formatos de exportacao |

### Passo 3: Fazer Upload dos Arquivos CSS

Faca upload dos seguintes arquivos da pasta `server/css/`:

| Arquivo | Descricao |
|---------|-----------|
| `apexsignature.css` | Estilos principais |
| `apexsignature-docsign.css` | Estilos DocSign |
| `apexsignature-templates.css` | Estilos Templates |
| `apexsignature-toolbar.css` | Estilos Toolbar |
| `apexsignature-timestamp.css` | Estilos Timestamp |
| `apexsignature-initials.css` | Estilos Initials |
| `apexsignature-verification.css` | Estilos Verification |
| `apexsignature-mobile.css` | Estilos Mobile |
| `apexsignature-export.css` | Estilos Export |

### Passo 4: Configurar Referencias no Plugin

Edite o plugin e adicione as referencias:

**CSS File URLs:**
```
#APP_FILES#apexsignature.css
#APP_FILES#apexsignature-docsign.css
#APP_FILES#apexsignature-templates.css
#APP_FILES#apexsignature-toolbar.css
#APP_FILES#apexsignature-timestamp.css
#APP_FILES#apexsignature-initials.css
#APP_FILES#apexsignature-verification.css
#APP_FILES#apexsignature-mobile.css
#APP_FILES#apexsignature-export.css
```

**JavaScript File URLs:**
```
#APP_FILES#signature_pad.min.js
#APP_FILES#apexsignature.js
#APP_FILES#apexsignature-docsign.js
#APP_FILES#apexsignature-templates.js
#APP_FILES#apexsignature-toolbar.js
#APP_FILES#apexsignature-timestamp.js
#APP_FILES#apexsignature-initials.js
#APP_FILES#apexsignature-verification.js
#APP_FILES#apexsignature-mobile.js
#APP_FILES#apexsignature-export.js
https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js
https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js
https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
```

---

## Configuracao do Plugin

### Atributos Disponiveis

| Atributo | Tipo | Padrao | Descricao |
|----------|------|--------|-----------|
| Largura do Canvas | Numero | 400 | Largura em pixels |
| Altura do Canvas | Numero | 200 | Altura em pixels |
| Espessura da Linha | Numero | 2 | Espessura do traco (1-10) |
| Cor da Caneta | Texto | #000000 | Cor em formato hex |
| Cor de Fundo | Texto | #FFFFFF | Cor de fundo do canvas |
| Modo de Captura | Lista | all | draw, upload, webcam, all |
| Mostrar Toolbar | Sim/Nao | Sim | Exibir barra de ferramentas |
| Mostrar Botao Limpar | Sim/Nao | Sim | Exibir botao limpar |
| Mostrar Botao Desfazer | Sim/Nao | Sim | Exibir botao desfazer |
| Mostrar Seletor de Cor | Sim/Nao | Sim | Exibir color picker |
| Mostrar Espessura | Sim/Nao | Sim | Exibir slider espessura |
| Habilitar DocSign | Sim/Nao | Nao | Assinatura de PDF |
| Habilitar Templates | Sim/Nao | Nao | Templates salvos |
| Habilitar Timestamp | Sim/Nao | Nao | Carimbo de data/hora |
| Habilitar Initials | Sim/Nao | Nao | Modo rubricas |
| Habilitar Verification | Sim/Nao | Nao | Verificacao SHA-256 |
| Habilitar Mobile | Sim/Nao | Nao | Otimizacao mobile |
| Habilitar Export | Sim/Nao | Sim | Multi-formato export |

---

## Criar Tabela de Assinaturas

### Estrutura Recomendada

```sql
-- Tabela para armazenar assinaturas
CREATE TABLE assinaturas (
    id              NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    assinatura_blob BLOB NOT NULL,
    nome_arquivo    VARCHAR2(255),
    tipo_mime       VARCHAR2(100) DEFAULT 'image/png',
    hash_sha256     VARCHAR2(64),
    metadados       CLOB,
    usuario_id      NUMBER,
    data_criacao    TIMESTAMP DEFAULT SYSTIMESTAMP,
    ip_origem       VARCHAR2(50),
    user_agent      VARCHAR2(500)
);

-- Indice para buscas por usuario
CREATE INDEX idx_assinaturas_usuario ON assinaturas(usuario_id);

-- Indice para buscas por data
CREATE INDEX idx_assinaturas_data ON assinaturas(data_criacao);

-- Comentarios
COMMENT ON TABLE assinaturas IS 'Tabela de assinaturas digitais - APEX Signature v3.8.0';
COMMENT ON COLUMN assinaturas.hash_sha256 IS 'Hash SHA-256 para verificacao de integridade';
COMMENT ON COLUMN assinaturas.metadados IS 'JSON com metadados de auditoria';
```

### Procedure para Salvar Assinatura

```sql
CREATE OR REPLACE PROCEDURE salvar_assinatura (
    p_usuario_id IN NUMBER DEFAULT NULL
)
AS
    l_blob      BLOB;
    l_filename  VARCHAR2(255);
    l_mime_type VARCHAR2(100);
    l_hash      VARCHAR2(64);
BEGIN
    -- Buscar da colecao APEX
    SELECT blob001, c001, c002, c003
      INTO l_blob, l_filename, l_mime_type, l_hash
      FROM apex_collections
     WHERE collection_name = 'APEX_SIGNATURE'
       AND ROWNUM = 1;

    -- Inserir na tabela
    INSERT INTO assinaturas (
        assinatura_blob,
        nome_arquivo,
        tipo_mime,
        hash_sha256,
        usuario_id,
        ip_origem,
        user_agent
    ) VALUES (
        l_blob,
        l_filename,
        l_mime_type,
        l_hash,
        NVL(p_usuario_id, V('APP_USER')),
        OWA_UTIL.get_cgi_env('REMOTE_ADDR'),
        OWA_UTIL.get_cgi_env('HTTP_USER_AGENT')
    );

    -- Limpar colecao
    apex_collection.delete_collection('APEX_SIGNATURE');

    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        raise_application_error(-20001, 'Nenhuma assinatura encontrada na colecao');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END salvar_assinatura;
/
```

---

## Primeira Utilizacao

### Exemplo Basico

1. **Criar Pagina**
   - Nova pagina em branco

2. **Adicionar Regiao de Assinatura**
   - Tipo: APEX Signature [Plug-In]
   - Static ID: `sig_region`
   - Titulo: "Assine Aqui"

3. **Adicionar Botao Salvar**
   - Nome: `BTN_SALVAR`
   - Label: "Salvar Assinatura"

4. **Criar Dynamic Action**
   - Evento: Click
   - Selecao: #BTN_SALVAR
   - Acao True: Execute JavaScript Code

   ```javascript
   // Salvar assinatura no servidor
   apexSignature.save('sig_region');
   ```

5. **Criar Processo de Pagina (Opcional)**
   - Tipo: PL/SQL
   - Ponto: On Submit - After Computations

   ```sql
   BEGIN
       salvar_assinatura(p_usuario_id => :APP_USER_ID);
   END;
   ```

### Exemplo com Assinatura de PDF

```javascript
// 1. Carregar PDF
document.getElementById('pdf_upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        apexSignatureDocSign.loadPDF('sig_region', event.target.result);
    };

    reader.readAsArrayBuffer(file);
});

// 2. Aplicar assinatura ao PDF
document.getElementById('btn_apply').addEventListener('click', function() {
    apexSignatureDocSign.applySignature('sig_region');
});

// 3. Baixar PDF assinado
document.getElementById('btn_download').addEventListener('click', async function() {
    const pdfBytes = await apexSignatureDocSign.generateSignedPDF('sig_region');
    apexSignatureExport.downloadBlob(pdfBytes, 'documento_assinado.pdf', 'application/pdf');
});
```

### Exemplo com Verificacao

```javascript
// Gerar e armazenar hash ao salvar
async function salvarComVerificacao() {
    const hash = await apexSignatureVerification.generateHash('sig_region');

    // Armazenar hash em item APEX
    apex.item('P1_HASH').setValue(hash);

    // Salvar assinatura
    apexSignature.save('sig_region');
}

// Verificar integridade posteriormente
async function verificarAssinatura(hashOriginal) {
    const isValid = await apexSignatureVerification.verify('sig_region', hashOriginal);

    if (isValid) {
        apex.message.showPageSuccess('Assinatura valida!');
    } else {
        apex.message.showErrors([{
            type: 'error',
            message: 'Assinatura adulterada ou invalida!'
        }]);
    }
}
```

---

## Resolucao de Problemas

### Problema: Plugin nao carrega

**Sintoma**: Canvas nao aparece na pagina

**Solucoes**:
1. Verifique se o plugin foi importado corretamente
2. Confirme se os arquivos JS/CSS estao carregados (F12 > Network)
3. Verifique erros no console do navegador (F12 > Console)

### Problema: Assinatura nao salva

**Sintoma**: Erro ao salvar no banco

**Solucoes**:
1. Verifique se a colecao APEX_SIGNATURE existe
2. Confirme permissoes na tabela de destino
3. Verifique o codigo PL/SQL no plugin

### Problema: PDF nao carrega

**Sintoma**: PDF.js nao renderiza

**Solucoes**:
1. Verifique se PDF.js esta carregado
2. Confirme que o PDF nao esta corrompido
3. Teste com PDF menor/mais simples

### Problema: Performance lenta

**Sintoma**: Atraso ao desenhar

**Solucoes**:
1. Reduza dimensoes do canvas
2. Desative modulos nao utilizados
3. Use versoes minificadas (.min.js)

### Problema: Nao funciona no mobile

**Sintoma**: Touch nao responde

**Solucoes**:
1. Habilite "Enable Mobile" nos atributos
2. Verifique touch-action CSS
3. Teste em diferentes dispositivos

---

## Suporte

- **Issues**: [github.com/Maxwbh/apex-plugin-apexsignature/issues](https://github.com/Maxwbh/apex-plugin-apexsignature/issues)
- **Documentacao**: [github.com/Maxwbh/apex-plugin-apexsignature/docs](https://github.com/Maxwbh/apex-plugin-apexsignature/tree/main/docs)
- **LinkedIn**: [linkedin.com/in/maxwbh](https://linkedin.com/in/maxwbh)

---

**APEX Signature v3.8.0** - Desenvolvido por Maxwell da Silva Oliveira (@maxwbh) - M&S do Brasil LTDA
