# Get Template by ID

Get template by template ID.

**URL** : `/api/templates/:id`

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Responses

**Condition** : Template exists and User is authorized to view this template.

**Code** : `200 OK`

**Content** : 

```json

```

## Error Responses

**Condition** : If current logged in User is not authorized to view the template.

**Code** : `401 UNAUTHORIZED`

**Content** : 

```json
{
    "error": "Unauthorized request"
}
```

### Or

**Condition** : If template does not exist.

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "error": {
        "message": "Template doesn't exist"
    }
}
```
