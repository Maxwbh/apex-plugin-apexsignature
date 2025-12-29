# APEX Signature v3.8.0 - Referencia da API JavaScript

**Documentacao completa de todas as APIs JavaScript disponiveis**

---

## Indice

1. [apexSignature (Core)](#1-apexsignature-core)
2. [apexSignatureDocSign](#2-apexsignaturedocsign)
3. [apexSignatureTemplates](#3-apexsignaturetemplates)
4. [apexSignatureToolbar](#4-apexsignaturetoolbar)
5. [apexSignatureTimestamp](#5-apexsignaturetimestamp)
6. [apexSignatureInitials](#6-apexsignatureinitials)
7. [apexSignatureVerification](#7-apexsignatureverification)
8. [apexSignatureMobile](#8-apexsignaturemobile)
9. [apexSignatureExport](#9-apexsignatureexport)
10. [Eventos](#10-eventos)
11. [Tipos e Interfaces](#11-tipos-e-interfaces)

---

## 1. apexSignature (Core)

Objeto principal do plugin. Gerencia a inicializacao, captura e manipulacao de assinaturas.

### Metodos

#### init(regionId, options, logging)

Inicializa o plugin para uma regiao especifica.

```javascript
apexSignature.init('sig_region', {
    width: 400,
    height: 200,
    penColor: '#000000',
    backgroundColor: '#FFFFFF',
    captureMode: 'all',
    showToolbar: true
}, false);
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| options | object | Sim | Opcoes de configuracao |
| logging | boolean | Nao | Habilitar logs (default: false) |

**Retorno:** void

---

#### toDataURL(regionId, type, encoderOptions)

Retorna a assinatura como Data URL (Base64).

```javascript
const dataUrl = apexSignature.toDataURL('sig_region');
// Retorna: "data:image/png;base64,iVBORw0..."

// Com tipo especifico
const jpegUrl = apexSignature.toDataURL('sig_region', 'image/jpeg', 0.8);
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| type | string | Nao | MIME type (default: 'image/png') |
| encoderOptions | number | Nao | Qualidade 0-1 (para JPEG/WebP) |

**Retorno:** string (Data URL)

---

#### toBlob(regionId, type, quality)

Retorna a assinatura como Blob.

```javascript
const blob = await apexSignature.toBlob('sig_region');
// Retorna: Blob { size: 12345, type: 'image/png' }
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| type | string | Nao | MIME type (default: 'image/png') |
| quality | number | Nao | Qualidade 0-1 |

**Retorno:** Promise\<Blob\>

---

#### isEmpty(regionId)

Verifica se o canvas esta vazio.

```javascript
if (apexSignature.isEmpty('sig_region')) {
    alert('Por favor, assine antes de continuar.');
}
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** boolean

---

#### clear(regionId)

Limpa completamente o canvas.

```javascript
apexSignature.clear('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

**Evento disparado:** `apexsignature-cleared`

---

#### save(regionId)

Salva a assinatura no servidor via AJAX.

```javascript
apexSignature.save('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

**Evento disparado:** `apexsignature-saved` ou `apexsignature-error`

---

#### setMode(regionId, mode)

Define o modo de captura.

```javascript
apexSignature.setMode('sig_region', 'webcam');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| mode | string | Sim | 'draw', 'upload', 'webcam' |

**Retorno:** void

**Evento disparado:** `apexsignature-mode-changed`

---

#### getMode(regionId)

Retorna o modo de captura atual.

```javascript
const mode = apexSignature.getMode('sig_region');
// Retorna: 'draw', 'upload' ou 'webcam'
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** string

---

#### setPenColor(regionId, color)

Define a cor da caneta.

```javascript
apexSignature.setPenColor('sig_region', '#0000FF');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| color | string | Sim | Cor em formato hex, rgb ou nome |

**Retorno:** void

---

#### setLineWidth(regionId, width)

Define a espessura da linha.

```javascript
apexSignature.setLineWidth('sig_region', 3);
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| width | number | Sim | Espessura em pixels (1-10) |

**Retorno:** void

---

#### fromDataURL(regionId, dataUrl, options)

Carrega assinatura de um Data URL.

```javascript
apexSignature.fromDataURL('sig_region', 'data:image/png;base64,...', {
    ratio: 1,
    width: 400,
    height: 200
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| dataUrl | string | Sim | Data URL da imagem |
| options | object | Nao | Opcoes de redimensionamento |

**Retorno:** void

---

#### destroy(regionId)

Destroi a instancia do plugin.

```javascript
apexSignature.destroy('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

---

## 2. apexSignatureDocSign

Modulo para assinatura de documentos PDF (v3.1.0).

### Metodos

#### loadPDF(regionId, pdfData)

Carrega um documento PDF para assinatura.

```javascript
// Via ArrayBuffer
const response = await fetch('/documento.pdf');
const buffer = await response.arrayBuffer();
apexSignatureDocSign.loadPDF('sig_region', buffer);

// Via input file
document.getElementById('pdfInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const buffer = await file.arrayBuffer();
    apexSignatureDocSign.loadPDF('sig_region', buffer);
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| pdfData | ArrayBuffer | Sim | Dados do PDF |

**Retorno:** Promise\<void\>

**Evento disparado:** `apexsignature-pdf-loaded`

---

#### goToPage(regionId, pageNumber)

Navega para uma pagina especifica do PDF.

```javascript
apexSignatureDocSign.goToPage('sig_region', 2);
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| pageNumber | number | Sim | Numero da pagina (1-based) |

**Retorno:** void

---

#### getTotalPages(regionId)

Retorna o numero total de paginas do PDF.

```javascript
const total = apexSignatureDocSign.getTotalPages('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** number

---

#### getCurrentPage(regionId)

Retorna a pagina atual.

```javascript
const current = apexSignatureDocSign.getCurrentPage('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** number

---

#### applySignature(regionId)

Aplica a assinatura ao PDF na posicao definida.

```javascript
apexSignatureDocSign.applySignature('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

---

#### generateSignedPDF(regionId)

Gera o PDF final com a assinatura embutida.

```javascript
const pdfBytes = await apexSignatureDocSign.generateSignedPDF('sig_region');

// Download
const blob = new Blob([pdfBytes], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'documento_assinado.pdf';
a.click();
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** Promise\<Uint8Array\>

**Evento disparado:** `apexsignature-pdf-signed`

---

#### setSignaturePosition(regionId, position)

Define a posicao da assinatura no PDF.

```javascript
apexSignatureDocSign.setSignaturePosition('sig_region', {
    x: 100,
    y: 500,
    width: 200,
    height: 100,
    page: 1
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| position | SignaturePosition | Sim | Objeto com posicao |

**Retorno:** void

---

#### clearPDF(regionId)

Remove o PDF carregado.

```javascript
apexSignatureDocSign.clearPDF('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

---

## 3. apexSignatureTemplates

Modulo para gerenciamento de templates de assinatura (v3.2.0).

### Metodos

#### save(regionId, name, options)

Salva a assinatura atual como template.

```javascript
apexSignatureTemplates.save('sig_region', 'Minha Assinatura', {
    category: 'profissional'
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| name | string | Sim | Nome do template |
| options | object | Nao | Opcoes adicionais |

**Retorno:** void

**Evento disparado:** `apexsignature-template-saved`

---

#### load(regionId, name)

Carrega um template salvo.

```javascript
apexSignatureTemplates.load('sig_region', 'Minha Assinatura');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| name | string | Sim | Nome do template |

**Retorno:** void

**Evento disparado:** `apexsignature-template-loaded`

---

#### list()

Lista todos os templates salvos.

```javascript
const templates = apexSignatureTemplates.list();
// Retorna: [{name: 'Minha Assinatura', date: '2024-12-26', ...}, ...]
```

**Retorno:** Template[]

---

#### delete(name)

Exclui um template.

```javascript
apexSignatureTemplates.delete('Minha Assinatura');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| name | string | Sim | Nome do template |

**Retorno:** boolean

---

#### rename(oldName, newName)

Renomeia um template.

```javascript
apexSignatureTemplates.rename('Nome Antigo', 'Nome Novo');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| oldName | string | Sim | Nome atual |
| newName | string | Sim | Novo nome |

**Retorno:** boolean

---

#### exportAll()

Exporta todos os templates como JSON.

```javascript
const backup = apexSignatureTemplates.exportAll();
localStorage.setItem('backup', JSON.stringify(backup));
```

**Retorno:** object

---

#### importAll(data)

Importa templates de um backup JSON.

```javascript
const backup = JSON.parse(localStorage.getItem('backup'));
apexSignatureTemplates.importAll(backup);
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| data | object | Sim | Dados do backup |

**Retorno:** void

---

## 4. apexSignatureToolbar

Modulo para controle da barra de ferramentas (v3.3.0).

### Metodos

#### setColor(regionId, color)

Define a cor da caneta via toolbar.

```javascript
apexSignatureToolbar.setColor('sig_region', '#FF0000');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| color | string | Sim | Cor em formato hex |

**Retorno:** void

**Evento disparado:** `apexsignature-color-changed`

---

#### setThickness(regionId, thickness)

Define a espessura da linha.

```javascript
apexSignatureToolbar.setThickness('sig_region', 5);
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| thickness | number | Sim | Espessura 1-10 |

**Retorno:** void

**Evento disparado:** `apexsignature-thickness-changed`

---

#### undo(regionId)

Desfaz o ultimo traco.

```javascript
apexSignatureToolbar.undo('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

---

#### redo(regionId)

Refaz o traco desfeito.

```javascript
apexSignatureToolbar.redo('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

---

#### getHistory(regionId)

Retorna o historico de acoes.

```javascript
const history = apexSignatureToolbar.getHistory('sig_region');
// Retorna: { undoStack: [...], redoStack: [...] }
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** HistoryState

---

## 5. apexSignatureTimestamp

Modulo para carimbo de data/hora (v3.4.0).

### Metodos

#### enable(regionId, options)

Habilita o timestamp na assinatura.

```javascript
apexSignatureTimestamp.enable('sig_region', {
    format: 'DD/MM/YYYY HH:mm:ss',
    position: 'bottom-right',
    fontSize: 10,
    color: '#666666',
    fontFamily: 'Arial',
    opacity: 1
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| options | TimestampOptions | Nao | Opcoes de configuracao |

**Retorno:** void

---

#### disable(regionId)

Desabilita o timestamp.

```javascript
apexSignatureTimestamp.disable('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

---

#### setFormat(regionId, format)

Define o formato de data/hora.

```javascript
apexSignatureTimestamp.setFormat('sig_region', 'YYYY-MM-DD HH:mm');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| format | string | Sim | Formato de data |

**Formatos suportados:**
- `DD/MM/YYYY` - Dia/Mes/Ano
- `MM/DD/YYYY` - Mes/Dia/Ano
- `YYYY-MM-DD` - Ano-Mes-Dia (ISO)
- `HH:mm` - Hora:Minuto (24h)
- `HH:mm:ss` - Hora:Minuto:Segundo
- `hh:mm A` - Hora:Minuto AM/PM

**Retorno:** void

---

#### setPosition(regionId, position)

Define a posicao do timestamp.

```javascript
apexSignatureTimestamp.setPosition('sig_region', 'top-left');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| position | string | Sim | 'bottom-right', 'bottom-left', 'top-right', 'top-left' |

**Retorno:** void

---

## 6. apexSignatureInitials

Modulo para modo de rubricas/iniciais (v3.5.0).

### Metodos

#### enable(regionId, options)

Habilita o modo de iniciais.

```javascript
apexSignatureInitials.enable('sig_region', {
    maxCharacters: 3,
    width: 150,
    height: 75,
    style: 'cursive',
    borderRadius: 8,
    placeholder: 'Iniciais'
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| options | InitialsOptions | Nao | Opcoes de configuracao |

**Retorno:** void

---

#### disable(regionId)

Desabilita o modo de iniciais.

```javascript
apexSignatureInitials.disable('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

---

#### setMaxCharacters(regionId, max)

Define o limite de caracteres.

```javascript
apexSignatureInitials.setMaxCharacters('sig_region', 5);
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| max | number | Sim | Maximo de caracteres |

**Retorno:** void

---

#### setStyle(regionId, style)

Define o estilo visual.

```javascript
apexSignatureInitials.setStyle('sig_region', 'formal');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| style | string | Sim | 'cursive', 'formal', 'casual' |

**Retorno:** void

---

## 7. apexSignatureVerification

Modulo para verificacao de integridade (v3.6.0).

### Metodos

#### generateHash(regionId)

Gera hash SHA-256 da assinatura.

```javascript
const hash = await apexSignatureVerification.generateHash('sig_region');
// Retorna: "a1b2c3d4e5f6789..."
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** Promise\<string\>

---

#### verify(regionId, originalHash)

Verifica a integridade da assinatura.

```javascript
const isValid = await apexSignatureVerification.verify('sig_region', hashOriginal);
if (isValid) {
    console.log('Assinatura valida!');
} else {
    console.log('Assinatura adulterada!');
}
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| originalHash | string | Sim | Hash original para comparacao |

**Retorno:** Promise\<boolean\>

**Evento disparado:** `apexsignature-verified` ou `apexsignature-verification-failed`

---

#### collectMetadata(regionId)

Coleta metadados de auditoria.

```javascript
const metadata = apexSignatureVerification.collectMetadata('sig_region');
// Retorna: {
//   timestamp: '2024-12-26T10:30:00.000Z',
//   userAgent: 'Mozilla/5.0...',
//   platform: 'Win32',
//   language: 'pt-BR',
//   screenResolution: '1920x1080',
//   timezone: 'America/Sao_Paulo'
// }
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** Metadata

---

#### getAuditLog(regionId)

Retorna log de auditoria.

```javascript
const log = apexSignatureVerification.getAuditLog('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** AuditEntry[]

---

## 8. apexSignatureMobile

Modulo para otimizacao mobile (v3.7.0).

### Metodos

#### enterFullscreen(regionId)

Entra em modo tela cheia.

```javascript
apexSignatureMobile.enterFullscreen('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

**Evento disparado:** `apexsignature-fullscreen-enter`

---

#### exitFullscreen(regionId)

Sai do modo tela cheia.

```javascript
apexSignatureMobile.exitFullscreen('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

**Evento disparado:** `apexsignature-fullscreen-exit`

---

#### toggleFullscreen(regionId)

Alterna modo tela cheia.

```javascript
apexSignatureMobile.toggleFullscreen('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** void

---

#### isFullscreen(regionId)

Verifica se esta em tela cheia.

```javascript
const isFS = apexSignatureMobile.isFullscreen('sig_region');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** boolean

---

#### setPressureSensitivity(regionId, sensitivity)

Define sensibilidade a pressao do stylus.

```javascript
apexSignatureMobile.setPressureSensitivity('sig_region', 0.8);
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| sensitivity | number | Sim | Sensibilidade 0.1-1.0 |

**Retorno:** void

---

#### setStylusButtonAction(regionId, action)

Define acao do botao do stylus.

```javascript
apexSignatureMobile.setStylusButtonAction('sig_region', 'undo');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| action | string | Sim | 'undo', 'redo', 'clear', 'none' |

**Retorno:** void

---

#### enableHapticFeedback(regionId, enabled)

Habilita/desabilita feedback haptico.

```javascript
apexSignatureMobile.enableHapticFeedback('sig_region', true);
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| enabled | boolean | Sim | Habilitar/desabilitar |

**Retorno:** void

---

#### isTouchDevice()

Verifica se e dispositivo touch.

```javascript
if (apexSignatureMobile.isTouchDevice()) {
    // Configuracoes especificas para touch
}
```

**Retorno:** boolean

---

## 9. apexSignatureExport

Modulo para exportacao multi-formato (v3.8.0).

### Metodos

#### toPNG(regionId, options)

Exporta como PNG.

```javascript
const pngBlob = await apexSignatureExport.toPNG('sig_region', {
    scale: 2,
    background: 'transparent'
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| options | ExportOptions | Nao | Opcoes de exportacao |

**Retorno:** Promise\<Blob\>

---

#### toJPEG(regionId, options)

Exporta como JPEG.

```javascript
const jpegBlob = await apexSignatureExport.toJPEG('sig_region', {
    quality: 0.8,
    background: '#FFFFFF'
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| options | ExportOptions | Nao | Opcoes de exportacao |

**Retorno:** Promise\<Blob\>

---

#### toSVG(regionId, options)

Exporta como SVG.

```javascript
const svgString = await apexSignatureExport.toSVG('sig_region', {
    optimized: true
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| options | SVGOptions | Nao | Opcoes de exportacao |

**Retorno:** Promise\<string\>

---

#### toPDF(regionId, options)

Exporta como PDF.

```javascript
const pdfBlob = await apexSignatureExport.toPDF('sig_region', {
    pageSize: 'A4',
    orientation: 'portrait',
    includeTimestamp: true,
    title: 'Assinatura Digital',
    author: 'Nome do Usuario'
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| options | PDFOptions | Nao | Opcoes de exportacao |

**Retorno:** Promise\<Blob\>

---

#### toWebP(regionId, options)

Exporta como WebP.

```javascript
const webpBlob = await apexSignatureExport.toWebP('sig_region', {
    quality: 0.9
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| options | ExportOptions | Nao | Opcoes de exportacao |

**Retorno:** Promise\<Blob\>

---

#### toBase64(regionId, format)

Retorna como Base64 string.

```javascript
const base64 = await apexSignatureExport.toBase64('sig_region', 'png');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| format | string | Nao | 'png', 'jpeg', 'webp' |

**Retorno:** Promise\<string\>

---

#### copyToClipboard(regionId)

Copia assinatura para area de transferencia.

```javascript
await apexSignatureExport.copyToClipboard('sig_region');
alert('Copiado! Cole em qualquer aplicativo.');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |

**Retorno:** Promise\<void\>

**Evento disparado:** `apexsignature-copied`

---

#### download(regionId, filename, format, options)

Faz download da assinatura.

```javascript
await apexSignatureExport.download('sig_region', 'minha_assinatura.png', 'png', {
    scale: 2
});
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| filename | string | Sim | Nome do arquivo |
| format | string | Sim | 'png', 'jpeg', 'svg', 'pdf', 'webp' |
| options | ExportOptions | Nao | Opcoes de exportacao |

**Retorno:** Promise\<void\>

**Evento disparado:** `apexsignature-exported`

---

#### downloadBlob(blob, filename, mimeType)

Faz download de um Blob.

```javascript
const pdfBytes = await apexSignatureDocSign.generateSignedPDF('sig_region');
apexSignatureExport.downloadBlob(pdfBytes, 'documento.pdf', 'application/pdf');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| blob | Blob/Uint8Array | Sim | Dados do arquivo |
| filename | string | Sim | Nome do arquivo |
| mimeType | string | Sim | MIME type |

**Retorno:** void

---

#### withPreset(regionId, preset)

Exporta com preset de qualidade.

```javascript
// Preset web (72dpi, otimizado)
const webBlob = await apexSignatureExport.withPreset('sig_region', 'web');

// Preset print (300dpi, alta qualidade)
const printBlob = await apexSignatureExport.withPreset('sig_region', 'print');

// Preset archive (lossless)
const archiveBlob = await apexSignatureExport.withPreset('sig_region', 'archive');
```

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| regionId | string | Sim | ID da regiao APEX |
| preset | string | Sim | 'web', 'print', 'archive' |

**Retorno:** Promise\<Blob\>

---

## 10. Eventos

### Tabela Completa de Eventos

| Evento | Modulo | Descricao | detail |
|--------|--------|-----------|--------|
| `apexsignature-initialized` | Core | Plugin inicializado | { regionId } |
| `apexsignature-stroke-begin` | Core | Inicio de traco | { regionId } |
| `apexsignature-stroke-end` | Core | Fim de traco | { regionId } |
| `apexsignature-cleared` | Core | Canvas limpo | { regionId } |
| `apexsignature-saved` | Core | Assinatura salva | { regionId, success } |
| `apexsignature-error` | Core | Erro ocorrido | { regionId, error } |
| `apexsignature-mode-changed` | v3.0 | Modo alterado | { regionId, mode } |
| `apexsignature-uploaded` | v3.0 | Imagem uploaded | { regionId, file } |
| `apexsignature-captured` | v3.0 | Webcam capturado | { regionId } |
| `apexsignature-pdf-loaded` | v3.1 | PDF carregado | { regionId, pages } |
| `apexsignature-pdf-signed` | v3.1 | PDF assinado | { regionId } |
| `apexsignature-template-saved` | v3.2 | Template salvo | { regionId, name } |
| `apexsignature-template-loaded` | v3.2 | Template carregado | { regionId, name } |
| `apexsignature-color-changed` | v3.3 | Cor alterada | { regionId, color } |
| `apexsignature-thickness-changed` | v3.3 | Espessura alterada | { regionId, thickness } |
| `apexsignature-verified` | v3.6 | Verificacao OK | { regionId, hash } |
| `apexsignature-verification-failed` | v3.6 | Verificacao falhou | { regionId } |
| `apexsignature-fullscreen-enter` | v3.7 | Entrou fullscreen | { regionId } |
| `apexsignature-fullscreen-exit` | v3.7 | Saiu fullscreen | { regionId } |
| `apexsignature-exported` | v3.8 | Exportado | { regionId, format } |
| `apexsignature-copied` | v3.8 | Copiado clipboard | { regionId } |

### Exemplo de Listener

```javascript
document.addEventListener('apexsignature-saved', function(e) {
    console.log('Regiao:', e.detail.regionId);
    console.log('Sucesso:', e.detail.success);
});
```

---

## 11. Tipos e Interfaces

### ExportOptions

```typescript
interface ExportOptions {
    scale?: number;           // Escala (1 = 100%, 2 = 200%)
    quality?: number;         // Qualidade 0-1 (para JPEG/WebP)
    background?: string;      // Cor de fundo ou 'transparent'
    includeTimestamp?: boolean;
}
```

### PDFOptions

```typescript
interface PDFOptions extends ExportOptions {
    pageSize?: 'A4' | 'Letter' | 'Legal';
    orientation?: 'portrait' | 'landscape';
    title?: string;
    author?: string;
    margins?: { top: number, right: number, bottom: number, left: number };
}
```

### TimestampOptions

```typescript
interface TimestampOptions {
    format?: string;          // Formato de data/hora
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    opacity?: number;         // 0-1
}
```

### InitialsOptions

```typescript
interface InitialsOptions {
    maxCharacters?: number;
    width?: number;
    height?: number;
    style?: 'cursive' | 'formal' | 'casual';
    borderRadius?: number;
    placeholder?: string;
}
```

### SignaturePosition

```typescript
interface SignaturePosition {
    x: number;
    y: number;
    width: number;
    height: number;
    page?: number;
    rotation?: number;
}
```

### Template

```typescript
interface Template {
    name: string;
    data: string;             // Data URL
    date: string;             // ISO date
    category?: string;
}
```

### Metadata

```typescript
interface Metadata {
    timestamp: string;        // ISO timestamp
    userAgent: string;
    platform: string;
    language: string;
    screenResolution: string;
    timezone: string;
}
```

---

**APEX Signature v3.8.0 - API Reference**

Desenvolvido por Maxwell da Silva Oliveira (@maxwbh)
M&S do Brasil LTDA
