# Airtable Setup

La página `/clases` puede leer datos desde Airtable del lado del servidor.
La sección de precios también puede leer desde otra tabla de Airtable.

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```bash
AIRTABLE_TOKEN=tu_personal_access_token
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_ID=Clases
AIRTABLE_VIEW=Grid view
AIRTABLE_PRICING_TABLE_ID=Precios
AIRTABLE_PRICING_VIEW=Grid view
```

`AIRTABLE_TABLE_ID` puede ser el nombre de la tabla o el table id.

## Campos esperados

La integración busca estos nombres de campos:

- nombre de clase: `Clase`, `Nombre`, `name` o `className`
- día: `Día`, `Dia` o `day`
- horario: `Horario`, `Hora`, `time` o `schedule`

Con esos tres campos alcanza para llenar `/clases`.

## Campos esperados para precios

La tabla de precios espera una fila por plan con estas columnas:

- nombre del plan: `Plan`, `Nombre` o `name`
- precio efectivo: `PrecioEfectivo`, `Precio`, `Valor` o `price`
- precio transferencia: `PrecioTransferencia`, `precioTransferencia` o `Transferencia`
- descripción opcional: `Descripcion`, `Descripción` o `description`

## Comportamiento

- Si faltan credenciales, la página usa datos mock.
- Si Airtable responde con error o sin registros válidos, la página usa datos mock.
- Si hay más de 100 registros, la integración pagina automáticamente.
