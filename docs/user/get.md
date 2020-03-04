# Get User's User Information

Get all user information data associated with the User whose Token is provided with the request.

**URL** : `/api/users`

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Responses

**Condition** : Valid Authorization Token is provided with the request.

**Code** : `200 OK`

**Content** : 

```json
{
    "full_name": "Demo User",
    "email": "demoaccount@demo.com"
}
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
