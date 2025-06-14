import { GameType } from './game-type.enum';
import { IPlayer }  from '../player/player.interface';
import { IDeck }    from '../cards/deck.interface';
import { IPot }     from '../cards/pot.interface';

export interface GameState {
  gameId: string;
  type:   GameType;
  players: IPlayer[];
  deck:    IDeck;
  pot:     IPot;
  currentPlayerIndex: number;
  turnHistory: any[];
  gameOver: boolean;
  winner?: IPlayer;
}
