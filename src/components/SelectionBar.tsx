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
  isOtherSelected?: boolean;
  onClearSelection: () => void;
}

export function SelectionBar({
  selectedCount,
  selectedIds,
  isOtherSelected = false,
  onClearSelection,
}: SelectionBarProps) {
  const [name, setName] = useState("");
  const [otherGiftDescription, setOtherGiftDescription] = useState("");
  const assignGifts = useAssignGifts();
  
  const totalSelected = selectedCount + (isOtherSelected ? 1 : 0);

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

    if (isOtherSelected && !otherGiftDescription.trim()) {
      toast.error("Por favor especifica qué regalo quieres dar");
      return;
    }

    if (isOtherSelected && otherGiftDescription.trim().length < 3) {
      toast.error("La descripción del regalo debe tener al menos 3 caracteres");
      return;
    }

    await assignGifts.mutateAsync({
      giftIds: selectedIds,
      assignedToName: trimmedName,
      otherGiftDescription: isOtherSelected ? otherGiftDescription.trim() : undefined,
    });

    setName("");
    setOtherGiftDescription("");
    onClearSelection();
  };

  return (
    <AnimatePresence>
      {totalSelected > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="selection-bar"
        >
          <div className="container mx-auto px-4 py-5 sm:px-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                  <Gift className="h-5 w-5 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {totalSelected} regalo{totalSelected > 1 ? "s" : ""}{" "}
                    seleccionado{totalSelected > 1 ? "s" : ""}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center"
              >
                <div className="flex flex-1 gap-3">
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 sm:max-w-xs rounded-xl border-border/60 focus:border-primary/50"
                    maxLength={60}
                  />
                  {isOtherSelected && (
                    <Input
                      type="text"
                      placeholder="¿Qué regalo quieres dar?"
                      value={otherGiftDescription}
                      onChange={(e) => setOtherGiftDescription(e.target.value)}
                      className="flex-1 sm:max-w-xs rounded-xl border-border/60 focus:border-primary/50"
                      maxLength={200}
                    />
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={assignGifts.isPending}
                  className="gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  <Send className="h-4 w-4" strokeWidth={2} />
                  <span className="hidden sm:inline">Reservar</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClearSelection}
                  className="hidden sm:flex rounded-xl hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
