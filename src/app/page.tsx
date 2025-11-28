import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export default async function Home() {
  const user = await api.auth.me();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
