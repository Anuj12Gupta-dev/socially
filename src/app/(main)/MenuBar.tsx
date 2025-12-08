import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Bookmark, Home } from "lucide-react";
import Link from "next/link";
import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  let unreadNotificationsCount = 0;
  let unreadMessagesCount = 0;

  try {
    // Fetch notification count
    unreadNotificationsCount = await prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    });

    // Fetch message count with error handling
    try {
      const unreadCountResult = await streamServerClient.getUnreadCount(user.id);
      unreadMessagesCount = unreadCountResult.total_unread_count || 0;
    } catch (error) {
      // Handle case where user doesn't exist in StreamChat
      console.warn("Failed to fetch unread message count:", error);
      unreadMessagesCount = 0;
    }
  } catch (error) {
    console.error("Error fetching menu bar data:", error);
  }

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}