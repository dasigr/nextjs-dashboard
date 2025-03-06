import { signIn } from "@/auth"
import { Button } from '@/app/ui/button'

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("github")
      }}
    >
      <Button className="mt-4 w-full">
        Signin with GitHub
      </Button>
    </form>
  )
}
