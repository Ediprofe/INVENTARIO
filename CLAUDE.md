Parte 1: Modelo funcional del sistema de inventario
# Especificación funcional - PARTE 1 
## Sistema de Inventario Escolar – Alcance definido hasta ahora

---

## 1. Alcance actual

Este documento resume, con el mayor detalle posible, lo que se ha definido hasta el momento:

- Tablas lógicas (modelo de datos funcional) para:
  - **Responsables**
  - **Sedes**
  - **Ubicaciones**
  - **Artículos (catálogo/base)**
  - **Inventario general (ítems físicos)**
  - **Movimientos de inventario**
  - **Registros de baja**
- Comportamiento de:
  - **Tabla general del panel principal**
  - **Filtros y búsquedas**
  - **Edición puntual (en línea)**
  - **Edición en lote (modal tipo hoja de cálculo)**
  - **Alta masiva de artículos**
  - **Baja lógica y reactivación**
  - **Historial de movimientos**

No incluye aún el detalle completo de **roles y permisos**, ni el diseño de **informes** o vistas por responsable/sede (eso vendrá después).

---

## 2. Tablas lógicas y campos

### 2.1. Tabla de Responsables

**Objetivo:** almacenar personas que pueden ser responsables de ubicaciones y de ítems de inventario.

**Campos:**
- `nombre_completo` (obligatorio)
- `tipo_documento` (opcional)
- `numero_documento` (opcional)
- `email` (opcional)
- `numero_celular` (opcional)
- `cargo` (opcional)
- `sede_id` (opcional, referencia a Sede)
- `rol` (rol de sistema, con permisos definidos en otra etapa)

**Reglas:**
- Solo el `nombre_completo` es obligatorio.
- Los responsables están vinculados a una **sede** (cuando aplica).
- Desde esta tabla se llena el campo **Responsable** en:
  - Ubicaciones
  - Inventario general

---

### 2.2. Tabla de Sedes

**Objetivo:** representar cada sede/campus del colegio.

**Campos:**
- `id` (identificador interno)
- `nombre_sede`
- `numero_sede`
- `responsable_inventario_id` (responsable principal de inventario en la sede)
- `lista_responsables` (lista de responsables que pertenecen a esta sede; lógicamente se deriva de la tabla de Responsables filtrada por sede)

**Reglas:**
- Una sede puede tener muchos responsables.
- Desde la sede se filtra:
  - La lista de responsables disponibles para ser asignados a ubicaciones.
  - La lista de responsables disponibles para ítems de inventario de esa sede.

---

### 2.3. Tabla de Ubicaciones

**Objetivo:** representar los espacios físicos donde hay inventario.

**Campos:**
- `id` (identificador interno)
- `sede_id` (referencia a Sede)
- `codigo_ubicacion` (ej.: E204)
- `descripcion_ubicacion` (ej.: “Sistemas”, “Aula 3B”)
- `responsable_ubicacion_id` (responsable por defecto de la ubicación)
- `tipo_ubicacion` (valor dinámico)

**Tipos de ubicación (valores por defecto):**
- Aula
- Oficina
- Unidad sanitaria
- Cuarto útil
- Servicio general
- Infraestructura

**Reglas:**
- `tipo_ubicacion` se maneja como lista editable (se pueden agregar nuevos tipos “en vivo”).
- Desde la ubicación se deriva:
  - El responsable por defecto para ítems nuevos en esa ubicación.
  - Parte de la lógica de autoasignación de responsables.

---

### 2.4. Tabla de Artículos (catálogo/base)

**Objetivo:** catálogo maestro de tipos de artículos, independiente de las unidades físicas.

**Campos:**
- `id` (identificador interno)
- `nombre_articulo` (Artículo)
- `tipo_inventario`
- `categoria`
- `codigo_articulo` (puede ser el mismo `id` o un código generado)
- `foto_articulo` (opcional)
- `descripcion_articulo` (opcional)

**Tipos de inventario (valores por defecto, editables):**
- Tecnología
- Muebles
- Infraestructura
- Insumos

**Categorías según tipo de inventario (valores por defecto, editables):**

- **Tecnología:**  
  - Cómputo  
  - Red  
  - Electrodomésticos  
  - Sonido  
  - Impresión  
  - Otros  

- **Muebles:**  
  - Sillas  
  - Mesas  
  - Tableros  
  - Estantes  
  - Dotación  
  - Otros  

- **Infraestructura:**  
  - Baño  
  - Eléctrico  

- **Insumos:**  
  - Seguridad  
  - Mueble menor  
  - Otros  

**Reglas:**
- `tipo_inventario` y `categoria` tienen valores por defecto, pero deben ser configurables (creación/edición de tipos y categorías).
- Estos datos se usan para:
  - Prellenar `tipo_inventario` cuando se selecciona un artículo en el inventario general.
  - Filtrar y consolidar.

---

### 2.5. Tabla de Inventario General (ítems físicos)

**Objetivo:** representar cada unidad física de inventario.

**Cada fila = 1 artículo físico**, no hay campo de cantidad.

