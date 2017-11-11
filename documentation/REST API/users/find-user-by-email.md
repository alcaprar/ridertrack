# Find user by email

It finds the user by given email in the database.

## URL

/api/users/user/example@gmail.com

## Method

GET

## Url params

e-mail address(example@gmail.com)

## Data Params

## Success response

- Code: 200
- Content:
```
{

    "user": {
        ""
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