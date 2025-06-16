import { usePlayerName } from "../../context/PlayerNameContext";

export default function Header() {
  const { playerName, setPlayerName } = usePlayerName();

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-blue-600 rounded-b-2xl">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🃏</span>
        <span className="font-bold text-white text-xl">Card Games Arena</span>
      </div>
      {/* שדה שם מימין */}
      <div className="flex items-center gap-2">
        <input
          className="rounded px-2 py-1 text-sm border border-gray-200 focus:outline-none focus:ring focus:border-blue-300"
          style={{ direction: "rtl" }}
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <span className="text-white font-bold">:השם שלך</span>

      </div>
    </header>
  );
}