**Campos principales visibles en la tabla del panel principal:**
- `articulo_id` (relación con Artículos; muestra `nombre_articulo`)
- `placa` (opcional, texto)
- `ubicacion_id` (relación con Ubicaciones; muestra `codigo_ubicacion`)
- `descripcion_ubicacion` (derivada de Ubicación, solo lectura)
- `sede_id` (sede asociada a la ubicación; se selecciona antes que la ubicación)
- `responsable_id` (relación con Responsables)
- `descripcion` (del ítem en particular, opcional)
- `estado` (Bueno / Regular / Malo)
- `observaciones` (texto libre)
- `disponibilidad` (En uso / En reparación / Extraviado / De baja)
- `marca` (desde lista, editable en vivo)
- `serial` (opcional)

**Campos internos (no necesariamente visibles en tabla principal):**
- `tipo_inventario` (derivado del Artículo)
- Timestamps de creación / última modificación, etc. (para lógica técnica).

**Reglas de validación:**
- **Obligatorios en un ítem de inventario:**
  - `articulo_id`
  - `tipo_inventario` (se llena automáticamente a partir del artículo)
  - `sede_id` (debe seleccionarse antes de `ubicacion_id`)
  - `ubicacion_id`
  - `descripcion_ubicacion` (se llena automáticamente desde la ubicación)
  - `responsable_id` (autoasignado por defecto desde la ubicación, pero modificable)
  - `estado`
  - `disponibilidad`

- **Placa:**
  - Campo **opcional**.
  - Si está vacío → no se aplica restricción.
  - Si se llena → debe ser **única en todo el inventario** (no se pueden repetir placas entre ítems).

- **Serial:**
  - Campo **opcional**.
  - Regla: para un mismo artículo (misma referencia de `articulo_id`), el `serial` **no puede repetirse**.
  - Es posible, en teoría, que un mismo serial aparezca en artículos distintos (regla aceptada por ahora).

- **Marca:**
  - Lista desplegable con marcas existentes.
  - Si la marca no existe, se puede **agregar en vivo** y quedará disponible en la lista.

- **Disponibilidad (valores fijos):**
  - En uso
  - En reparación
  - Extraviado
  - De baja

- **Estado (valores fijos):**
  - Bueno
  - Regular
  - Malo

---

### 2.6. Tabla de Movimientos de Inventario

**Objetivo:** registrar eventos relevantes sobre cada ítem del inventario.

**Campos sugeridos:**
- `id`
- `inventario_item_id` (referencia al ítem concreto)
- `tipo_movimiento` (Alta, Cambio de ubicación, Cambio de responsable, Cambio de disponibilidad, Baja, Reactivación, etc.)
- `fecha_hora`
- `usuario_id` (usuario del sistema que ejecutó la acción)
- `ubicacion_origen_id` / `ubicacion_destino_id` (cuando aplique)
- `responsable_origen_id` / `responsable_destino_id` (cuando aplique)
- `disponibilidad_origen` / `disponibilidad_destino` (cuando aplique)
- `comentario` (texto opcional u obligatorio según tipo de movimiento, ej.: baja, reactivación)

**Se registran SIEMPRE los siguientes eventos:**
- **Alta** (creación de ítems en el inventario)
- **Cambio de ubicación**
- **Cambio de responsable**
- **Cambio de disponibilidad relevante**, al menos:
  - A `En reparación`
  - A `Extraviado`
  - A `De baja`
  - Desde `De baja` a otra (reactivación)
- **Baja** (Disponibilidad = De baja)
- **Reactivación** (vuelta desde De baja a estado activo)

No se registran modificaciones menores como cambios de descripción u observaciones (para evitar ruido en el historial).

---

### 2.7. Tabla de Bajas (o Registro de Bajas)

**Objetivo:** complementar la información de ítems dados de baja (además del movimiento en la tabla de movimientos).

**Campos:**
- `id`
- `inventario_item_id`
- `fecha_baja`
- `usuario_id`
- `comentario_baja` (texto libre: donado a X, desechado, vendido por partes, etc.)

**Reglas:**
- El **motivo de baja** se maneja como texto libre (no lista de valores fija).
- Cada baja se vincula también a la lógica de Disponibilidad = De baja.
- La baja puede ser **reversible** (ver apartado de bajas y reactivación).

---

## 3. Tabla general del panel principal

### 3.1. Columnas visibles

La tabla principal (vista al entrar al sistema) muestra:

- Artículo (`nombre_articulo`)
- Placa
- Ubicación (`codigo_ubicacion`)
- Descripción de ubicación
- Sede
- Responsable
- Descripción (del ítem)
- Estado
- Observaciones
- Disponibilidad
- Marca
- Serial

Campos como `tipo_inventario` y `categoria` se manejan internamente (para filtros y consolidaciones) y pueden mostrarse en el futuro si se requiere.

### 3.2. Filtros y búsqueda interactiva

Desde la tabla general se podrán aplicar filtros y búsquedas de forma dinámica:

- Filtro por **todos los campos** de la tabla (directamente o mediante controles avanzados).
- En particular, para:
  - **Artículo**
  - **Ubicación**
  - **Responsable**
  - **Descripción de ubicación**

se requiere:

- Cuadros de texto que permitan **escribir y filtrar en vivo** (búsqueda reactiva).
- Selección múltiple (multi-select) de valores:
  - Una o varias ubicaciones.
  - Uno o varios responsables.
  - Uno o varios artículos.
  - Y combinaciones con otros campos (por ejemplo, varios estados, varias disponibilidades, varias marcas).

