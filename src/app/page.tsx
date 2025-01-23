import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default async function Page() {
  const { userId } = await auth();

  // Redirect on the server if the user is authenticated
  if (userId) {
    console.log("Redirecting to /events");
    redirect("/events");
  }

  return (
    <div className="text-center container my-4 mx-auto">
      <h1 className="text-3xl mb-4">Hello World</h1>
      <div className="flex gap-2 justify-center">
        <Button asChild><SignInButton /></Button>
        <Button asChild><SignUpButton /></Button>
        <UserButton />
      </div>
    </div> 
  );
}