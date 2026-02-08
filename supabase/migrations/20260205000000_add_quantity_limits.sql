-- Agregar campo max_quantity a la tabla gifts
-- Por defecto 1, número = máximo de veces que se puede regalar
ALTER TABLE public.gifts 
ADD COLUMN IF NOT EXISTS max_quantity INTEGER DEFAULT 1;

-- Actualizar regalos existentes que tengan NULL a 1
UPDATE public.gifts 
SET max_quantity = 1 
WHERE max_quantity IS NULL;

-- Eliminar el constraint UNIQUE de gift_id para permitir múltiples asignaciones
ALTER TABLE public.gift_assignments 
DROP CONSTRAINT IF EXISTS unique_gift_assignment;

-- Crear índice para mejorar las consultas de conteo
CREATE INDEX IF NOT EXISTS idx_gift_assignments_gift_id_count ON public.gift_assignments(gift_id);

-- Comentario para documentación
COMMENT ON COLUMN public.gifts.max_quantity IS 'Máximo número de veces que se puede regalar este regalo. Por defecto: 1';

