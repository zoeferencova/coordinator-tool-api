# Delete User's List Item

Delete a list item by ID.

**URL** : `/api/list/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the list item to be deleted.

**Method** : `DELETE`

**Auth required** : YES

**Data** : `{}`

## Success Response

**Condition** : If the list item exists.

**Code** : `204 NO CONTENT`

**Content** : `{}`

## Error Responses

**Condition** : If there is no list item with the supplied ID.

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "error": {
        "message": "Item doesn't exist"
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
