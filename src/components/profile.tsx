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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Edit, Globe, Mail, MapPin, User } from "lucide-react";

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="px-4 py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4" />
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
                    src="/logo(alt).png"
                    style={{
                      aspectRatio: "80/80",
                      objectFit: "cover",
                    }}
                    width="80"
                  />
                  {isEditing && (
                    <Button
                      className="absolute bottom-0 right-0 h-6 w-6 rounded-full p-0"
                      size="icon"
                      variant="outline"
                    >
                      <Edit className="h-3 w-3" />
                      <span className="sr-only">Change profile picture</span>
                    </Button>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-gray-500">Joined January 2023</p>
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
                    <MapPin className="h-4 w-4 text-gray-500" />
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
                    <Globe className="h-4 w-4 text-gray-500" />
                    <Input
                      id="website"
                      placeholder="Your website"
                      defaultValue="https://janedoe.com"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {isEditing && <Button className="ml-auto">Save Changes</Button>}
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
                    text: "Replied to a comment on 'Web Development Trends 2023'",
                    date: "5 days ago",
                  },
                  {
                    icon: User,
                    text: "Updated profile picture",
                    date: "1 week ago",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <div className="rounded-full bg-gray-100 p-2">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p>{item.text}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive email updates about your account
                  </p>
                </div>
                <Switch id="notifications" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newsletter">Newsletter Subscription</Label>
                  <p className="text-sm text-gray-500">
                    Receive our weekly newsletter
                  </p>
                </div>
                <Switch id="newsletter" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="Your email address"
                  type="email"
                  defaultValue="jane.doe@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input
                  id="password"
                  placeholder="Enter new password"
                  type="password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
