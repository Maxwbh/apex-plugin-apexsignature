# Plano de Testes - APEX Signature v3.3.0
## Enhanced Customization Toolbar

**Versão:** 3.3.0
**Data:** 2025-12-24
**Autor:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**LinkedIn:** /maxwbh

---

## Resumo

Este documento descreve os casos de teste para a funcionalidade de **Enhanced Customization Toolbar** (Barra de Ferramentas de Personalização) do plugin APEX Signature v3.3.0.

### Funcionalidades Testadas

- Seleção de cor da caneta (presets e picker)
- Controle de espessura da linha
- Modo borracha (Eraser)
- Undo/Redo de traços
- Persistência de preferências
- Atalhos de teclado

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

#### TC-3.3-001: Inicialização básica
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar inicialização correta do módulo de toolbar |
| **Pré-condição** | Região de assinatura configurada |
| **Passos** | 1. Carregar página APEX com região de assinatura |
| **Resultado Esperado** | Toolbar exibida com seções de cor, espessura e ferramentas |
| **Status** | ⬜ Pendente |

#### TC-3.3-002: Carregamento de preferências
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar carregamento de preferências salvas |
| **Pré-condição** | Preferências previamente salvas no localStorage |
| **Passos** | 1. Configurar cor/espessura 2. Recarregar página |
| **Resultado Esperado** | Cor e espessura restauradas das preferências |
| **Status** | ⬜ Pendente |

#### TC-3.3-003: Evento de inicialização
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-toolbar-initialized |
| **Pré-condição** | Dynamic Action configurada para o evento |
| **Passos** | 1. Carregar página |
| **Resultado Esperado** | Evento disparado com version, color e width |
| **Status** | ⬜ Pendente |

---

### 2. Seleção de Cor

#### TC-3.3-004: Selecionar cor preset (Preto)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Selecionar cor preta do preset |
| **Pré-condição** | Toolbar inicializada |
| **Passos** | 1. Clicar no botão de cor preta |
| **Resultado Esperado** | Cor alterada, botão marcado como ativo |
| **Status** | ⬜ Pendente |

#### TC-3.3-005: Selecionar cor preset (Azul)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Selecionar cor azul do preset |
| **Pré-condição** | Toolbar inicializada |
| **Passos** | 1. Clicar no botão de cor azul |
| **Resultado Esperado** | Cor alterada para #0066cc |
| **Status** | ⬜ Pendente |

#### TC-3.3-006: Selecionar cor preset (Vermelho)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Selecionar cor vermelha do preset |
| **Pré-condição** | Toolbar inicializada |
| **Passos** | 1. Clicar no botão de cor vermelha |
| **Resultado Esperado** | Cor alterada para #cc0000 |
| **Status** | ⬜ Pendente |

#### TC-3.3-007: Usar color picker
| Item | Descrição |
|------|-----------|
| **Objetivo** | Selecionar cor personalizada |
| **Pré-condição** | Toolbar inicializada |
| **Passos** | 1. Clicar no color picker 2. Selecionar cor #ff6600 |
| **Resultado Esperado** | Cor alterada para a cor selecionada |
| **Status** | ⬜ Pendente |

#### TC-3.3-008: Desenhar com nova cor
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar que desenho usa a cor selecionada |
| **Pré-condição** | Cor azul selecionada |
| **Passos** | 1. Desenhar assinatura |
| **Resultado Esperado** | Traço desenhado em azul |
| **Status** | ⬜ Pendente |

#### TC-3.3-009: Evento color-changed
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-color-changed |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Alterar cor |
| **Resultado Esperado** | Evento disparado com a nova cor |
| **Status** | ⬜ Pendente |

---

### 3. Controle de Espessura

#### TC-3.3-010: Ajustar espessura mínima
| Item | Descrição |
|------|-----------|
| **Objetivo** | Definir espessura mínima (0.5px) |
| **Pré-condição** | Toolbar inicializada |
| **Passos** | 1. Mover slider para mínimo |
| **Resultado Esperado** | Valor exibido "0.5px", traço fino |
| **Status** | ⬜ Pendente |

#### TC-3.3-011: Ajustar espessura máxima
| Item | Descrição |
|------|-----------|
| **Objetivo** | Definir espessura máxima (5.0px) |
| **Pré-condição** | Toolbar inicializada |
| **Passos** | 1. Mover slider para máximo |
| **Resultado Esperado** | Valor exibido "5.0px", traço grosso |
| **Status** | ⬜ Pendente |

