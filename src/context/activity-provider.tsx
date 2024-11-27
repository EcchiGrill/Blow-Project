import { IDLE_TIME } from "@/lib/constants";
import { useUser } from "@/lib/hooks/useUser";
import supabase from "@/supabase/supabase-client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useIdle } from "react-use";

export const ActivityContext = createContext<unknown[]>([]);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activeUsers, setActiveUsers] = useState<unknown[]>([]);

  const { uid } = useUser();

  const isIdle = useIdle(IDLE_TIME);

  useEffect(() => {
    const activity = supabase.channel("activity");

    activity
      .on("presence", { event: "sync" }, () => {
        const users: string[] = [];

        for (const key in activity.presenceState()) {
          //@ts-expect-error uid
          users.push(activity.presenceState()[key][0].uid);
        }

        setActiveUsers([...new Set(users)]);
      })
      .subscribe(async (status) => {
        if (isIdle) {
          return await activity.track({ uid: uid + "-idle" });
        }

        if (status === "SUBSCRIBED") {
          await activity.track({ uid });
        }
      });

    return () => {
      activity.unsubscribe();
    };
  }, [isIdle, uid]);

  return (
    <ActivityContext.Provider value={activeUsers}>
      {children}
    </ActivityContext.Provider>
  );
}
