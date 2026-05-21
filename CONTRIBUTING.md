# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a AutoTechPro! Este documento te guiará en cómo colaborar.

## 📋 Proceso General

1. **Fork** el repositorio
2. **Crea una rama** para tu feature: `git checkout -b feature/mi-feature`
3. **Haz commits** claros: `git commit -m "✨ Add nueva funcionalidad"`
4. **Push** tu rama: `git push origin feature/mi-feature`
5. **Abre un Pull Request** con descripción detallada

## 🎯 Áreas de Contribución

### Alta Prioridad
- [ ] Migración a base de datos persistente (MongoDB/PostgreSQL)
- [ ] Implementar autenticación JWT
- [ ] Integración con APIs de pago reales
- [ ] Validación de formularios avanzada

### Media Prioridad
- [ ] Mejorar UI/UX del portal del cliente
- [ ] Agregar temas dark/light
- [ ] Optimizar performance del frontend
- [ ] Tests unitarios y de integración

### Baja Prioridad
- [ ] Documentación mejorada
- [ ] Ejemplos de uso
- [ ] Traducciones adicionales

## 💻 Convención de Commits

Usa emojis para claridad:

```
✨ Feat: Nueva funcionalidad
🐛 Fix: Corrección de bug
📚 Docs: Cambios en documentación
🎨 Style: Estilos y formato
♻️ Refactor: Reorganización de código
⚡ Perf: Mejora de performance
🧪 Test: Agregar tests
```

Ejemplo:
```bash
git commit -m "✨ Feat: Implementar autenticación JWT"
git commit -m "🐛 Fix: Corregir validación de email en citas"
```

## 🧹 Estándares de Código

### JavaScript/React
- Usa `const`/`let`, no `var`
- Semicolons al final de líneas
- Indentación: 2 espacios
- Nombres descriptivos

```javascript
// ✅ Bien
const handleServiceSelection = (service) => {
  setSelectedService(service);
};

// ❌ Mal
const h = (s) => { ss = s; };
```

### Estructura de Archivos
```
client/src/
├── components/        # Componentes reutilizables
├── pages/            # Páginas principales
├── hooks/            # Custom hooks
├── utils/            # Funciones auxiliares
├── styles/           # CSS/Temas (si aplica)
└── App.jsx           # Componente raíz
```

## 🧪 Testing

Antes de hacer PR, verifica que:

1. ✅ No hay errores de consola
2. ✅ La app se carga sin problemas
3. ✅ Las funcionalidades básicas trabajan
4. ✅ Sin warnings de React

```bash
npm run dev
# Abre http://localhost:5173 y prueba manualmente
```

## 📝 Pull Request Template

```markdown
## Descripción
Breve descripción del cambio

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Cambios en documentación

## Cambios
- Cambio 1
- Cambio 2

## Testing
Describe cómo verificaste que funciona

## Screenshots (si aplica)
[Adjunta imágenes]

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He actualizado la documentación
- [ ] He probado en múltiples navegadores
```

## 🐛 Reportar Bugs

Usa el template:

```markdown
## Descripción del Bug
Descripción clara y concisa

## Pasos para Reproducir
1. Ve a...
2. Haz clic en...
3. Observa el error

## Comportamiento Esperado
Qué debería pasar

## Comportamiento Actual
Qué pasó

## Ambiente
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox
- Node version: v16.x
```

## 📚 Documentación

Si agregas una feature, actualiza:
- `README.md` (sección Características)
- Comentarios inline en el código
- Ejemplos de uso si es necesario

## 🚀 Deployment

El proyecto desplegará automáticamente en:
- **Staging**: Rama `develop` (próxima)
- **Production**: Rama `main` (requiere PR aprobado)

---

¡Gracias por contribuir! 🙌
