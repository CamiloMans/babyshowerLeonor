import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gift, GiftWithAssignment } from "@/lib/types";
import { toast } from "sonner";

export function useAdminGifts() {
  return useQuery({
    queryKey: ["admin-gifts"],
    queryFn: async (): Promise<GiftWithAssignment[]> => {
      const { data, error } = await supabase
        .from("gifts")
        .select(`
          *,
          gift_assignments (*)
        `)
        .order("priority", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;

      return (data || []).map((gift) => {
        const assignments = Array.isArray(gift.gift_assignments) 
          ? gift.gift_assignments 
          : gift.gift_assignments 
            ? [gift.gift_assignments] 
            : [];
        
        return {
        ...gift,
          gift_assignments: assignments.length > 0 ? assignments[0] : null,
          assignment_count: assignments.length,
          all_assignments: assignments,
        };
      });
    },
  });
}

export function useCreateGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gift: Omit<Gift, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("gifts")
        .insert(gift)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gifts"] });
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      toast.success("Regalo creado exitosamente");
    },
    onError: () => {
      toast.error("Error al crear el regalo");
    },
  });
}

export function useUpdateGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...gift
    }: Partial<Gift> & { id: string }) => {
      const { data, error } = await supabase
        .from("gifts")
        .update(gift)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gifts"] });
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      toast.success("Regalo actualizado exitosamente");
    },
    onError: () => {
      toast.error("Error al actualizar el regalo");
    },
  });
}

export function useDeleteGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gifts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gifts"] });
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      toast.success("Regalo eliminado exitosamente");
    },
    onError: () => {
      toast.error("Error al eliminar el regalo");
    },
  });
}

export function useUnassignGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftId: string) => {
      const { error } = await supabase
        .from("gift_assignments")
        .delete()
        .eq("gift_id", giftId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gifts"] });
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      toast.success("Asignación eliminada");
    },
    onError: () => {
      toast.error("Error al eliminar la asignación");
    },
  });
}

export function useUpdateGiftPriorities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Array<{ id: string; priority: number }>) => {
      // Actualizar todas las prioridades en paralelo
      const promises = updates.map(({ id, priority }) =>
        supabase
          .from("gifts")
          .update({ priority })
          .eq("id", id)
      );

      const results = await Promise.all(promises);
      const errors = results.filter((r) => r.error).map((r) => r.error);

      if (errors.length > 0) {
        throw new Error("Error al actualizar las prioridades");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gifts"] });
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
    },
    onError: () => {
      toast.error("Error al actualizar el orden");
    },
  });
}
