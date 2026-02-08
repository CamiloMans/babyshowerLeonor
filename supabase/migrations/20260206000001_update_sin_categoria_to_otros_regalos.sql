-- Actualizar todos los regalos que tienen "Sin categoría" como categoría a "Otros Regalos"
UPDATE public.gifts 
SET categoria_regalos = 'Otros Regalos'
WHERE categoria_regalos IS NULL OR categoria_regalos = 'Sin categoría';

