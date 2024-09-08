import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { createSessionMessenger } from "../backgroundJS/sessionManager";

export function useSessionMessenger(sessionId) {
  const [searchParams] = useSearchParams();
  sessionId = sessionId || searchParams.get("sessionId");

  return useMemo(() => createSessionMessenger({ sessionId }), [sessionId]);
}
