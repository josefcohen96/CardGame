import { Card } from "../entities/Card";

export interface ICardValueStrategy {
    getCardValue(card: Card): number;
}