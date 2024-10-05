import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

function ActiveUsers() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-6">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl text-secondary font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
          Most Active Users
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-primary leading-none">
                      John Doe {i}
                    </p>
                    <p className="text-sm text-primary font-thin dark:text-gray-400">
                      {100 - i * 10} posts
                    </p>
                  </div>
                </div>
                <div className="ml-auto font-medium">{i}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ActiveUsers;
