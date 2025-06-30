# Como inicializar

- Clonar repositório;
- Dentro da pasta do projeto, rodar o comando `npm install`
- Criar um arquivo `.env` conforme o arquivo `.env.example`
- Inicializar o projeto rodando `npm run dev`
- O projeto estará em `localhost:4000`
- O projeto em produção está em `https://txt-flow.vercel.app/`

# Páginas

- `/`: Landpage acessível apenas para usuários deslogados; se o usuário estiver autenticado, será redirecionado para `/home`
- `/users/login`: Login
- `/users/register`: Cadastro
- `/home`: Feed bloqueado para usuários não autenticados; se o usuário **não** estiver autenticado, será redirecionado para `/users/login`
- `/not-found`: Página para erros
