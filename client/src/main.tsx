import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initSoundPreference } from "@/lib/sound";

initSoundPreference();
createRoot(document.getElementById("root")!).render(<App />);
