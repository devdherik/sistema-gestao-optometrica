# Sistema de Gestão Optométrica — Requisitos do Sistema (v1)

Documento principal de requisitos do sistema. Define o escopo do MVP, as regras de negócio, os requisitos funcionais e os dados gerenciados, substituindo anotações preliminares e levantamentos provisórios.

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

---

## 3. Requisitos Funcionais (RF)

### 3.1 Módulo Pacientes
* **RF-01:** Cadastrar paciente com nome completo, data de nascimento, telefone e observações.
* **RF-02:** Buscar pacientes por nome com busca textual rápida.
* **RF-03:** Visualizar detalhes e editar informações cadastrais do paciente.
* **RF-04:** Excluir paciente (quando sem atendimentos associados ou mediante confirmação).

### 3.2 Módulo Óticas Parceiras
* **RF-05:** Cadastrar ótica parceira com nome, telefone/contato e endereço.
* **RF-06:** Listar e filtrar óticas parceiras cadastradas.
* **RF-07:** Editar dados de contato e endereço de uma ótica.
* **RF-08:** Excluir registro de ótica parceira.

### 3.3 Módulo Atendimentos e Prescrição
* **RF-09:** Iniciar novo atendimento vinculado a um paciente existente.
* **RF-10:** Selecionar opcionalmente a ótica de origem responsável pelo encaminhamento (ou manter como Particular).
* **RF-11:** Registrar data do atendimento (sugerindo a data atual como padrão) e queixa principal/anamnese.
* **RF-12:** Registrar refração por olho (OD e OE):
  * Grau esférico, cilíndrico e eixo;
  * Acuidade visual (AV longe e AV perto);
  * Distância naso-pupilar (DNP) monocular.
* **RF-13:** Registrar medições gerais: Adição por olho e Distância Pupilar total (DP).
* **RF-14:** Indicar tipos de lentes recomendadas (seleção múltipla: visão simples, multifocal, bifocal, alto índice, free form, etc.).
* **RF-15:** Indicar tratamentos de lentes (seleção múltipla: antirreflexo, fotocromático, filtro azul, incolor).
* **RF-16:** Indicar data sugerida para retorno do paciente.
* **RF-17:** Marcar flag de "Sem necessidade de nova correção visual".
* **RF-18:** Consultar o histórico completo de atendimentos anteriores do paciente ordenados por data.
* **RF-19:** Gerar e imprimir a prescrição optométrica formatada do atendimento.

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
