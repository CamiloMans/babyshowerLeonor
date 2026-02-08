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

      // Obtener información del regalo para verificar si es personalizado
      const { data: gift, error: giftError } = await supabase
        .from("gifts")
        .select("description")
        .eq("id", giftId)
        .single();

      if (giftError) {
        throw giftError;
      }

      // Verificar si es un regalo personalizado
      const isCustomGift = gift?.description?.includes("Regalo personalizado");

      // Eliminar la asignación del usuario actual
      const { error: deleteError } = await supabase
        .from("gift_assignments")
        .delete()
        .eq("gift_id", giftId)
        .eq("assigned_to_user_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Si es un regalo personalizado, eliminar el regalo completo
      // independientemente de cuántas asignaciones tenga
      if (isCustomGift) {
        const { error: deleteGiftError } = await supabase
          .from("gifts")
          .delete()
          .eq("id", giftId);

        if (deleteGiftError) {
          // Si falla la eliminación del regalo, no es crítico, solo loguear
          console.error("Error al eliminar regalo personalizado:", deleteGiftError);
        }
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

