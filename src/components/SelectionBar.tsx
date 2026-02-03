import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAssignGifts } from "@/hooks/useGifts";
import { toast } from "sonner";

interface SelectionBarProps {
  selectedCount: number;
  selectedIds: string[];
  onClearSelection: () => void;
}

export function SelectionBar({
  selectedCount,
  selectedIds,
  onClearSelection,
}: SelectionBarProps) {
  const [name, setName] = useState("");
  const assignGifts = useAssignGifts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Por favor ingresa tu nombre");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("El nombre debe tener al menos 2 caracteres");
      return;
    }

    if (trimmedName.length > 60) {
      toast.error("El nombre no puede tener más de 60 caracteres");
      return;
    }

    await assignGifts.mutateAsync({
      giftIds: selectedIds,
      assignedToName: trimmedName,
    });

    setName("");
    onClearSelection();
  };

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="selection-bar"
        >
          <div className="container mx-auto px-4 py-4 sm:px-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Gift className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedCount} regalo{selectedCount > 1 ? "s" : ""}{" "}
                    seleccionado{selectedCount > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 items-center gap-2">
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 sm:max-w-xs"
                  maxLength={60}
                />
                <Button
                  type="submit"
                  disabled={assignGifts.isPending}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Reservar</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClearSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
