import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2 } from "lucide-react";
import { useGifts } from "@/hooks/useGifts";
import { GiftCard } from "./GiftCard";
import { SelectionBar } from "./SelectionBar";

export function GiftList() {
  const { data: gifts, isLoading, error } = useGifts();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive">Error al cargar los regalos</p>
          <p className="text-sm text-muted-foreground">Intenta recargar la página</p>
        </div>
      </div>
    );
  }

  if (!gifts || gifts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[400px] items-center justify-center"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Gift className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-serif text-xl text-muted-foreground">
            Aún no hay regalos en la lista
          </p>
        </div>
      </motion.div>
    );
  }

  const availableGifts = gifts.filter((g) => !g.gift_assignments);
  const assignedGifts = gifts.filter((g) => g.gift_assignments);

  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-32">
        {availableGifts.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-foreground">
              Disponibles ({availableGifts.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableGifts.map((gift) => (
                <GiftCard
                  key={gift.id}
                  gift={gift}
                  isSelected={selectedIds.has(gift.id)}
                  onToggleSelect={handleToggleSelect}
                />
              ))}
            </div>
          </section>
        )}

        {assignedGifts.length > 0 && (
          <section>
            <h2 className="mb-6 font-serif text-2xl font-semibold text-muted-foreground">
              Ya reservados ({assignedGifts.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignedGifts.map((gift) => (
                <GiftCard
                  key={gift.id}
                  gift={gift}
                  isSelected={false}
                  onToggleSelect={() => {}}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <SelectionBar
        selectedCount={selectedIds.size}
        selectedIds={Array.from(selectedIds)}
        onClearSelection={handleClearSelection}
      />
    </>
  );
}
