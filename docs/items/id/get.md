# Get List Item by ID

Get list item by list item ID.

**URL** : `/api/list/:id`

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Responses

**Condition** : List item exists.

**Code** : `200 OK`

**Content** : 

```json

```

## Error Responses

**Condition** : If current logged in User is not authorized to view the list item.

**Code** : `401 UNAUTHORIZED`

**Content** : 

```json
{
    "error": "Unauthorized request"
}
```

### Or

**Condition** : If list item does not exist

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "error": {
        "message": "Item doesn't exist"
    }
}
```
