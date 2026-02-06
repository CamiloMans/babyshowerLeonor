import { useState, useEffect } from "react";
import { Plus, ArrowLeft, Loader2, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GiftFormModal } from "./GiftFormModal";
import { SortableGiftCard } from "./SortableGiftCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useAdminGifts,
  useCreateGift,
  useUpdateGift,
  useDeleteGift,
  useUnassignGift,
  useUpdateGiftPriorities,
} from "@/hooks/useAdminGifts";
import { GiftWithAssignment, Gift as GiftType } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function AdminPanel() {
  const navigate = useNavigate();
  const { data: gifts, isLoading } = useAdminGifts();
  const createGift = useCreateGift();
  const updateGift = useUpdateGift();
  const deleteGift = useDeleteGift();
  const unassignGift = useUnassignGift();
  const updatePriorities = useUpdateGiftPriorities();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftWithAssignment | null>(null);
  const [localGifts, setLocalGifts] = useState<GiftWithAssignment[]>([]);

  // Sincronizar gifts locales cuando cambian los datos
  useEffect(() => {
    if (gifts) {
      setLocalGifts(gifts);
    }
  }, [gifts]);

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleCreate = () => {
    setEditingGift(null);
    setIsFormOpen(true);
  };

  const handleEdit = (gift: GiftWithAssignment) => {
    setEditingGift(gift);
    setIsFormOpen(true);
  };

  const handleSubmit = async (
    data: Omit<GiftType, "id" | "created_at" | "updated_at">
  ) => {
    if (editingGift) {
      await updateGift.mutateAsync({ id: editingGift.id, ...data });
    } else {
      await createGift.mutateAsync(data);
    }
    setIsFormOpen(false);
    setEditingGift(null);
  };

  const handleDelete = async (id: string) => {
    await deleteGift.mutateAsync(id);
  };

  const handleUnassign = async (giftId: string) => {
    await unassignGift.mutateAsync(giftId);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Encontrar la categoría a la que pertenecen los regalos
    const activeGift = localGifts.find((g) => g.id === active.id);
    const overGift = localGifts.find((g) => g.id === over.id);

    if (!activeGift || !overGift) return;

    // Solo permitir reordenar dentro de la misma categoría
    if (
      activeGift.destinatario !== overGift.destinatario ||
      activeGift.categoria_regalos !== overGift.categoria_regalos
    ) {
      toast.error("Solo puedes reordenar regalos dentro de la misma categoría");
      return;
    }

    // Obtener todos los regalos de la misma categoría
    const categoriaGifts = localGifts.filter(
      (g) =>
        g.destinatario === activeGift.destinatario &&
        g.categoria_regalos === activeGift.categoria_regalos
    );

    const oldIndex = categoriaGifts.findIndex((g) => g.id === active.id);
    const newIndex = categoriaGifts.findIndex((g) => g.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Reordenar localmente
    const reordered = arrayMove(categoriaGifts, oldIndex, newIndex);

    // Actualizar prioridades basadas en el nuevo orden
    const updates = reordered.map((gift, index) => ({
      id: gift.id,
      priority: index,
    }));

    // Actualizar todos los regalos de la categoría con nuevas prioridades
    const allGifts = [...localGifts];
    reordered.forEach((gift, index) => {
      const giftIndex = allGifts.findIndex((g) => g.id === gift.id);
      if (giftIndex !== -1) {
        allGifts[giftIndex] = { ...allGifts[giftIndex], priority: index };
      }
    });

    setLocalGifts(allGifts);

    // Actualizar en la base de datos
    try {
      await updatePriorities.mutateAsync(updates);
      toast.success("Orden actualizado");
    } catch (error) {
      // Revertir cambios locales en caso de error
      setLocalGifts(gifts || []);
      toast.error("Error al actualizar el orden");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              title="Volver a la lista"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Panel de Administración</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Gestiona los regalos de la lista
              </p>
            </div>
          </div>

          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nuevo Regalo</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-4 pb-32 sm:px-6">
        {!gifts || gifts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[300px] items-center justify-center"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Gift className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mb-4 text-base font-medium text-muted-foreground">
                No hay regalos aún
              </p>
              <Button onClick={handleCreate}>Crear el primer regalo</Button>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* Agrupar regalos por destinatario y categoría */}
            {(() => {
              // Función para agrupar regalos
              const groupGiftsByCategory = (giftsList: GiftWithAssignment[]) => {
                const grouped: Record<string, Record<string, GiftWithAssignment[]>> = {};
                
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

              const giftsToUse = localGifts.length > 0 ? localGifts : (gifts || []);
              const groupedGifts = groupGiftsByCategory(giftsToUse);

              return sortedDestinatarios(Object.keys(groupedGifts)).map((destinatario) => (
                <div key={destinatario} className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    🎀 Regalos para {destinatario}
                  </h3>
                  
                  {Object.keys(groupedGifts[destinatario]).sort().map((categoria) => {
                    // Ordenar por priority primero, luego alfabéticamente
                    const categoriaGifts = groupedGifts[destinatario][categoria].sort((a, b) => {
                      if (a.priority !== b.priority) {
                        return a.priority - b.priority;
                      }
                      return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
                    });
                    
                    const giftIds = categoriaGifts.map((g) => g.id);
                    
                    return (
                      <div key={categoria} className="mb-6">
                        <h4 className="mb-3 text-base font-medium text-muted-foreground">
                          {categoria} ({categoriaGifts.length})
                        </h4>
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={giftIds}
                            strategy={rectSortingStrategy}
                          >
                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                              {categoriaGifts.map((gift) => (
                                <SortableGiftCard
                                  key={gift.id}
                                  gift={gift}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onUnassign={handleUnassign}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
        )}
      </main>

      <GiftFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        gift={editingGift}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isLoading={createGift.isPending || updateGift.isPending}
      />
    </div>
  );
}