---

## 4. Edición puntual (en línea) en la tabla general

- La edición puntual es **en línea** (inline) sobre la tabla general.
- Solo los roles con permiso pueden editar en línea.
- Al editar en línea:
  - Se afecta **solo ese registro**.
  - No se abre ningún modal.
- Campos típicamente editables en línea (según permisos):
  - Estado
  - Disponibilidad
  - Descripción
  - Observaciones
  - Marca
  - Serial
  - (otros a definir según políticas)

---

## 5. Edición en lote – Modal tipo hoja de cálculo

La edición en lote se realiza mediante un **modal con una tabla tipo hoja de cálculo**, reutilizado en varios escenarios.

### 5.1. Escenarios de entrada al modal de lote

1. **Desde un registro en la tabla general (contexto artículo + ubicación):**
   - Acción: “Editar en lote este artículo en esta ubicación”.
   - El modal se abre con:
     - Todas las filas del inventario que correspondan a ese **mismo artículo** en esa **misma ubicación**.
   - El registro desde el que se abrió el modal aparece:
     - **Resaltado visualmente (highlight)**,  
     - Pero **no seleccionado por defecto** en el checkbox.

2. **Desde selección múltiple en la tabla general:**
   - El usuario marca varios checkboxes en la tabla general (pueden ser de distintas ubicaciones / artículos).
   - Acciona “Editar en lote”.
   - El modal se abre solo con esos registros seleccionados.

3. **Desde el flujo de alta masiva de nuevos artículos:**
   - Tras indicar:
     - Artículo base
     - Cantidad
     - Sede y ubicación
   - El modal se abre mostrando filas nuevas (aún no guardadas) para editarlas antes de confirmarlas.

### 5.2. Comportamiento dentro del modal de lote

- Tabla tipo hoja de cálculo:
  - Filas = ítems de inventario (existentes o nuevos).
  - Columnas = campos editables (Placa, Estado, Disponibilidad, Responsable, Descripción, Observaciones, Marca, Serial, etc.).

- Cada fila tiene un **checkbox** a la izquierda:
  - Se puede seleccionar con:
    - Click
    - Barra espaciadora (cuando el foco está en esa fila/checkbox)

- Navegación por teclado:
  - `Enter` → confirma la celda actual y baja a la fila siguiente en la misma columna.
  - `Tab` → mueve a la siguiente celda a la derecha.
  - Flechas → mueven el foco entre celdas.
  - Posibles atajos globales:
    - Seleccionar todo (Ctrl+A / Cmd+A) dentro del modal.

- Edición de celdas:
  - Las celdas de **Estado** y **Disponibilidad** son listas desplegables con valores válidos:
    - Estado: Bueno / Regular / Malo.
    - Disponibilidad: En uso / En reparación / Extraviado / De baja.
  - Las celdas permiten escritura rápida (para filtrar opciones) y selección con teclado.
  - Permite pegar datos desde Excel (ej.: columna Placa).

### 5.3. Acciones en lote dentro del modal

Sobre las filas **seleccionadas** por checkbox se pueden aplicar acciones masivas, por ejemplo:

- **Cambiar ubicación:**
  - Se elige ubicación destino (y por ende su sede).
  - El sistema propone automáticamente el **responsable por defecto** de la nueva ubicación.
  - Se pregunta explícitamente:
    - “¿Usar el responsable por defecto de la ubicación destino?”
  - Si el usuario responde:
    - **Sí:** se asigna ese responsable a todos los ítems seleccionados.
    - **No:** se muestra un selector para elegir un responsable (de la sede correspondiente) que se aplicará a todos los ítems seleccionados.
  - Cada cambio de ubicación genera un **movimiento de inventario**.

- **Cambiar responsable:**
  - Se elige un nuevo responsable (filtrado por sede si corresponde).
  - Aplica a todas las filas seleccionadas.
  - Genera movimiento de cambio de responsable por artículo.

- **Cambiar Estado (Bueno/Regular/Malo):**
  - Se fija un estado para todas las filas seleccionadas.

- **Cambiar Disponibilidad:**
  - Se fija una disponibilidad para todas las filas seleccionadas.
  - Si se cambia a `De baja`, se dispara la lógica de baja (ver más abajo).

- **Otros campos:**
  - Edición en lote de descripción, observaciones, etc., según se defina.

---

## 6. Alta masiva de artículos al inventario

Flujo resumido:

1. Desde la tabla general o navbar, botón: **“Agregar artículos al inventario”**.
2. Pasos previos:
   - Seleccionar **Artículo** desde la tabla de Artículos (catálogo).
   - Si el artículo no existe, poder **crear uno nuevo** (nombre, tipo, categoría, código, foto, descripción).
   - Indicar **cuántas unidades** se van a agregar.
   - Seleccionar **Sede** y **Ubicación** destino.
3. El responsable de los nuevos ítems se autoasigna desde el **responsable de la ubicación**.
4. Se abre el **modal tipo hoja de cálculo** con una fila por cada unidad:
   - Permite editar: Placa, Estado, Disponibilidad, Descripción, Observaciones, Marca, Serial, etc.
   - Permite:
     - Pegar columnas desde Excel (ej. placas).
     - Operaciones en lote (Estado, Disponibilidad, etc.).
