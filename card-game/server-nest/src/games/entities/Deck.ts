import { ICard } from '../../interfaces';
import { IDeck } from '../../interfaces';

export  class Deck implements IDeck {
    public cards: ICard[];

    constructor(cards: ICard[]) {
        console.log(cards.length, "cards in deck constructor Deck.ts");
        this.cards = cards;
        this.shuffle();

    }
    shuffle(): void {
        this.cards.sort(() => Math.random() - 0.5);
    }

    draw(): ICard | null {
        return this.cards.length > 0 ? this.cards.pop() || null : null;
    }
    isEmpty(): boolean {
        return this.cards.length === 0;
    }

    getLength(): number {
        return this.cards.length;
    }

    getAllCards(): ICard[] {
        return [...this.cards];
    }
}