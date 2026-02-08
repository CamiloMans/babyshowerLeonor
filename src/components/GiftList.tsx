import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2 } from "lucide-react";
import { useGifts } from "@/hooks/useGifts";
import { GiftCard } from "./GiftCard";
import { SelectionBar } from "./SelectionBar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function GiftList() {
  const { data: gifts, isLoading, error } = useGifts();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isOtherSelected, setIsOtherSelected] = useState(false);

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

  const handleToggleOther = () => {
    setIsOtherSelected((prev) => !prev);
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
      <div className="container mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6">
        {availableGifts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Disponibles ({availableGifts.length})
            </motion.h2>
            
            {sortedDestinatarios(Object.keys(groupedAvailable)).map((destinatario, destinatarioIndex) => (
              <motion.div
                key={destinatario}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + destinatarioIndex * 0.1 }}
                className="mb-10"
              >
                <h3 className="mb-6 text-xl font-semibold text-foreground">
                  🎀 Regalos para {destinatario}
                </h3>
                
                {Object.keys(groupedAvailable[destinatario]).sort().map((categoria, categoriaIndex) => {
                  const categoriaGifts = groupedAvailable[destinatario][categoria].sort((a, b) => 
                    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
                  );
                  return (
                    <motion.div
                      key={categoria}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + categoriaIndex * 0.05 }}
                      className="mb-8"
                    >
                      <h4 className="mb-4 text-base font-medium text-muted-foreground">
                        {categoria} ({categoriaGifts.length})
                      </h4>
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {categoriaGifts.map((gift, giftIndex) => (
                          <GiftCard
                            key={gift.id}
                            gift={gift}
                            isSelected={selectedIds.has(gift.id)}
                            onToggleSelect={handleToggleSelect}
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* Opción "Otro" */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Otras opciones
          </motion.h2>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "gift-card cursor-pointer",
                isOtherSelected && "ring-2 ring-primary ring-offset-2 shadow-lg"
              )}
              onClick={handleToggleOther}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isOtherSelected}
                  onCheckedChange={handleToggleOther}
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="text-sm font-semibold leading-tight text-foreground">
                    Otro regalo
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Especifica qué regalo quieres dar
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {assignedGifts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Ya reservados ({assignedGifts.length})
            </motion.h2>
            
            {sortedDestinatarios(Object.keys(groupedAssigned)).map((destinatario, destinatarioIndex) => (
              <motion.div
                key={destinatario}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + destinatarioIndex * 0.1 }}
                className="mb-10"
              >
                <h3 className="mb-6 text-xl font-semibold text-muted-foreground">
                  🎀 Regalos para {destinatario}
                </h3>
                
                {Object.keys(groupedAssigned[destinatario]).sort().map((categoria, categoriaIndex) => {
                  const categoriaGifts = groupedAssigned[destinatario][categoria].sort((a, b) => 
                    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
                  );
                  return (
                    <motion.div
                      key={categoria}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + categoriaIndex * 0.05 }}
                      className="mb-8"
                    >
                      <h4 className="mb-4 text-base font-medium text-muted-foreground">
                        {categoria} ({categoriaGifts.length})
                      </h4>
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {categoriaGifts.map((gift) => (
                          <GiftCard
                            key={gift.id}
                            gift={gift}
                            isSelected={false}
                            onToggleSelect={() => {}}
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </motion.section>
        )}
      </div>

      <SelectionBar
        selectedCount={selectedIds.size}
        selectedIds={Array.from(selectedIds)}
        isOtherSelected={isOtherSelected}
        onClearSelection={() => {
          setSelectedIds(new Set());
          setIsOtherSelected(false);
        }}
      />
    </>
  );
}
