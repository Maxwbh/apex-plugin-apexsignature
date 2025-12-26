# Plano de Testes - APEX Signature v3.6.0
## Módulo: Signature Verification

**Versão:** 3.6.0
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

Validar o módulo de verificação de assinaturas, incluindo geração de hash SHA-256, coleta de metadados de auditoria, verificação de integridade e detecção de adulteração.

---

## Escopo

### Funcionalidades Testadas

| Funcionalidade | Prioridade |
|----------------|------------|
| Geração de Hash SHA-256 | Alta |
| Coleta de Metadados | Alta |
| Verificação de Integridade | Alta |
| Detecção de Adulteração | Alta |
| Comparação de Assinaturas | Média |
| Log de Auditoria | Média |
| Badge de Verificação | Média |
| Preparação para Certificado | Baixa |

---

## Ambiente de Teste

### Requisitos

| Componente | Versão |
|------------|--------|
| Oracle APEX | 24.2+ |
| Oracle Database | 19c / 21c / 23ai |
| Navegador Chrome | 120+ |
| Navegador Firefox | 120+ |
| Navegador Safari | 17+ |
| Navegador Edge | 120+ |

### Dispositivos

- Desktop (Windows, macOS, Linux)
- Tablet (iPad, Android)
- Mobile (iPhone, Android)

---

## Casos de Teste

### 1. Inicialização do Módulo

#### TC-3.6.0-001: Inicialização Básica
**Objetivo:** Verificar inicialização do módulo de verificação
**Pré-condição:** Plugin APEX Signature carregado
**Passos:**
1. Criar região de assinatura
2. Chamar `apexSignatureVerification.init('regionId')`
3. Verificar retorno da função

**Resultado Esperado:**
- Retorna objeto de instância
- Propriedade `initialized` é `true`
- Evento `apexsignature-verification-initialized` disparado

---

#### TC-3.6.0-002: Inicialização com Opções
**Objetivo:** Verificar inicialização com opções customizadas
**Passos:**
1. Chamar `init('regionId', { includeIP: true, includeGeolocation: false })`
2. Verificar objeto de instância

**Resultado Esperado:**
- Opções armazenadas corretamente
- Instância criada com configurações

---

### 2. Geração de Hash

#### TC-3.6.0-003: Hash SHA-256 de Assinatura
**Objetivo:** Verificar geração de hash SHA-256
**Passos:**
1. Capturar assinatura válida
2. Obter dados base64 da assinatura
3. Chamar `generateHash(signatureData)`
4. Verificar hash retornado

**Resultado Esperado:**
- Hash retornado em formato hexadecimal
- Hash tem 64 caracteres (256 bits)
- Hash é consistente para mesmos dados

---

#### TC-3.6.0-004: Hash Consistente
**Objetivo:** Verificar que mesmo dado gera mesmo hash
**Passos:**
1. Capturar assinatura
2. Gerar hash duas vezes com mesmos dados
3. Comparar hashes

**Resultado Esperado:**
- Ambos hashes são idênticos
- Resultado determinístico

---

#### TC-3.6.0-005: Hash Diferente para Dados Diferentes
**Objetivo:** Verificar que dados diferentes geram hashes diferentes
**Passos:**
1. Capturar primeira assinatura
2. Gerar hash
3. Limpar e capturar segunda assinatura
4. Gerar novo hash
5. Comparar hashes

**Resultado Esperado:**
- Hashes são diferentes
- Sensibilidade a mudanças de dados

---

#### TC-3.6.0-006: Hash de Canvas
**Objetivo:** Verificar geração de hash diretamente do canvas
**Passos:**
1. Obter elemento canvas da assinatura
2. Chamar `generateCanvasHash(canvas)`
3. Verificar hash retornado

**Resultado Esperado:**
- Hash gerado a partir dos pixels
- Formato hexadecimal válido

---

#### TC-3.6.0-007: Fallback para Navegadores Antigos
**Objetivo:** Verificar fallback quando Web Crypto não disponível
**Passos:**
1. Simular ausência de `window.crypto.subtle`
2. Chamar `generateHash(signatureData)`
3. Verificar resultado

**Resultado Esperado:**
- Checksum simples gerado
- Prefixo `simple_` no hash
- Sem erros JavaScript

