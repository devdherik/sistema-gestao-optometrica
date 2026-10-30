
# Sistema de Gestão Optométrica

## Visão geral

Sistema web voltado para a rotina de atendimento optométrico. Permite cadastrar pacientes, registrar consultas clínicas com medições refrativas (OD/OE) e vincular atendimentos a óticas parceiras.

## Tecnologias

- Backend: ASP.NET Core (.NET 10), Entity Framework Core, SQLite e Swagger.
- Frontend: React 19, Vite 8 e React Router (dependência instalada).

## Estrutura do repositório

```text
.
├── Optometria.Api/          # API ASP.NET Core
│   ├── Controllers/        # Endpoints de pacientes, óticas e atendimentos
│   ├── DTOs/               # Dados de entrada e saída da API
│   ├── Models/             # Entidades do sistema
│   ├── data/               # Contexto do Entity Framework Core
│   ├── Migrations/         # Migrações do banco de dados
│   ├── Properties/         # Perfis de execução local
│   ├── appsettings.json    # Configuração da conexão SQLite
│   └── Program.cs          # Configuração e inicialização da API
├── optometria-web/         # Frontend React
│   ├── public/             # Arquivos estáticos
│   └── src/                # Componentes, estilos e serviços de acesso à API
├── dotnet-tools.json       # Manifesto da ferramenta dotnet-ef
└── README.md
```

## Como executar

### Pré-requisitos

| Ferramenta | Versão mínima | Verificar se já tem | Download |
|---|---|---|---|
| .NET SDK | 10.0 | `dotnet --version` | [dotnet.microsoft.com](https://dotnet.microsoft.com/download) |
| Node.js | 20.19 | `node -v` | [nodejs.org](https://nodejs.org) |

O Node.js já inclui o npm, que é usado para instalar as dependências do frontend. As demais tecnologias (React, Vite, Entity Framework, SQLite, Swagger) são baixadas automaticamente pelos comandos de instalação descritos abaixo.

### Backend

Em um terminal, a partir da raiz do repositório:

```powershell
dotnet tool install --global dotnet-ef --version 10.0.12
cd Optometria.Api
dotnet restore
dotnet ef database update
dotnet run --launch-profile http
```

A migração cria ou atualiza o arquivo `Optometria.Api/optometria.db`, conforme a conexão definida em `appsettings.json`. Não é necessário instalar um servidor de banco de dados.

A API fica disponível em http://localhost:5145/api e o Swagger em http://localhost:5145/swagger. O perfil `http` ativa o ambiente de desenvolvimento, no qual o Swagger está habilitado.

### Frontend

Mantenha o backend em execução e abra outro terminal na raiz do repositório:

```powershell
cd optometria-web
npm install
npm run dev -- --port 5173 --strictPort
```

Acesse http://localhost:5173. Os serviços em `src/services/api.js` apontam para `http://localhost:5145/api`, e a API permite requisições da origem `http://localhost:5173` via CORS; por isso, mantenha essas portas durante a execução local.
