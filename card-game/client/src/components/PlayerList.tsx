import { PlayerState } from "../types/player";

export default function PlayerList({ players }: { players: PlayerState[] }) {
  return (
    <ul className="bg-white rounded-2xl shadow p-4 flex gap-3 flex-wrap">
      {players.map((player) => (
        <li
          key={player.id}
          className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 flex flex-col items-center min-w-28"
        >
          <span className="font-bold text-blue-700">{player.name}</span>
          {/* מקום לסטטוס READY עתידי */}
        </li>
      ))}
    </ul>
  );
}
