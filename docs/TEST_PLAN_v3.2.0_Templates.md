# Plano de Testes - APEX Signature v3.2.0
## Signature Templates (Saved Signatures)

**Versão:** 3.2.0
**Data:** 2025-12-23
**Autor:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**LinkedIn:** /maxwbh

---

## Resumo

Este documento descreve os casos de teste para a funcionalidade de **Signature Templates** (Assinaturas Salvas) do plugin APEX Signature v3.2.0.

### Funcionalidades Testadas

- Salvar assinatura como template
- Galeria de assinaturas salvas
- Aplicar template à área de assinatura
- Renomear templates
- Excluir templates
- Limpar todos os templates
- Persistência em localStorage
- Import/Export de templates

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

#### TC-3.2-001: Inicialização básica
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar inicialização correta do módulo de templates |
| **Pré-condição** | Região de assinatura configurada com templates habilitados |
| **Passos** | 1. Carregar página APEX com região de assinatura |
| **Resultado Esperado** | Toolbar de templates exibida com botões "Save Template" e "My Signatures" |
| **Status** | ⬜ Pendente |

#### TC-3.2-002: Badge de contagem
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar exibição do badge de contagem |
| **Pré-condição** | Templates existentes no localStorage |
| **Passos** | 1. Carregar página com templates salvos |
| **Resultado Esperado** | Badge no botão "My Signatures" mostra número correto de templates |
| **Status** | ⬜ Pendente |

#### TC-3.2-003: Evento de inicialização
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-templates-initialized |
| **Pré-condição** | Dynamic Action configurada para o evento |
| **Passos** | 1. Configurar DA para o evento 2. Carregar página |
| **Resultado Esperado** | Evento disparado com version e templateCount |
| **Status** | ⬜ Pendente |

---

### 2. Salvar Template

#### TC-3.2-004: Salvar assinatura desenhada
| Item | Descrição |
|------|-----------|
| **Objetivo** | Salvar assinatura do modo Draw como template |
| **Pré-condição** | Assinatura desenhada na área de captura |
| **Passos** | 1. Desenhar assinatura 2. Clicar em "Save Template" 3. Inserir nome 4. Confirmar |
| **Resultado Esperado** | Template salvo com sucesso, mensagem de confirmação exibida |
| **Status** | ⬜ Pendente |

#### TC-3.2-005: Salvar assinatura de upload
| Item | Descrição |
|------|-----------|
| **Objetivo** | Salvar imagem do modo Upload como template |
| **Pré-condição** | Imagem carregada via upload |
| **Passos** | 1. Fazer upload de imagem 2. Clicar em "Save Template" 3. Inserir nome 4. Confirmar |
| **Resultado Esperado** | Template salvo com thumbnail gerado |
| **Status** | ⬜ Pendente |

#### TC-3.2-006: Salvar assinatura de webcam
| Item | Descrição |
|------|-----------|
| **Objetivo** | Salvar captura de webcam como template |
| **Pré-condição** | Imagem capturada via webcam |
| **Passos** | 1. Capturar imagem da webcam 2. Clicar em "Save Template" 3. Inserir nome 4. Confirmar |
| **Resultado Esperado** | Template salvo com thumbnail gerado |
| **Status** | ⬜ Pendente |

#### TC-3.2-007: Validação de assinatura vazia
| Item | Descrição |
|------|-----------|
| **Objetivo** | Impedir salvamento de assinatura vazia |
| **Pré-condição** | Área de assinatura vazia |
| **Passos** | 1. Clicar em "Save Template" sem desenhar |
| **Resultado Esperado** | Mensagem de alerta "Please create a signature first" |
| **Status** | ⬜ Pendente |

#### TC-3.2-008: Limite máximo de templates
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar limite de 20 templates |
| **Pré-condição** | 20 templates já salvos |
| **Passos** | 1. Tentar salvar mais um template |
| **Resultado Esperado** | Mensagem de alerta informando limite atingido |
| **Status** | ⬜ Pendente |

#### TC-3.2-009: Cancelar salvamento
| Item | Descrição |
|------|-----------|
| **Objetivo** | Cancelar diálogo de salvamento |
| **Pré-condição** | Diálogo de salvamento aberto |
| **Passos** | 1. Clicar em "Cancel" ou pressionar ESC |
| **Resultado Esperado** | Diálogo fechado, template não salvo |
| **Status** | ⬜ Pendente |

#### TC-3.2-010: Evento template-saved
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-template-saved |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Salvar um template |
| **Resultado Esperado** | Evento disparado com dados do template e count |
| **Status** | ⬜ Pendente |

