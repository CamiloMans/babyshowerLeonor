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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "gift-card",
        !gift.is_active && "opacity-50"
      )}
    >
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs font-semibold leading-tight line-clamp-2">{gift.name}</h3>
              {!gift.is_active && (
                <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <EyeOff className="h-2.5 w-2.5" />
                  Oculto
                </span>
              )}
            </div>
            {gift.price && (
              <span className="mt-0.5 inline-block text-[10px] font-semibold text-foreground">
                {formatPrice(gift.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(gift)}
              title="Editar"
              className="h-6 w-6"
            >
              <Edit2 className="h-3 w-3" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  title="Eliminar"
                  disabled={isAssigned}
                >
                  <Trash2 className="h-3 w-3" />
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
          <p className="text-[10px] leading-snug text-muted-foreground line-clamp-1">
            {gift.description}
          </p>
        )}

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
              <span className="assigned-badge">
                <span className="truncate max-w-[80px]">{gift.gift_assignments!.assigned_to_name}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1.5 text-[10px]"
                onClick={() => onUnassign(gift.id)}
              >
                <UserX className="mr-0.5 h-2.5 w-2.5" />
                Liberar
              </Button>
            </div>
          )}
        </div>

        <div className="text-[10px] text-muted-foreground">
          Prioridad: {gift.priority}
        </div>
      </div>
    </motion.div>
  );
}
