<h1 align='center'>Projeto-LabeCommerce</h1>

##  Sobre esse projeto 


O LabeCommerce é uma API de e-commerce criada em NodeJS e programada em TypeScript. Utilizando as tecnologias Express, Knex e SQLite, a API permite o cadastro e a busca de usuários, produtos e informações de compras. O gerenciamento do banco de dados é realizado pelo Knex, que utiliza o SQLite como base.

A documentação da API  é clara e objetiva, detalhando as funcionalidades disponíveis e seu uso, o que simplifica a integração com outras aplicações e o desenvolvimento.

Por fim, o LabeCommerce é uma aplicação completa e funcional que serve como um ótimo ponto de partida para o desenvolvimento de projetos de comércio eletrônico em NodeJS.

##  Funcionalidades
A coleção de endpoints da API LabeCommerce no Postman foi criada para gerenciar uma plataforma de comércio eletrônico. Ela inclui vários endpoints para gerenciar usuários, produtos e compras. Abaixo estão detalhes dos endpoints disponíveis:

-   **`Get All Users`**: Retorna todos os usuários cadastrados no sistema.

-   **`Get All Products`**: Retorna todos os produtos cadastrados no sistema.
-   **`Get Product By Name`**: Permite buscar por um produto na lista de produtos por meio de sua nome.

-   **`Get Product By Id`**: Recebe um GET request com um parâmetro de ID do produto. Ele procura o produto com o ID correspondente na lista de produtos e retorna o resultado.

-   **`Create New User`**: Cria um novo usuário na plataforma.
    
-   **`Create New Product`**: Permite criar um novo produto na plataforma.
    
-   **`Create New Purchase`**: Permite ao usuário realizar uma compra de um produto especificado, informando o id do usuário, id do produto, quantidade e preço total.

-   **`Edit product by id`**: Permite atualizar as informações de um produto existente com base no ID do produto.

-   **`Edit User by id`**: Permite atualizar as informações de um usuário existente com base no ID de cadastro.
    

-   **`Get User Purchase By Buyer Id`**: Retorna todos as purchases cadastradas no id de um usuário.
    
-   **`Delete product by id`**: Permite excluir um produto existente com base no ID de cadastrado.

-   **`Delete User by id`**: Permite excluir um usuário existente com base no ID de cadastrado.

-   **`Delete Purchase by id`**: Permite excluir uma purchase existente com base no ID de cadastrado.
    
-   **`Get Purchase by id`**: Retorna informações sobre uma compra existente com base no ID da compra especificada.
    

Em suma, a coleção LabeCommerce oferece uma variedade de endpoints de API completos para gerenciar usuários, produtos e compras em uma plataforma de comércio eletrônico. Esses endpoints são acessíveis por desenvolvedores e outras partes interessadas por meio de chamadas de API bem definidas.


A documentação completa está nesse link:

https://documenter.getpostman.com/view/24823254/2s93Y5Neoj

##  Tecnologias utilizadas

- **NodeJS**: Plataforma de desenvolvimento de software para construir aplicativos escaláveis ​​em JavaScript.

- **Typescript**: Superset do JavaScript que adiciona tipos estáticos opcionais à linguagem.

- **Express**: Framework de aplicativo para NodeJS que fornece uma camada abstrata para lidar com as solicitações HTTP.

- **SQL e SQLite**: Linguagens de consulta estruturada e um banco de dados relacional embutido, respectivamente, usados ​​para gerenciar a persistência de dados do projeto.

- **Knex**: Biblioteca de construção de consultas SQL para NodeJS que suporta vários bancos de dados.

- **Postman**: Ambiente de desenvolvimento de API que permite testar APIs e criar solicitações HTTP.

##  Instalação :computer: :fireworks:

Para instalar o projeto que utiliza NodeJS, Typescript, Express, SQL e SQLite, Knex e Postman, siga as seguintes etapas:

<b>Instalação do NodeJS</b>: faça o download do NodeJS em https://nodejs.org/en/download/ e instale-o seguindo as instruções do instalador.

<b>Instalação do Typescript</b>: abra o terminal ou prompt de comando e digite o comando `npm install -g typescript`. Isso instalará o Typescript globalmente em sua máquina.

**Criação do projeto**: crie uma pasta para o projeto e abra o terminal ou prompt de comando na pasta criada. Em seguida, digite o comando `npm init -y`. Isso criará um arquivo package.json padrão na pasta do projeto.

**Instalação do Express e SQLite**: digite o comando `npm install express sqlite3 @types/express @types/sqlite3` no terminal ou prompt de comando na pasta do projeto.

**Instalação do Knex**: digite o comando `npm install knex @types/knex sqlite3` no terminal ou prompt de comando na pasta do projeto.

**Configuração do Knex**: crie um arquivo knexfile.js na raiz do projeto com as configurações do banco de dados. Em seguida, crie um arquivo database.ts na pasta src com as configurações do Knex para acessar o banco de dados.

**Instalação do Postman**: faça o download e instale o Postman em https://www.postman.com/downloads/.

##  Colaboradores 🛠

Durante a realização do projeto, criamos um grupo de apoio para que  conseguíssemos ajudar e ser ajudado a medida que as dúvidas e os erros iam aparecendo, e nesse processo obtive o apoio das pessoas abaixo listadas.

**Guilherme Dias**,

**Jaziel Bury**,

**Pedro Henrique**,

**Pedro Magno**,

**Felício de Souza**, 

## Status do Projeto  🚧

Concluído.🙏👨‍💻
