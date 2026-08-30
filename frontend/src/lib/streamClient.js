import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

let connectPromise = null;

// Stream rejects a user's "image" field past a few KB - it expects a URL, not
// embedded image data. A profile photo uploaded from a device is stored in
// MongoDB as a full-size base64 data URI (see EditProfileModal.jsx), which can
// run to hundreds of KB. Sending that as-is to connectUser's websocket payload
// fails every single time, for that account only, no matter how many retries -
// this is what caused exactly that: a real user's chat that never connected.
const STREAM_IMAGE_SIZE_LIMIT = 8 * 1024;

export const safeStreamImage = (profilePic) =>
  profilePic && profilePic.length <= STREAM_IMAGE_SIZE_LIMIT ? profilePic : undefined;

export function getStreamClient() {
  return StreamChat.getInstance(STREAM_API_KEY);
}

// ChatPage.jsx and MessagesPage.jsx share one Stream client singleton (getInstance
// always returns the same instance for a given API key). connectUser throws if called
// again while a previous call is still in flight, so both pages must await the same
// promise rather than each calling connectUser independently - this is what prevents
// that race, not just checking client.userID before calling.
//
// client.userID alone isn't a reliable "already connected" check - it can still be set
// to the right id after the underlying websocket has dropped (a backend restart, a lost
// network blip), which used to make every retry short-circuit onto a dead connection
// forever ("Try again" never actually reconnecting). _hasConnectionID() reflects the
// real websocket handshake state, and a failed attempt now disconnects before rejecting
// so the next call always starts from a genuinely clean slate.
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Wraps a full "connect + do the thing" sequence with retries, not just the
// connect step - a cold websocket handshake, or the channel-create request
// right after it, can each fail transiently on a first attempt in a fresh
// browser session and succeed immediately after. Retrying the whole sequence
// (not just one piece of it) with a short, increasing delay is what makes a
// one-off network hiccup invisible instead of surfacing as an error the user
// has to notice and click through.
export async function withStreamRetry(fn, delaysMs = [400, 1200, 2500]) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= delaysMs.length) throw err;
      await sleep(delaysMs[attempt]);
    }
  }
}

export async function connectStreamUser(authUser, token) {
  const client = getStreamClient();

  if (client.userID === authUser._id && client._hasConnectionID()) {
    return client;
  }

  if (!connectPromise) {
    connectPromise = client
      .connectUser({ id: authUser._id, name: authUser.fullName, image: safeStreamImage(authUser.profilePic) }, token)
      .then(() => client)
      .catch(async (err) => {
        try {
          await client.disconnectUser();
        } catch {
          // already disconnected/never connected - nothing to clean up
        }
        throw err;
      })
      .finally(() => {
        connectPromise = null;
      });
  }

  return connectPromise;
}
