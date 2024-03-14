import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { browserExtensionAdapter } from '../backgroundJS/notification';
import { createSessionMessenger } from '../backgroundJS/session';

export function useSessionMessenger(sessionId) {
  const [searchParams] = useSearchParams();
  sessionId = sessionId || searchParams.get('sessionId');

  return useMemo(() => createSessionMessenger({ adapter: browserExtensionAdapter, sessionId }), [sessionId]);
}
