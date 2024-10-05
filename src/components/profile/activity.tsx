import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Mail, User } from "lucide-react";

function Activity() {
  const activity = [
    {
      icon: BookOpen,
      text: "Published a new blog post: 'The Future of AI'",
      date: "2 days ago",
    },
    {
      icon: Mail,
      text: "Replied to a comment on 'Web Development Trends 2024'",
      date: "5 days ago",
    },
    {
      icon: User,
      text: "Updated profile picture",
      date: "1 week ago",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest posts and interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activity.map((item, index) => (
            <li key={index} className="flex items-start space-x-4">
              <div className="rounded-full bg-primary text-secondary p-2">
                <item.icon className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p>{item.text}</p>
                <p className="text-sm text-primary">{item.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default Activity;
