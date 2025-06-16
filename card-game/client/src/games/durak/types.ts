import { GameState } from "../../types/game";
import { Card } from "../../types/card";
import { PlayerState } from "../../types/game";

// טיפוסים ייחודיים לדוראק
export interface DurakPlayerState extends PlayerState {
    isDefending: boolean;
}

export interface DurakGameState extends GameState {
    tableCards: Card[];
    trumpSuit: string;
    attackCards: Card[];
    defenseCards: Card[];
    // ...
}
