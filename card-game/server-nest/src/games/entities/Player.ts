import { IPlayer } from '../../interfaces';

export class Player implements IPlayer {
  id: string;
  name: string;
  constructor(id: string, name: string = 'Player') {
    {
      this.id = id;
      this.name = name;
    }
  }
}