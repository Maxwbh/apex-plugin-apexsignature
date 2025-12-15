# Plano de Teste - APEX Signature v2.0.0

## Task 1: Atualização da Biblioteca signature_pad para v5.0.4

**Data:** 2025-12-15
**Responsável:** Maxwell da Silva Oliveira - M&S do Brasil LTDA
**LinkedIn:** /maxwbh

---

## 1. Resumo das Alterações

| Componente | Versão Anterior | Versão Atual |
|------------|-----------------|--------------|
| signature_pad.js | 1.5.3 (2016) | 5.0.4 (2024) |
| apexsignature.js | 1.1 | 2.0.0 |
| Plugin | 1.1 | 2.0.0 |

### Principais Mudanças:
- Suporte a Pointer Events API (melhor handling de touch/stylus)
- Suporte a sensibilidade de pressão
- Novo sistema de eventos (`beginStroke`, `endStroke`)
- Exportação para SVG
- Throttling para melhor performance
- API APEX Region para acesso programático

---

## 2. Ambiente de Teste

### Requisitos Mínimos:
- Oracle Database: 19c, 21c ou 23ai
- Oracle APEX: 21.1 ou superior (recomendado 24.2)
- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Dispositivos para Teste:
- [ ] Desktop (mouse)
- [ ] Laptop com touchpad
- [ ] Tablet (touch)
- [ ] Smartphone (touch)
- [ ] Dispositivo com stylus/caneta

---

## 3. Casos de Teste

### CT-01: Carregamento do Plugin
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar se o plugin carrega corretamente |
| **Pré-condição** | Plugin instalado na aplicação APEX |
| **Passos** | 1. Acessar página com região Signature<br>2. Abrir DevTools (F12)<br>3. Verificar console |
| **Resultado Esperado** | Canvas renderizado, sem erros no console |
| **Critério de Aceite** | Zero erros JavaScript |

### CT-02: Desenho com Mouse
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar funcionamento básico de desenho |
| **Pré-condição** | Plugin carregado |
| **Passos** | 1. Clicar e arrastar no canvas<br>2. Desenhar uma assinatura |
| **Resultado Esperado** | Linha suave aparece seguindo o mouse |
| **Critério de Aceite** | Desenho responsivo e fluido |

### CT-03: Desenho com Touch
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar suporte a touch em dispositivos móveis |
| **Pré-condição** | Dispositivo touch |
| **Passos** | 1. Tocar e arrastar no canvas<br>2. Desenhar assinatura com dedo |
| **Resultado Esperado** | Linha suave aparece seguindo o toque |
| **Critério de Aceite** | Sem scroll da página durante desenho |

### CT-04: Desenho com Stylus/Caneta
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar suporte a stylus com pressão |
| **Pré-condição** | Dispositivo com stylus (iPad, Surface, etc.) |
| **Passos** | 1. Desenhar com pressão leve<br>2. Desenhar com pressão forte |
| **Resultado Esperado** | Variação na espessura da linha conforme pressão |
| **Critério de Aceite** | Linhas mais finas/grossas conforme pressão |

### CT-05: Botão Limpar
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar funcionamento do botão Clear |
| **Pré-condição** | Canvas com assinatura |
| **Passos** | 1. Desenhar assinatura<br>2. Clicar no botão Limpar |
| **Resultado Esperado** | Canvas limpo, evento `apexsignature-cleared` disparado |
| **Critério de Aceite** | Canvas vazio, evento capturável em Dynamic Action |

### CT-06: Botão Salvar - Assinatura Válida
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar salvamento de assinatura |
| **Pré-condição** | Canvas com assinatura |
| **Passos** | 1. Desenhar assinatura<br>2. Clicar no botão Salvar |
| **Resultado Esperado** | Assinatura salva no banco, evento `apexsignature-saved-db` disparado |
| **Critério de Aceite** | Registro criado na collection/tabela, evento capturável |

### CT-07: Botão Salvar - Assinatura Vazia
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar validação de assinatura vazia |
| **Pré-condição** | Canvas vazio |
| **Passos** | 1. Clicar no botão Salvar sem desenhar |
| **Resultado Esperado** | Mensagem de alerta exibida |
| **Critério de Aceite** | Alert exibido com mensagem configurada |