---

### 3. Coleta de Metadados

#### TC-3.6.0-008: Metadados Básicos
**Objetivo:** Verificar coleta de metadados básicos
**Passos:**
1. Chamar `collectMetadata()`
2. Aguardar Promise
3. Verificar objeto retornado

**Resultado Esperado:**
- `id` UUID válido
- `timestamp` ISO 8601
- `userAgent` presente
- `platform` presente
- `language` presente

---

#### TC-3.6.0-009: Metadados APEX
**Objetivo:** Verificar coleta de dados específicos do APEX
**Passos:**
1. Executar em página APEX
2. Chamar `collectMetadata()`
3. Verificar campos APEX

**Resultado Esperado:**
- `apexAppId` preenchido
- `apexPageId` preenchido
- `apexSessionId` preenchido
- `apexUsername` preenchido (se logado)

---

#### TC-3.6.0-010: Coleta de IP
**Objetivo:** Verificar coleta de endereço IP
**Passos:**
1. Chamar `collectMetadata({ includeIP: true })`
2. Verificar campo `ipAddress`

**Resultado Esperado:**
- IP público retornado
- Formato IPv4 ou IPv6 válido

---

#### TC-3.6.0-011: Coleta de Geolocalização
**Objetivo:** Verificar coleta de geolocalização
**Pré-condição:** Permissão de localização concedida
**Passos:**
1. Chamar `collectMetadata({ includeGeolocation: true })`
2. Verificar campo `geolocation`

**Resultado Esperado:**
- `latitude` presente
- `longitude` presente
- `accuracy` presente

---

#### TC-3.6.0-012: Geolocalização Negada
**Objetivo:** Verificar comportamento quando geolocalização negada
**Passos:**
1. Negar permissão de localização
2. Chamar `collectMetadata({ includeGeolocation: true })`
3. Verificar resultado

**Resultado Esperado:**
- `geolocation` é `null`
- Sem erros na Promise
- Demais metadados presentes

---

### 4. Registro de Assinatura

#### TC-3.6.0-013: Criar Registro de Assinatura
**Objetivo:** Verificar criação de registro completo
**Passos:**
1. Capturar assinatura válida
2. Chamar `createSignatureRecord('regionId', signatureData)`
3. Verificar registro retornado

**Resultado Esperado:**
- `hash` SHA-256 presente
- `hashAlgorithm` é "SHA-256"
- `metadata` completo
- `status` é "valid"
- `createdAt` timestamp presente

---

#### TC-3.6.0-014: Registro sem Dados de Imagem
**Objetivo:** Verificar criação de registro sem armazenar imagem
**Passos:**
1. Chamar `createSignatureRecord('regionId', data, { includeData: false })`
2. Verificar registro

**Resultado Esperado:**
- `signatureData` é `null`
- `dataSize` indica tamanho original
- Hash ainda presente

---

#### TC-3.6.0-015: Evento de Registro Criado
**Objetivo:** Verificar disparo de evento ao criar registro
**Passos:**
1. Adicionar listener para `apexsignature-verification-record-created`
2. Criar registro de assinatura
3. Verificar evento recebido

**Resultado Esperado:**
- Evento disparado
- `detail.record` contém registro completo

---

### 5. Verificação de Integridade

#### TC-3.6.0-016: Verificar Hash Válido
**Objetivo:** Verificar detecção de assinatura íntegra
**Passos:**
1. Criar registro de assinatura
2. Chamar `verifyHash(signatureData, record.hash)`
3. Verificar resultado

**Resultado Esperado:**
- `valid` é `true`
- `status` é "valid"
- `message` indica sucesso

---

#### TC-3.6.0-017: Detectar Assinatura Adulterada
**Objetivo:** Verificar detecção de adulteração
**Passos:**
1. Criar registro de assinatura
2. Modificar levemente os dados da assinatura
3. Chamar `verifyHash(modifiedData, record.hash)`
4. Verificar resultado

**Resultado Esperado:**
- `valid` é `false`
- `status` é "tampered"
- `currentHash` diferente de `expectedHash`

---

#### TC-3.6.0-018: Verificar Registro Completo
**Objetivo:** Verificar registro com todas as checagens
**Passos:**
1. Criar registro de assinatura
2. Chamar `verifyRecord(record, signatureData)`
3. Verificar resultado

