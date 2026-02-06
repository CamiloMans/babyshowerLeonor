import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, ExternalLink, Gift as GiftIcon, Check, X } from "lucide-react";
import { GiftWithAssignment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface AdminGiftCardProps {
  gift: GiftWithAssignment;
  onEdit: (gift: GiftWithAssignment) => void;
  onDelete: (id: string) => void;
  onUnassign: (giftId: string) => void;
}

export function AdminGiftCard({
  gift,
  onEdit,
  onUnassign,
}: AdminGiftCardProps) {
  const isAssigned = !!gift.gift_assignments;
  const [unassignDialogOpen, setUnassignDialogOpen] = useState(false);

  const handleUnassign = () => {
    onUnassign(gift.id);
    setUnassignDialogOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "gift-card",
        isAssigned && "gift-card-assigned"
      )}
    >
      <div className="flex items-start gap-2">
        {isAssigned && (
          <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm bg-success/10">
            <Check className="h-2.5 w-2.5 text-success" />
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="text-xs font-semibold leading-tight text-foreground line-clamp-2">
              {gift.name}
            </h3>
            <div className="flex items-center gap-0.5 shrink-0">
              {gift.price && (
                <span className="price-tag shrink-0 text-[10px]">{formatPrice(gift.price)}</span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(gift)}
                title="Editar"
                className="h-6 w-6"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {gift.url && (
              <a
                href={gift.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                Ver
              </a>
            )}

            {isAssigned && (
              <div className="flex items-center gap-1.5">
                <span className="assigned-badge text-[10px] px-1.5 py-0.5">
                  <GiftIcon className="h-2.5 w-2.5" />
                  <span className="truncate max-w-[100px]">{gift.gift_assignments!.assigned_to_name}</span>
                </span>
                <AlertDialog open={unassignDialogOpen} onOpenChange={setUnassignDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1.5 text-[10px] text-destructive hover:text-destructive"
                      title="Liberar asignación"
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Liberar asignación?</AlertDialogTitle>
                      <AlertDialogDescription>
                        El regalo <strong>"{gift.name}"</strong> será liberado de <strong>"{gift.gift_assignments!.assigned_to_name}"</strong> y estará disponible nuevamente para ser reservado.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleUnassign}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Liberar asignación
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
