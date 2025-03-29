# Solución para la Pantalla en Blanco al Desplegar en Vercel

## Problema Identificado

La aplicación se queda en blanco al ser desplegada en Vercel. Esto ocurre porque las variables de entorno necesarias para la integración con Izipay no están correctamente configuradas en el panel de Vercel.

## Solución

### 1. Configurar Variables de Entorno en Vercel

El problema principal es que las variables de entorno privadas (`IZIPAY_SHOP_ID` y `IZIPAY_SECRET_KEY`) no están configuradas en Vercel, lo que causa que la API serverless de pagos falle y la aplicación se quede en blanco.

Sigue estos pasos:

1. Inicia sesión en tu cuenta de [Vercel](https://vercel.com)
2. Selecciona tu proyecto "EnglishPorject"
3. Ve a la pestaña "Settings" (Configuración)
4. En el menú lateral, selecciona "Environment Variables" (Variables de entorno)
5. Añade las siguientes variables:
   - `IZIPAY_SHOP_ID`: Tu ID de tienda de Izipay
   - `IZIPAY_SECRET_KEY`: Tu clave secreta de Izipay
   - `VITE_IZIPAY_PUBLIC_KEY`: 76277481:publickey_LA4CyBwP1Db5cnCtuipj9eRceTCIIgnF675BdV2EJmvlK (esta ya está en vercel.json, pero asegúrate de que sea la correcta)

6. Haz clic en "Save" (Guardar)
7. Vuelve a desplegar tu aplicación con `vercel --prod` o desde el panel de Vercel

### 2. Verificar Logs de Errores

Si después de configurar las variables de entorno el problema persiste:

1. En el panel de Vercel, ve a la pestaña "Deployments" (Despliegues)
2. Selecciona tu despliegue más reciente
3. Ve a la pestaña "Functions" (Funciones)
4. Busca la función `api/createPaymentToken.js`
5. Revisa los logs para identificar posibles errores

### 3. Comprobar Formato de Variables

Asegúrate de que las variables tengan el formato correcto:

- `IZIPAY_SHOP_ID`: Debe ser un número o identificador sin espacios adicionales
- `IZIPAY_SECRET_KEY`: Debe ser una cadena de texto sin espacios adicionales
- `VITE_IZIPAY_PUBLIC_KEY`: Debe tener el formato `SHOP_ID:publickey_XXXX`

### 4. Verificar Modo de Entorno

En el archivo `src/components/payment/IzipayPaymentPopup.tsx` y en `api/createPaymentToken.js`, el modo está configurado como `PRODUCTION`. Asegúrate de que tus credenciales de Izipay correspondan al entorno de producción y no al de pruebas.

## Contacto de Soporte

Si después de seguir estos pasos el problema persiste, contacta al soporte técnico con la siguiente información:

1. Capturas de pantalla de la configuración de variables de entorno en Vercel
2. Logs de error de la función serverless
3. URL del despliegue con el problema

---

**Nota**: Nunca compartas tus claves secretas (`IZIPAY_SECRET_KEY`) con nadie, incluyendo el soporte técnico. Si necesitas compartir información sobre tu configuración, oculta siempre las partes sensibles de tus credenciales.