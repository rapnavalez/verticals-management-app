import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/session";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RiBuilding2Line,
  RiCalendar2Line,
  RiScissorsLine,
  RiTeamLine,
  RiSettings3Line,
} from "@remixicon/react";

const STEPS = [
  {
    step: 1,
    title: "Business profile",
    description: "Name, type, address, and timezone",
    icon: <RiBuilding2Line className="size-4" />,
  },
  {
    step: 2,
    title: "Operating hours",
    description: "When your business is open",
    icon: <RiCalendar2Line className="size-4" />,
  },
  {
    step: 3,
    title: "Add services",
    description: "What you offer and how long each takes",
    icon: <RiScissorsLine className="size-4" />,
  },
  {
    step: 4,
    title: "Invite staff",
    description: "Add team members and assign roles",
    icon: <RiTeamLine className="size-4" />,
  },
  {
    step: 5,
    title: "Settings",
    description: "Branding, booking rules, and notifications",
    icon: <RiSettings3Line className="size-4" />,
  },
];

export default async function OnboardingPage() {
  const user = await getAuthUser();

  if (!user) redirect("/login");
  if (user.onboardingComplete) redirect("/dashboard");

  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">
            Let&apos;s finish setting up {user.businessName}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {STEPS.map(({ step, title, description, icon }) => (
            <Card key={step} className="opacity-60">
              <CardHeader className="py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    {icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm">{title}</CardTitle>
                    <CardDescription className="text-xs">
                      {description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
