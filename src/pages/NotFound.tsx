import { useNavigate } from "react-router-dom";
import { Tile } from "@/components/Tile";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="screen grid place-items-center" style={{ minHeight: "100vh" }}>
      <div className="text-center grid gap-5" style={{ width: 280 }}>
        <p className="text-2xl font-semibold">This page isn't here</p>
        <Tile label="Go home" symbol="🏠" size="lg" tone="talk" onSelect={() => navigate("/")} />
      </div>
    </main>
  );
}