5. Al guardar:
   - Se crean los ítems del inventario.
   - Se registra un **movimiento de Alta** por cada ítem.

---

## 7. Bajas y reactivación

### 7.1. Borrado lógico mediante Disponibilidad

- No se elimina físicamente el registro del inventario.
- La “eliminación” de un ítem se representa como:
  - `disponibilidad = De baja`.
- En la tabla principal:
  - Por defecto se muestran solo ítems con `disponibilidad ≠ De baja`.
  - Puede haber una opción de filtro para incluir/excluir las bajas.

### 7.2. Registro de baja

- Al pasar un ítem a `De baja`:
  - Se genera un **Movimiento** de tipo Baja.
  - Se crea (o actualiza) un **Registro de Baja**:
    - Con fecha, usuario y comentario de baja (motivo en texto libre).

### 7.3. Reactivación de artículos dados de baja

- Solo ciertos roles (por ejemplo: superadministrador, jefe de inventario, administrador de sede) pueden **revertir una baja**.
- Reactivación:
  - Consiste en cambiar la `disponibilidad` desde `De baja` a otra (En uso, En reparación, etc.).
  - Se requiere **un comentario de reactivación** (explicando el motivo).
  - Se registra un **Movimiento** de tipo Reactivación.

---

## 8. Comportamiento del Responsable del inventario

- Al crear un ítem:
  - El `responsable_id` se **asigna automáticamente** con el **responsable de la ubicación** elegida.
- El `responsable_id` se puede modificar:
  - En edición puntual (si el rol lo permite).
  - En edición en lote.
- Restricción opcional:
  - El responsable elegido para un ítem debe estar dentro de la **sede** correspondiente (lista de responsables de esa sede).

Al mover ítems de una ubicación a otra:

- Se aplica la lógica de:
  - Proponer responsable por defecto de la nueva ubicación.
  - Preguntar si se desea usarlo o definir otro responsable.

---

## 9. Resumen de decisiones clave ya fijadas

- **Cada fila de inventario = 1 unidad física** (no se usa campo cantidad).
- Campo **N°** y campo **Color** se eliminan.
- Campo **Placa**:
  - Opcional
  - Único global si está presente.
- Campo **Serial**:
  - Opcional
  - Único por artículo (no repetible para un mismo artículo).
- **Disponibilidad = De baja** funciona como borrado lógico.
- Se lleva **historial de movimientos** con:
  - Altas
  - Cambios de ubicación
  - Cambios de responsable
  - Cambios de disponibilidad relevantes
  - Bajas
  - Reactivaciones
- Edición puntual:
  - En línea en la tabla general (según permisos).
- Edición en lote:
  - Modal tipo hoja de cálculo reutilizable:
    - Desde selección múltiple.
    - Desde contexto artículo+ubicación.
    - Desde alta masiva.

---

Este markdown refleja, con el mayor grado de detalle posible y de forma consistente, todo lo acordado hasta ahora.  
A partir de aquí podemos:

- Ajustar frases/terminología si algo no se lee como quieres.
- Empezar a definir:
  - **Roles y permisos** con detalle.
  - **Vistas por responsable**, por sede, por categoría.
  - **Informes e impresiones** (HTML / export a Excel).
  - Reglas adicionales sobre consolidación y contadores (ej.: total de portátiles por ubicación, etc.).

  Parte 2: Vistas Especializadas, Edición en Lote y Flujo de Operaciones
  # Especificación funcional – PARTE 2
## Sistema de Inventario Escolar
---

# 1. Vistas adicionales de inventario

Además de la **Vista principal – Tabla general**, existen tres vistas adicionales:

1. **Inventario por ubicación**  
2. **Inventario por responsable**  
3. **Inventario por artículo**

Las cuatro vistas (incluida la principal) comparten:

- Acceso controlado por permisos.  
- Consistencia total en la lectura de datos.  
- Uso del **mismo modal de detalle y edición en lote**, descrito en la primera parte.  
- Lógica estricta de movimientos.

---

# 2. Inventario por ubicación

## 2.1. Objetivo

Permitir visualizar el inventario de una ubicación, **totalizado por artículo**, y acceder al detalle de sus ítems para edición individual o en lote (según permisos).

## 2.2. Filtros

- **Sede** (obligatorio)  
- **Ubicación** (obligatorio, filtrado por sede)

## 2.3. Tabla totalizada

Columnas:

| Columna | Descripción |
|--------|-------------|
| Artículo | Nombre del artículo (`nombre_articulo`). |
| Total | Cantidad de ítems del artículo en la ubicación, con `disponibilidad ≠ De baja`. |

*(No incluye fotos, siguiendo requerimiento explícito.)*

## 2.4. Acción al hacer clic en una fila

Se abre el **modal tipo hoja de cálculo** mostrando los ítems filtrados por:

- `articulo_id` = Artículo seleccionado  
- `ubicacion_id` = Ubicación seleccionada  
- `disponibilidad` ≠ `De baja`

En el modal:  
- Edición individual según permisos.  
- Selección por checkbox.  
- Operaciones en lote (cambio de ubicación, cambio de responsable, cambio de estado, cambio de disponibilidad).  
- Registro de movimientos.

