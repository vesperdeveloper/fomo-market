/**
 * The fomo mark: two circles pinched together at the waist, each one
 * carrying a slanted counter, so the pair reads as a lowercase "oo"
 * and as an infinity at the same time. Drawn rather than shipped as a
 * bitmap so it stays crisp at 20px in the nav and 512px on a card.
 */
export default function Mark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 72) / 120}
      viewBox="0 0 120 72"
      fill="none"
      aria-hidden
      style={{ display: "block", flexShrink: 0 }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="
          M 36 3 A 33 33 0 1 1 35.99 69 A 33 33 0 0 1 36 3 Z
          M 84 3 A 33 33 0 1 1 83.99 69 A 33 33 0 0 1 84 3 Z
          M 30.5 22 L 45.5 22 L 39 50 L 24 50 Z
          M 78.5 22 L 93.5 22 L 87 50 L 72 50 Z
        "
      />
    </svg>
  );
}
