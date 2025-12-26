# Plano de Testes - APEX Signature v3.4.0
## Date/Timestamp Overlay

**Versão:** 3.4.0
**Data:** 2025-12-24
**Autor:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**LinkedIn:** /maxwbh

---

## Resumo

Este documento descreve os casos de teste para a funcionalidade de **Date/Timestamp Overlay** (Carimbo de Data/Hora) do plugin APEX Signature v3.4.0.

### Funcionalidades Testadas

- Habilitar/desabilitar timestamp
- Posições configuráveis (abaixo, direita, canto superior/inferior)
- Formatos de data configuráveis
- Inclusão de IP e localização
- Preview com timestamp
- Metadados de auditoria

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

#### TC-3.4-001: Inicialização básica
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar inicialização correta do módulo |
| **Pré-condição** | Região de assinatura configurada |
| **Passos** | 1. Carregar página APEX com região de assinatura |
| **Resultado Esperado** | Controles de timestamp exibidos (checkbox, seletor de posição, botão preview) |
| **Status** | ⬜ Pendente |

#### TC-3.4-002: Inicialização com timestamp desabilitado
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar inicialização com enabled=false |
| **Pré-condição** | Configuração com enabled: false |
| **Passos** | 1. Carregar página |
| **Resultado Esperado** | Checkbox desmarcado, controles desabilitados |
| **Status** | ⬜ Pendente |

#### TC-3.4-003: Evento de inicialização
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-timestamp-initialized |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Carregar página |
| **Resultado Esperado** | Evento disparado com version, enabled, position, format |
| **Status** | ⬜ Pendente |

---

### 2. Habilitar/Desabilitar Timestamp

#### TC-3.4-004: Habilitar timestamp
| Item | Descrição |
|------|-----------|
| **Objetivo** | Habilitar o timestamp via checkbox |
| **Pré-condição** | Timestamp desabilitado |
| **Passos** | 1. Marcar checkbox "Add Timestamp" |
| **Resultado Esperado** | Controles habilitados, timestamp será incluído |
| **Status** | ⬜ Pendente |

#### TC-3.4-005: Desabilitar timestamp
| Item | Descrição |
|------|-----------|
| **Objetivo** | Desabilitar o timestamp via checkbox |
| **Pré-condição** | Timestamp habilitado |
| **Passos** | 1. Desmarcar checkbox "Add Timestamp" |
| **Resultado Esperado** | Controles desabilitados, timestamp não será incluído |
| **Status** | ⬜ Pendente |

#### TC-3.4-006: Habilitar via API
| Item | Descrição |
|------|-----------|
| **Objetivo** | Habilitar timestamp programaticamente |
| **Pré-condição** | Timestamp desabilitado |
| **Passos** | 1. Chamar apexSignatureTimestamp.enable('REGION_ID') |
| **Resultado Esperado** | Checkbox marcado, controles habilitados |
| **Status** | ⬜ Pendente |

#### TC-3.4-007: Desabilitar via API
| Item | Descrição |
|------|-----------|
| **Objetivo** | Desabilitar timestamp programaticamente |
| **Pré-condição** | Timestamp habilitado |
| **Passos** | 1. Chamar apexSignatureTimestamp.disable('REGION_ID') |
| **Resultado Esperado** | Checkbox desmarcado, controles desabilitados |
| **Status** | ⬜ Pendente |

#### TC-3.4-008: Evento timestamp-toggled
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-timestamp-toggled |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Alternar checkbox |
| **Resultado Esperado** | Evento disparado com enabled |
| **Status** | ⬜ Pendente |

---

### 3. Posição do Timestamp

#### TC-3.4-009: Posição Below (padrão)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar timestamp abaixo da assinatura |
| **Pré-condição** | Position = below |
| **Passos** | 1. Desenhar assinatura 2. Salvar/Preview |
| **Resultado Esperado** | Timestamp centralizado abaixo da assinatura |
| **Status** | ⬜ Pendente |

#### TC-3.4-010: Posição Right
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar timestamp à direita da assinatura |
| **Pré-condição** | Position = right |
| **Passos** | 1. Selecionar "Right" 2. Desenhar assinatura 3. Preview |
| **Resultado Esperado** | Timestamp à direita, alinhado verticalmente |
| **Status** | ⬜ Pendente |

#### TC-3.4-011: Posição Top-Right
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar timestamp no canto superior direito |
| **Pré-condição** | Position = top-right |
| **Passos** | 1. Selecionar "Top Right" 2. Desenhar assinatura 3. Preview |
| **Resultado Esperado** | Timestamp sobreposto no canto superior direito |
| **Status** | ⬜ Pendente |

