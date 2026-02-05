
#  Ponto Público API

API RESTful completa para gerenciamento, geolocalização e avaliação de serviços públicos. O sistema integra mapas interativos, avaliações de usuários e uma rede social baseada em grafos para recomendações.

---

##  Tecnologias Utilizadas

- **Backend:** Node.js, Express, TypeScript
- **Banco de Dados Primário:** MongoDB (com Mongoose)
- **Banco de Dados de Grafo:** Neo4j (AuraDB)
- **Validação de Dados:** Zod
- **Autenticação:** JWT (JSON Web Token)
- **Segurança:** Bcryptjs (Hash de senhas)
- **Arquitetura:** MVC (Model-View-Controller)

---

##  Configuração e Instalação

### 1. Pré-requisitos
- Node.js (v16 ou superior)
- MongoDB (Rodando localmente ou Atlas)
- Conta no Neo4j Aura (Opcional para funcionalidades sociais)

### 2. Instalação
Clone o repositório e instale as dependências:

```bash
npm install

Crie um arquivo .env na raiz do projeto e preencha com suas credenciais
EX:

# Servidor
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ponto-publico

# JWT Secret
JWT_SECRET=sua_chave_secreta_aqui

# Neo4j (Funcionalidades Sociais)
NEO4J_URI=neo4j+s://seu-instance-id.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=sua_senha_neo4j

Para iniciar o servidor em modo de desenvolvimento:
cd ponto-publico
npm run dev

Estrutura do Projeto

A organização segue a separação de responsabilidades para facilitar a manutenção e escalabilidade.

### Estrutura do Projeto

A organização segue a separação de responsabilidades para facilitar a manutenção e escalabilidade.

src/
├── config/         # Configurações de banco (Mongo/Neo4j)
├── controllers/    # Lógica de controle das requisições
├── middlewares/    # AuthMiddleware e ValidateResource
├── models/         # Modelos de dados (Mongoose Schemas)
├── routes/         # Definição das rotas da API
├── schemas/        # Schemas auxiliares
└── validators/     # Regras de validação com Zod