#### TC-3.3-012: Ajustar espessura intermediária
| Item | Descrição |
|------|-----------|
| **Objetivo** | Definir espessura intermediária (2.5px) |
| **Pré-condição** | Toolbar inicializada |
| **Passos** | 1. Mover slider para 2.5 |
| **Resultado Esperado** | Valor exibido "2.5px" |
| **Status** | ⬜ Pendente |

#### TC-3.3-013: Desenhar com espessura alterada
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar que desenho usa a espessura selecionada |
| **Pré-condição** | Espessura 4.0px selecionada |
| **Passos** | 1. Desenhar assinatura |
| **Resultado Esperado** | Traço desenhado com espessura maior |
| **Status** | ⬜ Pendente |

#### TC-3.3-014: Evento thickness-changed
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-thickness-changed |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Alterar espessura |
| **Resultado Esperado** | Evento disparado com a nova espessura |
| **Status** | ⬜ Pendente |

---

### 4. Modo Borracha

#### TC-3.3-015: Ativar modo borracha
| Item | Descrição |
|------|-----------|
| **Objetivo** | Ativar o modo borracha |
| **Pré-condição** | Assinatura desenhada |
| **Passos** | 1. Clicar no botão Eraser |
| **Resultado Esperado** | Botão marcado como ativo, cursor alterado |
| **Status** | ⬜ Pendente |

#### TC-3.3-016: Apagar traços
| Item | Descrição |
|------|-----------|
| **Objetivo** | Apagar parte da assinatura |
| **Pré-condição** | Modo borracha ativo |
| **Passos** | 1. Desenhar sobre traços existentes |
| **Resultado Esperado** | Traços apagados (desenho branco) |
| **Status** | ⬜ Pendente |

#### TC-3.3-017: Desativar modo borracha
| Item | Descrição |
|------|-----------|
| **Objetivo** | Desativar o modo borracha |
| **Pré-condição** | Modo borracha ativo |
| **Passos** | 1. Clicar no botão Eraser novamente |
| **Resultado Esperado** | Modo normal restaurado, cor original aplicada |
| **Status** | ⬜ Pendente |

#### TC-3.3-018: Sair do eraser ao mudar cor
| Item | Descrição |
|------|-----------|
| **Objetivo** | Sair do modo borracha ao selecionar cor |
| **Pré-condição** | Modo borracha ativo |
| **Passos** | 1. Clicar em uma cor preset |
| **Resultado Esperado** | Modo borracha desativado, nova cor aplicada |
| **Status** | ⬜ Pendente |

#### TC-3.3-019: Atalho de teclado (E)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Ativar/desativar borracha com tecla E |
| **Pré-condição** | Foco na área de assinatura |
| **Passos** | 1. Pressionar tecla E |
| **Resultado Esperado** | Modo borracha alternado |
| **Status** | ⬜ Pendente |

#### TC-3.3-020: Evento eraser-toggled
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-eraser-toggled |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Alternar modo borracha |
| **Resultado Esperado** | Evento disparado com isErasing |
| **Status** | ⬜ Pendente |

---

### 5. Undo/Redo

#### TC-3.3-021: Desfazer último traço
| Item | Descrição |
|------|-----------|
| **Objetivo** | Desfazer o último traço desenhado |
| **Pré-condição** | Múltiplos traços desenhados |
| **Passos** | 1. Clicar no botão Undo |
| **Resultado Esperado** | Último traço removido |
| **Status** | ⬜ Pendente |

#### TC-3.3-022: Undo múltiplas vezes
| Item | Descrição |
|------|-----------|
| **Objetivo** | Desfazer múltiplos traços |
| **Pré-condição** | 5 traços desenhados |
| **Passos** | 1. Clicar Undo 3 vezes |
| **Resultado Esperado** | 3 últimos traços removidos |
| **Status** | ⬜ Pendente |

#### TC-3.3-023: Undo até vazio
| Item | Descrição |
|------|-----------|
| **Objetivo** | Desfazer todos os traços |
| **Pré-condição** | Traços desenhados |
| **Passos** | 1. Clicar Undo até desabilitar |
| **Resultado Esperado** | Área limpa, botão Undo desabilitado |
| **Status** | ⬜ Pendente |

#### TC-3.3-024: Refazer último undo
| Item | Descrição |
|------|-----------|
| **Objetivo** | Refazer o último traço desfeito |
| **Pré-condição** | Undo executado |
| **Passos** | 1. Clicar no botão Redo |
| **Resultado Esperado** | Traço restaurado |
| **Status** | ⬜ Pendente |

