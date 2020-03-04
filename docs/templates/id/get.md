# Get Template by ID

Get template by template ID.

**URL** : `/api/templates/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the template.

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Responses

**Condition** : Template exists and User is authorized to view this template.

**Code** : `200 OK`

**Content** : 

```json
{
    "id": 20,
    "user_id": 5,
    "template_name": "New Template",
    "template_subject": "Availability",
    "template_content": "Hi [CONTACT],\n\nI am working with my colleague [PM] to arrange the new project on [PROJECT]. Could you please let me know on your updated availability for this week?\n\nThank you.\n\nBest Regards,\nDemo"
}
```

## Error Responses

**Condition** : If current logged in User is not authorized to view the template.

**Code** : `401 UNAUTHORIZED`

**Content** : 

```json
{
    "error": "Unauthorized request"
}
```

### Or

**Condition** : If template does not exist.

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "error": {
        "message": "Template doesn't exist"
    }
}
```
