import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/session";
import { ambilDaftarLaporan } from "@/lib/queries";
import { TombolLogout } from "@/components/TombolLogout";
import type { StatusLaporan } from "@/lib/types";

function badgeStatus(status: StatusLaporan) {
  if (status === "selesai") return "bg-emerald-100 text-emerald-800";
  if (status === "diproses") return "bg-amber-100 text-amber-800";
  return "bg-sky-100 text-sky-800";
}

async function TabelLaporanAdmin() {
  const bolehMasuk = await isAdminAuthenticated();
  if (!bolehMasuk) {
    redirect("/login");
  }

  const daftarLaporan = await ambilDaftarLaporan({});

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
          <tr>
            <th className="px-4 py-3">Kode</th>
            <th className="px-4 py-3">Judul & Lokasi</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Dukungan</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {daftarLaporan.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/70">
              <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-600">
                {item.kode}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{item.judul}</p>
                <p className="text-xs text-slate-500">
                  {item.lokasi} • Pelapor: {item.pelapor}
                </p>
              </td>
              <td className="px-4 py-3 text-slate-700">
                {item.kategori?.nama ?? "Umum"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badgeStatus(
                    item.status,
                  )}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-700">{item.dukungan}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/laporan/${item.id}`}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                >
                  Kelola
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Panel Admin Sarpras
          </h1>
          <p className="text-sm text-slate-600">
            Kelola status laporan, tanggapan petugas, dan kategori fasilitas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/kategori"
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Kelola Kategori
          </Link>
          <TombolLogout />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Memuat daftar laporan admin...
          </div>
        }
      >
        <TabelLaporanAdmin />
      </Suspense>
    </div>
  );
}