**Resultado Esperado:**
- `checks` array com múltiplas verificações
- `hash_integrity` passed
- `metadata_present` passed
- `valid` é `true`

---

#### TC-3.6.0-019: Verificar Registro Inválido
**Objetivo:** Verificar detecção de registro inválido
**Passos:**
1. Criar registro malformado (sem hash)
2. Chamar `verifyRecord(invalidRecord, signatureData)`
3. Verificar resultado

**Resultado Esperado:**
- `valid` é `false`
- `status` é "invalid"
- Mensagem de erro apropriada

---

### 6. Comparação de Assinaturas

#### TC-3.6.0-020: Comparar Assinaturas Idênticas
**Objetivo:** Verificar comparação de assinaturas iguais
**Passos:**
1. Capturar assinatura
2. Chamar `compareSignatures(sig1, sig1)`
3. Verificar resultado

**Resultado Esperado:**
- `exactMatch` é `true`
- `similarityPercent` é 100
- Hashes idênticos

---

#### TC-3.6.0-021: Comparar Assinaturas Diferentes
**Objetivo:** Verificar comparação de assinaturas distintas
**Passos:**
1. Capturar primeira assinatura
2. Limpar e capturar segunda assinatura
3. Chamar `compareSignatures(sig1, sig2)`
4. Verificar resultado

**Resultado Esperado:**
- `exactMatch` é `false`
- `similarityPercent` < 100
- Hashes diferentes

---

#### TC-3.6.0-022: Similaridade Visual
**Objetivo:** Verificar cálculo de similaridade visual
**Passos:**
1. Criar duas assinaturas similares
2. Comparar assinaturas
3. Verificar `visualSimilarity`

**Resultado Esperado:**
- Valor entre 0 e 1
- Reflete semelhança visual

---

### 7. Log de Auditoria

#### TC-3.6.0-023: Registrar Ação no Log
**Objetivo:** Verificar registro de ações no log
**Passos:**
1. Inicializar verificação
2. Criar registro de assinatura
3. Obter log de auditoria

**Resultado Esperado:**
- Entradas para "verification_initialized"
- Entrada para "signature_created"
- Timestamps corretos

---

#### TC-3.6.0-024: Persistência do Log
**Objetivo:** Verificar persistência do log em localStorage
**Passos:**
1. Criar registros de assinatura
2. Recarregar página
3. Obter log de auditoria

**Resultado Esperado:**
- Entradas anteriores preservadas
- Carregamento do localStorage funcional

---

#### TC-3.6.0-025: Filtrar Log por Ação
**Objetivo:** Verificar filtragem do log
**Passos:**
1. Gerar múltiplas ações
2. Chamar `getAuditLog('regionId', { action: 'signature_created' })`
3. Verificar resultado

**Resultado Esperado:**
- Apenas entradas da ação especificada
- Ordenação cronológica

---

#### TC-3.6.0-026: Filtrar Log por Data
**Objetivo:** Verificar filtragem por período
**Passos:**
1. Chamar `getAuditLog('regionId', { from: '2025-01-01', to: '2025-12-31' })`
2. Verificar resultado

**Resultado Esperado:**
- Apenas entradas no período
- Filtros `from` e `to` funcionais

---

#### TC-3.6.0-027: Limitar Entradas do Log
**Objetivo:** Verificar limite de entradas
**Passos:**
1. Gerar 10+ entradas
2. Chamar `getAuditLog('regionId', { limit: 5 })`
3. Verificar resultado

**Resultado Esperado:**
- Máximo 5 entradas retornadas
- Entradas mais recentes

---

#### TC-3.6.0-028: Limpar Log de Auditoria
**Objetivo:** Verificar limpeza do log
**Passos:**
1. Gerar entradas no log
2. Chamar `clearAuditLog('regionId')`
3. Verificar log

**Resultado Esperado:**
- Log vazio (exceto entrada de "cleared")
- localStorage limpo

---

#### TC-3.6.0-029: Exportar Log de Auditoria
**Objetivo:** Verificar exportação do log
**Passos:**
1. Gerar entradas no log
2. Chamar `exportAuditLog('regionId')`
3. Verificar JSON retornado

