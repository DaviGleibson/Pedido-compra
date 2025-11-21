# PurchaseFlow - Purchase Order Management System

## 🔐 Credenciais de Teste

Para fazer login no sistema, use:

**Email:** `teste@exemplo.com`  
**Senha:** `Senha123!`

## Visão Geral
Sistema moderno de gerenciamento de pedidos de compra construído com Next.js 14, TypeScript e Tailwind CSS.

## Funcionalidades

### 1. Página Inicial (`/`)
- Seção hero com gradientes
- Cards de recursos
- Botões de call-to-action
- Design responsivo

### 2. Login (`/login`)
- Interface moderna com efeitos interativos
- Fundo gradiente animado ao movimento do mouse
- Botões de login social (Instagram, LinkedIn, Facebook)
- Campos de entrada customizados com animações
- Validação de formulário
- Notificações toast para feedback
- Navegação suave para o dashboard

### 3. Dashboard (`/dashboard`)
- Visão geral de pedidos em grid/cards
- Estatísticas em tempo real
- Busca e filtros
- Ações: visualizar, editar e deletar pedidos
- Design responsivo

### 4. Formulário de Novo Pedido (Multi-etapas)
- Etapa 1: Selecionar empresa emissora
- Etapa 2: Selecionar fornecedor
- Etapa 3: Informações do comprador
- Etapa 4: Usuário logado (somente leitura)
- Etapa 5: Termos e tipo de pagamento
- Etapa 6: Itens de linha de produto com cálculo automático

## Stack Técnica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Ícones**: Lucide React

## Como Executar

```bash
npm install
npm run dev
```

Navegue para:
- `/` - Página inicial
- `/login` - Página de login (use as credenciais acima)
- `/dashboard` - Dashboard de pedidos

## Recursos do Componente de Login

- Efeitos de hover interativos
- Inputs animados
- Botões de login social com animações
- Design responsivo
- Tema escuro moderno
- Validação de formulário
- Notificações toast
