# Get User's PMs

Get all PM data associated with the User whose Token is provided with the request.

**URL** : `/api/pms`

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Responses

**Condition** : Valid Authorization Token is provided with the request.

**Code** : `200 OK`

**Content** : 

```json
[
    {
        "id": 23,
        "user_id": 5,
        "pm_name": "John",
        "pm_email": "john@demo.com"
    },
    {
        "id": 24,
        "user_id": 5,
        "pm_name": "Jane",
        "pm_email": "jane@demo.com"
    },
    {
        "id": 25,
        "user_id": 5,
        "pm_name": "Anna",
        "pm_email": "anna@demo.com"
    }
]
```

## Error Responses

**Condition** : If there is no Authorization Token provided with the request.

**Code** : `401 UNAUTHORIZED`

**Content** : 

```json
{
    "error": "Missing bearer token"
}
```
### OR

**Condition** : If the provided Authorization Token is not valid.

**Code** : `401 UNAUTHORIZED`

**Content** : 

```json
{
    "error": "Unauthorized request"
}
```
