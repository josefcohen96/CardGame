import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class GameStats {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, user => user.stats)
  @JoinColumn()
  user!: User;

  @Column({ default: 0 })
  gamesPlayed!: number;

  @Column({ default: 0 })
  gamesWon!: number;
}
