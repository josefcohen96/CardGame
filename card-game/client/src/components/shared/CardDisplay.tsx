import { Card } from '../../types/card';
import { motion } from 'framer-motion';

export default function CardDisplay({ card, hidden = false }: { card: Card; hidden?: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-12 h-16 flex flex-col items-center justify-center border rounded-xl shadow text-2xl font-semibold bg-white ${
        hidden ? 'bg-blue-200 text-transparent' : card.color === 'red' ? 'text-red-600' : 'text-black'
      }`}
    >
      {!hidden && (
        <>
          <span>{card.value}</span>
          <span>{card.suit}</span>
        </>
      )}
    </motion.div>
  );
}
