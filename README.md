## Pastebin-Lite Backend (Server)

```npm install```
```npm run dev```

**The server runs on http://localhost:5000.**
Ensure MongoDB is running and .env contains MONGO_URI

**Persistence layer**
MongoDB is used as the persistence layer via Mongoose. Each paste is stored as a document, using MongoDB’s ObjectId as the paste identifier

**Design decisions**
- Separate backend to keep API reusable and scalable
- Manual TTL and view-count enforcement to support deterministic testing
- Atomic view counting to avoid serving pastes beyond limits
- Deterministic time support via TEST_MODE for reliable expiry tests