### CT-08: Spinner de Loading
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar exibição do spinner |
| **Pré-condição** | Atributo "Show WaitSpinner" = true |
| **Passos** | 1. Desenhar assinatura<br>2. Clicar em Salvar |
| **Resultado Esperado** | Spinner exibido durante salvamento |
| **Critério de Aceite** | Spinner aparece e desaparece após salvar |

### CT-09: Evento Dynamic Action - Saved
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar disparo de evento após salvar (Bug #20/#21) |
| **Pré-condição** | Dynamic Action configurada para `apexsignature-saved-db` |
| **Passos** | 1. Configurar DA com JavaScript Alert<br>2. Salvar assinatura |
| **Resultado Esperado** | Dynamic Action executada |
| **Critério de Aceite** | Alert do DA exibido após salvamento |

### CT-10: APEX Region API
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar API programática da região |
| **Pré-condição** | Plugin carregado |
| **Passos** | Executar no console:<br>`apex.region("REGION_ID").isEmpty()`<br>`apex.region("REGION_ID").clear()`<br>`apex.region("REGION_ID").toDataURL()` |
| **Resultado Esperado** | Métodos executam corretamente |
| **Critério de Aceite** | Retornos corretos para cada método |

### CT-11: Exportação SVG
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar nova funcionalidade de exportação SVG |
| **Pré-condição** | Canvas com assinatura |
| **Passos** | Executar: `apex.region("REGION_ID").toSVG()` |
| **Resultado Esperado** | String SVG válida retornada |
| **Critério de Aceite** | SVG renderizável em navegador |

### CT-12: Responsividade
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar adaptação em diferentes tamanhos de tela |
| **Pré-condição** | Tela menor que dimensões do canvas |
| **Passos** | 1. Acessar em dispositivo móvel<br>2. Redimensionar janela desktop |
| **Resultado Esperado** | Canvas se adapta ao container |
| **Critério de Aceite** | Sem overflow, desenho funcional |

### CT-13: Modo Debug
| Item | Descrição |
|------|-----------|
| **Objetivo** | Verificar logs em modo debug |
| **Pré-condição** | Atributo "Logging" = true |
| **Passos** | 1. Carregar página<br>2. Interagir com plugin |
| **Resultado Esperado** | Logs detalhados no console |
| **Critério de Aceite** | Mensagens claras para debugging |

---

## 4. Testes de Regressão

### Compatibilidade com Versão Anterior:
- [ ] Aplicações existentes continuam funcionando
- [ ] Eventos jQuery ainda disparam (`$().trigger()`)
- [ ] Atributos do plugin mantidos

### Navegadores:
- [ ] Chrome (Windows/Mac/Linux)
- [ ] Firefox (Windows/Mac/Linux)
- [ ] Safari (Mac/iOS)
- [ ] Edge (Windows)
- [ ] Samsung Internet (Android)

---

## 5. Testes de Performance

| Métrica | Limite Aceitável |
|---------|------------------|
| Tempo de carregamento | < 500ms |
| Latência de desenho | < 16ms (60fps) |
| Tamanho do bundle | < 50KB |
| Memória em uso | < 10MB |

---

## 6. Checklist de Aceite

- [ ] Todos os casos de teste passaram
- [ ] Zero erros no console em produção
- [ ] Performance dentro dos limites
- [ ] Compatível com APEX 24.2
- [ ] Documentação atualizada

---

## 7. Notas de Implementação

### Arquivos Modificados:
1. `server/js/signature_pad.js` - Atualizado para v5.0.4
2. `server/js/signature_pad.min.js` - Versão minificada
3. `server/js/apexsignature.js` - Refatorado para nova API
4. `server/js/apexsignature.min.js` - Versão minificada
5. `apexplugin.json` - Metadados atualizados

### Mudanças de Breaking:
- Nenhuma - compatibilidade retroativa mantida

### Novos Recursos:
- `apex.region("ID").toSVG()` - Exportar como SVG
- Eventos nativos APEX (`apex.event.trigger`)
- Suporte a pressão de stylus
- Pointer Events API

---

**Aprovado por:** ________________________
**Data:** ________________________
