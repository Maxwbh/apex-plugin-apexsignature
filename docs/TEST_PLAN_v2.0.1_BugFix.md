# Plano de Teste - APEX Signature v2.0.1

## Task 2: Correção Bug #20/#21 - Evento Dynamic Action

**Data:** 2025-12-15
**Responsável:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**LinkedIn:** /maxwbh

---

## 1. Descrição do Bug

### Issue #20 / #21
**Problema:** O evento `apexsignature-saved-db` não dispara corretamente para Dynamic Actions configuradas na página APEX.

**Causa Raiz:**
- O método `apex.event.trigger()` não estava sendo chamado corretamente
- Falta de propagação de eventos (bubbling)
- Timing issues entre callback AJAX e trigger do evento

---

## 2. Correções Implementadas

### 2.1 Novo Método `triggerEvent()`
```javascript
apexSignature.triggerEvent(pRegionId, pEventName, pData)
```

Este método utiliza **3 abordagens** para garantir compatibilidade:

1. **apex.event.trigger()** - Método nativo APEX (preferido)
2. **jQuery.trigger()** - Para compatibilidade com versões antigas
3. **CustomEvent** - Para navegadores modernos

### 2.2 setTimeout no Callback AJAX
Adicionado delay de 10ms para garantir que:
- O DOM está pronto
- Os event handlers estão registrados
- O evento propaga corretamente

### 2.3 Event Bubbling
CustomEvent criado com `bubbles: true` para propagação correta.

---

## 3. Casos de Teste

### CT-01: Dynamic Action - Custom Event (apexsignature-saved-db)

| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar se DA dispara após salvar assinatura |
| **Pré-condição** | Plugin configurado com botão Save |
| **Configuração DA** | Event: Custom, Name: `apexsignature-saved-db`, Selection Type: Region |
| **Passos** | 1. Criar DA no APEX Page Designer<br>2. Configurar True Action: Execute JavaScript Code<br>3. Código: `console.log('DA Fired!', this.data);`<br>4. Desenhar assinatura<br>5. Clicar em Salvar |
| **Resultado Esperado** | Console exibe "DA Fired!" com dados |
| **Critério de Aceite** | DA executa em 100% das tentativas |

### CT-02: Dynamic Action - Múltiplos Eventos

| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar todos os eventos disponíveis |
| **Eventos para testar** | `apexsignature-saved-db`<br>`apexsignature-error-db`<br>`apexsignature-cleared`<br>`apexsignature-stroke-begin`<br>`apexsignature-stroke-end`<br>`apexsignature-initialized` |
| **Passos** | Para cada evento:<br>1. Criar DA correspondente<br>2. Executar ação que dispara o evento<br>3. Verificar se DA executa |
| **Resultado Esperado** | Todos os eventos disparam suas DAs |
| **Critério de Aceite** | 100% dos eventos funcionando |

### CT-03: Primeiro Salvamento

| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar se evento dispara no PRIMEIRO save (não apenas nos subsequentes) |
| **Pré-condição** | Página recém-carregada |
| **Passos** | 1. Carregar página<br>2. Desenhar assinatura<br>3. Clicar em Salvar (primeira vez)<br>4. Verificar se DA executou |
| **Resultado Esperado** | DA dispara no primeiro salvamento |
| **Critério de Aceite** | Evento dispara já na primeira tentativa |

### CT-04: Salvamentos Consecutivos

| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar se evento dispara em múltiplos saves seguidos |
| **Passos** | 1. Salvar assinatura 1<br>2. Salvar assinatura 2<br>3. Salvar assinatura 3<br>4. Verificar contador de DAs executadas |
| **Resultado Esperado** | DA dispara 3 vezes |
| **Critério de Aceite** | Cada save dispara exatamente 1 evento |

### CT-05: Dados do Evento

| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar se dados do evento estão corretos |
| **Código DA** | `console.log(this.data);` |
| **Passos** | 1. Configurar DA com código acima<br>2. Salvar assinatura |
| **Resultado Esperado** | Objeto com: `regionId`, `data`, `success: true`, `base64Length` |
| **Critério de Aceite** | Todos os campos presentes e corretos |

