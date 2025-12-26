# Plano de Testes - APEX Signature v3.5.0
## Initials Mode (Modo de Rubricas)

**Versão:** 3.5.0
**Data:** 2025-12-24
**Autor:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**LinkedIn:** /maxwbh

---

## Resumo

Este documento descreve os casos de teste para a funcionalidade de **Initials Mode** (Modo de Rubricas) do plugin APEX Signature v3.5.0.

### Funcionalidades Testadas

- Modo Draw: desenhar iniciais
- Modo Type: digitar iniciais
- Auto-geração de iniciais a partir do nome
- Seleção de fontes para modo Type
- Validação de iniciais
- Confirmação e captura de dados

---

## Ambiente de Teste

| Item | Requisito |
|------|-----------|
| Oracle Database | 19c / 21c / 23ai |
| Oracle APEX | 19.2 - 24.2 |
| Navegadores | Chrome 120+, Firefox 120+, Safari 17+, Edge 120+ |
| Dispositivos | Desktop, Tablet, Mobile |

---

## Casos de Teste

### 1. Inicialização do Módulo

#### TC-3.5-001: Inicialização básica
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar inicialização correta do módulo |
| **Pré-condição** | Região configurada |
| **Passos** | 1. Carregar página APEX |
| **Resultado Esperado** | Componente de iniciais exibido com tabs Draw/Type |
| **Status** | ⬜ Pendente |

#### TC-3.5-002: Inicialização com nome completo
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar auto-geração de iniciais |
| **Pré-condição** | fullName = 'Maxwell da Silva' |
| **Passos** | 1. Carregar página |
| **Resultado Esperado** | Iniciais "MDS" geradas automaticamente |
| **Status** | ⬜ Pendente |

#### TC-3.5-003: Inicialização no modo Type
| Item | Descrição |
|------|-----------|
| **Objetivo** | Iniciar no modo Type |
| **Pré-condição** | mode = 'type' |
| **Passos** | 1. Carregar página |
| **Resultado Esperado** | Tab Type ativo, campo de input visível |
| **Status** | ⬜ Pendente |

#### TC-3.5-004: Evento de inicialização
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-initials-initialized |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Carregar página |
| **Resultado Esperado** | Evento disparado com version, mode, generatedInitials |
| **Status** | ⬜ Pendente |

---

### 2. Modo Draw

#### TC-3.5-005: Desenhar iniciais
| Item | Descrição |
|------|-----------|
| **Objetivo** | Desenhar iniciais no canvas |
| **Pré-condição** | Modo Draw ativo |
| **Passos** | 1. Desenhar no canvas |
| **Resultado Esperado** | Traços desenhados visíveis |
| **Status** | ⬜ Pendente |

#### TC-3.5-006: Canvas compacto
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar dimensões do canvas |
| **Pré-condição** | Configuração padrão |
| **Passos** | 1. Inspecionar canvas |
| **Resultado Esperado** | Canvas 150x80px (compacto) |
| **Status** | ⬜ Pendente |

#### TC-3.5-007: Canvas customizado
| Item | Descrição |
|------|-----------|
| **Objetivo** | Usar dimensões customizadas |
| **Pré-condição** | width: 200, height: 100 |
| **Passos** | 1. Carregar página |
| **Resultado Esperado** | Canvas com 200x100px |
| **Status** | ⬜ Pendente |

#### TC-3.5-008: Cor da caneta customizada
| Item | Descrição |
|------|-----------|
| **Objetivo** | Usar cor customizada |
| **Pré-condição** | penColor: '#0066cc' |
| **Passos** | 1. Desenhar iniciais |
| **Resultado Esperado** | Traços em azul |
| **Status** | ⬜ Pendente |

#### TC-3.5-009: Limpar canvas
| Item | Descrição |
|------|-----------|
| **Objetivo** | Limpar desenho |
| **Pré-condição** | Iniciais desenhadas |
| **Passos** | 1. Clicar em Clear |
| **Resultado Esperado** | Canvas limpo |
| **Status** | ⬜ Pendente |

---

### 3. Modo Type

#### TC-3.5-010: Digitar iniciais
| Item | Descrição |
|------|-----------|
| **Objetivo** | Digitar iniciais no campo |
| **Pré-condição** | Modo Type ativo |
| **Passos** | 1. Digitar "AB" |
| **Resultado Esperado** | Texto convertido para maiúsculas, preview atualizado |
| **Status** | ⬜ Pendente |

#### TC-3.5-011: Limite de caracteres
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar limite de 4 caracteres |
| **Pré-condição** | maxLength padrão (4) |
| **Passos** | 1. Tentar digitar "ABCDE" |
| **Resultado Esperado** | Apenas "ABCD" aceito |
| **Status** | ⬜ Pendente |

