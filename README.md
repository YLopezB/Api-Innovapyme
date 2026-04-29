# Api-Innovapyme

API desarrollada para que microempresarios gestionen inventarios, ventas e historial de operaciones.

---

# Tecnologías utilizadas

* Node.js
* Express
* Prisma ORM
* MySQL / MariaDB
* JWT (Autenticación)
* Swagger (Documentación)
* dotenv

---

# PASO A PASO

Sigue estos pasos en orden. No te saltes ninguno.

---

## 1 Instalar Node.js

Descarga e instala Node.js:

https://nodejs.org/

Verifica la instalación:

```bash
node -v
npm -v
```

---

## 2 Instalar MySQL

* MySQL: https://dev.mysql.com/downloads/

Verifica:

```bash
mysql -u root -p
```

---

## 3 Clonar el repositorio

```bash
git clone https://github.com/YLopezB/Api-Innovapyme.git
cd Api-Innovapyme
```

---

## 4 Instalar dependencias

```bash
npm install
```

---

## 5 Crear archivo `.env`

En la raíz del proyecto:

```env
PORT=3000

DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

DATABASE_USER=tu_usuario
DATABASE_PASSWORD=tu_password
DATABASE_NAME=innovapyme
DATABASE_HOST=localhost
DATABASE_PORT=3306

JWT_SECRET=un_secreto_muy_seguro
```

### IMPORTANTE

* Cambia `USER` y `PASSWORD` por los de tu MySQL
* Ejemplo:

  * USER = root
  * PASSWORD = root

---

## 6 Configurar Prisma

### En desarrollo (local)

```bash
npx prisma migrate dev
```

Crea tablas automáticamente y genera historial de migraciones

---

### En producción (servidor)

```bash
npx prisma migrate deploy
```

Ejecuta migraciones existentes y no modifica datos existentes

---

## 7 Ejecutar el servidor

### Modo desarrollo:

```bash
npm run dev
```

### Modo producción:

```bash
npm start
```

---

## 8 Probar la API

Abre en tu navegador:

```
http://localhost:3000
```

---

## 9 Ver documentación Swagger

```
http://localhost:3000/docs
```

Aquí puedes probar todos los endpoints directamente.

---

# Posibles errores

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


# 📄 Licencia

MIT

---

# 👨‍💻 Autores

Proyecto universitario - InnovaPyme

