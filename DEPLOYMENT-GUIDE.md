# 🚀 Guía de Despliegue - GitHub Pages

## 📋 Resumen de Cambios

Se corrigieron todas las rutas para que funcionen correctamente en GitHub Pages con el path `/PWA-CalendarSelect/`.

### ✅ Archivos Modificados:

1. **sw.js** - Service Worker
   - ✅ BASE_PATH = '/PWA-CalendarSelect'
   - ✅ Todas las rutas del App Shell usan BASE_PATH
   - ✅ Condiciones de fetch actualizadas

2. **main.js** - Registro del Service Worker
   - ✅ Ruta: `/PWA-CalendarSelect/sw.js`
   - ✅ Scope: `/PWA-CalendarSelect/`

3. **index.html, calendario.html, formulario.html**
   - ✅ Manifest: `/PWA-CalendarSelect/manifest.json`
   - ✅ main.js: `/PWA-CalendarSelect/main.js`
   - ✅ Iconos: `/PWA-CalendarSelect/assets/...`
   - ✅ Enlaces de navegación: `/PWA-CalendarSelect/...`

4. **manifest.json**
   - ✅ start_url: `/PWA-CalendarSelect/`
   - ✅ Iconos: `/PWA-CalendarSelect/assets/...`

---

## 🔧 Pasos para Desplegar

### 1. Hacer Commit y Push
```bash
git add .
git commit -m "fix: Corregir todas las rutas para GitHub Pages deployment"
git push origin main
```

### 2. Esperar Despliegue
- GitHub Pages tarda 1-2 minutos en actualizar
- Puedes ver el estado en: Settings → Pages

### 3. Limpiar Caché del Navegador
Una vez desplegado, **DEBES** limpiar el caché:

1. Abre: `https://alanvortex.github.io/PWA-CalendarSelect/`
2. Presiona `F12` (DevTools)
3. Ve a **Application** → **Storage** → **Clear site data**
4. Marca todas las opciones
5. Click en "Clear site data"
6. Recarga con `Ctrl + Shift + R`

### 4. Verificar Funcionamiento

#### En la Consola (Console):
```
✅ Service Worker registrado exitosamente: https://alanvortex.github.io/PWA-CalendarSelect/
✅ [Service Worker] Instalando...
✅ [Service Worker] Cacheando App Shell
✅ [Service Worker] App Shell cacheado correctamente
✅ [Service Worker] Activando...
✅ [Service Worker] Activado correctamente
```

#### En Application → Service Workers:
- ✅ Estado: **Activated and is running**
- ✅ Scope: `https://alanvortex.github.io/PWA-CalendarSelect/`
- ✅ Source: `.../PWA-CalendarSelect/sw.js`

#### En Application → Cache Storage:
- ✅ **app-shell-v1** con 9 archivos:
  - `/PWA-CalendarSelect/`
  - `/PWA-CalendarSelect/index.html`
  - `/PWA-CalendarSelect/calendario.html`
  - `/PWA-CalendarSelect/formulario.html`
  - `/PWA-CalendarSelect/main.js`
  - `/PWA-CalendarSelect/manifest.json`
  - `/PWA-CalendarSelect/assets/192.png`
  - `/PWA-CalendarSelect/assets/512.png`
  - `https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4`

- ✅ **dynamic-cache-v1** se creará cuando cargues:
  - Las librerías de FullCalendar
  - Las librerías de Select2 y jQuery

---

## 🐛 Solución de Problemas

### ❌ Error: "Failed to register ServiceWorker"
**Solución:**
1. Verifica que el archivo `sw.js` exista
2. Limpia el caché del navegador
3. Asegúrate de estar en HTTPS (GitHub Pages lo hace automáticamente)

### ❌ Error 404 en manifest.json o sw.js
**Causa:** Las rutas no están actualizadas
**Solución:**
1. Verifica que todos los archivos HTML tengan `/PWA-CalendarSelect/` en las rutas
2. Revisa que el `manifest.json` tenga las rutas correctas
3. Haz un hard refresh (Ctrl+Shift+R)

### ❌ El caché no se guarda
**Causa:** El Service Worker no se registró correctamente
**Solución:**
1. Abre DevTools → Application → Service Workers
2. Click en "Unregister" si hay uno antiguo
3. Recarga la página
4. Verifica en Console que se registre correctamente

### ❌ Error: "A bad HTTP response code (404) was received when fetching the script"
**Causa:** El navegador tiene cacheada una versión anterior con rutas incorrectas
**Solución:**
1. Application → Service Workers → Unregister
2. Application → Storage → Clear site data
3. Cierra y abre el navegador
4. Visita la URL de nuevo

---

## 🧪 Testing Local

Antes de subir a GitHub, puedes probar localmente con:

### Opción 1: Live Server (VS Code)
```bash
# Instala la extensión "Live Server" en VS Code
# Click derecho en index.html → "Open with Live Server"
# Simula el comportamiento de un servidor web
```

### Opción 2: Python HTTP Server
```bash
# En la carpeta del proyecto:
python -m http.server 8000
# Abre: http://localhost:8000
```

### Opción 3: Node.js HTTP Server
```bash
npx http-server -p 8000
# Abre: http://localhost:8000
```

**NOTA:** En local, las rutas con `/PWA-CalendarSelect/` darán 404. Esto es NORMAL y ESPERADO. Solo funcionarán correctamente en GitHub Pages.

---

## 📝 Notas Importantes

1. **Nunca uses rutas relativas** (`./` o `../`) en una PWA con GitHub Pages
2. **Siempre usa rutas absolutas** con el BASE_PATH completo
3. **El BASE_PATH** debe coincidir con el nombre de tu repositorio
4. **Limpia el caché** cada vez que hagas cambios en el Service Worker
5. **Las PWAs requieren HTTPS** (GitHub Pages lo proporciona automáticamente)

---

## 🎯 Checklist Final

Antes de considerar el deployment exitoso:

- [ ] Commit y push realizados
- [ ] GitHub Pages actualizado (1-2 min)
- [ ] Caché del navegador limpiado
- [ ] Service Worker registrado correctamente
- [ ] `app-shell-v1` cache tiene 9 archivos
- [ ] Navegación entre páginas funciona
- [ ] Calendario carga correctamente
- [ ] Formulario con Select2 funciona
- [ ] App funciona OFFLINE (desconecta internet y prueba)

---

## 🔗 URLs Importantes

- **GitHub Pages:** https://alanvortex.github.io/PWA-CalendarSelect/
- **Repositorio:** https://github.com/AlanVortex/PWA-CalendarSelect
- **Settings:** https://github.com/AlanVortex/PWA-CalendarSelect/settings/pages

---

## 📞 Soporte

Si después de seguir todos los pasos aún tienes problemas:

1. Revisa los errores en la **Console** (F12)
2. Verifica el estado en **Application → Service Workers**
3. Comprueba el contenido de **Cache Storage**
4. Asegúrate de que GitHub Pages esté habilitado en Settings
5. Verifica que la rama sea `main` y la carpeta sea `/ (root)`

---

✨ **¡Listo! Tu PWA ahora debería funcionar perfectamente en GitHub Pages**
