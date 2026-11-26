import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/session";
import { FormLogin } from "./FormLogin";

async function KontenLogin() {
  const sudahLogin = await isAdminAuthenticated();
  if (sudahLogin) {
    redirect("/admin");
  }
  return <FormLogin />;
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 pt-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Login Admin
        </h1>
        <p className="text-sm text-slate-600">
          Masuk untuk mengelola laporan dan kategori fasilitas sekolah.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Memeriksa sesi...
          </div>
        }
      >
        <KontenLogin />
      </Suspense>
    </div>
  );
}
