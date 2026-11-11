# Wendy's Guide ♡
App web (PWA) sin dependencias ni servicios de pago. HTML + CSS + JavaScript.

## Probar en local
Abre la carpeta en VS Code y usa la extensión Live Server (o `python3 -m http.server`). Abre http://localhost:8000.

## Publicar gratis en GitHub Pages
1. Crea un repositorio nuevo en github.com y sube todo el contenido de esta carpeta (que `index.html` quede en la raíz).
2. En el repositorio: Settings → Pages → Source: "Deploy from a branch" → rama `main`, carpeta `/ (root)` → Save.
3. En 1–2 minutos la guía estará en `https://TU-USUARIO.github.io/NOMBRE-REPO/`.

## Añadir a la pantalla de inicio del iPhone
Abre el enlace en **Safari** → botón Compartir → "Añadir a pantalla de inicio" → Añadir. Se instala como "Wendy's Guide".

## Datos
Todo el contenido está en `js/data.js`. Solo se incluyen datos estables (teléfonos de emergencia y webs oficiales). Su dirección la escribe ella en la app y se guarda solo en su teléfono. Los datos que cambian (horarios, tarifas, promociones) se añadirán con fecha de verificación.
