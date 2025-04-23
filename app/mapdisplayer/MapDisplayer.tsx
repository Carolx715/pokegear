import { SinnohMap } from "~/maps/SinnohMap";
import { JohtoKantoMap } from "~/maps/JohtoKantoMap";
import { Unova2Map } from "~/maps/Unova2Map";
import { HoennMap } from "~/maps/HoennMap";
import { KalosMap } from "~/maps/KalosMap";
import { AlolaMap } from "~/maps/AlolaMap";
import { UnovaMap } from "~/maps/UnovaMap";

interface MapDisplayerProps {
  mapType: String; // Add all valid map types here
}

export function MapDisplayer({ mapType }: MapDisplayerProps) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="block">
        {mapType === "Johto-Kanto" && <JohtoKantoMap />}
        {mapType === "Hoenn" && <HoennMap />}
        {mapType === "Sinnoh" && <SinnohMap />}
        {mapType === "Unova" && <UnovaMap />}
        {mapType === "Unova2" && <Unova2Map />}
        {mapType === "Kalos" && <KalosMap />}
        {mapType === "Alola" && <AlolaMap />}
      </div>
    </main>
  );
}
