import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useCancelGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftId: string) => {
      // Obtener el usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      // Eliminar la asignación solo si el usuario es el que la creó
      const { error } = await supabase
        .from("gift_assignments")
        .delete()
        .eq("gift_id", giftId)
        .eq("assigned_to_user_id", user.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      toast.success("Reserva cancelada exitosamente");
    },
    onError: (error: any) => {
      if (error.code === "PGRST116" || error.message?.includes("No rows")) {
        toast.error("No se pudo cancelar la reserva. Puede que ya haya sido cancelada.");
      } else {
        toast.error("Error al cancelar la reserva. Intenta de nuevo.");
      }
    },
  });
}

