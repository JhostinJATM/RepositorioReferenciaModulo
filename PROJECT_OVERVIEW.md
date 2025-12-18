# Resumen del Proyecto: Sistema de Gestión de Basketball

Este documento proporciona una visión general técnica de la arquitectura, el flujo de autenticación y la integración de módulos del proyecto.

## 1. Arquitectura General

El sistema sigue una arquitectura de **Microservicios** (o servicios distribuidos) compuesta por tres componentes principales:

1.  **Frontend (Client)**: Aplicación React (Vite) que sirve como interfaz de usuario.
2.  **Backend (Basketball Module)**: API REST en Django que maneja la lógica de negocio específica del deporte (entrenadores, atletas, pruebas, etc.).
3.  **User Module (External)**: Microservicio independiente (Spring Boot/Java o similar, corriendo en puerto 8096) encargado de la identidad, autenticación y gestión de datos personales.

## 2. Frontend (Client)

### Tecnologías
*   **Framework**: React 18 con Vite.
*   **Estado Global**: Zustand (`stores/`) con persistencia en `localStorage`.
*   **Cliente HTTP**: Axios (`api/apiClient.js`) con interceptores.
*   **UI**: Tailwind CSS.

### Funcionamiento
*   **Gestión de Estado**: Se utiliza `authStore.js` para almacenar el token JWT y la información del usuario decodificada.
*   **Interacción con APIs**:
    *   `apiClient.js`: Se comunica con el Backend de Basketball (puerto 8000). Intercepta cada petición para inyectar el header `Authorization: Bearer <token>`.
    *   `userModuleService.js`: Se comunica **directamente** con el User Module (puerto 8096). Maneja su propio token de administración para crear o consultar personas.

## 3. Backend (Basketball Module)

### Tecnologías
*   **Framework**: Django 4.2 con Django REST Framework (DRF).
*   **Base de Datos**: PostgreSQL (`basketball_db`).
*   **Contenedor**: Dockerizado con `python:3.10-slim`.

### Estructura del Código
El backend está altamente organizado siguiendo patrones de diseño limpios:
*   **Controllers (`controllers/`)**: Reemplazan a las `views.py` tradicionales. Manejan la entrada HTTP y delegan la lógica.
*   **Services (`services/`)**: Contienen la lógica de negocio pura.
*   **Serializers (`serializers.py`)**: Transforman los modelos a JSON. **Característica Clave**: Los serializadores de `Entrenador` y `Pasante` son "inteligentes"; realizan peticiones HTTP al User Module para enriquecer la respuesta con datos personales (nombre, email, foto) que no están en la BD local.
*   **Models (`models.py`)**: Definen el esquema de datos. Modelos como `Entrenador` solo guardan una referencia `persona_external` (UUID) y datos específicos del rol (especialidad, club).

## 4. Flujo de Autenticación y Token

El manejo del token es híbrido y distribuido:

1.  **Login**: El usuario se loguea contra el **User Module**.
2.  **Almacenamiento**: El frontend recibe un JWT y lo guarda en `localStorage` (`auth-storage`).
3.  **Uso en Frontend**:
    *   El `authStore` decodifica el JWT para determinar el rol (`ADMIN`, `ENTRENADOR`, `ESTUDIANTE`).
    *   Las rutas se protegen en base a estos roles.
4.  **Uso en Backend**:
    *   El frontend envía el token en el header `Authorization` a la API de Basketball.
    *   El backend valida permisos (aunque confía en la identidad proporcionada por el User Module).

## 5. Integración del Módulo de Usuario

La integración es bidireccional y ocurre tanto en el frontend como en el backend:

### Flujo de Creación (Frontend Orchestration)
Cuando se crea un nuevo Entrenador o Estudiante:
1.  El Frontend llama a `UserModuleService.crearPersona()` (User Module) para registrar los datos personales (Nombre, DNI, Email).
2.  El User Module devuelve un ID (`personaId`).
3.  El Frontend toma ese ID y llama a `EntrenadorService.create()` (Backend Basketball), enviando el `persona_external` junto con los datos específicos (Especialidad).

### Flujo de Lectura (Backend Enrichment)
Cuando se lista un Entrenador:
1.  El Backend lee la tabla `entrenador` (obtiene `persona_external` y `especialidad`).
2.  El `EntrenadorSerializer` llama a `get_persona_from_user_module(persona_external)`.
3.  Esta función hace un GET al User Module (usando un token de admin cacheado).
4.  Se combinan los datos y se envían al frontend.

## 6. Evaluación de la Organización

### Puntos Fuertes
*   **Separación de Responsabilidades**: Clara distinción entre "Identidad" (User Module) y "Negocio" (Basketball).
*   **Frontend Moderno**: Uso de Hooks personalizados (`useApi`, `useForm`) y Stores globales mantiene los componentes limpios.
*   **Backend Estructurado**: El uso de Controllers y Services facilita el mantenimiento y las pruebas unitarias.
*   **Resiliencia**: El backend implementa caché para los datos del User Module, reduciendo la latencia y la carga de red.

### Observaciones
*   **Complejidad en Frontend**: El frontend debe conocer y autenticarse contra dos APIs distintas. Esto añade complejidad a los formularios (manejo de doble error, transacciones distribuidas manuales).
*   **Dependencia Fuerte**: Si el User Module cae, el Backend de Basketball no puede mostrar nombres ni emails, solo IDs y especialidades.

---
**Estado del Proyecto**: El código está bien estructurado, sigue buenas prácticas de ingeniería de software y la contenerización con Docker está correctamente configurada.
