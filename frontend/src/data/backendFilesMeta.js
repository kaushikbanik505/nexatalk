// Metadata for every real file under backend/src, shown on /learn/backend.
// Keep this in sync with backend/src/*: if a file's behavior changes materially,
// update its explanation here too, and re-run `npm run docs:sync` (frontend/) to
// refresh the embedded source in generatedSource.js.

export const BACKEND_FOLDER_ORDER = ["", "controllers", "lib", "middleware", "models", "routes", "services"];

export const BACKEND_FOLDER_LABELS = {
  "": "backend/src/",
  controllers: "backend/src/controllers/",
  lib: "backend/src/lib/",
  middleware: "backend/src/middleware/",
  models: "backend/src/models/",
  routes: "backend/src/routes/",
  services: "backend/src/services/",
};

// Full literal Tailwind/daisyUI color-key strings only, never a computed template -
// see the "no ${color} templates" rule established on DeveloperPage.jsx.
export const BACKEND_FOLDER_COLORS = {
  "": "primary",
  controllers: "secondary",
  lib: "accent",
  middleware: "warning",
  models: "success",
  routes: "info",
  services: "accent",
};

export const BACKEND_FILES = [
  {
    path: "backend/src/server.js",
    folder: "",
    importance: 10,
    explanation: [
      "The entrypoint - the only file you run directly (npm run dev -> nodemon src/server.js). It loads dotenv first, builds the Express app, applies CORS scoped to CLIENT_URL (with credentials: true so the browser will actually send the httpOnly JWT cookie), express.json with a 5mb limit (raised from Express's 100kb default specifically so base64 profile-photo uploads fit), and cookie-parser so req.cookies.jwt is readable downstream. Mounts the five route modules under /api/auth, /api/users, /api/chat, /api/admin, and /api/groups.",
      "In production (NODE_ENV=production) it also serves the built frontend/dist as static files and falls back to index.html for any other path, so one Node process can serve both the API and the SPA from a single host. Locally that whole branch is skipped and Vite's own dev server handles the frontend on :5173 instead. Unlike a lot of tutorial boilerplate this file has no socket server, no cron job, and no request logger - it is deliberately this small.",
      "A sixth route module, /api/ai, was added later for the mascot's AI buddy chat - mounted the same way as the other five, no special-casing.",
    ],
  },
  {
    path: "backend/src/controllers/admin.controller.js",
    folder: "controllers",
    importance: 7,
    explanation: [
      "Six handlers behind the admin-only routes: getOverview (total users, users active in the last 2 minutes, signups and accepted friend requests in the last 24h, and a 7-day signup bar-chart built by bucketing createdAt into calendar-day keys), getOnlineUsers (anyone with a recent lastActiveAt), getUsers (the full roster for the Users tab), getModeration (the last 24h of signups and friend-request activity, for lightweight manual review), and banUser/unbanUser.",
      "banUser refuses two cases on purpose: banning your own account, and banning another admin - both would be an easy way to accidentally lock every admin out, since there's no superadmin tier above \"admin\" to undo it. The stats here are all real MongoDB counts run with Promise.all, not estimates or cached numbers.",
    ],
  },
  {
    path: "backend/src/controllers/ai.controller.js",
    folder: "controllers",
    importance: 6,
    explanation: [
      "A single handler, chatWithBuddy, behind POST /api/ai/chat. Validates the message is a non-empty string under 1000 chars, then hands it to services/geminiChat.js along with the client-supplied history array and the three profile fields (fullName, nativeLanguage, learningLanguage) pulled off req.user - never trusting a client-supplied identity for the personalization, since protectRoute already put the real logged-in user on the request.",
      "Any failure - a bad/missing API key, a Gemini outage, a safety-filter block - collapses to one generic 500 with \"AI buddy is unavailable right now\", logged server-side for debugging but never leaking provider error detail to the browser.",
    ],
  },
  {
    path: "backend/src/controllers/auth.controller.js",
    folder: "controllers",
    importance: 9,
    explanation: [
      "Three real handlers - signup, login, onboard - plus a getStreamToken export that is actually dead code (see below). signup validates required fields, password length, and email format with a regex, checks for a duplicate email, assigns a random seeded avatar from avatar.iran.liara.run, creates the User (password hashing happens in the model's own pre-save hook, not here), and calls upsertStreamUser so the new account exists as a Stream chat/video user before it ever opens a chat. login mirrors that via user.matchPassword, and also rejects a banned account outright with a 403 rather than letting it log in and get kicked on the next request. Both set the same signed JWT cookie: 7-day expiry, httpOnly, sameSite strict, and secure only in production.",
      "onboard fills in the one-time profile fields (native/learning language, bio, location) and re-upserts the Stream user with whatever profile picture is set. Real finding while documenting this file: it also exports a getStreamToken that reads req.user's id defensively - but auth.route.js never wires it to any endpoint, so it is unused, dead code. The token endpoint that's actually reachable lives in chat.controller.js instead.",
    ],
  },
  {
    path: "backend/src/controllers/chat.controller.js",
    folder: "controllers",
    importance: 5,
    explanation: [
      "A single-purpose file - one function, getStreamToken, wired to GET /api/chat/token. It calls generateStreamToken(req.user.id) (Mongoose gives every document both _id and a virtual id string getter) and returns the token as JSON.",
      "This is the live version of the same idea auth.controller.js also exports - two implementations of the identical concept exist in the codebase, and only this one is actually reachable from a route. It skips optional chaining on req.user, which is safe here because the protectRoute middleware already guarantees req.user exists before this handler ever runs.",
    ],
  },
  {
    path: "backend/src/controllers/group.controller.js",
    folder: "controllers",
    importance: 6,
    explanation: [
      "Two handlers, promoteGroupAdmin and demoteGroupAdmin, both behind backend routes for a real reason discovered while building group chat: Stream Chat flatly refuses channel member-role changes (addModerators/demoteModerators) from a client-side SDK - \"changing channel member roles is not allowed client-side\" - no matter what permissions the caller has. It has to go through the server SDK, which is what these two exist to do.",
      "getMembershipInfo re-queries the channel server-side on every call (channel.query) rather than trusting anything the client claims - it derives isAdmin from Stream's own channel_role plus who the channel's created_by is, and demoteGroupAdmin additionally refuses to ever strip the creator's admin status, so a promoted admin can't demote the person who made the group.",
    ],
  },
  {
    path: "backend/src/controllers/user.controller.js",
    folder: "controllers",
    importance: 8,
    explanation: [
      "The biggest controller - covers the whole friends/matching/profile/blocking surface: getRecommendedUsers (everyone onboarded, excluding yourself, existing friends, and now anyone in a block relationship in either direction, via a MongoDB $nin/$ne query), getMyFriends (populates the friends array with just the fields the UI needs, including lastActiveAt for presence dots), sendFriendRequest (blocks self-requests, already-friends, duplicate pending requests in either direction, and now blocked users in either direction), acceptFriendRequest (verifies the current user really is the recipient before flipping status and pushing both users into each other's friends array with $addToSet), getFriendRequests, and getOutgoingFriendReqs.",
      "Both getFriendRequests and getOutgoingFriendReqs filter out any populated sender/recipient that came back null - a defensive fix from a real earlier bug where a friend-request document outlived the user it pointed to, which used to crash the Notifications page with no error boundary. updateProfile is the newer handler backing the profile-edit modal - it accepts fullName/bio/phone/links/location/profilePic and re-upserts the Stream user afterward, so a new photo or name shows up in chat too, not just in the app's own UI.",
      "unfriendUser, blockUser, unblockUser, and getBlockedUsers back the Friends page's per-friend Unfriend/Block buttons and its Blocked users modal. blockUser does three things atomically-in-spirit (though not in a single transaction): adds to blockedUsers, pulls the friendship both directions, and deletes any FriendRequest history between the two - without that last step, an old accepted request would keep making them look like friends in places that read FriendRequest directly instead of the friends array.",
    ],
  },
  {
    path: "backend/src/lib/db.js",
    folder: "lib",
    importance: 8,
    explanation: [
      "The whole Mongo connection in a handful of lines - mongoose.connect(process.env.MONGO_URI) inside a try/catch, called from server.js right after the HTTP server starts listening rather than before, logging the connected host on success.",
      "On failure it calls process.exit(1) - a deliberate choice to crash the process instead of quietly serving HTTP requests against a database it can't reach. In production that relies on the host (or nodemon locally) to restart the process rather than the app limping along with every DB-backed route failing silently.",
    ],
  },
  {
    path: "backend/src/lib/stream.js",
    folder: "lib",
    importance: 9,
    explanation: [
      "The bridge to Stream's chat/video platform - reads STEAM_API_KEY/STEAM_API_SECRET from the environment (note the missing R, a genuine and harmless naming inconsistency also called out on the Developer page) and creates one shared server-side StreamChat client via getInstance. upsertStreamUser is called from signup, login, onboard, and updateProfile any time a user's identity or avatar might need to exist or change on Stream's side.",
      "generateStreamToken signs a short-lived, user-scoped token server-side - this is the whole reason the frontend never sees the Stream API secret; every chat/video session the client opens is authenticated with a token minted here. Errors from either function are caught and logged rather than re-thrown, so a Stream outage degrades the specific request rather than crashing the server.",
      "getGroupChannel/setGroupAdmin exist for one specific reason: Stream blocks channel member-role changes from any client-side SDK entirely, so promoting/demoting a group admin (group.controller.js) has to happen through this server-side client instead of directly from the browser like the rest of the group-management actions.",
    ],
  },
  {
    path: "backend/src/middleware/admin.middleware.js",
    folder: "middleware",
    importance: 5,
    explanation: [
      "protectAdminRoute - a one-line gate that runs after protectRoute and rejects with 403 unless req.user.role is \"admin\". Deliberately its own tiny file rather than folded into auth.middleware.js, since it's a completely separate concern (authorization) from authentication.",
    ],
  },
  {
    path: "backend/src/middleware/aiRateLimit.js",
    folder: "middleware",
    importance: 4,
    explanation: [
      "An in-memory sliding-window limiter (8 requests per 60 seconds, keyed by logged-in user id) sitting in front of the AI buddy route - it exists purely to stop one account from burning through the free Gemini daily quota for everyone else. Same shape as TrainMitra's chatRateLimit, adapted to key by user id instead of IP since every caller here is already authenticated.",
      "Deliberately not backed by Redis or any shared store - fine for a single-process deployment, but the limit resets if the process restarts and doesn't hold across multiple server instances.",
    ],
  },
  {
    path: "backend/src/middleware/auth.middleware.js",
    folder: "middleware",
    importance: 9,
    explanation: [
      "protectRoute - the single gate every non-public route passes through. Reads the jwt cookie, verifies it with JWT_SECRET_KEY, loads the corresponding User with the password field excluded, and attaches it to req.user. Three different 401 cases are distinguished internally (no cookie, bad/expired token, user no longer exists) even though the frontend currently treats all of them the same way. A banned user is also rejected here with a 403 and the cookie cleared, so a suspension takes effect on the very next request, not just at the next login.",
      "Two more things happen on every authenticated request: the account matching ADMIN_EMAIL gets promoted to role \"admin\" the moment it's noticed (a one-time write, since the role sticks after that), and lastActiveAt gets bumped in the background - but only if it's more than 30 seconds stale, so this doesn't turn into a database write on literally every request. That timestamp is the entire real presence system the Admin dashboard's Online tab is built on.",
    ],
  },
  {
    path: "backend/src/models/FriendRequest.js",
    folder: "models",
    importance: 7,
    explanation: [
      "A small schema: sender and recipient are both ObjectId refs to User, and status is an enum of pending/accepted defaulting to pending. timestamps: true gives every request a createdAt, which is what the Notifications page's \"Recently\" copy is standing in for today - the actual timestamp isn't rendered yet.",
      "There's no unique or compound index preventing duplicate requests at the database level - that guarantee lives entirely in sendFriendRequest's own $or existence check in the controller, so it only holds as long as every write path goes through that one function.",
    ],
  },
  {
    path: "backend/src/models/User.js",
    folder: "models",
    importance: 9,
    explanation: [
      "The central schema - auth fields (email, password), profile fields (fullName, bio, profilePic, nativeLanguage, learningLanguage, location, phone, links), isOnboarded, and a self-referencing friends array of User ObjectIds. A friendship is symmetric - both users get the other's id pushed into their own array - there's no separate join table.",
      "blockedUsers is the same shape as friends (a self-referencing ObjectId array) but one-directional by design - if A blocks B, only A's array gets B's id, so getRecommendedUsers has to check both \"is this candidate in my blockedUsers\" and \"am I in this candidate's blockedUsers\" to actually enforce it both ways.",
      "A pre-save hook hashes password with bcrypt (salt round 10), and only when the password field was actually modified, so calling findByIdAndUpdate on profile fields never accidentally re-hashes an already-hashed password. matchPassword wraps bcrypt.compare for login. phone and links are the two fields added later, specifically for the profile-card feature.",
      "Three more fields back the Admin dashboard: role (\"user\" or \"admin\", promoted automatically by auth.middleware.js rather than ever set directly through the API), isBanned (checked at login and on every subsequent request), and lastActiveAt (a heartbeat timestamp, not a login-time flag - it's what makes the Online tab genuinely live).",
    ],
  },
  {
    path: "backend/src/routes/admin.route.js",
    folder: "routes",
    importance: 5,
    explanation: [
      "router.use(protectRoute, protectAdminRoute) at the top gates every route in this file behind both authentication and the admin role check in one line, the same shortcut user.route.js uses for protectRoute alone. Six routes: four GETs for the dashboard's four tabs, plus the two PUT ban/unban actions.",
    ],
  },
  {
    path: "backend/src/routes/ai.route.js",
    folder: "routes",
    importance: 4,
    explanation: [
      "One route, POST /chat, behind both protectRoute and aiRateLimit before it ever reaches ai.controller.js - authentication and abuse-protection are both middleware, not logic inside the controller itself.",
    ],
  },
  {
    path: "backend/src/routes/auth.route.js",
    folder: "routes",
    importance: 6,
    explanation: [
      "Pure wiring - five routes under /api/auth: public signup, login, logout, and onboarding/me behind protectRoute. The inline handler for GET /me is the one route in the whole app defined directly in a router file instead of a controller, since it's a one-liner that just echoes back req.user.",
    ],
  },
  {
    path: "backend/src/routes/chat.route.js",
    folder: "routes",
    importance: 4,
    explanation: [
      "The smallest route file in the app - one route, GET /token, behind protectRoute, calling chat.controller.js's getStreamToken. It gets its own file and /api/chat prefix rather than folding into /api/users purely for namespacing clarity, since Stream auth is conceptually a different concern from user/friend data.",
    ],
  },
  {
    path: "backend/src/routes/group.route.js",
    folder: "routes",
    importance: 4,
    explanation: [
      "Two routes behind protectRoute: PUT /:channelId/admins/:userId to promote, DELETE the same path to demote. Both just wire straight to group.controller.js - the actual admin-only check happens inside the controller, not here.",
    ],
  },
  {
    path: "backend/src/routes/user.route.js",
    folder: "routes",
    importance: 6,
    explanation: [
      "router.use(protectRoute) at the top applies auth to every route in this file at once, rather than repeating the middleware per-route the way auth.route.js does - the only file in the app that uses that shortcut, since every route here genuinely does require login. Wires the user.controller.js handlers, including updateProfile and the block/unfriend routes, to their REST paths.",
    ],
  },
  {
    path: "backend/src/services/geminiChat.js",
    folder: "services",
    importance: 7,
    explanation: [
      "The one file that actually talks to Google's Gemini API, via the @google/genai SDK. Lazily constructs a single shared GoogleGenAI client on first use rather than at import time, so a missing GEMINI_API_KEY throws only when the AI buddy is actually used, not on server boot. Uses gemini-3.1-flash-lite - the same model choice TrainMitra's chat assistant settled on after discovering the plain flash model's free tier caps out at just 20 requests a day, live, via a 429 error.",
      "buildSystemInstruction personalizes the model's persona per-request with the caller's real name and native/learning language pulled from their profile, so \"translate this into my learning language\" actually resolves to something specific instead of the model having to ask. The system prompt also explicitly forbids markdown, since the chat widget renders plain text only, and asks for short replies since every extra sentence is extra latency and extra reading in a live chat window.",
      "toGeminiHistory reshapes the frontend's simple {role, text} conversation array into Gemini's {role, parts: [{text}]} shape and caps it to the last 20 turns, so a long-running conversation doesn't grow the request payload (and cost/latency) without bound. This service is deliberately much simpler than TrainMitra's - no function-calling tools, since a language-learning buddy doesn't need to query a database the way a train-search assistant does.",
    ],
  },
];
