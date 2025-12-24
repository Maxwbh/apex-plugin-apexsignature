# Plano de Testes - APEX Signature v3.7.0
## Módulo: Mobile Optimization

**Versão:** 3.7.0
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

Validar o módulo de otimização mobile, incluindo gestos touch, modo fullscreen, suporte a stylus, orientação de tela e feedback háptico.

---

## Escopo

### Funcionalidades Testadas

| Funcionalidade | Prioridade |
|----------------|------------|
| Detecção de Dispositivo | Alta |
| Gestos Touch (swipe, double-tap, pinch) | Alta |
| Modo Fullscreen | Alta |
| Otimização de Touch Targets | Alta |
| Suporte a Orientação | Média |
| Pressure Sensitivity (Stylus) | Média |
| Feedback Háptico | Baixa |
| Zoom/Pan | Média |

---

## Ambiente de Teste

### Dispositivos Móveis

| Dispositivo | Sistema | Navegador |
|-------------|---------|-----------|
| iPhone 14/15 | iOS 17+ | Safari |
| iPhone SE | iOS 17+ | Safari |
| iPad Pro | iPadOS 17+ | Safari |
| Samsung Galaxy S23 | Android 14 | Chrome |
| Samsung Galaxy Tab | Android 13+ | Chrome |
| Pixel 7/8 | Android 14 | Chrome |

### Stylus

| Dispositivo | Stylus |
|-------------|--------|
| iPad Pro | Apple Pencil 2 |
| Samsung Galaxy Tab | S-Pen |
| Surface Pro | Surface Pen |

### Requisitos

| Componente | Versão |
|------------|--------|
| Oracle APEX | 24.2+ |
| Oracle Database | 19c / 21c / 23ai |

---

## Casos de Teste

### 1. Detecção de Dispositivo

#### TC-3.7.0-001: Detectar Dispositivo Mobile
**Objetivo:** Verificar detecção correta de smartphone
**Dispositivo:** iPhone / Android Phone
**Passos:**
1. Acessar página APEX com plugin
2. Verificar `apexSignatureMobile.isMobile()`

**Resultado Esperado:**
- Retorna `true`
- Classe `apex-sig-mobile-device` aplicada

---

#### TC-3.7.0-002: Detectar Tablet
**Objetivo:** Verificar detecção correta de tablet
**Dispositivo:** iPad / Android Tablet
**Passos:**
1. Acessar página APEX com plugin
2. Verificar `apexSignatureMobile.isTablet()`

**Resultado Esperado:**
- Retorna `true`
- Classe `apex-sig-tablet-device` aplicada

---

#### TC-3.7.0-003: Detectar Touch Support
**Objetivo:** Verificar detecção de suporte a touch
**Passos:**
1. Inicializar módulo
2. Verificar `apexSignatureMobile.hasTouch()`

**Resultado Esperado:**
- `true` em dispositivos touch
- `false` em desktop sem touch

---

#### TC-3.7.0-004: Detectar Orientação
**Objetivo:** Verificar detecção de orientação
**Passos:**
1. Acessar em modo portrait
2. Verificar `apexSignatureMobile.getOrientation()`
3. Girar para landscape
4. Verificar novamente

**Resultado Esperado:**
- Retorna `'portrait'` ou `'landscape'`
- Atualiza ao girar dispositivo

---

### 2. Gestos Touch

#### TC-3.7.0-005: Swipe Left para Limpar
**Objetivo:** Verificar gesto de limpar assinatura
**Passos:**
1. Desenhar assinatura
2. Fazer swipe horizontal para esquerda (>100px)
3. Verificar resultado

**Resultado Esperado:**
- Assinatura limpa
- Evento `apexsignature-mobile-gesture-clear` disparado
- Feedback háptico ativado

---

#### TC-3.7.0-006: Double Tap para Undo
**Objetivo:** Verificar gesto de desfazer
**Passos:**
1. Desenhar múltiplos traços
2. Dar dois toques rápidos (<300ms)
3. Verificar resultado

