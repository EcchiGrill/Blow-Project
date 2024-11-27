import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createToast } from "@/lib/utils";

function Subscribtions({ className }: { className?: string }) {
  const subscribtions = [
    { id: 1, name: "EcchiGrill", subscribers: "50K" },
    { id: 2, name: "Blow Project", subscribers: "75K" },
    { id: 3, name: "Perfumest", subscribers: "100K" },
  ];

  return (
    <Card className={className + " relative"}>
      <CardHeader>
        <CardTitle>Your Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscribtions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between gap-2"
            >
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
      <div
        className="w-full h-full top-0 absolute bg-dev bg-cover bg-no-repeat bg-left opacity-60 z-10"
        onClick={() => {
          createToast({
            text: "Soon...",
            icon: "⚙️",
            color: "black",
            pos: "top-center",
          });
        }}
      />
    </Card>
  );
}

export default Subscribtions;
