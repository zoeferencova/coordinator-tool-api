# Get User's Templates

Get all template data associated with the User whose Token is provided with the request.

**URL** : `/api/templates`

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
        "id": 19,
        "user_id": 5,
        "template_name": "Demo Template",
        "template_subject": "Demo Template Subject",
        "template_content": "Dear [CONTACT],\n\nI am writing to confirm your participation in the new project on [PROJECT] that my colleague [PM] reached out about.\n\nThank you.\n\nBest,\nDemo"
    },
    {
        "id": 20,
        "user_id": 5,
        "template_name": "New Template",
        "template_subject": "Availability",
        "template_content": "Hi [CONTACT],\n\nI am working with my colleague [PM] to arrange the new project on [PROJECT]. Could you please let me know on your updated availability for this week?\n\nThank you.\n\nBest Regards,\nDemo"
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
