## Professional Chat – Implementation Plan (Comprehensive)

This document lists the exact files to create/modify, required dependencies, data model, APIs, realtime design, security, rollout, and testing for a real‑time user ↔ professional chat.

### Dependencies (and maintenance status)
- Server
  - socket.io (^4.x): actively maintained; standard for realtime in Node
  - uuid (^9.x): maintained; robust IDs for attachments/temp refs
  - multer (^1.4.x) or busboy (if streaming): maintained; simple file uploads
  - sanitize-html (^2.x): maintained; sanitize user text if rendering HTML
- Client
  - socket.io-client (^4.x): maintained, pairs with socket.io
  - dayjs (^1.x): maintained, lightweight date formatting

Pin versions in package.json and audit (`npm audit`) before deploy.

### Data model (MongoDB)
- server/src/models/Conversation.js (new)
  - Fields: status ('open'|'assigned'|'closed'), userId, assignedTo (ObjectId|null), lastMessageAt (Date), unreadCounts { user: Number, professional: Number }, metadata { topic, priority }, timestamps
  - Indexes: { userId, status, lastMessageAt }, { assignedTo, status, lastMessageAt }
- server/src/models/Message.js (new)
  - Fields: conversationId, senderId, senderRole ('user'|'professional'), text, attachments [{ url, name, type, size }], readBy [ObjectId], createdAt/updatedAt
  - Indexes: { conversationId, createdAt }, { conversationId, _id }

### REST API (bootstrap, pagination, admin actions)
- server/src/routes/chat.routes.js (new)
  - POST /api/chat/conversations – create/open conversation (user)
  - GET /api/chat/conversations – list conversations (scope=user|professional, status, cursor)
  - GET /api/chat/conversations/:id – get conversation meta (authz)
  - GET /api/chat/conversations/:id/messages – list messages (cursor/pageSize)
  - POST /api/chat/conversations/:id/assign – claim (professional)
  - POST /api/chat/conversations/:id/close – close (professional)
  - POST /api/chat/upload – attachment upload (returns {url, name, type, size})
- server/src/controllers/chat.controller.js (new)
  - Implement handlers with auth/role checks; maintain unreadCounts and lastMessageAt

### Realtime (Socket.IO)
- server/src/realtime/socket.js (new)
  - Setup Socket.IO on the HTTP server
  - On connection: verify JWT from cookie; attach socket.user { id, role }
  - Rooms: `conversation:<id>`, `user:<userId>`, `professionals`
  - Events (client→server):
    - conversation:join { conversationId }
    - message:send { conversationId, text, attachments? }
    - typing { conversationId, isTyping }
    - read:mark { conversationId, messageIds }
    - conversation:claim { conversationId } (professional)
    - conversation:close { conversationId } (professional)
  - Events (server→client):
    - message:new { message }
    - typing { who, isTyping }
    - read:receipts { messageIds, readerId }
    - conversation:assigned { conversationId, assignedTo }
    - conversation:closed { conversationId }
    - queue:update (to professionals)
  - Server‑side guards: validate membership/roles for every event; rate‑limit message:send

### Server wiring
- server/src/index.js (modify)
  - Create HTTP server from Express app and pass to Socket.IO initializer
  - Export io if needed for controllers to emit
- server/src/app.js (no change to existing middleware order; keep helmet/CORS/CSRF)

### Client integration
- client/src/lib/socket.js (new)
  - Export a singleton socket.io-client instance; connect with credentials; auto‑reconnect
- client/src/pages/chat/ChatPage.jsx (modify)
  - Add a “Professional” tab real‑time flow (we’ll keep the existing AI tab)
  - Join/leave `conversation:<id>` room; handle message:new, typing, read receipts
  - Composer: send text/attachments; show typing indicator
  - Pagination: fetch older messages via REST when scrolling up
- client/src/pages/admin/supportChat/AdminSupportChat.jsx (enhance)
  - Queue (unassigned), Assigned (mine), All (team)
  - Claim/close actions; live updates via socket `queue:update` and `conversation:assigned`
- client/src/components/chat/
  - ConversationList.jsx (new)
  - ConversationItem.jsx (new)
  - MessageList.jsx (new)
  - MessageComposer.jsx (new, with upload)
  - TypingIndicator.jsx (new)

### Security & abuse protections
- Authorization
  - authenticate (already); authorize('atLeast:staff') for pro/admin endpoints/events
  - Verify conversation membership (user or assigned professional) per event and REST
- Rate limits
  - REST: reuse existing rate limiters; add `/api/chat/upload` limiter
  - Socket: implement per‑user cooldown for `message:send` (e.g., 10 messages/10s)
- Sanitization
  - Sanitize text inputs server‑side (strip HTML or escape); render safely in client
- Attachments
  - Validate mime/type and size; optionally run antivirus (if infra allows)
  - If storing locally, serve from a dedicated static route; if S3, use signed URLs

### Indexes & performance
- Conversations: compound index by (assignedTo, status, lastMessageAt) and (userId, status)
- Messages: (conversationId, createdAt)
- Paginate messages using createdAt or _id cursors

### Rollout plan (phased)
1) Phase 1 (MVP)
   - Models (Conversation, Message), chat REST bootstrap
   - Socket.IO server with auth and rooms
   - User Professional chat tab: send/receive, typing, read receipts, unread counts
   - Professional queue + assigned view with manual claim
2) Phase 2
   - Attachments upload, close/reopen, reassign by admin
   - Filters/search; email fallback when user offline
3) Phase 3 (optional)
   - Auto‑assignment; moderation tools; analytics; push notifications

### Testing checklist
- Unit: permissions/membership checks, unread counters, assignment
- Integration: create convo → send/receive → claim → read → close → reassign
- E2E: socket connect/reconnect; pagination; upload; role restrictions

### Files to create/modify (summary)
- Create
  - server/src/models/Conversation.js
  - server/src/models/Message.js
  - server/src/routes/chat.routes.js
  - server/src/controllers/chat.controller.js
  - server/src/realtime/socket.js
  - server/src/services/upload.service.js (if using local uploads)
  - client/src/lib/socket.js
  - client/src/components/chat/ConversationList.jsx
  - client/src/components/chat/ConversationItem.jsx
  - client/src/components/chat/MessageList.jsx
  - client/src/components/chat/MessageComposer.jsx
  - client/src/components/chat/TypingIndicator.jsx
- Modify
  - server/src/index.js (wire Socket.IO)
  - server/src/app.js (ensure no conflict; keep security middleware)
  - client/src/pages/chat/ChatPage.jsx (integrate realtime Professional tab)
  - client/src/pages/admin/supportChat/AdminSupportChat.jsx (enhance pro UI)

### Notes on maintenance
- socket.io and socket.io‑client are actively maintained and widely used in production
- multer remains standard for simple uploads; busboy is an alternative for streaming
- Keep versions pinned and review changelogs before major upgrades

---

If you want, we can start with Phase 1: I’ll scaffold the models, routes, and Socket.IO server, then hook up the user UI tab to realtime messaging.


