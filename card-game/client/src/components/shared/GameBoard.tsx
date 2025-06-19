import { ICard } from '../../types/card';
import CardDisplay from './CardDisplay';

export default function GameBoard({ pile }: { pile: ICard[] }) {
  return (
    <div className="flex gap-2 justify-center items-center p-6 bg-gray-100 rounded-2xl shadow-inner">
      {pile.map((card, i) => (
        <CardDisplay card={card} key={i} />
      ))}
    </div>
  );
}