import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Check, Gift as GiftIcon, X } from "lucide-react";
import { GiftWithAssignment } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCancelGift } from "@/hooks/useCancelGift";
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

interface GiftCardProps {
  gift: GiftWithAssignment;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export function GiftCard({ gift, isSelected, onToggleSelect }: GiftCardProps) {
  const isAssigned = !!gift.gift_assignments;
  const { user } = useAuth();
  const cancelGift = useCancelGift();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  // Verificar si el usuario actual es el que reservó este regalo
  const isMyReservation = isAssigned && 
    user && 
    gift.gift_assignments?.assigned_to_user_id === user.id;

  const handleCancel = async () => {
    await cancelGift.mutateAsync(gift.id);
    setCancelDialogOpen(false);
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
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "gift-card",
        isAssigned && "gift-card-assigned",
        isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg"
      )}
    >
      <div className="flex items-start gap-3">
        {!isAssigned && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(gift.id)}
            className="mt-0.5 h-4 w-4 shrink-0"
          />
        )}

        {isAssigned && (
          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-success/10">
            <Check className="h-3 w-3 text-success" />
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-tight text-foreground line-clamp-2">
              {gift.name}
            </h3>
            {gift.price && (
              <span className="price-tag shrink-0">{formatPrice(gift.price)}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {gift.url && (
              <a
                href={gift.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Ver</span>
              </a>
            )}

            {isAssigned && (
              <div className="flex items-center gap-2">
                <span className="assigned-badge">
                  <GiftIcon className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{gift.gift_assignments!.assigned_to_name}</span>
                </span>
                {isMyReservation && (
                  <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                        title="Cancelar mi reserva"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Cancelar reserva?</AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Estás seguro de que quieres cancelar tu reserva de <strong>"{gift.name}"</strong>? 
                          El regalo estará disponible nuevamente para que otros lo reserven.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Mantener reserva</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancel}
                          disabled={cancelGift.isPending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {cancelGift.isPending ? "Cancelando..." : "Cancelar reserva"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
