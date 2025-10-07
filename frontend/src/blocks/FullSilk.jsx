import Silk from "../blocks/Silk.jsx";

export default function FullSilk() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
      <Silk
        speed={5}
        scale={1}
        color="#7B7481"
        noiseIntensity={1.5}
        rotation={0}
      />
    </div>
  );
}
