import { Card } from "../types/card";

export default function CardDisplay({ card }: { card: Card }) {
  return (
    <div className={`w-12 h-16 flex flex-col items-center justify-center border rounded-xl shadow
      text-2xl font-semibold bg-white
      ${card.color === "red" ? "text-red-600" : "text-black"}
    `}>
      <span>{card.value}</span>
      <span>{card.suit}</span>
    </div>
  );
}
