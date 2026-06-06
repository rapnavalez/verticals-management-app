import { RiTerminalBoxLine } from "@remixicon/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        {process.env.NODE_ENV === "development" && (
          <Alert>
            <RiTerminalBoxLine />
            <AlertTitle>Dev credentials</AlertTitle>
            <AlertDescription>
              <span className="font-mono">owner@test.com</span>
              {" · "}
              <span className="font-mono">TestOwner1234!</span>
            </AlertDescription>
          </Alert>
        )}
        <LoginForm />
      </div>
    </div>
  )
}
