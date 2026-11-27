# Documentação do Projeto

Guia e índice geral dos documentos de especificação, regras de negócio e arquitetura técnica do **Sistema de Gestão Optométrica**.

> **Status do Projeto:**  **MVP Finalizado (v1.0)** — Todos os 19 requisitos funcionais implementados e validados.

---

## Módulos Entregues no MVP

- [x] **Painel Inicial (Dashboard):** Indicadores consolidados em tempo real, atalhos rápidos e listagem dos atendimentos mais recentes.
- [x] **Módulo de Óticas Parceiras:** Cadastro, edição, busca e exclusão protegida via modal global acessível pela Navbar.
- [x] **Módulo de Pacientes e Prontuário:** Tabela com busca combinada (nome/telefone), ordenação, paginação, cadastro modal com máscara e prontuário com código `PAC-XXXXX` e cálculo de idade.
- [x] **Módulo de Atendimentos Clínicos:** Ficha clínica completa com refração OD/OE, conduta óptica (lentes e tratamentos), retorno automático para +1 ano e histórico em linha do tempo.
- [x] **Emissão e Impressão de Receita Médica:** Modal com pré-visualização e impressão isolada via iframe em layout padrão A4.

---

## Índice da Documentação

| Documento | Pergunta que responde | Conteúdo principal |
|---|---|---|
| [requisitos-v1.md](requisitos-v1.md) | **O que o sistema faz?** | Escopo do MVP, regras de negócio (RN-01 a RN-09), requisitos funcionais (RF-01 a RF-19) e estrutura de dados. |
| [referencia-tecnica.md](referencia-tecnica.md) | **Como o sistema é construído?** | Arquitetura geral, diagrama ER, padrão de camadas .NET, catálogo de componentes React e mecanismo de impressão isolada. |
| [glossario-clinico.md](glossario-clinico.md) | **O que significam os termos?** | Conceitos de optometria (esférico, cilíndrico, eixo, adição, DNP, etc.) explicados em linguagem simples e acessível. |

