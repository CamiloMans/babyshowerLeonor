# Instrucciones de Configuración - Nuevo Supabase

Esta guía te ayudará a configurar completamente tu nuevo proyecto Supabase desde cero.

## Paso 1: Ejecutar las Migraciones

### Opción A: Desde Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com/)
2. Navega a **SQL Editor**
3. Abre el archivo `supabase/migrations/20260204000001_initial_schema.sql`
4. Copia todo el contenido
5. Pégalo en el SQL Editor
6. Haz clic en **Run** para ejecutar la migración

### Opción B: Usando Supabase CLI

Si tienes Supabase CLI instalado:

```bash
# Asegúrate de estar en el directorio del proyecto
cd gift-grabs

# Conecta tu proyecto local al remoto
supabase link --project-ref tu-project-ref

# Aplica las migraciones
supabase db push
```

## Paso 2: Verificar que las Tablas se Crearon

1. Ve a **Table Editor** en Supabase Dashboard
2. Deberías ver 3 tablas:
   - `gifts` - Lista de regalos
   - `gift_assignments` - Asignaciones de regalos
   - `admins` - Usuarios administradores

## Paso 3: Configurar Google OAuth (Si aún no lo has hecho)

1. Ve a **Authentication** > **Providers** en Supabase Dashboard
2. Habilita el proveedor **Google**
3. Ingresa tus credenciales de Google OAuth (Client ID y Client Secret)
4. Guarda los cambios

## Paso 4: Agregar tu Primer Administrador

Después de que te autentiques con Google por primera vez, necesitas agregarte como administrador.

### Opción A: Desde SQL Editor

1. Autentícate con Google en tu aplicación
2. Ve a **Authentication** > **Users** en Supabase Dashboard
3. Encuentra tu usuario y copia su `id` (UUID)
4. Ve a **SQL Editor** y ejecuta:

```sql
-- Reemplaza 'TU-UUID-AQUI' con el UUID de tu usuario
-- Reemplaza 'tu-email@gmail.com' con tu email de Google
INSERT INTO public.admins (id, email, full_name, is_active)
VALUES (
  'TU-UUID-AQUI',
  'tu-email@gmail.com',
  'Tu Nombre Completo',  -- Opcional
  true
);
```

### Opción B: Desde Table Editor

1. Ve a **Table Editor** > **admins**
2. Haz clic en **Insert** > **Insert row**
3. Completa los campos:
   - `id`: El UUID de tu usuario (de la tabla auth.users)
   - `email`: Tu email de Google
   - `full_name`: Tu nombre (opcional)
   - `is_active`: `true`
4. Guarda el registro

## Paso 5: Verificar que Todo Funciona

1. Cierra sesión si estás autenticado
2. Abre tu aplicación
3. Haz clic en el botón de administrador (icono de candado)
4. Selecciona "Continuar con Google"
5. Completa el flujo de autenticación
6. Si estás en la tabla `admins`, deberías poder acceder al panel de administración

## Solución de Problemas

### Error: "relation does not exist"
- Asegúrate de haber ejecutado la migración completa
- Verifica que todas las tablas se crearon correctamente

### Error: "permission denied"
- Verifica que las políticas RLS estén creadas correctamente
- Asegúrate de que el usuario esté en la tabla `admins` con `is_active = true`

### No puedo acceder al panel de administración
- Verifica que tu usuario esté en la tabla `admins`
- Verifica que `is_active = true` en tu registro
- Verifica que el `id` en `admins` coincida con el `id` en `auth.users`

### Las políticas RLS no funcionan
- Verifica que la función `is_admin()` esté creada correctamente
- Asegúrate de que el usuario esté autenticado (no anónimo)

## Estructura de la Base de Datos

### Tabla: `gifts`
- Almacena todos los regalos de la lista
- Campos: id, name, description, url, price, priority, is_active, created_at, updated_at

### Tabla: `gift_assignments`
- Almacena qué regalos han sido reservados y por quién
- Campos: id, gift_id, assigned_to_name, assigned_at, created_at, updated_at

### Tabla: `admins`
- Almacena los usuarios que tienen permisos de administrador
- Campos: id (FK a auth.users), email, full_name, is_active, created_at, updated_at

## Notas Importantes

- **Seguridad**: Solo los usuarios en la tabla `admins` con `is_active = true` pueden acceder al panel
- **RLS**: Todas las tablas tienen Row Level Security habilitado
- **Permisos**: Los usuarios anónimos pueden ver regalos activos y crear asignaciones, pero no pueden modificar nada

