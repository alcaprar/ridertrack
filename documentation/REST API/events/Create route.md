# Create route

It creates the route.

## URL

/api/events/<eventId>/route

## Method

POST

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
    "coordinates": [{
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