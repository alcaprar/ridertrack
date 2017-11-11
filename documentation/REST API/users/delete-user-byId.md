# Find user by email

It deletes the user in database by passed id in URI.

## URL

/api/users/:_id

## Method

DELETE

## Url params

"_id":String

## Data Params

## Success response

- Code: 200
- Content:
```
{
    "status": String,
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