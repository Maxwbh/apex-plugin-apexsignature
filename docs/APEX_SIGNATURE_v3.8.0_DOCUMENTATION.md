# APEX Signature v3.8.0 - Documentacao Tecnica Completa

**Plugin de Captura de Assinatura Digital para Oracle APEX**

---

## Informacoes do Projeto

| Item | Descricao |
|------|-----------|
| **Nome** | APEX Signature |
| **Versao** | 3.8.0 |
| **Tipo** | Region Type Plugin |
| **Internal Name** | DE.DANIELH.APEXSIGNATURE |
| **Licenca** | MIT |
| **Repositorio** | [github.com/Maxwbh/apex-plugin-apexsignature](https://github.com/Maxwbh/apex-plugin-apexsignature) |

---

## Creditos e Atribuicao

### Autor Original (v1.x)
| Item | Informacao |
|------|------------|
| **Nome** | Daniel Hochleitner |
| **GitHub** | [@Dani3lSun](https://github.com/Dani3lSun) |
| **Website** | [danielhochleitner.de](https://danielhochleitner.de) |
| **Repositorio Original** | [Dani3lSun/apex-plugin-apexsignature](https://github.com/Dani3lSun/apex-plugin-apexsignature) |

### Desenvolvimento v3.x
| Item | Informacao |
|------|------------|
| **Nome** | Maxwell da Silva Oliveira |
| **GitHub** | [@maxwbh](https://github.com/maxwbh) |
| **LinkedIn** | [/maxwbh](https://linkedin.com/in/maxwbh) |
| **Empresa** | M&S do Brasil LTDA |
| **Repositorio v3.x** | [Maxwbh/apex-plugin-apexsignature](https://github.com/Maxwbh/apex-plugin-apexsignature) |

---

## Indice

1. [Visao Geral](#1-visao-geral)
2. [Requisitos de Sistema](#2-requisitos-de-sistema)
3. [Arquitetura do Plugin](#3-arquitetura-do-plugin)
4. [Modulos v3.x](#4-modulos-v3x)
5. [Instalacao](#5-instalacao)
6. [Configuracao](#6-configuracao)
7. [Atributos do Plugin](#7-atributos-do-plugin)
8. [Eventos do Plugin](#8-eventos-do-plugin)
9. [API JavaScript](#9-api-javascript)
10. [Integracao com APEX](#10-integracao-com-apex)
11. [Banco de Dados](#11-banco-de-dados)
12. [Casos de Teste](#12-casos-de-teste)
13. [Resolucao de Problemas](#13-resolucao-de-problemas)
14. [Historico de Versoes](#14-historico-de-versoes)
15. [Suporte](#15-suporte)

---

## 1. Visao Geral

O APEX Signature e um plugin Region Type para Oracle APEX que permite captura de assinaturas digitais com recursos avancados. A versao 3.x foi desenvolvida para compatibilidade com Oracle 23ai e APEX 24.2, trazendo 9 novos modulos de funcionalidades.

### Recursos Principais

| Recurso | Descricao |
|---------|-----------|
| Captura Multi-Entrada | Desenho a mao livre, upload de imagem e webcam |
| Assinatura de Documentos | Posicionar assinaturas em PDFs com drag-and-drop |
| Templates de Assinatura | Salvar e reutilizar assinaturas |
| Barra de Ferramentas | Customizacao de cor, espessura, undo/redo |
| Carimbo de Data/Hora | Timestamp configuravel na assinatura |
| Modo Rubricas | Captura compacta de iniciais |
| Verificacao SHA-256 | Hash para integridade e auditoria |
| Otimizacao Mobile | Gestos touch, fullscreen, stylus |
| Exportacao Multi-Formato | PNG, JPEG, SVG, PDF, WebP |

---

## 2. Requisitos de Sistema

### Software

| Componente | Versao Minima | Versao Recomendada |
|------------|---------------|-------------------|
| Oracle Database | 19c | 23ai |
| Oracle APEX | 19.2 | 24.2 |
| Navegador | Chrome 90+ | Ultima versao |

### Navegadores Suportados

| Navegador | Versao | Desktop | Mobile | Status |
|-----------|--------|---------|--------|--------|
| Chrome | 90+ | Sim | Sim | Suporte Total |
| Firefox | 88+ | Sim | Sim | Suporte Total |
| Safari | 14+ | Sim | Sim | Suporte Total |
| Edge | 90+ | Sim | N/A | Suporte Total |
| Mobile Safari | iOS 14+ | N/A | Sim | Suporte Total |
| Chrome Android | 90+ | N/A | Sim | Suporte Total |

### Dispositivos Moveis Testados

- iPhone 12/13/14/15 (iOS 14+)
- iPad Pro com Apple Pencil
- Samsung Galaxy S21+ com S-Pen
- Tablets Android 10+

---

## 3. Arquitetura do Plugin

### Estrutura de Diretorios

```
apex-plugin-apexsignature/
├── source/
│   └── region_type_plugin_de_danielh_apexsignature.sql  (Plugin SQL)
├── server/
│   ├── js/
│   │   ├── signature_pad.min.js          (v5.0.4 - Biblioteca base)
│   │   ├── apexsignature.js              (Modulo principal)
│   │   ├── apexsignature-docsign.js      (v3.1.0 - Document Signing)
│   │   ├── apexsignature-templates.js    (v3.2.0 - Templates)
│   │   ├── apexsignature-toolbar.js      (v3.3.0 - Toolbar)
│   │   ├── apexsignature-timestamp.js    (v3.4.0 - Timestamp)
│   │   ├── apexsignature-initials.js     (v3.5.0 - Initials)
│   │   ├── apexsignature-verification.js (v3.6.0 - Verification)
│   │   ├── apexsignature-mobile.js       (v3.7.0 - Mobile)
│   │   └── apexsignature-export.js       (v3.8.0 - Export)
│   └── css/
│       ├── apexsignature.css             (Estilos principais)
│       ├── apexsignature-docsign.css
│       ├── apexsignature-templates.css
│       ├── apexsignature-toolbar.css
│       ├── apexsignature-timestamp.css
│       ├── apexsignature-initials.css
│       ├── apexsignature-verification.css
│       ├── apexsignature-mobile.css
│       └── apexsignature-export.css
├── docs/
│   ├── INSTALLATION_GUIDE.md
│   ├── USER_GUIDE.md
│   ├── TEST_PLAN_v3_Complete.md
│   └── ... (guias de cada modulo)
├── Apex/
│   └── f256576/                          (Aplicacao exemplo)
├── README.md
├── apexplugin.json
└── LICENSE
```

### Dependencias Externas

| Biblioteca | Versao | Funcionalidade | Carregamento |
|------------|--------|----------------|--------------|
| signature_pad.js | 5.0.4 | Captura de assinatura | Incluso no plugin |
| PDF.js | 2.10.377 | Renderizacao de PDF | CDN (opcional) |
| pdf-lib | 1.17.1 | Manipulacao de PDF | CDN (opcional) |
| jsPDF | 2.5.1 | Geracao de PDF | CDN (opcional) |

### Diagrama de Modulos

```
┌─────────────────────────────────────────────────────────────────┐
│                    APEX Signature v3.8.0                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Core (apexsignature.js)                │   │
│  │  - Inicializacao do plugin                               │   │
│  │  - Gerenciamento do canvas                               │   │
│  │  - Comunicacao AJAX com APEX                             │   │
│  │  - Eventos e callbacks                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│         ┌────────────────────┼────────────────────┐            │
│         ▼                    ▼                    ▼            │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      │
│  │  Multi-Input │     │   DocSign   │     │  Templates  │      │
│  │   (v3.0.0)   │     │   (v3.1.0)  │     │   (v3.2.0)  │      │
│  └─────────────┘     └─────────────┘     └─────────────┘      │
│         │                    │                    │            │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      │
│  │   Toolbar   │     │  Timestamp  │     │  Initials   │      │
│  │   (v3.3.0)  │     │   (v3.4.0)  │     │   (v3.5.0)  │      │
│  └─────────────┘     └─────────────┘     └─────────────┘      │
│         │                    │                    │            │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      │
│  │Verification │     │   Mobile    │     │   Export    │      │
│  │   (v3.6.0)  │     │   (v3.7.0)  │     │   (v3.8.0)  │      │
│  └─────────────┘     └─────────────┘     └─────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Modulos v3.x

### 4.1 Multi-Input Capture (v3.0.0)

**Arquivo:** `apexsignature.js` (integrado)

Permite capturar assinaturas atraves de tres metodos diferentes.

| Modo | Descricao | Casos de Uso |
|------|-----------|--------------|
| Draw | Desenho a mao livre | Assinatura tradicional |
| Upload | Importar imagem | Reutilizar assinatura existente |
| Webcam | Captura via camera | Digitalizar assinatura em papel |

**Interface:**
```
+--------------------------------------------------+
|  [Desenhar] [Upload] [Webcam]                    |
+--------------------------------------------------+
|                   Canvas Area                     |
+--------------------------------------------------+
```

**API:**
```javascript
// Alternar modo
apexSignature.setMode('regiao_id', 'webcam'); // 'draw', 'upload', 'webcam'

// Verificar modo atual
const mode = apexSignature.getMode('regiao_id');
```

---

### 4.2 Document Signing (v3.1.0)

**Arquivos:** `apexsignature-docsign.js`, `apexsignature-docsign.css`

Permite assinar documentos PDF com posicionamento visual.

| Funcionalidade | Descricao |
|----------------|-----------|
| Carregar PDF | Via upload ou URL |
| Navegacao | Paginas multiplas |
| Posicionamento | Drag-and-drop |
| Redimensionamento | Handles visuais |
| Exportacao | PDF com assinatura embutida |

**API:**
```javascript
// Carregar PDF
apexSignatureDocSign.loadPDF('regiao_id', pdfArrayBuffer);

// Navegar paginas
apexSignatureDocSign.goToPage('regiao_id', 2);

// Aplicar assinatura
apexSignatureDocSign.applySignature('regiao_id');

// Gerar PDF assinado
const pdfBytes = await apexSignatureDocSign.generateSignedPDF('regiao_id');
```

---

### 4.3 Signature Templates (v3.2.0)

**Arquivos:** `apexsignature-templates.js`, `apexsignature-templates.css`

Salva assinaturas no localStorage para reutilizacao.

| Funcionalidade | Descricao |
|----------------|-----------|
| Salvar | Armazenar assinatura com nome |
| Carregar | Aplicar template ao canvas |
| Gerenciar | Renomear, excluir templates |
| Exportar/Importar | Backup em JSON |

**API:**
```javascript
// Salvar template
apexSignatureTemplates.save('regiao_id', 'Minha Assinatura');

// Listar templates
const templates = apexSignatureTemplates.list();

// Carregar template
apexSignatureTemplates.load('regiao_id', 'Minha Assinatura');

// Excluir template
apexSignatureTemplates.delete('Minha Assinatura');
```

---

### 4.4 Enhanced Toolbar (v3.3.0)

**Arquivos:** `apexsignature-toolbar.js`, `apexsignature-toolbar.css`

Barra de ferramentas para customizacao em tempo real.

| Ferramenta | Descricao |
|------------|-----------|
| Color Picker | Selecionar cor da caneta |
| Thickness Slider | Ajustar espessura (1-10px) |
| Undo | Desfazer ultimo traco |
| Redo | Refazer traco desfeito |
| Clear | Limpar canvas |

**API:**
```javascript
// Definir cor
apexSignatureToolbar.setColor('regiao_id', '#0000FF');

// Definir espessura
apexSignatureToolbar.setThickness('regiao_id', 3);

// Desfazer/Refazer
apexSignatureToolbar.undo('regiao_id');
apexSignatureToolbar.redo('regiao_id');
```

---

### 4.5 Timestamp Overlay (v3.4.0)

**Arquivos:** `apexsignature-timestamp.js`, `apexsignature-timestamp.css`

Adiciona carimbo de data/hora a assinatura.

| Opcao | Valores |
|-------|---------|
| Formato | DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, HH:mm:ss |
| Posicao | bottom-right, bottom-left, top-right, top-left |
| Estilo | Fonte, tamanho, cor, transparencia |

**API:**
```javascript
// Habilitar timestamp
apexSignatureTimestamp.enable('regiao_id', {
    format: 'DD/MM/YYYY HH:mm:ss',
    position: 'bottom-right',
    fontSize: 10,
    color: '#666666'
});

// Desabilitar
apexSignatureTimestamp.disable('regiao_id');
```

---

### 4.6 Initials Mode (v3.5.0)

**Arquivos:** `apexsignature-initials.js`, `apexsignature-initials.css`

Modo compacto para rubricas e iniciais.

| Configuracao | Padrao | Descricao |
|--------------|--------|-----------|
| maxCharacters | 3 | Limite de caracteres |
| width | 150 | Largura em pixels |
| height | 75 | Altura em pixels |
| style | 'cursive' | Estilo visual |

**API:**
```javascript
// Habilitar modo initials
apexSignatureInitials.enable('regiao_id', {
    maxCharacters: 3,
    width: 150,
    height: 75,
    style: 'cursive'
});

// Desabilitar
apexSignatureInitials.disable('regiao_id');
```

---

### 4.7 Signature Verification (v3.6.0)

**Arquivos:** `apexsignature-verification.js`, `apexsignature-verification.css`

Verificacao de integridade com hash SHA-256.

| Funcionalidade | Descricao |
|----------------|-----------|
| Gerar Hash | SHA-256 da assinatura |
| Verificar | Comparar com hash original |
| Metadados | Timestamp, IP, User Agent |
| Auditoria | Logs de verificacao |

**API:**
```javascript
// Gerar hash
const hash = await apexSignatureVerification.generateHash('regiao_id');
// Retorna: "a1b2c3d4e5f6..."

// Verificar integridade
const isValid = await apexSignatureVerification.verify('regiao_id', hashOriginal);
// Retorna: true/false

// Coletar metadados
const metadata = apexSignatureVerification.collectMetadata('regiao_id');
// Retorna: { timestamp, userAgent, ... }
```

---

### 4.8 Mobile Optimization (v3.7.0)

**Arquivos:** `apexsignature-mobile.js`, `apexsignature-mobile.css`

Otimizacoes para dispositivos moveis.

| Recurso | Descricao |
|---------|-----------|
| Touch Gestures | Swipe, pinch, double-tap |
| Fullscreen | Modo tela cheia |
| Stylus | Apple Pencil, S-Pen |
| Haptic | Feedback tatil |

**Gestos:**

| Gesto | Acao |
|-------|------|
| Swipe horizontal | Limpar canvas |
| Pinch | Zoom in/out |
| Double-tap | Desfazer |
| Long-press | Menu contexto |

**API:**
```javascript
// Fullscreen
apexSignatureMobile.enterFullscreen('regiao_id');
apexSignatureMobile.exitFullscreen('regiao_id');
apexSignatureMobile.toggleFullscreen('regiao_id');

// Sensibilidade do stylus
apexSignatureMobile.setPressureSensitivity('regiao_id', 0.8);
```

---

### 4.9 Export Formats (v3.8.0)

**Arquivos:** `apexsignature-export.js`, `apexsignature-export.css`

Exportacao em multiplos formatos.

| Formato | Extensao | Uso Recomendado |
|---------|----------|-----------------|
| PNG | .png | Web, fundo transparente |
| JPEG | .jpg | Impressao, arquivos menores |
| SVG | .svg | Vetorial, escalavel |
| PDF | .pdf | Documentos oficiais |
| WebP | .webp | Web moderno |
| Base64 | - | APIs, integracao |

**Presets de Qualidade:**

| Preset | DPI | Qualidade | Uso |
|--------|-----|-----------|-----|
| web | 72 | Otimizada | Sites, emails |
| print | 300 | Alta | Impressao |
| archive | Max | Lossless | Arquivo permanente |

**API:**
```javascript
// PNG
const pngBlob = await apexSignatureExport.toPNG('regiao_id');
const pngHD = await apexSignatureExport.toPNG('regiao_id', { scale: 2 });

// JPEG
const jpegBlob = await apexSignatureExport.toJPEG('regiao_id', { quality: 0.8 });

// SVG
const svgString = await apexSignatureExport.toSVG('regiao_id');

// PDF
const pdfBlob = await apexSignatureExport.toPDF('regiao_id', {
    pageSize: 'A4',
    includeTimestamp: true
});

// Clipboard
await apexSignatureExport.copyToClipboard('regiao_id');

// Download
await apexSignatureExport.download('regiao_id', 'assinatura.png', 'png');
```

---

## 5. Instalacao

### 5.1 Instalacao Rapida

1. **Baixar** o plugin do [repositorio](https://github.com/Maxwbh/apex-plugin-apexsignature)

2. **Importar** no APEX:
   ```
   Shared Components > Plugins > Import
   Arquivo: source/region_type_plugin_de_danielh_apexsignature.sql
   ```

3. **Criar regiao** do tipo "APEX Signature [Plug-In]"

### 5.2 Instalacao Manual

Para utilizar todos os modulos v3.x:

#### Passo 1: Importar Plugin
```
Shared Components > Plugins > Import
Arquivo: source/region_type_plugin_de_danielh_apexsignature.sql
```

#### Passo 2: Upload de Arquivos JS

Navegue para: **Shared Components > Static Application Files**

| Arquivo | Obrigatorio |
|---------|-------------|
| signature_pad.min.js | Sim |
| apexsignature.js | Sim |
| apexsignature-docsign.js | Se usar DocSign |
| apexsignature-templates.js | Se usar Templates |
| apexsignature-toolbar.js | Se usar Toolbar |
| apexsignature-timestamp.js | Se usar Timestamp |
| apexsignature-initials.js | Se usar Initials |
| apexsignature-verification.js | Se usar Verification |
| apexsignature-mobile.js | Se usar Mobile |
| apexsignature-export.js | Se usar Export |

#### Passo 3: Upload de Arquivos CSS

| Arquivo | Obrigatorio |
|---------|-------------|
| apexsignature.css | Sim |
| apexsignature-*.css | Conforme modulos utilizados |

#### Passo 4: CDN (Opcional)

Para Document Signing, adicione ao Page Load:
```javascript
// PDF.js
https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js

// pdf-lib
https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js

// jsPDF
https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
```

---

## 6. Configuracao

### 6.1 Criar Regiao de Assinatura

1. Edite a pagina no Page Designer
2. Clique com botao direito em "Body" > Create Region
3. Tipo: **APEX Signature [Plug-In]**
4. Defina um Static ID (ex: `sig_region`)
5. Configure os atributos conforme necessidade

### 6.2 Exemplo de Configuracao Basica

| Atributo | Valor |
|----------|-------|
| Width | 400 |
| Height | 200 |
| Pen Color | #000000 |
| Background Color | #FFFFFF |
| Capture Mode | All Modes |
| Show Toolbar | Yes |
| Enable Export | Yes |

---

## 7. Atributos do Plugin

### 7.1 Atributos Basicos (v1.x)

| # | Nome | Tipo | Padrao | Descricao |
|---|------|------|--------|-----------|
| 01 | Width | Number | 400 | Largura do canvas em pixels |
| 02 | Height | Number | 200 | Altura do canvas em pixels |
| 03 | Line minWidth | Number | 0.5 | Espessura minima da linha |
| 04 | Line maxWidth | Number | 2.5 | Espessura maxima da linha |
| 05 | Background Color | Text | #FFFFFF | Cor de fundo do canvas |
| 06 | Pen Color | Text | #000000 | Cor da caneta |
| 07 | PL/SQL Code | PLSQL | (codigo) | Codigo para salvar assinatura |
| 08 | Logging | Select | false | Habilitar logs no console |
| 09 | Clear Button Selector | Text | - | Seletor jQuery para limpar |
| 10 | Save Button Selector | Text | - | Seletor jQuery para salvar |
| 11 | Empty Signature Alert | Text | (msg) | Mensagem de assinatura vazia |
| 12 | Show Wait Spinner | Select | true | Mostrar spinner ao salvar |
| 13 | Page Items to Submit | Page Items | - | Itens a enviar ao salvar |

### 7.2 Atributos v3.x

| # | Nome | Tipo | Padrao | Modulo |
|---|------|------|--------|--------|
| 14 | Capture Mode | Select | all | v3.0.0 |
| 15 | Show Toolbar | Checkbox | Y | v3.3.0 |
| 16 | Enable Document Signing | Checkbox | N | v3.1.0 |
| 17 | Enable Signature Templates | Checkbox | N | v3.2.0 |
| 18 | Enable Timestamp Overlay | Checkbox | N | v3.4.0 |
| 19 | Enable Initials Mode | Checkbox | N | v3.5.0 |
| 20 | Enable Verification | Checkbox | N | v3.6.0 |
| 21 | Enable Mobile Optimization | Checkbox | N | v3.7.0 |
| 22 | Enable Export | Checkbox | Y | v3.8.0 |
| 23 | Timestamp Format | Text | DD/MM/YYYY... | v3.4.0 |
| 24 | Timestamp Position | Select | bottom-right | v3.4.0 |
| 25 | Initials Max Characters | Number | 3 | v3.5.0 |

---

## 8. Eventos do Plugin

### 8.1 Eventos Basicos

| Evento | Descricao |
|--------|-----------|
| `apexsignature-initialized` | Plugin inicializado |
| `apexsignature-stroke-begin` | Inicio de traco |
| `apexsignature-stroke-end` | Fim de traco |
| `apexsignature-cleared` | Canvas limpo |
| `apexsignature-saved` | Assinatura salva |
| `apexsignature-error` | Erro ocorrido |

### 8.2 Eventos v3.x

| Evento | Modulo | Descricao |
|--------|--------|-----------|
| `apexsignature-mode-changed` | v3.0 | Modo de captura alterado |
| `apexsignature-uploaded` | v3.0 | Imagem carregada via upload |
| `apexsignature-captured` | v3.0 | Frame capturado da webcam |
| `apexsignature-pdf-loaded` | v3.1 | PDF carregado |
| `apexsignature-pdf-signed` | v3.1 | PDF assinado |
| `apexsignature-template-saved` | v3.2 | Template salvo |
| `apexsignature-template-loaded` | v3.2 | Template carregado |
| `apexsignature-color-changed` | v3.3 | Cor alterada |
| `apexsignature-thickness-changed` | v3.3 | Espessura alterada |
| `apexsignature-verified` | v3.6 | Verificacao concluida |
| `apexsignature-verification-failed` | v3.6 | Verificacao falhou |
| `apexsignature-fullscreen-enter` | v3.7 | Entrou em fullscreen |
| `apexsignature-fullscreen-exit` | v3.7 | Saiu de fullscreen |
| `apexsignature-exported` | v3.8 | Assinatura exportada |
| `apexsignature-copied` | v3.8 | Copiado para clipboard |

### 8.3 Ouvindo Eventos

```javascript
// Via JavaScript puro
document.addEventListener('apexsignature-saved', function(e) {
    console.log('Assinatura salva:', e.detail.regionId);
});

// Via Dynamic Action
// Evento: Custom Event
// Custom Event Name: apexsignature-saved
```

---

## 9. API JavaScript

### 9.1 Objeto Principal: apexSignature

```javascript
// Inicializar (automatico pelo plugin)
apexSignature.init('regiao_id', opcoes);

// Obter assinatura como Data URL (Base64)
const dataUrl = apexSignature.toDataURL('regiao_id');
// Retorna: "data:image/png;base64,iVBORw0..."

// Obter como Blob
const blob = await apexSignature.toBlob('regiao_id');

// Verificar se esta vazio
const isEmpty = apexSignature.isEmpty('regiao_id');

// Limpar canvas
apexSignature.clear('regiao_id');

// Salvar no servidor
apexSignature.save('regiao_id');

// Definir/obter modo de captura
apexSignature.setMode('regiao_id', 'webcam');
const mode = apexSignature.getMode('regiao_id');

// Definir cor da caneta
apexSignature.setPenColor('regiao_id', '#0000FF');

// Definir espessura
apexSignature.setLineWidth('regiao_id', 3);

// Carregar assinatura de Data URL
apexSignature.fromDataURL('regiao_id', dataUrl);

// Destruir instancia
apexSignature.destroy('regiao_id');
```

### 9.2 Modulos Adicionais

#### apexSignatureDocSign
```javascript
apexSignatureDocSign.loadPDF(regionId, pdfData);
apexSignatureDocSign.goToPage(regionId, pageNumber);
apexSignatureDocSign.getTotalPages(regionId);
apexSignatureDocSign.applySignature(regionId);
apexSignatureDocSign.generateSignedPDF(regionId);
```

#### apexSignatureTemplates
```javascript
apexSignatureTemplates.save(regionId, name);
apexSignatureTemplates.load(regionId, name);
apexSignatureTemplates.list();
apexSignatureTemplates.delete(name);
apexSignatureTemplates.rename(oldName, newName);
apexSignatureTemplates.exportAll();
apexSignatureTemplates.importAll(data);
```

#### apexSignatureToolbar
```javascript
apexSignatureToolbar.setColor(regionId, color);
apexSignatureToolbar.setThickness(regionId, thickness);
apexSignatureToolbar.undo(regionId);
apexSignatureToolbar.redo(regionId);
```

#### apexSignatureTimestamp
```javascript
apexSignatureTimestamp.enable(regionId, options);
apexSignatureTimestamp.disable(regionId);
apexSignatureTimestamp.setFormat(regionId, format);
apexSignatureTimestamp.setPosition(regionId, position);
```

#### apexSignatureInitials
```javascript
apexSignatureInitials.enable(regionId, options);
apexSignatureInitials.disable(regionId);
```

#### apexSignatureVerification
```javascript
await apexSignatureVerification.generateHash(regionId);
await apexSignatureVerification.verify(regionId, hash);
apexSignatureVerification.collectMetadata(regionId);
```

#### apexSignatureMobile
```javascript
apexSignatureMobile.enterFullscreen(regionId);
apexSignatureMobile.exitFullscreen(regionId);
apexSignatureMobile.toggleFullscreen(regionId);
apexSignatureMobile.setPressureSensitivity(regionId, value);
```

#### apexSignatureExport
```javascript
await apexSignatureExport.toPNG(regionId, options);
await apexSignatureExport.toJPEG(regionId, options);
await apexSignatureExport.toSVG(regionId, options);
await apexSignatureExport.toPDF(regionId, options);
await apexSignatureExport.toWebP(regionId, options);
await apexSignatureExport.copyToClipboard(regionId);
await apexSignatureExport.download(regionId, filename, format);
```

---

## 10. Integracao com APEX

### 10.1 Dynamic Actions

**Salvar ao clicar em botao:**
```
Evento: Click
Selecao: #BTN_SALVAR
Acao True: Execute JavaScript Code
Codigo: apexSignature.save('sig_region');
```

**Ouvir evento de assinatura salva:**
```
Evento: Custom Event
Custom Event Name: apexsignature-saved
Acao True: Execute PL/SQL Code
```

### 10.2 Integracao com Items

```javascript
// Definir valor de item APEX
apex.item('P1_SIGNATURE').setValue(apexSignature.toDataURL('sig_region'));

// Hash para verificacao
const hash = await apexSignatureVerification.generateHash('sig_region');
apex.item('P1_HASH').setValue(hash);
```

### 10.3 AJAX Callback

```javascript
apex.server.process('SALVAR_ASSINATURA', {
    x01: apexSignature.toDataURL('sig_region'),
    x02: await apexSignatureVerification.generateHash('sig_region')
}, {
    success: function(data) {
        apex.message.showPageSuccess('Assinatura salva!');
    },
    error: function(jqXHR, textStatus, errorThrown) {
        apex.message.showErrors([{
            type: 'error',
            message: 'Erro ao salvar: ' + textStatus
        }]);
    }
});
```

---

## 11. Banco de Dados

### 11.1 Estrutura de Tabela Recomendada

```sql
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
    user_agent      VARCHAR2(500),
    verificado      VARCHAR2(1) DEFAULT 'N',
    data_verificacao TIMESTAMP
);

-- Indices
CREATE INDEX idx_assinaturas_usuario ON assinaturas(usuario_id);
CREATE INDEX idx_assinaturas_data ON assinaturas(data_criacao);
CREATE INDEX idx_assinaturas_hash ON assinaturas(hash_sha256);

-- Comentarios
COMMENT ON TABLE assinaturas IS 'Tabela de assinaturas digitais - APEX Signature v3.8.0';
COMMENT ON COLUMN assinaturas.hash_sha256 IS 'Hash SHA-256 para verificacao de integridade';
COMMENT ON COLUMN assinaturas.metadados IS 'JSON com metadados de auditoria';
```

### 11.2 Procedure para Salvar

```sql
CREATE OR REPLACE PROCEDURE salvar_assinatura (
    p_usuario_id IN NUMBER DEFAULT NULL,
    p_hash       IN VARCHAR2 DEFAULT NULL
)
AS
    l_blob      BLOB;
    l_filename  VARCHAR2(255);
    l_mime_type VARCHAR2(100);
BEGIN
    -- Buscar da colecao APEX
    SELECT blob001, c001, c002
      INTO l_blob, l_filename, l_mime_type
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
        p_hash,
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

### 11.3 Function para Verificar

```sql
CREATE OR REPLACE FUNCTION verificar_assinatura (
    p_assinatura_id IN NUMBER,
    p_hash          IN VARCHAR2
) RETURN VARCHAR2
AS
    l_hash_original VARCHAR2(64);
    l_resultado     VARCHAR2(10);
BEGIN
    SELECT hash_sha256
      INTO l_hash_original
      FROM assinaturas
     WHERE id = p_assinatura_id;

    IF l_hash_original = p_hash THEN
        l_resultado := 'VALIDA';

        UPDATE assinaturas
           SET verificado = 'Y',
               data_verificacao = SYSTIMESTAMP
         WHERE id = p_assinatura_id;
        COMMIT;
    ELSE
        l_resultado := 'INVALIDA';
    END IF;

    RETURN l_resultado;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 'NAO_ENCONTRADA';
END verificar_assinatura;
/
```

---

## 12. Casos de Teste

### 12.1 Estatisticas de Cobertura

| Modulo | Casos de Teste | Alta | Media | Baixa |
|--------|----------------|------|-------|-------|
| v3.0.0 Multi-Entrada | 45 | 15 | 20 | 10 |
| v3.1.0 DocSign | 50 | 18 | 22 | 10 |
| v3.2.0 Templates | 42 | 14 | 18 | 10 |
| v3.3.0 Toolbar | 38 | 12 | 16 | 10 |
| v3.4.0 Timestamp | 35 | 10 | 15 | 10 |
| v3.5.0 Initials | 40 | 12 | 18 | 10 |
| v3.6.0 Verification | 50 | 20 | 20 | 10 |
| v3.7.0 Mobile | 47 | 18 | 19 | 10 |
| v3.8.0 Export | 47 | 16 | 21 | 10 |
| **TOTAL** | **394** | **135** | **169** | **90** |

### 12.2 Testes de Performance

| Metrica | Limite Aceitavel | Limite Ideal |
|---------|------------------|--------------|
| Inicializacao | < 500ms | < 200ms |
| Latencia de desenho | < 16ms | < 8ms |
| Exportar PNG | < 1s | < 500ms |
| Exportar PDF | < 3s | < 1s |
| Gerar Hash SHA-256 | < 100ms | < 50ms |

### 12.3 Testes de Memoria

| Cenario | Limite |
|---------|--------|
| Memoria inicial | < 50MB |
| Apos 100 tracos | < 100MB |
| Apos carregar PDF 50MB | < 200MB |
| Leak apos limpar | 0MB |

---

## 13. Resolucao de Problemas

### 13.1 Plugin nao carrega

**Sintoma:** Canvas nao aparece

**Solucoes:**
1. Verificar importacao do plugin
2. Conferir arquivos JS/CSS (F12 > Network)
3. Verificar erros no console (F12 > Console)
4. Confirmar Static ID da regiao

### 13.2 Assinatura nao salva

**Sintoma:** Erro ao salvar no banco

**Solucoes:**
1. Verificar colecao APEX_SIGNATURE
2. Confirmar permissoes na tabela
3. Verificar codigo PL/SQL no atributo 07
4. Testar AJAX callback

### 13.3 PDF nao carrega

**Sintoma:** PDF.js nao renderiza

**Solucoes:**
1. Verificar se PDF.js esta carregado
2. Confirmar que PDF nao esta corrompido
3. Testar com PDF menor/mais simples
4. Verificar CORS se PDF de URL externa

### 13.4 Performance lenta

**Sintoma:** Atraso ao desenhar

**Solucoes:**
1. Reduzir dimensoes do canvas
2. Desativar modulos nao utilizados
3. Usar versoes minificadas (.min.js)
4. Verificar hardware acceleration do navegador

### 13.5 Nao funciona no mobile

**Sintoma:** Touch nao responde

**Solucoes:**
1. Habilitar "Enable Mobile" nos atributos
2. Verificar touch-action CSS
3. Testar em diferentes dispositivos
4. Verificar versao do navegador mobile

---

## 14. Historico de Versoes

### v3.x (Maxwell da Silva Oliveira - @maxwbh)

| Versao | Data | Descricao |
|--------|------|-----------|
| v3.8.0 | Dez 2024 | Export Formats Module |
| v3.7.0 | Dez 2024 | Mobile Optimization Module |
| v3.6.0 | Dez 2024 | Signature Verification Module |
| v3.5.0 | Dez 2024 | Initials Mode Module |
| v3.4.0 | Dez 2024 | Timestamp Overlay Module |
| v3.3.0 | Dez 2024 | Enhanced Toolbar Module |
| v3.2.0 | Dez 2024 | Signature Templates Module |
| v3.1.0 | Dez 2024 | Document Signing Module |
| v3.0.0 | Dez 2024 | Multi-Input Capture Module |

### v2.x (Maxwell da Silva Oliveira - @maxwbh)

| Versao | Data | Descricao |
|--------|------|-----------|
| v2.0.1 | Dez 2024 | Bug fixes for Dynamic Action events |
| v2.0.0 | Dez 2024 | Updated signature_pad to v5.0.4, Pointer Events API |

### v1.x (Daniel Hochleitner - @Dani3lSun)

| Versao | Data | Descricao |
|--------|------|-----------|
| v1.1.0 | - | Added WaitSpinner when saving |
| v1.0.1 | - | Fixed charset issues |
| v1.0.0 | - | Initial Release |

---

## 15. Suporte

### Canais de Suporte

| Canal | Link |
|-------|------|
| GitHub Issues | [github.com/Maxwbh/apex-plugin-apexsignature/issues](https://github.com/Maxwbh/apex-plugin-apexsignature/issues) |
| GitHub Discussions | [github.com/Maxwbh/apex-plugin-apexsignature/discussions](https://github.com/Maxwbh/apex-plugin-apexsignature/discussions) |
| Documentacao | [github.com/Maxwbh/apex-plugin-apexsignature/docs](https://github.com/Maxwbh/apex-plugin-apexsignature/tree/main/docs) |

### Contato

| Item | Informacao |
|------|------------|
| Desenvolvedor v3.x | Maxwell da Silva Oliveira |
| LinkedIn | [/maxwbh](https://linkedin.com/in/maxwbh) |
| GitHub | [@maxwbh](https://github.com/maxwbh) |
| Empresa | M&S do Brasil LTDA |

---

## Apendice A: Checklist de Implementacao

- [ ] Plugin importado no APEX
- [ ] Arquivos JS/CSS carregados
- [ ] Regiao criada com Static ID
- [ ] Atributos configurados
- [ ] Tabela de assinaturas criada
- [ ] PL/SQL de salvamento configurado
- [ ] Dynamic Actions configuradas
- [ ] Testado em todos os navegadores
- [ ] Testado em dispositivos moveis

---

## Apendice B: Exemplo Completo

```javascript
// Exemplo de integracao completa
document.addEventListener('DOMContentLoaded', function() {

    // Ouvir quando assinatura for desenhada
    document.addEventListener('apexsignature-stroke-end', function(e) {
        console.log('Assinatura modificada');
    });

    // Botao salvar
    document.getElementById('btnSalvar').addEventListener('click', async function() {

        // Verificar se assinatura existe
        if (apexSignature.isEmpty('sig_region')) {
            apex.message.showErrors([{
                type: 'error',
                message: 'Por favor, assine antes de salvar.'
            }]);
            return;
        }

        // Gerar hash para verificacao
        const hash = await apexSignatureVerification.generateHash('sig_region');
        apex.item('P1_HASH').setValue(hash);

        // Adicionar timestamp
        apexSignatureTimestamp.enable('sig_region', {
            format: 'DD/MM/YYYY HH:mm:ss',
            position: 'bottom-right'
        });

        // Salvar no servidor
        apexSignature.save('sig_region');
    });

    // Ouvir confirmacao de salvamento
    document.addEventListener('apexsignature-saved', function(e) {
        apex.message.showPageSuccess('Assinatura salva com sucesso!');
    });

    // Exportar como PDF
    document.getElementById('btnExportPDF').addEventListener('click', async function() {
        const pdfBlob = await apexSignatureExport.toPDF('sig_region', {
            pageSize: 'A4',
            includeTimestamp: true
        });

        // Download automatico
        await apexSignatureExport.download('sig_region', 'assinatura.pdf', 'pdf');
    });
});
```

---

**APEX Signature v3.8.0**
**Documentacao Tecnica Completa**

Desenvolvido por Maxwell da Silva Oliveira (@maxwbh)
M&S do Brasil LTDA
Dezembro 2024

Baseado no trabalho original de Daniel Hochleitner (@Dani3lSun)
