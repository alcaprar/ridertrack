## Register user

It stores the given user in the database and returns also immediately a valid jwt token.

### URL

/api/users/register

### Method

POST

### Url params

None

### Data Params
```
{
    "name": String,
    "surname": String,
    "email": String,
    "password": String,
    "role": ['participant', 'organizer']
}
```
### Success response
- Code: 200
- Content:
```
{
    "user": {
        "_id": String,
        "name": String,
        "surname": String,
        "email": String,
        "role": String
    },
    "jwtToken": String
}
```

### Error response
- Code: 400
- Content:
```
{
    "errors": [error]
}
```
