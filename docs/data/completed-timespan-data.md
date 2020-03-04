# Get Completed Timespan Data

Get data on timespan taken to complete list items if current User has access permissions to it.

**URL** : `/api/data/completed-timespan-data/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : NO

**Data**: `{}`

## Success Response

**Code** : `200 OK`

**Content example**

```
{
    [
        [
            {
                "days_Today": "0"
            }
        ],
        [
            {
                "weeks_This Week": "0"
            }
        ],
        [
            {
                "months_This Month": "0"
            }
        ],
        [
            {
                "days_Mar 2": "0"
            }
        ],
        [
            {
                "days_Mar 1": "0"
            }
        ],
        [
            {
                "days_Feb 29": "0"
            }
        ],
        [
            {
                "days_Feb 28": "0"
            }
        ],
        [
            {
                "days_Feb 27": "0"
            }
        ],
        [
            {
                "days_Feb 26": "0"
            }
        ],
        [
            {
                "weeks_Feb 23 - Mar 1": "0"
            }
        ],
        [
            {
                "weeks_Feb 16 - Feb 23": "0"
            }
        ],
        [
            {
                "weeks_Feb 9 - Feb 16": "0"
            }
        ],
        [
            {
                "months_February": "0"
            }
        ],
        [
            {
                "months_January": "0"
            }
        ],
        [
            {
                "months_December": "0"
            }
        ],
        [
            {
                "months_November": "0"
            }
        ],
        [
            {
                "months_October": "0"
            }
        ]
    ]
}
```