**Resultado Esperado:**
- Último traço desfeito
- Evento `apexsignature-mobile-gesture-undo` disparado

---

#### TC-3.7.0-007: Long Press para Fullscreen
**Objetivo:** Verificar gesto de fullscreen
**Passos:**
1. Pressionar canvas por 500ms+
2. Verificar resultado

**Resultado Esperado:**
- Modo fullscreen ativado
- Evento `apexsignature-mobile-gesture-fullscreen` disparado

---

#### TC-3.7.0-008: Pinch to Zoom
**Objetivo:** Verificar zoom com dois dedos
**Passos:**
1. Tocar canvas com dois dedos
2. Afastar dedos (pinch out)
3. Aproximar dedos (pinch in)

**Resultado Esperado:**
- Canvas amplia/reduz
- Limite de zoom 0.5x a 3x
- Evento `apexsignature-mobile-zoom-changed` disparado

---

#### TC-3.7.0-009: Desabilitar Gestos
**Objetivo:** Verificar desativação de gestos
**Passos:**
1. Inicializar com `{ swipeLeftToClear: false, doubleTapToUndo: false }`
2. Tentar gestos
3. Verificar resultado

**Resultado Esperado:**
- Gestos não funcionam
- Assinatura não afetada

---

### 3. Modo Fullscreen

#### TC-3.7.0-010: Entrar em Fullscreen
**Objetivo:** Verificar entrada no modo fullscreen
**Passos:**
1. Chamar `apexSignatureMobile.enterFullscreen('regionId')`
2. Verificar overlay

**Resultado Esperado:**
- Overlay fullscreen exibido
- Canvas em tamanho máximo
- Botões Clear/Confirm visíveis

---

#### TC-3.7.0-011: Desenhar em Fullscreen
**Objetivo:** Verificar assinatura em fullscreen
**Passos:**
1. Entrar em fullscreen
2. Desenhar assinatura no canvas grande
3. Verificar traços

**Resultado Esperado:**
- Desenho funcional
- Responsivo ao toque
- Boa área de assinatura

---

#### TC-3.7.0-012: Confirmar Assinatura Fullscreen
**Objetivo:** Verificar transferência de assinatura
**Passos:**
1. Desenhar em fullscreen
2. Clicar em "Confirmar"
3. Verificar canvas original

**Resultado Esperado:**
- Assinatura transferida
- Modo fullscreen fechado
- Canvas original atualizado

---

#### TC-3.7.0-013: Cancelar Fullscreen
**Objetivo:** Verificar saída sem confirmar
**Passos:**
1. Entrar em fullscreen
2. Desenhar assinatura
3. Clicar no botão X (fechar)
4. Verificar resultado

**Resultado Esperado:**
- Fullscreen fechado
- Canvas original inalterado
- Desenho descartado

---

#### TC-3.7.0-014: Limpar em Fullscreen
**Objetivo:** Verificar limpeza no fullscreen
**Passos:**
1. Desenhar em fullscreen
2. Clicar em "Limpar"
3. Verificar canvas

**Resultado Esperado:**
- Canvas limpo
- Pode continuar desenhando

---

#### TC-3.7.0-015: Toggle Fullscreen
**Objetivo:** Verificar alternância
**Passos:**
1. Chamar `toggleFullscreen()`
2. Verificar estado
3. Chamar novamente
4. Verificar estado

**Resultado Esperado:**
- Primeira vez: entra fullscreen
- Segunda vez: sai fullscreen

---

### 4. Orientação de Tela

#### TC-3.7.0-016: Prompt de Orientação
**Objetivo:** Verificar prompt para girar dispositivo
**Dispositivo:** Mobile em portrait
**Passos:**
1. Acessar página em portrait
2. Inicializar com `{ showOrientationPrompt: true }`
3. Verificar prompt

