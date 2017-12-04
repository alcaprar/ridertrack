# Put route

It updates route for event.

## URL

/api/events/<eventId>/route

## Method

PUT

## Url params

eventId

## Data Params

"coordinates" :
[{
	lat:Number,
	lon:Number
}]

## Success response

- Code: 200
- Content:
```
{
    "coordinates":[{
		lat:Number,
		lon:Number
	}],
	"message":String
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