---

# 3. Inventario por responsable

## 3.1. Objetivo

Mostrar el inventario asociado a un responsable, agrupado por ubicación y artículo.

## 3.2. Filtros

- **Sede** (obligatorio)  
- **Responsable** (obligatorio, filtrado por sede)

## 3.3. Tabla totalizada

Columnas:

| Columna | Descripción |
|--------|-------------|
| Ubicación | Código de ubicación. |
| Descripción de ubicación | Texto descriptivo. |
| Artículo | Nombre del artículo. |
| Total | Cantidad de ítems con ese responsable en esa ubicación. |

*(Solo ítems con `disponibilidad ≠ De baja`.)*

## 3.4. Acción al hacer clic

Abre el modal con filtros:

- `responsable_id`  
- `ubicacion_id`  
- `articulo_id`  
- `disponibilidad ≠ De baja`

Comportamiento igual al modal estándar.

---

# 4. Inventario por artículo

## 4.1. Objetivo

Mostrar el inventario totalizado por artículo, con totales generales, totales por sede y por ubicación, con acceso a detalle.

## 4.2. Filtros

- **Artículo** (obligatorio)  
- **Sede** (opcional / puede ser “todas”)

*(Solo se muestran ítems con `disponibilidad ≠ De baja`.)*

## 4.3. Resumen de totales

Se muestra un bloque superior indicando:

- Total de la institución del artículo seleccionado.  
- Total por cada sede.

Siempre se muestran ambos, independientemente del filtro de sede.

## 4.4. Tabla totalizada por sede y ubicación

Columnas:

| Columna | Descripción |
|--------|-------------|
| Sede | Nombre de sede. |
| Ubicación | Código. |
| Descripción de ubicación | Texto descriptivo. |
| Total | Cantidad del artículo en esa sede/ubicación. |

## 4.5. Acción al hacer clic

Abre el modal:

- Filtro `articulo_id`
- Filtro `ubicacion_id`
- `disponibilidad ≠ De baja`

Con todas las capacidades de edición según permisos.

---

# 5. Modal único de detalle y edición en lote (resumen unificado)

Este modal es **idéntico** en todas las vistas.

## 5.1. Filas

Cada fila representa **un ítem físico**, con los campos definidos en la primera parte.

## 5.2. Selección

- Checkbox por fila  
- Selección por click o **barra espaciadora**

## 5.3. Navegación por teclado

- `Enter`: confirma y baja una fila  
- `Tab`: cambia de columna  
- Flechas: navegación lateral/vertical

## 5.4. Edición individual

Campos editables según permisos del usuario:

- Placa  
- Estado  
- Disponibilidad  
- Responsable  
- Descripción  
- Observaciones  
- Marca  
- Serial  
- Otros campos del inventario general definidos en la primera parte

## 5.5. Acciones en lote

Sobre filas seleccionadas:

- Cambio de ubicación (con lógica de responsable por defecto)  
- Cambio de responsable  
- Cambio de estado  
- Cambio de disponibilidad  
- Edición en lote de campos permitidos

Todas las operaciones relevantes generan movimientos en la tabla de Movimientos de Inventario.

---

# 6. Exportación del inventario

La **única exportación** existente en todo el sistema es:

## 6.1. Exportación completa de la tabla general del inventario

- Botón: **“Exportar inventario completo”**  
- Exporta **todo lo visible en la tabla general**, respetando los filtros activos.  
- Formato: Excel.  
- Cada fila = 1 ítem físico.  
- Columnas exportadas (todas las visibles en tabla general):  
  - Artículo  
  - Placa  
  - Ubicación  
  - Descripción de ubicación  
  - Sede  
  - Responsable  
  - Descripción  
  - Estado  
  - Observaciones  
  - Disponibilidad  
  - Marca  
  - Serial  
- Campos internos (articulo_id, responsable_id, timestamps) **no** se exportan.

*(La importación se definirá en la parte 3.)*

---

# 7. Sistema formal de permisos

Toda acción del sistema depende de **permisos**, no del rol directamente.  
Los **roles son agrupaciones de permisos**.  
Los permisos se pueden personalizar por rol.

## 7.1. Lista completa de permisos del módulo de inventario

Cada permiso es binario (permitido / no permitido):

### **Permisos de acceso a vistas**
1. `ver_tabla_general`
2. `ver_inventario_por_ubicacion`
3. `ver_inventario_por_responsable`
4. `ver_inventario_por_articulo`

### **Permisos de exportación**
5. `exportar_tabla_general`

### **Permisos de modal**
6. `abrir_modal_detalle`
7. `editar_individual_en_modal`
8. `editar_en_lote_en_modal`

### **Permisos de edición puntual (en línea)**
9. `editar_en_linea_tabla_general`

### **Permisos de cambios críticos**
10. `cambiar_ubicacion`
11. `cambiar_responsable`
12. `cambiar_estado`
13. `cambiar_disponibilidad`
14. `confirmar_baja`
15. `reactivar_item`

### **Permisos de alta**
16. `alta_masiva`
17. `alta_individual`

*(Todos estos permisos se aplican estrictamente en todas las vistas y en el modal.)*

---

