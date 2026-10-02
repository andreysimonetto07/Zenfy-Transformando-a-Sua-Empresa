import { redirect } from "next/navigation";

export default function TrafegoPage() {
  redirect("/cliente/resultados?tab=meta&period=30");
}
