# Sistema de Gestão Optométrica — Requisitos do Sistema (v1)

Documento principal de requisitos do sistema. Define o escopo do MVP, as regras de negócio, os requisitos funcionais e os dados gerenciados, substituindo anotações preliminares e levantamentos provisórios.

> **Versão do Documento:** 1.3  
> **Status do Escopo:**  100% Implementado (MVP Finalizado — 19/19 Requisitos Atendidos)  
> **Última Atualização:** 24/11/2026 (Conclusão do MVP: fluxo de Atendimentos Clínicos, Linha do Tempo no Prontuário e Impressão de Receita Optométrica A4)

---

## 1. Visão Geral e Objetivo

O sistema tem como objetivo informatizar o atendimento clínico do profissional de optometria, substituindo o receituário de papel por um prontuário eletrônico com emissão de prescrição pronta para impressão e entrega ao paciente/ótica.

### 1.1 Usuário do Sistema
* **Profissional de Optometria:** Único usuário ativo do sistema nesta versão. Realiza cadastros, registra atendimentos, consulta históricos e emite receitas.
* *Nota:* Pacientes e óticas parceiras não acessam o sistema.

### 1.2 Fora de Escopo do MVP
Para manter o foco na rotina essencial do consultório, os seguintes módulos não fazem parte desta versão:
* Agendamento de consultas e lista de espera;
* Múltiplos usuários, níveis de permissão e autenticação;
* Controle financeiro (cobrança de consultas, caixa);
* Notificações automáticas ou lembretes por WhatsApp/SMS;
* Acesso externo para óticas parceiras.

---

## 2. Regras de Negócio (RN)

* **RN-01 (Vínculo do Atendimento):** Todo atendimento deve obrigatoriamente estar vinculado a um paciente. Um paciente pode ter múltiplos atendimentos ao longo do tempo.
* **RN-02 (Ótica de Origem):** A ótica parceira que encaminhou o paciente é vinculada ao atendimento, não ao cadastro fixo do paciente (o mesmo paciente pode vir por óticas diferentes ou de forma particular). A indicação de ótica é sempre opcional.
* **RN-03 (Independência de Medições):** Os dados refrativos de Olho Direito (OD) e Olho Esquerdo (OE) são independentes, incluindo esférico, cilíndrico, eixo, adições e DNP.
* **RN-04 (Ausência de Valores):** Campos clínicos deixados em branco indicam dado não informado. O sistema nunca deve preencher campos em branco com zero ou deduzir normalidade clínica.
* **RN-05 (Sem Necessidade de Correção):** O profissional pode assinalar que o paciente não necessita de nova correção. A receita/documento do atendimento pode ser impressa normalmente mesmo com essa opção marcada.
* **RN-06 (Histórico Clínico):** O histórico de um paciente é composto pela lista cronológica de seus atendimentos. Consultar consultas anteriores não deve sobrepor automaticamente os dados do exame atual.
* **RN-07 (Emissão de Prescrição):** A partir dos dados salvos no atendimento, o sistema deve gerar uma versão formatada para impressão direta em folha padrão de receita.
* **RN-08 (Integridade de Ótica com Histórico):** Uma ótica parceira não pode ser excluída do sistema se já possuir atendimentos vinculados a ela, preservando o histórico e a rastreabilidade da origem dos pacientes.
* **RN-09 (Integridade de Paciente com Histórico):** Um paciente não pode ser excluído do sistema se já possuir atendimentos vinculados a ele, garantindo a rastreabilidade legal e a preservação do histórico clínico do consultório.

---

## 3. Requisitos Funcionais (RF)

### 3.1 Módulo Pacientes e Prontuário
> *Nota de Interface (UX):* O módulo é estruturado em duas visões integradas na aba "Pacientes":
> 1. **Listagem e Busca (`PacientesView`):** Exibição em tabela com paginação (10 registros por página), ordenação flexível (Nome A-Z, Nome Z-A, Mais recentes) e busca que pesquisa tanto por nome (via backend) quanto por telefone/contato (refinamento instantâneo).
> 2. **Perfil e Prontuário (`ProntuarioPacienteView`):** Ao selecionar "Ver prontuário", o sistema abre uma visão individual com código padronizado (`PAC-XXXXX`), avatar com iniciais, ficha cadastral completa, cálculo dinâmico de idade a partir da data de nascimento, indicador do total de consultas e atalho direto para iniciar novo atendimento.

