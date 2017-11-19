# Get events

It returns a list of events.
It accepts also some query params for filtering,

## URL

/api/events

## Method

GET

## Url params

None

## Data Params

Query params:
- Name
- Type
- Country
- City

## Success response

- Code: 200
- Content:
```
{
    "events": [{
        // event detail
    }]
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