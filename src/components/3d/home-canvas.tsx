import { Canvas, useFrame } from "@react-three/fiber";
import { FC, Suspense, useEffect, useState } from "react";
import Loading from "../loading";
import {
  useTexture,
  Reflector,
  Text,
  PerformanceMonitor,
} from "@react-three/drei";
import { Vector2, Vector3 } from "three";
import {
  Bloom,
  EffectComposer,
  Vignette,
  Pixelation,
  Autofocus,
} from "@react-three/postprocessing";
import { KernelSize, Resolution, BlendFunction } from "postprocessing";
import { Glitch } from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";

const HomeCanvas: FC = () => {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="w-screen h-screen">
      <Suspense
        fallback={
          <div className="w-screen h-screen flex justify-center items-center bg-black">
            <div className="w-16 h-16">
              <Loading />
            </div>
          </div>
        }
      >
        <Canvas
          gl={{ alpha: false }}
          camera={{ position: [0, 3, 100], fov: 15 }}
          dpr={dpr}
        >
          <PerformanceMonitor
            onIncline={() => setDpr(2)}
            onDecline={() => setDpr(1)}
          />
          <EffectComposer>
            <Bloom
              intensity={1} // The bloom intensity.
              kernelSize={KernelSize.VERY_LARGE} // blur kernel size
              luminanceThreshold={0.01} // luminance threshold. Raise this value to mask out darker elements in the scene.
              luminanceSmoothing={0} // smoothness of the luminance threshold. Range is [0, 1]
              mipmapBlur={true} // Enables or disables mipmap blur.
              resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
              resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
            />
            <Vignette
              offset={0.3} // vignette offset
              darkness={0.75} // vignette darkness
              eskil={false} // Eskil's vignette technique
              blendFunction={BlendFunction.NORMAL} // blend mode
            />
            <Glitch
              delay={new Vector2(1.5, 3.5)} // min and max glitch delay
              duration={new Vector2(0.1, 0.2)} // min and max glitch duration
              strength={new Vector2(0.1, 0.3)} // min and max glitch strength
              mode={GlitchMode.SPORADIC} // glitch mode
              active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
              ratio={0.99} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
            />
            <Pixelation
              granularity={5} // pixel granularity
            />
            <Autofocus />
          </EffectComposer>
          <color attach="background" args={["black"]} />
          <fog attach="fog" args={["black", 15, 20]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[0, 2, 0]} intensity={0.3} />
          <directionalLight position={[-50, 0, -40]} intensity={0.7} />
          <group position={[0, -1, 0]}>
            <VideoText position={[0, 1.3, -2]} />
            <Ground />
          </group>
          <Intro />
        </Canvas>
      </Suspense>
    </div>
  );
};

function VideoText(props: any) {
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: "/drei.mp4",
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    })
  );
  useEffect(() => void video.play(), [video]);
  return (
    <Text
      font={"/Inter-Bold.woff"}
      fontSize={3}
      letterSpacing={-0.06}
      {...props}
    >
      c0m
      <meshBasicMaterial toneMapped={false}>
        <videoTexture attach="map" args={[video]} />
      </meshBasicMaterial>
    </Text>
  );
}

function Ground() {
  const [floor, normal] = useTexture([
    "/surface-imperfections.jpg",
    "/surface-imperfections-2.jpg",
  ]);
  return (
    <Reflector
      blur={[400, 100]}
      resolution={512}
      args={[10, 10]}
      mirror={0.2}
      mixBlur={6}
      mixStrength={1.5}
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
    >
      {(Material: any, props) => (
        <Material
          color="#a0a0a0"
          metalness={0.9}
          roughnessMap={floor}
          normalMap={normal}
          normalScale={new Vector2(1, 1)}
          {...props}
        />
      )}
    </Reflector>
  );
}

function Intro() {
  const [vec] = useState(() => new Vector3());
  return useFrame((state) => {
    state.camera.position.lerp(
      vec.set(state.mouse.x * 5, 3 + state.mouse.y * 2, 14),
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });
}

export default HomeCanvas;
