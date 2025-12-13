"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { UserData } from "@/lib/types";
import Link from "next/link";
import FollowButton from "./FollowButton";
import FollowerCount from "./FollowerCount";
import Linkify from "./Linkify";
import UserAvatar from "./UserAvatar";

interface UserCardProps {
  user: UserData;
}

export default function UserCard({ user }: UserCardProps) {
  const { user: loggedInUser } = useSession();

  const followerState = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <Link href={`/users/${user.username}`}>
          <UserAvatar size={70} avatarUrl={user.avatarUrl} />
        </Link>
        {loggedInUser.id !== user.id && (
          <FollowButton userId={user.id} initialState={followerState} />
        )}
      </div>
      <div>
        <Link href={`/users/${user.username}`}>
          <div className="text-lg font-semibold hover:underline">
            {user.displayName}
          </div>
          <div className="text-muted-foreground">@{user.username}</div>
        </Link>
      </div>
      {user.bio && (
        <Linkify>
          <div className="line-clamp-4 whitespace-pre-line">
            {user.bio}
          </div>
        </Linkify>
      )}
      <FollowerCount userId={user.id} initialState={followerState} />
    </div>
  );
}