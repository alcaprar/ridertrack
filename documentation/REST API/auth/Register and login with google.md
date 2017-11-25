## Register and login with google

It redirects to google oauth2 page and waits for the response.
If the google login is successful it returns a jwt token otherwise the error.

Important: there is only one endpoint for login and registration with google.

### URL

/api/auth/register/google

### Method

GET

### Url params

None

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
    "errors": [{
        "message": String
    }]
}
```
