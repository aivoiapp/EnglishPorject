# English Project

## Configuración de Pagos

Este proyecto utiliza múltiples métodos de pago, incluyendo Izipay en modo pop-up para procesar pagos con tarjeta.

### Configuración de Izipay

Para configurar Izipay, necesitas obtener tus credenciales y agregarlas al archivo `.env`:

```
VITE_IZIPAY_TOKEN=TU_TOKEN_SESSION
VITE_IZIPAY_KEY_RSA=TU_KEY_RSA
```

### Configuración de otros métodos de pago

Para el método de pago Visa existente, necesitas configurar:

```
VITE_PUBLIC_KEY=TU_PUBLIC_KEY
VITE_FORM_TOKEN=TU_FORM_TOKEN
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

## Construcción

Para construir el proyecto para producción:

```bash
npm run build
```

## Despliegue

Para desplegar el proyecto en GitHub Pages:

```bash
npm run deploy
```