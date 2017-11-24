## Login user

It checks the given email and password into the database.
In case of match it creates a jwt token.

### URL

/api/auth/login

### Method

POST

### Url params

None

### Data Params
```
{
    "email": String,
    "password": String
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
    "userId": Number,
    "role": String,
    "jwtToken": String
}
```

### Error response
- Code: 400
- Content:
```
{
    "messages": [String]
}
```
