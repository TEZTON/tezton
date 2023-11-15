import hash from "string-hash";
import color from "tinycolor2";

interface FakePictureProps {
  name: string;
}

export default function FakePicture({ name }: FakePictureProps) {
  const hashed = hash(name);
  const c = color({ h: hashed % 360, s: 0.95, l: 0.5 });
  const c1 = c.toHexString();
  const c2 = c.triad()[2].toHexString();

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: 30,
        height: 30,
      }}
    >
      <svg viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="circle_mask" maskUnits="userSpaceOnUse" x="0" y="0">
          <circle cx="11.5" cy="11.5" r="11.5" fill="#F4F4F4" />
        </mask>
        <g mask="url(#circle_mask)">
          <rect
            fill={`url(#${name.replace(" ", "")})`}
            x="0"
            y="0"
            width="100%"
            height="100%"
          />
          <text x="30%" y="70%" fill="white">
            {name[0].toUpperCase()}
          </text>
        </g>
        <defs>
          <linearGradient
            id={name.replace(" ", "")}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop stopColor={c1} offset="0%" />
            <stop stopColor={c2} offset="100%" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
