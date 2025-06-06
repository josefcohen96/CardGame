import { GameState } from '../../types/game'
import { Card } from '../../types/card'
// טיפוסים ייחודיים למלחמה (אם צריך)
export interface WarGameState extends GameState {
    warPile?: Card[];
}