* **RF-01:** Cadastrar paciente com nome completo, data de nascimento, telefone/WhatsApp e observações cadastrais (via modal com máscara interativa para telefone `(00) 00000-0000` e validações de campos obrigatórios).
* **RF-02:** Buscar pacientes por nome e telefone com busca textual rápida, suporte a ordenação e paginação de resultados.
* **RF-03:** Visualizar detalhes do prontuário do paciente (com código identificador gerado e idade calculada) e editar informações cadastrais diretamente pelo modal.
* **RF-04:** Excluir paciente a partir de sua ficha de prontuário com confirmação protegida em duas etapas na interface, sendo a exclusão bloqueada caso o paciente possua atendimentos associados (conforme **RN-09**).

### 3.2 Módulo Óticas Parceiras
> *Nota de Interface (UX):* O gerenciamento de óticas é disponibilizado de forma global através de um modal na barra de navegação (`Navbar`), permitindo cadastro, edição e consulta rápida a qualquer momento sem sair ou interromper a tela de atendimento. O modal é estruturado em duas colunas: formulário de cadastro/edição à esquerda e listagem pesquisável em tempo real à direita.

* **RF-05:** Cadastrar ótica parceira com nome, telefone/contato e endereço (campos obrigatórios).
* **RF-06:** Listar óticas parceiras ativas com contador total e filtragem em tempo real por nome ou contato.
* **RF-07:** Editar dados cadastrais (nome, contato, endereço) carregando os dados diretamente no formulário do modal.
* **RF-08:** Excluir registro de ótica parceira com confirmação em duas etapas na interface (ação "Desativar parceria"), sendo a exclusão bloqueada caso a parceira possua atendimentos associados (conforme **RN-08**).

### 3.3 Módulo Atendimentos e Prescrição
> *Nota de Interface (UX):* O módulo contempla a jornada clínica completa do consultório em três etapas integradas:
> 1. **Seleção de Paciente (`AtendimentosView`):** Painel de entrada com busca instantânea por nome ou telefone para selecionar o paciente ou cadastrar um novo via modal rápido.
> 2. **Ficha Clínica de Atendimento (`FichaAtendimentoView`):** Formulário em duas colunas com anamnese, vínculo opcional de ótica parceira (ou particular), tabela refrativa completa (OD/OE com dioptrias, eixos, AV e DNP), medição de DP total, seleção múltipla de lentes e tratamentos via chips interativos, cálculo inteligente automático da data de retorno (+1 ano a partir da consulta) e redirecionamento direto para o prontuário ao salvar.
> 3. **Linha do Tempo e Emissão de Receita (`ProntuarioPacienteView` & `ModalReceitaOptometrica`):** Exibição cronológica das consultas anteriores com comparação direta de graus e botão para gerar a receita médica formatada. A impressão é executada via iframe HTML isolado com `@page { size: A4 portrait; }`, garantindo impressão em folha única, sem cortes e sem elementos da interface.

* **RF-09:** Iniciar novo atendimento vinculado a um paciente existente a partir da busca na aba Atendimentos ou pelo botão "Nova Consulta" no prontuário.
* **RF-10:** Selecionar opcionalmente a ótica de origem responsável pelo encaminhamento (dropdown alimentado pela API de óticas parceiras) ou manter como Particular.
* **RF-11:** Registrar data do atendimento (sugerindo a data atual como padrão) e queixa principal/anamnese clínica.
* **RF-12:** Registrar refração por olho (OD e OE):
  * Grau esférico, cilíndrico e eixo;
  * Acuidade visual (AV longe e AV perto);
  * Distância naso-pupilar (DNP) monocular.
* **RF-13:** Registrar medições gerais: Adição por olho e Distância Pupilar total (DP binocular em mm).
* **RF-14:** Indicar tipos de lentes recomendadas (seleção múltipla: Visão Simples, Multifocal, Bifocal, Alto Índice, Free Form, Ocupacional).
* **RF-15:** Indicar tratamentos de lentes (seleção múltipla: Antirreflexo, Filtro Azul / Blue Cut, Fotocromático / Transitions, Incolor, Proteção UV).
* **RF-16:** Indicar data sugerida para retorno do paciente (com sugestão automática para 1 ano após a consulta).
* **RF-17:** Marcar flag de "Sem necessidade de nova correção visual".
* **RF-18:** Consultar o histórico completo de atendimentos anteriores do paciente ordenados cronologicamente em formato de linha do tempo no prontuário.
* **RF-19:** Gerar e imprimir a prescrição optométrica formatada do atendimento com formatação de dioptrias (+/-, decimais), recomendações e área para assinatura do profissional.

