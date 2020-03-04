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
    {
        "pm_id": 1,
        "pm_name": "Jane",
        "count": "40"
    },
    {
        "pm_id": 2,
        "pm_name": "Jack",
        "count": "100"
    },
    {
        "pm_id": 3,
        "pm_name": "John",
        "count": "133"
    }
]
```