#### TC-3.4-012: Posição Bottom-Right
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar timestamp no canto inferior direito |
| **Pré-condição** | Position = bottom-right |
| **Passos** | 1. Selecionar "Bottom Right" 2. Desenhar assinatura 3. Preview |
| **Resultado Esperado** | Timestamp sobreposto no canto inferior direito |
| **Status** | ⬜ Pendente |

#### TC-3.4-013: Alterar posição via seletor
| Item | Descrição |
|------|-----------|
| **Objetivo** | Alterar posição usando dropdown |
| **Pré-condição** | Controles habilitados |
| **Passos** | 1. Selecionar nova posição no dropdown |
| **Resultado Esperado** | Posição atualizada |
| **Status** | ⬜ Pendente |

#### TC-3.4-014: Alterar posição via API
| Item | Descrição |
|------|-----------|
| **Objetivo** | Alterar posição programaticamente |
| **Pré-condição** | Módulo inicializado |
| **Passos** | 1. Chamar apexSignatureTimestamp.setPosition('REGION_ID', 'right') |
| **Resultado Esperado** | Posição atualizada, dropdown sincronizado |
| **Status** | ⬜ Pendente |

#### TC-3.4-015: Evento position-changed
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo do evento apexsignature-timestamp-position-changed |
| **Pré-condição** | Dynamic Action configurada |
| **Passos** | 1. Alterar posição |
| **Resultado Esperado** | Evento disparado com position |
| **Status** | ⬜ Pendente |

---

### 4. Formatos de Data

#### TC-3.4-016: Formato BR (DD/MM/YYYY HH:mm:ss)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar formato brasileiro |
| **Pré-condição** | Format = BR |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Data exibida como 24/12/2025 14:30:00 |
| **Status** | ⬜ Pendente |

#### TC-3.4-017: Formato US (MM/DD/YYYY hh:mm:ss A)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar formato americano |
| **Pré-condição** | Format = US |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Data exibida como 12/24/2025 02:30:00 PM |
| **Status** | ⬜ Pendente |

#### TC-3.4-018: Formato ISO (YYYY-MM-DD HH:mm:ss)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar formato ISO |
| **Pré-condição** | Format = ISO |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Data exibida como 2025-12-24 14:30:00 |
| **Status** | ⬜ Pendente |

#### TC-3.4-019: Apenas data (sem hora)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar timestamp apenas com data |
| **Pré-condição** | includeTime = false |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Apenas data exibida (sem hora) |
| **Status** | ⬜ Pendente |

#### TC-3.4-020: Apenas hora (sem data)
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar timestamp apenas com hora |
| **Pré-condição** | includeDate = false |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Apenas hora exibida (sem data) |
| **Status** | ⬜ Pendente |

#### TC-3.4-021: Formato customizado via API
| Item | Descrição |
|------|-----------|
| **Objetivo** | Definir formato customizado |
| **Pré-condição** | Módulo inicializado |
| **Passos** | 1. Chamar apexSignatureTimestamp.setFormat('REGION_ID', 'DD-MM-YY HH:mm') |
| **Resultado Esperado** | Formato aplicado corretamente |
| **Status** | ⬜ Pendente |

---

### 5. Informações Adicionais

#### TC-3.4-022: Incluir nome do usuário
| Item | Descrição |
|------|-----------|
| **Objetivo** | Adicionar nome do usuário ao timestamp |
| **Pré-condição** | includeUser = true, userName = 'ADMIN' |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Timestamp inclui "ADMIN" |
| **Status** | ⬜ Pendente |

#### TC-3.4-023: Incluir endereço IP
| Item | Descrição |
|------|-----------|
| **Objetivo** | Adicionar IP ao timestamp |
| **Pré-condição** | includeIP = true |
| **Passos** | 1. Aguardar fetch de IP 2. Preview assinatura |
| **Resultado Esperado** | Timestamp inclui "IP: xxx.xxx.xxx.xxx" |
| **Status** | ⬜ Pendente |

#### TC-3.4-024: Incluir localização
| Item | Descrição |
|------|-----------|
| **Objetivo** | Adicionar localização ao timestamp |
| **Pré-condição** | includeLocation = true, permissão concedida |
| **Passos** | 1. Permitir geolocalização 2. Preview assinatura |
| **Resultado Esperado** | Timestamp inclui "Loc: lat, long" |
| **Status** | ⬜ Pendente |

#### TC-3.4-025: Localização negada
| Item | Descrição |
|------|-----------|
| **Objetivo** | Tratar recusa de geolocalização |
| **Pré-condição** | includeLocation = true |
| **Passos** | 1. Negar permissão de localização |
| **Resultado Esperado** | Timestamp sem localização, sem erro |
| **Status** | ⬜ Pendente |

