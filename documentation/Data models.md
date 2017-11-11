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
    "name" : String,
    "type": String,
    "description": String,
    "country": String,
    "city": String,
    "startingTime": Date,
    "estimatedDuration": Number,  // number of minutes??
    "maxParticipants": Number,
    "organizerId": Number,
    "enrollmentOpeningAt": Date,
    "enrollmentClosingAt": Date,
    "participantsList": [userId]
    "logo": String,
    "route": [Coordinates],
    "created_at": Date,
    "updated_at": Date
}
```
Note:
- Type is like: marathon, cycling...
- Logo: URL of the image.
- Route: Ordered list of coordinates.

### Enrollment

```
{
    "eventId": Number,
    "userId": Number,
    "additionalInfo": Object,
    "trackingSources" [TrackingSource]
    "created_at": Date,
    "updated_at": Date
}
```

Index: (eventId, userId)

### Tracking source

### Tracking data

```
{
    "eventId": Number,
    "userId": Number,
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
    "eventId": Number,
    "senderUserId": Number,
    "recipientUserId": Number,
    "message": String,
    "read": Boolean
}
```

Note:
- senderUserId can be null if the message is sent by a guest. 
