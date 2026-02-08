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
      
      // Obtener el usuario actual para verificar sus reservas
      const { data: { user } } = await supabase.auth.getUser();
      
      return (data || []).map((gift) => {
        const assignments = Array.isArray(gift.gift_assignments) 
          ? gift.gift_assignments 
          : gift.gift_assignments 
            ? [gift.gift_assignments] 
            : [];
        
        // Encontrar la asignación del usuario actual si existe
        const myAssignment = user 
          ? assignments.find(a => a.assigned_to_user_id === user.id) || null
          : null;
        
        // max_quantity puede no existir si la migración no se ha ejecutado
        const maxQuantity = gift.max_quantity ?? 1;
        
        return {
        ...gift,
          gift_assignments: assignments.length > 0 ? (myAssignment || assignments[0]) : null,
          assignment_count: assignments.length,
          my_assignment: myAssignment,
          max_quantity: maxQuantity,
          all_assignments: assignments,
        };
      });
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
            max_quantity: 1,
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

      // Process assignments one by one to handle concurrency and quantity limits
      for (const giftId of giftIds) {
        try {
          // Verificar si el regalo existe y está activo
          // Intentar obtener max_quantity, pero si no existe la columna, usar valor por defecto
          const { data: gift, error: giftError } = await supabase
            .from("gifts")
            .select("is_active")
            .eq("id", giftId)
            .single();

          if (giftError) {
            console.error("Error al obtener regalo:", giftError);
            results.failed.push(giftId);
            continue;
          }

          if (!gift) {
            console.error("Regalo no encontrado:", giftId);
            results.failed.push(giftId);
            continue;
          }

          if (!gift.is_active) {
            console.error("Regalo no está activo:", giftId);
            results.failed.push(giftId);
            continue;
          }

          // Intentar obtener max_quantity si la columna existe
          let maxQuantity: number | null = 1; // Valor por defecto
          try {
            const { data: giftWithQuantity, error: quantityError } = await supabase
              .from("gifts")
              .select("max_quantity")
              .eq("id", giftId)
              .single();
            
            if (!quantityError && giftWithQuantity?.max_quantity !== undefined) {
              maxQuantity = giftWithQuantity.max_quantity; // Puede ser null (infinito)
            }
          } catch (e) {
            // Si la columna no existe, usar el valor por defecto de 1
            console.log("Columna max_quantity no existe aún, usando valor por defecto de 1");
          }
          
          // Si max_quantity es null, significa sin límite (infinito)
          if (maxQuantity === null) {
            // No hay límite, proceder con la asignación
          } else {
            // Usar una consulta más directa para contar
            const { data: assignments, error: assignmentsError } = await supabase
              .from("gift_assignments")
              .select("id")
              .eq("gift_id", giftId);

            if (assignmentsError) {
              console.error("Error al obtener asignaciones:", assignmentsError);
              results.failed.push(giftId);
              continue;
            }

            const currentCount = assignments?.length ?? 0;

            if (currentCount >= maxQuantity) {
              console.log(`Regalo ${giftId} alcanzó su límite: ${currentCount}/${maxQuantity}`);
              results.failed.push(giftId);
              continue;
            }
          }

          // Insertar la asignación
        const { error } = await supabase.from("gift_assignments").insert({
          gift_id: giftId,
          assigned_to_name: assignedToName.trim(),
          assigned_to_user_id: user?.id || null,
        });

        if (error) {
            console.error("Error al insertar asignación:", error);
          results.failed.push(giftId);
        } else {
          results.success.push(giftId);
          }
        } catch (error) {
          console.error("Error inesperado al asignar regalo:", error);
          results.failed.push(giftId);
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
          `${totalSuccess} regalo${totalSuccess > 1 ? "s" : ""} asignado${totalSuccess > 1 ? "s" : ""}. ${totalFailed} no se pudo${totalFailed > 1 ? "ron" : ""} asignar (límite alcanzado o error).`
        );
      } else {
        toast.error("No se pudieron asignar los regalos. Verifica que no hayan alcanzado su límite de cantidad o que estén disponibles.");
      }
    },
    onError: () => {
      toast.error("Error al asignar los regalos. Intenta de nuevo.");
    },
  });
}
