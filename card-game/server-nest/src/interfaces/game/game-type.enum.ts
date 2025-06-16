import { ICard } from '../../interfaces';
export enum GameType {
    DURAK = 'durak',
    WAR = 'war',
    POKER = 'poker',
    BLACKJACK = 'blackjack',
    UNO = 'uno',
}

interface WarGameState {
    players: { id: string; deck: ICard[] }[];
    pile: ICard[];
    state: 'in-progress' | 'game-over';
    winner?: string;
}