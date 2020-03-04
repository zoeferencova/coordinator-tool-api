# Delete User's Template

Delete a template by ID.

**URL** : `/api/templates/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the template to be deleted.

**Method** : `DELETE`

**Auth required** : YES

**Data** : `{}`

## Success Response

**Condition** : If the template exists.

**Code** : `204 NO CONTENT`

**Content** : `{}`

## Error Responses

**Condition** : If there is no template with the supplied ID.

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "error": {
        "message": "Template doesn't exist"
    }
}
```

### OR

**Condition** : If there is no Authorization Token provided with the request.

**Code** : `401 UNAUTHORIZED`

**Content**

```json
{
    "error": "Missing bearer token"
}
```

### OR

**Condition** : If the provided Authorization Token is not valid.

**Code** : `401 UNAUTHORIZED`

**Content**

```json
{
    "error": "Unauthorized request"
}
```
