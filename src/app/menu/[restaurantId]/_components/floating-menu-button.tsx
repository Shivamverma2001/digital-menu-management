"use client";

import { Button } from "~/components/ui/button";

interface FloatingMenuButtonProps {
  onClick: () => void;
}

export function FloatingMenuButton({ onClick }: FloatingMenuButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 h-14 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg flex items-center gap-2 px-6"
    >
      <span className="text-2xl">≡</span>
      <span className="font-medium">Menu</span>
    </Button>
  );
}

