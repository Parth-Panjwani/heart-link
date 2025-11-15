# MongoDB Integration Setup

## Quick Setup Instructions

### 1. Install Backend Dependencies

```bash
npm install express mongoose cors dotenv
```

### 2. Create `.env` File

Create a `.env` file in the root directory with the following content:

```env
MONGODB_URI=mongodb+srv://nidhipanjwani:nidhi%40189@nidhi.wlb4xkj.mongodb.net/heart-link?retryWrites=true&w=majority
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

**Important:** The password `nidhi@189` must be URL encoded as `nidhi%40189` (where `%40` represents `@`)

### 3. Start the Backend Server

```bash
npm run server
```

You should see:

```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3001
📡 API endpoints available at http://localhost:3001/api
```

### 4. Start the Frontend (in a separate terminal)

```bash
npm run dev
```

### Alternative: Run Both Together

If you want to run both frontend and backend together:

```bash
npm install concurrently  # First time only
npm run dev:full
```

## Database Collections

The server automatically creates these collections in MongoDB:

- **events** - Countdown events/moments with sentiment categories
- **journeys** - Journey information
- **messages** - Heart messages between users
- **todos** - Todo items with due dates, priorities, categories

## API Endpoints

All endpoints are prefixed with `/api`:

- **Events:** `/api/events` (GET, POST, PUT, DELETE)
- **Journey:** `/api/journey` (GET, PUT)
- **Messages:** `/api/messages` (GET, POST, PUT, DELETE)
- **Todos:** `/api/todos` (GET, POST, PUT, DELETE)

## Troubleshooting

### MongoDB Connection Error

- Check that your MongoDB Atlas cluster is running
- Verify IP whitelist includes `0.0.0.0/0` for development
- Ensure password is correctly URL encoded (`@` → `%40`)

### Port Already in Use

- Change `PORT=3001` in `.env` to a different port
- Update `VITE_API_URL` accordingly

### Module Import Errors

If you get ES module errors, the server.js file may need to be renamed to `server.cjs` or you can install dependencies as shown above.

## Testing the Connection

Once the server is running, test it:

```bash
curl http://localhost:3001/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`
