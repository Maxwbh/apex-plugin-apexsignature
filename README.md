# Oracle APEX Region Plugin - APEX Signature v3.8.0

[![APEX Community](https://cdn.rawgit.com/Dani3lSun/apex-github-badges/78c5adbe/badges/apex-community-badge.svg)](https://github.com/Dani3lSun/apex-github-badges) [![APEX Plugin](https://cdn.rawgit.com/Dani3lSun/apex-github-badges/b7e95341/badges/apex-plugin-badge.svg)](https://github.com/Dani3lSun/apex-github-badges)
[![APEX Built with Love](https://cdn.rawgit.com/Dani3lSun/apex-github-badges/7919f913/badges/apex-love-badge.svg)](https://github.com/Dani3lSun/apex-github-badges)

**Plugin moderno de captura de assinatura para Oracle APEX com suporte multi-entrada, assinatura de PDF e recursos avancados.**

---

## Creditos e Atribuicao

### Autor Original
Este plugin e baseado no excelente trabalho de **Daniel Hochleitner** ([@Dani3lSun](https://github.com/Dani3lSun)):
- **Repositorio Original**: [Dani3lSun/apex-plugin-apexsignature](https://github.com/Dani3lSun/apex-plugin-apexsignature)
- **Biblioteca Signature Pad**: [szimek/signature_pad](https://github.com/szimek/signature_pad)

### Modernizacao Versao 3.x
A serie v3.x foi desenvolvida por **Maxwell da Silva Oliveira** ([@maxwbh](https://github.com/maxwbh)):
- **Empresa**: M&S do Brasil LTDA
- **LinkedIn**: [/maxwbh](https://linkedin.com/in/maxwbh)
- **Repositorio v3.x**: [Maxwbh/apex-plugin-apexsignature](https://github.com/Maxwbh/apex-plugin-apexsignature)

---

## Novidades na v3.x

A versao 3.x traz grandes melhorias para compatibilidade com **Oracle 23ai** e **APEX 24.2**:

| Versao | Recurso | Descricao |
|--------|---------|-----------|
| **v3.0.0** | Captura Multi-Entrada | Desenho, Upload e Webcam |
| **v3.1.0** | Assinatura de Documentos | Overlay em PDF com posicionamento drag-drop |
| **v3.2.0** | Templates de Assinatura | Salvar e reutilizar assinaturas com localStorage |
| **v3.3.0** | Barra de Ferramentas | Seletor de cor, espessura, estilos personalizados |
| **v3.4.0** | Carimbo de Data/Hora | Formatos de data/hora customizaveis |
| **v3.5.0** | Modo Rubricas | Captura compacta de iniciais/rubricas |
| **v3.6.0** | Verificacao | Hash SHA-256 e deteccao de adulteracao |
| **v3.7.0** | Otimizacao Mobile | Gestos touch, fullscreen, suporte a stylus |
| **v3.8.0** | Formatos de Exportacao | PNG, JPEG, SVG, PDF, WebP, Base64 |

---

## Instalacao

### Instalacao Rapida (Recomendada)

1. **Baixe** a ultima versao do [repositorio @maxwbh](https://github.com/Maxwbh/apex-plugin-apexsignature/releases)

2. **Importe o Plugin** na sua aplicacao APEX:
   ```
   Componentes Compartilhados > Plugins > Importar > region_type_plugin_apexsignature.sql
   ```

3. **Pronto!** O plugin esta pronto para uso.

### Instalacao Manual (Avancada)

Para instalacao detalhada com todos os modulos v3.x, veja: **[INSTALLATION_GUIDE.md](docs/INSTALLATION_GUIDE.md)**

---

## Inicio Rapido

### 1. Criar uma Regiao de Assinatura

```sql
-- No Page Designer, crie uma nova regiao:
-- Tipo: APEX Signature [Plug-In]
-- Static ID: minha_assinatura
```

### 2. Configurar Atributos do Plugin

| Atributo | Descricao | Padrao |
|----------|-----------|--------|
| Largura do Canvas | Largura em pixels | 400 |
| Altura do Canvas | Altura em pixels | 200 |
| Cor da Caneta | Cor do traco (hex) | #000000 |
| Cor de Fundo | Fundo do canvas | #FFFFFF |
| Modo de Captura | desenho / upload / todos | todos |
| Habilitar Exportacao | Exportacao multi-formato | Sim |

### 3. Salvar Assinatura no Banco de Dados

```sql
DECLARE
  l_blob      BLOB;
  l_filename  VARCHAR2(100);
  l_mime_type VARCHAR2(100);
BEGIN
  -- Obter assinatura da colecao APEX
  SELECT blob001, c001, c002
    INTO l_blob, l_filename, l_mime_type
    FROM apex_collections
   WHERE collection_name = 'APEX_SIGNATURE'
     AND ROWNUM = 1;

  -- Inserir na sua tabela
  INSERT INTO assinaturas (assinatura_blob, nome_arquivo, tipo_mime, data_criacao)
  VALUES (l_blob, l_filename, l_mime_type, SYSDATE);

  COMMIT;
END;
```

---

## Recursos

### Captura Multi-Entrada (v3.0.0)
Capture assinaturas atraves de multiplos metodos:
- **Desenho**: Desenho a mao livre com mouse/touch
- **Upload**: Importar imagens de assinatura existentes
- **Webcam**: Capturar assinaturas via camera

```javascript
// Trocar modo de captura programaticamente
apexSignature.setMode('minha_assinatura', 'webcam');
```

### Assinatura de Documentos (v3.1.0)
Assine documentos PDF com posicionamento drag-drop:

```javascript
// Carregar PDF e habilitar assinatura
apexSignatureDocSign.loadPDF('minha_assinatura', pdfBase64);
apexSignatureDocSign.enableSigning('minha_assinatura');
```

### Templates de Assinatura (v3.2.0)
Salve e reutilize assinaturas:

```javascript
// Salvar assinatura atual como template
apexSignatureTemplates.save('minha_assinatura', 'Minha Assinatura');

// Carregar template salvo
apexSignatureTemplates.load('minha_assinatura', 'Minha Assinatura');
```

### Barra de Ferramentas Aprimorada (v3.3.0)
Personalize a aparencia da assinatura:
- Seletor de cores com presets
- Controle de espessura (1-10px)
- Funcionalidade Desfazer/Refazer

### Carimbo de Data/Hora (v3.4.0)
Adicione data/hora as assinaturas:

```javascript
apexSignatureTimestamp.enable('minha_assinatura', {
  format: 'DD/MM/YYYY HH:mm:ss',
  position: 'bottom-right'
});
```

### Modo Rubricas (v3.5.0)
Modo compacto para iniciais/rubricas:

```javascript
apexSignatureInitials.enable('minha_assinatura', {
  maxCharacters: 3,
  style: 'cursive'
});
```

### Verificacao (v3.6.0)
Verificacao de integridade com hash SHA-256:

```javascript
// Gerar hash
const hash = await apexSignatureVerification.generateHash('minha_assinatura');

// Verificar assinatura
const isValid = await apexSignatureVerification.verify('minha_assinatura', hashOriginal);
```

### Otimizacao Mobile (v3.7.0)
Experiencia mobile aprimorada:
- Gestos touch (swipe, pinch-zoom)
- Modo fullscreen
- Sensibilidade a pressao Apple Pencil / S-Pen

```javascript
apexSignatureMobile.enterFullscreen('minha_assinatura');
```

### Formatos de Exportacao (v3.8.0)
Exporte assinaturas em multiplos formatos:

```javascript
// Exportar como PNG
const png = await apexSignatureExport.toPNG('minha_assinatura');

// Exportar como PDF
const pdf = await apexSignatureExport.toPDF('minha_assinatura', {
  pageSize: 'A4',
  includeTimestamp: true
});

// Copiar para area de transferencia
await apexSignatureExport.copyToClipboard('minha_assinatura');
```

---

## Eventos do Plugin

| Evento | Descricao |
|--------|-----------|
| `apexsignature-signed` | Assinatura desenhada/capturada |
| `apexsignature-cleared` | Assinatura limpa |
| `apexsignature-saved` | Salvo no banco de dados |
| `apexsignature-error` | Erro ocorrido |
| `apexsignature-mode-changed` | Modo de captura alterado |
| `apexsignature-exported` | Assinatura exportada |
| `apexsignature-verified` | Verificacao concluida |

```javascript
// Ouvir eventos
document.addEventListener('apexsignature-signed', function(e) {
  console.log('Assinatura capturada:', e.detail.regionId);
});
```

---

## Suporte a Navegadores

| Navegador | Versao | Status |
|-----------|--------|--------|
| Chrome | 90+ | Suporte Total |
| Firefox | 88+ | Suporte Total |
| Safari | 14+ | Suporte Total |
| Edge | 90+ | Suporte Total |
| Mobile Safari | iOS 14+ | Suporte Total |
| Chrome Android | 90+ | Suporte Total |

---

## Documentacao

| Documento | Descricao |
|-----------|-----------|
| [**Documentacao Completa**](docs/APEX_SIGNATURE_v3.8.0_DOCUMENTATION.md) | Documentacao tecnica completa v3.8.0 |
| [Guia de Instalacao](docs/INSTALLATION_GUIDE.md) | Instrucoes completas de instalacao |
| [Guia do Usuario](docs/USER_GUIDE.md) | Documentacao detalhada de uso |
| [Referencia da API](docs/API_REFERENCE.md) | Documentacao da API JavaScript |
| [Plano de Testes](docs/TEST_PLAN_v3_Complete.md) | 394 casos de teste para v3.x |

### Guias de Recursos
- [Captura Multi-Entrada](docs/MULTI_INPUT_GUIDE.md)
- [Assinatura de Documentos](docs/DOCUMENT_SIGNING_GUIDE.md)
- [Templates de Assinatura](docs/SIGNATURE_TEMPLATES_GUIDE.md)
- [Barra de Ferramentas](docs/CUSTOMIZATION_TOOLBAR_GUIDE.md)
- [Carimbo de Data/Hora](docs/TIMESTAMP_OVERLAY_GUIDE.md)
- [Modo Rubricas](docs/INITIALS_MODE_GUIDE.md)
- [Verificacao](docs/SIGNATURE_VERIFICATION_GUIDE.md)
- [Otimizacao Mobile](docs/MOBILE_OPTIMIZATION_GUIDE.md)
- [Formatos de Exportacao](docs/EXPORT_FORMATS_GUIDE.md)

---

## Historico de Versoes

### Versao 3.x ([@maxwbh](https://github.com/Maxwbh/apex-plugin-apexsignature))

#### v3.8.0 - Modulo de Formatos de Exportacao
- Exportacao multi-formato (PNG, JPEG, SVG, PDF, WebP)
- Presets de qualidade (web, impressao, arquivo)
- Integracao com area de transferencia
- Suporte a exportacao em lote

#### v3.7.0 - Modulo de Otimizacao Mobile
- Suporte a gestos touch (swipe, pinch-zoom, double-tap)
- Modo de assinatura fullscreen
- Sensibilidade a pressao Apple Pencil / S-Pen
- Feedback haptico

#### v3.6.0 - Modulo de Verificacao de Assinatura
- Geracao de hash SHA-256
- Deteccao de adulteracao
- Coleta de metadados de auditoria
- Verificacao no banco de dados

#### v3.5.0 - Modulo de Modo Rubricas
- Captura compacta de iniciais/rubricas
- Limite de caracteres
- Multiplos presets de estilo

#### v3.4.0 - Modulo de Carimbo de Data/Hora
- Formatos de data/hora customizaveis
- Multiplas opcoes de posicao
- Suporte a fuso horario

#### v3.3.0 - Modulo de Barra de Ferramentas Aprimorada
- Seletor de cores com presets
- Controle de espessura
- Funcionalidade Desfazer/Refazer

#### v3.2.0 - Modulo de Templates de Assinatura
- Salvar assinaturas no localStorage
- Interface de gerenciamento de templates
- Selecao rapida de assinatura

#### v3.1.0 - Modulo de Assinatura de Documentos
- Carregamento de PDF com PDF.js
- Posicionamento de assinatura drag-drop
- Suporte a multiplas paginas

#### v3.0.0 - Modulo de Captura Multi-Entrada
- Modos Desenho, Upload, Webcam
- Interface com abas
- API de troca de modo

### Versao 1.x ([@Dani3lSun](https://github.com/Dani3lSun/apex-plugin-apexsignature))

#### v1.1
- Adicionado WaitSpinner opcional ao salvar imagem no banco de dados

#### v1.0.1
- Corrigido problemas de charset com numeros decimais minWidth/maxWidth

#### v1.0
- Lancamento Inicial

---

## Licenca

Este projeto esta licenciado sob a Licenca MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## Contribuindo

Contribuicoes sao bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para orientacoes.

1. Faca um Fork do repositorio
2. Crie sua branch de feature (`git checkout -b feature/RecursoIncrivel`)
3. Commit suas mudancas (`git commit -m 'Adiciona RecursoIncrivel'`)
4. Push para a branch (`git push origin feature/RecursoIncrivel`)
5. Abra um Pull Request

---

## Suporte

- **Issues**: [GitHub Issues](https://github.com/Maxwbh/apex-plugin-apexsignature/issues)
- **Discussoes**: [GitHub Discussions](https://github.com/Maxwbh/apex-plugin-apexsignature/discussions)

---

**Feito com amor para a Comunidade Oracle APEX**
