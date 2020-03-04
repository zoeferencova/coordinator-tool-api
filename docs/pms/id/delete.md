# Delete User's PM

Delete a PM by ID.

**URL** : `/api/pms/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the PM to be deleted.

**Method** : `DELETE`

**Auth required** : YES

**Data** : `{}`

## Success Response

**Condition** : If the PM exists.

**Code** : `204 NO CONTENT`

**Content** : `{}`

## Error Responses

**Condition** : If there is no PM with the supplied ID.

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "error": {
        "message": "PM doesn't exist"
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

## Notes

* If a PM is deleted, all list items that correspond with this PM will be deleted as well.