**Resultado Esperado:**
- Prompt exibido
- Ícone de rotação animado
- Botão "Continuar assim" funcional

---

#### TC-3.7.0-017: Ocultar Prompt ao Girar
**Objetivo:** Verificar auto-ocultação
**Passos:**
1. Ver prompt em portrait
2. Girar para landscape
3. Verificar prompt

**Resultado Esperado:**
- Prompt desaparece automaticamente
- Evento `orientation-changed` disparado

---

#### TC-3.7.0-018: Force Landscape em Fullscreen
**Objetivo:** Verificar bloqueio de orientação
**Passos:**
1. Inicializar com `{ forceLandscape: true }`
2. Entrar em fullscreen
3. Verificar orientação

**Resultado Esperado:**
- Tela travada em landscape (se suportado)
- Maior área de assinatura

---

#### TC-3.7.0-019: Redimensionar ao Girar
**Objetivo:** Verificar ajuste de canvas
**Passos:**
1. Assinar em portrait
2. Girar para landscape
3. Verificar canvas

**Resultado Esperado:**
- Canvas redimensionado
- Assinatura preservada
- Evento `resize` disparado

---

### 5. Touch Targets

#### TC-3.7.0-020: Tamanho Mínimo de Botões
**Objetivo:** Verificar tamanho dos botões
**Passos:**
1. Inicializar com `{ optimizeTouchTargets: true }`
2. Medir botões

**Resultado Esperado:**
- Mínimo 44x44px
- Padding adequado
- Espaçamento entre botões

---

#### TC-3.7.0-021: Área de Toque Expandida
**Objetivo:** Verificar facilidade de toque
**Passos:**
1. Tocar próximo às bordas dos botões
2. Verificar ativação

**Resultado Esperado:**
- Botões respondem mesmo em bordas
- Sem toques acidentais

---

### 6. Pressure Sensitivity (Stylus)

#### TC-3.7.0-022: Detectar Apple Pencil
**Objetivo:** Verificar detecção de stylus
**Dispositivo:** iPad + Apple Pencil
**Passos:**
1. Tocar com Pencil
2. Verificar `apexSignatureMobile.hasPressure()`

**Resultado Esperado:**
- Retorna `true` após primeiro toque
- Tipo de pointer: `'pen'`

---

#### TC-3.7.0-023: Variação de Espessura com Pressão
**Objetivo:** Verificar resposta à pressão
**Passos:**
1. Desenhar com pressão leve
2. Desenhar com pressão forte
3. Comparar traços

**Resultado Esperado:**
- Pressão leve: traço fino
- Pressão forte: traço grosso
- Transição suave

---

#### TC-3.7.0-024: Detectar S-Pen
**Objetivo:** Verificar detecção Samsung S-Pen
**Dispositivo:** Samsung Galaxy Tab + S-Pen
**Passos:**
1. Usar S-Pen para desenhar
2. Verificar comportamento

**Resultado Esperado:**
- Pressão detectada
- Resposta similar ao Apple Pencil

---

#### TC-3.7.0-025: Alternar entre Dedo e Stylus
**Objetivo:** Verificar troca de modo
**Passos:**
1. Desenhar com stylus
2. Desenhar com dedo
3. Verificar configurações

**Resultado Esperado:**
- Ajuste automático de sensibilidade
- Dedo: configuração padrão
- Stylus: maior precisão

---

### 7. Feedback Háptico

#### TC-3.7.0-026: Vibração ao Limpar
**Objetivo:** Verificar feedback háptico
**Passos:**
1. Executar gesto de limpar (swipe)
2. Verificar vibração

**Resultado Esperado:**
- Vibração curta detectada
- Tipo: "medium"

---

#### TC-3.7.0-027: Vibração ao Confirmar
**Objetivo:** Verificar feedback de sucesso
**Passos:**
1. Confirmar assinatura em fullscreen
2. Verificar vibração

