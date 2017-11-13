# Find user by email

It deletes the user in database.

## URL

/api/users/:userId

## Method

DELETE

## Url params

userId

## Data Params

None

## Success response

- Code: 200
- Content: 
```
{
    "message": "User successfully deleted"
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