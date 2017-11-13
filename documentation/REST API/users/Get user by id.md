# Find user by id

It finds the user by givenId in the database.

## URL

/api/users/<userId>

## Method

GET

## Url params

userId

## Data Params

None

## Success response

- Code: 200
- Content:
```
{
    "user": {
        "hash":String,
        "salt":String,
        "_id": String,
        "name": String,
        "surname": String,
        "email": String,
        "role": String,
        "_v":Number
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