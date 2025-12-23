# TODO - Melhorias APEX Signature v3.0

## Análise do Projeto eSignDoc

**Repositório:** https://github.com/mishab424/eSignDoc-Signature-On-document
**Autor:** Muhammed Mishab PP
**Versão:** 1.0.0 (APEX 24.2)

### Funcionalidades do eSignDoc

| Feature | Descrição |
|---------|-----------|
| Multi-input | Desenho, Upload de imagem, Webcam |
| Document Signing | Posicionar assinatura em PDF/imagem via drag-and-drop |
| Live Preview | Pré-visualização em tempo real |
| Customização | Redimensionar, recolorir, ajustar espessura |
| Export | Download como PDF ou imagem |
| Storage | BLOB no banco de dados |

---

## TODO - Sugestões de Melhorias para APEX Signature v3.0

### Prioridade Alta

#### 1. Multi-Input Signature Capture
**Baseado em:** eSignDoc multi-input modes

```
[ ] Adicionar aba/modo para Upload de Imagem de assinatura
    - Aceitar PNG, JPG, SVG
    - Preview antes de confirmar
    - Remover fundo automaticamente (opcional)

[ ] Adicionar captura via Webcam
    - Usar MediaDevices API (navigator.mediaDevices.getUserMedia)
    - Botão para capturar foto
    - Crop/ajuste da imagem capturada

[ ] Interface com tabs para alternar entre modos:
    - Tab 1: Desenhar (atual)
    - Tab 2: Upload
    - Tab 3: Webcam
```

#### 2. Signature on Document (PDF Overlay)
**Baseado em:** eSignDoc document signing

```
[ ] Permitir upload de documento PDF/imagem
[ ] Renderizar documento usando PDF.js
[ ] Drag-and-drop da assinatura sobre o documento
[ ] Posicionamento livre com handles de resize
[ ] Múltiplas assinaturas no mesmo documento
[ ] Export do documento assinado como PDF
[ ] Suporte a múltiplas páginas
```

#### 3. Signature Templates/Saved Signatures
```
[ ] Salvar assinaturas como templates reutilizáveis
[ ] Galeria de assinaturas do usuário
[ ] Selecionar assinatura salva para aplicar
[ ] Gerenciar (editar/excluir) assinaturas salvas
```

---

### Prioridade Média

#### 4. Enhanced Customization UI
**Baseado em:** eSignDoc live editing

```
[ ] Toolbar de edição em tempo real:
    - Color picker para cor da caneta
    - Slider para espessura da linha
    - Botão borracha (erase mode)
    - Undo/Redo

[ ] Preview de alterações antes de aplicar
[ ] Preset de cores (preto, azul, vermelho)
[ ] Salvar preferências do usuário
```

#### 5. Text Signature Mode
```
[ ] Modo para digitar nome e gerar assinatura estilizada
[ ] Múltiplas fontes de "assinatura" (script fonts)
[ ] Preview em tempo real
[ ] Customizar cor e tamanho
```

#### 6. Date/Timestamp Overlay
```
[ ] Opção para adicionar data/hora na assinatura
[ ] Posição configurável (abaixo, ao lado)
[ ] Formato de data configurável
[ ] Incluir IP/localização (opcional, para auditoria)
```

---

### Prioridade Baixa

#### 7. Initials Mode
```
[ ] Modo separado para capturar iniciais (menor)
[ ] Canvas reduzido para iniciais
[ ] Usar para rubricas em documentos multipágina
```

#### 8. Signature Verification
```
[ ] Hash da assinatura para verificação
[ ] Metadados de auditoria (timestamp, IP, user agent)
[ ] Integração com certificado digital (futuro)
```

#### 9. Mobile Optimization
```
[ ] Forçar landscape em mobile para melhor área
[ ] Gestos de pinch-to-zoom
[ ] Botões maiores para touch
[ ] Suporte a Apple Pencil / S-Pen (pressure sensitivity já existe)
```

#### 10. Export Formats
```
[ ] Export como SVG (já existe via signature_pad v5)
[ ] Export como PDF direto
[ ] Export com fundo transparente ou branco
[ ] Qualidade/resolução configurável
```

---

## Arquitetura Proposta v3.0

```
apex-plugin-apexsignature/
├── server/
│   ├── js/
│   │   ├── signature_pad.min.js      (v5.0.4 - existente)
│   │   ├── apexsignature.min.js      (v3.0 - atualizar)
│   │   ├── pdf.min.js                (PDF.js - novo)
│   │   └── pdf.worker.min.js         (PDF.js worker - novo)
│   └── css/
│       └── apexsignature.css         (novo - estilos do plugin)
├── source/
│   └── render_region.sql             (atualizar para novos atributos)
└── docs/
    └── ...
```

## Novos Atributos do Plugin (v3.0)

| Atributo | Tipo | Descrição |
|----------|------|-----------|
| attribute_14 | SELECT LIST | Capture Mode (Draw/Upload/Webcam/All) |
| attribute_15 | CHECKBOX | Enable Document Signing |
| attribute_16 | CHECKBOX | Enable Saved Signatures |
| attribute_17 | CHECKBOX | Show Toolbar |
| attribute_18 | CHECKBOX | Add Timestamp |
| attribute_19 | TEXT | Timestamp Format |
| attribute_20 | CHECKBOX | Enable Text Signature |

## Dependências Sugeridas

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| signature_pad | 5.0.4 | Captura de assinatura (atual) |
| PDF.js | 4.x | Renderização de PDF |
| Cropper.js | 1.6.x | Crop de imagem (upload/webcam) |
| html2canvas | 1.4.x | Export para imagem |
| jsPDF | 2.5.x | Geração de PDF |

---

## Estimativa de Esforço

| Feature | Complexidade | Esforço |
|---------|--------------|---------|
| Multi-Input (Upload) | Média | 2-3 dias |
| Multi-Input (Webcam) | Média | 2-3 dias |
| Document Signing | Alta | 5-7 dias |
| Saved Signatures | Média | 2-3 dias |
| Toolbar UI | Baixa | 1-2 dias |
| Text Signature | Baixa | 1-2 dias |
| Timestamp | Baixa | 0.5 dia |

**Total estimado:** 15-20 dias de desenvolvimento

---

## Referências

- eSignDoc: https://github.com/mishab424/eSignDoc-Signature-On-document
- PDF.js: https://mozilla.github.io/pdf.js/
- signature_pad: https://github.com/szimek/signature_pad
- Cropper.js: https://fengyuanchen.github.io/cropperjs/

---

**Criado por:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**Data:** 2025-12-23
**Versão do documento:** 1.0
