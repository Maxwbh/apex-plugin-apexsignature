# Plano de Testes Completo - APEX Signature v3.x

**Versao**: 3.8.0
**Data**: Dezembro 2024
**Autor**: Maxwell da Silva Oliveira (@maxwbh)
**Empresa**: M&S do Brasil LTDA

---

## Indice

1. [Visao Geral](#visao-geral)
2. [Ambiente de Testes](#ambiente-de-testes)
3. [v3.0.0 - Captura Multi-Entrada](#v300---captura-multi-entrada)
4. [v3.1.0 - Assinatura de Documentos](#v310---assinatura-de-documentos)
5. [v3.2.0 - Templates de Assinatura](#v320---templates-de-assinatura)
6. [v3.3.0 - Barra de Ferramentas](#v330---barra-de-ferramentas)
7. [v3.4.0 - Carimbo de Data/Hora](#v340---carimbo-de-datahora)
8. [v3.5.0 - Modo Rubricas](#v350---modo-rubricas)
9. [v3.6.0 - Verificacao](#v360---verificacao)
10. [v3.7.0 - Otimizacao Mobile](#v370---otimizacao-mobile)
11. [v3.8.0 - Formatos de Exportacao](#v380---formatos-de-exportacao)
12. [Testes de Integracao](#testes-de-integracao)
13. [Testes de Performance](#testes-de-performance)
14. [Checklist Final](#checklist-final)

---

## Visao Geral

Este documento consolida todos os planos de teste para a serie APEX Signature v3.x, cobrindo **450+ casos de teste** em 9 modulos.

### Estatisticas de Cobertura

| Modulo | Casos de Teste | Prioridade Alta | Prioridade Media | Prioridade Baixa |
|--------|----------------|-----------------|------------------|------------------|
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

---

## Ambiente de Testes

### Requisitos de Software

| Componente | Versao Minima | Versao Recomendada |
|------------|---------------|-------------------|
| Oracle Database | 19c | 23ai |
| Oracle APEX | 22.2 | 24.2 |
| signature_pad.js | 4.0 | 5.0.4 |
| PDF.js | 2.10 | 3.0+ |
| pdf-lib | 1.17 | 1.17.1 |
| jsPDF | 2.5 | 2.5.1 |

### Navegadores Suportados

| Navegador | Versao | Desktop | Mobile |
|-----------|--------|---------|--------|
| Chrome | 90+ | Sim | Sim |
| Firefox | 88+ | Sim | Sim |
| Safari | 14+ | Sim | Sim |
| Edge | 90+ | Sim | N/A |
| Mobile Safari | iOS 14+ | N/A | Sim |

### Dispositivos Moveis para Teste

- iPhone 12/13/14/15 (iOS 14+)
- iPad Pro com Apple Pencil
- Samsung Galaxy S21+ com S-Pen
- Tablets Android 10+

---

## v3.0.0 - Captura Multi-Entrada

### TC-3.0-001: Inicializacao do Modulo

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 001 | Carregar modulo | Abrir pagina com plugin | Canvas renderizado, abas visiveis | Alta |
| 002 | Verificar abas | Inspecionar interface | Abas Draw/Upload/Webcam presentes | Alta |
| 003 | Aba padrao | Carregar pagina | Aba "Desenhar" ativa por padrao | Media |

### TC-3.0-010: Modo Desenho

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 010 | Desenhar com mouse | Clicar e arrastar no canvas | Linha suave desenhada | Alta |
| 011 | Desenhar com touch | Tocar e arrastar (mobile) | Linha suave desenhada | Alta |
| 012 | Limpar assinatura | Clicar botao "Limpar" | Canvas limpo | Alta |
| 013 | Desfazer stroke | Clicar "Desfazer" | Ultimo traco removido | Media |
| 014 | Pressao variavel | Usar stylus com pressao | Espessura varia com pressao | Media |

### TC-3.0-020: Modo Upload

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 020 | Upload PNG | Selecionar arquivo PNG | Imagem carregada no canvas | Alta |
| 021 | Upload JPEG | Selecionar arquivo JPEG | Imagem carregada no canvas | Alta |
| 022 | Upload SVG | Selecionar arquivo SVG | Imagem carregada no canvas | Media |
| 023 | Arquivo invalido | Selecionar PDF | Mensagem de erro exibida | Media |
| 024 | Arquivo grande | Upload > 5MB | Aviso de tamanho exibido | Baixa |
| 025 | Drag and drop | Arrastar arquivo para area | Imagem carregada | Media |

### TC-3.0-030: Modo Webcam

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 030 | Iniciar camera | Clicar "Iniciar Camera" | Permissao solicitada, video exibido | Alta |
| 031 | Capturar frame | Clicar "Capturar" | Frame capturado para canvas | Alta |
| 032 | Sem camera | Dispositivo sem camera | Mensagem informativa exibida | Media |
| 033 | Permissao negada | Negar acesso a camera | Fallback para modo upload | Media |
| 034 | Trocar camera | Clicar icone trocar | Camera frontal/traseira alternada | Baixa |

### TC-3.0-040: Troca de Modos

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 040 | Draw para Upload | Clicar aba Upload | Interface upload exibida | Alta |
| 041 | Upload para Webcam | Clicar aba Webcam | Interface webcam exibida | Alta |
| 042 | Manter assinatura | Trocar abas com assinatura | Assinatura preservada | Media |
| 043 | API setMode | Chamar setMode('webcam') | Modo alterado via JS | Media |

---

## v3.1.0 - Assinatura de Documentos

### TC-3.1-001: Carregamento de PDF

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 001 | Carregar PDF simples | Upload PDF 1 pagina | PDF renderizado | Alta |
| 002 | Carregar PDF multipaginas | Upload PDF 10 paginas | Todas paginas acessiveis | Alta |
| 003 | PDF protegido | Upload PDF com senha | Prompt para senha | Media |
| 004 | PDF corrompido | Upload arquivo invalido | Erro tratado graciosamente | Media |
| 005 | PDF grande | Upload PDF > 50MB | Indicador de progresso exibido | Baixa |

### TC-3.1-010: Posicionamento de Assinatura

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 010 | Arrastar assinatura | Drag no overlay | Assinatura movida | Alta |
| 011 | Redimensionar | Arrastar handles | Tamanho alterado proporcionalmente | Alta |
| 012 | Rotacionar | Usar controle rotacao | Assinatura rotacionada | Media |
| 013 | Posicao relativa | Mover para canto | Posicao salva corretamente | Media |
| 014 | Multi-pagina | Navegar paginas | Posicao mantida por pagina | Alta |

### TC-3.1-020: Geracao de PDF Assinado

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 020 | Gerar PDF | Clicar "Salvar PDF" | PDF com assinatura embutida | Alta |
| 021 | Multiplas assinaturas | Adicionar 3 assinaturas | Todas presentes no PDF final | Alta |
| 022 | Download PDF | Clicar "Download" | Arquivo baixado corretamente | Alta |
| 023 | Preservar qualidade | Gerar e verificar | Assinatura nitida no PDF | Media |

---

## v3.2.0 - Templates de Assinatura

### TC-3.2-001: Salvar Template

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 001 | Salvar assinatura | Desenhar + Salvar Template | Template salvo no localStorage | Alta |
| 002 | Nome do template | Inserir nome personalizado | Nome exibido na lista | Alta |
| 003 | Limite de templates | Salvar 20 templates | Aviso de limite ou rotacao | Media |
| 004 | Template duplicado | Salvar com nome existente | Confirmacao para sobrescrever | Media |

### TC-3.2-010: Carregar Template

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 010 | Carregar template | Selecionar da lista | Assinatura carregada no canvas | Alta |
| 011 | Preview template | Hover sobre template | Preview exibido | Media |
| 012 | Template corrompido | localStorage alterado | Erro tratado, template removido | Media |

### TC-3.2-020: Gerenciar Templates

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 020 | Excluir template | Clicar "X" no template | Template removido | Alta |
| 021 | Renomear template | Editar nome | Nome atualizado | Media |
| 022 | Exportar templates | Clicar "Exportar" | JSON baixado | Baixa |
| 023 | Importar templates | Upload JSON | Templates restaurados | Baixa |

---

## v3.3.0 - Barra de Ferramentas

### TC-3.3-001: Seletor de Cores

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 001 | Cor preset | Clicar cor preset | Cor aplicada imediatamente | Alta |
| 002 | Cor customizada | Usar color picker | Cor customizada aplicada | Alta |
| 003 | Cores recentes | Usar varias cores | Historico de cores exibido | Media |
| 004 | Hex input | Digitar #FF0000 | Cor vermelha aplicada | Media |

### TC-3.3-010: Controle de Espessura

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 010 | Slider espessura | Arrastar slider | Espessura alterada em tempo real | Alta |
| 011 | Valor minimo | Definir 1px | Linha fina desenhada | Media |
| 012 | Valor maximo | Definir 10px | Linha grossa desenhada | Media |
| 013 | Input numerico | Digitar valor | Espessura definida precisamente | Baixa |

### TC-3.3-020: Desfazer/Refazer

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 020 | Desfazer | Clicar Desfazer | Ultimo stroke removido | Alta |
| 021 | Refazer | Clicar Refazer | Stroke restaurado | Alta |
| 022 | Historico completo | Desfazer 10 acoes | Todas removidas sequencialmente | Media |
| 023 | Atalho teclado | Ctrl+Z / Ctrl+Y | Undo/Redo via teclado | Media |

---

## v3.4.0 - Carimbo de Data/Hora

### TC-3.4-001: Formatos de Data

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 001 | Formato BR | Definir DD/MM/YYYY | Data no formato brasileiro | Alta |
| 002 | Formato US | Definir MM/DD/YYYY | Data no formato americano | Media |
| 003 | Formato ISO | Definir YYYY-MM-DD | Data no formato ISO | Media |
| 004 | Com hora | Adicionar HH:mm:ss | Hora incluida | Alta |

### TC-3.4-010: Posicionamento

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 010 | Inferior direito | Selecionar posicao | Timestamp no canto inferior direito | Alta |
| 011 | Inferior esquerdo | Selecionar posicao | Timestamp no canto inferior esquerdo | Media |
| 012 | Superior | Selecionar posicao superior | Timestamp no topo | Media |
| 013 | Posicao customizada | Definir X/Y | Timestamp na posicao exata | Baixa |

### TC-3.4-020: Estilo do Timestamp

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 020 | Fonte | Alterar fonte | Fonte aplicada ao timestamp | Media |
| 021 | Tamanho | Alterar tamanho | Tamanho alterado | Media |
| 022 | Cor | Alterar cor | Cor aplicada | Media |
| 023 | Transparencia | Definir 50% | Timestamp semi-transparente | Baixa |

---

## v3.5.0 - Modo Rubricas

### TC-3.5-001: Inicializacao

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 001 | Ativar modo | enableInitials(true) | Canvas redimensionado para rubrica | Alta |
| 002 | Dimensoes compactas | Verificar tamanho | 150x75 ou configurado | Alta |
| 003 | Placeholder | Canvas vazio | Texto "Iniciais" exibido | Media |

### TC-3.5-010: Limite de Caracteres

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 010 | Limite 3 chars | Desenhar "ABC" | Aceito | Alta |
| 011 | Exceder limite | Tentar desenhar mais | Aviso exibido ou bloqueado | Media |
| 012 | Limite customizado | Definir maxChars: 5 | 5 caracteres permitidos | Media |

### TC-3.5-020: Estilos de Rubrica

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 020 | Estilo cursivo | Selecionar cursive | Fonte cursiva aplicada | Media |
| 021 | Estilo formal | Selecionar formal | Fonte formal aplicada | Media |
| 022 | Borda arredondada | Habilitar rounded | Bordas arredondadas | Baixa |

---

## v3.6.0 - Verificacao

### TC-3.6-001: Geracao de Hash

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 001 | Gerar SHA-256 | Chamar generateHash() | Hash de 64 caracteres retornado | Alta |
| 002 | Hash consistente | Gerar 2x mesma assinatura | Hashes identicos | Alta |
| 003 | Hash diferente | Modificar assinatura | Hash diferente gerado | Alta |
| 004 | Hash de template | Gerar de template salvo | Hash valido | Media |

### TC-3.6-010: Verificacao de Integridade

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 010 | Verificar valido | verify() com hash correto | Retorna true | Alta |
| 011 | Verificar invalido | verify() com hash errado | Retorna false | Alta |
| 012 | Assinatura adulterada | Modificar e verificar | Detecta adulteracao | Alta |
| 013 | Hash nulo | verify() sem hash | Erro tratado | Media |

### TC-3.6-020: Metadados de Auditoria

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 020 | Coletar metadados | collectMetadata() | Objeto com dados de auditoria | Alta |
| 021 | Timestamp | Verificar metadata | Data/hora UTC presente | Alta |
| 022 | User Agent | Verificar metadata | Navegador identificado | Media |
| 023 | IP (se disponivel) | Verificar metadata | IP ou N/A | Baixa |

### TC-3.6-030: Verificacao no Banco

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 030 | Salvar com hash | Salvar assinatura | Hash armazenado na tabela | Alta |
| 031 | Recuperar e verificar | Buscar e verify() | Integridade confirmada | Alta |
| 032 | Historico de verificacoes | Consultar log | Registros de verificacao | Media |

---

## v3.7.0 - Otimizacao Mobile

### TC-3.7-001: Gestos Touch

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 001 | Swipe para limpar | Swipe horizontal rapido | Canvas limpo | Alta |
| 002 | Pinch zoom | Gesto de pinch | Canvas ampliado/reduzido | Alta |
| 003 | Double tap | Tocar 2x rapidamente | Acao configurada executada | Media |
| 004 | Long press | Pressionar 1s | Menu contexto exibido | Media |
| 005 | Sensibilidade | Ajustar sensibilidade | Gestos respondem adequadamente | Baixa |

### TC-3.7-010: Modo Fullscreen

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 010 | Entrar fullscreen | Clicar icone expand | Tela cheia ativada | Alta |
| 011 | Sair fullscreen | ESC ou botao sair | Volta ao normal | Alta |
| 012 | Orientacao landscape | Rotacionar dispositivo | Canvas ajusta automaticamente | Alta |
| 013 | Barra de ferramentas | Em fullscreen | Toolbar acessivel | Media |
| 014 | Salvar em fullscreen | Clicar salvar | Assinatura salva corretamente | Alta |

### TC-3.7-020: Suporte a Stylus

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 020 | Apple Pencil | Desenhar com Pencil | Pressao detectada | Alta |
| 021 | S-Pen | Desenhar com S-Pen | Pressao detectada | Alta |
| 022 | Inclinacao | Inclinar stylus | Efeito de inclinacao aplicado | Media |
| 023 | Botao stylus | Pressionar botao | Acao configurada executada | Baixa |

### TC-3.7-030: Feedback Haptico

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 030 | Vibrar ao assinar | Iniciar assinatura | Vibracao leve | Media |
| 031 | Vibrar ao limpar | Limpar canvas | Vibracao confirmacao | Media |
| 032 | Desabilitar haptico | hapticEnabled: false | Sem vibracao | Baixa |

---

## v3.8.0 - Formatos de Exportacao

### TC-3.8-001: Exportar PNG

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 001 | PNG padrao | exportPNG() | Blob PNG valido | Alta |
| 002 | PNG transparente | background: transparent | Fundo transparente | Alta |
| 003 | PNG alta resolucao | scale: 2 | Dobro de pixels | Media |
| 004 | PNG com timestamp | includeTimestamp: true | Timestamp na imagem | Media |

### TC-3.8-010: Exportar JPEG

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 010 | JPEG qualidade 80 | quality: 0.8 | JPEG com qualidade 80% | Alta |
| 011 | JPEG qualidade 100 | quality: 1.0 | JPEG maxima qualidade | Media |
| 012 | JPEG baixa qualidade | quality: 0.5 | Arquivo menor | Baixa |

### TC-3.8-020: Exportar SVG

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 020 | SVG vetorial | exportSVG() | SVG com paths vetoriais | Alta |
| 021 | SVG escalavel | Ampliar 400% | Sem perda de qualidade | Alta |
| 022 | SVG otimizado | optimized: true | Tamanho reduzido | Media |

### TC-3.8-030: Exportar PDF

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 030 | PDF A4 | pageSize: 'A4' | PDF formato A4 | Alta |
| 031 | PDF Letter | pageSize: 'Letter' | PDF formato Letter | Media |
| 032 | PDF com metadados | includeMeta: true | Autor, data no PDF | Media |
| 033 | PDF multiplas assinaturas | batch export | Todas em um PDF | Baixa |

### TC-3.8-040: Exportar WebP

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 040 | WebP padrao | exportWebP() | Blob WebP valido | Alta |
| 041 | WebP qualidade | quality: 0.9 | WebP alta qualidade | Media |
| 042 | Fallback PNG | Navegador sem suporte | PNG gerado | Media |

### TC-3.8-050: Area de Transferencia

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 050 | Copiar PNG | copyToClipboard() | Imagem na area de transferencia | Alta |
| 051 | Colar em editor | Ctrl+V em Word/Paint | Imagem colada | Alta |
| 052 | Permissao negada | Sem permissao clipboard | Fallback download | Media |

### TC-3.8-060: Presets de Qualidade

| ID | Descricao | Passos | Resultado Esperado | Prioridade |
|----|-----------|--------|-------------------|------------|
| 060 | Preset web | preset: 'web' | 72dpi, comprimido | Media |
| 061 | Preset print | preset: 'print' | 300dpi, alta qualidade | Media |
| 062 | Preset archive | preset: 'archive' | PNG lossless | Media |

---

## Testes de Integracao

### TC-INT-001: Fluxo Completo

| ID | Descricao | Passos | Resultado Esperado |
|----|-----------|--------|-------------------|
| 001 | Desenhar + Salvar + Exportar | Fluxo completo | Assinatura salva e exportada |
| 002 | Upload + DocSign + PDF | Fluxo documento | PDF assinado gerado |
| 003 | Template + Verificacao | Usar template + verificar | Hash valido |
| 004 | Mobile + Fullscreen + Salvar | Fluxo mobile completo | Funciona em mobile |

### TC-INT-010: Integracao APEX

| ID | Descricao | Passos | Resultado Esperado |
|----|-----------|--------|-------------------|
| 010 | Dynamic Action | Trigger DA no save | DA executada |
| 011 | Page Submit | Submit com assinatura | Dados enviados |
| 012 | AJAX Callback | Salvar via AJAX | Resposta recebida |
| 013 | Collection | Verificar APEX_SIGNATURE | Dados na collection |

---

## Testes de Performance

### TC-PERF-001: Tempo de Resposta

| ID | Metrica | Limite Aceitavel | Limite Ideal |
|----|---------|------------------|--------------|
| 001 | Inicializacao | < 500ms | < 200ms |
| 002 | Desenho (latencia) | < 16ms | < 8ms |
| 003 | Exportar PNG | < 1s | < 500ms |
| 004 | Exportar PDF | < 3s | < 1s |
| 005 | Carregar PDF 10 paginas | < 5s | < 2s |
| 006 | Gerar Hash SHA-256 | < 100ms | < 50ms |

### TC-PERF-010: Memoria

| ID | Metrica | Limite Aceitavel |
|----|---------|------------------|
| 010 | Memoria inicial | < 50MB |
| 011 | Apos 100 strokes | < 100MB |
| 012 | Apos carregar PDF 50MB | < 200MB |
| 013 | Leak apos limpar | 0MB (nenhum leak) |

---

## Checklist Final

### Pre-Lancamento

- [ ] Todos os testes de prioridade ALTA passaram
- [ ] 95%+ dos testes de prioridade MEDIA passaram
- [ ] Nenhum bug critico aberto
- [ ] Performance dentro dos limites
- [ ] Testado em todos os navegadores suportados
- [ ] Testado em dispositivos moveis
- [ ] Documentacao atualizada

### Assinaturas de Aprovacao

| Funcao | Nome | Data | Assinatura |
|--------|------|------|------------|
| Desenvolvedor | Maxwell da Silva Oliveira | ____/____/____ | __________ |
| QA | | ____/____/____ | __________ |
| Gerente Projeto | | ____/____/____ | __________ |

---

**Documento gerado para APEX Signature v3.8.0**
**Repositorio**: [github.com/Maxwbh/apex-plugin-apexsignature](https://github.com/Maxwbh/apex-plugin-apexsignature)