# 8. Matriz de permisos por rol (configurable)

A continuación se establece la **configuración por defecto**, totalmente editable:

### LEYENDA  
- ✔ = permiso activo por defecto  
- ✖ = permiso desactivado por defecto  

---

## 8.1. Superadministrador

| Permiso | Valor |
|--------|-------|
| ver_tabla_general | ✔ |
| ver_inventario_por_ubicacion | ✔ |
| ver_inventario_por_responsable | ✔ |
| ver_inventario_por_articulo | ✔ |
| exportar_tabla_general | ✔ |
| abrir_modal_detalle | ✔ |
| editar_individual_en_modal | ✔ |
| editar_en_lote_en_modal | ✔ |
| editar_en_linea_tabla_general | ✔ |
| cambiar_ubicacion | ✔ |
| cambiar_responsable | ✔ |
| cambiar_estado | ✔ |
| cambiar_disponibilidad | ✔ |
| confirmar_baja | ✔ |
| reactivar_item | ✔ |
| alta_masiva | ✔ |
| alta_individual | ✔ |

---

## 8.2. Administrador de sede

| Permiso | Valor |
|--------|-------|
| ver_tabla_general | ✔ |
| ver_inventario_por_ubicacion | ✔ |
| ver_inventario_por_responsable | ✔ |
| ver_inventario_por_articulo | ✔ |
| exportar_tabla_general | ✔ |
| abrir_modal_detalle | ✔ |
| editar_individual_en_modal | ✔ |
| editar_en_lote_en_modal | ✔ |
| editar_en_linea_tabla_general | ✔ |
| cambiar_ubicacion | ✔ |
| cambiar_responsable | ✔ |
| cambiar_estado | ✔ |
| cambiar_disponibilidad | ✔ |
| confirmar_baja | ✔ |
| reactivar_item | ✔ |
| alta_masiva | ✔ |
| alta_individual | ✔ |

*(Aplica solo a la sede del usuario.)*

---

## 8.3. Jefe de inventario

| Permiso | Valor |
|--------|-------|
| ver_tabla_general | ✔ |
| ver_inventario_por_ubicacion | ✔ |
| ver_inventario_por_responsable | ✔ |
| ver_inventario_por_articulo | ✔ |
| exportar_tabla_general | ✔ |
| abrir_modal_detalle | ✔ |
| editar_individual_en_modal | ✔ |
| editar_en_lote_en_modal | ✔ |
| editar_en_linea_tabla_general | ✔ |
| cambiar_ubicacion | ✔ |
| cambiar_responsable | ✔ |
| cambiar_estado | ✔ |
| cambiar_disponibilidad | ✔ |
| confirmar_baja | ✔ |
| reactivar_item | ✔ |
| alta_masiva | ✔ |
| alta_individual | ✔ |

*(Puede abarcar una o varias sedes.)*

---

## 8.4. Auxiliar de inventario

| Permiso | Valor |
|--------|-------|
| ver_tabla_general | ✔ |
| ver_inventario_por_ubicacion | ✔ |
| ver_inventario_por_responsable | ✔ |
| ver_inventario_por_articulo | ✔ |
| exportar_tabla_general | ✔ |
| abrir_modal_detalle | ✔ |
| editar_individual_en_modal | ✔ |
| editar_en_lote_en_modal | ✖ |
| editar_en_linea_tabla_general | ✖ |
| cambiar_ubicacion | ✖ |
| cambiar_responsable | ✖ |
| cambiar_estado | ✔ |
| cambiar_disponibilidad | ✔ |
| confirmar_baja | ✖ |
| reactivar_item | ✖ |
| alta_masiva | ✔ |
| alta_individual | ✔ |

---

## 8.5. Responsable de ubicación (docente/directivo)

| Permiso | Valor |
|--------|-------|
| ver_tabla_general | ✔ (solo ítems de sus ubicaciones) |
| ver_inventario_por_ubicacion | ✔ |
| ver_inventario_por_responsable | ✔ (solo para sí mismo) |
| ver_inventario_por_articulo | ✔ |
| exportar_tabla_general | ✔ |
| abrir_modal_detalle | ✔ (solo lectura) |
| editar_individual_en_modal | ✖ |
| editar_en_lote_en_modal | ✖ |
| editar_en_linea_tabla_general | ✖ |
| cambiar_ubicacion | ✖ |
| cambiar_responsable | ✖ |
| cambiar_estado | ✖ |
| cambiar_disponibilidad | ✖ |
| confirmar_baja | ✖ |
| reactivar_item | ✖ |
| alta_masiva | ✖ |
| alta_individual | ✖ |

---

## 8.6. Usuario de consulta

| Permiso | Valor |
|--------|-------|
| ver_tabla_general | ✔ |
| ver_inventario_por_ubicacion | ✔ |
| ver_inventario_por_responsable | ✔ |
| ver_inventario_por_articulo | ✔ |
| exportar_tabla_general | ✔ |
| abrir_modal_detalle | ✔ (solo lectura) |
| editar_individual_en_modal | ✖ |
| editar_en_lote_en_modal | ✖ |
| editar_en_linea_tabla_general | ✖ |
| cambiar_ubicacion | ✖ |
| cambiar_responsable | ✖ |
| cambiar_estado | ✖ |
| cambiar_disponibilidad | ✖ |
| confirmar_baja | ✖ |
| reactivar_item | ✖ |
| alta_masiva | ✖ |
| alta_individual | ✖ |

