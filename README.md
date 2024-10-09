# GlissVinyls-Plus Web App

![Next.js](https://img.shields.io/badge/Next.js-13.0-blue.svg)
![Status](https://img.shields.io/badge/Status-In%20Development-yellowgreen.svg)

GlissVinyls-Plus es una aplicación web para la gestión de un ecommerce de vinilos. Está conectada a la API [GlissVinyls-Plus API](https://github.com/GorkyAnge/glissvinyls-plus-api) y permite a los usuarios visualizar productos, además de realizar operaciones CRUD si están autenticados.

## Tabla de Contenidos
- [Instalación](#instalación)
- [Uso](#uso)
- [Rutas](#rutas)
- [Protección de Rutas](#protección-de-rutas)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Autor](#autor)

## Instalación

Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/GorkyAnge/glissvinyls-plus-app.git
   ```
2. Navega al directorio del proyecto:
```bash
cd glissvinyls-plus-app
```
3. Instala las dependencias:
```bash
npm install
```
4. Inicia el servidor localmente:
```bash
npm run dev
```
La aplicación estará disponible en http://localhost:3000.


## Uso

En la vista principal (`/`), los usuarios pueden ver la lista de productos. Si un usuario desea realizar operaciones CRUD, debe autenticarse utilizando el botón de **Login**. Tras iniciar sesión, tendrá acceso a las rutas protegidas donde podrá crear, editar o eliminar productos.

## Rutas

| Ruta                | Descripción                                                        |
|---------------------|--------------------------------------------------------------------|
| `/`                 | Muestra la lista de productos sin operaciones CRUD.                |
| `/products`         | Muestra todos los productos con opciones CRUD (si está autenticado).|
| `/products/create`  | Permite crear un nuevo producto (requiere autenticación).           |
| `/products/edit`    | Muestra el listado de productos para seleccionar uno a editar.     |
| `/products/edit/{id}` | Permite editar un producto específico (requiere autenticación).    |

## Protección de Rutas

Las rutas que permiten realizar operaciones CRUD (`/products`, `/products/create`, `/products/edit`, `/products/edit/{id}`) están protegidas por un componente que verifica si el usuario está autenticado. Si no lo está, se restringe el acceso y no podrá ver las operaciones de creación, edición o eliminación de productos.

Al hacer **logout**, se eliminan los permisos de acceso y el usuario solo podrá visualizar los productos sin realizar operaciones CRUD.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar, sigue estos pasos:
1. Haz un fork del proyecto.
2. Crea una nueva rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz un commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Haz un push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un pull request.

## Licencia

Este proyecto está licenciado bajo la [MIT License](https://opensource.org/licenses/MIT).

## Autor

**Gorky Palacios Mutis**  
Estudiante de Ingeniería de Software  
[LinkedIn](https://linkedin.com/in/usuario)
