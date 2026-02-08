import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gift, GiftWithAssignment } from "@/lib/types";
import { toast } from "sonner";

export function useGifts() {
  return useQuery({
    queryKey: ["gifts"],
    queryFn: async (): Promise<GiftWithAssignment[]> => {
      const { data, error } = await supabase
        .from("gifts")
        .select(`
          *,
          gift_assignments (*)
        `)
        .eq("is_active", true)
        .order("priority", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      return (data || []).map((gift) => ({
        ...gift,
        gift_assignments: Array.isArray(gift.gift_assignments) 
          ? gift.gift_assignments[0] || null 
          : gift.gift_assignments,
      }));
    },
  });
}

export function useAssignGifts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      giftIds,
      assignedToName,
      otherGiftDescription,
    }: {
      giftIds: string[];
      assignedToName: string;
      otherGiftDescription?: string;
    }) => {
      // Obtener el usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      const results = {
        success: [] as string[],
        failed: [] as string[],
      };

      // Si hay un regalo personalizado "Otro", crear el regalo primero
      if (otherGiftDescription) {
        const { data: newGift, error: createError } = await supabase
          .from("gifts")
          .insert({
            name: otherGiftDescription,
            description: `Regalo personalizado reservado por ${assignedToName.trim()}`,
            is_active: true,
            priority: 0,
          })
          .select()
          .single();

        if (createError || !newGift) {
          toast.error("Error al crear el regalo personalizado");
          return results;
        }

        // Asignar el nuevo regalo
        const { error: assignError } = await supabase.from("gift_assignments").insert({
          gift_id: newGift.id,
          assigned_to_name: assignedToName.trim(),
          assigned_to_user_id: user?.id || null,
        });

        if (assignError) {
          results.failed.push(newGift.id);
        } else {
          results.success.push(newGift.id);
        }
      }

      // Process assignments one by one to handle concurrency
      for (const giftId of giftIds) {
        const { error } = await supabase.from("gift_assignments").insert({
          gift_id: giftId,
          assigned_to_name: assignedToName.trim(),
          assigned_to_user_id: user?.id || null,
        });

        if (error) {
          // Unique constraint violation means already assigned
          results.failed.push(giftId);
        } else {
          results.success.push(giftId);
        }
      }

      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      
      const totalSuccess = results.success.length;
      const totalFailed = results.failed.length;
      
      if (totalSuccess > 0 && totalFailed === 0) {
        toast.success(`¡${totalSuccess} regalo${totalSuccess > 1 ? "s" : ""} asignado${totalSuccess > 1 ? "s" : ""} exitosamente!`);
      } else if (totalSuccess > 0 && totalFailed > 0) {
        toast.warning(
          `${totalSuccess} regalo${totalSuccess > 1 ? "s" : ""} asignado${totalSuccess > 1 ? "s" : ""}. ${totalFailed} ya había${totalFailed > 1 ? "n" : ""} sido tomado${totalFailed > 1 ? "s" : ""}.`
        );
      } else {
        toast.error("Estos regalos ya fueron tomados por otra persona.");
      }
    },
    onError: () => {
      toast.error("Error al asignar los regalos. Intenta de nuevo.");
    },
  });
}
