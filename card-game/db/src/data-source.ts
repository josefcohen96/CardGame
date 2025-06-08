import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User.entity";
import { GameStats } from "./entities/GameStats.entity";

export const AppDataSource = new DataSource({
  type: "sqlite", // או postgres, mysql וכו'
  database: "./db.sqlite", // אפשר גם לשים בתיקייה db/data/cardgame.sqlite
  synchronize: true, // בפיתוח בלבד!
  logging: false,
  entities: [User, GameStats],
  migrations: [],
  subscribers: [],
});
