# Get Completed Timespan Data

Get data on number of items that are completed within various timespans for the current User.

**URL** : `/api/data/completed-timespan-data/`

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
            "days_Today": "5"
        }
    ],
    [
        {
            "weeks_This Week": "19"
        }
    ],
    [
        {
            "months_This Month": "45"
        }
    ],
    [
        {
            "days_Mar 2": "1"
        }
    ],
    [
        {
            "days_Mar 1": "5"
        }
    ],
    [
        {
            "days_Feb 29": "3"
        }
    ],
    [
        {
            "days_Feb 28": "0"
        }
    ],
    [
        {
            "days_Feb 27": "5"
        }
    ],
    [
        {
            "days_Feb 26": "0"
        }
    ],
    [
        {
            "weeks_Feb 23 - Mar 1": "17"
        }
    ],
    [
        {
            "weeks_Feb 16 - Feb 23": "22"
        }
    ],
    [
        {
            "weeks_Feb 9 - Feb 16": "27"
        }
    ],
    [
        {
            "months_February": "105"
        }
    ],
    [
        {
            "months_January": "133"
        }
    ],
    [
        {
            "months_December": "79"
        }
    ],
    [
        {
            "months_November": "88"
        }
    ],
    [
        {
            "months_October": "94"
        }
    ]
]
```
