# Requisitos do Sistema

Descrição do que o sistema faz do ponto de vista de quem usa. Este documento não explica como o código funciona — isso está na referência técnica. Aqui o foco é o comportamento esperado do sistema.

## Objetivo

O sistema existe para registrar e consultar atendimentos optométricos. Ele é usado pelo profissional de optometria durante e após a consulta, substituindo fichas em papel.

## Usuários

Quem interage com o sistema, qual o perfil de cada um e o que cada um precisa fazer. Hoje o sistema opera com um único tipo de usuário (o optometrista), sem autenticação.

## Diagrama de Caso de Uso

Visão geral das ações que o usuário pode realizar no sistema, representada em diagrama Mermaid embutido neste documento.

## Funcionalidades

Descrição de cada funcionalidade organizada por módulo. Para cada uma: o que o usuário faz, o que o sistema responde e as regras que se aplicam.

### Pacientes

Cadastro, busca, edição e exclusão de pacientes. Dados pessoais básicos usados para identificar o paciente ao longo dos atendimentos.

### Óticas

Cadastro, busca, edição e exclusão de óticas parceiras. Servem para registrar qual ótica encaminhou o paciente, quando aplicável.

### Atendimentos

Registro de uma consulta optométrica completa: queixa do paciente, medições refrativas de cada olho, recomendações de lentes e tratamentos, e data sugerida de retorno. Consulta ao histórico de atendimentos de um paciente.

## Regras de Negócio

Restrições e comportamentos que o sistema aplica automaticamente. Exemplo: não é possível criar um atendimento sem um paciente vinculado; a ótica de origem é opcional e, quando ausente, o atendimento é considerado particular.

## Requisitos Não Funcionais

Características técnicas que o sistema deve atender mas que não são funcionalidades visíveis: tempo de resposta, compatibilidade de navegadores, armazenamento local (SQLite) sem necessidade de servidor de banco externo.
