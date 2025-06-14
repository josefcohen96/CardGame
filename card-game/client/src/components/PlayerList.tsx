import { PlayerState } from "../types/player";

/* קיים אצלך – רק האזור הרלוונטי */
export default function PlayerList({ players }: { players: PlayerState[] }) {
  return (
    <ul className="bg-white rounded-2xl shadow p-4 flex gap-3 flex-wrap">
      {players.map((p) => (
        <li
          key={p.id}
          className="px-3 py-2 rounded-xl border flex flex-col items-center min-w-28
                     bg-blue-50 border-blue-200"
        >
          <span className="font-bold text-blue-700">{p.name}</span>

          {/* ↓↓ מציג חיווי רק אם -לא- host */}
          {!p.isHost && (
            <span className="text-xs text-gray-500">
              {p.ready ? "✅ Ready" : "⌛ Not ready"}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
