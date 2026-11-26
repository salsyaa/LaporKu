import { Suspense } from "react";
import Link from "next/link";
import { ambilRingkasanBeranda } from "@/lib/queries";
import type { StatusLaporan } from "@/lib/types";

function badgeStatus(status: StatusLaporan) {
  if (status === "selesai") return "bg-emerald-100 text-emerald-800";
  if (status === "diproses") return "bg-amber-100 text-amber-800";
  return "bg-sky-100 text-sky-800";
}

async function KontenBeranda() {
  const { ringkasan, terbaru } = await ambilRingkasanBeranda();

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              LaporKu — Pelaporan Kerusakan Fasilitas Sekolah
            </h1>
            <p className="text-sm text-slate-600">
              Laporkan fasilitas sekolah yang bermasalah dan pantau proses
              perbaikannya secara terbuka.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/lapor"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Buat Laporan
            </Link>
            <Link
              href="/lacak"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Lacak Kode
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Total Laporan</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {ringkasan.total}
            </p>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4">
            <p className="text-xs font-medium text-sky-700">Baru</p>
            <p className="mt-1 text-2xl font-bold text-sky-900">
              {ringkasan.baru}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <p className="text-xs font-medium text-amber-700">Diproses</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">
              {ringkasan.diproses}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-xs font-medium text-emerald-700">Selesai</p>
            <p className="mt-1 text-2xl font-bold text-emerald-900">
              {ringkasan.selesai}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Laporan Terbaru
          </h2>
          <Link
            href="/laporan"
            className="text-sm font-medium text-slate-700 hover:underline"
          >
            Lihat semua →
          </Link>
        </div>

        {terbaru.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Belum ada laporan yang tercatat.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {terbaru.map((item) => (
              <Link
                key={item.id}
                href={`/laporan/${item.kode}`}
                className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {item.kode}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badgeStatus(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">
                  {item.judul}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {item.deskripsi}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>
                    {item.kategori?.nama ?? "Umum"} • {item.lokasi}
                  </span>
                  <span>{item.dukungan} dukungan</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default function BerandaPage() {
  return (
    <div className="space-y-8">
      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Memuat ringkasan laporan...
          </div>
        }
      >
        <KontenBeranda />
      </Suspense>
    </div>
  );
}
