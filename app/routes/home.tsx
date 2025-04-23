import type { Route } from "./+types/home";
import { MapDisplayer } from "../mapdisplayer/MapDisplayer";
import { Button, buttonVariants } from "~/components/ui/button";
import { useState } from "react";
import CustomMap from "~/customMap/CustomMap";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const maps = [
  "Johto-Kanto",
  "Hoenn",
  "Sinnoh",
  "Unova",
  "Unova2",
  "Kalos",
  "Alola",
];

export default function Home() {
  const [mapname, setMapName] = useState("Johto-Kanto");
  return (
    <>
      {maps.map((mapname) => (
        <Button key={mapname} onClick={() => setMapName(mapname)}>
          {mapname}
        </Button>
      ))}
      {/* <MapDisplayer mapType={mapname} /> */}
      <CustomMap/>
    </>
  );
}
