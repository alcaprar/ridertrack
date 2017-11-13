# Find event by id

It finds the event by the given id in the database.

## URL

/api/events/<eventId>

## Method

GET

## Url params

eventId

## Data Params

None

## Success response

- Code: 200
- Content:
```
{
    "event": {
        // event detail
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