#### TC-3.5-012: Selecionar fonte Script
| Item | Descrição |
|------|-----------|
| **Objetivo** | Alterar fonte para Script |
| **Pré-condição** | Modo Type ativo |
| **Passos** | 1. Selecionar "Script" no dropdown |
| **Resultado Esperado** | Preview atualizado com fonte Dancing Script |
| **Status** | ⬜ Pendente |

#### TC-3.5-013: Selecionar fonte Elegant
| Item | Descrição |
|------|-----------|
| **Objetivo** | Alterar fonte para Elegant |
| **Pré-condição** | Modo Type ativo |
| **Passos** | 1. Selecionar "Elegant" no dropdown |
| **Resultado Esperado** | Preview atualizado com fonte Great Vibes |
| **Status** | ⬜ Pendente |

#### TC-3.5-014: Selecionar fonte Classic
| Item | Descrição |
|------|-----------|
| **Objetivo** | Alterar fonte para Classic |
| **Pré-condição** | Modo Type ativo |
| **Passos** | 1. Selecionar "Classic" no dropdown |
| **Resultado Esperado** | Preview atualizado com fonte Allura |
| **Status** | ⬜ Pendente |

#### TC-3.5-015: Preview em tempo real
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar atualização do preview |
| **Pré-condição** | Modo Type ativo |
| **Passos** | 1. Digitar letra por letra |
| **Resultado Esperado** | Preview atualiza a cada digitação |
| **Status** | ⬜ Pendente |

#### TC-3.5-016: Limpar campo digitado
| Item | Descrição |
|------|-----------|
| **Objetivo** | Limpar texto digitado |
| **Pré-condição** | Texto digitado |
| **Passos** | 1. Clicar em Clear |
| **Resultado Esperado** | Campo e preview limpos |
| **Status** | ⬜ Pendente |

---

### 4. Auto-Geração de Iniciais

#### TC-3.5-017: Gerar de nome simples
| Item | Descrição |
|------|-----------|
| **Objetivo** | Gerar iniciais de nome simples |
| **Pré-condição** | fullName = 'John Doe' |
| **Passos** | 1. Verificar iniciais geradas |
| **Resultado Esperado** | Iniciais "JD" |
| **Status** | ⬜ Pendente |

#### TC-3.5-018: Gerar de nome composto
| Item | Descrição |
|------|-----------|
| **Objetivo** | Gerar iniciais de nome composto |
| **Pré-condição** | fullName = 'Maria da Silva Santos' |
| **Passos** | 1. Verificar iniciais geradas |
| **Resultado Esperado** | Iniciais "MDSS" (max 4) |
| **Status** | ⬜ Pendente |

#### TC-3.5-019: Botão de auto-preenchimento
| Item | Descrição |
|------|-----------|
| **Objetivo** | Usar botão estrela para auto-preencher |
| **Pré-condição** | fullName configurado |
| **Passos** | 1. Clicar no botão estrela |
| **Resultado Esperado** | Campo preenchido com iniciais geradas |
| **Status** | ⬜ Pendente |

#### TC-3.5-020: Alterar nome via API
| Item | Descrição |
|------|-----------|
| **Objetivo** | Alterar nome programaticamente |
| **Pré-condição** | Módulo inicializado |
| **Passos** | 1. Chamar setFullName('New Name') |
| **Resultado Esperado** | Novas iniciais calculadas |
| **Status** | ⬜ Pendente |

---

### 5. Alternância de Modos

#### TC-3.5-021: Alternar Draw para Type
| Item | Descrição |
|------|-----------|
| **Objetivo** | Trocar de Draw para Type |
| **Pré-condição** | Modo Draw ativo |
| **Passos** | 1. Clicar na tab Type |
| **Resultado Esperado** | Painel Type visível, tab Type ativo |
| **Status** | ⬜ Pendente |

#### TC-3.5-022: Alternar Type para Draw
| Item | Descrição |
|------|-----------|
| **Objetivo** | Trocar de Type para Draw |
| **Pré-condição** | Modo Type ativo |
| **Passos** | 1. Clicar na tab Draw |
| **Resultado Esperado** | Painel Draw visível, tab Draw ativo |
| **Status** | ⬜ Pendente |

#### TC-3.5-023: Evento mode-changed
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar evento ao trocar modo |
| **Pré-condição** | DA configurada |
| **Passos** | 1. Trocar de modo |
| **Resultado Esperado** | Evento disparado com novo mode |
| **Status** | ⬜ Pendente |

