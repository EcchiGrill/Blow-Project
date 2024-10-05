import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full py-12 md:py-16 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-secondary tracking-tighter sm:text-4xl md:text-5xl">
              Subscribe to Our Newsletter
            </h2>
            <p className="mx-auto max-w-[600px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stay updated with our latest posts and announcements.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <Input
                className="max-w-lg"
                placeholder="Enter your email"
                type="email"
              />
              <Button type="submit" variant={"secondary"}>
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
