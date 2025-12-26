# Guia do Usuario - APEX Signature v3.8.0

**Versao**: 3.8.0
**Autor**: Maxwell da Silva Oliveira (@maxwbh)
**Empresa**: M&S do Brasil LTDA
**Repositorio**: [github.com/Maxwbh/apex-plugin-apexsignature](https://github.com/Maxwbh/apex-plugin-apexsignature)

---

## Indice

1. [Introducao](#introducao)
2. [Interface do Usuario](#interface-do-usuario)
3. [Modos de Captura](#modos-de-captura)
4. [Barra de Ferramentas](#barra-de-ferramentas)
5. [Assinatura de Documentos PDF](#assinatura-de-documentos-pdf)
6. [Templates de Assinatura](#templates-de-assinatura)
7. [Modo Rubricas/Iniciais](#modo-rubricasiniciais)
8. [Exportacao de Assinaturas](#exportacao-de-assinaturas)
9. [Uso em Dispositivos Moveis](#uso-em-dispositivos-moveis)
10. [API JavaScript](#api-javascript)
11. [Exemplos Praticos](#exemplos-praticos)

---

## Introducao

O APEX Signature v3.8.0 e um plugin avancado para captura de assinaturas digitais no Oracle APEX. Com suporte a multiplos modos de entrada, assinatura de PDFs e exportacao em varios formatos.

### Recursos Principais

- **Captura Multi-Entrada**: Desenho, upload de imagem e webcam
- **Assinatura de PDF**: Posicione assinaturas em documentos PDF
- **Templates**: Salve e reutilize suas assinaturas
- **Verificacao**: Integridade com hash SHA-256
- **Mobile**: Gestos touch, fullscreen, stylus
- **Exportacao**: PNG, JPEG, SVG, PDF, WebP

---

## Interface do Usuario

### Componentes Visuais

```
+--------------------------------------------------+
|  [Desenhar] [Upload] [Webcam]                    |  <- Abas de modo
+--------------------------------------------------+
|                                                  |
|                                                  |
|               Area do Canvas                     |  <- Area de desenho
|                                                  |
|                                                  |
+--------------------------------------------------+
|  [Cor] [Espessura: ===O===] [Limpar] [Desfazer] |  <- Barra de ferramentas
+--------------------------------------------------+
|  [Salvar] [Exportar v]                          |  <- Acoes
+--------------------------------------------------+
```

### Elementos da Interface

| Elemento | Descricao | Interacao |
|----------|-----------|-----------|
| Abas de Modo | Alternar entre Desenhar/Upload/Webcam | Clique |
| Canvas | Area para desenhar assinatura | Desenho com mouse/touch |
| Seletor de Cor | Escolher cor da caneta | Clique/selecao |
| Slider Espessura | Ajustar espessura do traco | Arrastar |
| Botao Limpar | Apagar toda assinatura | Clique |
| Botao Desfazer | Remover ultimo traco | Clique |
| Botao Salvar | Salvar no banco de dados | Clique |
| Menu Exportar | Escolher formato de exportacao | Dropdown |

---

## Modos de Captura

### Modo Desenho (Draw)

O modo padrao permite desenhar a assinatura diretamente no canvas.

**Como usar:**
1. Selecione a aba "Desenhar"
2. Clique e arraste no canvas para desenhar
3. Use a barra de ferramentas para personalizar
4. Clique em "Salvar" quando finalizar

**Dicas:**
- Desenhe com movimentos fluidos
- Use espessura 2-3px para assinaturas naturais
- Em tablets, use stylus para melhor precisao

### Modo Upload

Permite carregar uma imagem de assinatura existente.

**Formatos aceitos:**
- PNG (recomendado para fundo transparente)
- JPEG
- SVG
- WebP

**Como usar:**
1. Selecione a aba "Upload"
2. Clique em "Escolher arquivo" ou arraste a imagem
3. A imagem sera carregada no canvas
4. Ajuste se necessario e salve

### Modo Webcam

Capture uma assinatura usando a camera do dispositivo.

**Como usar:**
1. Selecione a aba "Webcam"
2. Permita acesso a camera quando solicitado
3. Posicione a assinatura em frente a camera
4. Clique em "Capturar" para tirar a foto
5. A imagem sera carregada no canvas

**Dicas:**
- Use boa iluminacao
- Fundo branco ou uniforme funciona melhor
- Segure firmemente o papel

---

## Barra de Ferramentas

### Seletor de Cores

Altere a cor da caneta para desenho.

**Cores predefinidas:**
- Preto (#000000) - Padrao
- Azul (#0000FF)
- Vermelho (#FF0000)
- Verde (#008000)

**Cor personalizada:**
1. Clique no seletor de cores
2. Escolha a cor desejada no picker
3. A nova cor sera aplicada imediatamente

### Controle de Espessura

Ajuste a espessura do traco da caneta.

| Valor | Uso Recomendado |
|-------|-----------------|
| 1-2px | Assinaturas finas, detalhadas |
| 2-3px | Assinatura normal (recomendado) |
| 4-5px | Assinatura mais expressiva |
| 6-10px | Rubricas, iniciais |

### Botao Limpar

Apaga completamente o conteudo do canvas.

**Atalho:** Swipe horizontal rapido (mobile)

### Botao Desfazer/Refazer

- **Desfazer**: Remove o ultimo traco desenhado
- **Refazer**: Restaura o traco removido

**Atalhos de teclado:**
- Ctrl+Z: Desfazer
- Ctrl+Y: Refazer

---

## Assinatura de Documentos PDF

### Carregar PDF

```javascript
// Via JavaScript
apexSignatureDocSign.loadPDF('minha_regiao', pdfArrayBuffer);

// Via input file
document.getElementById('pdf_input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const buffer = await file.arrayBuffer();
    apexSignatureDocSign.loadPDF('minha_regiao', buffer);
});
```

### Posicionar Assinatura

1. Desenhe ou carregue sua assinatura
2. Clique em "Usar esta assinatura"
3. A assinatura aparecera sobre o PDF
4. Arraste para posicionar
5. Use os handles para redimensionar
6. Navegue entre paginas se necessario

### Salvar PDF Assinado

```javascript
// Gerar PDF com assinatura embutida
const pdfBytes = await apexSignatureDocSign.generateSignedPDF('minha_regiao');

// Baixar
const blob = new Blob([pdfBytes], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'documento_assinado.pdf';
a.click();
```

---

## Templates de Assinatura

### Salvar Template

Salve sua assinatura para reutilizacao futura.

```javascript
// Salvar assinatura atual
apexSignatureTemplates.save('minha_regiao', 'Assinatura Principal');

// Salvar com categoria
apexSignatureTemplates.save('minha_regiao', 'Trabalho', { category: 'profissional' });
```

### Carregar Template

```javascript
// Listar templates salvos
const templates = apexSignatureTemplates.list();
console.log(templates); // [{name: 'Assinatura Principal', ...}]

// Carregar template especifico
apexSignatureTemplates.load('minha_regiao', 'Assinatura Principal');
```

### Gerenciar Templates

```javascript
// Renomear
apexSignatureTemplates.rename('Nome Antigo', 'Nome Novo');

// Excluir
apexSignatureTemplates.delete('Nome do Template');

// Exportar todos (backup)
const backup = apexSignatureTemplates.exportAll();
localStorage.setItem('backup_assinaturas', JSON.stringify(backup));

// Importar
apexSignatureTemplates.importAll(backup);
```

---

## Modo Rubricas/Iniciais

O modo initials oferece uma area compacta para rubricas e iniciais.

### Ativar Modo Initials

```javascript
// Ativar
apexSignatureInitials.enable('minha_regiao', {
    maxCharacters: 3,
    style: 'cursive',
    width: 150,
    height: 75
});

// Desativar
apexSignatureInitials.disable('minha_regiao');
```

### Configuracoes Disponiveis

| Opcao | Tipo | Padrao | Descricao |
|-------|------|--------|-----------|
| maxCharacters | Number | 3 | Limite de caracteres |
| style | String | 'cursive' | Estilo visual |
| width | Number | 150 | Largura do canvas |
| height | Number | 75 | Altura do canvas |
| borderRadius | Number | 8 | Arredondamento |

---

## Exportacao de Assinaturas

### Formatos Disponiveis

| Formato | Extensao | Uso Recomendado |
|---------|----------|-----------------|
| PNG | .png | Web, fundo transparente |
| JPEG | .jpg | Impressao, arquivos menores |
| SVG | .svg | Vetorial, escalavel |
| PDF | .pdf | Documentos oficiais |
| WebP | .webp | Web moderno, compressao |
| Base64 | - | Integracao com APIs |

### Exportar PNG

```javascript
// PNG padrao
const pngBlob = await apexSignatureExport.toPNG('minha_regiao');

// PNG alta resolucao
const pngHD = await apexSignatureExport.toPNG('minha_regiao', {
    scale: 2,
    background: 'transparent'
});

// Download automatico
await apexSignatureExport.downloadPNG('minha_regiao', 'minha_assinatura.png');
```

### Exportar JPEG

```javascript
// JPEG com qualidade 80%
const jpegBlob = await apexSignatureExport.toJPEG('minha_regiao', {
    quality: 0.8,
    background: '#FFFFFF'
});
```

### Exportar SVG

```javascript
// SVG vetorial
const svgString = await apexSignatureExport.toSVG('minha_regiao');

// SVG otimizado
const svgOptimized = await apexSignatureExport.toSVG('minha_regiao', {
    optimized: true
});
```

### Exportar PDF

```javascript
// PDF A4
const pdfBlob = await apexSignatureExport.toPDF('minha_regiao', {
    pageSize: 'A4',
    orientation: 'portrait',
    includeTimestamp: true
});
```

### Copiar para Area de Transferencia

```javascript
// Copiar como imagem
await apexSignatureExport.copyToClipboard('minha_regiao');

// Agora pode colar (Ctrl+V) em Word, Paint, etc.
```

### Presets de Qualidade

```javascript
// Preset web (otimizado para web)
const web = await apexSignatureExport.withPreset('minha_regiao', 'web');

// Preset print (alta qualidade para impressao)
const print = await apexSignatureExport.withPreset('minha_regiao', 'print');

// Preset archive (maxima qualidade, arquivo maior)
const archive = await apexSignatureExport.withPreset('minha_regiao', 'archive');
```

---

## Uso em Dispositivos Moveis

### Gestos Suportados

| Gesto | Acao | Descricao |
|-------|------|-----------|
| Toque e arraste | Desenhar | Desenha a assinatura |
| Swipe horizontal | Limpar | Limpa o canvas |
| Pinch | Zoom | Amplia/reduz canvas |
| Double tap | Desfazer | Remove ultimo traco |
| Long press | Menu | Exibe menu de contexto |

### Modo Fullscreen

Ideal para assinaturas em dispositivos moveis.

```javascript
// Entrar em fullscreen
apexSignatureMobile.enterFullscreen('minha_regiao');

// Sair de fullscreen
apexSignatureMobile.exitFullscreen('minha_regiao');

// Toggle
apexSignatureMobile.toggleFullscreen('minha_regiao');
```

### Suporte a Stylus

O plugin detecta automaticamente:
- Apple Pencil (iPad)
- Samsung S-Pen
- Wacom stylus
- Outros stylus compativeis

**Recursos de stylus:**
- Sensibilidade a pressao
- Deteccao de inclinacao
- Botoes do stylus

```javascript
// Configurar sensibilidade
apexSignatureMobile.setPressureSensitivity('minha_regiao', 0.8);

// Configurar acao do botao do stylus
apexSignatureMobile.setStylusButtonAction('minha_regiao', 'undo');
```

---

## API JavaScript

### Objeto Principal: apexSignature

```javascript
// Inicializar
apexSignature.init('regiao_id', opcoes);

// Obter assinatura como Data URL
const dataUrl = apexSignature.toDataURL('regiao_id');

// Obter como Blob
const blob = await apexSignature.toBlob('regiao_id');

// Limpar canvas
apexSignature.clear('regiao_id');

// Verificar se esta vazio
const isEmpty = apexSignature.isEmpty('regiao_id');

// Salvar no servidor
apexSignature.save('regiao_id');

// Definir modo
apexSignature.setMode('regiao_id', 'webcam'); // 'draw', 'upload', 'webcam'
```

### Eventos

```javascript
// Assinatura iniciada
document.addEventListener('apexsignature-begin', (e) => {
    console.log('Comecou a desenhar:', e.detail.regionId);
});

// Assinatura finalizada
document.addEventListener('apexsignature-end', (e) => {
    console.log('Parou de desenhar:', e.detail.regionId);
});

// Canvas limpo
document.addEventListener('apexsignature-cleared', (e) => {
    console.log('Canvas limpo:', e.detail.regionId);
});

// Assinatura salva
document.addEventListener('apexsignature-saved', (e) => {
    console.log('Salvo com sucesso:', e.detail.regionId);
});

// Erro
document.addEventListener('apexsignature-error', (e) => {
    console.error('Erro:', e.detail.message);
});
```

### Integracao com APEX

```javascript
// Usar com Dynamic Action
// Evento: Custom Event
// Custom Event Name: apexsignature-saved

// Obter valor em item APEX
apex.item('P1_SIGNATURE').setValue(apexSignature.toDataURL('regiao_id'));

// Processar no servidor via AJAX
apex.server.process('SALVAR_ASSINATURA', {
    x01: apexSignature.toDataURL('regiao_id')
}, {
    success: function(data) {
        apex.message.showPageSuccess('Assinatura salva!');
    }
});
```

---

## Exemplos Praticos

### Exemplo 1: Formulario de Contrato

```javascript
// Pagina de contrato com assinatura
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar plugin
    apexSignature.init('sig_contrato', {
        width: 500,
        height: 200,
        penColor: '#000080',
        backgroundColor: '#FFFFF0'
    });

    // Habilitar timestamp
    apexSignatureTimestamp.enable('sig_contrato', {
        format: 'DD/MM/YYYY HH:mm',
        position: 'bottom-right'
    });

    // Botao salvar
    document.getElementById('btn_assinar').addEventListener('click', async function() {
        if (apexSignature.isEmpty('sig_contrato')) {
            apex.message.showErrors([{
                type: 'error',
                message: 'Por favor, assine o documento.'
            }]);
            return;
        }

        // Gerar hash para verificacao
        const hash = await apexSignatureVerification.generateHash('sig_contrato');
        apex.item('P1_HASH').setValue(hash);

        // Salvar
        apexSignature.save('sig_contrato');
    });
});
```

### Exemplo 2: Assinatura de Documento PDF

```javascript
// Carregar PDF para assinatura
async function carregarDocumento() {
    const response = await fetch('/meu-documento.pdf');
    const pdfBuffer = await response.arrayBuffer();

    apexSignatureDocSign.loadPDF('sig_pdf', pdfBuffer);
}

// Finalizar e baixar
async function finalizarDocumento() {
    // Aplicar assinatura
    apexSignatureDocSign.applySignature('sig_pdf');

    // Gerar PDF final
    const pdfBytes = await apexSignatureDocSign.generateSignedPDF('sig_pdf');

    // Download
    apexSignatureExport.downloadBlob(pdfBytes, 'contrato_assinado.pdf', 'application/pdf');
}
```

### Exemplo 3: Sistema de Rubricas

```javascript
// Configurar para rubricas
apexSignatureInitials.enable('sig_rubrica', {
    maxCharacters: 3,
    style: 'formal',
    width: 120,
    height: 60
});

// Salvar rubrica como template
document.getElementById('btn_salvar_rubrica').addEventListener('click', function() {
    apexSignatureTemplates.save('sig_rubrica', 'Minha Rubrica', {
        category: 'rubrica'
    });
    apex.message.showPageSuccess('Rubrica salva!');
});
```

### Exemplo 4: Verificacao de Assinatura

```javascript
// Verificar assinatura existente
async function verificarAssinatura(signatureId) {
    // Buscar hash original do banco
    const response = await apex.server.process('GET_SIGNATURE_HASH', {
        x01: signatureId
    });

    const hashOriginal = response.hash;

    // Carregar assinatura
    // ... (carregar do banco)

    // Verificar
    const isValid = await apexSignatureVerification.verify('sig_verificar', hashOriginal);

    if (isValid) {
        apex.message.showPageSuccess('Assinatura VALIDA - Integridade confirmada');
    } else {
        apex.message.showErrors([{
            type: 'error',
            message: 'ATENCAO: Assinatura INVALIDA ou adulterada!'
        }]);
    }
}
```

---

## FAQ - Perguntas Frequentes

### Como salvar a assinatura no banco de dados?

Use o codigo PL/SQL padrao do plugin que salva na colecao APEX_SIGNATURE, depois transfira para sua tabela.

### Posso usar em dispositivos moveis?

Sim! O plugin foi otimizado para mobile com gestos touch e modo fullscreen.

### Como exportar em alta resolucao?

Use o parametro `scale` na exportacao: `scale: 2` para dobrar a resolucao.

### A assinatura e juridicamente valida?

O plugin fornece ferramentas tecnicas (hash SHA-256, metadados). A validade juridica depende da legislacao local e processo de assinatura.

### Como integrar com ICP-Brasil?

O plugin pode ser integrado com certificados digitais atraves de APIs externas. Consulte a documentacao da sua CA.

---

## Suporte

- **Documentacao**: [github.com/Maxwbh/apex-plugin-apexsignature/docs](https://github.com/Maxwbh/apex-plugin-apexsignature/tree/main/docs)
- **Issues**: [github.com/Maxwbh/apex-plugin-apexsignature/issues](https://github.com/Maxwbh/apex-plugin-apexsignature/issues)
- **Autor**: Maxwell da Silva Oliveira (@maxwbh)
- **Empresa**: M&S do Brasil LTDA

---

**APEX Signature v3.8.0** - Feito com amor para a Comunidade Oracle APEX
