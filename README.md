<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## ๐ฉ Tech Stack
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/16.15.1 lts-339933?style=for-the-badge&logo=&logoColor=white">
<br>
<img src="https://img.shields.io/badge/nest.js-DD0031?style=for-the-badge&logo=nestjs&logoColor=white"> <img src="https://img.shields.io/badge/8.2.8-DD0031?style=for-the-badge&logo=16.15.1&logoColor=white">
<br>
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> <img src="https://img.shields.io/badge/8.0.29-4479A1?style=for-the-badge&logo=&logoColor=white">
<br>
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"> <img src="https://img.shields.io/badge/4.0.0-2D3748?style=for-the-badge&logo=&logoColor=white">
<br>
<img src="https://img.shields.io/badge/typescript-339AF0?style=for-the-badge&logo=typescript&logoColor=white">
<br>

## ๐ฉ Installation

```bash
$ npm install

# Connect localDB(MySQL) using docker
sh run-mysql.sh
```
## ๐ฉ DB Schema (Latest Version)
https://dbdiagram.io/d/630df7580911f91ba5f74b18

## ๐ฉ Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## ๐ฉ API DOCS (swagger)

localhost : http://localhost:3000/api-docs/ </br>
GCP ๋ฐฐํฌ์์ 

---


### before git push

```bash
npx prisma format
npm run lint
npm run format
```

### after git pull (main)

```bash
# ๋ค์ ๋ช๋ น์ ์ฌ์ฉํ์ฌ Prisma ํด๋ผ์ด์ธํธ ์์ฑ
npx prisma generate

# ์คํค๋ง Local DB์ ์ ์ฉ
npx prisma migrate dev

# Prisma Studio๋ก ํ์ธ (์๋ฌ๊ฐ ๋๋ค๋ฉด migrate ์๋ฌ์ผ ๊ฐ๋ฅ์ฑ ๋์)
npx prisma studio
```