---

### 3. Galeria de Templates

#### TC-3.2-011: Abrir galeria
| Item | Descrição |
|------|-----------|
| **Objetivo** | Abrir modal da galeria de templates |
| **Pré-condição** | Botão "My Signatures" disponível |
| **Passos** | 1. Clicar em "My Signatures" |
| **Resultado Esperado** | Modal aberto com grid de templates |
| **Status** | ⬜ Pendente |

#### TC-3.2-012: Estado vazio
| Item | Descrição |
|------|-----------|
| **Objetivo** | Exibir estado vazio quando não há templates |
| **Pré-condição** | Nenhum template salvo |
| **Passos** | 1. Abrir galeria |
| **Resultado Esperado** | Mensagem "No saved signatures yet" exibida |
| **Status** | ⬜ Pendente |

#### TC-3.2-013: Exibição de templates
| Item | Descrição |
|------|-----------|
| **Objetivo** | Exibir templates em grid |
| **Pré-condição** | Múltiplos templates salvos |
| **Passos** | 1. Abrir galeria |
| **Resultado Esperado** | Templates exibidos com thumbnail, nome e data |
| **Status** | ⬜ Pendente |

#### TC-3.2-014: Ordenação por data
| Item | Descrição |
|------|-----------|
| **Objetivo** | Templates ordenados por data (mais recente primeiro) |
| **Pré-condição** | Múltiplos templates com datas diferentes |
| **Passos** | 1. Abrir galeria |
| **Resultado Esperado** | Template mais recente aparece primeiro |
| **Status** | ⬜ Pendente |

#### TC-3.2-015: Fechar galeria com X
| Item | Descrição |
|------|-----------|
| **Objetivo** | Fechar modal clicando no X |
| **Pré-condição** | Galeria aberta |
| **Passos** | 1. Clicar no botão X |
| **Resultado Esperado** | Modal fechado |
| **Status** | ⬜ Pendente |

#### TC-3.2-016: Fechar galeria com ESC
| Item | Descrição |
|------|-----------|
| **Objetivo** | Fechar modal com tecla ESC |
| **Pré-condição** | Galeria aberta |
| **Passos** | 1. Pressionar ESC |
| **Resultado Esperado** | Modal fechado |
| **Status** | ⬜ Pendente |

#### TC-3.2-017: Fechar galeria clicando fora
| Item | Descrição |
|------|-----------|
| **Objetivo** | Fechar modal clicando no overlay |
| **Pré-condição** | Galeria aberta |
| **Passos** | 1. Clicar fora do conteúdo do modal |
| **Resultado Esperado** | Modal fechado |
| **Status** | ⬜ Pendente |

---

### 4. Aplicar Template

#### TC-3.2-018: Aplicar template clicando no item
| Item | Descrição |
|------|-----------|
| **Objetivo** | Aplicar template clicando no card |
| **Pré-condição** | Templates salvos na galeria |
| **Passos** | 1. Abrir galeria 2. Clicar em um template |
| **Resultado Esperado** | Template aplicado à área de assinatura, galeria fechada |
| **Status** | ⬜ Pendente |

#### TC-3.2-019: Aplicar template com botão Use
| Item | Descrição |
|------|-----------|
| **Objetivo** | Aplicar template usando botão de ação |
| **Pré-condição** | Templates salvos na galeria |
| **Passos** | 1. Abrir galeria 2. Clicar no ícone ✓ do template |
| **Resultado Esperado** | Template aplicado à área de assinatura |
| **Status** | ⬜ Pendente |

#### TC-3.2-020: Aplicar template com teclado
| Item | Descrição |
|------|-----------|
| **Objetivo** | Aplicar template usando Enter |
| **Pré-condição** | Template focado na galeria |
| **Passos** | 1. Navegar com Tab 2. Pressionar Enter no template |
| **Resultado Esperado** | Template aplicado à área de assinatura |
| **Status** | ⬜ Pendente |

#### TC-3.2-021: Evento template-applied
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-template-applied |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Aplicar um template |
| **Resultado Esperado** | Evento disparado com dados do template |
| **Status** | ⬜ Pendente |

---

### 5. Renomear Template

#### TC-3.2-022: Renomear template
| Item | Descrição |
|------|-----------|
| **Objetivo** | Renomear um template existente |
| **Pré-condição** | Template salvo na galeria |
| **Passos** | 1. Abrir galeria 2. Clicar no ícone ✎ 3. Inserir novo nome 4. Confirmar |
| **Resultado Esperado** | Nome atualizado, galeria atualizada |
| **Status** | ⬜ Pendente |

