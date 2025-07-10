# Windly

Windly é um aplicativo mobile de previsão do tempo, com navegação intuitiva por abas, integração com mapas interativos e visualização de dados meteorológicos em tempo real. A aplicação é composta por um frontend mobile desenvolvido em React Native e um backend construído com Node.js. Utiliza banco de dados PostgreSQL e MongoDB, além de estar containerizada com Docker.

---

## Funcionalidades Principais

O app é composto por quatro telas principais, acessíveis por navegação em abas:

- **Home**: exibe a previsão do tempo atual com base na localização do usuário.
- **Cidades**: permite buscar e visualizar a previsão em diferentes cidades.
- **Mapa**: apresenta um mapa interativo com dados meteorológicos sobrepostos.
- **Configurações**: tela para ajustes do usuário e preferências do aplicativo.

---

## Tecnologias Utilizadas

### Mobile (React Native)

- react Native  + Expo
- axios
- react-native-maps
- react-native-char-kit
- luicde-react-native

### Backend Principal(Node.js + Express)

- node.js
- express
- morgan
- cors
- bcrypt
- pg
- swagger
- jwt
  
### Backend Secundário(Node.js + Express)

- node.js
- mongoose
- express
- morgan

### Banco de Dados

- PostgreSQL
- MongoDB

### Infraestrutura

- Docker
- Docker Compose

Siga os passos abaixo para clonar e executar o projeto Windly localmente utilizando Docker. Também incluí instruções alternativas caso prefira executar sem contêineres.

### 1. Clone o repositório

https://github.com/Lduarte123/windly.git

### 2. Comandos Para iniciar o projeto
Frontend
```bash
cd app
npm install
npm start
```
Backend Principal
```bash
cd api
npm i
npm start
```
Backend Secundario
```
cd nsql
npm i
node server.js
```


