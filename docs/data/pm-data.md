# Get PM Data

Get data on number of list items per PM for the current User.

**URL** : `/api/data/pm-data/`

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
