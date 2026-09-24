# Sistema de Gestão Optométrica — Levantamento de Requisitos v0.1

**Status:** base inicial para implementação; decisões provisórias identificadas  
**Data:** 21/09/2026  
**Atualização:** 24/09/2026  
**Primeiro cliente:** Opto Prazeres  
**Visão do produto:** sistema white label para profissionais de optometria

## 1. Objetivo desta versão

Registrar o que já foi descoberto sobre o atendimento realizado pela profissional, analisar o receituário utilizado atualmente e propor os dados mínimos do MVP. As respostas do desenvolvedor em 24/09/2026 permitem iniciar a modelagem mínima e a implementação incremental. As hipóteses clínicas indicadas abaixo serão validadas com a profissional; não representam fatos clínicos confirmados.

## 2. Fluxo atual confirmado

1. O paciente chega ao consultório encaminhado por uma ótica ou por outra origem.
2. A profissional coleta poucos dados pessoais, pois a ótica já realiza o cadastro comercial do cliente.
3. A profissional pergunta o que o paciente está sentindo.
4. Realiza os exames optométricos.
5. Anota os resultados e a prescrição em um receituário de papel.
6. O paciente leva o receituário para a ótica.
7. A ótica utiliza a prescrição para realizar o orçamento e confeccionar os óculos.
8. Em um atendimento futuro, a principal informação anterior consultada é o grau do paciente.

## 3. Decisão importante sobre o local e a origem

O atendimento acontece sempre no consultório da profissional. Portanto, o MVP não precisa de uma entidade `Local de Atendimento`.

O dado variável é a **ótica de origem**, isto é, a ótica que encaminhou o paciente. Esse dado deve pertencer ao atendimento, e não necessariamente ao paciente, porque o mesmo paciente pode retornar futuramente por outra ótica ou sem encaminhamento.

Decisão inicial:

- manter um cadastro rápido de óticas de origem com nome, contato e endereço, todos opcionais;
- permitir atendimento sem ótica de origem, por exemplo, atendimento particular;
- vincular opcionalmente cada atendimento a uma ótica cadastrada.

## 4. Atores do MVP

### Profissional

Única pessoa que utilizará o sistema na primeira versão. Poderá cadastrar pacientes, registrar atendimentos, consultar o histórico e emitir a prescrição.

### Paciente

Pessoa avaliada pela profissional. Não acessará o sistema no MVP.

### Ótica de origem

Organização que encaminhou o paciente. Não terá usuário nem acesso ao sistema no MVP.

## 5. Dados mínimos do paciente

### Campos propostos para o MVP

| Campo | Obrigatoriedade inicial | Motivo |
|---|---:|---|
| Identificador interno | Automático | Diferenciar os pacientes no sistema |
| Nome completo | Opcional nesta fase | Identificação principal quando informado |
| Data de nascimento | Opcional | Campo confirmado; permite calcular a idade |
| Telefone | Opcional | Ajuda a diferenciar homônimos e localizar o paciente |
| Observações cadastrais | Opcional | Situações gerais que não pertencem a um atendimento específico |
| Data de cadastro | Automático | Rastreabilidade |
| Data da última atualização | Automático | Rastreabilidade |

### Observação sobre idade

Guardar a data de nascimento, conforme decisão de 24/09/2026. Calcular a idade na data do atendimento para a receita, quando ambas as datas estiverem disponíveis. Se o nascimento não for informado, não inventar idade nem data de nascimento.

Não há evidência, por enquanto, de necessidade de CPF, endereço, profissão ou e-mail. Esses campos não devem entrar no MVP sem uma finalidade real.

## 6. Dados do atendimento

### 6.1 Informações gerais

