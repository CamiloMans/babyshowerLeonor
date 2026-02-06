# Solución: Error redirect_uri_mismatch

## Problema

Estás recibiendo el error `redirect_uri_mismatch` porque la URI de redirección de Supabase no está registrada en Google Cloud Console.

## Solución Rápida

### Paso 1: Obtener tu URL de Supabase

Tu URL de Supabase es: `https://frylgceemznlsqltjuno.supabase.co`

La URI de redirección que debes agregar es:
```
https://frylgceemznlsqltjuno.supabase.co/auth/v1/callback
```

### Paso 2: Agregar la URI en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **APIs & Services** > **Credentials**
4. Haz clic en tu **OAuth 2.0 Client ID** (el que estás usando)
5. En la sección **Authorized redirect URIs**, haz clic en **+ ADD URI**
6. Agrega exactamente esta URI (copia y pega):
   ```
   https://frylgceemznlsqltjuno.supabase.co/auth/v1/callback
   ```
7. **IMPORTANTE**: Asegúrate de que:
   - No tenga espacios al inicio o final
   - Use `https://` (no `http://`)
   - Termine con `/auth/v1/callback`
   - Sea exactamente igual a la que muestra el error
8. Haz clic en **SAVE**

### Paso 3: Verificar Authorized JavaScript origins

También asegúrate de que en **Authorized JavaScript origins** tengas:
```
https://frylgceemznlsqltjuno.supabase.co
```

(Sin el `/auth/v1/callback` al final)

### Paso 4: Esperar unos minutos

Los cambios pueden tardar unos minutos en propagarse. Espera 2-5 minutos y vuelve a intentar.

## Verificación

Después de agregar la URI:

1. Cierra completamente tu navegador o usa una ventana de incógnito
2. Intenta iniciar sesión nuevamente
3. El error debería desaparecer

## Si el problema persiste

1. **Verifica que copiaste la URI exacta** del error (sin espacios)
2. **Verifica que guardaste los cambios** en Google Cloud Console
3. **Espera 5-10 minutos** para que los cambios se propaguen
4. **Limpia la caché del navegador** o usa modo incógnito
5. **Verifica que estás usando el Client ID correcto** en Supabase Dashboard

## URIs Comunes para Agregar

Si tienes múltiples entornos, agrega todas estas URIs:

### Producción (Supabase)
```
https://frylgceemznlsqltjuno.supabase.co/auth/v1/callback
```

### Desarrollo Local (opcional)
```
http://localhost:5173/auth/v1/callback
```

### Si tienes un dominio personalizado
```
https://tu-dominio.com/auth/v1/callback
```

## Notas Importantes

- ⚠️ La URI debe coincidir **exactamente** (mayúsculas/minúsculas, espacios, etc.)
- ⚠️ No agregues espacios antes o después
- ⚠️ Usa `https://` para producción, nunca `http://`
- ⚠️ Los cambios pueden tardar unos minutos en aplicarse

