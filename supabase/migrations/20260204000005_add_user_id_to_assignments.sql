-- Agregar campo para vincular reservas con usuarios autenticados
ALTER TABLE public.gift_assignments 
ADD COLUMN IF NOT EXISTS assigned_to_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Crear índice para mejorar las consultas
CREATE INDEX IF NOT EXISTS idx_gift_assignments_user_id ON public.gift_assignments(assigned_to_user_id);

-- Actualizar política RLS para permitir que usuarios eliminen sus propias reservas
-- Primero eliminar políticas existentes que puedan estar en conflicto
DROP POLICY IF EXISTS "Users can delete own assignments" ON public.gift_assignments;
DROP POLICY IF EXISTS "Authenticated users can delete gift assignments" ON public.gift_assignments;

-- Crear nueva política que permite a usuarios eliminar sus propias reservas
-- y a usuarios autenticados (admins) eliminar cualquier reserva
CREATE POLICY "Users can delete own gift assignments"
ON public.gift_assignments
FOR DELETE
USING (
  assigned_to_user_id = auth.uid() OR
  auth.role() = 'authenticated' -- Para admins
);

-- Comentario para documentación
COMMENT ON COLUMN public.gift_assignments.assigned_to_user_id IS 'ID del usuario que reservó el regalo (opcional, para usuarios autenticados)';