---

# 9. Coherencia entre la primera y segunda parte

- Todas las vistas usan la tabla de Inventario General definida en la primera parte.  
- El modal es único y sigue exactamente las reglas anteriores.  
- Los movimientos se registran como establece la primera parte.  
- La exportación solo existe desde la tabla general.  
- Ninguna vista incluye fotos.  
- Todos los permisos están completamente definidos y son compatibles con la lógica de ambas partes.

---

Esta segunda parte está lista para ser usada por una IA para implementación directa.  
Si deseas más ajustes o que sigamos con la **parte 3**, solo indícalo.

Parte 3: Importación y Exportación del Inventario
# **Especificación funcional – PARTE 3**

## **Importación Inicial de Inventario desde Excel**

Esta sección define el comportamiento completo y detallado del proceso de **importación del inventario** desde un archivo Excel, correspondiente a la carga inicial del sistema cuando no existe aún información previa (catálogos vacíos o parcialmente vacíos).
Las reglas aquí definidas son estrictas y no incluyen opcionales ni alternativas libres: son parte integral del sistema.

---

# **1. Objetivo del módulo de importación**

El módulo de importación permite cargar de manera masiva el inventario inicial del colegio a partir de un archivo Excel.
A partir de dicho archivo, el sistema debe:

1. Crear ítems de inventario físico (tabla Inventario General).
2. Construir automáticamente los catálogos maestros:

   * Sedes
   * Ubicaciones
   * Responsables
   * Artículos
3. Aplicar validaciones estrictas sobre las filas del archivo.
4. Registrar movimientos de tipo **Alta** para cada ítem creado.

Este proceso es fundamental para iniciar el uso del sistema desde cero, asegurando consistencia, integridad y coherencia con el modelo general del inventario.

---

# **2. Estructura del archivo Excel**

Cada fila del archivo representa **exactamente un ítem físico** del inventario.

## **2.1. Columnas requeridas en el archivo**

### **Campos obligatorios por fila:**

1. `Sede`

   * Nombre textual de la sede.
   * Ej.: “Central”, “Sede Norte”, “Primaria”.

2. `Ubicacion`

   * Código de ubicación (aula, oficina, bodega…).
   * Ej.: “E204”, “Aula3B”, “Oficina1”.

3. `Articulo`

   * Nombre del artículo tal como se conoce en el colegio.
   * Ej.: “Portátil Lenovo”, “Silla amarilla”, “Parlante”.

4. `Estado`

   * Uno de los valores válidos:

     * “Bueno”
     * “Regular”
     * “Malo”

5. `Disponibilidad`

   * Uno de los valores válidos:

     * “En uso”
     * “En reparación”
     * “Extraviado”
     * “De baja”

6. `Responsable`

   * Nombre completo del responsable directo del ítem.
   * No requiere tipo de documento, sede o cargo.
   * El sistema los creará automáticamente.

---

### **Campos opcionales por fila (pueden venir vacíos):**

7. `Placa`
8. `Marca`
9. `Serial`
10. `Descripcion`
11. `Observaciones`

---

## **2.2. Campos que explícitamente NO se incluyen en el archivo**

Para evitar ambigüedades y simplificar la importación inicial, los siguientes campos NO deben existir en el Excel:

* `Descripcion de ubicacion`
* `Tipo de inventario`
* `Categoria`
* `Responsable por defecto de ubicación`
* `Sede_id`, `Ubicacion_id`, `Articulo_id` (cualquier ID interno)
* `Codigo_articulo`
* `Foto`
* Cualquier otra columna no listada en 2.1

Estos campos se definen posteriormente en sus módulos propios dentro del sistema, no en el archivo de importación.

---

# **3. Proceso de importación**

La importación consta de 6 fases ejecutadas en orden:

---

## **Fase 1 – Lectura del archivo y normalización**

* El sistema lee todas las filas válidas de la hoja principal (hoja 1).
* Se normalizan espacios, capitalización y strings vacíos.
* Se descartan filas completamente vacías.

**Errores detectados aquí detienen la importación**, por ejemplo:

* Archivo con columnas faltantes.
* Archivo con nombres de columna incorrectos.

---

## **Fase 2 – Validaciones de datos por fila**

Antes de crear cualquier catálogo o ítem, se valida cada fila individual:

### **Validaciones obligatorias:**

1. `Sede` no puede estar vacía.
2. `Ubicacion` no puede estar vacía.
3. `Articulo` no puede estar vacío.
4. `Responsable` no puede estar vacío.
5. `Estado` debe ser uno de:

   * Bueno / Regular / Malo.
6. `Disponibilidad` debe ser uno de:

   * En uso / En reparación / Extraviado / De baja.

### **Validaciones de unicidad:**

#### **Placa**

* Si la placa viene vacía → válida.
* Si la placa viene diligenciada → debe ser **única** en todo el archivo y en el sistema.

  * Si se repite → error bloqueante.

#### **Serial**

* Si serial viene vacío → válido.
* Si viene diligenciado:

  * No puede repetirse para el mismo artículo (mismo nombre).
  * Puede repetirse entre artículos diferentes.

