# Frontend Íris — revisão pelo Figma e PDF

Implementação local dos quadros Início, Perfil e histórico, Atendimento clínico, Óticas parceiras e Receituário. Mantém os dados reais; os exemplos da referência não são inseridos no banco do consultório.

## O que mudou

- Painel com atendimentos recentes, resumo de OD/OE, filtro de período e paginação real.
- Prontuário com linha do tempo e comparação descritiva com o registro anterior.
- Formulário clínico com cabeçalho comum de medidas, seções numeradas e ação Salvar e Gerar Receita.
- Óticas em modal com formulário e lista lado a lado. Por decisão do usuário, continuam os campos nome, contato e endereço, com exclusão bloqueada por vínculos; sem telefone separado nem status ativo/inativo.
- Receita em folha branca, com painel lateral e CSS para impressão. Baixar PDF abre a impressão do navegador, onde se escolhe Salvar como PDF. Impressão física não foi validada.
- Dados fictícios de clínica/endereço/credenciais não foram copiados. Novos pacientes no mês não são calculados porque o modelo não registra data de cadastro.
- Perto é calculado conforme a fórmula exibida na referência: esférico + adição, somente quando ambos foram informados. Zero é preservado e campos ausentes permanecem sem valor. DNPs são somadas apenas para conferência; o campo DP continua manual.

## Backend

`GET /api/painel?dias=7&pagina=1&hoje=2026-11-01&busca=` fornece contagens do dia e cinco registros por página. Períodos aceitos: 7, 30, 90 e 0 (todos). A data enviada pelo navegador define o dia local.

Exclusão de pacientes e óticas: 204 sem vínculos; 409 com mensagem amigável quando há atendimentos; 404 para identificadores inexistentes. A exclusão e a condição de ausência de vínculo usam uma única instrução SQL, sem apagar o histórico.

O Vite usa `/api` com proxy para `localhost:5145`. Para implantação fora do Vite, configurar proxy equivalente ou `VITE_API_URL`. `IRIS_API_TARGET` permite direcionar exclusivamente uma prévia de teste para outra API.

## Validação reproduzível

Na raiz:

```powershell
dotnet build Optometria.Api --no-restore -p:UseAppHost=false -o .tmp/backend-build
dotnet run --project tests/BackendChecks
npm --prefix optometria-web run build
```

Os checks usam SQLite em memória e verificam exclusões, preservação de vínculos, 404, período, paginação e contagens. O argumento opcional `.tmp/iris-qa.db` cria somente uma base isolada de exemplos para revisão visual.

Conferidos no navegador: painel, perfil, receita, modal de óticas e gravação de uma consulta no banco isolado com zero explícito e campos vazios. Build da API e do frontend passaram. O restore não conseguiu consultar a auditoria de vulnerabilidades do NuGet por restrição de rede; os pacotes já estavam disponíveis.

## Execução normal

```powershell
dotnet run --project Optometria.Api --launch-profile http
```

Em outro terminal:

```powershell
npm --prefix optometria-web run dev
```

Acesse http://localhost:5173. Navegação utiliza estado React; recarregar a tela volta ao início. Formulários não salvos não persistem.
