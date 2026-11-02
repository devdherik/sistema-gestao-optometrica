# Frontend Íris

Implementação local baseada nos quadros “Início — Desktop”, “Perfil e histórico — Desktop”, “Atendimento clínico — Desktop” e “Receituário — Desktop” do Figma Gestão Optometrica.

## Estrutura

- `src/App.jsx`: cabeçalho, navegação, início, pacientes, histórico, óticas e formulários cadastrais.
- `src/Clinical.jsx`: registro clínico e receita para impressão.
- `src/index.css`: identidade visual Íris, adaptação a telas menores e impressão.
- `src/services/api.js`: serviços existentes da API .NET, com leitura de mensagens de validação.

## Fluxos

Buscar paciente → Ver Prontuário → Nova Consulta → Salvar atendimento → Ver atendimento e receita → Imprimir receita.

Pacientes → Novo Paciente; prontuário → Editar cadastro.

Óticas Parceiras → Nova ótica ou Editar.

## Adaptações ao backend atual

- A API fornece histórico por paciente, mas não uma listagem geral de consultas. Por isso o início permite escolher o paciente e consulta seu histórico; não apresenta totais globais de atendimentos do dia.
- Contagens de pacientes e óticas vêm da API. Não existem dados fictícios ou cadastro de demonstração no frontend.
- Busca por nome e telefone e paginação são locais, sobre a lista de pacientes retornada pela API.
- Edição/exclusão de atendimentos e exclusões cadastrais não foram incluídas nesta interface.
- Campos numéricos vazios são enviados como `null`; zero informado permanece zero. Não há cálculo automático de grau de perto nem preenchimento clínico por inferência.
- Impressão usa o navegador, somente com os dados do atendimento e identificação do paciente. A assinatura e identificação do profissional têm espaço próprio, sem inventar credenciais ou endereço da clínica.
- A navegação desta primeira versão usa estado React; recarregar a página retorna ao início e descarta formulários não salvos.

## Execução

Inicie a API conforme o README principal. Na pasta `optometria-web`, execute `npm run dev -- --port 5173 --strictPort` e acesse http://localhost:5173.

## Validação

Build de produção concluído. Conferidos no navegador: tela inicial conectada à API, abertura do prontuário e histórico vazio e formulário de novo atendimento. Gravação clínica e impressão em papel ainda precisam de validação com dados de teste em banco separado.
