# Configuración de Autenticación con Google

Esta guía te ayudará a configurar la autenticación con Google OAuth en tu aplicación.

## Pasos de Configuración

### 1. Configurar Google OAuth en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** > **Credentials**
4. Haz clic en **Create Credentials** > **OAuth client ID**
5. Si es la primera vez, configura la pantalla de consentimiento OAuth:
   - Tipo de aplicación: **External**
   - Nombre de la aplicación: Tu nombre de aplicación
   - Email de soporte: Tu email
   - Agrega tu dominio autorizado
6. Crea las credenciales OAuth:
   - Tipo de aplicación: **Web application**
   - Nombre: "Gift Registry Web"
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **Authorized redirect URIs**:
     - `http://localhost:5173/auth/v1/callback` (desarrollo)
     - `https://tu-proyecto.supabase.co/auth/v1/callback` (producción - usa tu URL de Supabase)
     - `https://tu-dominio.com/auth/v1/callback` (producción)

7. Copia el **Client ID** y **Client Secret**

### 2. Configurar OAuth en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com/)
2. Navega a **Authentication** > **Providers**
3. Habilita el proveedor **Google**
4. Ingresa:
   - **Client ID**: El Client ID de Google Cloud Console
   - **Client Secret**: El Client Secret de Google Cloud Console
5. Guarda los cambios

### 3. Agregar Administradores

Una vez que un usuario se autentique con Google, necesitas agregarlo a la tabla `admins` para que tenga acceso de administrador.

#### Opción A: Desde el Dashboard de Supabase

1. Ve a **Table Editor** en Supabase Dashboard
2. Selecciona la tabla `admins`
3. Haz clic en **Insert** > **Insert row**
4. Ingresa:
   - `id`: El UUID del usuario (puedes encontrarlo en la tabla `auth.users`)
   - `email`: El email del usuario
   - `full_name`: Nombre completo (opcional)
   - `is_active`: `true`

#### Opción B: Desde SQL Editor

```sql
-- Reemplaza 'user-email@example.com' con el email del administrador
INSERT INTO public.admins (id, email, full_name, is_active)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  true
FROM auth.users
WHERE email = 'user-email@example.com';
```

### 4. Verificar Configuración

1. Inicia sesión en tu aplicación
2. Haz clic en el botón de administrador
3. Selecciona "Continuar con Google"
4. Completa el flujo de autenticación de Google
5. Si el usuario está en la tabla `admins`, tendrá acceso al panel

## Notas Importantes

- **Seguridad**: Solo los usuarios agregados a la tabla `admins` tendrán acceso al panel de administración
- **RLS**: Las políticas de Row Level Security están configuradas para proteger los datos
- **Redirect URI**: Asegúrate de que el redirect URI en Google Cloud Console coincida exactamente con la URL de tu proyecto Supabase

## Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verifica que el redirect URI en Google Cloud Console sea exactamente: `https://tu-proyecto.supabase.co/auth/v1/callback`

### Usuario autenticado pero sin acceso de admin
- Verifica que el usuario esté en la tabla `admins` con `is_active = true`
- Verifica que el `id` en la tabla `admins` coincida con el `id` en `auth.users`

### No aparece el botón de Google
- Verifica que el proveedor Google esté habilitado en Supabase Dashboard
- Verifica que las credenciales estén correctamente configuradas