#### TC-3.4-026: Evento ip-fetched
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar evento quando IP é obtido |
| **Pré-condição** | includeIP = true, DA configurada |
| **Passos** | 1. Aguardar fetch de IP |
| **Resultado Esperado** | Evento disparado com IP |
| **Status** | ⬜ Pendente |

#### TC-3.4-027: Evento location-fetched
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar evento quando localização é obtida |
| **Pré-condição** | includeLocation = true, DA configurada |
| **Passos** | 1. Permitir localização |
| **Resultado Esperado** | Evento disparado com coordenadas |
| **Status** | ⬜ Pendente |

---

### 6. Prefixo e Sufixo

#### TC-3.4-028: Adicionar prefixo
| Item | Descrição |
|------|-----------|
| **Objetivo** | Adicionar texto antes do timestamp |
| **Pré-condição** | prefix = 'Signed:' |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Timestamp começa com "Signed:" |
| **Status** | ⬜ Pendente |

#### TC-3.4-029: Adicionar sufixo
| Item | Descrição |
|------|-----------|
| **Objetivo** | Adicionar texto após o timestamp |
| **Pré-condição** | suffix = '(Digital)' |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Timestamp termina com "(Digital)" |
| **Status** | ⬜ Pendente |

#### TC-3.4-030: Prefixo e sufixo juntos
| Item | Descrição |
|------|-----------|
| **Objetivo** | Usar ambos prefixo e sufixo |
| **Pré-condição** | prefix e suffix definidos |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Timestamp com prefixo e sufixo |
| **Status** | ⬜ Pendente |

---

### 7. Preview

#### TC-3.4-031: Abrir preview
| Item | Descrição |
|------|-----------|
| **Objetivo** | Abrir modal de preview |
| **Pré-condição** | Assinatura desenhada |
| **Passos** | 1. Clicar no botão Preview |
| **Resultado Esperado** | Modal aberto com imagem da assinatura + timestamp |
| **Status** | ⬜ Pendente |

#### TC-3.4-032: Preview sem assinatura
| Item | Descrição |
|------|-----------|
| **Objetivo** | Tentar preview sem assinatura |
| **Pré-condição** | Área de assinatura vazia |
| **Passos** | 1. Clicar no botão Preview |
| **Resultado Esperado** | Mensagem de alerta "Please create a signature first" |
| **Status** | ⬜ Pendente |

#### TC-3.4-033: Fechar preview com X
| Item | Descrição |
|------|-----------|
| **Objetivo** | Fechar modal clicando no X |
| **Pré-condição** | Modal de preview aberto |
| **Passos** | 1. Clicar no botão X |
| **Resultado Esperado** | Modal fechado |
| **Status** | ⬜ Pendente |

#### TC-3.4-034: Fechar preview com ESC
| Item | Descrição |
|------|-----------|
| **Objetivo** | Fechar modal com tecla ESC |
| **Pré-condição** | Modal de preview aberto |
| **Passos** | 1. Pressionar ESC |
| **Resultado Esperado** | Modal fechado |
| **Status** | ⬜ Pendente |

#### TC-3.4-035: Fechar preview clicando fora
| Item | Descrição |
|------|-----------|
| **Objetivo** | Fechar modal clicando no overlay |
| **Pré-condição** | Modal de preview aberto |
| **Passos** | 1. Clicar fora do conteúdo |
| **Resultado Esperado** | Modal fechado |
| **Status** | ⬜ Pendente |

#### TC-3.4-036: Evento preview-shown
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar evento ao abrir preview |
| **Pré-condição** | DA configurada |
| **Passos** | 1. Abrir preview |
| **Resultado Esperado** | Evento disparado com position |
| **Status** | ⬜ Pendente |

---

### 8. Salvamento com Timestamp

#### TC-3.4-037: Salvar assinatura com timestamp
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar que save inclui timestamp |
| **Pré-condição** | Timestamp habilitado |
| **Passos** | 1. Desenhar assinatura 2. Salvar |
| **Resultado Esperado** | Imagem salva inclui timestamp |
| **Status** | ⬜ Pendente |

#### TC-3.4-038: Salvar sem timestamp
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar que save não inclui timestamp quando desabilitado |
| **Pré-condição** | Timestamp desabilitado |
| **Passos** | 1. Desenhar assinatura 2. Salvar |
| **Resultado Esperado** | Imagem salva sem timestamp |
| **Status** | ⬜ Pendente |

#### TC-3.4-039: Metadados de auditoria
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar metadados incluídos no save |
| **Pré-condição** | Timestamp habilitado |
| **Passos** | 1. Salvar assinatura 2. Verificar request |
| **Resultado Esperado** | Metadados incluem timestamp, format, position, userAgent |
| **Status** | ⬜ Pendente |

---

### 9. Estilização

