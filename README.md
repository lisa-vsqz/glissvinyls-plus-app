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

---

## Rutas

| **Ruta**                       | **Descripción**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/`                            | Muestra la lista de productos registrados en la empresa sin operaciones CRUD.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `/auth/login`                  | Muestra la pantalla de inicio de sesión para que los usuarios puedan autenticarse.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `/auth/register`               | Muestra la pantalla de registro para que nuevos usuarios puedan crear una cuenta.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `/products`                    | Muestra todos los productos con opciones CRUD (disponible si el usuario está autenticado).                                                                                                                                                                                                                                                                                                                                                                                                            |
| `/products/create`             | Permite crear un nuevo producto (requiere autenticación).                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `/products/edit/{id}`          | Permite editar un producto específico (requiere autenticación).                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `/dashboard`                   | Muestra la lista de almacenes (warehouses) de la empresa, el historial de inventario que incluye todas las entradas y salidas de productos de todos los almacenes. Además, presenta un panel para filtrar productos por un rango de fechas y mostrar una tabla con los productos de mayor rotación (más entradas y salidas). También incluye un botón para adquirir productos, donde se pueden seleccionar Supplier, Warehouse, Category, y añadir detalles como Nombre del Producto, Descripción, Precio, Cantidad e Imagen. Los productos se añaden a una lista para su adquisición. |
| `/dashboard/warehouse/{id}`    | Muestra los detalles de un almacén específico, incluyendo los productos más vendidos, recomendaciones de stock, y detalles del stock (nombres de los productos y su cantidad disponible). Además, ofrece acciones para gestionar el stock, como añadir productos a la venta (salidas de stock) y aumentar el stock disponible (entradas de stock).                                                                                                                           |
| `/dashboard/warehouses/create` | Permite crear nuevos almacenes ingresando su nombre y dirección.                                                                                                                                                                                                                                                                                                                                                                                                                                    |

---

### Detalles Adicionales

- **Adquirir Productos en Dashboard:**
  - **Select Supplier:** Selecciona el proveedor de los productos.
  - **Select Warehouse:** Selecciona el almacén donde se almacenarán los productos.
  - **Select Category:** Selecciona la categoría del producto.
  - **Product Name:** Ingresa el nombre del producto.
  - **Description:** Proporciona una descripción del producto.
  - **Price:** Establece el precio del producto.
  - **Quantity:** Define la cantidad del producto a adquirir.
  - **Image URL:** Proporciona la URL de la imagen del producto.

Los productos añadidos a través de este proceso se agregan a una lista para su adquisición posterior.

---

### Organización de Rutas por Sección (Opcional)

Para una mejor organización, puedes categorizar las rutas según su funcionalidad. A continuación, un ejemplo de cómo hacerlo:

#### **Autenticación**

| **Ruta**         | **Descripción**                      |
|------------------|--------------------------------------|
| `/auth/login`    | Pantalla de inicio de sesión.        |
| `/auth/register` | Pantalla de registro de nuevos usuarios. |

#### **Productos**

| **Ruta**               | **Descripción**                                                        |
|------------------------|------------------------------------------------------------------------|
| `/products`            | Lista todos los productos con opciones CRUD (si está autenticado).     |
| `/products/create`     | Permite crear un nuevo producto (requiere autenticación).              |
| `/products/edit/{id}`  | Permite editar un producto específico (requiere autenticación).        |

#### **Dashboard**

| **Ruta**                       | **Descripción**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/dashboard`                   | Vista principal del dashboard que muestra almacenes, historial de inventario, filtrado por fechas, productos de mayor rotación y opción para adquirir productos.                                                                                                                                                                                                                                                                                                                                         |
| `/dashboard/warehouse/{id}`    | Detalles específicos de un almacén, incluyendo productos más vendidos, recomendaciones y gestión de stock.                                                                                                                                                                                                                                                                                                                                                                                        |
| `/dashboard/warehouses/create` | Permite crear nuevos almacenes ingresando su nombre y dirección.                                                                                                                                                                                                                                                                                                                                                                                                                                    |

---
## Pantalla Dashboard
![image](https://github.com/user-attachments/assets/38357b28-2c22-4d3e-8309-4579924ef0eb)

## Pantalla Detalles Warehouses
![image](https://github.com/user-attachments/assets/eb1052a7-e60d-4a1d-8778-8afb9f04cadf)

## Pantalla Crear Nuevo Almacén
![image](https://github.com/user-attachments/assets/8c448b33-5758-4295-9d63-306a14e96b99)

## Pop-Up Adquirir Productos
![image](https://github.com/user-attachments/assets/9996a0a8-ccb7-4e3c-8f2f-296bf021a84a)



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
[LinkedIn]([https://linkedin.com/in/usuario](https://www.linkedin.com/in/gorky-palacios-mutis-8136ab230/))
