-- Eliminar el regalo "Chocolates pa Gerardo"
-- Esto también eliminará automáticamente las asignaciones relacionadas debido a ON DELETE CASCADE
DELETE FROM public.gifts 
WHERE name = 'Chocolates pa Gerardo';

