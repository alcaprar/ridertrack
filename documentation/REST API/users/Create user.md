# Create user

It stores the given user in the database.
Have a look also to "Register user". It does the same of this endpoint but it also returns immediately a valid jwt token.

## URL

/api/users

## Method

POST

## Url params

None

## Data Params
```
{
    "name": String,
    "surname": String,
    "email": String,
    "password": String
}
```
## Success response
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
    }
}
```

## Error response
- Code: 400
- Content:
```
{
    "errors": [error]
}
```