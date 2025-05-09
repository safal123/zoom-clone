import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Image
        src="/logo.svg"
        priority
        alt="logo"
        width={132}
        height={132}
      />
    </div>
  );
}
