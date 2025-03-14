# API de Gerenciamento de Tarefas

Uma API RESTful para gerenciamento de tarefas desenvolvida com Node.js, Express.js, TypeScript e MySQL.

## Funcionalidades

- CRUD completo de tarefas
- Validação e sanitização de dados
- Testes unitários e de integração
- Dockerização da aplicação
- TypeScript para tipagem estática
- ES Modules para importações
- Estrutura modular de controllers
- Queries SQL diretas (sem ORM)

## Requisitos

- Docker
- Docker Compose

## Executando a aplicação

Para iniciar a aplicação, basta executar o seguinte comando na raiz do projeto:

```bash
docker-compose up
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

## Endpoints da API

### Listar todas as tarefas
```
GET /api/tasks
```

### Obter uma tarefa específica
```
GET /api/tasks/:id
```

### Criar uma nova tarefa
```
POST /api/tasks
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
PUT /api/tasks/:id
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
DELETE /api/tasks/:id
```

## Executando os testes

Para executar os testes, use os seguintes comandos:

```bash
# Todos os testes
docker-compose exec app npm test

# Apenas testes unitários
docker-compose exec app npm run test:unit

# Apenas testes de integração
docker-compose exec app npm run test:integration
```

## Estrutura do projeto

```
task-manager/
├── db/                 # Scripts SQL
├── src/
│   ├── controllers/    # Controladores
│   │   └── tasks/      # Controladores de tarefas
│   │       ├── getAllTasks.ts
│   │       ├── getTaskById.ts
│   │       ├── createTask.ts
│   │       ├── updateTask.ts
│   │       ├── deleteTask.ts
│   │       └── index.ts
│   ├── middleware/     # Middlewares
│   ├── models/         # Modelos e repositórios
│   │   ├── TaskTypes.ts
│   │   └── TaskRepository.ts
│   ├── routes/         # Rotas
│   ├── services/       # Serviços
│   │   └── database.ts # Serviço de banco de dados
│   ├── tests/          # Testes
│   │   ├── unit/       # Testes unitários
│   │   └── integration/# Testes de integração
│   ├── app.ts          # Configuração do Express
│   └── server.ts       # Ponto de entrada da aplicação
├── dist/               # Código compilado
├── .env                # Variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
├── docker-compose.yml  # Configuração do Docker Compose
├── Dockerfile          # Configuração do Docker
├── tsconfig.json       # Configuração do TypeScript
├── jest.config.js      # Configuração do Jest
├── package.json        # Dependências
└── README.md           # Documentação
``` 