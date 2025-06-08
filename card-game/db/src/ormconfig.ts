import { DataSourceOptions } from "typeorm";
import { User } from "./entities/User.entity";
import { GameStats } from "./entities/GameStats.entity";

export default {
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, GameStats],
  migrations: [],
  subscribers: [],
} as DataSourceOptions;
