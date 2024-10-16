import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {

  const { userId } = auth();
  if (userId !== null) redirect('/events');
  return (
    <>
      {/* HomePage */}
      <div className="text-center container my-4 mx-auto">
        <div className="text-3xl mb-4">Calendly</div>
        <div className="flex gap-2 justify-center">

          <SignedOut>
            <Button asChild><SignInButton /></Button>
            <Button asChild><SignUpButton /></Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </>
  );

}
