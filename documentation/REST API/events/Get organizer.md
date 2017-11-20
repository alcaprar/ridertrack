# Get organizer

It finds the organizer of the even.

## URL

/api/events/<eventId>/organizer

## Method

GET

## Url params

- eventId

## Data Params

None

## Success response

- Code: 200
- Content:
```
{
    "organizer": {
        "_id": String,
        "name": String,
        "surname": String,
        "email": String,
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