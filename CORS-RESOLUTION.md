# 🚨 CORS Issue Resolution Guide

## Problema Identificado
**Error:** `OPTIONS 404 Not Found` en `http://localhost/xerpia/public/login`

**Causa:** Tu backend no está configurado para manejar peticiones CORS (Cross-Origin Resource Sharing).

## 🔧 Soluciones Disponibles

### Solución 1: Configurar CORS en el Backend (RECOMENDADO)

Tu backend necesita agregar los siguientes headers HTTP:

```
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Accept
Access-Control-Max-Age: 86400
```

#### Si usas PHP:
```php
<?php
// Agregar al inicio de tu archivo login.php
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar petición OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Tu código de login aquí...
?>
```

#### Si usas Laravel:
```php
// En app/Http/Middleware/Cors.php
public function handle($request, Closure $next)
{
    return $next($request)
        ->header('Access-Control-Allow-Origin', 'http://localhost:4200')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
```

### Solución 2: Usar Proxy de Angular (TEMPORAL)

1. **Ya está configurado** el archivo `proxy.conf.json`
2. **Ya está actualizado** el `angular.json`

Para usar el proxy:

1. **Cambiar environment.ts** temporalmente:
```typescript
export const environment: Environment = {
  apiUrl: '/api', // En lugar de 'http://localhost/xerpia/public'
  // ... resto de configuración
};
```

2. **Iniciar Angular con proxy:**
```bash
ng serve
```

3. **El frontend llamará a:** `/api/login` que será redirigido a `http://localhost/xerpia/public/login`

### Solución 3: Deshabilitar CORS en el navegador (SOLO DESARROLLO)

```bash
# Chrome
chrome.exe --user-data-dir=/tmp/foo --disable-web-security

# Firefox: about:config -> security.fileuri.strict_origin_policy = false
```

## 🧪 Herramientas de Diagnóstico

1. **CORS Diagnostic Tool:** Abre el archivo `cors-diagnostic.html` en el navegador
2. **Debug Login Component:** Ve a `/debug-login` en tu app Angular
3. **Browser Network Tab:** Verifica las peticiones OPTIONS y POST

## ✅ Pasos Recomendados

1. **Primero:** Configura CORS en tu backend (Solución 1)
2. **Si no puedes:** Usa el proxy de Angular (Solución 2)
3. **Para testing:** Usa las herramientas de diagnóstico

## 🔍 Verificación

Una vez configurado CORS, deberías ver:
- ✅ Petición OPTIONS retorna 200 OK
- ✅ Headers CORS presentes en la respuesta
- ✅ Petición POST de login funciona correctamente
- ✅ Token JWT recibido y sesión establecida

## 📞 Soporte

Si el problema persiste, verifica:
1. ¿El backend está ejecutándose en `localhost`?
2. ¿El endpoint `/xerpia/public/login` existe?
3. ¿El servidor web (Apache/Nginx) permite peticiones OPTIONS?
