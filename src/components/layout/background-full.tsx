import { FC } from "react";
import Image from "next/image";

interface IProps {
  children: React.ReactNode;
}

const BackgroundFull: FC<IProps> = (props) => {
  // add a full size background image
  return (
    <>
      <div>
        <Image
          src="/noise-layer.jpg"
          alt="background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="fixed inset-0 bg-black bg-opacity-85 bg-blend-screen">
        {props.children}
      </div>
    </>
  );
};

export default BackgroundFull;
