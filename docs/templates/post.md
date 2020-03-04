# Create Template

Create a template for the User whose Token is provided with the request.

**URL** : `/api/templates/`

**Method** : `POST`

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

**Code** : `201 CREATED`

**Content example**

```json
{
    "id": 25,
    "user_id": 5,
    "template_name": "Example Template",
    "template_subject": "Example Subject",
    "template_content": "Example Content"
}
```

## Error Responses

**Condition** : If one of the required fields is missing.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": {
        "message": "Missing 'template_content' in request body"
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
