import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle, Gift, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GiftCardProps {
  gift: GiftWithAssignment;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onCancel?: (giftId: string) => void;
}

export function GiftCard({ gift, isSelected, onToggleSelect, onCancel }: GiftCardProps) {
  const hasAssignments = !!gift.gift_assignments;
  const { user } = useAuth();
  const cancelGift = useCancelGift();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [assignmentsDialogOpen, setAssignmentsDialogOpen] = useState(false);
  
  const allAssignments = gift.all_assignments || [];
  
  // Calcular disponibilidad (max_quantity puede ser null para infinito)
  const assignedCount = gift.assignment_count || 0;
  const maxQuantity = gift.max_quantity; // Puede ser null (infinito)
  const isFullyAssigned = maxQuantity !== null && assignedCount >= maxQuantity;
  const isAvailable = maxQuantity === null || !isFullyAssigned;
  const remainingCount = maxQuantity === null ? null : maxQuantity - assignedCount;
  
  // Verificar si el usuario actual tiene una reserva de este regalo
  const isMyReservation = !!gift.my_assignment;

  const handleCancel = async () => {
    await cancelGift.mutateAsync(gift.id);
    setCancelDialogOpen(false);
    // Notificar al componente padre que se canceló este regalo
    if (onCancel) {
      onCancel(gift.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "gift-card",
        isFullyAssigned && "gift-card-assigned",
        isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg"
      )}
    >
      <div className="flex items-start gap-3">
        {isAvailable && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(gift.id)}
            className="mt-0.5 h-5 w-5 shrink-0"
          />
        )}

        {isFullyAssigned && (
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" strokeWidth={2.5} />
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold leading-tight text-foreground line-clamp-2">
                {gift.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {maxQuantity === null 
                  ? `${assignedCount} asignado${assignedCount !== 1 ? "s" : ""} (sin límite)`
                  : isAvailable 
                    ? `${remainingCount} disponible${remainingCount !== 1 ? "s" : ""} de ${maxQuantity}`
                    : `Completo (${assignedCount}/${maxQuantity})`
                }
              </p>
            </div>
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
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                <span>Ver</span>
              </a>
            )}

            {hasAssignments && (
              <div className="flex items-center gap-2 flex-wrap">
                <Dialog open={assignmentsDialogOpen} onOpenChange={setAssignmentsDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        {gift.name}
                      </DialogTitle>
                      <DialogDescription>
                        Personas que han reservado este regalo
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
                      {allAssignments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No hay asignaciones
                        </p>
                      ) : (
                        allAssignments.map((assignment, index) => (
                          <div
                            key={assignment.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {assignment.assigned_to_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(assignment.assigned_at).toLocaleDateString('es-CL', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            {user && assignment.assigned_to_user_id === user.id && (
                              <span className="text-xs text-primary font-medium">
                                Tú
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <button
                  onClick={() => setAssignmentsDialogOpen(true)}
                  className="assigned-badge cursor-pointer hover:bg-success/20 transition-colors"
                >
                  <Gift className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>
                    {maxQuantity === 1 
                      ? gift.gift_assignments!.assigned_to_name
                      : `${assignedCount} de ${maxQuantity} asignado${assignedCount !== 1 ? "s" : ""}`
                    }
                  </span>
                </button>
                {isMyReservation && (
                  <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                        title="Cancelar mi reserva"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
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