#### TC-3.2-023: Cancelar renomeação
| Item | Descrição |
|------|-----------|
| **Objetivo** | Cancelar diálogo de renomeação |
| **Pré-condição** | Diálogo de renomeação aberto |
| **Passos** | 1. Clicar em "Cancel" |
| **Resultado Esperado** | Diálogo fechado, nome mantido |
| **Status** | ⬜ Pendente |

#### TC-3.2-024: Evento template-renamed
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-template-renamed |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Renomear um template |
| **Resultado Esperado** | Evento disparado com dados do template |
| **Status** | ⬜ Pendente |

---

### 6. Excluir Template

#### TC-3.2-025: Excluir template individual
| Item | Descrição |
|------|-----------|
| **Objetivo** | Excluir um template específico |
| **Pré-condição** | Template salvo na galeria |
| **Passos** | 1. Abrir galeria 2. Clicar no ícone 🗑 3. Confirmar exclusão |
| **Resultado Esperado** | Template removido, galeria atualizada |
| **Status** | ⬜ Pendente |

#### TC-3.2-026: Cancelar exclusão
| Item | Descrição |
|------|-----------|
| **Objetivo** | Cancelar confirmação de exclusão |
| **Pré-condição** | Diálogo de confirmação aberto |
| **Passos** | 1. Clicar em "Cancel" na confirmação |
| **Resultado Esperado** | Template mantido, galeria inalterada |
| **Status** | ⬜ Pendente |

#### TC-3.2-027: Evento template-deleted
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-template-deleted |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Excluir um template |
| **Resultado Esperado** | Evento disparado com templateId e remainingCount |
| **Status** | ⬜ Pendente |

#### TC-3.2-028: Limpar todos os templates
| Item | Descrição |
|------|-----------|
| **Objetivo** | Excluir todos os templates |
| **Pré-condição** | Múltiplos templates salvos |
| **Passos** | 1. Abrir galeria 2. Clicar em "Clear All" 3. Confirmar |
| **Resultado Esperado** | Todos os templates removidos, estado vazio exibido |
| **Status** | ⬜ Pendente |

#### TC-3.2-029: Evento templates-cleared
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-templates-cleared |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Limpar todos os templates |
| **Resultado Esperado** | Evento disparado |
| **Status** | ⬜ Pendente |

---

### 7. Persistência

#### TC-3.2-030: Persistência em localStorage
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar que templates persistem entre sessões |
| **Pré-condição** | Templates salvos |
| **Passos** | 1. Salvar templates 2. Recarregar página |
| **Resultado Esperado** | Templates carregados do localStorage |
| **Status** | ⬜ Pendente |

#### TC-3.2-031: Isolamento por usuário
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar que templates são isolados por usuário |
| **Pré-condição** | Configuração com userId diferente |
| **Passos** | 1. Salvar templates com userId A 2. Trocar para userId B |
| **Resultado Esperado** | Templates do userId A não visíveis para userId B |
| **Status** | ⬜ Pendente |

#### TC-3.2-032: Quota excedida
| Item | Descrição |
|------|-----------|
| **Objetivo** | Tratar erro de quota excedida do localStorage |
| **Pré-condição** | localStorage quase cheio |
| **Passos** | 1. Tentar salvar template grande |
| **Resultado Esperado** | Mensagem de erro amigável exibida |
| **Status** | ⬜ Pendente |

---

### 8. Import/Export

#### TC-3.2-033: Exportar templates
| Item | Descrição |
|------|-----------|
| **Objetivo** | Exportar templates como JSON |
| **Pré-condição** | Templates salvos |
| **Passos** | 1. Chamar apexSignatureTemplates.exportTemplates(regionId) |
| **Resultado Esperado** | JSON válido com todos os templates |
| **Status** | ⬜ Pendente |

#### TC-3.2-034: Importar templates
| Item | Descrição |
|------|-----------|
| **Objetivo** | Importar templates de JSON |
| **Pré-condição** | JSON válido de templates |
| **Passos** | 1. Chamar apexSignatureTemplates.importTemplates(regionId, json) |
| **Resultado Esperado** | Templates importados e adicionados à galeria |
| **Status** | ⬜ Pendente |

#### TC-3.2-035: Importar JSON inválido
| Item | Descrição |
|------|-----------|
| **Objetivo** | Tratar erro de JSON inválido |
| **Pré-condição** | JSON mal formado |
| **Passos** | 1. Tentar importar JSON inválido |
| **Resultado Esperado** | Mensagem de erro exibida |
| **Status** | ⬜ Pendente |

