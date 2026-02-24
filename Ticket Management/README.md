# Support Ticket Management API

Simple backend for support tickets with JWT auth, RBAC, and comments.

## Features
- Login with JWT
- Role based access: manager, support, user
- Users: create + list (manager only)
- Tickets: create, list, view, update, assign, delete
- Comments: add, list, update, delete

## Roles
- manager: full access
- support: can work assigned tickets
- user: can create and view their own tickets

## Setup
1) Install packages
```
npm install
```

2) Create .env
```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/ticket_management?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
```

3) Seed default users/roles
```
npm run seed
```

4) Start server
```
npm start
```

## Default Users (after seed)
- manager@example.com / password123
- support@example.com / password123
- user@example.com / password123

## API Flow (quick)
1) Login -> get token
2) Use token in Authorization header
3) Create ticket -> assign -> comment

## Auth

### POST /auth/login
Request:
```json
{
	"email": "manager@example.com",
	"password": "password123"
}
```
Response:
```json
{
	"token": "<jwt>"
}
```

## Users (manager only)

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
Response:
```json
{
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
Response:
```json
{
	"users": [
		{
			"_id": "...",
			"name": "Manager User",
			"email": "manager@example.com",
			"role": {
				"_id": "...",
				"name": "manager"
			}
		}
	],
	"count": 1
}
```

## Tickets

### POST /tickets (user, manager)
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
Response:
```json
{
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
		"assigned_to": null
	}
}
```

### GET /tickets
Headers:
```
Authorization: Bearer <jwt>
```
Response:
```json
{
	"tickets": [
		{
			"_id": "...",
			"title": "Login issue",
			"status": "OPEN"
		}
	],
	"count": 1
}
```

### GET /tickets/:id
Headers:
```
Authorization: Bearer <jwt>
```
Response:
```json
{
	"ticket": {
		"_id": "...",
		"title": "Login issue",
		"status": "OPEN"
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
	"description": "Blank screen on Chrome",
	"priority": "MEDIUM"
}
```
Response:
```json
{
	"ticket": {
		"_id": "...",
		"title": "Login issue updated",
		"priority": "MEDIUM"
	}
}
```

### PATCH /tickets/:id/assign (manager, support)
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
Response:
```json
{
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

### DELETE /tickets/:id (manager)
Headers:
```
Authorization: Bearer <jwt>
```
Response: 204 No Content

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
Response:
```json
{
	"comment": {
		"_id": "...",
		"ticket": "...",
		"user": {
			"_id": "...",
			"name": "Support Agent",
			"email": "support@example.com"
		},
		"content": "We are checking this now"
	}
}
```

### GET /tickets/:id/comments
Headers:
```
Authorization: Bearer <jwt>
```
Response:
```json
{
	"comments": [
		{
			"_id": "...",
			"content": "We are checking this now"
		}
	],
	"count": 1
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
Response:
```json
{
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
Response: 204 No Content

## Validation
- title: min 5 chars
- description: min 10 chars
- priority: LOW | MEDIUM | HIGH
- tickets cannot be assigned to user role

## Status Codes
- 201 created
- 200 ok
- 204 no content
- 400 bad request
- 401 unauthorized
- 403 forbidden
- 404 not found
