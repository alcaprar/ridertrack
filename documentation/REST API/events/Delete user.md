# Delete event by id

It deletes the event by the given id in the database.

## URL

/api/events/<eventId>

## Method

DELETE

## Url params

eventId

## Data Params

-

## Success response

- Code: 200
- Content:
```
{
    "event": {
        // event successfully deleted
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

- Code: 401
- Content:
{
    "errors":Unauthorized
}
}
```