---

## 4. Estrutura dos Dados

### 4.1 Paciente
| Campo | Descrição |
|---|---|
| `Id` | Identificador único gerado automaticamente |
| `NomeCompleto` | Nome do paciente |
| `DataNascimento` | Data de nascimento (usada para calcular a idade no atendimento) |
| `Telefone` | Telefone de contato / WhatsApp |
| `Observacoes` | Notas cadastrais gerais permanentes do paciente |
| `UltimaConsulta` | Data/hora do atendimento mais recente (calculado pelo backend para o DTO de listagem/detalhe) |

### 4.2 Ótica
| Campo | Descrição |
|---|---|
| `Id` | Identificador único gerado automaticamente |
| `Nome` | Nome fantasia ou razão social da ótica |
| `Contato` | Telefone, responsável ou e-mail |
| `Endereco` | Endereço físico da ótica |

### 4.3 Atendimento
| Campo | Descrição |
|---|---|
| `Id` | Identificador único do atendimento |
| `PacienteId` | Vínculo obrigatório com o paciente |
| `OpticaOrigemId` | Vínculo opcional com a ótica parceira (nulo = particular) |
| `DataAtendimento` | Data em que a consulta ocorreu |
| `QueixaPrincipal` | Relato do paciente sobre sintomas ou dificuldades visuais |
| `OlhoDireito` | Medições do OD: esférico, cilíndrico, eixo, AV longe, AV perto, DNP, adição |
| `OlhoEsquerdo` | Medições do OE: esférico, cilíndrico, eixo, AV longe, AV perto, DNP, adição |
| `DistanciaPupilar` | DP binocular total (em mm) |
| `SemNecessidadeNovaCorrecao` | Indicador se houve ou não alteração/necessidade de grau |
| `DataSugeridaRetorno` | Data recomendada para nova avaliação |
| `ObservacoesAtendimento` | Notas clínicas livres do atendimento |
| `Lentes` | Lista de tipos de lentes indicadas |
| `Tratamentos` | Lista de tratamentos de lente indicados |

---

## 5. Requisitos Não Funcionais (RNF)

* **RNF-01 (Armazenamento Local):** Persistência em banco de dados SQLite local, sem necessidade de configurar servidores dedicados de banco de dados.
* **RNF-02 (Desempenho e Agilidade):** Interface ágil projetada para ser preenchida rapidamente durante a própria consulta sem travamentos.
* **RNF-03 (Privacidade de Dados):** Dados de pacientes e exames mantidos sob controle local da profissional de saúde.
* **RNF-04 (Compatibilidade de Impressão):** Layout de prescrição otimizado para navegadores modernos e impressoras térmicas ou jato de tinta/laser no formato padrão de receita.

---

## 6. Histórico de Revisões

| Versão | Data | Autor / Responsável | Descrição das Alterações |
|:---:|:---:|---|---|
| **1.0** | 06/11/2026 | Time de Desenvolvimento | Especificação inicial de requisitos e escopo do MVP. |
| **1.1** | 13/11/2026 | Time de Desenvolvimento | Inclusão da regra **RN-08** (bloqueio de exclusão de óticas com histórico), detalhamento do fluxo em modal global de Óticas (RF-05 a RF-08) e dupla confirmação ("Desativar parceria"). |
| **1.2** | 17/11/2026 | Time de Desenvolvimento | Detalhamento do módulo de Pacientes e Prontuário (`PacientesView`, `ModalNovoPaciente`, `ProntuarioPacienteView`), incluindo máscara de contato, cálculo de idade automático, código padronizado `PAC-XXXXX` e paginação/ordenação. |
| **1.3** | 24/11/2026 | Time de Desenvolvimento | Conclusão do MVP: fluxo completo de Atendimentos Clínicos (`AtendimentosView` e `FichaAtendimentoView`), linha do tempo no prontuário, emissão e impressão de receita médica via iframe isolado A4 (`ModalReceitaOptometrica`), inclusão de `UltimaConsulta` no `PacienteDto` e formalização da regra **RN-09** (bloqueio de exclusão de pacientes com histórico). |

