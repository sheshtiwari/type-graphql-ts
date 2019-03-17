# GraphQL API

## Setting up

- install dependencies: `npm i`
- copy `.env.example` into `.env` and edit for desired run configuration
- to create dotenv file for specific environment create `.env.${NODE_ENV}` file, by default `.env` will be in use
- install and run postgres
- to set env:
  - development use `NODE_ENV=development`
  - production use `NODE_ENV=production`
  - test use `NODE_ENV=test`

## Environments

| Variable   | Description              |     Default      |
| ---------- | :----------------------- | :--------------: |
| NODE_ENV   | Environment              |  `development`   |
| PORT       | Port                     |      `4000`      |
| HOST       | Host                     |   `127.0.0.1`    |
| PG_URL     | Postgres Url             |                  |
| JWT_SECRET | Secret key for web token | `jwt-secret-key` |

## Commands

Following commands expect that desired node.js version is set as default version used system-wide.

### Install dependencies:

```bash
$ npm install
```

### Run server:

```
$ npm start
```

### Run development server in watch mode:

```bash
$ npm run start:dev
```

### Build app from ts to vanilla js:

```
$ npm build
```

### Run linter:

```bash
$ npm run lint
```

### Run linter fix:

```bash
$ npm run lint:fix
```

### Create user:

```
$ npm run create:user -- --login=<login> --password=<password>
```

### Create test data :

```
$ npm run create:test-data
```

### Typeorm

#### Typeorm CLI:

```bash
$ npm run typeorm -- <...params>
```

#### Drop database schema:

```bash
$ npm run db:drop
```

#### Create migration:

```bash
$ npm run migration:create -- <name>
```

#### Run migrations:

```bash
$ npm run migration:run
```

#### Revert migrations:

```bash
$ npm run migration:revert
```

#### Create entity:

```bash
$ npm run entity:create -- <name>
```