#### TC-3.3-025: Redo múltiplas vezes
| Item | Descrição |
|------|-----------|
| **Objetivo** | Refazer múltiplos traços |
| **Pré-condição** | 3 undos executados |
| **Passos** | 1. Clicar Redo 3 vezes |
| **Resultado Esperado** | 3 traços restaurados |
| **Status** | ⬜ Pendente |

#### TC-3.3-026: Redo após novo desenho
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar que Redo é invalidado após novo traço |
| **Pré-condição** | Undo executado |
| **Passos** | 1. Desenhar novo traço 2. Verificar botão Redo |
| **Resultado Esperado** | Botão Redo desabilitado |
| **Status** | ⬜ Pendente |

#### TC-3.3-027: Atalho Ctrl+Z
| Item | Descrição |
|------|-----------|
| **Objetivo** | Desfazer com Ctrl+Z |
| **Pré-condição** | Traços desenhados, foco na área |
| **Passos** | 1. Pressionar Ctrl+Z |
| **Resultado Esperado** | Último traço desfeito |
| **Status** | ⬜ Pendente |

#### TC-3.3-028: Atalho Ctrl+Y
| Item | Descrição |
|------|-----------|
| **Objetivo** | Refazer com Ctrl+Y |
| **Pré-condição** | Undo executado |
| **Passos** | 1. Pressionar Ctrl+Y |
| **Resultado Esperado** | Traço refeito |
| **Status** | ⬜ Pendente |

#### TC-3.3-029: Atalho Ctrl+Shift+Z
| Item | Descrição |
|------|-----------|
| **Objetivo** | Refazer com Ctrl+Shift+Z |
| **Pré-condição** | Undo executado |
| **Passos** | 1. Pressionar Ctrl+Shift+Z |
| **Resultado Esperado** | Traço refeito |
| **Status** | ⬜ Pendente |

#### TC-3.3-030: Evento undo
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-undo |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Executar undo |
| **Resultado Esperado** | Evento disparado com historyIndex |
| **Status** | ⬜ Pendente |

#### TC-3.3-031: Evento redo
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-redo |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Executar redo |
| **Resultado Esperado** | Evento disparado com historyIndex |
| **Status** | ⬜ Pendente |

---

### 6. Botão Clear

#### TC-3.3-032: Limpar assinatura
| Item | Descrição |
|------|-----------|
| **Objetivo** | Limpar toda a assinatura |
| **Pré-condição** | Assinatura desenhada |
| **Passos** | 1. Clicar no botão Clear |
| **Resultado Esperado** | Área limpa, histórico resetado |
| **Status** | ⬜ Pendente |

#### TC-3.3-033: Clear reseta undo/redo
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar que Clear reseta histórico |
| **Pré-condição** | Histórico com múltiplos estados |
| **Passos** | 1. Clicar Clear 2. Verificar botões |
| **Resultado Esperado** | Undo e Redo desabilitados |
| **Status** | ⬜ Pendente |

#### TC-3.3-034: Evento toolbar-cleared
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-toolbar-cleared |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Clicar Clear |
| **Resultado Esperado** | Evento disparado |
| **Status** | ⬜ Pendente |

---

### 7. Persistência de Preferências

#### TC-3.3-035: Salvar cor preferida
| Item | Descrição |
|------|-----------|
| **Objetivo** | Persistir cor selecionada |
| **Pré-condição** | Toolbar inicializada |
| **Passos** | 1. Selecionar cor azul 2. Recarregar página |
| **Resultado Esperado** | Cor azul restaurada |
| **Status** | ⬜ Pendente |

#### TC-3.3-036: Salvar espessura preferida
| Item | Descrição |
|------|-----------|
| **Objetivo** | Persistir espessura selecionada |
| **Pré-condição** | Toolbar inicializada |
| **Passos** | 1. Selecionar espessura 3.5 2. Recarregar página |
| **Resultado Esperado** | Espessura 3.5px restaurada |
| **Status** | ⬜ Pendente |

#### TC-3.3-037: Reset para defaults
| Item | Descrição |
|------|-----------|
| **Objetivo** | Resetar preferências para padrão |
| **Pré-condição** | Preferências alteradas |
| **Passos** | 1. Chamar resetToDefaults() |
| **Resultado Esperado** | Cor preta, espessura 2.0px, preferências limpas |
| **Status** | ⬜ Pendente |

---

### 8. Acessibilidade

#### TC-3.3-038: Navegação por teclado
| Item | Descrição |
|------|-----------|
| **Objetivo** | Navegar pela toolbar com Tab |
| **Pré-condição** | Toolbar visível |
| **Passos** | 1. Usar Tab para navegar |
| **Resultado Esperado** | Foco visível em cada elemento interativo |
| **Status** | ⬜ Pendente |

