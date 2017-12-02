# Data models

## User
```
{
    "_id": Number,
    "name": String,
    "surname": String,
    "email": String,
    "hash:" String,
    "salt": String,
    "created_at": Date,
    "updated_at": Date,
    "facebook": {
        "id": String,
        "token": String
    },
    "google": {
        "id": String,
        "token": String
    },
    "profilePicture": String
}
```

Index(email)

Note:
- Hash and salt are needed only in webserver. Password are not stored in plain text.
- Hash and salt can be empty if the user has registered with social.
- Facebook and google are needed only in webserver. They are used for social login.
- ProfilePicture is an url of the image.

## Event related data models

### Event
```
{
    "_id": Number,
    "organizerId": Number,
    "name" : String,
    "type": ['running', 'cycling', 'hiking', 'triathlon', 'other'],
    "description": String,
    "country": String,
    "city": String,
    "startingTime": Date,
    "maxDuration": Number,  // number of minutes??
    "length": Number,
    "maxParticipants": Number,
    "enrollmentOpeningAt": Date,
    "enrollmentClosingAt": Date,
    "participantsList": [userId], //redundancy
    "logo": String,
    "route": [Coordinates],
    "created_at": Date,
    "updated_at": Date
}
```
Note:
- Type is like: marathon, cycling...
- Logo: URL of the image.
- MaxDuration: after that time the race is closed.
- Route: Ordered list of coordinates.

### Enrollment

```
{
    "eventId": String,
    "userId": String,
    "additionalInfo": Object,
    "trackingSources" [TrackingSource],
    "created_at": Date,
    "updated_at": Date
}
```

Index: (eventId, userId)

### Tracking source

### Location data

```
{
    "eventId": String,
    "userId": String,
    "timestamp": Date,
    "coordinates": Coordinates
}
```

Index: (eventId, userId, timestamp)

### Coordinates

```
{
    "latitude": String,
    "longitude": String
}
```

### Messages

```
{
    "_id": Number,
    "eventId": Number,
    "nameSender": String,
    "userIdRecipient": Number,
    "message": String,
    "read": Boolean
}
```
 
