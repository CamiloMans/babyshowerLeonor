import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2, Baby, Gamepad2, Bath, Camera, Droplet, Heart } from "lucide-react";
import { useGifts } from "@/hooks/useGifts";
import { GiftCard } from "./GiftCard";
import { SelectionBar } from "./SelectionBar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Función para obtener el icono de una categoría
const getCategoryIcon = (categoria: string) => {
  if (categoria.includes("Básicos útiles")) return <Baby className="h-5 w-5 inline-block mr-2 text-primary" strokeWidth={2.5} />;
  if (categoria.includes("Para jugar y estimular")) return <Gamepad2 className="h-5 w-5 inline-block mr-2 text-primary" strokeWidth={2.5} />;
  if (categoria.includes("Cuidado y baño")) return <Bath className="h-5 w-5 inline-block mr-2 text-primary" strokeWidth={2.5} />;
  if (categoria.includes("Recuerdos y especiales")) return <Camera className="h-5 w-5 inline-block mr-2 text-primary" strokeWidth={2.5} />;
  if (categoria.includes("Apoyo en la crianza")) return <Droplet className="h-5 w-5 inline-block mr-2 text-primary" strokeWidth={2.5} />;
  if (categoria.includes("Para hacerles la vida más fácil")) return <Heart className="h-5 w-5 inline-block mr-2 text-primary" strokeWidth={2.5} />;
  return null;
};

// Función para remover emojis de las categorías
const removeEmoji = (text: string) => {
  return text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
};

interface GiftListProps {
  onSelectionChange?: (count: number, clearSelection: () => void) => void;
}

