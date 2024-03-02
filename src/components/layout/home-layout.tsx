import { FC } from "react";
import HomeCanvas from "../3d/home-canvas";

interface IProps {
  children: React.ReactNode;
}

const HomeLayout: FC<IProps> = (props) => {
  return (
    <>
      <div className="w-screen h-screen text-white">
        <HomeCanvas />
      </div>
    </>
  );
};

export default HomeLayout;
