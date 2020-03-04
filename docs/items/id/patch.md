# Update List Item

Update the list item of the Authenticated User by ID.

**URL** : `/api/list/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the list item.

**Method** : `PATCH`

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

**Code** : `204 NO RESPONSE`

## Error Responses

**Condition** : If one of the required fields is missing.

**Code** : `400 BAD REQUEST`

**Content example**

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
