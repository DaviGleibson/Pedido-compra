# Instruções – Acesso ao Login, Empresa (Emitente) e TOP

> Este documento consolida as orientações enviadas pelo usuário sobre como o fluxo de autenticação e as configurações administrativas funcionam no ambiente externo (`cabecaatacado.ddns.net`). Ele não representa a implementação atual deste repositório, mas serve como referência quando for necessário integrar com o backend real.

---

## 1. Acesso ao Login

**URL principal**

- Login Web: `http://cabecaatacado.ddns.net:5000/login`
- Após autenticar, o frontend redireciona automaticamente para `/dashboard`.
- Demais rotas são protegidas: exigem `token` (JWT) salvo no `localStorage`.

**Componente responsável**

- Arquivo (projeto original): `frontend/src/pages/Login.js`
- Campos:
  - Tipo de Acesso: `funcionario` ou `fornecedor`
  - Matrícula (funcionário) ou Número do Documento (fornecedor)
  - Senha
- Botão **Entrar** executa `handleLogin`, que envia `POST /api/auth/login`.

**Endpoint de autenticação**

```
POST ${getApiUrl()}/api/auth/login
Payload:
{
  "matricula": "<valor>",
  "senha": "<valor>",
  "tipo": "funcionario" | "fornecedor"
}

Resposta 200:
{
  "token": "<JWT>",
  "user": {
    "id": ...,
    "nome": "...",
    "matricula": "...",
    "tipo": "funcionario" | "fornecedor",
    "id_nivel_acesso": ...
  }
}
```

Fluxo pós-login:

1. Frontend salva `token` e `user` via `AuthContext.login`.
2. `window.location.href = '/dashboard'`.

**Validações**

- 401 → “Credenciais inválidas!”
- Erro de rede → “Erro ao fazer login. Tente novamente.”
- Botão fica desabilitado enquanto `loading = true`.

**Como testar**

1. Iniciar backend e frontend.
2. Abrir `/login`.
3. Selecionar tipo de acesso.
4. Informar credenciais de `funcionario` (senha MD5) ou `fornecedor` (texto).
5. Conferir se `token` foi salvo no `localStorage`.

---

## 2. Configuração de Empresa (Emitente) e TOP padrão

- Página: `/configuracoes` (somente administradores – `hasAdminAccess()`).
- Componente original: `frontend/src/pages/SettingsPage.js`.
- Botões principais: “← Voltar” e “Salvar”.

### 2.1 Dados manipulados

- Contato (telefone, e-mail, WhatsApp)
- Endereço
- Redes sociais
- Parametrização de delivery
- TOP padrão (Tipo de Operação)
- Emitente padrão
- Tipo de pagamento padrão

### 2.2 Carregamento de listas (todas autenticadas)

| Dado            | Endpoint                                     |
|-----------------|----------------------------------------------|
| TOPs            | `GET /api/top`                               |
| Emitentes       | `GET /api/emitente`                          |
| Tipos Pagamento | `GET /api/tipo-pagamento/por-empresa?id_emitente=` |
| Config salvas   | `GET /api/configuracao`                      |

> Observação: a lista de tipos de pagamento depende do `id_emitente`.

### 2.3 Emitente padrão

1. Abrir `/configuracoes` como admin.
2. Seção “Configurações de Emitente” → selecionar emitente.
3. Sistema salva objeto `{ id, razao_social }`:
   - Estado React `emitenteSettings.emitentePadrao`
   - `localStorage` (`emitenteSettings`)
   - Backend (`configuracoes_sistema.emitente_padrao`)
4. Ao selecionar, chama automaticamente `loadTiposPagamentoPorEmpresa`.

### 2.4 TOP padrão

1. Seção “Configurações de TOP”.
2. Combo mostra `ID - Descrição`.
3. Salvamento:
   - Estado `topSettings.topPadrao`
   - `localStorage` (`topSettings`)
   - Backend (`configuracoes_sistema.top_padrao`)
4. Define regras de estoque (ex. TOP 1809 apenas reserva; outras dão baixa).

### 2.5 Tipo de pagamento padrão

