# My organized events

It gets all events organized by specific user

## URL

/api/users/<userId>/organizedEvents

## Method

GET

## Url params

userId

## Data Params
```
    No data params
```
## Success response
- Code: 200
- Content:
```
{
    "events":[

    ] (array of events)
}
```

## Error response
- Code: 400
- Content:
```
{
    "errors": err
}
```