### CT-06: Compatibilidade APEX Versions

| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar funcionamento em diferentes versões APEX |
| **Versões** | APEX 19.2, 20.2, 21.2, 22.2, 23.2, 24.2 |
| **Passos** | Repetir CT-01 em cada versão |
| **Resultado Esperado** | DA dispara em todas as versões |
| **Critério de Aceite** | 100% compatibilidade |

### CT-07: Event via JavaScript (sem DA)

| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar se eventos podem ser capturados via JS puro |
| **Código Teste** | ```javascript
document.getElementById('REGION_ID').addEventListener('apexsignature-saved-db', function(e) {
    console.log('Native event:', e.detail);
});
``` |
| **Passos** | 1. Adicionar código na página<br>2. Salvar assinatura |
| **Resultado Esperado** | Console exibe detalhes do evento |
| **Critério de Aceite** | CustomEvent funciona |

### CT-08: jQuery Event Binding

| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar compatibilidade com jQuery.on() |
| **Código Teste** | ```javascript
$('#REGION_ID').on('apexsignature-saved-db', function(e, data) {
    console.log('jQuery event:', data);
});
``` |
| **Passos** | 1. Adicionar código na página<br>2. Salvar assinatura |
| **Resultado Esperado** | Console exibe dados do evento |
| **Critério de Aceite** | jQuery binding funciona |

---

## 4. Matriz de Teste

| Teste | APEX 19.2 | APEX 21.2 | APEX 23.2 | APEX 24.2 |
|-------|:---------:|:---------:|:---------:|:---------:|
| CT-01 | [ ] | [ ] | [ ] | [ ] |
| CT-02 | [ ] | [ ] | [ ] | [ ] |
| CT-03 | [ ] | [ ] | [ ] | [ ] |
| CT-04 | [ ] | [ ] | [ ] | [ ] |
| CT-05 | [ ] | [ ] | [ ] | [ ] |
| CT-06 | N/A | N/A | N/A | N/A |
| CT-07 | [ ] | [ ] | [ ] | [ ] |
| CT-08 | [ ] | [ ] | [ ] | [ ] |

---

## 5. Código de Exemplo para Dynamic Action

### Configuração no Page Designer:

1. **Criar Dynamic Action:**
   - Name: `On Signature Saved`
   - Event: `Custom`
   - Custom Event: `apexsignature-saved-db`
   - Selection Type: `Region`
   - Region: `[Sua região Signature]`

2. **True Action:**
   - Action: `Execute JavaScript Code`
   - Code:
   ```javascript
   // Acessar dados do evento
   var eventData = this.data;

   // Mostrar mensagem de sucesso
   apex.message.showPageSuccess('Assinatura salva com sucesso!');

   // Log para debug
   console.log('Signature saved:', {
       regionId: eventData.regionId,
       success: eventData.success,
       dataLength: eventData.base64Length
   });
   ```

---

## 6. Troubleshooting

### Se o evento não disparar:

1. **Verificar Region Static ID:**
   - Certifique-se que o Static ID da região está configurado
   - O Static ID deve corresponder ao usado na DA

2. **Verificar Selection Type:**
   - Use "Region" e selecione a região correta
   - Ou use "jQuery Selector" com `#STATIC_ID`

3. **Habilitar Logging:**
   - Defina atributo "Logging" como `true`
   - Verifique console para mensagens de debug

4. **Verificar Console:**
   - Procure por erros JavaScript
   - Verifique se `apexSignature.triggerEvent` aparece nos logs

---

## 7. Notas de Implementação

### Arquivos Modificados:
- `server/js/apexsignature.js` - Adicionado método `triggerEvent()` e correções
- `server/js/apexsignature.min.js` - Versão minificada atualizada
- `apexplugin.json` - Versão atualizada para 2.0.1

### Mudanças de API:
- Novo método público: `apexSignature.triggerEvent(regionId, eventName, data)`
- Novo evento: `apexsignature-initialized`

### Backward Compatibility:
- Mantida - eventos jQuery continuam funcionando
- Código existente não precisa de alterações

---

**Aprovado por:** ________________________
**Data:** ________________________
