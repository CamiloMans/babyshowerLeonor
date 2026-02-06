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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <Gift className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-base font-medium text-muted-foreground">
            Aún no hay regalos en la lista
          </p>
        </div>
      </motion.div>
    );
  }

  const availableGifts = gifts.filter((g) => !g.gift_assignments);
  const assignedGifts = gifts.filter((g) => g.gift_assignments);

  // Agrupar regalos disponibles por destinatario y categoría
  const groupGiftsByCategory = (giftsList: typeof availableGifts) => {
    const grouped: Record<string, Record<string, typeof availableGifts>> = {};
    
    giftsList.forEach((gift) => {
      const destinatario = gift.destinatario || "Sin categoría";
      const categoria = gift.categoria_regalos || "Sin categoría";
      
      if (!grouped[destinatario]) {
        grouped[destinatario] = {};
      }
      if (!grouped[destinatario][categoria]) {
        grouped[destinatario][categoria] = [];
      }
      grouped[destinatario][categoria].push(gift);
    });
    
    return grouped;
  };

  const groupedAvailable = groupGiftsByCategory(availableGifts);
  const groupedAssigned = groupGiftsByCategory(assignedGifts);

  // Ordenar destinatarios: Leonor primero, luego Padres
  const sortedDestinatarios = (destinatarios: string[]) => {
    return destinatarios.sort((a, b) => {
      if (a === "Leonor") return -1;
      if (b === "Leonor") return 1;
      if (a === "Padres") return -1;
      if (b === "Padres") return 1;
      return a.localeCompare(b);
    });
  };

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-4 pb-32 sm:px-6">
        {availableGifts.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Disponibles ({availableGifts.length})
            </h2>
            
            {sortedDestinatarios(Object.keys(groupedAvailable)).map((destinatario) => (
              <div key={destinatario} className="mb-8">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                  🎀 Regalos para {destinatario}
                </h3>
                
                {Object.keys(groupedAvailable[destinatario]).sort().map((categoria) => {
                  const categoriaGifts = groupedAvailable[destinatario][categoria].sort((a, b) => 
                    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
                  );
                  return (
                    <div key={categoria} className="mb-6">
                      <h4 className="mb-3 text-xs font-medium text-muted-foreground">
                        {categoria} ({categoriaGifts.length})
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {categoriaGifts.map((gift) => (
                          <GiftCard
                            key={gift.id}
                            gift={gift}
                            isSelected={selectedIds.has(gift.id)}
                            onToggleSelect={handleToggleSelect}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </section>
        )}

        {assignedGifts.length > 0 && (
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ya reservados ({assignedGifts.length})
            </h2>
            
            {sortedDestinatarios(Object.keys(groupedAssigned)).map((destinatario) => (
              <div key={destinatario} className="mb-8">
                <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
                  🎀 Regalos para {destinatario}
                </h3>
                
                {Object.keys(groupedAssigned[destinatario]).sort().map((categoria) => {
                  const categoriaGifts = groupedAssigned[destinatario][categoria].sort((a, b) => 
                    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
                  );
                  return (
                    <div key={categoria} className="mb-6">
                      <h4 className="mb-3 text-xs font-medium text-muted-foreground">
                        {categoria} ({categoriaGifts.length})
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {categoriaGifts.map((gift) => (
                          <GiftCard
                            key={gift.id}
                            gift={gift}
                            isSelected={false}
                            onToggleSelect={() => {}}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
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
