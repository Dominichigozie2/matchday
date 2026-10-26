import styles from "./Avatar.module.css";

export default function Avatar({
  name,
  hue = 152,
  size = 40,
  group = false,
  ring = false,
}: {
  name: string;
  hue?: number;
  size?: number;
  group?: boolean;
  ring?: boolean;
}) {
  const initials = name
    .replace(/[^A-Za-z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

  return (
    <span
      className={`${styles.avatar} ${group ? styles.group : ""} ${ring ? styles.ring : ""}`}
      style={
        {
          width: size,
          height: size,
          fontSize: Math.max(11, size * 0.36),
          "--h": hue,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
