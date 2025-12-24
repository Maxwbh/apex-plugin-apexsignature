# APEX Signature - Guia de Otimização Mobile

**Versão:** 3.7.0
**Módulo:** apexsignature-mobile.js

---

## Sumário

1. [Introdução](#introdução)
2. [Instalação](#instalação)
3. [Inicialização](#inicialização)
4. [Detecção de Dispositivo](#detecção-de-dispositivo)
5. [Gestos Touch](#gestos-touch)
6. [Modo Fullscreen](#modo-fullscreen)
7. [Orientação de Tela](#orientação-de-tela)
8. [Suporte a Stylus](#suporte-a-stylus)
9. [Feedback Háptico](#feedback-háptico)
10. [Zoom e Pan](#zoom-e-pan)
11. [API Reference](#api-reference)
12. [Eventos](#eventos)
13. [Casos de Uso](#casos-de-uso)
14. [Boas Práticas](#boas-práticas)

---

## Introdução

O módulo de otimização mobile fornece uma experiência aprimorada para captura de assinaturas em dispositivos móveis e tablets:

- **Gestos Touch**: Swipe para limpar, double-tap para undo, pinch para zoom
- **Modo Fullscreen**: Assinatura em tela cheia para melhor experiência
- **Orientação**: Detecção e sugestão de rotação para landscape
- **Stylus Support**: Suporte a Apple Pencil e S-Pen com sensibilidade de pressão
- **Feedback Háptico**: Vibração como feedback tátil
- **Touch Targets**: Botões maiores para facilitar o toque

---

## Instalação

### Arquivos Necessários

```html
<!-- CSS -->
<link rel="stylesheet" href="#APP_FILES#apexsignature-mobile.css">

<!-- JavaScript -->
<script src="#APP_FILES#apexsignature-mobile.js"></script>
```

### Dependências

- `apexsignature.js` (módulo base)
- `signature_pad.js` v5.0.4+

---

## Inicialização

### Básica

```javascript
// Inicializar otimização mobile
apexSignatureMobile.init('MY_SIGNATURE_REGION');
```

### Com Opções Completas

```javascript
apexSignatureMobile.init('MY_SIGNATURE_REGION', {
    // Gestos
    enablePinchZoom: true,        // Zoom com dois dedos
    swipeLeftToClear: true,       // Swipe esquerda = limpar
    swipeRightToUndo: false,      // Swipe direita = undo
    doubleTapToUndo: true,        // Duplo toque = undo
    longPressToFullscreen: true,  // Pressionar = fullscreen

    // Orientação
    forceLandscape: false,        // Forçar landscape em fullscreen
    showOrientationPrompt: true,  // Mostrar dica de rotação

    // Touch
    optimizeTouchTargets: true,   // Botões maiores
    enableHapticFeedback: true,   // Vibração como feedback

    // Stylus
    enablePressureSensitivity: true,  // Sensibilidade de pressão
    minWidth: 0.5,                    // Espessura mínima
    maxWidth: 2.5,                    // Espessura máxima

    // Viewport
    preventViewportZoom: true,    // Prevenir zoom da página

    // Responsivo
    responsiveWidth: true,        // Canvas responsivo

    // Fullscreen
    enableFullscreen: true,       // Habilitar modo fullscreen
    fullscreenTitle: 'Assine aqui'
});
```

---

## Detecção de Dispositivo

### Verificar Tipo de Dispositivo

```javascript
// É um smartphone?
if (apexSignatureMobile.isMobile()) {
    console.log('Dispositivo mobile detectado');
}

// É um tablet?
if (apexSignatureMobile.isTablet()) {
    console.log('Tablet detectado');
}

// Suporta touch?
if (apexSignatureMobile.hasTouch()) {
    console.log('Touch suportado');
}

// Suporta pressão (stylus)?
if (apexSignatureMobile.hasPressure()) {
    console.log('Stylus com pressão detectado');
}
```

### Informações Detalhadas

```javascript
var deviceInfo = apexSignatureMobile.getDeviceInfo();
console.log(deviceInfo);
// {
//     isMobile: true,
//     isTablet: false,
//     hasTouch: true,
//     hasPressure: true,
//     orientation: 'portrait',
//     viewportScale: 1
// }
```

---

## Gestos Touch

### Gestos Disponíveis

| Gesto | Ação Padrão | Opção |
|-------|-------------|-------|
| Swipe Left | Limpar assinatura | `swipeLeftToClear` |
| Swipe Right | Undo | `swipeRightToUndo` |
| Double Tap | Undo | `doubleTapToUndo` |
| Long Press | Fullscreen | `longPressToFullscreen` |
| Pinch | Zoom | `enablePinchZoom` |

### Configurar Gestos

```javascript
// Habilitar todos os gestos
apexSignatureMobile.init('regionId', {
    swipeLeftToClear: true,
    swipeRightToUndo: true,
    doubleTapToUndo: true,
    longPressToFullscreen: true,
    enablePinchZoom: true
});

// Desabilitar gestos específicos
apexSignatureMobile.init('regionId', {
    swipeLeftToClear: false,  // Não limpar com swipe
    doubleTapToUndo: false    // Não fazer undo com duplo toque
});
```

### Escutar Eventos de Gestos

```javascript
document.getElementById('MY_SIGNATURE').addEventListener('apexsignature-mobile-gesture-clear', function(e) {
    console.log('Gesto de limpar executado');
});

document.getElementById('MY_SIGNATURE').addEventListener('apexsignature-mobile-gesture-undo', function(e) {
    console.log('Gesto de undo executado');
});
```

---

## Modo Fullscreen

### Ativar Fullscreen

```javascript
// Entrar em fullscreen
apexSignatureMobile.enterFullscreen('MY_SIGNATURE_REGION');

// Sair de fullscreen
apexSignatureMobile.exitFullscreen('MY_SIGNATURE_REGION');

// Alternar
apexSignatureMobile.toggleFullscreen('MY_SIGNATURE_REGION');

// Verificar se está em fullscreen
if (apexSignatureMobile.isFullscreen('MY_SIGNATURE_REGION')) {
    console.log('Em modo fullscreen');
}
```

### Eventos de Fullscreen

```javascript
// Quando entra em fullscreen
document.getElementById('MY_SIGNATURE').addEventListener('apexsignature-mobile-fullscreen-enter', function() {
    console.log('Entrou em fullscreen');
});

// Quando sai de fullscreen
document.getElementById('MY_SIGNATURE').addEventListener('apexsignature-mobile-fullscreen-exit', function() {
    console.log('Saiu de fullscreen');
});

// Quando confirma assinatura em fullscreen
document.getElementById('MY_SIGNATURE').addEventListener('apexsignature-mobile-fullscreen-confirmed', function(e) {
    console.log('Assinatura confirmada:', e.detail.dataUrl);
});
```

### Personalização do Fullscreen

```css
/* Customizar título */
.apex-sig-mobile-fullscreen-title {
    color: #0066cc;
}

/* Customizar botões */
.apex-sig-mobile-btn-confirm {
    background: #28a745;
}

/* Customizar canvas */
.apex-sig-mobile-fullscreen-canvas {
    border-radius: 16px;
}
```

---

## Orientação de Tela

### Detectar Orientação

```javascript
var orientation = apexSignatureMobile.getOrientation();
console.log(orientation); // 'portrait' ou 'landscape'
```

### Sugerir Landscape

```javascript
// Mostrar prompt para girar dispositivo
apexSignatureMobile.requestLandscape('MY_SIGNATURE_REGION');
```

### Travar Orientação

```javascript
// Travar em landscape (requer permissão)
apexSignatureMobile.lockOrientation('landscape');

// Destravar
apexSignatureMobile.unlockOrientation();
```

### Evento de Mudança

```javascript
document.getElementById('MY_SIGNATURE').addEventListener('apexsignature-mobile-orientation-changed', function(e) {
    console.log('Nova orientação:', e.detail.orientation);

    if (e.detail.orientation === 'landscape') {
        // Ajustar layout para landscape
    }
});
```

---

## Suporte a Stylus

### Detecção Automática

O módulo detecta automaticamente quando um stylus é usado:

- **Apple Pencil**: iPad Pro, iPad Air, iPad
- **S-Pen**: Samsung Galaxy Tab, Galaxy Note
- **Surface Pen**: Microsoft Surface

### Sensibilidade de Pressão

```javascript
// Configurar sensibilidade
apexSignatureMobile.init('regionId', {
    enablePressureSensitivity: true,
    minWidth: 0.3,  // Traço mais fino
    maxWidth: 3.0   // Traço mais grosso
});
```

### Verificar Suporte

```javascript
if (apexSignatureMobile.hasPressure()) {
    console.log('Stylus com pressão detectado!');
}
```

### Comportamento

| Pressão | Espessura do Traço |
|---------|-------------------|
| Leve (0.1) | Fina |
| Média (0.5) | Normal |
| Forte (1.0) | Grossa |

---

## Feedback Háptico

### Tipos de Vibração

```javascript
// Vibração leve
apexSignatureMobile.triggerHaptic('light');     // 10ms

// Vibração média
apexSignatureMobile.triggerHaptic('medium');    // 25ms

// Vibração forte
apexSignatureMobile.triggerHaptic('heavy');     // 50ms

// Padrão de sucesso
apexSignatureMobile.triggerHaptic('success');   // [10, 50, 10]

// Padrão de erro
apexSignatureMobile.triggerHaptic('error');     // [50, 100, 50]
```

### Desabilitar Vibração

```javascript
apexSignatureMobile.init('regionId', {
    enableHapticFeedback: false
});
```

---

## Zoom e Pan

### Aplicar Zoom

```javascript
// Zoom 2x
apexSignatureMobile.applyZoom('MY_SIGNATURE', 2);

// Obter zoom atual
var currentZoom = apexSignatureMobile.getZoom('MY_SIGNATURE');
console.log(currentZoom); // 2

// Resetar zoom
apexSignatureMobile.resetZoom('MY_SIGNATURE');
```

### Limites de Zoom

- **Mínimo**: 0.5x (50%)
- **Máximo**: 3x (300%)

### Zoom com Pinch

O zoom por pinch é automático quando `enablePinchZoom: true`.

```javascript
document.getElementById('MY_SIGNATURE').addEventListener('apexsignature-mobile-zoom-changed', function(e) {
    console.log('Novo zoom:', e.detail.scale);
});
```

---

## API Reference

### Constantes

```javascript
apexSignatureMobile.VERSION       // "3.7.0"

apexSignatureMobile.BREAKPOINTS
    .MOBILE     // 480
    .TABLET     // 768
    .DESKTOP    // 1024

apexSignatureMobile.GESTURES
    .SWIPE_LEFT
    .SWIPE_RIGHT
    .DOUBLE_TAP
    .LONG_PRESS
    .PINCH

apexSignatureMobile.ORIENTATION
    .PORTRAIT
    .LANDSCAPE
```

### Métodos

| Método | Retorno | Descrição |
|--------|---------|-----------|
| `init(regionId, options)` | Object | Inicializa módulo |
| `destroy(regionId)` | void | Remove módulo |
| `detectDevice()` | Object | Detecta dispositivo |
| `getDeviceInfo()` | Object | Info do dispositivo |
| `isMobile()` | boolean | É mobile? |
| `isTablet()` | boolean | É tablet? |
| `hasTouch()` | boolean | Tem touch? |
| `hasPressure()` | boolean | Tem stylus? |
| `getOrientation()` | string | Orientação atual |
| `enterFullscreen(regionId)` | void | Entra fullscreen |
| `exitFullscreen(regionId)` | void | Sai fullscreen |
| `toggleFullscreen(regionId)` | void | Alterna fullscreen |
| `isFullscreen(regionId)` | boolean | Está em fullscreen? |
| `applyZoom(regionId, scale)` | void | Aplica zoom |
| `resetZoom(regionId)` | void | Reset zoom |
| `getZoom(regionId)` | number | Zoom atual |
| `lockOrientation(orientation)` | void | Trava orientação |
| `unlockOrientation()` | void | Destrava orientação |
| `requestLandscape(regionId)` | void | Sugere landscape |
| `triggerHaptic(type)` | void | Dispara vibração |
| `getInstance(regionId)` | Object | Instância |

---

## Eventos

### Lista de Eventos

| Evento | Dados | Descrição |
|--------|-------|-----------|
| `apexsignature-mobile-initialized` | `{ device, options }` | Módulo inicializado |
| `apexsignature-mobile-gesture-clear` | `{ gesture }` | Gesto de limpar |
| `apexsignature-mobile-gesture-undo` | `{ gesture }` | Gesto de undo |
| `apexsignature-mobile-gesture-fullscreen` | `{ gesture }` | Gesto de fullscreen |
| `apexsignature-mobile-gesture-zoom` | `{ gesture }` | Gesto de zoom |
| `apexsignature-mobile-fullscreen-enter` | `{}` | Entrou fullscreen |
| `apexsignature-mobile-fullscreen-exit` | `{}` | Saiu fullscreen |
| `apexsignature-mobile-fullscreen-confirmed` | `{ dataUrl }` | Assinatura confirmada |
| `apexsignature-mobile-orientation-changed` | `{ orientation }` | Orientação mudou |
| `apexsignature-mobile-zoom-changed` | `{ scale }` | Zoom mudou |
| `apexsignature-mobile-resize` | `{ width, height, orientation }` | Redimensionado |
| `apexsignature-mobile-destroyed` | `{}` | Módulo destruído |

---

## Casos de Uso

### 1. Aplicativo de Vendas Mobile

```javascript
// Otimizado para vendedores em campo
apexSignatureMobile.init('SIGNATURE_REGION', {
    // Fullscreen obrigatório
    longPressToFullscreen: true,
    enableFullscreen: true,
    forceLandscape: true,

    // Gestos para produtividade
    swipeLeftToClear: true,
    doubleTapToUndo: true,

    // Feedback tátil
    enableHapticFeedback: true,

    // Touch targets grandes
    optimizeTouchTargets: true
});

// Abrir fullscreen automaticamente
if (apexSignatureMobile.isMobile()) {
    apexSignatureMobile.enterFullscreen('SIGNATURE_REGION');
}
```

### 2. Tablet com Stylus (Assinatura Formal)

```javascript
// Otimizado para iPad Pro + Apple Pencil
apexSignatureMobile.init('SIGNATURE_REGION', {
    // Stylus com pressão
    enablePressureSensitivity: true,
    minWidth: 0.3,
    maxWidth: 3.5,

    // Desabilitar gestos acidentais
    swipeLeftToClear: false,
    doubleTapToUndo: false,

    // Zoom para detalhes
    enablePinchZoom: true
});
```

### 3. Quiosque de Auto-Atendimento

```javascript
// Configuração para quiosque touch
apexSignatureMobile.init('SIGNATURE_REGION', {
    // Sem gestos - só botões
    swipeLeftToClear: false,
    swipeRightToUndo: false,
    doubleTapToUndo: false,
    longPressToFullscreen: false,
    enablePinchZoom: false,

    // Botões grandes e acessíveis
    optimizeTouchTargets: true,

    // Sem fullscreen
    enableFullscreen: false,

    // Feedback para confirmar toque
    enableHapticFeedback: true
});
```

### 4. Formulário Responsivo

```javascript
// Detectar e adaptar automaticamente
if (apexSignatureMobile.isMobile()) {
    apexSignatureMobile.init('SIGNATURE_REGION', {
        showOrientationPrompt: true,
        longPressToFullscreen: true,
        optimizeTouchTargets: true
    });
} else if (apexSignatureMobile.isTablet()) {
    apexSignatureMobile.init('SIGNATURE_REGION', {
        enablePressureSensitivity: true,
        enablePinchZoom: true
    });
}
// Desktop: não inicializa módulo mobile
```

---

## Boas Práticas

### 1. Detecção Correta

```javascript
// Sempre verificar antes de aplicar otimizações
if (apexSignatureMobile.hasTouch()) {
    apexSignatureMobile.init('regionId');
}
```

### 2. Orientação

```javascript
// Sugerir, não forçar
apexSignatureMobile.init('regionId', {
    showOrientationPrompt: true,
    forceLandscape: false  // Deixar usuário decidir
});
```

### 3. Gestos Intuitivos

```javascript
// Manter gestos padrão que usuários conhecem
apexSignatureMobile.init('regionId', {
    swipeLeftToClear: true,   // Comum em apps
    doubleTapToUndo: true,    // Intuitivo
    enablePinchZoom: true     // Esperado em mobile
});
```

### 4. Performance

```javascript
// Destruir quando não necessário
window.addEventListener('beforeunload', function() {
    apexSignatureMobile.destroy('regionId');
});
```

### 5. Acessibilidade

```javascript
// Garantir que funções também estejam em botões
// Não depender apenas de gestos
<button onclick="apexSignature.clear('regionId')">Limpar</button>
<button onclick="apexSignatureMobile.enterFullscreen('regionId')">Tela Cheia</button>
```

### 6. Safe Areas (Notch)

O CSS já considera safe areas automaticamente para dispositivos com notch.

---

## Compatibilidade

| Dispositivo/Navegador | Status |
|----------------------|--------|
| iPhone + Safari | Completo |
| iPad + Safari | Completo |
| Android + Chrome | Completo |
| Samsung Internet | Completo |
| iPad + Apple Pencil | Pressão OK |
| Galaxy Tab + S-Pen | Pressão OK |
| Surface + Pen | Pressão OK |

---

**Autor:** Maxwell da Silva Oliveira
**Empresa:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
