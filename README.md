# Marvi en la granja — versión preparada para publicación

## Configuración de la rifa
- Premio: 2 parejas de pollos criollos gigantes colombianos.
- Precio por número: **$10.000 COP**.
- Números: 00 al 99.
- Pago: Nequi **3157238632**.
- Titular: **Edwin Rodríguez**.
- Contacto para enviar solicitudes: WhatsApp al número de Nequi.

## Publicar en Vercel
1. Descomprime este ZIP.
2. Crea un repositorio en GitHub y sube estos archivos a la raíz del repositorio (`index.html`, `styles.css`, `app.js`, `vercel.json`).
3. Entra a https://vercel.com/ e inicia sesión.
4. Selecciona **Add New → Project**, importa el repositorio y pulsa **Deploy**.
5. Vercel generará una dirección pública para compartir.

No necesita comando de compilación: es una página estática.

## IMPORTANTE antes de aceptar reservas reales
Esta versión es publicable como página de demostración, pero las reservas se guardan en el navegador de cada persona (`localStorage`). Eso significa que:
- Cada visitante puede ver los números como disponibles aunque otra persona los haya solicitado desde otro dispositivo.
- El panel administrativo no tiene contraseña y sus datos son locales.
- Los pagos no se verifican automáticamente.

**No uses esta versión estática como sistema definitivo de venta pública.** Para una rifa real con múltiples participantes, antes de promocionarla se debe conectar una base de datos compartida (por ejemplo Supabase), asegurar la reserva atómica de números y proteger el panel con autenticación. El organizador debe confirmar manualmente cada transferencia.

## Privacidad y normativa
Antes de publicar, define cómo se usarán los datos de contacto que ingresen los participantes y revisa los requisitos legales aplicables a la organización de rifas en Colombia.
