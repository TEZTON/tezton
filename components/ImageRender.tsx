import Image from "next/image";
import FallbackProfilePicture from "./FallbackProfilePicture";

interface ImageRenderProps {
  name: string;
  imageUrl?: string | null;
  width?: number;
  height?: number;
}

export default function ImageRender({
  imageUrl,
  width = 30,
  height = 30,
  name,
}: ImageRenderProps) {
  if (imageUrl) {
    return (
      <div className="flex rounded-full shadow-inner">
        <Image
          referrerPolicy="no-referrer"
          width={width}
          height={height}
          src={imageUrl}
          alt={`Image of ${name}`}
          className="rounded-full"
        />
      </div>
    );
  }

  return <FallbackProfilePicture width={width} height={height} name={name} />;
}
