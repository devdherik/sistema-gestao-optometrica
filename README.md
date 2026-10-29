# Sistema de Gestão Optométrica 👁️🩺

> Sistema web *white label* para gestão de pacientes, atendimentos clínicos e emissão de prescrições optométricas digitais.

---

## 🎯 Sobre o Projeto

O **Sistema de Gestão Optométrica** foi concebido para modernizar a rotina de consultórios de optometria. Ele substitui os tradicionais receituários de papel por um fluxo digital ágil, seguro e integrado às óticas parceiras.

### Principais Benefícios
- **Adequado ao Fluxo Real:** Desenvolvido a partir da observação de atendimentos reais (caso de uso inicial: *Opto Prazeres*).
- **Sem Burocracia:** Flexibilidade total no preenchimento de campos clínicos durante o exame.
- **Histórico Imediato:** Consulta rápida da evolução refrativa do paciente em atendimentos anteriores.
- **Receituário Digital e Legível:** Emissão de receitas padronizadas para confecção de óculos e lentes de contato sem erros de interpretação.
- **Arquitetura White Label:** Código neutro e modular, pronto para ser personalizado para diferentes profissionais ou redes de consultórios.

---

## 🚀 Tecnologias Utilizadas

### Backend (`Optometria.Api`)
- **[.NET 10](https://dotnet.microsoft.com/)** (C# 13, ASP.NET Core Web API)
- **[Entity Framework Core 10](https://learn.microsoft.com/ef/core/)** com **SQLite**
- **Swagger / OpenAPI** para testes e exploração de rotas
- Arquitetura RESTful com DTOs e entidades embutidas (*Owned Types*)

### Frontend (`optometria-web`)
- **[React 19](https://react.dev/)**
- **[Vite 8](https://vitejs.dev/)**
- **[React Router DOM v7](https://reactrouter.com/)**
- **[Oxlint](https://oxc.rs/)** para linting de alta performance

---

## 📂 Estrutura do Repositório

```text
├── docs/                               # Documentação de requisitos, arquitetura e roadmap
│   ├── levantamento-requisitos-v0.1.md  # Requisitos de domínio levantados em campo
│   ├── visao-geral-e-arquitetura.md    # Arquitetura, modelo de dados e endpoints REST
│   └── roadmap-e-status.md             # Matriz de progresso e próximos passos
├── Optometria.Api/                     # Backend ASP.NET Core Web API
│   ├── Controllers/                    # Endpoints (Pacientes, Atendimentos, Óticas)
│   ├── Models/                         # Entidades de domínio (Paciente, Atendimento, etc.)
│   ├── DTOs/                           # Objetos de transferência de dados
│   ├── data/                           # OptometriaDbContext e configurações EF Core
│   └── Migrations/                     # Histórico de migrações do banco SQLite
└── optometria-web/                     # Frontend SPA React + Vite
    ├── src/
    │   ├── services/                   # Integração com a API REST
    │   └── App.jsx                     # Componente raiz da aplicação
    └── package.json
```

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
- [.NET SDK 10+](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) e npm

### 1. Executando o Backend (API)
```bash
# Entre na pasta da API
cd Optometria.Api

# Aplique as migrações no banco SQLite (cria o arquivo optometria.db automaticamente)
dotnet ef database update

# Inicie o servidor da API
dotnet run
```
A API estará acessível em `http://localhost:5145` (ou porta indicada no terminal).  
Documentação interativa Swagger: **`http://localhost:5145/swagger`**.

### 2. Executando o Frontend (Web)
```bash
# Em outro terminal, entre na pasta do frontend
cd optometria-web

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento Vite
npm run dev
```
O frontend estará acessível em: **`http://localhost:5173`**.

---

## 📚 Documentação Adicional

Para detalhes aprofundados sobre regras de negócio, modelagem e decisões técnicas, consulte os documentos na pasta `docs/`:
- [Visão Geral e Arquitetura Técnica](docs/visao-geral-e-arquitetura.md)
- [Levantamento de Requisitos v0.1](docs/levantamento-requisitos-v0.1.md)
- [Status de Implementação e Roadmap](docs/roadmap-e-status.md)