| Campo | Obrigatoriedade inicial | Observação |
|---|---:|---|
| Identificador interno | Automático | Gerado pelo sistema |
| Paciente | Vínculo estrutural | Atendimento criado dentro do cadastro de um paciente |
| Data do atendimento | Opcional nesta fase | Sugerir a data atual, permitindo alteração ou remoção |
| Ótica de origem | Opcional | Pode existir atendimento sem encaminhamento |
| Queixa/observações | Opcional | Campo de texto livre para o que o paciente relata e outras notas |
| Sem necessidade de nova correção | Opcional | Marcação manual; ausência de marcação não significa conclusão clínica |
| Data sugerida para retorno | Opcional | Já existe no receituário atual |
| Data de criação | Automático | Rastreabilidade |
| Data da última atualização | Automático | Rastreabilidade |

### 6.2 Refratometria por olho

O receituário atual separa **OD** (olho direito) e **OE** (olho esquerdo). Para cada olho, aparecem:

| Campo | Significado funcional |
|---|---|
| Esférico | Potência esférica da correção |
| Cilíndrico | Potência cilíndrica, usada na correção do astigmatismo |
| Eixo | Orientação do componente cilíndrico |
| AV longe | Acuidade visual para longe |
| AV perto | Acuidade visual para perto |
| DNP | Distância nasopupilar/monocular registrada para aquele olho |

Também aparecem campos gerais:

- **Adição:** potência adicional usada para visão próxima;
- **DP:** distância pupilar binocular.

Decisão de 24/09/2026: registrar **adição de OD e adição de OE separadamente**, inclusive na impressão. Manter DNP por olho e DP geral como campos independentes e opcionais. O uso de DNP versus DP será validado em outra versão; inicialmente não calcular um a partir do outro. Todos os resultados podem ficar em branco: ausência de valor não significa zero nem exame normal.

### 6.3 Indicação de lentes

Opções presentes no receituário atual:

- visão simples;
- alto índice;
- multifocal;
- free form;
- bifocal;
- Biovis;
- Kriptok;
- Ultex.

Regra provisória: permitir múltipla seleção de quaisquer opções, sem bloqueios por combinação nesta fase. Isso representa flexibilidade de preenchimento, não validação clínica das combinações. Manter Biovis, Kriptok e Ultex visualmente agrupados como subtipos de bifocal, conforme a ficha e a hipótese do desenvolvedor, sem impor dependência obrigatória de seleção.

### 6.4 Tratamentos das lentes

Opções presentes no receituário atual:

- antirreflexo;
- incolor;
- fotocromático;
- filtro azul.

Permitir múltipla seleção, sem restrições de combinação nesta fase, conforme decisão de 24/09/2026.

## 7. Diagnóstico ou classificação refrativa

As quatro classificações comuns encontradas nas referências pesquisadas são:

- **Miopia:** dificuldade de enxergar objetos distantes com nitidez;
- **Hipermetropia:** dificuldade ou esforço maior para enxergar de perto;
- **Astigmatismo:** pode causar visão borrada ou distorcida de perto e de longe;
- **Presbiopia:** redução da capacidade de focar de perto relacionada à idade.

Decisão de 24/09/2026: seguir inicialmente o receituário enviado. Não incluir campo separado nem lista de diagnósticos nesta versão. Eventuais anotações clínicas ficam em observações livres, com OD/OE indicados pela profissional quando necessário. O sistema não deduz diagnósticos a partir dos valores do grau. Uma classificação estruturada por olho poderá ser avaliada posteriormente.

## 8. Requisitos funcionais atualizados

