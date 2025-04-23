import johtokanto from "./Johto-Kanto.png";

export function JohtoKantoMap() {
  return (
    <div className="outline-10 outline-cyan-500 w-[1000px] max-w-[200vw] p-4">
      <img src={johtokanto} alt="React Router" className="block w-full" />
    </div>
  );
}
