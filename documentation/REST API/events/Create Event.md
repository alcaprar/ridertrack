# Create event

It creates the event.

## URL

/api/events/

## Method

POST

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
        // all event details
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