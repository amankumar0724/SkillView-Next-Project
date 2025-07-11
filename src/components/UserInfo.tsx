import { UserCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { AppUser } from "@/types/user";

interface UserInfoProps {
  user: AppUser;
}

function UserInfo({ user }: UserInfoProps) {
  // Get user initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user.name || user.email || "Unknown User";
  const initials = displayName !== "Unknown User" ? getInitials(displayName) : "?";

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.image} alt={displayName} />
        <AvatarFallback>
          {user.image? (
            initials
          ) : (
            <UserCircleIcon className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium truncate">{displayName}</span>
    </div>
  );
}

export default UserInfo;