import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  ExternalLink,
  UserX,
  Eye,
  EyeOff,
} from "lucide-react";
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
  onDelete,
  onUnassign,
}: AdminGiftCardProps) {
  const isAssigned = !!gift.gift_assignments;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "gift-card",
        !gift.is_active && "opacity-50"
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-semibold">{gift.name}</h3>
              {!gift.is_active && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  <EyeOff className="h-3 w-3" />
                  Oculto
                </span>
              )}
            </div>
            {gift.price && (
              <span className="text-sm font-medium text-gold-foreground">
                {formatPrice(gift.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(gift)}
              title="Editar"
            >
              <Edit2 className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  title="Eliminar"
                  disabled={isAssigned}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar regalo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El regalo "{gift.name}" será
                    eliminado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(gift.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {gift.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {gift.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {gift.url && (
            <a
              href={gift.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Ver enlace
            </a>
          )}

          {isAssigned && (
            <div className="flex items-center gap-2">
              <span className="assigned-badge text-xs">
                Reservado por {gift.gift_assignments!.assigned_to_name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onUnassign(gift.id)}
              >
                <UserX className="mr-1 h-3 w-3" />
                Liberar
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Prioridad: {gift.priority}
        </div>
      </div>
    </motion.div>
  );
}
