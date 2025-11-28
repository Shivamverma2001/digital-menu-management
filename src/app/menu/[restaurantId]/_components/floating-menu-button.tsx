"use client";

import { Button } from "~/components/ui/button";

interface FloatingMenuButtonProps {
  onClick: () => void;
}

export function FloatingMenuButton({ onClick }: FloatingMenuButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 h-12 sm:h-14 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6"
    >
      <span className="text-xl sm:text-2xl">≡</span>
      <span className="text-sm sm:text-base font-medium">Menu</span>
    </Button>
  );
}

