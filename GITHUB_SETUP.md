# 📤 Instrucciones para Subir a GitHub

## ✅ Estado Actual

Tu repositorio local está **100% configurado** y listo para subir:

```
✓ .gitignore - Excluye node_modules, dist, .env, etc.
✓ README.md - Documentación completa
✓ LICENSE - MIT License
✓ CONTRIBUTING.md - Guía para colaboradores
✓ Primer commit realizado
✓ 14 archivos + todo el código
```

---

## 🔗 PASOS PARA SUBIR A GITHUB

### Paso 1: Crear Repositorio en GitHub

1. **Ve a** https://github.com/new
2. **Rellena los datos:**
   - Repository name: `autotechpro`
   - Description: `Plataforma e-business para taller mecánico - Transformación digital`
   - Public/Private: Tu preferencia
   - ❌ NO marques "Initialize this repository with" (ya tienes commits locales)
3. **Click en "Create repository"**

### Paso 2: Conectar tu Repositorio Local

Copia-pega en PowerShell (reemplazando `TU_USUARIO`):

```powershell
cd c:\Users\guebr\autotechpro

# Cambiar rama a "main" (estándar de GitHub)
git branch -M main

# Agregar origen remoto
git remote add origin https://github.com/TU_USUARIO/autotechpro.git

# Subir todo a GitHub
git push -u origin main
```

**Ejemplo real:**
```powershell
git remote add origin https://github.com/guebrieltmd/autotechpro.git
git push -u origin main
```

### Paso 3: Ingresar Credenciales

Si GitHub te pide credenciales:

**Opción A: Personal Access Token (Recomendado)**
1. Ve a https://github.com/settings/tokens
2. Click "Generate new token"
3. Selecciona scopes: `repo`
4. Copia el token
5. En la terminal, usa como "password"

**Opción B: SSH (Avanzado)**
```powershell
# Generar clave SSH
ssh-keygen -t ed25519 -C "tu@email.com"

# Agregar a ssh-agent
ssh-add ~\.ssh\id_ed25519

# Copiar clave pública y agregarla en GitHub Settings
```

### Paso 4: Verificar

```powershell
# Ver el remoto
git remote -v

# Debería mostrar:
# origin  https://github.com/TU_USUARIO/autotechpro.git (fetch)
# origin  https://github.com/TU_USUARIO/autotechpro.git (push)
```

---

## ✨ ¡Listo!

Una vez completado, tu repositorio estará en:
```
https://github.com/TU_USUARIO/autotechpro
```

Verás:
- ✅ 14 archivos
- ✅ README con instrucciones
- ✅ .gitignore funcionando
- ✅ Histórico de commits

---

## 📊 Próximos Pasos (Recomendados)

### 1. Agregar Badges en README

```markdown
![GitHub](https://img.shields.io/badge/github-autotechpro-blue?logo=github)
![License](https://img.shields.io/badge/license-MIT-green)
```

### 2. Crear Rama de Desarrollo

```powershell
git checkout -b develop
git push -u origin develop
```

### 3. Configurar Protección de Ramas

En GitHub (Settings → Branches):
- Requiere PR reviews antes de merge
- Requiere pasos de CI/CD
- Requiere rama actualizada antes de merge

### 4. Agregar Issues y Projects

GitHub > Issues > New Issue

Ej: "Feature: Integrar autenticación JWT"

---

## 🆘 Problemas Comunes

### Error: "Repository not empty"
**Solución:** En GitHub, no marques "Initialize with README"

### Error: "Authentication failed"
**Solución:** Usa Personal Access Token, no contraseña de GitHub

### Error: "fatal: 'origin' does not appear to be a git repository"
**Solución:**
```powershell
git remote add origin https://github.com/TU_USUARIO/autotechpro.git
```

### Quiero cambiar el nombre del repositorio después
**Solución:** En GitHub Settings → Rename, luego:
```powershell
git remote set-url origin https://github.com/TU_USUARIO/nuevo-nombre.git
```

---

## 🎯 Checklist Final

- [ ] Repositorio creado en GitHub
- [ ] Remote agregado localmente
- [ ] Push exitoso a main
- [ ] Visible en github.com/tu-usuario/autotechpro
- [ ] README visible en el perfil del repo
- [ ] .gitignore funcionando (sin node_modules)
- [ ] Colaboradores agregados (si aplica)

---

**¡Tu proyecto ahora está en control de versiones y listo para colaboración en equipo!** 🎉
