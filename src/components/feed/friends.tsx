import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Friends({ className }: { className?: string }) {
  const friends = [
    { id: 1, name: "Alice Williams", status: "Online" },
    { id: 2, name: "Charlie Brown", status: "Offline" },
    { id: 3, name: "David Lee", status: "Online" },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Friends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`/avatar.png`} alt={friend.name} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-primary">{friend.status}</p>
                </div>
              </div>
              <Button variant="default" size="sm">
                Message
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Friends;
