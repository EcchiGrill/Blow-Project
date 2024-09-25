import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Edit, Globe, Mail, MapPin, User } from "lucide-react";
import { useAppSelector } from "@/store/store-hooks";

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const username = useAppSelector((state) => state.user.username);

  return (
    <main className="p-4">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 text-secondary" />
                  <span className="sr-only">Edit Profile</span>
                </Button>
              </div>
              <CardDescription>
                Manage your public profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative h-20 w-20">
                  <img
                    className="rounded-full object-cover"
                    height="80"
                    src="/avatar.png"
                    style={{
                      aspectRatio: "80/80",
                      objectFit: "cover",
                    }}
                    width="80"
                  />
                  {isEditing && (
                    <Button
                      className="absolute bottom-0 right-0 h-6 w-6 rounded-full p-0"
                      variant="default"
                      size="icon"
                    >
                      <Edit className="h-3 w-3 text-secondary" />
                      <span className="sr-only">Change profile picture</span>
                    </Button>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{username}</h3>
                  <p className="text-sm text-primary-foreground">
                    Joined January 2024
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  defaultValue="Passionate blogger and tech enthusiast."
                  disabled={!isEditing}
                  className="resize-none"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <Input
                      id="location"
                      placeholder="Your location"
                      defaultValue="San Francisco, CA"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <Input
                      id="website"
                      placeholder="Your website"
                      defaultValue="https://johndoe.com"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {isEditing && (
                <Button className="ml-auto text-secondary">Save Changes</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest posts and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
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
                ].map((item, index) => (
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
        </TabsContent>
      </Tabs>
    </main>
  );
}
