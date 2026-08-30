import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { joinStreamCall } from "../lib/streamVideoClient";

import {
  StreamVideo,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const JOIN_TIMEOUT_MS = 15000;

const CallPage = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [joinFailed, setJoinFailed] = useState(false);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser || !callId) return;

    // joinStreamCall shares one in-flight join across every effect run for the
    // same user+call (see streamVideoClient.js) - React StrictMode double-invokes
    // this effect in dev, and without that sharing, both invocations would race
    // to open their own separate connection, and whichever lost got torn down,
    // sometimes right after it had actually succeeded.
    let ignore = false;

    const run = async () => {
      try {
        const { client: videoClient, call: callInstance } = await Promise.race([
          joinStreamCall(authUser, tokenData.token, callId),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Join timed out")), JOIN_TIMEOUT_MS)
          ),
        ]);

        if (ignore) return;

        console.log("Joined call successfully");
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        if (ignore) return;
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.", { id: "call-join-error" });
        setJoinFailed(true);
      } finally {
        if (!ignore) setIsConnecting(false);
      }
    };

    run();

    return () => {
      ignore = true;
    };
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen w-full flex flex-col">
      {client && call && !joinFailed ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
          <p>Could not initialize call. Please refresh or try again later.</p>
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
              Retry
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => navigate("/")}>
              Back to home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  // SpeakerLayout has no intrinsic size of its own - without flex-1/min-h-0
  // on its wrapper it collapses to its content's natural size and the whole
  // call floats centered in the middle of the screen with dead space above
  // and below (very visible on a tall mobile viewport). flex-1 makes it
  // claim all height left over after CallControls.
  return (
    <StreamTheme className="h-full w-full flex flex-col">
      <div className="relative flex-1 min-h-0 flex flex-col">
        <SpeakerLayout />
      </div>
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;