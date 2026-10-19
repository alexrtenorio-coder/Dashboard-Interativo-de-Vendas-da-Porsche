# Dashboard-Interativo-de-Vendas-da-Porsche
Dashboard Interativo de Vendas da Porsche

# Dashboard Interativo de Vendas — Porsche

Projeto de portfólio de Business Intelligence desenvolvido com HTML, CSS,
JavaScript e Chart.js. O dashboard permite explorar dados demonstrativos de
vendas por meio de indicadores, filtros, gráficos e uma tabela interativa.

> **Aviso:** os 100 registros são fictícios e gerados pelo código para fins
> educacionais. Não são dados oficiais da Porsche, nem representam preços,
> clientes ou resultados comerciais reais.

## Objetivo

Demonstrar como transformar uma base de dados em indicadores e visualizações
que apoiem a investigação de perguntas de negócio.

## Funcionalidades

- Indicadores de faturamento líquido, unidades, ticket médio e desconto médio.
- Filtros por modelo, região, canal e ano.
- Pesquisa textual de vendas.
- Gráfico de faturamento por mês.
- Gráfico de faturamento por modelo.
- Gráfico de unidades por região.
- Tabela paginada com os registros.
- Exportação CSV dos dados filtrados.
- Interface responsiva para computador e celular.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Chart.js
- GitHub Pages

## Estrutura do projeto

```text
dashboard-vendas-porsche/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Como executar localmente

1. Baixe ou clone este repositório.
2. Abra a pasta no Visual Studio Code.
3. Inicie um servidor local, por exemplo, com Python:

```bash
python -m http.server 8000
```

4. Acesse `http://localhost:8000` no navegador.

Os gráficos usam a biblioteca Chart.js carregada por CDN; é necessária conexão
à internet para carregá-la.

## Perguntas de negócio

1. Como o faturamento varia ao longo dos meses?
2. Quais modelos apresentam maior faturamento na base demonstrativa?
3. Como as unidades vendidas se distribuem entre as regiões?
4. Qual é o ticket médio após aplicar os filtros?
5. Como varia o desconto médio no conjunto selecionado?

As respostas descrevem apenas os dados fictícios deste projeto.

## Publicação no GitHub Pages

1. Crie um repositório chamado `dashboard-vendas-porsche`.
2. Envie `index.html`, `style.css`, `script.js` e `README.md` para a raiz.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/(root)`.
6. Clique em **Save** e aguarde a publicação.

O endereço publicado seguirá este padrão:

`https://SEU-USUARIO.github.io/dashboard-vendas-porsche/`

Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub.

## Melhorias futuras

- Substituir os dados fictícios pela planilha fornecida no desafio.
- Incluir comparação entre períodos.
- Adicionar testes de qualidade dos dados.
- Documentar conclusões e limitações das análises.
- Registrar capturas de tela do dashboard publicado.

## Uso responsável dos dados

Antes de publicar dados reais, confirme que você tem autorização para
compartilhá-los. Não envie informações pessoais ou comerciais confidenciais
para um repositório público.