#### TC-3.5-024: Alternar via API
| Item | Descrição |
|------|-----------|
| **Objetivo** | Trocar modo programaticamente |
| **Pré-condição** | Módulo inicializado |
| **Passos** | 1. Chamar setMode('type') |
| **Resultado Esperado** | Modo alterado para Type |
| **Status** | ⬜ Pendente |

---

### 6. Validação

#### TC-3.5-025: Validar iniciais vazias (required)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Validar quando required=true |
| **Pré-condição** | required: true |
| **Passos** | 1. Clicar em Confirm sem desenhar |
| **Resultado Esperado** | Mensagem de erro "Please draw your initials" |
| **Status** | ⬜ Pendente |

#### TC-3.5-026: Validar mínimo de traços
| Item | Descrição |
|------|-----------|
| **Objetivo** | Validar minStrokes |
| **Pré-condição** | minStrokes: 2 |
| **Passos** | 1. Fazer apenas 1 traço 2. Verificar validação |
| **Resultado Esperado** | Mensagem indicando mínimo de traços |
| **Status** | ⬜ Pendente |

#### TC-3.5-027: Validar campo vazio (Type)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Validar campo vazio no modo Type |
| **Pré-condição** | required: true, modo Type |
| **Passos** | 1. Deixar campo vazio 2. Confirmar |
| **Resultado Esperado** | Mensagem de erro |
| **Status** | ⬜ Pendente |

#### TC-3.5-028: Validação passa
| Item | Descrição |
|------|-----------|
| **Objetivo** | Validação bem-sucedida |
| **Pré-condição** | Iniciais válidas |
| **Passos** | 1. Desenhar/digitar iniciais 2. Confirmar |
| **Resultado Esperado** | Mensagem de sucesso |
| **Status** | ⬜ Pendente |

---

### 7. Confirmação

#### TC-3.5-029: Confirmar iniciais desenhadas
| Item | Descrição |
|------|-----------|
| **Objetivo** | Confirmar iniciais no modo Draw |
| **Pré-condição** | Iniciais desenhadas |
| **Passos** | 1. Clicar em Confirm |
| **Resultado Esperado** | Evento initials-confirmed, dados capturados |
| **Status** | ⬜ Pendente |

#### TC-3.5-030: Confirmar iniciais digitadas
| Item | Descrição |
|------|-----------|
| **Objetivo** | Confirmar iniciais no modo Type |
| **Pré-condição** | Iniciais digitadas |
| **Passos** | 1. Clicar em Confirm |
| **Resultado Esperado** | Evento initials-confirmed, dados capturados |
| **Status** | ⬜ Pendente |

#### TC-3.5-031: Evento initials-confirmed
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar dados do evento |
| **Pré-condição** | DA configurada |
| **Passos** | 1. Confirmar iniciais |
| **Resultado Esperado** | Evento com mode e data (dataURL) |
| **Status** | ⬜ Pendente |

#### TC-3.5-032: Obter dados confirmados
| Item | Descrição |
|------|-----------|
| **Objetivo** | Obter dados via API |
| **Pré-condição** | Iniciais confirmadas |
| **Passos** | 1. Chamar getConfirmedData() |
| **Resultado Esperado** | DataURL retornado |
| **Status** | ⬜ Pendente |

---

### 8. API Methods

#### TC-3.5-033: isEmpty()
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar se está vazio |
| **Pré-condição** | Canvas limpo |
| **Passos** | 1. Chamar isEmpty() |
| **Resultado Esperado** | Retorna true |
| **Status** | ⬜ Pendente |

#### TC-3.5-034: getMode()
| Item | Descrição |
|------|-----------|
| **Objetivo** | Obter modo atual |
| **Pré-condição** | Modo Draw ativo |
| **Passos** | 1. Chamar getMode() |
| **Resultado Esperado** | Retorna 'draw' |
| **Status** | ⬜ Pendente |

#### TC-3.5-035: getInitialsData()
| Item | Descrição |
|------|-----------|
| **Objetivo** | Obter dados como dataURL |
| **Pré-condição** | Iniciais existentes |
| **Passos** | 1. Chamar getInitialsData(regionId, callback) |
| **Resultado Esperado** | Callback com dataURL |
| **Status** | ⬜ Pendente |

#### TC-3.5-036: setPenColor()
| Item | Descrição |
|------|-----------|
| **Objetivo** | Alterar cor da caneta |
| **Pré-condição** | Módulo inicializado |
| **Passos** | 1. Chamar setPenColor('#ff0000') |
| **Resultado Esperado** | Próximos traços em vermelho |
| **Status** | ⬜ Pendente |

