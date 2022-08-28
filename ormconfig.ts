require("dotenv").config()
import { ConnectionOptions } from "typeorm"

let options: ConnectionOptions;

if(process.env.DB_TYPE === "postgres"){
  options = {
    name: 'default',
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    schema: process.env.DB_SCHEME,
    entities: [__dirname + '/src/Entities/*.ts'],
    migrations: [__dirname + '/src/Migrations/*.ts'],
    migrationsTableName: "migrations",
    cli: {
      migrationsDir: 'src/Migrations',
      entitiesDir: 'src/Entities'
    },
  }
}
else{
  options = {
    name: 'default',
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [__dirname + '/src/Entities/*.ts'],
    migrations: [__dirname + '/src/Migrations/*.ts'],
    migrationsTableName: "migrations",
    cli: {
      migrationsDir: 'src/Migrations',
      entitiesDir: 'src/Entities'
    },
  }
}

export = options