/* -------------------------------------------------------------------------- */
/*                          SHARED MODAL PRIMITIVES                           */
/* -------------------------------------------------------------------------- */
import { motion } from "framer-motion";

export function Backdrop({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
