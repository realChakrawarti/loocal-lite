import Lucide from "@react-native-vector-icons/lucide";
import { Avatar, useAvatar } from "heroui-native/avatar";
import { Skeleton } from "heroui-native/skeleton";

type ContactAvatarProps = {
  name: string;
  thumbnail: string | undefined;
  className: string;
  iconSize: number;
};

function AvatarContent() {
  const { status } = useAvatar();
  if (status === "loading") {
    return <Skeleton className="absolute inset-0 rounded-full" />;
  }
  return null;
}

export function ContactAvatar({ name, thumbnail, iconSize, className }: ContactAvatarProps) {
  return (
    <Avatar className={className} alt={name}>
      <Avatar.Image
        className="rounded-full"
        source={{
          uri: thumbnail,
        }}
      />
      <AvatarContent />
      <Avatar.Fallback delayMs={300}>
        <Lucide name="circle-user" size={iconSize} color="black" />
      </Avatar.Fallback>
    </Avatar>
  );
}
