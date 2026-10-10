# Page Blox — Catálogo público

Sitio público (catálogo + carrito + pedidos) de **Blox Fruits**. La administración se hace desde la PWA `PWA-Blox`, que alimenta el catálogo en tiempo real vía `localStorage` compartido + `BroadcastChannel`.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS 3**

## Arquitectura (2 proyectos)

```
BLOX/
├── page_blox/    ← ESTE PROYECTO — Catálogo público
│   ├── /              Home
│   ├── /productos     Catálogo + filtros + búsqueda
│   ├── /productos/[slug]  Detalle
│   ├── /carrito       Carrito + checkout
│   └── /mis-pedidos   Historial del usuario
│
└── PWA-Blox/     ← Panel administrativo (PWA instalable)
    └── /login, /dashboard, /pedidos, /productos
```

## Datos compartidos (sin backend)

Ambas apps viven en el mismo dominio y comparten `localStorage`:

| Key                  | Quién escribe           | Quién lee                |
| -------------------- | ----------------------- | ------------------------ |
| `blox-admin-products` | PWA admin (crear/eliminar) | Catálogo (render)        |
| `blox-admin-hidden`  | PWA admin               | Catálogo (ocultar items) |
| `blox-orders`        | Catálogo (crear pedido) | Ambas (admin y cliente)  |
| `blox-user`          | Catálogo (login cliente)| Catálogo                 |
| `blox-cart`          | Catálogo (carrito)      | Catálogo                 |

**Sync en vivo:** `src/lib/sync.ts` usa `BroadcastChannel("blox-data-sync")` para emitir cambios entre pestañas/ventanas al instante, y el evento `storage` para sincronizar entre las dos apps.

## Deploy recomendado

Para que ambas apps compartan `localStorage` deben estar en el **mismo dominio**:

- **Opción A (subdominios):** `https://pageblox.com` (catálogo) + `https://admin.pageblox.com` (PWA)
- **Opción B (subpath):** `https://blox.com/` (catálogo) + `https://blox.com/admin` (PWA) — desplegadas como dos apps Next.js independientes tras un reverse proxy.

Si se despliegan en dominios diferentes, los datos no se sincronizarán entre apps (cada una tendría su propio `localStorage`).

## Comandos

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run start
```

No afiliado oficialmente con Roblox Corporation.
