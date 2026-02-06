-- Insertar regalos para Leonor
-- Lista organizada por categorías con prioridades, destinatario y categoría

-- 👶 Básicos útiles - Leonor (Prioridad 1-9)
INSERT INTO public.gifts (name, description, destinatario, categoria_regalos, priority, is_active) VALUES
('Body o enteritos de algodón', 'Body o enteritos de algodón para el día a día', 'Leonor', '👶 Básicos útiles', 1, true),
('Patuquitos y gorrito suave', 'Patuquitos y gorrito suave para mantenerla abrigada', 'Leonor', '👶 Básicos útiles', 2, true),
('Sillita mecedora para bebé', 'Sillita mecedora para bebé 🪑💤 (ideal para dormirla o tenerla cómoda)', 'Leonor', '👶 Básicos útiles', 3, true),
('Manta o cobija personalizada', 'Manta o cobija personalizada para su confort', 'Leonor', '👶 Básicos útiles', 4, true),
('Baberos lindos', 'Baberos lindos para proteger su ropa', 'Leonor', '👶 Básicos útiles', 5, true),
('Pañales', 'Pañales (siempre útiles)', 'Leonor', '👶 Básicos útiles', 6, true),
('Toallas suaves con capucha', 'Toallas suaves con capucha para después del baño', 'Leonor', '👶 Básicos útiles', 7, true),
('Set de ropa para salir', 'Set de ropa para salir', 'Leonor', '👶 Básicos útiles', 8, true),
('Pijamas cómodos', 'Pijamas cómodos para dormir', 'Leonor', '👶 Básicos útiles', 9, true);

-- 🧸 Para jugar y estimular - Leonor (Prioridad 10-15)
INSERT INTO public.gifts (name, description, destinatario, categoria_regalos, priority, is_active) VALUES
('Móvil para la cuna', 'Móvil para la cuna para estimulación visual', 'Leonor', '🧸 Para jugar y estimular', 10, true),
('Sonajeros y mordedores', 'Sonajeros y mordedores para estimulación sensorial', 'Leonor', '🧸 Para jugar y estimular', 11, true),
('Juguetes blandos suaves', 'Juguetes blandos suaves para jugar', 'Leonor', '🧸 Para jugar y estimular', 12, true),
('Libritos de tela o sensoriales', 'Libritos de tela o sensoriales para estimulación temprana', 'Leonor', '🧸 Para jugar y estimular', 13, true),
('Alfombra de juego', 'Alfombra de juego para tiempo boca abajo', 'Leonor', '🧸 Para jugar y estimular', 14, true);

-- 🛁 Cuidado y baño - Leonor (Prioridad 16-19)
INSERT INTO public.gifts (name, description, destinatario, categoria_regalos, priority, is_active) VALUES
('Productos de baño delicados', 'Champú y jabón para bebé delicados', 'Leonor', '🛁 Cuidado y baño', 16, true),
('Set de toallas + esponja', 'Set de toallas + esponja para el baño', 'Leonor', '🛁 Cuidado y baño', 17, true),
('Cortauñas para bebé', 'Cortauñas para bebé', 'Leonor', '🛁 Cuidado y baño', 18, true),
('Termómetro', 'Termómetro para monitorear su temperatura', 'Leonor', '🛁 Cuidado y baño', 19, true);

-- 📸 Recuerdos y especiales - Leonor (Prioridad 20-23)
INSERT INTO public.gifts (name, description, destinatario, categoria_regalos, priority, is_active) VALUES
('Álbum o libro de huellas', 'Álbum o libro de huellas para guardar recuerdos', 'Leonor', '📸 Recuerdos y especiales', 20, true),
('Marco con foto del primer mes', 'Marco con foto del primer mes', 'Leonor', '📸 Recuerdos y especiales', 21, true),
('Joyita pequeña', 'Pulsera o cadenita segura para bebé', 'Leonor', '📸 Recuerdos y especiales', 22, true);

-- 👩‍👩‍👧 Regalos para los papás
-- 🍼 Apoyo en la crianza - Padres (Prioridad 24-26)
INSERT INTO public.gifts (name, description, destinatario, categoria_regalos, priority, is_active) VALUES
('Manta o cojín cómodo', 'Manta o cojín cómodo para los papás', 'Padres', '🍼 Apoyo en la crianza', 24, true),
('Bolsitas para guardar la leche', 'Bolsitas para guardar la leche', 'Padres', '🍼 Apoyo en la crianza', 25, true),
('Extractor de leche', 'Extractor de leche', 'Padres', '🍼 Apoyo en la crianza', 26, true);

-- 🧸 Para hacerles la vida más fácil - Padres (Prioridad 27-31)
INSERT INTO public.gifts (name, description, destinatario, categoria_regalos, priority, is_active) VALUES
('Canguro o portabebé ergonómico', 'Canguro o portabebé ergonómico', 'Padres', '🧸 Para hacerles la vida más fácil', 27, true),
('Bolso/mochila para bebé', 'Bolso/mochila para bebé', 'Padres', '🧸 Para hacerles la vida más fácil', 28, true),
('Organizadores para pañales', 'Organizadores para pañales', 'Padres', '🧸 Para hacerles la vida más fácil', 29, true),
('Termo o botella reutilizable', 'Termo o botella reutilizable', 'Padres', '🧸 Para hacerles la vida más fácil', 30, true),
('Agenda o planificador para las primeras semanas', 'Agenda o planificador para las primeras semanas', 'Padres', '🧸 Para hacerles la vida más fácil', 31, true);

