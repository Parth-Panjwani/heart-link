# MongoDB Setup Guide

## Quick Start

1. **Install Backend Dependencies**

   ```bash
   npm install express mongoose cors dotenv
   ```

2. **Create `.env` file** in the root directory:

   ```env
   MONGODB_URI=mongodb+srv://nidhipanjwani:nidhi%40189@nidhi.wlb4xkj.mongodb.net/heart-link?retryWrites=true&w=majority
   PORT=3001
   VITE_API_URL=http://localhost:3001/api
   ```

   **Note:** The password `nidhi@189` is URL encoded as `nidhi%40189` (where `%40` represents `@`)

3. **Start the Backend Server**

   ```bash
   npm run server
   ```

   Or start both frontend and backend together:

   ```bash
   npm install concurrently  # First time only
   npm run dev:full
   ```

4. **Start the Frontend** (in a separate terminal if not using dev:full)
   ```bash
   npm run dev
   ```

## Database Collections

The server automatically creates the following collections in MongoDB:

- **events** - Countdown events/moments with sentiment categories
- **journeys** - Journey information (departure date, distance, heart message)
- **messages** - Heart messages between users
- **todos** - Todo items with due dates, priorities, and categories

## API Endpoints

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Journey

- `GET /api/journey` - Get journey data
- `PUT /api/journey` - Update journey data

### Messages

- `GET /api/messages` - Get all messages
- `GET /api/messages/:id` - Get message by ID
- `POST /api/messages` - Create new message
- `PUT /api/messages/:id` - Update message
- `DELETE /api/messages/:id` - Delete message

### Todos

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## Data Models

### Event

```typescript
{
  id: string;
  emoji: string;
  title: string;
  targetDate: string; // ISO date string
  sentiment?: 'far-from-home' | 'together-soon' | 'special-occasion' | 'milestone' | 'celebration' | 'reunion';
  createdAt: string;
  updatedAt: string;
}
```

### Message

```typescript
{
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  status?: 'sent' | 'delivered' | 'read';
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Todo

```typescript
{
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Troubleshooting

### Connection Issues

- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` for development
- Check that the password is correctly URL encoded in the connection string
- Verify the database name in the connection string matches your cluster

### Port Already in Use

- Change `PORT` in `.env` if 3001 is already in use
- Update `VITE_API_URL` accordingly

### CORS Issues

- The server includes CORS middleware to allow frontend requests
- Ensure the frontend is running on the correct port (default: 5173 for Vite)
