# Delete route

It deletes route for event.

## URL

/api/events/<eventId>/route

## Method

DELETE

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