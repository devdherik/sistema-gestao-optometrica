# Referência Técnica

Documentação da arquitetura do sistema, modelagem de dados e padrões de comunicação entre backend e frontend. Serve como guia para desenvolvedores entenderem o fluxo de dados e a organização interna do código.

---

## 1. Visão Geral da Arquitetura

O sistema adota uma arquitetura em duas camadas desacopladas (Frontend SPA e Backend Web API), comunicando-se via requisições HTTP REST em formato JSON:

```mermaid
flowchart LR
    subgraph Frontend ["Frontend (optometria-web)"]
        Navbar["Navbar (Navegação & Gatilhos)"]
        ModalOpticas["ModalOpticas (CRUD Global)"]
        ModalPaciente["ModalNovoPaciente (Criação/Edição)"]
        PacientesView["PacientesView (Lista, Filtro & Paginação)"]
        ProntuarioView["ProntuarioPacienteView (Perfil & Histórico)"]
        Service["api.js (Fetch API)"]
        
        Navbar --> ModalOpticas
        Navbar --> PacientesView
        PacientesView --> ModalPaciente
        PacientesView --> ProntuarioView
        ProntuarioView --> ModalPaciente
        
        ModalOpticas --> Service
        PacientesView --> Service
        ModalPaciente --> Service
        ProntuarioView --> Service
    end

    subgraph Backend ["Backend (Optometria.Api)"]
        Controller["Controllers (Endpoints REST)"]
        DTO["DTOs (Entrada / Saída)"]
        EF["Entity Framework Core 10"]
        Controller --> DTO
        Controller --> EF
    end

    subgraph Database ["Persistência"]
        SQLite[("SQLite (optometria.db)")]
        EF --> SQLite
    end

    Service -->|HTTP JSON / Porta 5145| Controller
```

* **Frontend:** Single Page Application (SPA) desenvolvida com **React 19**, empacotada com **Vite 8**, biblioteca de ícones **Lucide React** (`lucide-react`) e executando localmente na porta `5173`.
* **Backend:** API REST desenvolvida em **ASP.NET Core (.NET 10)**, executando na porta `5145`.
* **Banco de Dados:** **SQLite**, persistido no arquivo local `Optometria.Api/optometria.db`.

---

## 2. Modelo de Dados Relacional (ER)

O banco de dados é estruturado em torno do fluxo clínico do paciente. As medições ópticas de Olho Direito e Olho Esquerdo são modeladas como tipos embutidos (*Owned Types*) dentro da tabela de atendimentos.

```mermaid
erDiagram
    PACIENTE ||--o{ ATENDIMENTO : "possui (1:N)"
    OPTICA ||--o{ ATENDIMENTO : "origina (0..1:N)"

    PACIENTE {
        int Id PK
        string NomeCompleto
        DateOnly DataNascimento
        string Telefone
        string Observacoes
    }

    OPTICA {
        int Id PK
        string Nome
        string Contato
        string Endereco
    }

    ATENDIMENTO {
        int Id PK
        int PacienteId FK
        int OpticaOrigemId FK "opcional"
        DateTime DataAtendimento
        string QueixaPrincipal
        decimal DistanciaPupilar
        boolean SemNecessidadeNovaCorrecao
        DateOnly DataSugeridaRetorno
        string ObservacoesAtendimento
        string Lentes "JSON/Lista"
        string Tratamentos "JSON/Lista"
        decimal OD_Esferico
        decimal OD_Cilindrico
        decimal OD_Eixo
        string OD_AvLonge
        string OD_AvPerto
        decimal OD_Adicao
        decimal OD_Dnp
        decimal OE_Esferico
        decimal OE_Cilindrico
        decimal OE_Eixo
        string OE_AvLonge
        string OE_AvPerto
        decimal OE_Adicao
        decimal OE_Dnp
    }
```

### Particularidades do Mapeamento (EF Core)