---

## **Fase 3 – Creación/actualización de catálogos**

Una vez validado el archivo completo (todas las filas), el sistema crea o actualiza los catálogos.

### **3.1. Creación de Sedes**

Para cada nombre de sede encontrado:

* Si la sede no existe:

  * Se crea en la tabla Sedes con:

    * `nombre_sede` = texto del Excel.
    * `numero_sede` = vacío.
    * `responsable_inventario_id` = vacío.

*Nota:* El usuario podrá completar `numero_sede` y asignar un responsable posteriormente.

---

### **3.2. Creación de Ubicaciones**

Para cada combinación Sede + Código de ubicación:

* Si no existe:

  * Se crea un registro de Ubicación:

    * `sede_id`
    * `codigo_ubicacion` = texto del Excel.
    * `descripcion_ubicacion` = vacío (se completará después desde el módulo de Ubicaciones).
    * `responsable_ubicacion_id` = vacío.

*Nota:* Posteriormente, el usuario podrá completar la descripción y asignar el responsable por defecto.

---

### **3.3. Creación de Responsables**

Para cada combinación `Responsable` + `Sede`:

* Si no existe:

  * Se crea:

    * `nombre_completo`
    * `sede_id`
    * `rol` = por defecto “Usuario de sede” (rol base definido en Parte 2).
    * Campos opcionales (email, celular, cargo) se dejan vacíos.

Esto permite que la tabla de responsables tenga datos mínimos para operar inmediatamente.

---

### **3.4. Creación de Artículos (catálogo)**

Para cada valor único de `Articulo`:

* Si no existe:

  * Crear un registro:

    * `nombre_articulo` = valor del Excel.
    * `tipo_inventario` = vacío.
    * `categoria` = vacía.
    * `codigo_articulo` = se genera automáticamente.
    * `foto_articulo` = vacío.
    * `descripcion_articulo` = vacío.

Después de la importación, el usuario ingresará al módulo de Artículos para asignar:

* Tipo de inventario
* Categoría
* Fotos
* Descripción

---

## **Fase 4 – Creación de ítems en el Inventario General**

Por cada fila del archivo:

1. Se localizan o crean:

   * La sede
   * La ubicación
   * El responsable
   * El artículo

2. Se crea un ítem físico con los campos:

* `sede_id`
* `ubicacion_id`
* `articulo_id`
* `responsable_id`
* `estado`
* `disponibilidad`
* `placa` (opcional)
* `marca` (opcional)
* `serial` (opcional)
* `descripcion` (opcional)
* `observaciones` (opcional)

---

## **Fase 5 – Registro de movimientos (Alta)**

Por cada ítem creado se registra automáticamente un Movimiento de inventario:

* `tipo_movimiento` = “Alta”
* `inventario_item_id`
* `fecha_hora`
* `usuario_id` (usuario que ejecutó la importación)
* No hay ubicación origen (porque es un alta).
* No hay responsable origen.
* No hay comentario obligatorio.

---

## **Fase 6 – Resumen de importación**

Al terminar:

* Se presenta:

  * Total de ítems creados.
  * Total de sedes creadas.
  * Total de ubicaciones creadas.
  * Total de responsables creados.
  * Total de artículos creados.
  * Lista de advertencias (por ejemplo: “X responsables quedaron sin correo asignado”).

Si hubo errores bloqueantes:

* La importación se cancela completamente (no hay registros parciales).
* Se presentan todas las filas con error y el motivo exacto.

---

# **4. Regla clave: esta importación NO rellena campos derivados**

Después de importar, el sistema queda con ítems, catálogos mínimos, y relaciones correctas.
Pero no se rellenan automáticamente:

* `Descripcion_ubicacion`
* `Tipo_inventario`
* `Categoria`
* `Responsable_por_defecto_ubicacion`
* `Numero_sede`
* `Foto_articulo`
* Cargos, emails, teléfonos de responsables

Estos se completan posteriormente desde sus módulos respectivos.

Esto garantiza simplicidad y evita inferencias incorrectas en la carga inicial.

---

# **5. Integridad garantizada**

El sistema asegura:

* No se crean ubicaciones inexistentes con descripciones duplicadas.
* No se crean artículos con conflictos de placa o serial.
* No se importan estados o disponibilidades inválidos.
* Cada ítem queda completamente asociado a:

  * Artículo
  * Sede
  * Ubicación
  * Responsable

---

# **6. Coherencia con Partes 1 y 2**

Esta Parte 3 encaja perfectamente con:

* **Tabla de inventario general**
* **Reglas de placa y serial**
* **Movimientos de inventario**
* **Modalidades de edición en lote y puntual** (luego de la importación)
* **Roles y permisos** (Responsable con rol base)
* **Catálogos editables** (tipo inventario, categorías, tipos de ubicación)
* **Vistas por artículo, sede, responsable**
* **Consistencia de ubicaciones y sedes**

---

Si deseas, con esto ya podemos avanzar a la **Parte 4**, que debería cubrir:

* **Exportación de inventario**
* **Reportes e informes**
* **Plantillas y formatos imprimibles**
* **Flujos de auditoría**

O bien podemos complementar algo más en la importación si deseas.