#### TC-3.5-037: clear()
| Item | Descrição |
|------|-----------|
| **Objetivo** | Limpar via API |
| **Pré-condição** | Iniciais existentes |
| **Passos** | 1. Chamar clear() |
| **Resultado Esperado** | Canvas/campo limpo |
| **Status** | ⬜ Pendente |

---

### 9. Eventos

#### TC-3.5-038: Evento initials-cleared
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar evento ao limpar |
| **Pré-condição** | DA configurada |
| **Passos** | 1. Limpar iniciais |
| **Resultado Esperado** | Evento disparado com mode |
| **Status** | ⬜ Pendente |

---

### 10. Responsividade

#### TC-3.5-039: Layout em desktop
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar layout em desktop |
| **Pré-condição** | Viewport > 768px |
| **Passos** | 1. Visualizar componente |
| **Resultado Esperado** | Layout compacto inline |
| **Status** | ⬜ Pendente |

#### TC-3.5-040: Layout em mobile
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar layout em mobile |
| **Pré-condição** | Viewport < 480px |
| **Passos** | 1. Visualizar componente |
| **Resultado Esperado** | Layout empilhado, tabs full-width |
| **Status** | ⬜ Pendente |

#### TC-3.5-041: Touch em canvas
| Item | Descrição |
|------|-----------|
| **Objetivo** | Desenhar com toque |
| **Pré-condição** | Dispositivo touch |
| **Passos** | 1. Desenhar com dedo |
| **Resultado Esperado** | Traços registrados |
| **Status** | ⬜ Pendente |

---

### 11. Dark Mode

#### TC-3.5-042: Dark mode Universal Theme
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar estilos em dark mode |
| **Pré-condição** | Tema escuro ativado |
| **Passos** | 1. Ativar dark mode |
| **Resultado Esperado** | Cores adaptadas para tema escuro |
| **Status** | ⬜ Pendente |

---

### 12. Acessibilidade

#### TC-3.5-043: Navegação por teclado
| Item | Descrição |
|------|-----------|
| **Objetivo** | Navegar com Tab |
| **Pré-condição** | Componente visível |
| **Passos** | 1. Usar Tab para navegar |
| **Resultado Esperado** | Foco visível em todos os elementos |
| **Status** | ⬜ Pendente |

#### TC-3.5-044: Atributos ARIA
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar atributos ARIA |
| **Pré-condição** | Componente renderizado |
| **Passos** | 1. Inspecionar elementos |
| **Resultado Esperado** | aria-label presentes |
| **Status** | ⬜ Pendente |

---

### 13. Integração

#### TC-3.5-045: Uso com Timestamp
| Item | Descrição |
|------|-----------|
| **Objetivo** | Iniciais com timestamp |
| **Pré-condição** | Timestamp module ativo |
| **Passos** | 1. Confirmar iniciais |
| **Resultado Esperado** | Pode combinar com timestamp |
| **Status** | ⬜ Pendente |

---

## Critérios de Aceitação

| Critério | Descrição |
|----------|-----------|
| Funcionalidade | Todos os casos de teste passam |
| Desempenho | Renderização < 100ms |
| Acessibilidade | WCAG 2.1 AA compliance |
| Responsividade | Funcional em todos os breakpoints |
| Compatibilidade | Funciona em todos os navegadores suportados |

---

## Notas de Teste

### Configuração de Teste

```javascript
apexSignatureInitials.init('REGION_ID', {
    mode: 'draw',
    fullName: 'Maxwell da Silva Oliveira',
    width: 150,
    height: 80,
    required: true,
    minStrokes: 1,
    maxLength: 4,
    penColor: '#000000',
    backgroundColor: '#ffffff',
    title: 'Initials',
    drawLabel: 'Draw',
    typeLabel: 'Type',
    clearLabel: 'Clear',
    confirmLabel: 'Confirm'
});
```

### Comandos Úteis (Console)

```javascript
// Verificar modo atual
apexSignatureInitials.getMode('REGION_ID');

// Verificar se está vazio
apexSignatureInitials.isEmpty('REGION_ID');

// Obter dados
apexSignatureInitials.getInitialsData('REGION_ID', function(data) {
    console.log('Data:', data);
});

// Obter dados confirmados
apexSignatureInitials.getConfirmedData('REGION_ID');

// Limpar
apexSignatureInitials.clear('REGION_ID');

// Alterar modo
apexSignatureInitials.setMode('REGION_ID', 'type');

// Alterar cor
apexSignatureInitials.setPenColor('REGION_ID', '#0066cc');
```

---

**Total de Casos de Teste:** 45

**Autor:** Maxwell da Silva Oliveira
**Empresa:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
