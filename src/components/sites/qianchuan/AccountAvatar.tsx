import Image from "next/image";
import { getAccountDeliveryProfile } from "@/lib/account-delivery";

const AVATAR_COLORS = ["#2049eb", "#18a77b", "#7b5be7", "#f08b18", "#16a4c8", "#d84c75"];

function accountColor(accountId: string) {
  const seed = [...accountId].reduce((sum, value) => sum + value.charCodeAt(0), 0);
  return AVATAR_COLORS[seed % AVATAR_COLORS.length];
}

export function AccountAvatar({
  accountId,
  name,
  size = 38,
  square = false,
  className = "",
}: {
  accountId: string;
  name: string;
  size?: number;
  square?: boolean;
  className?: string;
}) {
  const avatar = getAccountDeliveryProfile(accountId).douyin?.avatar;
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden text-white ${className}`}
      style={{ width: size, height: size, borderRadius: square ? 8 : "50%", backgroundColor: accountColor(accountId), fontSize: Math.round(size * 0.46) }}
      aria-hidden="true"
    >
      {avatar ? (
        <Image src={avatar} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span className="font-semibold">{name.slice(0, 1)}</span>
      )}
    </span>
  );
}