| Código | Requisito funcional |
|---|---|
| RF-01 | Cadastrar paciente com os dados mínimos necessários |
| RF-02 | Consultar os dados de um paciente |
| RF-03 | Editar o cadastro de um paciente |
| RF-04 | Buscar paciente, inicialmente pelo nome |
| RF-05 | Cadastrar e consultar óticas de origem com nome, contato e endereço opcionais |
| RF-06 | Registrar atendimento vinculado a um paciente |
| RF-07 | Informar opcionalmente a ótica de origem do atendimento |
| RF-08 | Registrar observações livres sobre o atendimento |
| RF-09 | Registrar dados de refratometria de OD e OE |
| RF-10 | Registrar adição separada para OD/OE, DNP por olho e DP geral |
| RF-11 | Registrar lentes e tratamentos com múltipla seleção livre nesta fase |
| RF-12 | Permitir anotações clínicas no campo de observações, conforme a ficha, sem diagnóstico estruturado |
| RF-13 | Registrar uma data sugerida para retorno |
| RF-14 | Exibir o histórico por data do atendimento; quando ausente, usar a data de criação identificada como tal |
| RF-15 | Visualizar todos os dados de um atendimento anterior |
| RF-16 | Corrigir um registro de atendimento quando necessário |
| RF-17 | Gerar uma prescrição optométrica a partir do atendimento, pronta para impressão e entrega ao paciente |
| RF-18 | Armazenar permanentemente pacientes, óticas e atendimentos |
| RF-19 | Permitir indicar manualmente ausência de necessidade de nova correção e emitir o documento mesmo assim |
| RF-20 | Permitir salvar registros com campos de preenchimento em branco nesta fase |

## 9. Regras de negócio preliminares

- Todo atendimento deve pertencer a exatamente um paciente.
- Um paciente pode possuir nenhum, um ou vários atendimentos.
- Uma ótica pode estar vinculada a vários atendimentos.
- Um atendimento pode não possuir ótica de origem.
- O local físico do atendimento é fixo no MVP e não precisa ser armazenado em cada registro.
- Os dados de OD e OE, incluindo adição, não devem ser misturados.
- Campos preenchidos pela usuária serão opcionais nesta fase, inclusive nome e data do atendimento. IDs e datas de criação são gerados automaticamente. O vínculo paciente–atendimento permanece estrutural.
- Registros sem nome devem aparecer com um identificador visível, como “Paciente #123” ou “Ótica #45”, para não confundir cadastros. Esses rótulos não substituem nomes na impressão.
- Todo atendimento deverá permitir a emissão de prescrição/documento do atendimento, inclusive quando não houver necessidade de nova correção. Não é necessário imprimir ao salvar nem impedir salvamentos parciais.
- A receita anterior poderá ser consultada por completo, mas não será obrigatória para registrar um novo atendimento. Não copiar automaticamente o grau anterior.
- Valores clínicos em branco significam não informados; não preencher automaticamente com zero ou conclusões clínicas.
- O histórico será formado pelos atendimentos do paciente, e não por uma entidade separada chamada Histórico.
- A alteração de um registro clínico não deve apagar silenciosamente a informação anterior. A estratégia exata de auditoria será definida na arquitetura.
- Não deve existir exclusão definitiva de atendimento sem uma regra específica e justificativa.

## 10. Modelo conceitual preliminar

| Relação | Cardinalidade |
|---|---|
| Paciente → Atendimento | Um paciente tem zero ou vários atendimentos; cada atendimento pertence a um paciente |
| Ótica de origem → Atendimento | Uma ótica origina zero ou vários atendimentos; cada atendimento tem zero ou uma ótica de origem |
| Atendimento → Dados da receita | Resultados de OD/OE, lentes, tratamentos e observações pertencem ao atendimento |

Este modelo ainda não é o modelo do banco de dados. Ele apenas representa os conceitos descobertos até agora.

## 11. Funcionalidades fora do MVP

- agenda;
- recepcionistas e outros usuários;
- autenticação e níveis de permissão;
- acesso das óticas ao sistema;
- múltiplas clínicas usando a mesma instalação;
- financeiro;
- lembretes;
- relatórios avançados;
- personalização completa da marca;
- auditoria detalhada de todas as versões do prontuário.

Embora o produto tenha visão white label, o primeiro MVP continua sendo de uma única profissional. O núcleo não deve conter nomes, logotipos ou regras codificadas exclusivamente para a Opto Prazeres.

## 12. Respostas e decisões de 24/09/2026

