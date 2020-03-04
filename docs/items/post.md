# Create List Item

Create a list item for the User whose Token is provided with the request.

**URL** : `/api/list/`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

* Required fields: `project`, `contact`, and `pm_id`
* Optional fields: `project_url`, `contact_url`, and `notes`

```json
{
    "project": "[project name in plain text]",
    "project_url": "[project url in plain text]",
    "contact": "[contact name in plain text]",
    "contact_url": "[contact url in plain text]",
    "pm_id": "[pm_id as number]",
    "notes": "[notes in plain text]"
}
```

**Data example**

```json
{
	  "project": "Example",
	  "contact": "Example",
	  "pm_id": 23
}
```

## Success Response

**Condition** : If everything is OK and all required fields are provided.

**Code** : `201 CREATED`

**Content example**

```json
{
    "id": 1,
    "status": "none",
    "project": "Example",
    "project_url": "",
    "contact": "Example",
    "contact_url": "",
    "date_created": "2020-03-04T16:46:09.769Z",
    "notes": "",
    "pm_name": "John",
    "pm_email": "john@demo.com"
}
```

## Error Responses

**Condition** : If one of the required fields is missing.

**Code** : `400 BAD REQUEST`

**Content Example**

```json
{
    "error": {
        "message": "Missing 'pm_id' in request body"
    }
}
```

### OR

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
