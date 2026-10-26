import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "accent" | "dark" | "volt" | "outline" | "ghost" | "soft";
type Size = "sm" | "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children?: ReactNode;
};

type AsButton = Common & Omit<ComponentProps<"button">, "className" | "children"> & { href?: undefined };
type AsLink = Common & Omit<ComponentProps<typeof Link>, "className" | "children"> & { href: string };

export default function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", block, icon, iconRight, className, children, ...rest } = props;
  const cls = [styles.btn, styles[variant], styles[size], block && styles.block, !children && styles.iconOnly, className]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.label}>{children}</span>}
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link {...(rest as AsLink)} className={cls}>
        {inner}
      </Link>
    );
  }
  const { type = "button", ...btnRest } = rest as AsButton;
  return (
    <button type={type} {...btnRest} className={cls}>
      {inner}
    </button>
  );
}
