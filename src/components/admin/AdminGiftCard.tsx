import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, ExternalLink, Gift, CheckCircle, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [assignmentsDialogOpen, setAssignmentsDialogOpen] = useState(false);
  
  const allAssignments = gift.all_assignments || [];
  const assignedCount = gift.assignment_count || 0;
  const maxQuantity = gift.max_quantity ?? 1;

  const handleUnassign = () => {
    onUnassign(gift.id);
    setUnassignDialogOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "gift-card",
        isAssigned && "gift-card-assigned"
      )}
    >
      <div className="flex items-start gap-2">
        {isAssigned && (
          <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm bg-success/10">
            <CheckCircle className="h-3 w-3 text-success" strokeWidth={2.5} />
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="text-xs font-semibold leading-tight text-foreground line-clamp-2">
              {gift.name}
            </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(gift)}
                title="Editar"
              className="h-6 w-6 shrink-0"
              >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
              </Button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {gift.url && (
              <a
                href={gift.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-3 w-3" strokeWidth={2} />
                Ver
              </a>
            )}

            {isAssigned && (
              <div className="flex items-center gap-1.5">
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
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <button
                  onClick={() => setAssignmentsDialogOpen(true)}
                  className="assigned-badge cursor-pointer hover:bg-success/20 transition-colors text-[10px] px-1.5 py-0.5"
                >
                  <Gift className="h-3 w-3" strokeWidth={2} />
                  <span>
                    {maxQuantity === 1 
                      ? gift.gift_assignments!.assigned_to_name
                      : `${assignedCount} de ${maxQuantity} asignado${assignedCount !== 1 ? "s" : ""}`
                    }
                  </span>
                </button>
                <AlertDialog open={unassignDialogOpen} onOpenChange={setUnassignDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                      title="Liberar asignación"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
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