---

### 9. Acessibilidade

#### TC-3.2-036: Navegação por teclado
| Item | Descrição |
|------|-----------|
| **Objetivo** | Navegar pelos templates usando teclado |
| **Pré-condição** | Galeria aberta com templates |
| **Passos** | 1. Usar Tab para navegar 2. Usar Enter/Espaço para selecionar |
| **Resultado Esperado** | Foco visível, interações funcionais |
| **Status** | ⬜ Pendente |

#### TC-3.2-037: Atributos ARIA
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar atributos ARIA corretos |
| **Pré-condição** | Elementos interativos |
| **Passos** | 1. Inspecionar elementos com DevTools |
| **Resultado Esperado** | role="button", aria-label presentes |
| **Status** | ⬜ Pendente |

#### TC-3.2-038: Foco automático
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar foco automático ao abrir modal |
| **Pré-condição** | Modal fechado |
| **Passos** | 1. Abrir galeria |
| **Resultado Esperado** | Foco no primeiro template ou no modal |
| **Status** | ⬜ Pendente |

---

### 10. Responsividade

#### TC-3.2-039: Layout em tablet
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar layout em tela de tablet |
| **Pré-condição** | Viewport de 768px |
| **Passos** | 1. Abrir galeria em tablet |
| **Resultado Esperado** | Grid adaptado, botões visíveis |
| **Status** | ⬜ Pendente |

#### TC-3.2-040: Layout em mobile
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar layout em tela de celular |
| **Pré-condição** | Viewport de 480px |
| **Passos** | 1. Abrir galeria em mobile |
| **Resultado Esperado** | Grid de 2 colunas, modal em tela cheia |
| **Status** | ⬜ Pendente |

---

### 11. Dark Mode

#### TC-3.2-041: Dark mode Universal Theme
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar estilos em dark mode |
| **Pré-condição** | Tema escuro ativado no Universal Theme |
| **Passos** | 1. Ativar dark mode 2. Abrir galeria |
| **Resultado Esperado** | Cores adaptadas para tema escuro |
| **Status** | ⬜ Pendente |

---

### 12. Integração com apexSignature

#### TC-3.2-042: Integração com modo Draw
| Item | Descrição |
|------|-----------|
| **Objetivo** | Template aplicado corretamente no modo Draw |
| **Pré-condição** | Modo Draw ativo |
| **Passos** | 1. Aplicar template |
| **Resultado Esperado** | Imagem desenhada no canvas, isEmpty() retorna false |
| **Status** | ⬜ Pendente |

#### TC-3.2-043: Troca automática para Draw
| Item | Descrição |
|------|-----------|
| **Objetivo** | Trocar automaticamente para Draw ao aplicar template |
| **Pré-condição** | Modo Upload ou Webcam ativo |
| **Passos** | 1. Estar em modo Upload 2. Aplicar template |
| **Resultado Esperado** | Modo alterado para Draw, template aplicado |
| **Status** | ⬜ Pendente |

---

## Critérios de Aceitação

| Critério | Descrição |
|----------|-----------|
| Funcionalidade | Todos os casos de teste passam |
| Desempenho | Salvamento e carregamento < 500ms |
| Acessibilidade | WCAG 2.1 AA compliance |
| Responsividade | Funcional em todos os breakpoints |
| Compatibilidade | Funciona em todos os navegadores suportados |

---

## Notas de Teste

### Configuração de Teste

```javascript
// Inicializar templates module
apexSignatureTemplates.init('REGION_ID', {
    appId: '123',
    userId: 'USER_A',
    saveLabel: 'Save Template',
    galleryLabel: 'My Signatures',
    galleryTitle: 'Saved Signatures',
    emptyMessage: 'No signatures saved'
});
```

### Comandos Úteis (Console)

```javascript
// Verificar templates salvos
apexSignatureTemplates.getAllTemplates('REGION_ID');

// Verificar contagem
apexSignatureTemplates.getTemplateCount('REGION_ID');

// Exportar templates
var json = apexSignatureTemplates.exportTemplates('REGION_ID');

// Importar templates
apexSignatureTemplates.importTemplates('REGION_ID', json);

// Limpar localStorage (para testes)
localStorage.removeItem('apex_sig_template_123_USER_A');
```

---

**Total de Casos de Teste:** 43

**Autor:** Maxwell da Silva Oliveira
**Empresa:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
