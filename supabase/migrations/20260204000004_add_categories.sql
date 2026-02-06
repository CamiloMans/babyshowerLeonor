-- Agregar campos de categorización a la tabla gifts
ALTER TABLE public.gifts 
ADD COLUMN IF NOT EXISTS destinatario TEXT,
ADD COLUMN IF NOT EXISTS categoria_regalos TEXT;

-- Crear índices para mejorar las consultas
CREATE INDEX IF NOT EXISTS idx_gifts_destinatario ON public.gifts(destinatario);
CREATE INDEX IF NOT EXISTS idx_gifts_categoria ON public.gifts(categoria_regalos);

-- Agregar comentarios para documentación
COMMENT ON COLUMN public.gifts.destinatario IS 'Destinatario del regalo: Leonor o Padres';
COMMENT ON COLUMN public.gifts.categoria_regalos IS 'Categoría del regalo con emoji: 👶 Básicos útiles, 🧸 Para jugar y estimular, etc.';

