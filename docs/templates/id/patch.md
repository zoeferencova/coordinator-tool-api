# Update Template

Update the template by ID.

**URL** : `/api/templates/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the template.

**Method** : `PATCH`

**Auth required** : YES

**Data constraints**

* Required fields: `template_name`, `template_subject` and `template_content`

```json
{
    "template_name": "[template name in plain text]",
    "template_subject": "[template subject in plain text]",
    "template_content": "[template content in plain text]"
}
```

**Data example**

```json
{
    "template_name": "Example Template",
    "template_subject": "Example Subject",
    "template_content": "Example Content"
}
```

## Success Response

**Condition** : If everything is OK and all required fields are provided.

**Code** : `204 NO RESPONSE`

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

**Condition** : If the provided field is not relevant.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": {
        "message": "Request body must contain either 'template_name', 'template_subject' or 'template_content'"
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
