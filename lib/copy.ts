export const copy = {
  auth: {
    login: {
      title: "Sign in to your account",
      description: "Enter your email and password below",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      forgotPassword: "Forgot password?",
      submitIdle: "Sign in",
      submitPending: "Signing in…",
      signupPrompt: "New business?",
      signupLink: "Create an account",
      errors: {
        emailRequired: "Email is required",
        emailInvalid: "Enter a valid email address",
        passwordRequired: "Password is required",
        emailNotConfirmed: "Please verify your email before signing in",
        invalidCredentials: "Incorrect email or password",
      },
    },
  },
} as const;
