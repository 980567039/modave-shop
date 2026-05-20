import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { apiReq } from "@/lib/common";

const useUpdateSession = () => {
  const { data: session, status, update } = useSession();

  const updateSession = useCallback(async (updateUserData) => {
    try {
      const res = await apiReq('update-session', 'POST', updateUserData);

      if (res.ok) {
        const updatedSession = await res.json();

        update({
          ...session,
          user: {
            ...session?.user,
            ...updatedSession?.session?.user,
          },
          forceUpdate: true,
        });
      } else {
        console.error('Failed to update session:', res.statusText);
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }, [session, update]);

  return {
    updateSession,
    status,
    session,
  };
};

export default useUpdateSession;
