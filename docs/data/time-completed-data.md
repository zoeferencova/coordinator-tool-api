# Get Time Completed Data

Get data on the time between the creation and completion of all list items that are completed from the start of the week for the current User.

**URL** : `/api/data/time-completed-data/`

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
            "difference": {
                "hours": 7,
                "minutes": 15,
                "seconds": 13,
                "milliseconds": 488.86
            }
        },
        {
            "difference": {
                "minutes": 24,
                "seconds": 26,
                "milliseconds": 29.402
            }
        },
        {
            "difference": {
                "hours": 16,
                "minutes": 20,
                "seconds": 32,
                "milliseconds": 254.67
            }
        },
        {
            "difference": {
                "hours": 15,
                "minutes": 57,
                "seconds": 6,
                "milliseconds": 544.732
            }
        }
    ]
]
```
