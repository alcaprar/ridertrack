# Find enrollment by eventId and userId

It deletes the enrollment in database.

## URL

/api/enrollments/:eventId/:userId

## Method

DELETE

## Url params

- userId
- eventId

## Data Params

None

## Success response

- Code: 200
- Content:
```
{
    "message": "Enrollment successfully deleted"
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