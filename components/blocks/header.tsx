"use client";

import animations from "@/constants/animations";

import { NavSheetTrigger } from "@/components/blocks/navSheet";
import { useConvexAuth } from "convex/react";
import { motion } from "framer-motion";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/blocks//modeToggle";
import { useTheme } from "next-themes";

type Props = Omit<ImageProps, "src" | "priority" | "loading"> & {
  srcLight: string;
  srcDark: string;
  alt: string;
  width: number;
  height: number;
  theme: "dark" | "light";
};

const ThemeImage = (props: Props) => {
  const { theme, width, height, srcLight, srcDark, alt, className, ...rest } =
    props;

  return (
    <>
      {theme === "dark" ? (
        <Image
          {...rest}
          src={srcDark}
          className={className}
          width={width}
          height={height}
          alt={alt}
          priority
        />
      ) : (
        <Image
          {...rest}
          src={srcLight}
          className={className}
          width={width}
          height={height}
          alt={alt}
          priority
        />
      )}
    </>
  );
};

export const Header = () => {
  const { isLoading } = useConvexAuth();
  const { theme } = useTheme();

  if (isLoading) return null;
  return (
    <motion.div {...animations.appearDown}>
      <header className="mb-6 w-full">
        <div className="flex w-full justify-between ">
          <Link href={"/"}>
            <ThemeImage
              srcLight="/logo.png"
              srcDark="/logo-dark.png"
              alt="Daddy Pack"
              theme={theme as "dark" | "light"}
              width={160}
              height={100}
            />
          </Link>

          <div className="flex flex-row items-center gap-2">
            <ModeToggle />
            <NavSheetTrigger />
          </div>
        </div>
      </header>
    </motion.div>
  );
};
