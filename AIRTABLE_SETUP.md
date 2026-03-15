# Airtable Setup

La página `/clases` puede leer datos desde Airtable del lado del servidor.

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```bash
AIRTABLE_TOKEN=tu_personal_access_token
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_ID=Clases
AIRTABLE_VIEW=Grid view
```

`AIRTABLE_TABLE_ID` puede ser el nombre de la tabla o el table id.

## Campos esperados

La integración busca estos nombres de campos:

- nombre de clase: `Clase`, `Nombre`, `name` o `className`
- día: `Día`, `Dia` o `day`
- horario: `Horario`, `Hora`, `time` o `schedule`

Con esos tres campos alcanza para llenar `/clases`.

## Comportamiento

- Si faltan credenciales, la página usa datos mock.
- Si Airtable responde con error o sin registros válidos, la página usa datos mock.
- Si hay más de 100 registros, la integración pagina automáticamente.
