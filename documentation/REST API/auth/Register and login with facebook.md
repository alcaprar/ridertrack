## Register and login with facebook

It receives the access token that the frontend got from Facebook auth and create our jwtToken.

Important: there is only one endpoint for login and registration with facebook.

### URL

/api/auth/login/facebook

### Method

GET

### Url params

access_token

### Data Params

None

### Success response
- Code: 200
- Content:
```
{
    "user": {
        "_id": String,
        "name": String,
        "surname": String,
        "email": String
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
