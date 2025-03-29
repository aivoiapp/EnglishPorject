# Configuración de Izipay para Pagos

## Introducción

Este proyecto utiliza Izipay como pasarela de pagos para procesar transacciones con tarjetas de crédito/débito y Yape. Para que funcione correctamente, es necesario configurar las credenciales de Izipay en las variables de entorno del proyecto.

## Credenciales Necesarias

Se requieren tres credenciales principales:

1. **IZIPAY_SHOP_ID**: El identificador de tu tienda en Izipay
2. **IZIPAY_SECRET_KEY**: La clave secreta para firmar las peticiones a la API
3. **VITE_IZIPAY_PUBLIC_KEY**: La clave pública para el formulario de pago en el frontend

## Pasos para la Configuración

1. Accede a tu cuenta de Izipay (Back Office)
2. Ve a la sección de Configuración > Tienda > Claves
3. Copia las credenciales correspondientes
4. Configura las variables de entorno:

### Para desarrollo local

Añade solo la clave pública a tu archivo `.env` en la raíz del proyecto:

```
VITE_IZIPAY_PUBLIC_KEY=tu_public_key_aqui
```

### Para producción (Vercel)

Configura todas las credenciales en el panel de Vercel:

1. Ve a la configuración de tu proyecto en Vercel
2. Navega a la sección "Environment Variables"
3. Añade las siguientes variables:
   - `IZIPAY_SHOP_ID`: Tu ID de tienda
   - `IZIPAY_SECRET_KEY`: Tu clave secreta
   - `VITE_IZIPAY_PUBLIC_KEY`: Tu clave pública

> **⚠️ IMPORTANTE**: Nunca incluyas las claves privadas (`IZIPAY_SHOP_ID` y `IZIPAY_SECRET_KEY`) en el código del frontend. Estas deben manejarse exclusivamente en el backend (funciones serverless).

## Entornos de Izipay

Izipay proporciona dos entornos:

- **TEST**: Para pruebas durante el desarrollo
- **PRODUCTION**: Para transacciones reales

Asegúrate de usar las credenciales correctas según el entorno en el que estés trabajando.

## Solución de Problemas Comunes

### Error: "invalid login or private key" (INT_905)

Este error indica que las credenciales proporcionadas no son válidas. Verifica:

1. Que las variables IZIPAY_SHOP_ID e IZIPAY_SECRET_KEY estén correctamente configuradas en las variables de entorno de Vercel
2. Que no haya espacios adicionales o caracteres no válidos en las credenciales
3. Que estés usando las credenciales del entorno correcto (TEST vs PRODUCTION)
4. Que las credenciales no estén expiradas o revocadas

Si estás desplegando en Vercel, asegúrate de que las variables de entorno estén correctamente configuradas en el panel de Vercel y que el despliegue haya incluido estas variables.

### Error: "kr-public-key no definida"

Este error ocurre cuando la variable VITE_IZIPAY_PUBLIC_KEY no está configurada en el archivo `.env`. Asegúrate de añadirla correctamente.

## Tarjetas de Prueba

Para el entorno de TEST, puedes usar las siguientes tarjetas:

- **Visa**: 4970 1000 0000 0091, CVV: 123, Fecha: cualquier fecha futura
- **Mastercard**: 5970 1000 0000 0090, CVV: 123, Fecha: cualquier fecha futura

## Documentación Oficial

Para más información, consulta la [documentación oficial de Izipay](https://secure.micuentaweb.pe/doc/es-PE/).