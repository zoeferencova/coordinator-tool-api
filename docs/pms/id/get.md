# Get PM by ID

Get PM by PM ID.

**URL** : `/api/pm/:id`

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Responses

**Condition** : PM exists and User is authorized to view this PM.

**Code** : `200 OK`

**Content** : 

```json

```

## Error Responses

**Condition** : If current logged in User is not authorized to view the PM.

**Code** : `401 UNAUTHORIZED`

**Content** : 

```json
{
    "error": "Unauthorized request"
}
```

### Or

**Condition** : If PM does not exist.

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "error": {
        "message": "PM doesn't exist"
    }
}
```
