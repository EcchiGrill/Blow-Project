import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FetchedActivitiesType } from "@/lib/types";
import ActivityItem from "./activity-item";
import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PROFILE_ACTIVITY_COUNT } from "@/lib/constants";

function ActivityFeed({ activity }: { activity: FetchedActivitiesType }) {
  const [activityVisibility, setActivityVisibility] = useState<{
    isMoreActivity: boolean;
    activityCount: number;
  }>({
    isMoreActivity: false,
    activityCount: PROFILE_ACTIVITY_COUNT,
  });
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest posts and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {activity.length ? (
              [...activity]
                .sort(
                  (a, b) =>
                    new Date(b.timemark).getTime() -
                    new Date(a.timemark).getTime()
                )
                .map(
                  (item, i) =>
                    i < activityVisibility.activityCount && (
                      <ActivityItem item={item} key={item.type + i} />
                    )
                )
            ) : (
              <div className="py-5 text-xl flex flex-col place-content-center place-items-center gap-3">
                <NotebookPen className="h-14 w-14 opacity-80" />
                <span> This user is too shame :3</span>
              </div>
            )}
          </ul>
        </CardContent>
      </Card>
      {activity.length > PROFILE_ACTIVITY_COUNT ? (
        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="secondary"
            className="px-10"
            onClick={() => {
              if (!activityVisibility.isMoreActivity) {
                setActivityVisibility((prev) => {
                  return {
                    ...prev,
                    activityCount: activity.length,
                    isMoreActivity: true,
                  };
                });
              } else {
                setActivityVisibility((prev) => {
                  return {
                    ...prev,
                    activityCount: PROFILE_ACTIVITY_COUNT,
                    isMoreActivity: false,
                  };
                });
              }
            }}
          >
            {activityVisibility.isMoreActivity ? "Show Less" : "Show More"}
          </Button>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default ActivityFeed;
