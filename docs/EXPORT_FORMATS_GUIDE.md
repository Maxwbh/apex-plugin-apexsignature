# APEX Signature - Guia de Formatos de Exportação

**Versão:** 3.8.0
**Módulo:** apexsignature-export.js

---

## Sumário

1. [Introdução](#introdução)
2. [Instalação](#instalação)
3. [Formatos Disponíveis](#formatos-disponíveis)
4. [Exportação Básica](#exportação-básica)
5. [Opções de Exportação](#opções-de-exportação)
6. [Presets](#presets)
7. [Clipboard](#clipboard)
8. [Batch Export](#batch-export)
9. [Botão de Export (UI)](#botão-de-export-ui)
10. [API Reference](#api-reference)
11. [Eventos](#eventos)
12. [Casos de Uso](#casos-de-uso)

---

## Introdução

O módulo de exportação permite salvar assinaturas em múltiplos formatos:

- **PNG**: Imagem com suporte a transparência
- **JPEG**: Imagem comprimida (menor tamanho)
- **SVG**: Formato vetorial escalável
- **PDF**: Documento para impressão
- **WebP**: Formato moderno otimizado
- **Base64**: String para armazenamento em banco

---

## Instalação

### Arquivos Necessários

```html
<!-- CSS -->
<link rel="stylesheet" href="#APP_FILES#apexsignature-export.css">

<!-- JavaScript -->
<script src="#APP_FILES#apexsignature-export.js"></script>

<!-- Opcional: jsPDF para export PDF nativo -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

### Dependências

- `apexsignature.js` (módulo base)
- `jsPDF` (opcional, para PDF nativo)

---

## Formatos Disponíveis

| Formato | Extensão | Transparência | Compressão | Uso |
|---------|----------|---------------|------------|-----|
| PNG | .png | Sim | Lossless | Web, documentos |
| JPEG | .jpg | Não | Lossy | Email, preview |
| SVG | .svg | Sim | Nenhuma | Vetorial, escalar |
| PDF | .pdf | N/A | N/A | Impressão |
| WebP | .webp | Sim | Lossy/Lossless | Web moderna |

---

## Exportação Básica

### PNG

```javascript
// Exportar como PNG (download automático)
apexSignatureExport.exportPNG('MY_SIGNATURE');

// Com opções
apexSignatureExport.exportPNG('MY_SIGNATURE', {
    transparentBackground: true,
    filename: 'minha_assinatura'
});
```

### JPEG

```javascript
// Exportar como JPEG
apexSignatureExport.exportJPEG('MY_SIGNATURE', {
    quality: 0.8,           // 0.0 a 1.0
    backgroundColor: '#ffffff'
});
```

### SVG

```javascript
// Exportar como SVG vetorial
apexSignatureExport.exportSVG('MY_SIGNATURE');
```

### PDF

```javascript
// Exportar como PDF
apexSignatureExport.exportPDF('MY_SIGNATURE', {
    pdfTitle: 'Assinatura do Contrato',
    pdfOrientation: 'landscape',
    pdfIncludeDate: true
});
```

### WebP

```javascript
// Exportar como WebP (formato moderno)
apexSignatureExport.exportWebP('MY_SIGNATURE', {
    quality: 0.9
});
```

### Base64 (sem download)

```javascript
// Obter como base64 string
apexSignatureExport.exportBase64('MY_SIGNATURE')
    .then(function(result) {
        console.log(result.dataURL);    // data:image/png;base64,...
        console.log(result.base64);     // só a string base64

        // Salvar no banco
        apex.server.process('SAVE_SIGNATURE', {
            x01: result.base64
        });
    });
```

---

## Opções de Exportação

### Todas as Opções

```javascript
apexSignatureExport.exportPNG('regionId', {
    // Formato
    format: 'png',              // png, jpeg, svg, pdf, webp

    // Qualidade (JPEG/WebP)
    quality: 0.92,              // 0.0 a 1.0

    // Fundo
    backgroundColor: '#ffffff', // Cor do fundo
    transparentBackground: false, // Fundo transparente (PNG/SVG/WebP)

    // Dimensões
    width: null,                // Largura específica (px)
    height: null,               // Altura específica (px)
    scale: 1,                   // Escala (1 = 100%, 2 = 200%)

    // Recorte
    trim: false,                // Remover whitespace ao redor
    padding: 0,                 // Padding interno (px)

    // Borda
    includeBorder: false,       // Adicionar borda
    borderColor: '#000000',     // Cor da borda
    borderWidth: 1,             // Espessura da borda (px)

    // Arquivo
    filename: 'signature',      // Nome do arquivo (sem extensão)
    includeTimestamp: false,    // Adicionar timestamp ao nome
    download: true,             // Baixar automaticamente

    // PDF específico
    pdfTitle: 'Signature',
    pdfOrientation: 'landscape', // portrait ou landscape
    pdfPageSize: 'a4',          // a4, letter, etc.
    pdfIncludeDate: true,
    pdfIncludeTitle: true,
    pdfMarginTop: 20,
    pdfMarginLeft: 20
});
```

### Exemplos de Opções

```javascript
// Alta resolução para impressão
apexSignatureExport.exportPNG('regionId', {
    scale: 2,
    trim: true,
    padding: 20
});

// Compacto para email
apexSignatureExport.exportJPEG('regionId', {
    quality: 0.6,
    scale: 0.75,
    trim: true
});

// Para documento formal
apexSignatureExport.exportPNG('regionId', {
    includeBorder: true,
    borderColor: '#cccccc',
    borderWidth: 1,
    padding: 15,
    backgroundColor: '#ffffff'
});

// Sem download (obter dados apenas)
apexSignatureExport.exportPNG('regionId', {
    download: false
}).then(function(result) {
    console.log(result.dataURL);
});
```

---

## Presets

Presets são configurações pré-definidas para cenários comuns.

### Presets Disponíveis

| Preset | Formato | Uso |
|--------|---------|-----|
| `print` | PNG 2x | Impressão de alta qualidade |
| `web` | PNG | Web com transparência |
| `email` | JPEG 0.7 | Anexo de email compacto |
| `document` | PNG 1.5x | Embedding em documentos |
| `archive` | WebP 0.9 | Arquivo otimizado |
| `vector` | SVG | Vetorial escalável |

### Usar Preset

```javascript
// Preset para impressão
apexSignatureExport.exportWithPreset('MY_SIGNATURE', 'print');

// Preset para email
apexSignatureExport.exportWithPreset('MY_SIGNATURE', 'email');

// Preset com opções adicionais
apexSignatureExport.exportWithPreset('MY_SIGNATURE', 'document', {
    filename: 'contrato_assinatura'
});
```

### Detalhes dos Presets

```javascript
// print - Alta qualidade para impressão
{
    format: 'png',
    scale: 2,
    backgroundColor: '#ffffff',
    transparentBackground: false,
    trim: true,
    padding: 20
}

// web - Otimizado para web
{
    format: 'png',
    scale: 1,
    transparentBackground: true,
    trim: true,
    padding: 5
}

// email - Compacto para email
{
    format: 'jpeg',
    quality: 0.7,
    scale: 0.75,
    backgroundColor: '#ffffff',
    trim: true
}

// document - Para documentos Word/PDF
{
    format: 'png',
    scale: 1.5,
    backgroundColor: '#ffffff',
    includeBorder: true,
    borderColor: '#cccccc',
    borderWidth: 1,
    padding: 10
}

// archive - Arquivo moderno compacto
{
    format: 'webp',
    quality: 0.9,
    scale: 1,
    trim: true
}

// vector - Vetorial para escalar
{
    format: 'svg',
    transparentBackground: true
}
```

---

## Clipboard

### Copiar para Área de Transferência

```javascript
apexSignatureExport.copyToClipboard('MY_SIGNATURE')
    .then(function(result) {
        alert('Assinatura copiada!');
    })
    .catch(function(error) {
        alert('Erro ao copiar: ' + error.message);
    });
```

### Com Opções

```javascript
apexSignatureExport.copyToClipboard('MY_SIGNATURE', {
    transparentBackground: false,
    backgroundColor: '#ffffff'
});
```

---

## Batch Export

### Exportar Múltiplas Assinaturas

```javascript
// Exportar várias assinaturas de uma vez
apexSignatureExport.exportBatch(
    ['SIGNATURE_1', 'SIGNATURE_2', 'SIGNATURE_3'],
    {
        format: 'png',
        filename: 'contrato_assinatura'
    }
).then(function(results) {
    console.log('Exportadas:', results.length);
});
// Baixa: contrato_assinatura_1.png, _2.png, _3.png
```

### Exportar Todos os Formatos

```javascript
// Obter uma assinatura em todos formatos
apexSignatureExport.exportAllFormats('MY_SIGNATURE')
    .then(function(results) {
        console.log('PNG:', results.png);
        console.log('JPEG:', results.jpeg);
        console.log('SVG:', results.svg);
        console.log('WebP:', results.webp);
    });
```

---

## Botão de Export (UI)

### Adicionar Botão Automaticamente

```javascript
// Adicionar botão de export ao wrapper da assinatura
apexSignatureExport.addExportButton('MY_SIGNATURE');
```

### Com Opções Padrão

```javascript
apexSignatureExport.addExportButton('MY_SIGNATURE', {
    filename: 'minha_assinatura',
    includeTimestamp: true
});
```

### Criar Botão Manualmente

```javascript
var exportBtn = apexSignatureExport.createExportButton('MY_SIGNATURE', {
    filename: 'custom_name'
});

document.getElementById('my-container').appendChild(exportBtn);
```

### Inicializar com Botão

```javascript
apexSignatureExport.init('MY_SIGNATURE', {
    showExportButton: true,
    filename: 'contrato'
});
```

---

## API Reference

### Constantes

```javascript
apexSignatureExport.VERSION     // "3.8.0"

apexSignatureExport.FORMATS
    .PNG        // "png"
    .JPEG       // "jpeg"
    .SVG        // "svg"
    .PDF        // "pdf"
    .WEBP       // "webp"
    .BASE64     // "base64"

apexSignatureExport.MIME_TYPES
    .png        // "image/png"
    .jpeg       // "image/jpeg"
    .svg        // "image/svg+xml"
    .pdf        // "application/pdf"
    .webp       // "image/webp"

apexSignatureExport.PRESETS     // { print, web, email, document, archive, vector }
```

### Métodos

| Método | Retorno | Descrição |
|--------|---------|-----------|
| `init(regionId, options)` | Object | Inicializa módulo |
| `export(regionId, options)` | Promise | Export genérico |
| `exportPNG(regionId, options)` | Promise | Export PNG |
| `exportJPEG(regionId, options)` | Promise | Export JPEG |
| `exportSVG(regionId, options)` | Promise | Export SVG |
| `exportPDF(regionId, options)` | Promise | Export PDF |
| `exportWebP(regionId, options)` | Promise | Export WebP |
| `exportBase64(regionId, options)` | Promise | Export Base64 |
| `exportBatch(regionIds, options)` | Promise | Export múltiplos |
| `exportAllFormats(regionId, options)` | Promise | Todos formatos |
| `exportWithPreset(regionId, preset, options)` | Promise | Usar preset |
| `copyToClipboard(regionId, options)` | Promise | Copiar clipboard |
| `getExportSizeEstimate(regionId, format, options)` | Object | Estimar tamanho |
| `createExportButton(regionId, options)` | Element | Criar botão |
| `addExportButton(regionId, options)` | Element | Adicionar botão |
| `dataURLToBlob(dataURL)` | Blob | Converter para blob |

### Resultado do Export

```javascript
{
    format: 'png',
    mimeType: 'image/png',
    dataURL: 'data:image/png;base64,...',
    width: 400,
    height: 200,
    size: 12345,        // tamanho do base64
    filename: 'signature.png',  // se download=true
    quality: 0.92       // para JPEG/WebP
}
```

---

## Eventos

### Lista de Eventos

| Evento | Dados | Descrição |
|--------|-------|-----------|
| `apexsignature-export-initialized` | `{ regionId }` | Módulo inicializado |
| `apexsignature-export-exported` | `{ format, dataURL, ... }` | Exportação concluída |
| `apexsignature-export-copied` | `{ format }` | Copiado para clipboard |

### Escutar Eventos

```javascript
document.getElementById('MY_SIGNATURE')
    .addEventListener('apexsignature-export-exported', function(e) {
        console.log('Exportado:', e.detail.format);
        console.log('Tamanho:', e.detail.size, 'bytes');
    });
```

---

## Casos de Uso

### 1. Salvar no Banco de Dados

```javascript
// Obter base64 e salvar via AJAX
apexSignatureExport.exportBase64('SIGNATURE_REGION', {
    outputFormat: 'png',
    trim: true
}).then(function(result) {
    apex.server.process('SAVE_SIGNATURE', {
        x01: $v('P10_CONTRACT_ID'),
        x02: result.base64
    }, {
        success: function() {
            apex.message.showPageSuccess('Assinatura salva!');
        }
    });
});
```

### 2. Anexar em Email

```javascript
// Exportar compacto para email
function attachSignatureToEmail() {
    apexSignatureExport.exportWithPreset('SIGNATURE', 'email')
        .then(function(result) {
            // Enviar para backend
            apex.server.process('ATTACH_SIGNATURE', {
                x01: result.dataURL
            });
        });
}
```

### 3. Gerar Documento PDF

```javascript
// Exportar como PDF para impressão
function printSignature() {
    apexSignatureExport.exportPDF('SIGNATURE', {
        pdfTitle: 'Termo de Aceite',
        pdfOrientation: 'portrait',
        pdfIncludeDate: true
    });
}
```

### 4. Comparar Tamanhos

```javascript
// Ver tamanho estimado antes de exportar
var pngSize = apexSignatureExport.getExportSizeEstimate('SIG', 'png');
var jpegSize = apexSignatureExport.getExportSizeEstimate('SIG', 'jpeg', { quality: 0.7 });

console.log('PNG:', pngSize.estimatedKB, 'KB');
console.log('JPEG:', jpegSize.estimatedKB, 'KB');

// Escolher o menor
if (jpegSize.estimatedKB < pngSize.estimatedKB) {
    apexSignatureExport.exportJPEG('SIG', { quality: 0.7 });
} else {
    apexSignatureExport.exportPNG('SIG');
}
```

### 5. Multi-assinatura em Contrato

```javascript
// Exportar todas assinaturas de um contrato
function exportAllSignatures() {
    apexSignatureExport.exportBatch(
        ['SIG_CLIENTE', 'SIG_TESTEMUNHA1', 'SIG_TESTEMUNHA2'],
        {
            format: 'png',
            filename: 'contrato_' + $v('P10_CONTRACT_ID'),
            includeTimestamp: true,
            trim: true
        }
    ).then(function(results) {
        apex.message.showPageSuccess(results.length + ' assinaturas exportadas!');
    });
}
```

### 6. Copiar e Colar

```javascript
// Botão de copiar rápido
document.getElementById('btn-copy').addEventListener('click', function() {
    apexSignatureExport.copyToClipboard('SIGNATURE')
        .then(function() {
            apex.message.showPageSuccess('Copiado! Cole em qualquer aplicativo.');
        })
        .catch(function(err) {
            apex.message.showErrors([{ message: 'Não foi possível copiar: ' + err.message }]);
        });
});
```

---

## Dicas

### Performance

```javascript
// Para assinaturas grandes, use trim para reduzir tamanho
{ trim: true }

// JPEG/WebP para arquivos menores
{ format: 'jpeg', quality: 0.7 }

// Base64 só quando necessário (armazenamento)
// Para download, use dataURL nativo
```

### Compatibilidade

```javascript
// WebP pode não funcionar em navegadores antigos
// Use PNG como fallback
try {
    await apexSignatureExport.exportWebP('SIG');
} catch (e) {
    await apexSignatureExport.exportPNG('SIG');
}
```

### PDF sem jsPDF

```javascript
// Se jsPDF não estiver disponível, abre dialog de impressão
// Usuário pode escolher "Salvar como PDF"
apexSignatureExport.exportPDF('SIG');
// Retorna: { method: 'print-dialog', message: 'Use Save as PDF' }
```

---

**Autor:** Maxwell da Silva Oliveira
**Empresa:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
