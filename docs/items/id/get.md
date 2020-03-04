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
{
    "id": 9,
    "status": "reached",
    "project": "Example Project",
    "project_url": "https://wwww.example.com",
    "contact": "Example Contact",
    "contact_url": "",
    "date_created": "2020-02-13T16:07:37.059Z",
    "notes": "Notes",
    "pm_name": "Jessica",
    "pm_email": "jessica@examplepm.com"
}
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
