import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/session";
import { ambilSemuaKategori } from "@/lib/queries";
import { DaftarKategoriAdmin } from "./DaftarKategoriAdmin";

async function KontenKategoriAdmin() {
  const bolehMasuk = await isAdminAuthenticated();
  if (!bolehMasuk) {
    redirect("/login");
  }

  const kategoriList = await ambilSemuaKategori();
  return <DaftarKategoriAdmin kategoriList={kategoriList} />;
}

export default function AdminKategoriPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola Kategori
          </h1>
          <p className="text-sm text-slate-600">
            Tambah kategori baru atau hapus kategori yang belum dipakai laporan.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Kembali
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Memuat data kategori...
          </div>
        }
      >
        <KontenKategoriAdmin />
      </Suspense>
    </div>
  );
}
