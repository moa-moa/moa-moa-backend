<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## 🚩 Tech Stack
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

## 🚩 Installation

```bash
$ npm install

# Connect localDB(MySQL) using docker
sh run-mysql.sh
```

## 🚩 Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🚩 API DOCS

localhost : http://localhost:3000/api-docs/

---


### before git push

```bash
npx prisma format
npm run lint
npm run format
```

### after git pull (main)

```bash
# 다음 명령을 사용하여 Prisma 클라이언트 생성
npx prisma generate

# 스키마 Local DB에 적용
npx prisma migrate dev

# Prisma Studio로 확인 (에러가 난다면 migrate 에러일 가능성 높음)
npx prisma studio
```
