# Find user by email

It returns a list of users.
You can also specify parameters to filter. (order and paginate soon) 

## URL

/api/users

## Method

GET

## Url params

None

## Data Params

It accepts 3 query params for filtering:
- email
- name
- surname

## Success response

- Code: 200
- Content:
```
{
    "users": [{
        "hash":String,
        "salt":String,
        "_id": String,
        "name": String,
        "surname": String,
        "email": String,
        "role": String,
        "_v":Number
    },
    ...
    ]    
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