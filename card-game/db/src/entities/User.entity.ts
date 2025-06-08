import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { GameStats } from "./GameStats.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  displayName!: string;

  @Column({ type: "json", nullable: true })
  achievements!: any[];

  @OneToOne(() => GameStats, stats => stats.user, { cascade: true })
  stats!: GameStats;
}
