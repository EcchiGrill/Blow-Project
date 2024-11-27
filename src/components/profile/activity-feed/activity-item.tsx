import { FetchedActivityType } from "@/lib/types";
import { getAgoDate } from "@/lib/utils";
import {
  Aperture,
  Fan,
  Link,
  MessageCircleHeart,
  MountainSnow,
  ScrollText,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function ActivityItem({ item }: { item: FetchedActivityType }) {
  return (
    <li key={item.type} className="flex items-start space-x-3">
      <div className="rounded-full bg-primary text-secondary p-2">
        {item.type === "username" && (
          <User className="h-4 w-4 text-secondary" />
        )}
        {item.type === "avatar" && (
          <Aperture className="h-4 w-4 text-secondary" />
        )}
        {item.type === "location" && (
          <MountainSnow className="h-4 w-4 text-secondary" />
        )}
        {item.type === "bio" && (
          <ScrollText className="h-4 w-4 text-secondary" />
        )}
        {item.type === "link" && <Link className="h-4 w-4 text-secondary" />}
        {item.type === "post" && <Fan className="h-4 w-4 text-secondary" />}
        {item.type === "comment" && (
          <MessageCircleHeart className="h-4 w-4 text-secondary" />
        )}
      </div>
      <div>
        <p>
          {item.msg}{" "}
          {item.post_title && (
            <NavLink to={`/feed/post-${item.post_link!}`} className="underline">
              {`'${item.post_title}'`}
            </NavLink>
          )}
        </p>
        <p className="text-sm text-primary">{getAgoDate(item.timemark)}</p>
      </div>
    </li>
  );
}

export default ActivityItem;
