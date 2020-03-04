# Get Dashboard Data

Get data on number of list items that are currently pending, created in the past week, and completed in the past week for the current User.

**URL** : `/api/data/dashboard-data/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : NO

**Data**: `{}`

## Success Response

**Code** : `200 OK`

**Content example**

```json
[
    [
        {
            "pending": "45"
        }
    ],
    [
        {
            "created": "56"
        }
    ],
    [
        {
            "completed": "28"
        }
    ]
]
```
