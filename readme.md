# CRUD de Livros

Projeto simples para demonstrar testes de API utilizando Node.js e um front-end em HTML, CSS e JavaScript para interagir com a API. Os dados são persistidos em um banco MySQL servido via Docker, com uma rotina automática de limpeza para manter o ambiente previsível durante a prática de testes.

## Funcionalidades

- **Adicionar Livro:** Cria um novo livro com informações de nome, autor e número de páginas.
- **Listar Livros:** Exibe todos os livros cadastrados.
- **Buscar Livro por ID:** Permite buscar e exibir as informações de um livro específico através do seu ID.
- **Atualizar e Deletar Livro:** Endpoints disponíveis para atualizar ou deletar um livro (não expostos na interface do front-end).
- **Limpeza Automática:** Enquanto o servidor está rodando, todos os livros são apagados a cada hora cheia (cron `0 * * * *`). `npm start` e `npm stop` por si só **não** apagam dados.

## Tecnologias Utilizadas

- **Backend:** Node.js, Express, CORS, Swagger UI Express, Swagger JSDoc, mysql2, node-cron, dotenv.
- **Frontend:** HTML, CSS e JavaScript.
- **Banco de Dados:** MySQL 8.0 (Docker), com Adminer para administração via web.

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão LTS recomendada).
- Gerenciador de pacotes NPM ou Yarn.
- [Docker](https://www.docker.com/) e Docker Compose para subir o banco localmente.

## Como Executar

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/brunonf15/crud-livros.git
   cd crud-livros
   ```

2. **Configure as variáveis de ambiente:**

   Copie o arquivo de exemplo e ajuste se necessário:

   ```bash
   cp .env.example .env
   ```

   Os valores padrão já são compatíveis com o `docker-compose.yml` deste repositório.

3. **Suba o banco de dados:**

   ```bash
   docker-compose up -d
   ```

   Isso inicia dois containers:
   - **MySQL** em `localhost:3307` (database `crudlivros`, user `crudlivros`, senha `crudlivros123`).
   - **Adminer** em [http://localhost:8081](http://localhost:8081) para inspeção da base via navegador.

4. **Instale as dependências:**

   ```bash
   npm install
   ```

5. **Inicie o servidor:**

   ```bash
   npm start
   ```

   O servidor cria a tabela `livros` automaticamente na primeira inicialização e fica escutando na porta `3000`.

6. **Acessando a Aplicação:**

   - **Front-end:** [http://localhost:3000/index.html](http://localhost:3000/index.html)
   - **API:** `http://localhost:3000/livros`
   - **Documentação Swagger:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
   - **Adminer:** [http://localhost:8081](http://localhost:8081) (sistema: MySQL, servidor: `db`, usuário/senha conforme `.env`).

## Variáveis de Ambiente

| Variável      | Padrão            | Descrição                              |
|---------------|-------------------|------------------------------------------|
| `PORT`        | `3000`            | Porta HTTP do servidor Express           |
| `DB_HOST`     | `localhost`       | Host do MySQL                            |
| `DB_PORT`     | `3307`            | Porta do MySQL (host)                    |
| `DB_USER`     | `crudlivros`      | Usuário do MySQL                         |
| `DB_PASSWORD` | `crudlivros123`   | Senha do MySQL                           |
| `DB_NAME`     | `crudlivros`      | Nome da base de dados                    |

Para usar credenciais diferentes (por exemplo, em produção), basta editar o `.env` — o servidor não exige alterações no código.

## Limpeza Automática

Ao iniciar o servidor, é registrado um job cron que executa `TRUNCATE TABLE livros` toda hora cheia (00:00, 01:00, 02:00, ...). Isso garante um estado limpo e previsível para os alunos automatizarem testes sem precisar reiniciar containers manualmente.

- O job só dispara enquanto o processo Node está em execução.
- Se o servidor estiver fora do ar no exato minuto da virada da hora, aquele tick é perdido (não há catch-up).
- Para zerar manualmente, basta reiniciar o container do MySQL com `docker-compose down -v && docker-compose up -d`.

## Estrutura do Projeto

```
crud-livros/
├── package.json        # Configurações e scripts do projeto
├── server.js           # API REST em Node.js + Swagger
├── db.js               # Conexão com MySQL (pool + bootstrap do schema)
├── cleanup.js          # Job cron de limpeza horária
├── docker-compose.yml  # MySQL + Adminer
├── .env.example        # Template de variáveis de ambiente
└── public/             # Arquivos estáticos (HTML, CSS, JavaScript)
    ├── index.html
    └── app.js
```

## Uso

- **Adicionar Livro:** Preencha os campos do formulário "Adicionar Livro" e clique em **Adicionar**.
- **Listar Livros:** Clique em **Listar Todos os Livros**.
- **Buscar Livro por ID:** Insira o ID e clique em **Buscar**.

## Documentação da API

A documentação completa da API está disponível via Swagger em:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Contribuições

Sinta-se à vontade para enviar sugestões, correções e melhorias através de _pull requests_.
