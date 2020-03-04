# Get All User Data

Get all data (list item, PM, template, completed list item, and user information) associated with the User whose Token is provided with the request.

**URL** : `/api/user-data`

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Responses

**Condition** : Valid Authorization Token is provided with the request.

**Code** : `200 OK`

**Content** : 

```json
[
    [
        {
            "id": 247,
            "status": "none",
            "project": "Demo Project",
            "project_url": "https://www.example.com",
            "contact": "Jack Demo",
            "contact_url": "",
            "date_created": "2020-02-29T18:38:37.582Z",
            "notes": "Project notes",
            "pm_name": "Jane",
            "pm_email": "jane@demo.com"
        },
        {
            "id": 249,
            "status": "reached",
            "project": "New Project",
            "project_url": "https://www.example.com",
            "contact": "John Terry",
            "contact_url": "",
            "date_created": "2020-02-29T18:39:31.370Z",
            "notes": "",
            "pm_name": "Anna",
            "pm_email": "anna@demo.com"
        }
    ],
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
        }
    ],
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
    ],
    [
        {
            "id": 250,
            "status": "completed",
            "project": "New Sample Project",
            "project_url": "https://www.google.com",
            "contact": "Frank Lampard",
            "contact_url": "",
            "date_created": "2020-02-29T18:40:07.764Z",
            "date_completed": "2020-03-03T23:03:00.252Z",
            "notes": "",
            "pm_name": "Jack",
            "pm_email": "jack@demo.com"
        },
        {
            "id": 253,
            "status": "completed",
            "project": "Project",
            "project_url": "https://www.google.com",
            "contact": "David Luiz",
            "contact_url": "",
            "date_created": "2020-02-29T18:41:07.726Z",
            "date_completed": "2020-03-03T23:02:57.321Z",
            "notes": "",
            "pm_name": "Anna",
            "pm_email": "anna@demo.com"
        }
    ],
    {
        "full_name": "Demo User",
        "email": "demoaccount@demo.com"
    }
]
```

## Error Responses

**Condition** : If there is no Authorization Token provided with the request or if the Token is invalid.

**Code** : `401 UNAUTHORIZED`

**Content** : 

```json
{
    "error": "Missing bearer token"
}
```
