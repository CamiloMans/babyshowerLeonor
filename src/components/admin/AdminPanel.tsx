import { useState } from "react";
import { Plus, ArrowLeft, Loader2, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GiftFormModal } from "./GiftFormModal";
import { AdminGiftCard } from "./AdminGiftCard";
import {
  useAdminGifts,
  useCreateGift,
  useUpdateGift,
  useDeleteGift,
  useUnassignGift,
} from "@/hooks/useAdminGifts";
import { GiftWithAssignment, Gift as GiftType } from "@/lib/types";
import { useNavigate } from "react-router-dom";

export function AdminPanel() {
  const navigate = useNavigate();
  const { data: gifts, isLoading } = useAdminGifts();
  const createGift = useCreateGift();
  const updateGift = useUpdateGift();
  const deleteGift = useDeleteGift();
  const unassignGift = useUnassignGift();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftWithAssignment | null>(null);

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

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
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
              <h1 className="font-serif text-2xl font-bold">Panel de Administración</h1>
              <p className="text-sm text-muted-foreground">
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

      <main className="container mx-auto px-4 py-8">
        {!gifts || gifts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[300px] items-center justify-center"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Gift className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mb-4 font-serif text-xl text-muted-foreground">
                No hay regalos aún
              </p>
              <Button onClick={handleCreate}>Crear el primer regalo</Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gifts.map((gift) => (
              <AdminGiftCard
                key={gift.id}
                gift={gift}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUnassign={handleUnassign}
              />
            ))}
          </div>
        )}
      </main>

      <GiftFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        gift={editingGift}
        onSubmit={handleSubmit}
        isLoading={createGift.isPending || updateGift.isPending}
      />
    </div>
  );
}
