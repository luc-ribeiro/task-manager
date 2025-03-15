# API de Gerenciamento de Tarefas

Uma API RESTful para gerenciamento de tarefas desenvolvida com [Node.js](https://nodejs.org/), Express.js, TypeScript e MySQL.

## Funcionalidades

- CRUD completo de tarefas
- Validação e sanitização de dados
- Testes unitários
- Dockerização da aplicação
- TypeScript para tipagem estática
- ES Modules para importações
- Estrutura modular de controllers
- Queries SQL diretas (sem ORM)
- Documentação com Swagger

## Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/)

## Executando os testes unitários

Para executar os testes, use o seguinte comando localmente:

```bash
npm test
```

## Executando a aplicação com Docker

Para iniciar a aplicação, basta executar o seguinte comando na raiz do projeto:

```bash
# Iniciar os containers
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

A API estará disponível em `http://localhost:9000`.

## Desenvolvimento local

Para desenvolvimento local, você pode executar:

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Compilar TypeScript
npm run build

# Executar a aplicação compilada
npm start
```

## Documentação da API (Swagger)

A documentação da API está disponível localmente através do Swagger UI em: `http://localhost:9000/api-docs`.

## Endpoints da API

### Listar todas as tarefas
```
GET /tasks
```

### Obter uma tarefa específica
```
GET /tasks/:id
```

### Criar uma nova tarefa
```
POST /tasks
```
Corpo da requisição:
```json
{
  "title": "Título da tarefa",
  "description": "Descrição da tarefa",
  "status": "pendente"
}
```

### Atualizar uma tarefa existente
```
PUT /tasks/:id
```
Corpo da requisição:
```json
{
  "title": "Novo título",
  "description": "Nova descrição",
  "status": "em andamento"
}
```

### Excluir uma tarefa
```
DELETE /tasks/:id
```

## Solução de problemas

### Conexão com o banco de dados

Se encontrar problemas de conexão com o banco de dados, verifique:

1. Se os containers estão rodando:
```bash
docker-compose ps
```

2. Logs do container do banco de dados:
```bash
docker-compose logs db
```

3. Tente reiniciar os serviços:
```bash
docker-compose restart
```

## Estrutura do projeto

```
task-manager/
├── config/             # Configuração de bibliotecas
├── db/                 # Configuração do banco de dados
├── src/
│   ├── controllers/    # Controladores
│   ├── middleware/     # Middlewares
│   ├── repositories/   # Repositórios para acesso ao banco
│   ├── routes/         # Rotas da API
│   ├── types/          # Modelos e tipos
│   ├── validators/     # Validadores de entrada
│   ├── app.ts          # Configuração do Express
│   └── server.ts       # Ponto de entrada da aplicação
├── .env                # Variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
├── docker-compose.yml  # Configuração do Docker Compose
├── Dockerfile          # Configuração do Docker
└── README.md           # Documentação
```