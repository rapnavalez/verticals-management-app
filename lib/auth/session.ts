import { cache } from "react";
import { createSupabaseServerClient } from "./supabase-server";
import { prisma } from "@/lib/db/client";
import type { UserRole } from "@/lib/generated/prisma/client";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  businessId: string;
  businessName: string;
  onboardingComplete: boolean;
  role: UserRole;
};

export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      businessId: true,
      role: true,
      name: true,
      email: true,
      status: true,
      business: {
        select: {
          name: true,
          onboardingComplete: true,
        },
      },
    },
  });

  if (!dbUser || dbUser.status === "suspended") return null;

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    businessId: dbUser.businessId,
    businessName: dbUser.business.name,
    onboardingComplete: dbUser.business.onboardingComplete,
    role: dbUser.role,
  };
});
