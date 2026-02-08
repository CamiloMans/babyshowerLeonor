import { useState, useEffect } from "react";
import { Plus, ArrowLeft, Loader2, Gift, Baby, Gamepad2, Bath, Camera, Droplet, Heart } from "lucide-react";
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" strokeWidth={2} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-pattern relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="fixed inset-0 gradient-overlay pointer-events-none" />
      
      {/* Subtle background elements */}
      <div className="fixed -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
      
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-6 sm:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              title="Volver a la lista"
              className="rounded-xl hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Panel de Administración</h1>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Gestiona los regalos de la lista
              </p>
            </div>
          </div>

          <Button
            onClick={handleCreate}
            className="gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Nuevo Regalo</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6 relative z-10">
        {!gifts || gifts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[300px] items-center justify-center"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Gift className="h-6 w-6 text-muted-foreground" strokeWidth={2} />
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

              return sortedDestinatarios(Object.keys(groupedGifts)).map((destinatario, destinatarioIndex) => (
                <motion.div
                  key={destinatario}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: destinatarioIndex * 0.1 }}
                  className="mb-10"
                >
                  <h3 className="mb-6 text-xl font-semibold text-foreground flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" strokeWidth={2} />
                    Regalos para {destinatario}
                  </h3>
                  
                  {Object.keys(groupedGifts[destinatario]).sort().map((categoria, categoriaIndex) => {
                    // Ordenar por priority primero, luego alfabéticamente
                    const categoriaGifts = groupedGifts[destinatario][categoria].sort((a, b) => {
                      if (a.priority !== b.priority) {
                        return a.priority - b.priority;
                      }
                      return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
                    });
                    
                    const giftIds = categoriaGifts.map((g) => g.id);
                    
                    return (
                      <motion.div
                        key={categoria}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: categoriaIndex * 0.05 }}
                        className="mb-8"
                      >
                        <h4 className="mb-4 text-base font-medium text-muted-foreground flex items-center">
                          {getCategoryIcon(categoria)}
                          {removeEmoji(categoria)} ({categoriaGifts.length})
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
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
                      </motion.div>
                    );
                  })}
                </motion.div>
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
