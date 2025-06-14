import { PlayerState } from "../types/player";

export default function PlayerList({ players }: { players: PlayerState[] }) {
  return (
    <ul className="bg-white rounded-2xl shadow p-4 flex gap-3 flex-wrap">
      {players.map(p => (
        <li key={p.id}
          className={`px-3 py-2 rounded-xl border flex flex-col items-center min-w-28
                        ${p.ready ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
          <span className="font-bold">{p.name}{p.isHost && ' 👑'}</span>
          <span className="text-xs">{p.ready ? 'Ready' : 'Not ready'}</span>
        </li>
      ))}
    </ul>
  );
}