**Resultado Esperado:**
- JSON válido e formatado
- Todas entradas incluídas

---

### 8. Interface do Badge

#### TC-3.6.0-030: Badge de Verificação Válida
**Objetivo:** Verificar exibição do badge de sucesso
**Passos:**
1. Verificar assinatura válida
2. Chamar `showVerificationResult('regionId', result)`
3. Verificar badge exibido

**Resultado Esperado:**
- Badge verde com ícone de check
- Texto "Verified"
- Posição top-right

---

#### TC-3.6.0-031: Badge de Assinatura Inválida
**Objetivo:** Verificar exibição do badge de erro
**Passos:**
1. Simular resultado inválido
2. Exibir resultado
3. Verificar badge

**Resultado Esperado:**
- Badge vermelho com X
- Texto "Invalid"

---

#### TC-3.6.0-032: Badge de Adulteração
**Objetivo:** Verificar exibição do badge de adulteração
**Passos:**
1. Detectar adulteração
2. Exibir resultado
3. Verificar badge

**Resultado Esperado:**
- Badge amarelo/laranja
- Texto "Tampered"
- Animação de shake

---

#### TC-3.6.0-033: Posicionamento do Badge
**Objetivo:** Verificar diferentes posições do badge
**Passos:**
1. Exibir badge com `position: 'bottom-left'`
2. Verificar posição

**Resultado Esperado:**
- Badge posicionado corretamente
- Classe CSS aplicada

---

#### TC-3.6.0-034: Auto-hide do Badge
**Objetivo:** Verificar ocultação automática
**Passos:**
1. Exibir badge com `autoHide: 3000`
2. Aguardar 3 segundos
3. Verificar se badge desapareceu

**Resultado Esperado:**
- Badge visível por 3 segundos
- Animação de fade-out
- Badge removido do DOM

---

#### TC-3.6.0-035: Timestamp no Badge
**Objetivo:** Verificar exibição de timestamp
**Passos:**
1. Exibir badge com `showTimestamp: true`
2. Verificar conteúdo

**Resultado Esperado:**
- Timestamp formatado exibido
- Data/hora atual

---

### 9. Exportação e Importação

#### TC-3.6.0-036: Exportar Registro
**Objetivo:** Verificar exportação de registro
**Passos:**
1. Criar registro de assinatura
2. Chamar `exportRecord(record)`
3. Verificar JSON

**Resultado Esperado:**
- JSON válido e formatado
- Todos campos presentes
- Indentação de 2 espaços

---

#### TC-3.6.0-037: Importar Registro
**Objetivo:** Verificar importação de registro
**Passos:**
1. Exportar registro
2. Chamar `importRecord(jsonString)`
3. Verificar objeto

**Resultado Esperado:**
- Objeto reconstituído
- Campos preservados

---

#### TC-3.6.0-038: Importar JSON Inválido
**Objetivo:** Verificar tratamento de JSON inválido
**Passos:**
1. Chamar `importRecord('invalid json')`
2. Verificar resultado

**Resultado Esperado:**
- Retorna `null`
- Sem exceção

---

### 10. Dark Mode

#### TC-3.6.0-039: Badge em Dark Mode
**Objetivo:** Verificar estilo do badge em dark mode
**Passos:**
1. Ativar dark mode
2. Exibir badge de verificação
3. Verificar estilos

**Resultado Esperado:**
- Cores adaptadas
- Contraste adequado
- Legibilidade mantida

---

#### TC-3.6.0-040: Painel de Verificação Dark Mode
**Objetivo:** Verificar painel em dark mode
**Passos:**
1. Ativar dark mode
2. Exibir painel de detalhes
3. Verificar estilos

**Resultado Esperado:**
- Fundo escuro
- Textos claros
- Bordas adaptadas

---

### 11. Responsividade

#### TC-3.6.0-041: Badge em Mobile
**Objetivo:** Verificar badge em tela pequena
**Passos:**
1. Redimensionar para 375px
2. Exibir badge
3. Verificar layout

**Resultado Esperado:**
- Badge compacto
- Timestamp oculto
- Legível

---

#### TC-3.6.0-042: Log de Auditoria Mobile
**Objetivo:** Verificar log em mobile
**Passos:**
1. Exibir log em tela 375px
2. Verificar layout

