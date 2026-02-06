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
    }: {
      giftIds: string[];
      assignedToName: string;
    }) => {
      // Obtener el usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      const results = {
        success: [] as string[],
        failed: [] as string[],
      };

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
      
      if (results.success.length > 0 && results.failed.length === 0) {
        toast.success(`¡${results.success.length} regalo(s) asignado(s) exitosamente!`);
      } else if (results.success.length > 0 && results.failed.length > 0) {
        toast.warning(
          `${results.success.length} regalo(s) asignado(s). ${results.failed.length} ya había(n) sido tomado(s).`
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
