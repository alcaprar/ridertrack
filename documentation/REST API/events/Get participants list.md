# Get participants list

It returns the list of the participants of the requested event.

## URL

/api/events/<eventId>/participantsList

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
    "participants": [userId,...]
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