**Resultado Esperado:**
- Layout vertical
- Rolagem funcional
- Entradas legíveis

---

### 12. Acessibilidade

#### TC-3.6.0-043: ARIA no Badge
**Objetivo:** Verificar atributos ARIA
**Passos:**
1. Inspecionar badge gerado
2. Verificar atributos

**Resultado Esperado:**
- Role apropriado
- Labels descritivos
- Navegação por teclado

---

#### TC-3.6.0-044: Alto Contraste
**Objetivo:** Verificar modo alto contraste
**Passos:**
1. Ativar alto contraste do SO
2. Exibir badge
3. Verificar visibilidade

**Resultado Esperado:**
- Bordas mais grossas
- Cores adaptadas
- Legibilidade garantida

---

#### TC-3.6.0-045: Reduced Motion
**Objetivo:** Verificar animações reduzidas
**Passos:**
1. Ativar prefers-reduced-motion
2. Exibir badge com animação
3. Verificar comportamento

**Resultado Esperado:**
- Sem animações
- Transições removidas

---

### 13. Eventos

#### TC-3.6.0-046: Evento de Inicialização
**Objetivo:** Verificar evento de init
**Passos:**
1. Adicionar listener
2. Inicializar módulo
3. Verificar evento

**Resultado Esperado:**
- `apexsignature-verification-initialized` disparado
- `detail.regionId` presente

---

#### TC-3.6.0-047: Evento de Registro Criado
**Objetivo:** Verificar evento de criação
**Passos:**
1. Adicionar listener
2. Criar registro
3. Verificar evento

**Resultado Esperado:**
- `apexsignature-verification-record-created` disparado
- `detail.record` completo

---

### 14. Preparação para Certificado

#### TC-3.6.0-048: Preparar Dados de Certificado
**Objetivo:** Verificar estrutura para certificado
**Passos:**
1. Criar registro de assinatura
2. Chamar `prepareCertificateData(record)`
3. Verificar estrutura

**Resultado Esperado:**
- `version` presente
- `signatureHash` presente
- `signer` com dados
- `certificate` placeholder
- `_ready` é `false`

---

### 15. Integração

#### TC-3.6.0-049: Integração com Módulo Base
**Objetivo:** Verificar integração com apexSignature
**Passos:**
1. Modificar assinatura
2. Verificar log de auditoria

**Resultado Esperado:**
- Evento `apexsignature-change` capturado
- Entrada "signature_modified" no log

---

#### TC-3.6.0-050: Limpeza de Assinatura
**Objetivo:** Verificar registro de limpeza
**Passos:**
1. Limpar assinatura
2. Verificar log

**Resultado Esperado:**
- Entrada "signature_cleared" no log
- Registro atual limpo

---

---

## Critérios de Aceitação

### Funcionais

| Critério | Métrica |
|----------|---------|
| Hash SHA-256 | Gera hash consistente de 64 caracteres |
| Detecção de adulteração | 100% de detecção para dados modificados |
| Metadados | Coleta timestamp, IP, user agent |
| Log de auditoria | Persiste e recupera do localStorage |
| Badge | Exibe status correto para cada resultado |

### Não-Funcionais

| Critério | Métrica |
|----------|---------|
| Performance hash | < 100ms para assinatura típica |
| Coleta de IP | < 3s timeout |
| Responsividade | Funcional em 320px+ |
| Acessibilidade | WCAG 2.1 AA |

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
- [ ] Eventos APEX disparando
- [ ] Page Items to Submit ok
- [ ] Dark mode em todos módulos

### Compatibilidade

- [ ] Chrome 120+ funcional
- [ ] Firefox 120+ funcional
- [ ] Safari 17+ funcional
- [ ] Edge 120+ funcional
- [ ] APEX 24.2 ok
- [ ] Oracle 19c/21c/23ai ok

---

## Observações

1. **Segurança**: Hash SHA-256 fornece integridade, não autenticação
2. **Privacidade**: Coleta de IP/geolocalização requer consentimento
3. **Futuro**: Certificado digital requer backend e integração PKI
4. **Fallback**: Navegadores sem Web Crypto usam checksum simples

---

**Documento criado por:** Maxwell da Silva Oliveira
**Empresa:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
