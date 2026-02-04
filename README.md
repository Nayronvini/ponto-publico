Eu utilizei o supabase-js ao inves do sequelize, pelo que eu pesquisei o supabase-js(A biblioteca original do supabase) é mais segura do que um ORM comum como o Sequelize.

comandos npm do projeto:
cd ponto-publico
npm init -y
npm install express dotenv @supabase/supabase-js cors
node src/app.js

**NOTA:** Embora seja recomendado deixar o .env no .gitignore, por essa ser uma aplicação simples com finalidade educativa preferimos não criar o .env.example e apenas deixar o .env padrão.

---

Pós Mudança para TypeScript

Roda o projeto com:
cd ponto-publico
npm intall
*Criar o .env*
npm run dev

e abre o front