**Resultado Esperado:**
- Padrão de vibração: success
- [10, 50, 10] ms

---

#### TC-3.7.0-028: Desabilitar Vibração
**Objetivo:** Verificar desativação
**Passos:**
1. Inicializar com `{ enableHapticFeedback: false }`
2. Executar gestos
3. Verificar vibração

**Resultado Esperado:**
- Sem vibração
- Gestos ainda funcionais

---

### 8. Zoom e Pan

#### TC-3.7.0-029: Aplicar Zoom via API
**Objetivo:** Verificar zoom programático
**Passos:**
1. Chamar `applyZoom('regionId', 2)`
2. Verificar canvas

**Resultado Esperado:**
- Canvas ampliado 2x
- Transform aplicado

---

#### TC-3.7.0-030: Reset Zoom
**Objetivo:** Verificar reset de zoom
**Passos:**
1. Aplicar zoom
2. Chamar `resetZoom('regionId')`
3. Verificar escala

**Resultado Esperado:**
- Zoom volta para 1x
- Canvas em tamanho original

---

#### TC-3.7.0-031: Limite de Zoom
**Objetivo:** Verificar limites
**Passos:**
1. Tentar zoom > 3x
2. Tentar zoom < 0.5x

**Resultado Esperado:**
- Máximo: 3x
- Mínimo: 0.5x
- Valores limitados automaticamente

---

### 9. Viewport

#### TC-3.7.0-032: Prevenir Zoom de Viewport
**Objetivo:** Verificar prevenção de zoom
**Passos:**
1. Inicializar com `{ preventViewportZoom: true }`
2. Tentar pinch zoom na página
3. Verificar comportamento

**Resultado Esperado:**
- Página não faz zoom
- Assinatura responde normalmente

---

#### TC-3.7.0-033: Restaurar Zoom de Viewport
**Objetivo:** Verificar restauração ao destruir
**Passos:**
1. Chamar `destroy('regionId')`
2. Tentar zoom na página

**Resultado Esperado:**
- Zoom da página restaurado
- viewport meta restaurado

---

### 10. Eventos

#### TC-3.7.0-034: Evento de Inicialização
**Objetivo:** Verificar evento init
**Passos:**
1. Adicionar listener
2. Inicializar módulo
3. Verificar evento

**Resultado Esperado:**
- `apexsignature-mobile-initialized` disparado
- `detail.device` contém info do dispositivo
- `detail.options` contém configurações

---

#### TC-3.7.0-035: Evento de Fullscreen Enter
**Objetivo:** Verificar evento ao entrar fullscreen
**Passos:**
1. Adicionar listener
2. Entrar fullscreen
3. Verificar evento

**Resultado Esperado:**
- `apexsignature-mobile-fullscreen-enter` disparado

---

#### TC-3.7.0-036: Evento de Orientação
**Objetivo:** Verificar evento de mudança
**Passos:**
1. Adicionar listener
2. Girar dispositivo
3. Verificar evento

**Resultado Esperado:**
- `apexsignature-mobile-orientation-changed` disparado
- `detail.orientation` atualizado

---

### 11. Responsividade

#### TC-3.7.0-037: Layout em iPhone SE (320px)
**Objetivo:** Verificar layout em tela pequena
**Passos:**
1. Acessar em iPhone SE
2. Verificar componentes

**Resultado Esperado:**
- Todos elementos visíveis
- Canvas adaptado
- Botões acessíveis

---

#### TC-3.7.0-038: Layout em iPad Landscape
**Objetivo:** Verificar layout em tablet grande
**Passos:**
1. Acessar em iPad landscape
2. Verificar área de assinatura

**Resultado Esperado:**
- Área de assinatura ampla
- Boa experiência de uso

---

#### TC-3.7.0-039: Fullscreen com Notch
**Objetivo:** Verificar safe areas
**Dispositivo:** iPhone com notch
**Passos:**
1. Entrar fullscreen
2. Verificar margens

