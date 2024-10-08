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
import { useUser } from "@/hooks/useUser";
import { CornerDownRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Settings() {
  const { isLogged } = useUser();
  const location = useLocation();

  return (
    <main
      className={
        "p-4" +
        `${!isLogged && " flex place-items-center place-content-center"}`
      }
    >
      {isLogged ? (
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Email Notifications</Label>
                <p className="text-sm text-primary">
                  Receive email updates about your account
                </p>
              </div>
              <Switch id="notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="newsletter">Newsletter Subscription</Label>
                <p className="text-sm text-primary">
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
                defaultValue="john.doe@blow.project"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Change Password</Label>
              <Input
                id="password"
                placeholder="Enter new password"
                type="password"
                className="placeholder:text-primary"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto text-secondary">Save Settings</Button>
          </CardFooter>
        </Card>
      ) : (
        <Link
          to="/login"
          className="text-error text-3xl flex underline flex-row place-items-center gap-2"
          state={{ login: location }}
        >
          Please login first <CornerDownRight className="text-xl self-end" />
        </Link>
      )}
    </main>
  );
}

export default Settings;
