# Create PM

Create a PM for the User whose Token is provided with the request.

**URL** : `/api/pms/`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

* Required fields: `pm_name` and `pm_email`

```json
{
    "pm_name": "[pm name in plain text]",
    "pm_email": "[pm email in plain text]"
}
```

**Data example**

```json
{
    "pm_name": "Example",
    "pm_email": "example@pm.com"
}
```

## Success Response

**Condition** : If everything is OK and all required fields are provided.

**Code** : `201 CREATED`

**Content example**

```json
{
    "id": 41,
    "user_id": 5,
    "pm_name": "Example",
    "pm_email": "example@pm.com"
}
```

## Error Responses

**Condition** : If one of the required fields is missing.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": {
        "message": "Missing 'pm_email' in request body"
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