**Resultado Esperado:**
- Respeita safe-area-inset
- Conteúdo não coberto pelo notch

---

### 12. Dark Mode

#### TC-3.7.0-040: Fullscreen em Dark Mode
**Objetivo:** Verificar estilos dark
**Passos:**
1. Ativar dark mode
2. Entrar fullscreen
3. Verificar cores

**Resultado Esperado:**
- Overlay escuro
- Canvas com fundo adaptado
- Textos legíveis

---

### 13. Acessibilidade

#### TC-3.7.0-041: Focus em Botões
**Objetivo:** Verificar estados de foco
**Passos:**
1. Navegar com Tab
2. Verificar indicadores de foco

**Resultado Esperado:**
- Outline visível
- Ordem lógica de navegação

---

#### TC-3.7.0-042: Alto Contraste
**Objetivo:** Verificar modo alto contraste
**Passos:**
1. Ativar alto contraste
2. Verificar fullscreen

**Resultado Esperado:**
- Bordas destacadas
- Canvas com borda visível

---

#### TC-3.7.0-043: Reduced Motion
**Objetivo:** Verificar animações reduzidas
**Passos:**
1. Ativar prefers-reduced-motion
2. Verificar transições

**Resultado Esperado:**
- Sem animações
- Transições instantâneas

---

### 14. Integração

#### TC-3.7.0-044: Integração com Toolbar
**Objetivo:** Verificar compatibilidade com toolbar
**Passos:**
1. Inicializar mobile + toolbar
2. Usar controles da toolbar

**Resultado Esperado:**
- Toolbar funcional
- Gestos não conflitam

---

#### TC-3.7.0-045: Integração com Templates
**Objetivo:** Verificar compatibilidade com templates
**Passos:**
1. Carregar template
2. Usar gestos mobile

**Resultado Esperado:**
- Template carrega normalmente
- Gestos funcionais

---

### 15. Performance

#### TC-3.7.0-046: Desenho Fluido
**Objetivo:** Verificar fluidez ao desenhar
**Passos:**
1. Desenhar rapidamente
2. Verificar responsividade

**Resultado Esperado:**
- Sem lag perceptível
- Traços suaves
- 60fps mantido

---

#### TC-3.7.0-047: Memória em Fullscreen
**Objetivo:** Verificar uso de memória
**Passos:**
1. Entrar/sair fullscreen várias vezes
2. Monitorar memória

**Resultado Esperado:**
- Sem memory leak
- Recursos liberados ao sair

---

---

## Critérios de Aceitação

### Funcionais

| Critério | Métrica |
|----------|---------|
| Detecção de dispositivo | 100% correto |
| Gestos touch | Todos funcionais |
| Fullscreen | Entrada/saída sem erros |
| Stylus | Pressão detectada em dispositivos compatíveis |
| Orientação | Prompt e detecção funcionais |

### Não-Funcionais

| Critério | Métrica |
|----------|---------|
| Touch target mínimo | 44x44px |
| Performance desenho | 60fps |
| Tempo entrada fullscreen | < 300ms |
| Compatibilidade iOS | Safari 17+ |
| Compatibilidade Android | Chrome 120+ |

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
- [ ] Eventos APEX disparando
- [ ] Dark mode em todos módulos

### Dispositivos

- [ ] iPhone Safari
- [ ] iPad Safari
- [ ] Android Chrome
- [ ] Android Samsung Internet
- [ ] Desktop com touch (Surface)

---

## Observações

1. **Haptic Feedback**: Requer permissão do navegador em alguns casos
2. **Orientation Lock**: Nem todos navegadores suportam
3. **Pressure**: Requer hardware compatível (Pencil, S-Pen)
4. **Safe Area**: Essencial para dispositivos com notch

---

**Documento criado por:** Maxwell da Silva Oliveira
**Empresa:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
