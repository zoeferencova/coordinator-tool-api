# Login

Used to collect a Token for a registered User.

**URL** : `/api/auth/login/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "email": "[valid email address]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "email": "example@example.com",
    "password": "Abcd123!"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "authToken": "93144b288eb1fdccbe46d6fc0f241a51766ecd3d"
}
```

## Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "error": "Incorrect email or password"
}
```
