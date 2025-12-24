# APEX Signature - Guia de Verificação de Assinaturas

**Versão:** 3.6.0
**Módulo:** apexsignature-verification.js

---

## Sumário

1. [Introdução](#introdução)
2. [Instalação](#instalação)
3. [Inicialização](#inicialização)
4. [Hash SHA-256](#hash-sha-256)
5. [Metadados de Auditoria](#metadados-de-auditoria)
6. [Registro de Assinatura](#registro-de-assinatura)
7. [Verificação de Integridade](#verificação-de-integridade)
8. [Comparação de Assinaturas](#comparação-de-assinaturas)
9. [Log de Auditoria](#log-de-auditoria)
10. [Interface do Badge](#interface-do-badge)
11. [Exportação e Importação](#exportação-e-importação)
12. [API Reference](#api-reference)
13. [Eventos](#eventos)
14. [Casos de Uso](#casos-de-uso)
15. [Segurança](#segurança)

---

## Introdução

O módulo de verificação de assinaturas fornece funcionalidades para garantir a integridade e autenticidade das assinaturas capturadas:

- **Hash SHA-256**: Geração de hash criptográfico para verificação de integridade
- **Metadados de Auditoria**: Coleta de timestamp, IP, user agent, geolocalização
- **Detecção de Adulteração**: Verificação se a assinatura foi modificada
- **Log de Auditoria**: Histórico completo de ações para compliance
- **Badge Visual**: Indicador de status de verificação na UI

---

## Instalação

### Arquivos Necessários

```html
<!-- CSS -->
<link rel="stylesheet" href="#APP_FILES#apexsignature-verification.css">

<!-- JavaScript -->
<script src="#APP_FILES#apexsignature-verification.js"></script>
```

### Dependências

- `apexsignature.js` (módulo base)
- Web Crypto API (nativo em navegadores modernos)

---

## Inicialização

### Básica

```javascript
// Inicializar verificação para uma região
apexSignatureVerification.init('MY_SIGNATURE_REGION');
```

### Com Opções

```javascript
apexSignatureVerification.init('MY_SIGNATURE_REGION', {
    // Coletar IP automaticamente
    includeIP: true,

    // Solicitar geolocalização
    includeGeolocation: false,

    // Verificar automaticamente ao modificar
    autoVerify: true
});
```

---

## Hash SHA-256

### Gerar Hash de Assinatura

```javascript
// Obter dados da assinatura (base64)
var signatureData = apexSignature.toDataURL('MY_SIGNATURE_REGION');

// Gerar hash SHA-256
apexSignatureVerification.generateHash(signatureData)
    .then(function(hash) {
        console.log('SHA-256 Hash:', hash);
        // Ex: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"
    });
```

### Gerar Hash do Canvas

```javascript
// Hash diretamente dos pixels do canvas
var canvas = document.querySelector('#MY_SIGNATURE_REGION canvas');

apexSignatureVerification.generateCanvasHash(canvas)
    .then(function(hash) {
        console.log('Canvas Hash:', hash);
    });
```

### Características do Hash

| Propriedade | Valor |
|-------------|-------|
| Algoritmo | SHA-256 |
| Tamanho | 256 bits (64 caracteres hex) |
| Determinístico | Mesmo input = mesmo output |
| Irreversível | Não é possível recuperar dados do hash |

---

## Metadados de Auditoria

### Coletar Metadados

```javascript
apexSignatureVerification.collectMetadata({
    includeIP: true,
    includeGeolocation: true
}).then(function(metadata) {
    console.log(metadata);
});
```

### Estrutura dos Metadados

```javascript
{
    // Identificação única
    id: "550e8400-e29b-41d4-a716-446655440000",

    // Timestamp
    timestamp: "2025-12-24T10:30:00.000Z",
    timestampUnix: 1735036200000,
    timezone: "America/Sao_Paulo",

    // Ambiente
    userAgent: "Mozilla/5.0...",
    platform: "Win32",
    language: "pt-BR",
    screenResolution: "1920x1080",
    colorDepth: 24,

    // Status
    cookiesEnabled: true,
    doNotTrack: null,
    online: true,

    // APEX
    apexAppId: "100",
    apexPageId: "10",
    apexSessionId: "1234567890",
    apexUsername: "ADMIN",

    // Rede (se habilitado)
    ipAddress: "200.100.50.25",

    // Localização (se habilitado e permitido)
    geolocation: {
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 50,
        timestamp: 1735036200000
    }
}
```

---

## Registro de Assinatura

### Criar Registro Completo

```javascript
var signatureData = apexSignature.toDataURL('MY_SIGNATURE_REGION');

apexSignatureVerification.createSignatureRecord('MY_SIGNATURE_REGION', signatureData, {
    includeIP: true,
    includeGeolocation: false,
    includeData: true  // Incluir imagem no registro
}).then(function(record) {
    console.log('Registro criado:', record);

    // Salvar no banco de dados
    apex.server.process('SAVE_SIGNATURE_RECORD', {
        x01: JSON.stringify(record)
    });
});
```

### Estrutura do Registro

```javascript
{
    regionId: "MY_SIGNATURE_REGION",
    signatureData: "data:image/png;base64,...",
    dataSize: 15420,
    createdAt: "2025-12-24T10:30:00.000Z",

    // Hash para verificação
    hash: "a591a6d40bf420404a011733cfb7b190...",
    hashAlgorithm: "SHA-256",

    // Metadados de auditoria
    metadata: { ... },

    // Status
    status: "valid",
    verified: true,
    verifiedAt: null
}
```

---

## Verificação de Integridade

### Verificar Hash

```javascript
// Verificar se assinatura atual corresponde ao hash armazenado
var currentData = apexSignature.toDataURL('MY_SIGNATURE_REGION');
var storedHash = 'a591a6d40bf420404a011733cfb7b190...';

apexSignatureVerification.verifyHash(currentData, storedHash)
    .then(function(result) {
        if (result.valid) {
            console.log('Assinatura íntegra!');
        } else {
            console.error('ALERTA: Assinatura foi adulterada!');
        }
    });
```

### Resultado da Verificação

```javascript
{
    valid: true,              // ou false
    status: "valid",          // "valid", "tampered", "invalid", "unknown"
    currentHash: "a591...",
    expectedHash: "a591...",
    message: "Signature integrity verified",
    timestamp: "2025-12-24T10:35:00.000Z"
}
```

### Verificar Registro Completo

```javascript
// Verificação completa incluindo metadados
apexSignatureVerification.verifyRecord(storedRecord, currentData)
    .then(function(result) {
        console.log('Verificações:', result.checks);
        console.log('Todas passaram?', result.valid);
    });
```

### Resultado da Verificação de Registro

```javascript
{
    recordId: "550e8400-e29b-41d4-a716-446655440000",
    checks: [
        {
            type: "hash_integrity",
            passed: true,
            details: { ... }
        },
        {
            type: "metadata_present",
            passed: true,
            details: {
                hasId: true,
                hasTimestamp: true,
                hasUserAgent: true
            }
        }
    ],
    valid: true,
    status: "valid",
    message: "All verification checks passed",
    timestamp: "2025-12-24T10:35:00.000Z"
}
```

---

## Comparação de Assinaturas

### Comparar Duas Assinaturas

```javascript
var signature1 = apexSignature.toDataURL('SIGNATURE_REGION_1');
var signature2 = apexSignature.toDataURL('SIGNATURE_REGION_2');

apexSignatureVerification.compareSignatures(signature1, signature2)
    .then(function(result) {
        console.log('Match exato?', result.exactMatch);
        console.log('Similaridade:', result.similarityPercent + '%');
    });
```

### Resultado da Comparação

```javascript
{
    exactMatch: false,
    hash1: "a591a6d40bf420404...",
    hash2: "b692b7e51cg531515...",
    visualSimilarity: 0.75,
    similarityPercent: 75,
    timestamp: "2025-12-24T10:40:00.000Z"
}
```

---

## Log de Auditoria

### Obter Log

```javascript
// Log completo
var log = apexSignatureVerification.getAuditLog('MY_SIGNATURE_REGION');

// Filtrado por ação
var creationLog = apexSignatureVerification.getAuditLog('MY_SIGNATURE_REGION', {
    action: 'signature_created'
});

// Filtrado por período
var recentLog = apexSignatureVerification.getAuditLog('MY_SIGNATURE_REGION', {
    from: '2025-12-01',
    to: '2025-12-31',
    limit: 50
});
```

### Estrutura de Entrada do Log

```javascript
{
    id: "550e8400-e29b-41d4-a716-446655440000",
    timestamp: "2025-12-24T10:30:00.000Z",
    action: "signature_created",
    data: {
        hash: "a591...",
        metadata: { ... }
    }
}
```

### Ações Registradas

| Ação | Descrição |
|------|-----------|
| `verification_initialized` | Módulo inicializado |
| `signature_created` | Registro de assinatura criado |
| `signature_modified` | Assinatura modificada |
| `signature_cleared` | Assinatura limpa |
| `verification_displayed` | Badge de verificação exibido |
| `audit_log_cleared` | Log de auditoria limpo |

### Limpar Log

```javascript
apexSignatureVerification.clearAuditLog('MY_SIGNATURE_REGION');
```

### Exportar Log

```javascript
var logJson = apexSignatureVerification.exportAuditLog('MY_SIGNATURE_REGION');
console.log(logJson);  // JSON formatado
```

---

## Interface do Badge

### Exibir Resultado de Verificação

```javascript
// Após verificar assinatura
apexSignatureVerification.verifyHash(currentData, storedHash)
    .then(function(result) {
        // Exibir badge
        apexSignatureVerification.showVerificationResult('MY_SIGNATURE_REGION', result, {
            position: 'top-right',   // top-right, top-left, bottom-right, bottom-left
            showTimestamp: true,
            autoHide: 5000           // Ocultar após 5 segundos (0 = não ocultar)
        });
    });
```

### Criar Badge Manualmente

```javascript
var badge = apexSignatureVerification.createVerificationBadge('valid', {
    validText: 'Verificado',
    showTimestamp: true
});

document.getElementById('badge-container').appendChild(badge);
```

### Status do Badge

| Status | Cor | Ícone | Texto Padrão |
|--------|-----|-------|--------------|
| `valid` | Verde | Checkmark | "Verified" |
| `invalid` | Vermelho | X | "Invalid" |
| `tampered` | Amarelo | Warning | "Tampered" |
| `pending` | Cinza | Clock | "Pending" |
| `unknown` | Roxo | Question | "Unknown" |

### Posições

| Posição | Descrição |
|---------|-----------|
| `top-right` | Superior direito (padrão) |
| `top-left` | Superior esquerdo |
| `bottom-right` | Inferior direito |
| `bottom-left` | Inferior esquerdo |
| `inline` | Inline (não absoluto) |

---

## Exportação e Importação

### Exportar Registro

```javascript
var record = apexSignatureVerification.getCurrentRecord('MY_SIGNATURE_REGION');
var json = apexSignatureVerification.exportRecord(record);

// Salvar no banco
apex.server.process('SAVE_RECORD', {
    x01: json
});
```

### Importar Registro

```javascript
// Carregar do banco
apex.server.process('LOAD_RECORD', {
    x01: recordId
}, {
    success: function(data) {
        var record = apexSignatureVerification.importRecord(data.json);
        if (record) {
            console.log('Registro carregado:', record);
        }
    }
});
```

---

## API Reference

### Constantes

```javascript
apexSignatureVerification.VERSION     // "3.6.0"

apexSignatureVerification.STATUS
    .VALID      // "valid"
    .INVALID    // "invalid"
    .TAMPERED   // "tampered"
    .UNKNOWN    // "unknown"
    .PENDING    // "pending"

apexSignatureVerification.VERIFICATION_TYPES
    .HASH       // "hash"
    .VISUAL     // "visual"
    .METADATA   // "metadata"
    .FULL       // "full"
```

### Métodos

| Método | Retorno | Descrição |
|--------|---------|-----------|
| `init(regionId, options)` | Object | Inicializa verificação |
| `generateHash(data)` | Promise<string> | Gera hash SHA-256 |
| `generateCanvasHash(canvas)` | Promise<string> | Hash dos pixels |
| `collectMetadata(options)` | Promise<object> | Coleta metadados |
| `createSignatureRecord(regionId, data, options)` | Promise<object> | Cria registro |
| `verifyHash(data, expectedHash)` | Promise<object> | Verifica hash |
| `verifyRecord(record, data)` | Promise<object> | Verifica registro |
| `compareSignatures(sig1, sig2)` | Promise<object> | Compara assinaturas |
| `getAuditLog(regionId, options)` | Array | Obtém log |
| `clearAuditLog(regionId)` | void | Limpa log |
| `exportAuditLog(regionId)` | string | Exporta log JSON |
| `showVerificationResult(regionId, result, options)` | Element | Exibe badge |
| `createVerificationBadge(status, options)` | Element | Cria badge |
| `exportRecord(record)` | string | Exporta registro JSON |
| `importRecord(json)` | Object | Importa registro |
| `prepareCertificateData(record)` | Object | Prepara para certificado |
| `getInstance(regionId)` | Object | Obtém instância |
| `getCurrentRecord(regionId)` | Object | Obtém registro atual |

---

## Eventos

### Lista de Eventos

| Evento | Dados | Descrição |
|--------|-------|-----------|
| `apexsignature-verification-initialized` | `{ regionId }` | Módulo inicializado |
| `apexsignature-verification-record-created` | `{ record }` | Registro criado |

### Escutar Eventos

```javascript
// Via APEX Dynamic Action
// Evento: apexsignature-verification-record-created
// Selection Type: Region
// Region: MY_SIGNATURE_REGION

// Via JavaScript
document.getElementById('MY_SIGNATURE_REGION')
    .addEventListener('apexsignature-verification-record-created', function(e) {
        var record = e.detail.record;
        console.log('Novo registro:', record.hash);
    });
```

---

## Casos de Uso

### 1. Contrato Digital com Verificação

```javascript
// Ao assinar contrato
function signContract() {
    var signatureData = apexSignature.toDataURL('CONTRACT_SIGNATURE');

    apexSignatureVerification.createSignatureRecord('CONTRACT_SIGNATURE', signatureData, {
        includeIP: true,
        includeGeolocation: true
    }).then(function(record) {
        // Salvar contrato e registro
        apex.server.process('SIGN_CONTRACT', {
            x01: $v('P10_CONTRACT_ID'),
            x02: signatureData,
            x03: JSON.stringify(record)
        }, {
            success: function() {
                apex.message.showPageSuccess('Contrato assinado com sucesso!');
            }
        });
    });
}
```

### 2. Verificar Assinatura Existente

```javascript
// Ao carregar documento
function verifyExistingSignature(storedRecord, signatureImage) {
    apexSignatureVerification.verifyRecord(storedRecord, signatureImage)
        .then(function(result) {
            apexSignatureVerification.showVerificationResult('SIGNATURE_VIEW', result, {
                position: 'bottom-right',
                showTimestamp: true
            });

            if (!result.valid) {
                apex.message.alert('ATENÇÃO: Esta assinatura pode ter sido adulterada!');
            }
        });
}
```

### 3. Relatório de Auditoria

```javascript
// Gerar relatório
function generateAuditReport() {
    var log = apexSignatureVerification.getAuditLog('MY_SIGNATURE_REGION');

    var report = {
        generatedAt: new Date().toISOString(),
        totalEntries: log.length,
        entries: log
    };

    // Download como JSON
    var blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'audit_report_' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
}
```

### 4. Comparar com Assinatura de Referência

```javascript
// Verificar se assinatura atual é similar à assinatura cadastrada
function verifyAgainstReference(referenceSignature) {
    var currentSignature = apexSignature.toDataURL('CURRENT_SIGNATURE');

    apexSignatureVerification.compareSignatures(referenceSignature, currentSignature)
        .then(function(result) {
            if (result.similarityPercent >= 80) {
                console.log('Assinatura parece autêntica');
            } else {
                console.warn('Assinatura pode ser diferente da referência');
            }
        });
}
```

---

## Segurança

### Considerações Importantes

1. **Hash Não é Criptografia**
   - SHA-256 garante integridade, não confidencialidade
   - Não substitui assinatura digital com certificado

2. **Armazenamento**
   - Armazene hashes e registros no banco de dados
   - LocalStorage é apenas para log temporário

3. **Coleta de IP/Geolocalização**
   - Requer consentimento do usuário (LGPD/GDPR)
   - Documente o propósito da coleta

4. **Limitações**
   - Não previne captura de tela
   - Não detecta falsificação manual de assinatura

### Boas Práticas

```javascript
// 1. Sempre criar registro ao assinar
apexSignatureVerification.createSignatureRecord(regionId, data, {
    includeIP: true
}).then(function(record) {
    // Salvar no banco imediatamente
    saveToDatabase(record);
});

// 2. Verificar antes de aceitar
apexSignatureVerification.verifyHash(data, storedHash)
    .then(function(result) {
        if (!result.valid) {
            rejectSignature();
        }
    });

// 3. Manter log de auditoria
// Log é mantido automaticamente pelo módulo
```

---

## Preparação para Certificado Digital (Futuro)

```javascript
var record = apexSignatureVerification.getCurrentRecord('MY_SIGNATURE_REGION');
var certData = apexSignatureVerification.prepareCertificateData(record);

console.log(certData);
// {
//     version: "3.6.0",
//     signatureHash: "a591...",
//     hashAlgorithm: "SHA-256",
//     signer: { ... },
//     certificate: {
//         issuer: null,
//         serialNumber: null,
//         ...
//         _ready: false,
//         _message: "Certificate integration not yet implemented"
//     }
// }
```

A integração com ICP-Brasil e certificados A1/A3 será implementada em versão futura.

---

**Autor:** Maxwell da Silva Oliveira
**Empresa:** M&S do Brasil LTDA
**LinkedIn:** /maxwbh
