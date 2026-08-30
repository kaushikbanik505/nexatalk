import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { safeStreamImage } from "./streamClient";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

let activeKey = null;
let activePromise = null;

// Mirrors connectStreamUser's shared in-flight-promise pattern in streamClient.js,
// for the same underlying reason: React StrictMode double-invokes CallPage's
// connect effect in dev. Without sharing one promise, both invocations built
// their own separate StreamVideoClient and raced to join() the same call - one
// of the two could get rejected by Stream's server, or (in an earlier fix here)
// get disconnected right after it had actually succeeded, which is what showed
// up as "Could not join the call" on a tab that a moment earlier looked connected.
export function joinStreamCall(authUser, token, callId) {
  const key = `${authUser._id}:${callId}`;

  if (activeKey === key && activePromise) {
    return activePromise;
  }

  activeKey = key;
  activePromise = (async () => {
    const client = new StreamVideoClient({
      apiKey: STREAM_API_KEY,
      user: {
        id: authUser._id,
        name: authUser.fullName,
        image: safeStreamImage(authUser.profilePic),
      },
      token,
    });

    const call = client.call("default", callId);
    await call.join({ create: true });

    return { client, call };
  })();

  activePromise.catch(() => {
    if (activeKey === key) {
      activeKey = null;
      activePromise = null;
    }
  });

  return activePromise;
}