#### TC-3.4-040: Configurar fonte
| Item | Descrição |
|------|-----------|
| **Objetivo** | Alterar fonte do timestamp |
| **Pré-condição** | fontFamily = 'Courier New' |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Timestamp em fonte Courier New |
| **Status** | ⬜ Pendente |

#### TC-3.4-041: Configurar tamanho da fonte
| Item | Descrição |
|------|-----------|
| **Objetivo** | Alterar tamanho do timestamp |
| **Pré-condição** | fontSize = 16 |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Timestamp com fonte maior |
| **Status** | ⬜ Pendente |

#### TC-3.4-042: Configurar cor da fonte
| Item | Descrição |
|------|-----------|
| **Objetivo** | Alterar cor do timestamp |
| **Pré-condição** | fontColor = '#0066cc' |
| **Passos** | 1. Preview assinatura |
| **Resultado Esperado** | Timestamp em azul |
| **Status** | ⬜ Pendente |

---

### 10. Responsividade

#### TC-3.4-043: Layout em tablet
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar layout em tela de tablet |
| **Pré-condição** | Viewport de 768px |
| **Passos** | 1. Visualizar controles |
| **Resultado Esperado** | Controles ajustados para tablet |
| **Status** | ⬜ Pendente |

#### TC-3.4-044: Layout em mobile
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar layout em tela de celular |
| **Pré-condição** | Viewport de 480px |
| **Passos** | 1. Visualizar controles |
| **Resultado Esperado** | Controles empilhados verticalmente |
| **Status** | ⬜ Pendente |

---

### 11. Dark Mode

#### TC-3.4-045: Dark mode Universal Theme
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar estilos em dark mode |
| **Pré-condição** | Tema escuro ativado |
| **Passos** | 1. Ativar dark mode |
| **Resultado Esperado** | Cores adaptadas para tema escuro |
| **Status** | ⬜ Pendente |

---

### 12. API Methods

#### TC-3.4-046: getSignatureWithTimestamp
| Item | Descrição |
|------|-----------|
| **Objetivo** | Obter assinatura com timestamp via API |
| **Pré-condição** | Assinatura desenhada, timestamp habilitado |
| **Passos** | 1. Chamar getSignatureWithTimestamp() |
| **Resultado Esperado** | Callback com dataURL incluindo timestamp |
| **Status** | ⬜ Pendente |

#### TC-3.4-047: getMetadata
| Item | Descrição |
|------|-----------|
| **Objetivo** | Obter metadados de auditoria |
| **Pré-condição** | Módulo inicializado |
| **Passos** | 1. Chamar getMetadata() |
| **Resultado Esperado** | Objeto com timestamp, format, position, userAgent, etc. |
| **Status** | ⬜ Pendente |

#### TC-3.4-048: setUserName
| Item | Descrição |
|------|-----------|
| **Objetivo** | Definir nome do usuário via API |
| **Pré-condição** | Módulo inicializado |
| **Passos** | 1. Chamar setUserName('John Doe') 2. Preview |
| **Resultado Esperado** | Timestamp inclui "John Doe" |
| **Status** | ⬜ Pendente |

---

## Critérios de Aceitação

| Critério | Descrição |
|----------|-----------|
| Funcionalidade | Todos os casos de teste passam |
| Desempenho | Geração de imagem com timestamp < 500ms |
| Acessibilidade | WCAG 2.1 AA compliance |
| Responsividade | Funcional em todos os breakpoints |
| Compatibilidade | Funciona em todos os navegadores suportados |

---

## Notas de Teste

### Configuração de Teste

```javascript
// Inicialização completa
apexSignatureTimestamp.init('REGION_ID', {
    enabled: true,
    position: 'below',
    format: 'DD/MM/YYYY HH:mm:ss',
    includeDate: true,
    includeTime: true,
    includeIP: true,
    includeUser: true,
    includeLocation: false,
    userName: '&APP_USER.',
    fontSize: 12,
    fontFamily: 'Arial, sans-serif',
    fontColor: '#666666',
    prefix: 'Assinado:',
    suffix: ''
});
```

### Comandos Úteis (Console)

```javascript
// Verificar se está habilitado
apexSignatureTimestamp.isEnabled('REGION_ID');

// Obter metadados
apexSignatureTimestamp.getMetadata('REGION_ID');

// Obter assinatura com timestamp
apexSignatureTimestamp.getSignatureWithTimestamp('REGION_ID', function(dataUrl) {
    console.log('Image with timestamp:', dataUrl);
});

// Alterar posição
apexSignatureTimestamp.setPosition('REGION_ID', 'right');

// Alterar formato
apexSignatureTimestamp.setFormat('REGION_ID', 'YYYY-MM-DD');
```

---

**Total de Casos de Teste:** 48

**Autor:** Maxwell da Silva Oliveira
**Empresa:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
