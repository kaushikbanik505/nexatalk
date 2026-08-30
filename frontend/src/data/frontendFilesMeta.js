// Metadata for every real file under frontend/src, shown on /learn/frontend.
// Keep this in sync with frontend/src/*: if a file's behavior changes materially,
// update its explanation here too, and re-run `npm run docs:sync` to refresh the
// embedded source in generatedSource.js.

export const FRONTEND_FOLDER_ORDER = ["", "components", "hooks", "lib", "constants", "pages"];

export const FRONTEND_FOLDER_LABELS = {
  "": "frontend/src/",
  components: "frontend/src/components/",
  hooks: "frontend/src/hooks/",
  lib: "frontend/src/lib/",
  constants: "frontend/src/constants/",
  pages: "frontend/src/pages/",
};

// Full literal Tailwind/daisyUI color-key strings only, never a computed template -
// see the "no ${color} templates" rule established on DeveloperPage.jsx.
export const FRONTEND_FOLDER_COLORS = {
  "": "primary",
  components: "secondary",
  hooks: "accent",
  lib: "info",
  constants: "warning",
  pages: "success",
};

export const FRONTEND_FILES = [
  {
    path: "frontend/src/App.jsx",
    folder: "",
    importance: 10,
    explanation: [
      "The router - a single Routes tree gating every page behind booleans derived from useAuthUser(): isAuthenticated, isOnboarded, isLearnerAllowed (email match), and isAdmin (role === \"admin\"). Every authenticated+onboarded route is wrapped in Layout with the sidebar on - including /messages now - except /chat/:id (and its group twin /chat/group/:id) which turns the sidebar off for more width, and /call/:id which renders with no Layout at all since the video call is its own full-screen surface.",
      "useMessageNotifications(authUser) is called unconditionally at the very top, before the isLoading early return - it has to be, since it's a hook and every hook in a component must run on every render in the same order. This is also the one place in the app where a hook is mounted globally regardless of which page is showing, since a desktop notification for a new message has to fire no matter what page (or no NexaTalk page at all) the user currently has open.",
      "/developer, /whats-next, /terms, and /privacy are mounted with no auth check at all, deliberately, since they're documentation rather than user data. /learn and /admin are each gated a different way on purpose - Learner by a hardcoded email constant (a client-side-only restriction, since the data is statically bundled either way), Admin by a real role field written server-side and impossible to fake from the browser. The single data-theme=\"night\" on the root div is the one place in the whole app that sets the theme - no other component should ever set its own, except a portaled modal, which has to re-declare it since portaling to document.body escapes this div entirely.",
      "Real bug found testing on mobile: this root div used to be h-screen (locked to exactly one viewport tall). Any page whose real content ran taller than one screen - the normal case on a narrow mobile viewport - fell through the bottom of that themed box into the browser's plain white default background partway down the page, since a fixed-height parent doesn't clip an overflowing child by default. Changed to min-h-screen, matching the same pattern PageLoader.jsx already used correctly, so the dark theme now extends the full length of the actual page on every screen size.",
    ],
  },
  {
    path: "frontend/src/main.jsx",
    folder: "",
    importance: 6,
    explanation: [
      "The actual entry file Vite boots. Wraps App in BrowserRouter for client-side routing and a single shared QueryClientProvider - every useQuery/useMutation anywhere in the app shares this one QueryClient instance and its cache, which is why invalidating the authUser query key from a login mutation immediately reflects everywhere that reads useAuthUser().",
      "Also imports Stream Chat's own CSS before the app's own index.css, so the app's Tailwind/daisyUI rules and the few custom .str-chat overrides in index.css load after and can override Stream's defaults.",
    ],
  },
  {
    path: "frontend/src/index.css",
    folder: "",
    importance: 5,
    explanation: [
      "Three Tailwind directives, then two kinds of custom CSS: a set of .str-chat overrides, and three keyframe animations - twinkle and float-up for StarryBackground's stars and rising bubbles, and mascot-wave for the sidebar mascot's periodic tilt.",
      "The .str-chat overrides used to just tweak sizing on top of Stream's default light theme (a pale green gradient, a white message list) - it looked like a foreign widget dropped onto a dark app. Rewritten to remap Stream's own CSS custom properties (--str-chat__background-color, --str-chat__primary-color, --str-chat__own-message-bubble-background-color, etc.) onto this app's daisyUI night-theme tokens (oklch(var(--b1)), oklch(var(--p)), ...), so the chat header, bubbles, and input bar read as part of NexaTalk. The real gotcha: Stream's own <Channel> component re-declares a bare .str-chat class on an inner wrapper, which resets these same custom properties back to Stream's light defaults for everything below it - a selector on .str-chat__theme-dark alone loses that fight on source order. The fix targets \".str-chat__theme-dark .str-chat\" too, which wins on specificity regardless of where in the tree that inner .str-chat lands.",
      "mascot-wave rotates the whole image, not just a limb - an earlier version split the mascot into separate hand/body layers so just the hand could wave, which was explicitly reverted after feedback that it \"broke the picture.\" The shipped keyframe pivots the entire image from its bottom-center a few degrees, briefly, every 6 seconds.",
    ],
  },
  {
    path: "frontend/src/components/AiBuddyFab.jsx",
    folder: "components",
    importance: 5,
    explanation: [
      "A small floating round button, fixed bottom-right, visible only below the lg breakpoint (lg:hidden) - added after testing the mobile layout and finding the AI buddy had no entry point there at all, since Sidebar.jsx (and the mascot's own Chat button) is hidden lg:flex, desktop-only. Rendered from Layout.jsx alongside Sidebar, gated by the same showSidebar prop, so it appears on exactly the pages the desktop sidebar/mascot would otherwise cover.",
      "Manages its own chatOpen state and opens the same AiBuddyModal the desktop button does - no separate mobile-specific chat implementation, just a different trigger.",
    ],
  },
  {
    path: "frontend/src/components/AiBuddyModal.jsx",
    folder: "components",
    importance: 6,
    explanation: [
      "The mascot's \"Chat\" button opens this - a portaled modal chat window against the Gemini-powered AI buddy. Keeps the whole conversation in its own React state (role/text pairs) and replays it as history on every request, since the backend itself is stateless per-request; closing the modal loses the conversation, there's no persistence yet.",
      "A rotating \"Thinking... / Choosing the right words... / Almost there...\" status (cycled on a timer while a request is in flight) stands in for a static spinner, the same progressive-status trick used for TrainMitra's chat assistant. Messages render as plain text (whitespace-pre-wrap, no markdown parsing) since the backend's system prompt is instructed to never emit markdown.",
    ],
  },
  {
    path: "frontend/src/components/Avatar.jsx",
    folder: "components",
    importance: 8,
    explanation: [
      "Used everywhere an avatar renders - FriendCard, LearnersPage, NotificationsPage, Navbar, Sidebar, ProfileCard, EditProfileModal. Renders the real image if src is set and hasn't failed to load; otherwise falls back to a colored circle with the person's first initial, the color chosen deterministically from the first character of their name so the same person always gets the same fallback color.",
      "The effect that resets the failed flag whenever src changes is a real bug fix, not a stylistic choice - without it, once an avatar's image failed to load once (a seeded user's dead profilePic URL, or the random-avatar service being down), the failed flag stuck true forever and a freshly-uploaded new photo would never render, even though src had genuinely changed to a valid new value.",
      "isOnline is opt-in and undefined by default - passing an actual true/false (from lib/presence.js's isRecentlyActive) draws a small green/gray dot over the avatar's corner; leaving it undefined (every other call site) renders nothing extra at all, since presence data doesn't exist or doesn't make sense for most of the places this component is used.",
    ],
  },
  {
    path: "frontend/src/components/BlockedUsersModal.jsx",
    folder: "components",
    importance: 4,
    explanation: [
      "Opened from the \"Blocked users\" button on FriendsPage.jsx - lists everyone the current user has blocked (getBlockedUsers), each with a one-click Unblock button. Without this, blocking someone would be a one-way door with no UI to ever undo it.",
      "Its own useQuery on [\"blockedUsers\"] only runs while this modal is actually mounted (it isn't prefetched or kept around by FriendsPage), since block lists are small and rarely checked - not worth keeping warm in the cache the way the friends list is.",
    ],
  },
  {
    path: "frontend/src/components/ChatHeader.jsx",
    folder: "components",
    importance: 4,
    explanation: [
      "Replaces Stream's default ChannelHeader (and the old floating CallButton overlay) with a custom bar built from the app's own Avatar/typography: a back link, the other participant's avatar and name, and a video-call button - so the chat pane reads as part of NexaTalk instead of a generic third-party widget bar.",
      "Reads the other participant straight off channel.state.members via useChannelStateContext (must render inside <Channel>), filtering out the signed-in user by id - no extra API call needed since Stream already synced that member's profile data.",
      "Also handles group channels via an isGroup prop from ChatPage.jsx: instead of the other member's name/photo, it shows the channel's own data.name/data.image (set once at group creation by NewGroupModal.jsx) and a member count instead of \"Direct message\". For a group, that whole name/avatar area is itself a button that opens GroupInfoModal.jsx.",
      "For a 1-on-1 chat only, also shows an online/offline presence dot and subtitle - the chat partner is by definition a friend (that's the only way to open this page), so it reuses the same [\"friends\"] query FriendsPage.jsx already populates with lastActiveAt, rather than adding a dedicated presence endpoint. Polls every 30s so the dot doesn't go stale for a conversation left open a long time; disabled entirely for groups, where there's no single \"other person\" to show a dot for.",
      "Tapping the name/avatar area opens a different modal depending on isGroup - GroupInfoModal.jsx for a group, ContactInfoModal.jsx for a 1-on-1 chat - mirroring WhatsApp's \"tap the header to see who this is\" pattern for both chat shapes.",
    ],
  },
  {
    path: "frontend/src/components/ChatLoader.jsx",
    folder: "components",
    importance: 3,
    explanation: [
      "A full-screen spinner shown while ChatPage.jsx is still connecting to Stream - creating the client, calling connectUser, watching the channel. Purely presentational, no props.",
    ],
  },
  {
    path: "frontend/src/components/ContactInfoModal.jsx",
    folder: "components",
    importance: 6,
    explanation: [
      "The 1-on-1 twin of GroupInfoModal.jsx, opened by tapping a chat partner's name/avatar in ChatHeader.jsx - avatar, online/offline status, language badges, and three actions: Add to a group, Unfriend, Block. Takes the friend object ChatHeader.jsx already looked up (from the shared [\"friends\"] query) rather than fetching its own copy.",
      "\"Add to a group\" is a second local view inside the same modal (view state: \"info\" | \"addToGroup\"), not a separate component - it lazily queries this user's own group channels the first time it's opened (client.queryChannels, filtered to named channels the friend isn't already a member of) and calls channel.addMembers([friend._id]) directly from the client, the same allowed-client-side operation NewGroupModal.jsx and GroupInfoModal.jsx already use for membership changes.",
      "Unfriend and Block here duplicate the mutations in FriendsPage.jsx/FriendCard.jsx rather than sharing them, since the two components need different post-success behavior - FriendsPage.jsx just refetches its own list in place, while this modal has to close itself and navigate away from a chat that no longer makes sense to be looking at.",
    ],
  },
  {
    path: "frontend/src/components/EditProfileModal.jsx",
    folder: "components",
    importance: 8,
    explanation: [
      "The profile-edit form, rendered via a portal into document.body rather than a plain fixed overlay - because both Navbar and Sidebar (its only mounting parents) use backdrop-blur, and a backdrop-filter on an ancestor creates a new CSS containing block for position: fixed descendants, which silently breaks a plain fixed modal's positioning. That was a real bug, only visible in a screenshot, not in any data check. Because portaling escapes the themed root div entirely, this component's own portaled root re-declares data-theme=\"night\" itself, or it would render in daisyUI's default light theme.",
      "Photo upload reads a local file with FileReader straight to a data URL - a 3MB client-side cap, intentionally below the backend's 5MB body-size limit to leave room for base64 overhead - rather than uploading to any image host. There's no Cloudinary, S3, or multer anywhere in this repo, so a profile photo is stored as a literal base64 string on the User document. Links are a dynamic add/remove list; empty ones are filtered out before the request is sent.",
    ],
  },
  {
    path: "frontend/src/components/FriendCard.jsx",
    folder: "components",
    importance: 6,
    explanation: [
      "A single friend's card on the Friends page - avatar (with an online/offline presence dot via isRecentlyActive from lib/presence.js), name, native/learning language badges each rendered with a small flag image via the exported getLanguageFlag helper, Unfriend/Block icon buttons, and a Message button linking straight to that friend's chat.",
      "getLanguageFlag is exported from this file and reused by LearnersPage.jsx and HomePage.jsx too - a small, deliberate exception to \"no shared abstraction for a one-off,\" since three different pages genuinely needed the exact same flag-lookup logic.",
      "Unfriend and Block are both just onUnfriend/onBlock callback props - the actual mutations, cache invalidation, and toasts live in FriendsPage.jsx, not here. This component's only added responsibility is a native window.confirm() before calling either, since both are destructive enough (especially Block, which also nukes any pending friend-request history) to warrant a \"are you sure\" the app doesn't otherwise use anywhere.",
    ],
  },
  {
    path: "frontend/src/components/GroupInfoModal.jsx",
    folder: "components",
    importance: 6,
    explanation: [
      "Opened by tapping a group's name/avatar in ChatHeader.jsx - a WhatsApp-style member list: everyone's avatar and name, a \"Creator\" or \"Admin\" badge, an editable group description, and (for whoever is an admin themselves) per-member Make/Remove admin and Remove from group buttons, plus an Exit group button for everyone.",
      "Doesn't invent its own admin system - \"admin\" is Stream's own channel_role of \"moderator\", and \"creator\" is whoever's id matches channel.data.created_by, the id Stream recorded automatically when NewGroupModal.jsx called channel.create(). Exit group and Remove from group are both direct client-side channel.removeMembers() calls - Stream allows removing members from the client SDK.",
      "Promoting/demoting an admin is NOT a direct client call, though - real bug hit while building this: Stream Chat rejects channel member-role changes client-side outright (\"changing channel member roles is not allowed client-side\"), so handleMakeAdmin/handleRemoveAdmin go through promoteGroupAdmin/demoteGroupAdmin (lib/api.js) instead, which hit backend endpoints that use the Stream server SDK. channel.watch() is called afterward to pull the updated role into this client's local state immediately rather than waiting on the realtime event.",
      "The description is a plain custom channel field, edited in place via channel.updatePartial({ set: { description } }) - a genuinely different Stream operation from role assignment, and one still permitted client-side, which is what makes the split between \"these five actions call Stream directly\" and \"these two go through the backend\" non-obvious just from reading the component.",
    ],
  },
  {
    path: "frontend/src/components/HomeButton.jsx",
    folder: "components",
    importance: 3,
    explanation: [
      "A small pill link back to the dashboard. Added to every non-Home page (Friends, Learners, Notifications) after the sidebar's nav collapsed into a single Menu dropdown, so there's still always a one-click way home without opening that menu.",
    ],
  },
  {
    path: "frontend/src/components/Layout.jsx",
    folder: "components",
    importance: 7,
    explanation: [
      "The shell every authenticated page renders inside - conditionally shows Sidebar via a showSidebar prop, always shows Navbar, and renders children in a scrollable main. App.jsx decides per-route whether showSidebar is true, which is how /chat/:id gets the navbar but not the sidebar, while /call/:id skips this component entirely.",
      "AiBuddyFab renders alongside Sidebar under that same showSidebar condition - it's a mobile-only floating button (lg:hidden) added after testing found the AI buddy had zero entry point below the desktop sidebar's breakpoint.",
    ],
  },
  {
    path: "frontend/src/components/Navbar.jsx",
    folder: "components",
    importance: 7,
    explanation: [
      "Sticky, translucent, blurred top bar whose content changes based on route - on /chat/:id it shows the NexaTalk logo, since the sidebar (which normally shows the logo) isn't rendered there; everywhere else it shows a centered plain-text tagline instead. The right side is always the compact ProfileCard, which replaced what used to be a separate standalone logout icon button.",
      "The tagline is deliberately just static text with no links or color - an earlier version built two clickable live-stat pills here instead, which was explicitly rejected as over-engineering a request that was just \"add a message.\"",
    ],
  },
  {
    path: "frontend/src/components/NewGroupModal.jsx",
    folder: "components",
    importance: 6,
    explanation: [
      "A friend-picker modal (checkboxes, optional group photo, a name field, an optional description) that creates a real Stream \"messaging\" channel with more than two members - group chat and group video calling both ride on infrastructure the app already had, since Stream doesn't distinguish a group channel/call from a 1-on-1 one beyond member count.",
      "Unlike the deterministic sorted-ids scheme 1-on-1 chats use for their channel id, a group needs its own random id (crypto.randomUUID()) so two different groups with an identical member list - e.g. \"Family\" and \"Work\" with the same three people - can both exist. The channel is created here, client-side, with connectStreamUser (lib/streamClient.js); the page that opens it afterwards (ChatPage.jsx, via /chat/group/:id) just watches an already-existing channel instead of creating one.",
      "Requires at least 1 friend selected before Create is enabled - a named \"group\" of just you and one friend is still allowed (it behaves identically to a real group, just with two members), rather than forcing a minimum size.",
    ],
  },
  {
    path: "frontend/src/components/NoFriendsFound.jsx",
    folder: "components",
    importance: 3,
    explanation: [
      "The empty-state card shown on the Friends page when the friends list is empty - icon, heading, one line of copy encouraging the user to add someone. No props, no logic.",
    ],
  },
  {
    path: "frontend/src/components/NoNotificationsFound.jsx",
    folder: "components",
    importance: 3,
    explanation: [
      "The equivalent empty state for the Notifications page, shown only when both the incoming-requests and accepted-requests lists are empty.",
    ],
  },
  {
    path: "frontend/src/components/PageLoader.jsx",
    folder: "components",
    importance: 5,
    explanation: [
      "The full-screen spinner App.jsx renders while useAuthUser()'s query is still loading - before the app even knows whether anyone is logged in. Sets its own data-theme=\"night\" since it can render before App.jsx's own themed div is otherwise reachable.",
    ],
  },
  {
    path: "frontend/src/components/ProfileCard.jsx",
    folder: "components",
    importance: 9,
    explanation: [
      "The navbar-avatar popup - a variant prop switches between compact (bare avatar trigger, used in Navbar, popup opens downward) and sidebar (fuller block layout, popup opens upward; currently unused in the live app but kept for potential reuse). Uses the same controlled-dropdown pattern as Sidebar's Menu - useState plus a mousedown click-outside listener via ref - instead of a CSS-only daisyUI dropdown, which had a real bug where a second click on an already-focused trigger wouldn't close it.",
      "Optional fields (phone, location, bio, links) are conditionally rendered only when present, never as an empty row. Links get https:// prepended automatically if missing before being used as a link. The card's own open/editing state also controls mounting EditProfileModal - the modal only exists in the DOM at all while editing is true.",
    ],
  },
  {
    path: "frontend/src/components/Sidebar.jsx",
    folder: "components",
    importance: 8,
    explanation: [
      "Desktop-only - logo, a single Menu dropdown trigger that expands into the five real nav links (Home, Friends, Messages, New Learners, Notifications), the SidebarMascot, and a static user-info footer. The trigger is deliberately labeled \"Menu\" rather than echoing the current page name, and is controlled React state rather than a CSS-only dropdown, the same pattern ProfileCard reuses.",
      "The nav collapsed from four always-visible buttons into this single trigger specifically to make room below it for the mascot, which used to sit in a large empty gap between the nav and the footer.",
    ],
  },
  {
    path: "frontend/src/components/SidebarMascot.jsx",
    folder: "components",
    importance: 6,
    explanation: [
      "A robot mascot image with a typewriter-effect speech-bubble greeting (revealing one more character on an interval) and a Chat pill that now opens AiBuddyModal - a real Gemini-powered conversation, not the \"Coming soon!\" toast it used to be.",
      "Renders one whole image, not separate hand/body layers - an earlier version split the mascot so its hand could rotate independently for a literal wave, which was rejected as \"breaking the picture.\" The shipped version applies one gentle rotation to the entire image instead, defined in index.css's mascot-wave keyframes.",
    ],
  },
  {
    path: "frontend/src/components/StarryBackground.jsx",
    folder: "components",
    importance: 6,
    explanation: [
      "A fixed, full-screen, click-through decorative layer used on most pages - randomly positioned twinkling stars plus slowly-rising translucent bubbles, all generated once via useMemo so they don't re-randomize on every re-render.",
      "Bubble color reads the live theme's CSS variables directly (daisyUI's primary/secondary), so if the site's single global theme ever changed, these would automatically re-tint without any code change here.",
    ],
  },
  {
    path: "frontend/src/hooks/useAuthUser.js",
    folder: "hooks",
    importance: 8,
    explanation: [
      "Wraps getAuthUser (which itself swallows errors and returns null rather than throwing) in a useQuery keyed [\"authUser\"], with retries disabled - this is the single source of truth for \"who's logged in\" that App.jsx's entire route-gating logic depends on.",
    ],
  },
  {
    path: "frontend/src/hooks/useLogin.js",
    folder: "hooks",
    importance: 6,
    explanation: [
      "A thin useMutation wrapper around login from lib/api.js. On success it invalidates the authUser query - that one invalidation is what makes App.jsx immediately re-route from the login page to onboarding or the dashboard, with no manual navigate() call needed.",
    ],
  },
  {
    path: "frontend/src/hooks/useLogout.js",
    folder: "hooks",
    importance: 6,
    explanation: [
      "Same pattern as useLogin/useSignUp - invalidates the authUser query on success, which flips isAuthenticated back to false and lets App.jsx's routing send the user back to the landing page automatically.",
    ],
  },
  {
    path: "frontend/src/hooks/useMessageNotifications.js",
    folder: "hooks",
    importance: 6,
    explanation: [
      "Mounted once, globally, from App.jsx - desktop (browser) notifications for new messages that work no matter which page is open, not just while a chat is. Requests Notification permission once on first mount if it hasn't been asked/answered yet.",
      "Listens for two different Stream events, not one: message.new fires for a channel this client is actively watching (ChatPage.jsx/MessagesPage.jsx open), while notification.message_new fires for every other channel the user belongs to but isn't currently watching - covering only one of the two would miss messages either while sitting on a chat you're not looking at, or while elsewhere in the app entirely.",
      "Skips showing a notification if the exact same conversation is already open with the tab focused (document.hidden is false and the URL already matches that chat) - otherwise every message you're already watching arrive in the message list would also pop a redundant OS notification over it. Clicking a notification focuses the window and navigates there directly via the router's own navigate, rather than a full-page reload.",
    ],
  },
  {
    path: "frontend/src/hooks/useSignUp.js",
    folder: "hooks",
    importance: 6,
    explanation: [
      "The signup counterpart to useLogin - same useMutation-plus-invalidate shape. SignUpPage.jsx keeps an old commented-out version of this logic inline as a before/after note about why this hook exists.",
    ],
  },
  {
    path: "frontend/src/lib/api.js",
    folder: "lib",
    importance: 8,
    explanation: [
      "Every backend call the frontend makes, in one file - thin wrappers around axiosInstance for auth, friends, profile, the Stream token, the six /api/admin endpoints, promoteGroupAdmin/demoteGroupAdmin for /api/groups, unfriendUser/blockUser/unblockUser/getBlockedUsers for the friends-page block/unfriend feature, and sendAiBuddyMessage for the mascot's Gemini-powered chat. getAuthUser is the one function here that catches its own error and returns null instead of throwing, specifically so a logged-out visitor doesn't produce a query-error state on every page load.",
    ],
  },
  {
    path: "frontend/src/lib/axios.js",
    folder: "lib",
    importance: 7,
    explanation: [
      "Configures the single shared axios instance - baseURL switches between the local API port in dev and a relative /api in production, where the backend serves the built frontend itself from the same origin. withCredentials: true is what actually makes the browser attach the httpOnly JWT cookie to every request.",
    ],
  },
  {
    path: "frontend/src/lib/streamClient.js",
    folder: "lib",
    importance: 6,
    explanation: [
      "One function, connectStreamUser, shared by ChatPage.jsx and MessagesPage.jsx. StreamChat.getInstance() always returns the same client for a given API key, and Stream's connectUser() throws if called again while a previous call is still in flight - so navigating between these two pages quickly enough could race two connectUser calls against each other. This function fixes that by memoizing the in-flight connect promise in a module-level variable, so a second caller awaits the same promise instead of starting a competing one, and short-circuits entirely if the client is already connected as the current user.",
      "This exists because of a real bug: before it, both pages called client.connectUser() directly and independently, and the second one to run in a session would throw - which, combined with no error state on either page at the time, stranded the user on an infinite \"Connecting to chat...\" spinner. This file is the fix, not a preemptive abstraction.",
      "Second real bug fixed here: the original version treated client.userID === authUser._id as proof the connection was usable, but that field can still hold the right id after the underlying websocket has actually dropped (a backend restart, a lost network blip) - so every retry kept short-circuiting onto a dead connection and \"Try again\" never actually reconnected. Now it also checks client._hasConnectionID() (the real websocket handshake state), and a failed connect attempt calls disconnectUser() before rejecting, so the next call always starts from a genuinely clean slate instead of a half-broken one.",
      "Third: authUser.profilePic can be a full-size base64 data URI (a device-uploaded photo, sometimes hundreds of KB - see EditProfileModal.jsx), and Stream rejects a user's image field past a few KB. That made chat fail every single time for one specific real account, no matter how many retries, since the same oversized payload got rejected identically each attempt - safeStreamImage() drops the photo entirely above 8KB rather than sending it, and the app's own UI is unaffected since it always reads the real photo from MongoDB, never from Stream.",
      "Fourth: withStreamRetry wraps the entire connect-then-open-channel sequence (not just the connect step) in up to three silent attempts with a short, increasing delay, before ChatPage.jsx or MessagesPage.jsx ever shows the user anything. A cold websocket handshake, or the channel-create request right after it, can each fail once on a fresh browser session and succeed immediately after - retrying the whole sequence covers both failure points, not just one of them. Only exhausting every attempt reaches the error screen.",
    ],
  },
  {
    path: "frontend/src/lib/streamVideoClient.js",
    folder: "lib",
    importance: 6,
    explanation: [
      "joinStreamCall is the video-call twin of connectStreamUser above, and exists for the exact same reason: React StrictMode double-invokes CallPage.jsx's connect effect in development, so without sharing one in-flight promise, both invocations built their own separate StreamVideoClient and raced to join() the same call.",
      "The first fix attempted for this (creating the client in the effect, and disconnecting it in the effect's cleanup if a second invocation had started) actually made things worse in practice: StrictMode's synthetic cleanup fires even when the connection it's cleaning up already succeeded, so a call that had genuinely connected could get torn down a moment later - which is what surfaced as \"Could not join the call\" on a tab that had briefly looked connected, seen while debugging with two real accounts.",
      "This module fixes it the same way streamClient.js fixes chat: cache the join by a `${userId}:${callId}` key at module scope, so every effect invocation for the same user and call awaits the same real join() call instead of starting a competing one. CallPage.jsx no longer disconnects anything on cleanup - it just stops applying a stale result via an `ignore` flag, and the shared promise is left to resolve normally either way.",
    ],
  },
  {
    path: "frontend/src/lib/presence.js",
    folder: "lib",
    importance: 4,
    explanation: [
      "One function, isRecentlyActive(lastActiveAt) - true if a timestamp is within the last 2 minutes, false otherwise (including for undefined/null, so a friend with no lastActiveAt yet just reads as offline rather than throwing). The 2-minute window is hardcoded to match backend/src/controllers/admin.controller.js's ONLINE_WINDOW_MS exactly, so a friend's dot on FriendCard.jsx/ChatHeader.jsx and their row on the Admin dashboard's Online tab never disagree about who's online.",
      "Worth remembering this is a heartbeat, not a live presence system - lastActiveAt only updates when the user makes an authenticated request (throttled to once per 30s in auth.middleware.js), so \"online\" here really means \"used the app within the last two minutes,\" not \"has an open websocket right now.\"",
    ],
  },
  {
    path: "frontend/src/lib/utils.js",
    folder: "lib",
    importance: 2,
    explanation: [
      "One function, capitialize (the misspelling is real, in the codebase, not a rendering artifact) - capitalizes a string's first letter. Used by LearnersPage.jsx to turn a lowercase language-filter query param into display text.",
    ],
  },
  {
    path: "frontend/src/constants/index.js",
    folder: "constants",
    importance: 5,
    explanation: [
      "Two lookup tables - LANGUAGES (the 14 languages offered during onboarding and on the Home page's language selector) and LANGUAGE_TO_FLAG (maps a lowercased language name to a country code used to fetch a small flag image). Adding a new language means adding it to both.",
    ],
  },
  {
    path: "frontend/src/pages/LandingPage.jsx",
    folder: "pages",
    importance: 8,
    explanation: [
      "The logged-out home page - nav, hero, a six-card feature grid, a three-step \"how it works\" section, a CTA banner, and footer, all sitting on StarryBackground. Entirely static content with no data fetching at all.",
    ],
  },
  {
    path: "frontend/src/pages/LoginPage.jsx",
    folder: "pages",
    importance: 8,
    explanation: [
      "A two-column card - the login form on the left (email/password with a show/hide toggle), a static brand panel on the right hidden below the lg breakpoint. Errors read the backend's error message with a fallback string, so an unreachable backend shows real text instead of throwing.",
    ],
  },
  {
    path: "frontend/src/pages/MessagesPage.jsx",
    folder: "pages",
    importance: 8,
    explanation: [
      "The real page behind the sidebar's Messages link - every conversation the current user has opened at least once, most recent first, each row showing the other person's live name/avatar (read straight off Stream's channel member state, not a separate Mongo lookup), a last-message preview, a time stamp, and an unread badge from channel.countUnread().",
      "A channel is treated as a group if it has a name set (channel.data?.name) - not by member count, since a group can be as small as two people, the same size as a real 1-on-1 chat. A group row shows the channel's own name/photo instead of trying to pick one \"other member\", and routes to /chat/group/:id rather than /chat/:friendId. \"New group\" up top opens that same modal.",
      "No new backend endpoint exists for this - it calls client.queryChannels({ type: \"messaging\", members: { $in: [myId] } }, { last_message_at: -1 }) on the same Stream client ChatPage.jsx already connects (via the shared connectStreamUser helper in lib/streamClient.js), and re-runs that query every time a message.new event fires so the list re-sorts itself live while the page is open. A channel only shows up here once someone has actually opened that chat before (ChatPage.jsx's .watch() call is what creates it on Stream's side) - a friend you've never messaged doesn't appear until you start that first conversation from their card on the Friends page, which is the one caveat called out on the Developer page.",
      "Wrapped in a real try/catch with an error state - the first version had none, so any failure here (a bad token, a Stream outage) left channels stuck at null forever, showing ChatLoader's spinner with no way out. Same class of bug as the one fixed on ChatPage.jsx, fixed the same way: an explicit error screen with Try again / Back to home instead of an infinite spinner.",
    ],
  },
  {
    path: "frontend/src/pages/SignUpPage.jsx",
    folder: "pages",
    importance: 8,
    explanation: [
      "Same two-column shape as the login page - form on the left, illustration and pitch copy on the right. Still keeps a commented-out block showing the pre-custom-hook version of the signup mutation, left in intentionally as a before/after note about why useSignUp exists.",
    ],
  },
  {
    path: "frontend/src/pages/OnboardingPage.jsx",
    folder: "pages",
    importance: 7,
    explanation: [
      "The one-time form every new signup must complete before the rest of the app unlocks - App.jsx redirects here whenever someone is authenticated but not yet onboarded. Collects full name, bio, native and learning language (two selects built from the same LANGUAGES list), location, and a profile picture - either a randomly generated public avatar or whatever's already set.",
    ],
  },
  {
    path: "frontend/src/pages/PrivacyPage.jsx",
    folder: "pages",
    importance: 3,
    explanation: [
      "Public, no-auth privacy policy - what data NexaTalk collects (account, profile, usage), how it's used, the two real third-party services involved (Stream for chat/video, MongoDB Atlas for storage), the one cookie the app sets (an httpOnly JWT, not a tracker), and a plain acknowledgement that there's no self-service account-deletion flow yet. Same page shell as TermsPage.jsx and the other living-doc pages - back link, eyebrow/title header, numbered sections.",
    ],
  },
  {
    path: "frontend/src/pages/HomePage.jsx",
    folder: "pages",
    importance: 8,
    explanation: [
      "The logged-in dashboard - a welcome header, quick-nav pills (online status, friends count, a plain Messages link, requests count, new-learners count, each of the counted ones backed by its own live query), a promo block, and four role pills. Developer and What's Next always link to real pages; Learner and Admin only link out for the one account each is restricted to (by email and by role, respectively) - everyone else gets the same \"Coming soon!\" toast, so a locked feature is indistinguishable from one that isn't built yet. Below that sits the full 14-language selector grid, each language linking to a pre-filtered learners page.",
      "Every number on the quick-nav pills is a live count from its own query rather than hardcoded - if a query hasn't resolved yet, the pill briefly shows 0 instead of a loading skeleton. The Messages pill is deliberately just a link with no unread count - showing one would mean connecting to Stream on every Home page load just for a badge, which isn't worth it when /messages itself already shows unread state per-conversation.",
    ],
  },
  {
    path: "frontend/src/pages/FriendsPage.jsx",
    folder: "pages",
    importance: 6,
    explanation: [
      "The friends list, split out from what used to be a combined Home+Friends page specifically because Home and Friends had become duplicate content behind two different nav links. Shows a loading spinner, the empty-state card, or a responsive grid of friend cards.",
      "Owns the unfriend/block mutations (FriendCard.jsx just calls the callbacks it's given) and a \"Blocked users\" button that opens BlockedUsersModal.jsx. The friends query itself polls every 30s via refetchInterval - not for the friend list content, which rarely changes, but so the presence dots each FriendCard shows don't go stale while the page sits open.",
    ],
  },
  {
    path: "frontend/src/pages/LearnersPage.jsx",
    folder: "pages",
    importance: 7,
    explanation: [
      "\"Meet New Learners\" - fetches all recommended users, then filters client-side by a lang query param matched case-insensitively against learningLanguage. Separately fetches outgoing friend requests to know which cards should show \"Request Sent\" instead of the send button.",
      "The lang filter is how HomePage.jsx's per-language pills and this page's own \"Clear filter\" pill work - there's no separate filtered-list endpoint on the backend, it's the same recommended-users list sliced differently on the client.",
    ],
  },
  {
    path: "frontend/src/pages/NotificationsPage.jsx",
    folder: "pages",
    importance: 6,
    explanation: [
      "Two sections from one backend call - incoming pending requests with an Accept button, and already-accepted outgoing requests styled as \"New Connections.\" Both arrays come pre-split from the same endpoint; this page just renders what it's given.",
    ],
  },
  {
    path: "frontend/src/pages/ChatPage.jsx",
    folder: "pages",
    importance: 9,
    explanation: [
      "Connects to Stream Chat via connectStreamUser (lib/streamClient.js), then opens a messaging channel whose id is the two participants' Mongo ids sorted alphabetically and joined with a dash - a deliberately simple trick meaning whichever of the two people opens the conversation first, both end up in the exact same channel, with zero extra \"who started this\" bookkeeping anywhere.",
      "Also serves group chats, mounted at /chat/group/:id instead of /chat/:id - an isGroup flag (from the URL, via useLocation) switches the channel lookup: a group channel already exists (NewGroupModal.jsx created it with its members up front), so this just watches it by its real id instead of deriving a sorted-ids id and passing members to create one on the fly.",
      "Video calls are started from inside this page, not a separate feature - starting a call builds a call URL and sends it as a literal chat message; clicking that link is what actually joins the video room on CallPage.jsx. ChatHeader's video-call button here is just the trigger that kicks that off. This works unchanged for groups too - Stream Video doesn't treat a multi-person call any differently from a 1-on-1 one.",
      "Real bug fixed here: this page used to call client.connectUser() unconditionally every time it mounted, with no guard. Once MessagesPage.jsx started sharing the same Stream client singleton, visiting Messages and then a chat (or the reverse) made the second connectUser call throw - and since the catch block never set an error state, the page was stuck showing ChatLoader's \"Connecting to chat...\" forever with no way out. Fixed by routing both pages through connectStreamUser, and by adding a real error state with a Try again / Back to home screen instead of an infinite spinner.",
      "The wrapping div around <Chat> carries a str-chat__theme-dark class and the Chat component itself gets theme=\"messaging dark\" - together these are what make the chat surface match the rest of the app instead of Stream's default light widget look; see index.css for where the actual color remapping happens.",
    ],
  },
  {
    path: "frontend/src/pages/AdminPage.jsx",
    folder: "pages",
    importance: 8,
    explanation: [
      "The real page behind the dashboard's Admin pill, for the one account with role \"admin\". Four tabs (Overview, Online, Moderation, Users), each backed by its own query that only runs while that tab is active - switching tabs is what triggers the first fetch, not a single big request on page load.",
      "Overview's 7-day bar chart is plain divs sized with an inline height percentage, not a charting library - consistent with this project's habit of hand-building small visuals (the onboarding progress bar, the mascot animation) rather than adding a dependency for something this size. The Online tab polls every 10 seconds; Users lets an admin ban or unban anyone except themselves or another admin, mirroring the same restriction the backend already enforces.",
      "The Users tab's search box filters the already-fetched list client-side by name or email - there's no separate search endpoint, since the whole user table is small enough to fetch once and filter in the browser. The Ban/Unban buttons deliberately have no icon: an earlier version paired BanIcon/UserCheckIcon with the label at btn-xs size and the icon visually overlapped the text instead of sitting beside it, so the fix was to drop the icon rather than fight the sizing.",
    ],
  },
  {
    path: "frontend/src/pages/CallPage.jsx",
    folder: "pages",
    importance: 8,
    explanation: [
      "Joins a Stream Video call using the same call id as the chat channel it was launched from - whichever participant clicks the call link first creates the room, the other one just joins it.",
      "The inner component's check for the calling state being LEFT navigates home directly during render - an unusual but working way to redirect the moment Stream reports the user has left the call, without a separate effect.",
      "The actual join() call is delegated to joinStreamCall (lib/streamVideoClient.js), not done inline - see that file for why: an in-flight-promise cache is what stops React StrictMode's dev-only double effect invocation from opening two competing connections to the same call.",
      "A 15s timeout races against the join itself, and a joinFailed state renders Retry / Back to home buttons instead of an infinite spinner - both added after a real bug where a hung or rejected join left the page stuck on PageLoader forever with no way out.",
    ],
  },
  {
    path: "frontend/src/pages/DeveloperPage.jsx",
    folder: "pages",
    importance: 8,
    explanation: [
      "The public, no-auth \"how this is built\" page - tech stack, local run instructions with copyable command blocks, an environment-variable reference table (documenting the real Stream key naming inconsistency rather than silently fixing it), design principles, shipped features, a full API reference with copy buttons per route, and a security section. This is a standing living document - the explicit rule is that it gets updated in the same change as any new feature, endpoint, or env var, not written once and left to rot.",
      "All the color theming here is a map of complete, literal Tailwind class strings keyed by color name - never built with a computed template, because Tailwind's build-time scanner only picks up class names that appear as complete literal strings in the source; a computed one would silently produce no style at all.",
    ],
  },
  {
    path: "frontend/src/pages/LearnPage.jsx",
    folder: "pages",
    importance: 8,
    explanation: [
      "The interview-prep companion to the Developer page - a 60-second pitch card covering what the project is, its stack, its design principles, how chat and video fit together, and how it was built, followed by the \"Every file, in full\" section that leads into the Backend and Frontend file-explorer pages you're reading right now.",
      "Reuses the same literal-Tailwind-class-string color pattern as DeveloperPage.jsx and WhatsNextPage.jsx, duplicated rather than pulled into a shared file - intentional, per this project's own principle of not building a shared abstraction for what is still only a couple of pages.",
    ],
  },
  {
    path: "frontend/src/pages/TermsPage.jsx",
    folder: "pages",
    importance: 3,
    explanation: [
      "Public, no-auth terms of service, linked from the signup form's agreement checkbox (opens in a new tab so the in-progress signup fields aren't lost). Plain-language sections covering the account, acceptable use, content ownership, and the honest disclaimer that this is an independently-run project rather than a registered company.",
    ],
  },
  {
    path: "frontend/src/pages/AboutPage.jsx",
    folder: "pages",
    importance: 3,
    explanation: [
      "Public, no-auth /about page - a real marketing-style page (hero, stat pills, a feature-card grid, a mission blurb, a gradient CTA, footer) sharing LandingPage.jsx's visual language rather than the plain legal-doc shell Terms/Privacy use, since this one's meant to be a page people actually enjoy landing on. Linked from an \"About\" pill on the home page's quick-nav row. Deliberately a real route (Link + React Router), not a modal - a modal wouldn't give mobile visitors a full page, which is what this needed to do consistently on every screen size. Reads useAuthUser to swap the nav/CTA between \"Sign In / Get Started\" for logged-out visitors and \"Back to dashboard\" for logged-in ones.",
    ],
  },
  {
    path: "frontend/src/pages/WhatsNextPage.jsx",
    folder: "pages",
    importance: 7,
    explanation: [
      "Honest future-scope ideation in two sections: six ideas specific to NexaTalk, each grounded in something actually true about the current code (the \"Online\" badge is just static text, not real presence; every chat channel is hardcoded to exactly two members), and six broader open problems in language-exchange apps generally, closed with an explicit disclaimer that these are observations, not commitments.",
      "Reuses one shared icon per section rather than a different icon per card - a deliberate visual choice carried over from the reference page this was modeled on.",
    ],
  },
];
