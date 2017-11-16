# Update event by id

It updates the event by the given id in the database.

## URL

/api/events/<eventId>

## Method

PUT

## Url params

eventId

## Data Params

"event" :
{
    "name":String,
    "organizerId":String,
    "type":String,
    "description":String,
    "country":String,
    "city":String,
    "startingTime":Date,
    "maxDuration":Number,
    "enrollmentOpeningAt":Date,
    "enrollmentClosingAt":Date,
    "participantsList":[Number],
    "logo":String,
    "routes":[String]
}

## Success response

- Code: 200
- Content:
```
{
    "event": {
        // event detail updated
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