## Register and login with facebook

It redirects to facebook page and waits for the response.
If the facebook login is successful it returns a jwt token otherwise the error.

Important: there is only one endpoint for login and registration with facebook.

### URL

/api/auth/register/facebook

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
