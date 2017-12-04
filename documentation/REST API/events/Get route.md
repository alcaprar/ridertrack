# Get route

It gets route for event.

## URL

/api/events/<eventId>/route

## Method

GET

## Url params

eventId


## Success response

- Code: 200
- Content:
```
{
    "coordinates":[{
		lat:Number,
		lon:Number
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