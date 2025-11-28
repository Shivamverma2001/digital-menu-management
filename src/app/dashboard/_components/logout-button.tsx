"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const logoutMutation = api.auth.logout.useMutation({
    onSuccess: () => {
      // Use window.location for full page reload to ensure cookie is cleared
      window.location.href = "/login";
    },
  });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className="text-xs sm:text-sm"
    >
      Logout
    </Button>
  );
}

