# CRUD de Livros

Projeto simples para demonstrar testes de API utilizando Node.js e um front-end em HTML, CSS e JavaScript para interagir com a API.  
A API permite realizar operações de **criação**, **leitura**, **atualização** e **deleção** de livros, e conta com documentação via Swagger.

## Funcionalidades

- **Adicionar Livro:** Cria um novo livro com informações de nome, autor e número de páginas.
- **Listar Livros:** Exibe todos os livros cadastrados.
- **Buscar Livro por ID:** Permite buscar e exibir as informações de um livro específico através do seu ID.
- **Atualizar e Deletar Livro:** Endpoints disponíveis para atualizar ou deletar um livro (não expostos na interface do front-end).

## Tecnologias Utilizadas

- **Backend:** Node.js, Express, CORS, Swagger UI Express, Swagger JSDoc.
- **Frontend:** HTML, CSS e JavaScript.

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão LTS recomendada).
- Gerenciador de pacotes NPM ou Yarn.

## Como Executar

1. **Clone o repositório:**

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie o servidor:**

   ```bash
   npm start
   ```

   O servidor iniciará na porta `3000` por padrão.

4. **Acessando a Aplicação:**

   - **API:** Acesse os endpoints via `http://localhost:3000`.
   - **Documentação Swagger:** Disponível em `http://localhost:3000/api-docs`.
   - **Front-end:** Abra o arquivo `index.html` no seu navegador.

## Estrutura do Projeto

```
├── index.html      # Interface do front-end
├── app.js          # Lógica do front-end para consumir a API
├── server.js       # API REST em Node.js com endpoints de CRUD e configuração do Swagger
└── README.md       # Este arquivo
```

## Uso

- **Adicionar Livro:** Preencha os campos do formulário "Adicionar Livro" e clique em **Adicionar**.
- **Listar Livros:** Clique no botão **Listar Todos os Livros** para ver a lista de livros cadastrados.
- **Buscar Livro por ID:** Insira o ID desejado e clique em **Buscar** para exibir os dados do livro.

## Documentação da API

A documentação completa da API está disponível via Swagger em:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Contribuições

Sinta-se à vontade para enviar sugestões, correções e melhorias através de _pull requests_.