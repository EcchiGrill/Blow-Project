import { ActivityContext } from "@/context/activity-provider";
import { useContext } from "react";

function Activity({
  profileName,
  profileUID,
  type = "profile",
}: {
  profileName: string;
  profileUID: string;
  type?: "profile" | "friends";
}) {
  const activeUsers = useContext(ActivityContext);

  const getActivity = () => {
    if (activeUsers.includes(profileUID + "-idle")) {
      return { activity: "Idle", color: "text-yellow-500" };
    } else if (activeUsers.includes(profileUID)) {
      return { activity: "Active", color: "text-green-500" };
    } else {
      return { activity: "Inactive", color: "text-red-500" };
    }
  };

  return (
    <div>
      <h3 className="font-semibold">
        {profileName}
        {type === "profile" && (
          <sup className={`ml-1 font-semibold ${getActivity().color}`}>
            {getActivity().activity}
          </sup>
        )}
      </h3>
      {type === "friends" && (
        <span className={`${getActivity().color}`}>
          {getActivity().activity}
        </span>
      )}
    </div>
  );
}

export default Activity;
