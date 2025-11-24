# Peticiones

## No se muestran los estados físicos disponibles al abrir la acción "Editar"
![alt text](image-21.png)

Este elemento tiene el estado físico "Sin estado", el cual creo que no se espera desde el backend o no lo tiene predeterminado el modelo de Django...consulta bien y resuelve para que todos esos filtros en todos los campos de la tabla se muestren con base en los datos reales, y no en datos harcodeados o datos que se esperen a partir de un enum. Por favor mira cómo se trabaja el filtro de ese mismo campo pero desde la cabecera de la tabla, para que se aplique ese mismo comportamiento en el modal que se abre cuando se le da a la acción "Editar"
![alt text](image-22.png)

## Incluir el campo responsable por defecto de la ubicación del backend en el excel que se importa y exporta
![alt text](image-20.png)
![alt text](image-23.png)

## Tabla con ítems detallados debe mostrar número de registros
![alt text](image-19.png)



## Contexto rápido de documentación
Ten presente que Claude Code CLI ya hizo la implementación inicial del sistema de inventario, con base en la documentación que está en la carpeta docs. Sin embargo, en el camino me di cuenta de requrimientos que no atendió como yo los pedí exactamente, y que, de otro lado, habían formas de hacer diferentes cosas de mejor manera, razón por la cual seguí la tarea con cursor, y ya tomando como archivo de entrada este de acá (CLAUDE.md). A partir de aquí se ha ido puliendo el sistema, y se han generado las respectivas documentaciones en la raíz del proyecto. Ten en cuenta también que el archivo llamado "ESTANDARES.md" dentro de la carpeta docs sigue en vigencia, con el ánimo de mantener el código fácilmente mantenible, legible, modular, escalable y robusta, ofreciendo además, una excelente experiencia al usuario final.