| Item original | Decisão para começar |
|---|---|
| 1. Nascimento ou idade | Data de nascimento; idade calculada na data do atendimento |
| 2. Telefone | Incluir, opcional |
| 3. Diagnóstico | Seguir os campos do papel; anotações em observações, sem novo campo estruturado |
| 4. Adição | Separada por olho |
| 5. DNP e DP | Manter os dois opcionais; confirmar o uso posteriormente |
| 6. Combinação de lentes | Permitir qualquer combinação nesta fase |
| 7. Subtipos de bifocal | Agrupar Biovis, Kriptok e Ultex como na ficha; classificação ainda provisória |
| 8. Receita anterior | Consulta completa disponível, sem ser pré-requisito do novo exame |
| 9. Atendimento sem receita | Disponibilizar documento para todo atendimento, mesmo sem necessidade de correção |
| 10. Cadastro da ótica | Nome, contato e endereço; todos opcionais |
| 11. Sem nova correção | Incluir indicação manual opcional |

### Regra geral de preenchimento

A pedido do desenvolvedor, nenhum campo de entrada será obrigatório nesta fase. Permitir salvar dados incompletos em pacientes, óticas e atendimentos. Essa decisão não remove IDs automáticos nem o vínculo entre paciente e atendimento. Obrigatoriedade e validações clínicas serão revistas conforme o uso e a validação com a profissional.

### Pendências para evolução

- Confirmar uso de DNP/DP, agrupamento dos subtipos de bifocal e combinações de lentes/tratamentos.
- Validar com a profissional a representação de ausência de necessidade de correção no documento impresso.
- Rever campos obrigatórios e critérios de emissão antes do uso operacional com pacientes reais.
- Essas pendências não bloqueiam o início da programação com dados fictícios.

## 12.1 Decisão confirmada sobre o receituário

A geração e impressão da prescrição fazem parte obrigatória do MVP. O objetivo é substituir o receituário preenchido à caneta: após registrar os dados do atendimento, a profissional deverá poder gerar uma versão pronta para impressão e entrega ao paciente.

## 13. Segurança e privacidade

O sistema armazenará dados pessoais e informações clínicas. Desde o MVP, devem ser considerados:

- coleta apenas dos dados necessários;
- acesso restrito à profissional;
- proteção das credenciais;
- conexão segura quando o sistema estiver disponível pela internet;
- backups;
- rastreabilidade de criação e alteração dos registros;
- cuidados para não usar dados reais de pacientes em repositórios, exemplos ou testes.

## 14. Referências consultadas

- [American Optometric Association — Comprehensive Adult Eye and Vision Examination](https://www.aoa.org/AOA/Documents/Practice%20Management/Clinical%20Guidelines/EBO%20Guidelines/Comprehensive%20Adult%20Eye%20and%20Vision%20Exam.pdf)
- [College of Optometrists — Conducting the routine eye examination](https://www.college-optometrists.org/clinical-guidance/guidance/knowledge%2C-skills-and-performance/the-routine-eye-examination/conducting-the-routine-eye-examination)
- [College of Optometrists — Patient records](https://www.college-optometrists.org/clinical-guidance/guidance/knowledge%2C-skills-and-performance/patient-records)
- [College of Optometrists — Electronic record keeping](https://www.college-optometrists.org/clinical-guidance/guidance/knowledge%2C-skills-and-performance/patient-records/electronic-record-keeping)
- [College of Optometrists — Secondary Care Minimum Datasets: Refraction](https://www.college-optometrists.org/COO/media/Media/Documents/Research/Datasets/Secondary-Care-Minimum-Datasets-Refraction-Report.pdf)
- [National Eye Institute — Refractive Errors](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/refractive-errors)
- Receituário de prescrição optométrica fornecido para análise em 21/09/2026.

> As referências internacionais ajudam a identificar informações clínicas comuns, mas não substituem a validação do fluxo da profissional nem uma análise jurídica e regulatória específica para o Brasil.