#### TC-3.3-039: Atributos ARIA
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar atributos ARIA corretos |
| **Pré-condição** | Elementos interativos |
| **Passos** | 1. Inspecionar elementos |
| **Resultado Esperado** | role="toolbar", aria-label, aria-pressed presentes |
| **Status** | ⬜ Pendente |

#### TC-3.3-040: Leitor de tela
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar anúncios do leitor de tela |
| **Pré-condição** | Leitor de tela ativo |
| **Passos** | 1. Navegar pela toolbar |
| **Resultado Esperado** | Elementos anunciados corretamente |
| **Status** | ⬜ Pendente |

---

### 9. Responsividade

#### TC-3.3-041: Layout em tablet
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar layout em tela de tablet |
| **Pré-condição** | Viewport de 768px |
| **Passos** | 1. Visualizar toolbar |
| **Resultado Esperado** | Ferramentas em linha separada |
| **Status** | ⬜ Pendente |

#### TC-3.3-042: Layout em mobile
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar layout em tela de celular |
| **Pré-condição** | Viewport de 480px |
| **Passos** | 1. Visualizar toolbar |
| **Resultado Esperado** | Layout empilhado verticalmente |
| **Status** | ⬜ Pendente |

#### TC-3.3-043: Touch no slider
| Item | Descrição |
|------|-----------|
| **Objetivo** | Ajustar slider com toque |
| **Pré-condição** | Dispositivo touch |
| **Passos** | 1. Arrastar slider com dedo |
| **Resultado Esperado** | Slider responde ao toque |
| **Status** | ⬜ Pendente |

---

### 10. Dark Mode

#### TC-3.3-044: Dark mode Universal Theme
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar estilos em dark mode |
| **Pré-condição** | Tema escuro ativado |
| **Passos** | 1. Ativar dark mode |
| **Resultado Esperado** | Cores adaptadas para tema escuro |
| **Status** | ⬜ Pendente |

#### TC-3.3-045: Contraste em dark mode
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar contraste adequado |
| **Pré-condição** | Dark mode ativo |
| **Passos** | 1. Verificar legibilidade |
| **Resultado Esperado** | Texto e botões com contraste suficiente |
| **Status** | ⬜ Pendente |

---

### 11. Integração

#### TC-3.3-046: Integração com Templates
| Item | Descrição |
|------|-----------|
| **Objetivo** | Toolbar funciona com Templates module |
| **Pré-condição** | Ambos módulos inicializados |
| **Passos** | 1. Usar toolbar 2. Salvar template |
| **Resultado Esperado** | Template salvo com configurações atuais |
| **Status** | ⬜ Pendente |

#### TC-3.3-047: Integração com Multi-Input
| Item | Descrição |
|------|-----------|
| **Objetivo** | Toolbar funciona apenas no modo Draw |
| **Pré-condição** | Multi-input habilitado |
| **Passos** | 1. Trocar para modo Upload 2. Verificar toolbar |
| **Resultado Esperado** | Toolbar funcional apenas em Draw |
| **Status** | ⬜ Pendente |

---

## Critérios de Aceitação

| Critério | Descrição |
|----------|-----------|
| Funcionalidade | Todos os casos de teste passam |
| Desempenho | Undo/Redo < 100ms |
| Acessibilidade | WCAG 2.1 AA compliance |
| Responsividade | Funcional em todos os breakpoints |
| Compatibilidade | Funciona em todos os navegadores suportados |

---

## Notas de Teste

### Configuração de Teste

```javascript
// Inicializar toolbar module
apexSignatureToolbar.init('REGION_ID', {
    appId: '123',
    userId: 'USER_A',
    penColor: '#000000',
    lineWidth: 2.0,
    colorLabel: 'Cor:',
    thicknessLabel: 'Espessura:'
});
```

### Comandos Úteis (Console)

```javascript
// Verificar cor atual
apexSignatureToolbar.getColor('REGION_ID');

// Verificar espessura atual
apexSignatureToolbar.getThickness('REGION_ID');

// Verificar modo borracha
apexSignatureToolbar.isEraserActive('REGION_ID');

// Resetar para defaults
apexSignatureToolbar.resetToDefaults('REGION_ID');

// Executar undo programaticamente
apexSignatureToolbar.undo('REGION_ID');

// Executar redo programaticamente
apexSignatureToolbar.redo('REGION_ID');
```

---

**Total de Casos de Teste:** 47

**Autor:** Maxwell da Silva Oliveira
**Empresa:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