1. Depois de escolher emitente, selecionar o tipo na seção correspondente.
2. Salva em `tipoPagamentoSettings.tipoPagamentoPadrao`, `localStorage` e backend (`tipo_pagamento_padrao`).
3. Dashboard usa esse tipo para montar pedidos automaticamente.

### 2.6 Salvar configurações

Ao clicar “Salvar”:

1. Monta payload:

```json
{
  "topPadrao": {...},
  "emitentePadrao": {...},
  "tipoPagamentoPadrao": {...},
  "deliverySettings": {...}
}
```

2. Envia `POST /api/configuracao`.
3. Persiste dados extras no localStorage (`storeContactInfo`, `deliverySettings`, etc.).
4. Mostra “Configurações salvas com sucesso!”.

### 2.7 Carregar configurações

O dashboard (`Home.js`) faz:

1. `GET /api/configuracao` ao montar.
2. Aplica `emitente_padrao`, `top_padrao`, `tipo_pagamento_padrao`.
3. Usa esses parâmetros em `GET /api/produtos/ecommerce?id_emitente=<>&id_tipo_pagamento=<>`.
4. Persistência de filtros em `localStorage` (`ecommerce_filters`).

---

## 3. Endpoints envolvidos

| Recurso              | Método | URL                                                                           | Autenticação |
|----------------------|--------|-------------------------------------------------------------------------------|--------------|
| Login                | POST   | `/api/auth/login`                                                             | Não          |
| Usuário atual        | GET    | `/api/auth/me`                                                                | Bearer Token |
| Configurações (GET)  | GET    | `/api/configuracao`                                                           | Bearer Token |
| Configurações (POST) | POST   | `/api/configuracao`                                                           | Bearer Token |
| TOPs                 | GET    | `/api/top`                                                                    | Bearer Token |
| Emitentes            | GET    | `/api/emitente`                                                               | Bearer Token |
| Tipos Pagamento      | GET    | `/api/tipo-pagamento/por-empresa?id_emitente=`                                | Bearer Token |
| Produtos             | GET    | `/api/produtos/ecommerce?id_emitente=&id_tipo_pagamento=`                     | Bearer Token |

**Observações**

- Rotas protegidas usam middleware `authenticate`.
- Tokens expiram em 8h.
- Fornecedores → senha em texto (`senha_cotacao`), funcionários → MD5.

---

## 4. Checklist rápido

### Login
- [ ] Backend `/api/auth/login` ativo
- [ ] Tabela `funcionario` com senha MD5
- [ ] Tabela `fornecedor` com `senha_cotacao`
- [ ] `JWT_SECRET` definido
- [ ] `token` salvo no `localStorage`

### Configurações
- [ ] Admin acessa `/configuracoes`
- [ ] Combo TOP carrega (`GET /api/top`)
- [ ] Combo emitentes carrega (`GET /api/emitente`)
- [ ] Combo tipos pagamento (após emitente)
- [ ] Botão Salvar envia `POST /api/configuracao`
- [ ] Dashboard aplica TOP/Emitente/Tipo padrão

### Produtos
- [ ] `/api/produtos/ecommerce` aceita `id_emitente`/`id_tipo_pagamento`
- [ ] Estoque/preço respeitam regra da TOP
- [ ] Pedido usa TOP e emitente configurados

---

## 5. Referências de código (projeto original)

- Login Frontend: `frontend/src/pages/Login.js`
- Auth Context: `frontend/src/contexts/AuthContext.js`
- Dashboard: `frontend/src/pages/Home.js`
- Configurações Admin: `frontend/src/pages/SettingsPage.js`
- Auth Controller: `backend/controllers/authController.js`
- Configurações Controller: `backend/controllers/configuracaoController.js`
- TOP Controller: `backend/controllers/topController.js`
- Emitente Controller: `backend/controllers/emitenteController.js`
- Tipo Pagamento Controller: `backend/controllers/tipoPagamentoController.js`
- Pedido Controller: `backend/controllers/pedidoController.js`

---

> **Resumo:** Com estes passos é possível configurar credenciais, definir emitente/TOP/tipo de pagamento padrão e garantir que o catálogo de produtos carregue com os parâmetros corretos no ambiente de produção citado.

