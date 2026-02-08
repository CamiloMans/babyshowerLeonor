# Solución: Redirección a localhost:8080 después del login

## Problema

Después de autenticarte con Google, Supabase te redirige a `localhost:8080` en lugar de tu URL de producción (`https://babyshowerleonor.onrender.com`).

## Causa

Esto sucede porque en **Supabase Dashboard** hay una configuración de **Site URL** que está puesta como `http://localhost:8080`. Esta URL se usa como fallback cuando no se puede determinar la URL correcta.

## Solución

### Paso 1: Verificar y actualizar Site URL en Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com/)
2. Selecciona tu proyecto: `frylgceemznlsqltjuno`
3. Ve a **Settings** (Configuración) en el menú lateral
4. Haz clic en **Authentication** (Autenticación)
5. Busca la sección **URL Configuration** o **Site URL**
6. En el campo **Site URL**, cambia:
   - ❌ De: `http://localhost:8080`
   - ✅ A: `https://babyshowerleonor.onrender.com`
7. En el campo **Redirect URLs**, asegúrate de tener:
   - `https://babyshowerleonor.onrender.com/**`
   - `https://babyshowerleonor.onrender.com`
8. Haz clic en **Save** (Guardar)

### Paso 2: Verificar configuración de Google OAuth

Asegúrate de que en **Google Cloud Console** tengas:

**Authorized JavaScript origins:**
- ✅ `https://babyshowerleonor.onrender.com`
- ✅ `https://frylgceemznlsqltjuno.supabase.co`

**Authorized redirect URIs:**
- ✅ `https://frylgceemznlsqltjuno.supabase.co/auth/v1/callback`

### Paso 3: Esperar y probar

1. Espera 2-5 minutos para que los cambios se propaguen
2. Cierra completamente el navegador o usa una ventana de incógnito
3. Intenta iniciar sesión nuevamente
4. Ahora debería redirigir a `https://babyshowerleonor.onrender.com` en lugar de `localhost:8080`

## Verificación

Después de hacer los cambios, cuando te autentiques con Google:

1. ✅ Google te redirige a Supabase
2. ✅ Supabase procesa la autenticación
3. ✅ Supabase te redirige a `https://babyshowerleonor.onrender.com` (no a localhost)
4. ✅ Los tokens se procesan automáticamente del hash (#)
5. ✅ La sesión se guarda y puedes usar la app

## Notas Importantes

- **Site URL** en Supabase es la URL base de tu aplicación en producción
- **Redirect URLs** son las URLs permitidas para redirecciones después de autenticación
- Los cambios pueden tardar unos minutos en aplicarse
- Siempre prueba en una ventana de incógnito para evitar problemas de caché

## Si el problema persiste

1. Verifica que guardaste los cambios en Supabase Dashboard
2. Verifica que la URL en **Site URL** sea exactamente `https://babyshowerleonor.onrender.com` (sin barra final)
3. Espera 10-15 minutos y prueba nuevamente
4. Revisa los logs de autenticación en Supabase Dashboard > **Logs** > **Auth Logs**

