import { AbstractPot } from "../../entities/Pot";


export class WarPot extends AbstractPot {

    clear(): void {
        this.cards = [];
    }
}