1. **Atendimento → Paciente:** Chave estrangeira `PacienteId` obrigatória. Configurado com `OnDelete(DeleteBehavior.Restrict)` para impedir que a exclusão acidental de um paciente apague atendimentos históricos sem confirmação.
2. **Atendimento → Ótica:** Chave estrangeira `OpticaOrigemId` anulável (`int?`). Quando nulo, o atendimento é tratado como particular.
3. **Tipos Embutidos (Owned Types):** A classe `RefratometriaOlho` não possui tabela própria. No `OptometriaDbContext`, as propriedades `OlhoDireito` e `OlhoEsquerdo` são configuradas via `.OwnsOne()`, gravando as colunas de medições diretamente na tabela `Atendimentos`.

---

## 3. Padrão de Camadas do Backend

O backend está organizado em pastas por responsabilidade dentro do projeto `Optometria.Api`:

* **`Models/`:** Representam as entidades de domínio e as tabelas do banco de dados (`Paciente`, `Atendimento`, `Optica`, `RefratometriaOlho`).
* **`DTOs/` (Data Transfer Objects):** Objetos de transferência para entrada e saída da API. Evitam expor as entidades de banco diretamente na rede e protegem contra envio de campos indevidos:
  * Criação: `CriarPacienteDto`, `CriarAtendimentoDto`, `CriarOpticaDto`.
  * Leitura: `PacienteDto`, `AtendimentoDto`, `OpticaDto`, `RefratometriaOlhoDto`.
* **`Controllers/`:** Controladores que expõem as rotas REST (`PacientesController`, `AtendimentosController`, `OpticasController`). Responsáveis por validar os dados recebidos, orquestrar a consulta ou salvamento e retornar o código HTTP adequado (ex.: `200 OK`, `201 Created`, `400 BadRequest`, `404 NotFound`, `204 NoContent`).
  * *Validação de Integridade:* Tanto em `OpticasController.Excluir(id)` quanto em `PacientesController.Excluir(id)`, o sistema verifica preventivamente se existem atendimentos vinculados antes de remover a entidade (`AnyAsync`); havendo registros associados, a exclusão é rejeitada com status `400 BadRequest` e mensagem amigável, garantindo a integridade dos dados históricos.
* **`Data/`:** Contém o `OptometriaDbContext`, que herda do Entity Framework Core e mapeia os `DbSet<>` das entidades, configurando relacionamentos e restrições.
* **`Migrations/`:** Histórico de versionamento do esquema do banco de dados gerado pela ferramenta `dotnet-ef`.

---

## 4. Estrutura de Componentes do Frontend

A aplicação React em `optometria-web/` adota componentes modulares com estilização em CSS puro por componente:

