# Verificación de Configuración Google Cloud Console

## ✅ Lo que ya tienes configurado correctamente:

En tu Google Cloud Console veo que tienes:

**Authorized redirect URIs:**
- ✅ `https://frylgceemznlsqltjuno.supabase.co/auth/v1/callback` (URIs 1)

**Client ID:**
- `124942680212-8htu25co26jsoe6mdfftk7h4f3e9ir2h.apps.googleusercontent.com`

## ⚠️ Posibles problemas y soluciones:

### 1. Verificar que el Client ID en Supabase coincida

**Paso 1:** Ve a Supabase Dashboard
- Navega a **Authentication** > **Providers** > **Google**
- Verifica que el **Client ID** sea exactamente:
  ```
  124942680212-8htu25co26jsoe6mdfftk7h4f3e9ir2h
  124942680212-8htu25co26jsoe6mdfftk7h4f3e9ir2h.apps.googleusercontent.com
  ```
- Verifica que el **Client Secret** sea el correcto

**Paso 2:** Si no coincide, actualiza el Client ID en Supabase con el de Google Cloud Console

### 2. Verificar que no haya espacios o caracteres invisibles

En Google Cloud Console:
1. Haz clic en la URI `https://frylgceemznlsqltjuno.supabase.co/auth/v1/callback`
2. Selecciónala completamente (Ctrl+A)
3. Elimínala
4. Vuelve a escribirla manualmente o cópiala desde aquí:
   ```
   https://frylgceemznlsqltjuno.supabase.co/auth/v1/callback
   ```
5. Guarda los cambios

### 3. Verificar Authorized JavaScript origins

Asegúrate de que también tengas en **Authorized JavaScript origins**:
```
https://frylgceemznlsqltjuno.supabase.co
```

(Sin el `/auth/v1/callback` al final)

### 4. Esperar la propagación de cambios

Los cambios en Google Cloud Console pueden tardar:
- **Mínimo:** 2-5 minutos
- **Máximo:** 15-30 minutos

**Solución:**
1. Espera 10-15 minutos después de guardar los cambios
2. Cierra completamente el navegador
3. Abre una ventana de incógnito
4. Intenta iniciar sesión nuevamente

### 5. Limpiar caché y cookies

1. Abre una ventana de incógnito (Ctrl+Shift+N en Chrome)
2. O limpia la caché del navegador:
   - Chrome: Ctrl+Shift+Delete
   - Selecciona "Cookies y otros datos de sitios"
   - Haz clic en "Borrar datos"

### 6. Verificar que el proyecto de Google Cloud esté activo

1. En Google Cloud Console, verifica que tu proyecto esté seleccionado
2. Verifica que no haya mensajes de advertencia sobre el proyecto
3. Asegúrate de que las APIs necesarias estén habilitadas

### 7. Verificar la pantalla de consentimiento OAuth

1. Ve a **APIs & Services** > **OAuth consent screen**
2. Verifica que:
   - El estado sea "Testing" o "In production"
   - Tu email esté en "Test users" (si está en modo Testing)
   - El dominio `supabase.co` esté en "Authorized domains" (opcional pero recomendado)

## 🔍 Verificación paso a paso:

### Paso 1: Verificar en Google Cloud Console
- [ ] Client ID: `124942680212-8htu25co26jsoe6mdfftk7h4f3e9ir2h`
- [ ] Redirect URI: `https://frylgceemznlsqltjuno.supabase.co/auth/v1/callback` (exactamente, sin espacios)
- [ ] JavaScript origin: `https://frylgceemznlsqltjuno.supabase.co` (sin `/auth/v1/callback`)

### Paso 2: Verificar en Supabase Dashboard
- [ ] Provider Google está habilitado
- [ ] Client ID coincide exactamente con Google Cloud Console
- [ ] Client Secret es correcto

### Paso 3: Esperar y probar
- [ ] Esperaste al menos 10 minutos después de guardar
- [ ] Probaste en ventana de incógnito
- [ ] Limpiaste la caché del navegador

## 🚨 Si el problema persiste:

### Opción A: Crear nuevas credenciales OAuth

1. En Google Cloud Console, crea un **nuevo** OAuth 2.0 Client ID
2. Configura las URIs desde cero
3. Copia el nuevo Client ID y Client Secret
4. Actualiza estos valores en Supabase Dashboard
5. Espera 10-15 minutos y prueba nuevamente

### Opción B: Verificar logs de Supabase

1. Ve a Supabase Dashboard > **Logs** > **Auth Logs**
2. Revisa si hay errores adicionales que puedan dar más información

### Opción C: Contactar soporte

Si después de seguir todos estos pasos el problema persiste, puede ser un problema temporal de Google o Supabase. Espera unas horas y vuelve a intentar.

## 📝 Notas importantes:

- ⚠️ La URI debe ser **exactamente** igual (mayúsculas/minúsculas, sin espacios)
- ⚠️ Usa `https://` para producción, nunca `http://`
- ⚠️ Los cambios pueden tardar hasta 30 minutos en propagarse
- ⚠️ Siempre prueba en ventana de incógnito para evitar problemas de caché

