# 1. Nombre del proyecto 

Api-Innovapyme

---
# 2. Descripción general

API REST desarrollada para que microempresarios gestionen inventarios, ventas e historial de operaciones. El sistema permite el control de productos, registro de ventas con descuento automático de stock, y seguimiento de todas las operaciones realizadas por los usuarios.

---

# 3. Tecnologías utilizadas

* Node.js - Entorno de ejecución JavaScript
* Express - Framework web para Node.js
* Prisma ORM - ORM para base de datos
* MySQL / MariaDB - Sistema de gestión de bases de datos relacional
* JWT (JSON Web Tokens) - Sistema de autenticación
* Swagger (swagger-jsdoc, swagger-ui-express) - Documentación de API
* dotenv - Gestión de variables de entorno
* bcryptjs - Encriptación de contraseñas
* cors - Middleware para habilitar CORS
* morgan - Middleware de logging HTTP
* Vitest - Framework de pruebas
* Supertest - Biblioteca para testing de HTTP endpoints

---

# 4. Arquitectura del sistema

El proyecto sigue una arquitectura en capas con separación de responsabilidades:

```bash
src/
├── app.js              # Configuración principal de Express
├── index.js            # Punto de entrada del servidor
├── config/             # Configuraciones (database, swagger, scripts)
├── controller/         # Lógica de negocio de cada endpoint
├── middlewares/        # Middlewares (autenticación, validación)
├── repositories/       # Acceso a datos (Prisma)
├── routes/             # Definición de rutas y documentación Swagger
└── tests/              # Suite de pruebas unitarias
```
## Patron de diseño

* Controllers: Manejan la lógica de negocio y validaciones
* Repositories: Abstraen el acceso a la base de datos con Prisma
* Middlewares: Interceptan requests para autenticación y validación
* Routes: Definen endpoints y documentación Swagger
---

# 5. Requisitos previos

* Node.js (v18 o superior)
* npm (v9 o superior)
* MySQL o MariaDB instalado y configurado
* Git (para clonar el repositorio)

---

# 6.Paso a Paso

Sigue estos pasos en orden. No te saltes ninguno.

---

## 1. Instalar Node.js

Descarga e instala Node.js:

https://nodejs.org/

Verifica la instalación:

```bash
node -v
npm -v
```

---

## 2. Instalar MySQL

* MySQL: https://dev.mysql.com/downloads/

Verifica:

```bash
mysql -u root -p
```

---

## 3. Clonar el repositorio

```bash
git clone https://github.com/YLopezB/Api-Innovapyme.git
cd Api-Innovapyme
```

---

## 4. Instalar dependencias

```bash
npm install
```

---

## 5. Crear archivo `.env`

En la raíz del proyecto:

```env
PORT=3000

DATABASE_USER=tu_usuario
DATABASE_PASSWORD=tu_password
DATABASE_NAME=innovapyme
DATABASE_HOST=localhost
DATABASE_PORT=3306

DATABASE_URL="mysql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"

JWT_SECRET=un_secreto_muy_seguro
```

### IMPORTANTE

* Cambia `USER` y `PASSWORD` por los de tu MySQL
* Ejemplo:

  * USER = root
  * PASSWORD = root

---

## 6. Configurar Prisma

### En desarrollo (local)

```bash
npx prisma migrate dev
npx prisma generate
```

Crea tablas automáticamente y genera historial de migraciones

---

### En producción (servidor)

```bash
npx prisma migrate deploy
```

Ejecuta migraciones existentes y no modifica datos existentes

---

## 7. Ejecutar el servidor

### Modo desarrollo:

```bash
npm run seed
```

>**Credenciales de administrador inicial:**  
>Usuario: admin@example.com  
>Contraseña: admin123

```bash
npm run dev
```

### Modo producción:

```bash
npm run seed
```

```bash
npm start
```

---

## 8. Ejecución de pruebas

Ejecutar tdas las pruebas:
```bash
npm run test
```
Ejecutar pruebas con cobertura y reporteria:
```bash
npm run test:coverage
```
---

## 9. Probar la API

Abre en tu navegador:

```
http://localhost:3000
```

---

# 7. Documentación de endpoints

La API cuenta con los siguientes módulos principales:

### Autenticación (/api/auth)
* `POST /api/auth/register` - Registro de usuarios
* `POST /api/auth/login` - Inicio de sesión
* `GET /api/auth/profile` - Obtener perfil del usuario
* `PUT /api/auth/profile` - Actualización de perfil
### Usuarios (/api/usuarios)
* `GET /api/usuarios` - Listar usuarios (paginado)
* `PUT /api/usuarios/:id/rol` - Cambiar rol de usuario
* `DELETE /api/usuarios/:id/desactivar` - Desactivar usuario
* `PATCH /api/usuarios/:id/reactivar` - Reactivar usuario
### Inventario (/api/inventario)
* `GET /api/inventario` - Listar productos (paginado)
* `GET /api/inventario/:id` - Obtener producto por ID
* `POST /api/inventario` - Crear producto
* `PUT /api/inventario/:id` - Actualizar producto
* `DELETE /api/inventario/:id` - Eliminar producto
* `GET /api/inventario/alertas` - Productos en alerta por bajo stock
### Ventas (/api/ventas)
* `GET /api/ventas` - Listar ventas (paginado)
* `GET /api/ventas/:id` - Obtener venta por ID
* `POST /api/ventas` - Registrar venta (descuenta stock automáticamente)
#### Autenticación: Todos los endpoints requieren token JWT en el header Authorization: Bearer <token>, excepto los endpoints de registro y login.

---

# 8. Enlace a local
### Swagger
```
http://localhost:3000/docs
```
Aquí puedes probar todos los endpoints directamente.

---

# 9. Enlace producción
### Swagger
```
https://api-innovapyme-production.up.railway.app/docs
```
Aquí puedes probar todos los endpoints directamente.

---

# 10. Posibles errores

### Error de conexión a la base de datos

* Verifica usuario, contraseña y puerto
* Asegúrate de que MySQL esté encendido

---

### Prisma no funciona

Ejecuta:

```bash
npx prisma generate
```

---

### Puerto en uso

Cambia en `.env`:

```env
PORT=3001
```

Utiliza otro puerto de tu preferencia

---

# 11. Integrantes del equipo

* Yeison Andres Lopez Burbano - https://github.com/YLopezB
* Yeison Berbesi Chapeta - https://github.com/yeison495
* Chris Maiguel Rodriguez - https://github.com/Chris-Maiguel

---

# Licencia

* MIT
* Repositorio: https://github.com/YLopezB/Api-Innovapyme
---