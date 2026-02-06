# Cómo Hacerse Administrador

Después de autenticarte con Google, necesitas agregarte a la tabla `admins` para tener acceso al panel de administración.

## Paso 1: Autenticarte con Google

1. Ve a tu aplicación
2. Inicia sesión con Google
3. Completa el flujo de autenticación

## Paso 2: Obtener tu UUID de Usuario

Tienes dos opciones para encontrar tu UUID:

### Opción A: Desde Supabase Dashboard (Más fácil)

1. Ve a [Supabase Dashboard](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Users**
4. Busca tu email en la lista de usuarios
5. Haz clic en tu usuario
6. Copia el **UUID** (es un identificador largo que se ve así: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Opción B: Desde SQL Editor

1. Ve a **SQL Editor** en Supabase Dashboard
2. Ejecuta esta consulta (reemplaza con tu email):

```sql
SELECT id, email, raw_user_meta_data->>'full_name' as full_name
FROM auth.users
WHERE email = 'tu-email@gmail.com';
```

3. Copia el `id` (UUID) que aparece en los resultados

## Paso 3: Agregarte a la Tabla de Admins

Tienes dos formas de hacerlo:

### Método 1: Desde Table Editor (Más fácil)

1. Ve a **Table Editor** en Supabase Dashboard
2. Selecciona la tabla `admins`
3. Haz clic en **Insert** > **Insert row**
4. Completa los campos:
   - **id**: Pega el UUID que copiaste (el campo debe estar en rojo hasta que ingreses un UUID válido)
   - **email**: Tu email de Google (ej: `tu-email@gmail.com`)
   - **full_name**: Tu nombre completo (opcional, puedes dejarlo vacío)
   - **is_active**: Marca la casilla o escribe `true`
5. Haz clic en **Save** o presiona Enter

### Método 2: Desde SQL Editor (Más rápido)

1. Ve a **SQL Editor** en Supabase Dashboard
2. Ejecuta este SQL (reemplaza `'tu-email@gmail.com'` con tu email real):

```sql
INSERT INTO public.admins (id, email, full_name, is_active)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', '') as full_name,
  true
FROM auth.users
WHERE email = 'tu-email@gmail.com';
```

3. Haz clic en **Run** para ejecutar la consulta
4. Deberías ver un mensaje de éxito

## Paso 4: Verificar que Funcionó

1. Cierra sesión en tu aplicación (si estás logueado)
2. Vuelve a iniciar sesión con Google
3. Deberías ver el botón **"Panel Admin"** en el header
4. Haz clic en el botón para acceder al panel de administración

## Solución de Problemas

### No veo el botón "Panel Admin"

1. **Verifica que estés en la tabla `admins`**:
   ```sql
   SELECT * FROM public.admins WHERE email = 'tu-email@gmail.com';
   ```
   Deberías ver tu registro con `is_active = true`

2. **Verifica que el UUID coincida**:
   ```sql
   SELECT id FROM auth.users WHERE email = 'tu-email@gmail.com';
   ```
   Compara este UUID con el que está en la tabla `admins`

3. **Cierra sesión y vuelve a iniciar sesión** en tu aplicación

### Error: "duplicate key value violates unique constraint"

Esto significa que ya estás en la tabla `admins`. Verifica con:
```sql
SELECT * FROM public.admins WHERE email = 'tu-email@gmail.com';
```

Si `is_active` es `false`, actualízalo:
```sql
UPDATE public.admins 
SET is_active = true 
WHERE email = 'tu-email@gmail.com';
```

### Error: "violates foreign key constraint"

Esto significa que el UUID no existe en `auth.users`. Asegúrate de:
1. Haberte autenticado con Google primero
2. Usar el UUID correcto de la tabla `auth.users`

## Ejemplo Completo

Si tu email es `camilo@gmail.com`, ejecuta esto en SQL Editor:

```sql
-- Primero, verifica que existas en auth.users
SELECT id, email FROM auth.users WHERE email = 'camilo@gmail.com';

-- Luego, agrégate como admin (reemplaza el UUID con el que obtuviste arriba)
INSERT INTO public.admins (id, email, full_name, is_active)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'Camilo') as full_name,
  true
FROM auth.users
WHERE email = 'camilo@gmail.com';
```

## Notas Importantes

- ⚠️ Solo los usuarios en la tabla `admins` con `is_active = true` pueden acceder al panel
- ⚠️ El `id` debe ser exactamente el mismo UUID que está en `auth.users`
- ⚠️ Después de agregarte, cierra sesión y vuelve a iniciar sesión para que los cambios surtan efecto

