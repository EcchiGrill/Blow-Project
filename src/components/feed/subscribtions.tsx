import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Subscribtions({ className }: { className?: string }) {
  const subscribtions = [
    { id: 1, name: "Tech News Daily", subscribers: "50K" },
    { id: 2, name: "Web Dev Tutorials", subscribers: "75K" },
    { id: 3, name: "Coding Tips & Tricks", subscribers: "100K" },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Your Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscribtions.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`/avatar.png`} alt={sub.name} />
                  <AvatarFallback>{sub.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-sm text-primary">
                    {sub.subscribers} subscribers
                  </p>
                </div>
              </div>
              <Button variant="default" size="sm">
                Unsubscribe
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Subscribtions;