export function GiftList({ onSelectionChange }: GiftListProps) {
  const { data: gifts, isLoading, error } = useGifts();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [cancelledGiftIds, setCancelledGiftIds] = useState<Set<string>>(new Set());

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
    setIsOtherSelected(false);
  };

  // Notificar cambios en la selección al componente padre
  const totalSelected = selectedIds.size + (isOtherSelected ? 1 : 0);
  
  // Usar useEffect para notificar cambios
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(totalSelected, handleClearSelection);
    }
  }, [totalSelected, onSelectionChange]);

  const handleGiftCancel = (giftId: string) => {
    // Agregar el regalo cancelado a la lista para que no aparezca como disponible
    setCancelledGiftIds((prev) => new Set(prev).add(giftId));
    // También removerlo de la selección si estaba seleccionado
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(giftId);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" strokeWidth={2} />
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
            <Gift className="h-6 w-6 text-muted-foreground" strokeWidth={2} />
          </div>
          <p className="text-base font-medium text-muted-foreground">
            Aún no hay regalos en la lista
          </p>
        </div>
      </motion.div>
    );
  }

  // Agrupar todos los regalos por destinatario y categoría (sin separar disponibles/asignados)
  const groupGiftsByCategory = (giftsList: typeof gifts) => {
    const grouped: Record<string, Record<string, typeof gifts>> = {};
    
    giftsList.forEach((gift) => {
      const destinatario = gift.destinatario || "Sin categoría";
      const categoria = gift.categoria_regalos || "Otros Regalos";
      
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

  // Filtrar regalos cancelados por el usuario y regalos personalizados sin asignaciones
  const filteredGifts = gifts.filter((gift) => {
    // Excluir regalos cancelados por el usuario
    if (cancelledGiftIds.has(gift.id)) return false;
    
    // Excluir regalos personalizados sin asignaciones
    // Los regalos personalizados tienen description que contiene "Regalo personalizado"
    const isCustomGift = gift.description?.includes("Regalo personalizado");
    if (isCustomGift && (!gift.assignment_count || gift.assignment_count === 0)) {
      return false;
    }
    
    return true;
  });
  
  const groupedGifts = groupGiftsByCategory(filteredGifts);
  
  // Contar regalos disponibles para el título
  const availableCount = filteredGifts.filter((g) => {
    if (!g.gift_assignments) return true;
    const maxQuantity = g.max_quantity;
    if (maxQuantity === null) return true; // Sin límite, siempre disponible
    const assignedCount = g.assignment_count || 0;
    return assignedCount < maxQuantity;
  }).length;

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
        {gifts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Regalos ({filteredGifts.length} total, {availableCount} disponibles)
            </motion.h2>
            
            {/* Regalos por destinatario (Leonor, Padres, etc.) - Excluyendo "Otros Regalos" */}
            {sortedDestinatarios(Object.keys(groupedGifts))
              .filter(destinatario => {
                // Filtrar destinatarios que solo tienen "Sin categoría" o que no tienen categorías válidas
                const categorias = Object.keys(groupedGifts[destinatario]);
                const categoriasValidas = categorias.filter(cat => cat !== "Sin categoría" && cat !== "Otros Regalos");
                return categoriasValidas.length > 0;
              })
              .map((destinatario, destinatarioIndex) => (
              <motion.div
                key={destinatario}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + destinatarioIndex * 0.1 }}
                className="mb-10"
              >
                <h3 className="mb-6 text-xl font-semibold text-foreground flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" strokeWidth={2} />
                  Regalos para {destinatario}
                </h3>
                
                {Object.keys(groupedGifts[destinatario])
                  .filter(categoria => categoria !== "Sin categoría" && categoria !== "Otros Regalos")
                  .sort((a, b) => a.localeCompare(b))
                  .map((categoria, categoriaIndex) => {
                  // Ordenar por priority primero, luego alfabéticamente (igual que en AdminPanel)
                  const categoriaGifts = groupedGifts[destinatario][categoria].sort((a, b) => {
                    if (a.priority !== b.priority) {
                      return a.priority - b.priority;
                    }
                    return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
                  });
                  return (
                    <motion.div
                      key={categoria}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + categoriaIndex * 0.05 }}
                      className="mb-8"
                    >
                      <h4 className="mb-4 text-base font-medium text-muted-foreground flex items-center">
                        {getCategoryIcon(categoria)}
                        {removeEmoji(categoria)} ({categoriaGifts.length})
                      </h4>
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {categoriaGifts.map((gift) => {
                          // Verificar si el regalo está disponible para selección
                          const maxQuantity = gift.max_quantity;
                          const assignedCount = gift.assignment_count || 0;
                          // Si max_quantity es null, es infinito, siempre disponible
                          // Si tiene límite, verificar que no esté completo
                          const isAvailable = maxQuantity === null || assignedCount < maxQuantity;
                          
                          return (
                            <GiftCard
                              key={gift.id}
                              gift={gift}
                              isSelected={isAvailable && selectedIds.has(gift.id)}
                              onToggleSelect={isAvailable ? handleToggleSelect : () => {}}
                              onCancel={handleGiftCancel}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* Opción "Otro" - Después de los regalos por destinatario */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mb-4"
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              Si lo que quieres regalar no está en la lista, puedes indicarlo aquí.
            </p>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-6 text-xl font-semibold text-foreground flex items-center gap-2"
          >
            <Gift className="h-5 w-5 text-primary" strokeWidth={2} />
            Otras opciones
          </motion.h3>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            <div
              className={cn(
                "gift-card cursor-pointer",
                isOtherSelected && "ring-2 ring-primary ring-offset-2 shadow-lg bg-primary/10 border-primary/50"
              )}
              onClick={handleToggleOther}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="flex-shrink-0 pt-0.5 relative z-10"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isOtherSelected}
                    onCheckedChange={(checked) => {
                      setIsOtherSelected(!!checked);
                    }}
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="text-sm font-semibold leading-tight text-foreground">
                    Otro regalo
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Especifica qué regalo quieres dar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Sección "Otros Regalos" - Al final */}
        {gifts.length > 0 && sortedDestinatarios(Object.keys(groupedGifts))
          .filter(destinatario => {
            const categorias = Object.keys(groupedGifts[destinatario]);
            return categorias.includes("Otros Regalos");
          })
          .length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            {sortedDestinatarios(Object.keys(groupedGifts))
              .filter(destinatario => {
                const categorias = Object.keys(groupedGifts[destinatario]);
                return categorias.includes("Otros Regalos");
              })
              .map((destinatario) => {
                const otrosRegalos = groupedGifts[destinatario]["Otros Regalos"];
                if (!otrosRegalos || otrosRegalos.length === 0) return null;
                
                const categoriaGifts = otrosRegalos.sort((a, b) => {
                  if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                  }
                  return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
                });

                return (
                  <motion.div
                    key={`${destinatario}-otros-regalos`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mb-10"
                  >
                    <h3 className="mb-6 text-xl font-semibold text-foreground flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" strokeWidth={2} />
                      Otros Regalos
                    </h3>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="mb-8"
                    >
                      <h4 className="mb-4 text-base font-medium text-muted-foreground flex items-center">
                        <Gift className="h-4 w-4 inline-block mr-1.5" strokeWidth={2} />
                        Otros Regalos ({categoriaGifts.length})
                      </h4>
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {categoriaGifts.map((gift) => {
                          // Verificar si el regalo está disponible para selección
                          const maxQuantity = gift.max_quantity;
                          const assignedCount = gift.assignment_count || 0;
                          // Si max_quantity es null, es infinito, siempre disponible
                          // Si tiene límite, verificar que no esté completo
                          const isAvailable = maxQuantity === null || assignedCount < maxQuantity;
                          
                          return (
                            <GiftCard
                              key={gift.id}
                              gift={gift}
                              isSelected={isAvailable && selectedIds.has(gift.id)}
                              onToggleSelect={isAvailable ? handleToggleSelect : () => {}}
                              onCancel={handleGiftCancel}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
          </motion.section>
        )}

      </div>

      <SelectionBar
        selectedCount={selectedIds.size}
        selectedIds={Array.from(selectedIds)}
        isOtherSelected={isOtherSelected}
        onClearSelection={handleClearSelection}
      />
    </>
  );
}
