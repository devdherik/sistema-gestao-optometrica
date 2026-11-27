
# Sistema de Gestão Optométrica

> **Status do Projeto:**  **MVP Finalizado (v1.0)** — Todos os 19 requisitos funcionais implementados e validados.

## Visão geral

Sistema web completo voltado para a rotina clínica do profissional de optometria. Informatiza o fluxo de ponta a ponta: cadastro de pacientes, busca rápida, prontuário individualizado com código formatado e idade dinâmica, registro de consultas clínicas com medições refrativas (OD/OE), linha do tempo do histórico de atendimentos, vínculo opcional com óticas parceiras e emissão de prescrição óptica formatada em folha A4 pronta para impressão.

## Funcionalidades do MVP

- **Painel Inicial (Dashboard):**
  - Indicadores operacionais consolidados em tempo real: total de pacientes, consultas no mês, consultas hoje e total de óticas.
  - Ações rápidas para iniciar novo atendimento ou cadastrar novo paciente.
  - Painel com os atendimentos mais recentes realizados e atalho para o prontuário.
- **Gestão de Pacientes e Prontuário:**
  - Cadastro e edição com máscara automática para telefone/WhatsApp `(00) 00000-0000`.
  - Busca textual rápida combinada com refinamento instantâneo por nome e telefone.
  - Tabela com ordenação (Nome A-Z, Nome Z-A, Mais recentes) e paginação (10 pacientes por página).
  - Ficha individual de prontuário com código clínico padronizado (`PAC-XXXXX`) e cálculo automático de idade.
  - Exclusão com confirmação em duas etapas e bloqueio de exclusão para pacientes que possuem consultas vinculadas.
- **Atendimentos Clínicos e Refração:**
  - Seletor rápido de pacientes por busca em tempo real para iniciar novos atendimentos.
  - Ficha clínica completa: anamnese/queixa principal e vínculo opcional de ótica parceira (ou atendimento particular).
  - Tabela refrativa detalhada para Olho Direito (OD) e Olho Esquerdo (OE): Esférico, Cilíndrico, Eixo, Acuidade Visual (Longe/Perto), DNP monocular e Adição.
  - Medição de Distância Pupilar total (DP binocular) e flag de "Sem necessidade de nova correção".
  - Conduta óptica com seleção múltipla de tipos de lentes e tratamentos via chips interativos.
  - Cálculo inteligente automático da data sugerida para retorno (+1 ano a partir da consulta).
  - Histórico clínico exibido em linha do tempo cronológica no prontuário, com comparação direta de exames anteriores.
- **Emissão e Impressão de Prescrição Optométrica:**
  - Modal de pré-visualização e conferência da receita médica formatada.
  - Formatação visual automática de dioptrias (+/-, 2 decimais) e graus de eixo (`°`).
  - Impressão isolada via iframe em layout A4 retrato sem interferência da aplicação e sem páginas em branco.
- **Gestão de Óticas Parceiras:**
  - Modal global acessível em qualquer tela pela barra de navegação superior (`Navbar`).
  - Cadastro, edição, contador dinâmico de parceiras e busca em tempo real.
  - Exclusão com dupla confirmação e proteção contra exclusão de óticas com histórico de atendimentos.

## Tecnologias

- Backend: ASP.NET Core (.NET 10), Entity Framework Core, SQLite e Swagger.
- Frontend: React 19, Vite 8, Lucide React (ícones) e React Router (dependência instalada).

## Documentação do Projeto

A documentação detalhada do sistema está centralizada na pasta [`docs/`](docs/):

| Documento | Descrição |
|---|---|
| [docs/README.md](docs/README.md) | Índice geral e visão de entrega do MVP |
| [docs/requisitos-v1.md](docs/requisitos-v1.md) | Especificação de requisitos (RF-01 a RF-19) e regras de negócio (RN-01 a RN-09) |
| [docs/referencia-tecnica.md](docs/referencia-tecnica.md) | Arquitetura técnica, diagrama ER, catálogo de componentes e integração |
| [docs/glossario-clinico.md](docs/glossario-clinico.md) | Glossário de termos optométricos (esférico, cilíndrico, eixo, DNP, etc.) |

## Estrutura do repositório

```text
.
├── docs/                   # Documentação do projeto (requisitos, arquitetura, glossário)
├── Optometria.Api/          # API ASP.NET Core (.NET 10)
│   ├── Controllers/        # Endpoints de pacientes, óticas e atendimentos
│   ├── DTOs/               # Dados de entrada e saída da API
│   ├── Models/             # Entidades do sistema
│   ├── data/               # Contexto do Entity Framework Core
│   ├── Migrations/         # Migrações do banco de dados
│   ├── Properties/         # Perfis de execução local
│   ├── appsettings.json    # Configuração da conexão SQLite
│   └── Program.cs          # Configuração e inicialização da API
├── optometria-web/         # Frontend React 19 + Vite 8
│   ├── public/             # Arquivos estáticos
│   └── src/                # Componentes (Navbar, Modais, Views), estilos e serviços
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
