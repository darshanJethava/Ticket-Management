# Support Ticket Management API

Base URL: http://localhost:3000

## Auth

### POST /auth/login
Request:
```json
{
  "email": "manager@example.com",
  "password": "password123"
}
```
Response 200:
```json
{
  "message": "Login successful",
  "token": "<jwt>"
}
```

## Users (MANAGER only)

### POST /users
Headers:
```
Authorization: Bearer <jwt>
```
Request:
```json
{
  "name": "New Support",
  "email": "newsupport@example.com",
  "password": "password123",
  "role": "support"
}
```
Response 201:
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "name": "New Support",
    "email": "newsupport@example.com",
    "role": {
      "_id": "...",
      "name": "support"
    },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### GET /users
Headers:
```
Authorization: Bearer <jwt>
```
Response 200:
```json
{
  "message": "Users retrieved successfully",
  "count": 2,
  "users": [
    {
      "_id": "...",
      "name": "Manager User",
      "email": "manager@example.com",
      "role": {
        "_id": "...",
        "name": "manager"
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

## Tickets

### POST /tickets (USER, MANAGER)
Headers:
```
Authorization: Bearer <jwt>
```
Request:
```json
{
  "title": "Login issue",
  "description": "Login page shows blank screen",
  "priority": "HIGH"
}
```
Response 201:
```json
{
  "message": "Ticket created successfully",
  "ticket": {
    "_id": "...",
    "title": "Login issue",
    "description": "Login page shows blank screen",
    "status": "OPEN",
    "priority": "HIGH",
    "created_by": {
      "_id": "...",
      "name": "Regular User",
      "email": "user@example.com"
    },
    "assigned_to": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### GET /tickets
Headers:
```
Authorization: Bearer <jwt>
```
Response 200:
```json
{
  "message": "Tickets retrieved successfully",
  "count": 1,
  "tickets": [
    {
      "_id": "...",
      "title": "Login issue",
      "description": "Login page shows blank screen",
      "status": "OPEN",
      "priority": "HIGH",
      "created_by": {
        "_id": "...",
        "name": "Regular User",
        "email": "user@example.com"
      },
      "assigned_to": null,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### GET /tickets/:id
Headers:
```
Authorization: Bearer <jwt>
```
Response 200:
```json
{
  "message": "Ticket retrieved successfully",
  "ticket": {
    "_id": "...",
    "title": "Login issue",
    "description": "Login page shows blank screen",
    "status": "OPEN",
    "priority": "HIGH",
    "created_by": {
      "_id": "...",
      "name": "Regular User",
      "email": "user@example.com"
    },
    "assigned_to": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### PUT /tickets/:id
Headers:
```
Authorization: Bearer <jwt>
```
Request:
```json
{
  "title": "Login issue updated",
  "description": "Login page shows blank screen on Chrome",
  "priority": "MEDIUM"
}
```
Response 200:
```json
{
  "message": "Ticket updated successfully",
  "ticket": {
    "_id": "...",
    "title": "Login issue updated",
    "description": "Login page shows blank screen on Chrome",
    "status": "OPEN",
    "priority": "MEDIUM",
    "created_by": {
      "_id": "...",
      "name": "Regular User",
      "email": "user@example.com"
    },
    "assigned_to": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### PATCH /tickets/:id/assign (MANAGER, SUPPORT)
Headers:
```
Authorization: Bearer <jwt>
```
Request:
```json
{
  "assignedTo": "<support_user_id>"
}
```
Response 200:
```json
{
  "message": "Ticket assigned successfully",
  "ticket": {
    "_id": "...",
    "assigned_to": {
      "_id": "...",
      "name": "Support Agent",
      "email": "support@example.com"
    }
  }
}
```

### DELETE /tickets/:id (MANAGER)
Headers:
```
Authorization: Bearer <jwt>
```
Response 204: No Content

## Comments

### POST /tickets/:id/comments
Headers:
```
Authorization: Bearer <jwt>
```
Request:
```json
{
  "content": "We are checking this now"
}
```
Response 201:
```json
{
  "message": "Comment added successfully",
  "comment": {
    "_id": "...",
    "ticket": "...",
    "user": {
      "_id": "...",
      "name": "Support Agent",
      "email": "support@example.com"
    },
    "content": "We are checking this now",
    "createdAt": "..."
  }
}
```

### GET /tickets/:id/comments
Headers:
```
Authorization: Bearer <jwt>
```
Response 200:
```json
{
  "message": "Comments retrieved successfully",
  "count": 1,
  "comments": [
    {
      "_id": "...",
      "ticket": "...",
      "user": {
        "_id": "...",
        "name": "Support Agent",
        "email": "support@example.com"
      },
      "content": "We are checking this now",
      "createdAt": "..."
    }
  ]
}
```

### PUT /tickets/comments/:commentId
Headers:
```
Authorization: Bearer <jwt>
```
Request:
```json
{
  "content": "Update: working on fix"
}
```
Response 200:
```json
{
  "message": "Comment updated successfully",
  "comment": {
    "_id": "...",
    "content": "Update: working on fix"
  }
}
```

### DELETE /tickets/comments/:commentId
Headers:
```
Authorization: Bearer <jwt>
```
Response 204: No Content