* **[`src/components/Navbar.jsx`](file:///c:/Users/71588959473/Documents/GitHub/sistema-gestao-optometrica/optometria-web/src/components/Navbar.jsx):**
  * Barra de navegação superior fixa com duas faixas.
  * Faixa superior: identidade visual (*OptoSystem*), atalho direto para acionar o modal global de óticas parceiras e identificação do profissional (avatar e nome).
  * Faixa inferior: abas de navegação principal (*Início*, *Pacientes*, *Atendimentos*) e exibição dinâmica da data atual formatada por extenso no padrão brasileiro (`Intl.DateTimeFormat`).
* **[`src/components/ModalOpticas.jsx`](file:///c:/Users/71588959473/Documents/GitHub/sistema-gestao-optometrica/optometria-web/src/components/ModalOpticas.jsx):**
  * Modal global exibido em sobreposição (*overlay*), permitindo acesso ao CRUD completo de óticas a qualquer momento sem trocar de rota ou perder dados preenchidos em atendimentos.
  * **Layout em duas colunas:**
    * *Coluna da esquerda:* Formulário reativo para cadastro de nova ótica ou edição de registro existente, com zona de exclusão protegida por confirmação em duas etapas ("Desativar parceria").
    * *Coluna da direita:* Listagem com indicador de status (*Ativa* / *Em edição*), contador total de parceiras e campo de busca rápida em tempo real por nome ou telefone/contato.
  * **Feedback visual:** Sistema de alertas interno (*banner* de sucesso ou erro) com temporizador para auto-ocultamento após 8 segundos.
* **[`src/components/ModalNovoPaciente.jsx`](file:///c:/Users/71588959473/Documents/GitHub/sistema-gestao-optometrica/optometria-web/src/components/ModalNovoPaciente.jsx):**
  * Modal compartilhado para **cadastro** e **edição** de pacientes.
  * Aplica máscara em tempo real para telefone/WhatsApp (`(00) 00000-0000`), validação de campos obrigatórios (nome, data de nascimento e contato) e área para anotações clínicas livres.
  * Feedback contextual de erro ou sucesso e integração com gatilho de recarga no componente pai (`onPacienteSalvo`).
* **[`src/components/PacientesView.jsx`](file:///c:/Users/71588959473/Documents/GitHub/sistema-gestao-optometrica/optometria-web/src/components/PacientesView.jsx):**
  * Visão principal da aba de Pacientes, exibindo a tabela com todos os registros ativos.
  * **Filtros e Controles:** Barra de busca mista (consulta via backend por nome e refinamento instantâneo por telefone), seletor de ordenação (*Nome A-Z*, *Nome Z-A*, *Mais recentes*) e paginação cliente com 10 registros por página.
  * Transição de visão: ação "Ver prontuário" que passa o registro selecionado para exibição detalhada.
* **[`src/components/ProntuarioPacienteView.jsx`](file:///c:/Users/71588959473/Documents/GitHub/sistema-gestao-optometrica/optometria-web/src/components/ProntuarioPacienteView.jsx):**
  * Visão individual do prontuário com layout em duas colunas:
    * *Coluna esquerda (Ficha Cadastral):* Avatar com iniciais, código formatado de identificação clínica (`PAC-XXXXX`), dados de contato, data de nascimento com **cálculo automático de idade em anos**, observações permanentes e botões para "Editar cadastro" (reabre o modal preenchido) e "Excluir paciente" (com caixa de dupla confirmação antes do disparo para o backend).
    * *Coluna direita (Histórico Clínico):* Painel que consome `atendimentoService.obterHistoricoPorPaciente(id)`, exibindo o contador e a lista cronológica das consultas realizadas.
  * Botão de retorno rápido para a lista e atalho "Nova Consulta" que direciona para a aba de Atendimentos.
* **Orquestração no [`src/App.jsx`](file:///c:/Users/71588959473/Documents/GitHub/sistema-gestao-optometrica/optometria-web/src/App.jsx):**
  * Controla o estado da aba ativa (`inicio`, `pacientes`, `atendimentos`), a exibição dos modais globais e a alternância condicional na aba de pacientes entre `PacientesView` (listagem) e `ProntuarioPacienteView` (ficha individual).

---

## 5. Integração Frontend-Backend

A comunicação do frontend React com a API é centralizada no módulo de serviço [optometria-web/src/services/api.js](file:///c:/Users/71588959473/Documents/GitHub/sistema-gestao-optometrica/optometria-web/src/services/api.js):

* **URL Base:** `http://localhost:5145/api`.
* **Políticas de CORS:** Configurada no `Program.cs` do backend para aceitar requisições de `http://localhost:5173`.
* **Tratamento de Erros:** A função auxiliar `handleResponse` intercepta retornos diferentes de sucesso (`2xx`), captura mensagens amigáveis enviadas pela API no formato `{ mensagem: "..." }` e propaga erros tratáveis pela interface.

---

## 6. Testes e Exploração da API

Com o backend em execução (`dotnet run --launch-profile http`), a especificação OpenAPI interativa pode ser acessada em:

* **Swagger UI:** `http://localhost:5145/swagger`

O Swagger permite testar envios de payloads, simular cadastros e consultar respostas diretamente pelo navegador sem necessidade de ferramentas externas como Postman ou Insomnia.
