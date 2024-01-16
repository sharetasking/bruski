import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface BotAvatarProps {
  img: string;
};

export const BotAvatar = ({
  img
}: BotAvatarProps) => {
  return (
    <Avatar className="h-12 w-12">
      <AvatarImage src={img} />
    </Avatar>
  );
};
