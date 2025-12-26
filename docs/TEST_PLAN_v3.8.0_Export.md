# Plano de Testes - APEX Signature v3.8.0
## Módulo: Export Formats

**Versão:** 3.8.0
**Data:** 2025-12-24
**Autor:** Maxwell da Silva Oliveira
**Empresa:** M&S do Brasil LTDA

---

## Sumário

1. [Objetivo](#objetivo)
2. [Escopo](#escopo)
3. [Ambiente de Teste](#ambiente-de-teste)
4. [Casos de Teste](#casos-de-teste)
5. [Critérios de Aceitação](#critérios-de-aceitação)
6. [Checklist de Regressão](#checklist-de-regressão)

---

## Objetivo

Validar o módulo de exportação de assinaturas em múltiplos formatos (PNG, JPEG, SVG, PDF, WebP), incluindo opções de qualidade, dimensões, fundo transparente e download.

---

## Escopo

### Funcionalidades Testadas

| Funcionalidade | Prioridade |
|----------------|------------|
| Export PNG | Alta |
| Export JPEG | Alta |
| Export SVG | Alta |
| Export PDF | Média |
| Export WebP | Média |
| Export Base64 | Alta |
| Copy to Clipboard | Média |
| Batch Export | Baixa |
| Export Presets | Média |
| Export Button UI | Média |

---

## Ambiente de Teste

### Requisitos

| Componente | Versão |
|------------|--------|
| Oracle APEX | 24.2+ |
| Oracle Database | 19c / 21c / 23ai |
| Navegador Chrome | 120+ |
| Navegador Firefox | 120+ |
| Navegador Safari | 17+ |
| Navegador Edge | 120+ |

### Dependências Opcionais

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| jsPDF | 2.5.x | Export PDF nativo |

---

## Casos de Teste

### 1. Export PNG

#### TC-3.8.0-001: Export PNG Básico
**Objetivo:** Verificar exportação PNG padrão
**Passos:**
1. Desenhar assinatura
2. Chamar `apexSignatureExport.exportPNG('regionId')`
3. Verificar download

**Resultado Esperado:**
- Download de arquivo PNG
- Nome padrão: signature.png
- Imagem com fundo branco

---

#### TC-3.8.0-002: PNG com Fundo Transparente
**Objetivo:** Verificar PNG com transparência
**Passos:**
1. Chamar `exportPNG('regionId', { transparentBackground: true })`
2. Abrir arquivo PNG

**Resultado Esperado:**
- Fundo transparente
- Canal alpha preservado

---

#### TC-3.8.0-003: PNG com Escala 2x
**Objetivo:** Verificar PNG em alta resolução
**Passos:**
1. Chamar `exportPNG('regionId', { scale: 2 })`
2. Verificar dimensões

**Resultado Esperado:**
- Dimensões 2x o original
- Qualidade preservada

---

#### TC-3.8.0-004: PNG com Trim
**Objetivo:** Verificar remoção de whitespace
**Passos:**
1. Desenhar assinatura pequena
2. Chamar `exportPNG('regionId', { trim: true })`
3. Verificar dimensões

**Resultado Esperado:**
- Imagem recortada ao redor da assinatura
- Padding de 10px

---

#### TC-3.8.0-005: PNG com Borda
**Objetivo:** Verificar adição de borda
**Passos:**
1. Chamar `exportPNG('regionId', { includeBorder: true, borderColor: '#000', borderWidth: 2 })`
2. Verificar imagem

**Resultado Esperado:**
- Borda preta de 2px ao redor

---

### 2. Export JPEG

#### TC-3.8.0-006: Export JPEG Básico
**Objetivo:** Verificar exportação JPEG
**Passos:**
1. Chamar `exportJPEG('regionId')`
2. Verificar download

**Resultado Esperado:**
- Download de arquivo .jpg
- Fundo branco (JPEG não suporta transparência)

---

#### TC-3.8.0-007: JPEG com Qualidade Alta
**Objetivo:** Verificar controle de qualidade
**Passos:**
1. Chamar `exportJPEG('regionId', { quality: 1.0 })`
2. Verificar tamanho do arquivo

**Resultado Esperado:**
- Qualidade máxima
- Arquivo maior

---

#### TC-3.8.0-008: JPEG com Qualidade Baixa
**Objetivo:** Verificar compressão
**Passos:**
1. Chamar `exportJPEG('regionId', { quality: 0.5 })`
2. Comparar tamanho com qualidade alta

**Resultado Esperado:**
- Arquivo menor
- Alguma perda de qualidade visível

---

### 3. Export SVG

#### TC-3.8.0-009: Export SVG Nativo
**Objetivo:** Verificar exportação SVG vetorial
**Passos:**
1. Chamar `exportSVG('regionId')`
2. Abrir arquivo SVG

**Resultado Esperado:**
- Download de arquivo .svg
- Formato vetorial escalável

---

#### TC-3.8.0-010: SVG via SignaturePad
**Objetivo:** Verificar uso do toSVG nativo
**Passos:**
1. Verificar se SignaturePad suporta toSVG
2. Exportar SVG
3. Inspecionar conteúdo

**Resultado Esperado:**
- Paths vetoriais (se suportado)
- Ou imagem embarcada como fallback

---

#### TC-3.8.0-011: SVG Transparente
**Objetivo:** Verificar SVG sem fundo
**Passos:**
1. Chamar `exportSVG('regionId', { transparentBackground: true })`
2. Verificar SVG

**Resultado Esperado:**
- Sem elemento rect de fundo
- Transparência preservada

---

### 4. Export PDF

#### TC-3.8.0-012: Export PDF com jsPDF
**Objetivo:** Verificar exportação PDF nativa
**Pré-condição:** jsPDF carregado
**Passos:**
1. Chamar `exportPDF('regionId')`
2. Abrir PDF

**Resultado Esperado:**
- Download de arquivo .pdf
- Assinatura centralizada
- Título e data incluídos

---

#### TC-3.8.0-013: PDF sem jsPDF (Fallback)
**Objetivo:** Verificar fallback via print dialog
**Pré-condição:** jsPDF não disponível
**Passos:**
1. Chamar `exportPDF('regionId')`
2. Verificar comportamento

**Resultado Esperado:**
- Janela de impressão aberta
- Opção "Save as PDF" disponível

---

#### TC-3.8.0-014: PDF Landscape
**Objetivo:** Verificar orientação landscape
**Passos:**
1. Chamar `exportPDF('regionId', { pdfOrientation: 'landscape' })`
2. Verificar PDF

**Resultado Esperado:**
- Página em landscape
- Assinatura bem posicionada

---

#### TC-3.8.0-015: PDF com Título Customizado
**Objetivo:** Verificar título do PDF
**Passos:**
1. Chamar `exportPDF('regionId', { pdfTitle: 'Contrato #123' })`
2. Verificar PDF

**Resultado Esperado:**
- Título "Contrato #123" no topo

---

### 5. Export WebP

#### TC-3.8.0-016: Export WebP Básico
**Objetivo:** Verificar exportação WebP
**Passos:**
1. Chamar `exportWebP('regionId')`
2. Verificar download

**Resultado Esperado:**
- Download de arquivo .webp
- Formato moderno comprimido

---

#### TC-3.8.0-017: WebP com Qualidade
**Objetivo:** Verificar controle de qualidade
**Passos:**
1. Exportar com quality: 0.5
2. Exportar com quality: 0.9
3. Comparar tamanhos

**Resultado Esperado:**
- Quality 0.9 maior que 0.5
- Ambos menores que PNG equivalente

---

### 6. Export Base64

#### TC-3.8.0-018: Export Base64 Completo
**Objetivo:** Verificar retorno de data URL
**Passos:**
1. Chamar `exportBase64('regionId')`
2. Verificar resultado

**Resultado Esperado:**
- Promise resolve com dataURL
- Formato: data:image/png;base64,...
- Sem download

---

#### TC-3.8.0-019: Base64 Only
**Objetivo:** Verificar base64 sem prefixo
**Passos:**
1. Chamar `exportBase64('regionId', { base64Only: true })`
2. Verificar resultado

**Resultado Esperado:**
- Apenas string base64
- Sem prefixo data:image

---

#### TC-3.8.0-020: Base64 como JPEG
**Objetivo:** Verificar formato de saída
**Passos:**
1. Chamar `exportBase64('regionId', { outputFormat: 'jpeg' })`
2. Verificar mimeType

**Resultado Esperado:**
- dataURL com image/jpeg
- Fundo branco aplicado

---

### 7. Copy to Clipboard

#### TC-3.8.0-021: Copiar para Clipboard
**Objetivo:** Verificar cópia para área de transferência
**Passos:**
1. Chamar `copyToClipboard('regionId')`
2. Colar em aplicativo de imagem

**Resultado Esperado:**
- Imagem copiada como PNG
- Cola corretamente

---

#### TC-3.8.0-022: Clipboard API não suportada
**Objetivo:** Verificar fallback
**Passos:**
1. Simular ausência de Clipboard API
2. Chamar `copyToClipboard()`

**Resultado Esperado:**
- Promise rejeita com erro
- Mensagem clara de não suportado

---

### 8. Batch Export

#### TC-3.8.0-023: Exportar Múltiplas Assinaturas
**Objetivo:** Verificar exportação em lote
**Passos:**
1. Ter 3 regiões de assinatura
2. Chamar `exportBatch(['region1', 'region2', 'region3'])`
3. Verificar downloads

**Resultado Esperado:**
- 3 arquivos baixados
- Nomes: signature_1.png, signature_2.png, signature_3.png

---

#### TC-3.8.0-024: Batch com Formato Específico
**Objetivo:** Verificar lote com JPEG
**Passos:**
1. Chamar `exportBatch(['r1', 'r2'], { format: 'jpeg' })`
2. Verificar arquivos

**Resultado Esperado:**
- Arquivos .jpg baixados
- Todas com mesmas opções

---

#### TC-3.8.0-025: Export All Formats
**Objetivo:** Verificar exportação de todos formatos
**Passos:**
1. Chamar `exportAllFormats('regionId')`
2. Verificar resultado

**Resultado Esperado:**
- Objeto com png, jpeg, svg, webp
- Nenhum download (download: false implícito)

---

### 9. Presets

#### TC-3.8.0-026: Preset Print
**Objetivo:** Verificar preset para impressão
**Passos:**
1. Chamar `exportWithPreset('regionId', 'print')`
2. Verificar resultado

**Resultado Esperado:**
- Scale 2x
- Fundo branco
- Trim ativo
- Padding 20px

---

#### TC-3.8.0-027: Preset Web
**Objetivo:** Verificar preset para web
**Passos:**
1. Chamar `exportWithPreset('regionId', 'web')`
2. Verificar resultado

**Resultado Esperado:**
- Scale 1x
- Fundo transparente
- Trim ativo

---

#### TC-3.8.0-028: Preset Email
**Objetivo:** Verificar preset para email
**Passos:**
1. Chamar `exportWithPreset('regionId', 'email')`
2. Verificar tamanho

**Resultado Esperado:**
- JPEG quality 0.7
- Scale 0.75
- Arquivo compacto

---

#### TC-3.8.0-029: Preset Document
**Objetivo:** Verificar preset para documento
**Passos:**
1. Chamar `exportWithPreset('regionId', 'document')`
2. Verificar resultado

**Resultado Esperado:**
- Scale 1.5x
- Borda cinza
- Padding 10px

---

#### TC-3.8.0-030: Preset Inválido
**Objetivo:** Verificar erro com preset desconhecido
**Passos:**
1. Chamar `exportWithPreset('regionId', 'invalid')`
2. Verificar erro

**Resultado Esperado:**
- Promise rejeita
- Mensagem: "Unknown preset: invalid"

---

### 10. UI Components

#### TC-3.8.0-031: Criar Botão de Export
**Objetivo:** Verificar criação de botão
**Passos:**
1. Chamar `addExportButton('regionId')`
2. Verificar DOM

**Resultado Esperado:**
- Botão adicionado ao wrapper
- Ícone de download visível

---

#### TC-3.8.0-032: Menu Dropdown
**Objetivo:** Verificar menu de opções
**Passos:**
1. Clicar no botão Export
2. Verificar menu

**Resultado Esperado:**
- Menu dropdown aparece
- 5 formatos listados
- Opção "Copy to Clipboard"

---

#### TC-3.8.0-033: Fechar Menu ao Clicar Fora
**Objetivo:** Verificar fechamento do menu
**Passos:**
1. Abrir menu
2. Clicar fora
3. Verificar menu

**Resultado Esperado:**
- Menu fecha
- Sem erros

---

#### TC-3.8.0-034: Selecionar Formato no Menu
**Objetivo:** Verificar seleção de formato
**Passos:**
1. Abrir menu
2. Clicar em "PNG"
3. Verificar download

**Resultado Esperado:**
- PNG baixado
- Menu fecha após seleção

---

### 11. Opções de Dimensão

#### TC-3.8.0-035: Largura/Altura Customizada
**Objetivo:** Verificar dimensões específicas
**Passos:**
1. Chamar `exportPNG('regionId', { width: 400, height: 200 })`
2. Verificar dimensões

**Resultado Esperado:**
- Imagem 400x200px
- Assinatura escalada proporcionalmente

---

#### TC-3.8.0-036: Padding
**Objetivo:** Verificar adição de padding
**Passos:**
1. Chamar `exportPNG('regionId', { padding: 50 })`
2. Verificar imagem

**Resultado Esperado:**
- 50px de padding em todos lados
- Dimensões aumentadas

---

### 12. Filename

#### TC-3.8.0-037: Filename Customizado
**Objetivo:** Verificar nome de arquivo
**Passos:**
1. Chamar `exportPNG('regionId', { filename: 'contrato_assinatura' })`
2. Verificar download

**Resultado Esperado:**
- Arquivo: contrato_assinatura.png

---

#### TC-3.8.0-038: Filename com Timestamp
**Objetivo:** Verificar inclusão de data/hora
**Passos:**
1. Chamar `exportPNG('regionId', { includeTimestamp: true })`
2. Verificar nome

**Resultado Esperado:**
- Nome: signature_YYYYMMDD_HHMMSS.png

---

### 13. Utilitários

#### TC-3.8.0-039: Estimar Tamanho
**Objetivo:** Verificar estimativa de tamanho
**Passos:**
1. Chamar `getExportSizeEstimate('regionId', 'png')`
2. Verificar resultado

**Resultado Esperado:**
- estimatedBytes presente
- estimatedKB calculado
- Dimensões corretas

---

#### TC-3.8.0-040: dataURLToBlob
**Objetivo:** Verificar conversão
**Passos:**
1. Obter dataURL
2. Chamar `dataURLToBlob(dataURL)`
3. Verificar blob

**Resultado Esperado:**
- Blob criado
- Tipo correto

---

### 14. Eventos

#### TC-3.8.0-041: Evento de Export
**Objetivo:** Verificar disparo de evento
**Passos:**
1. Adicionar listener para `apexsignature-export-exported`
2. Exportar assinatura
3. Verificar evento

**Resultado Esperado:**
- Evento disparado
- detail contém format, dataURL, size

---

#### TC-3.8.0-042: Evento de Clipboard
**Objetivo:** Verificar evento de cópia
**Passos:**
1. Adicionar listener para `apexsignature-export-copied`
2. Copiar para clipboard
3. Verificar evento

**Resultado Esperado:**
- Evento disparado
- detail.format = 'png'

---

### 15. Dark Mode

#### TC-3.8.0-043: Botão em Dark Mode
**Objetivo:** Verificar estilos do botão
**Passos:**
1. Ativar dark mode
2. Verificar botão e menu

**Resultado Esperado:**
- Cores adaptadas
- Menu com fundo escuro

---

### 16. Responsividade

#### TC-3.8.0-044: Menu em Mobile
**Objetivo:** Verificar menu em tela pequena
**Passos:**
1. Abrir em 375px width
2. Clicar no botão Export
3. Verificar menu

**Resultado Esperado:**
- Menu em fullwidth no bottom
- Itens maiores para touch

---

### 17. Acessibilidade

#### TC-3.8.0-045: Focus no Botão
**Objetivo:** Verificar foco visível
**Passos:**
1. Navegar com Tab
2. Verificar outline

**Resultado Esperado:**
- Outline visível
- 2px solid azul

---

### 18. Erros

#### TC-3.8.0-046: Canvas Não Encontrado
**Objetivo:** Verificar tratamento de erro
**Passos:**
1. Chamar `exportPNG('regionInexistente')`
2. Verificar erro

**Resultado Esperado:**
- Promise rejeita
- Erro: "Canvas not found"

---

#### TC-3.8.0-047: Assinatura Vazia
**Objetivo:** Verificar export de canvas vazio
**Passos:**
1. Não desenhar nada
2. Exportar

**Resultado Esperado:**
- Export funciona
- Imagem em branco/transparente

---

---

## Critérios de Aceitação

### Funcionais

| Critério | Métrica |
|----------|---------|
| PNG Export | Download funcional |
| JPEG Export | Qualidade configurável 0-1 |
| SVG Export | Vetorial ou fallback |
| PDF Export | Com ou sem jsPDF |
| WebP Export | Formato moderno |
| Clipboard | Copia imagem PNG |
| Presets | 6 presets funcionais |

### Não-Funcionais

| Critério | Métrica |
|----------|---------|
| Tempo de export | < 500ms para PNG simples |
| Tamanho estimado | Precisão ±10% |
| Compatibilidade | Chrome, Firefox, Safari, Edge |

---

## Checklist de Regressão

### Funcionalidades Anteriores

- [ ] Captura de assinatura funcional
- [ ] Multi-input (Draw/Upload/Webcam) ok
- [ ] Document Signing funcional
- [ ] Templates salvando/carregando
- [ ] Toolbar de customização ok
- [ ] Timestamp overlay funcional
- [ ] Initials mode funcional
- [ ] Verification module ok
- [ ] Mobile optimization ok
- [ ] Eventos APEX disparando
- [ ] Dark mode em todos módulos

### Navegadores

- [ ] Chrome 120+ funcional
- [ ] Firefox 120+ funcional
- [ ] Safari 17+ funcional
- [ ] Edge 120+ funcional

---

## Observações

1. **jsPDF**: Biblioteca opcional para PDF nativo
2. **Clipboard API**: Requer HTTPS em produção
3. **WebP**: Nem todos navegadores antigos suportam
4. **SVG**: Melhor via signature_pad.toSVG() se disponível

---

**Documento criado por:** Maxwell da Silva Oliveira
**Empresa:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
