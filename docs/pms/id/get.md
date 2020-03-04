# Get PM by ID

Get PM by PM ID.

**URL** : `/api/pms/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the list item to be deleted.

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Responses

**Condition** : PM exists and User is authorized to view this PM.

**Code** : `200 OK`

**Content** : 

```json
{
    "id": 1,
    "user_id": 1,
    "pm_name": "Jane",
    "pm_email": "jane@example.com"
}
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
