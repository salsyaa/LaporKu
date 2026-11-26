import { Suspense } from "react";
import Link from "next/link";
import { ambilLaporanByKode } from "@/lib/queries";
import type { StatusLaporan } from "@/lib/types";

function badgeStatus(status: StatusLaporan) {
  if (status === "selesai") return "bg-emerald-100 text-emerald-800";
  if (status === "diproses") return "bg-amber-100 text-amber-800";
  return "bg-sky-100 text-sky-800";
}

async function HasilLacak({
  searchParams,
}: {
  searchParams: Promise<{ kode?: string }>;
}) {
  const { kode } = await searchParams;
  const kataKode = kode?.trim() ?? "";
  const hasil = kataKode ? await ambilLaporanByKode(kataKode) : null;

  return (
    <>
      <form
        method="GET"
        className="flex gap-2 rounded-xl border border-slate-200 bg-white p-4"
      >
        <input
          type="text"
          name="kode"
          defaultValue={kataKode}
          placeholder="Contoh: LP-0001"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase focus:border-slate-900 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Lacak
        </button>
      </form>

      {kataKode && !hasil && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Laporan dengan kode{" "}
          <strong className="font-mono">{kataKode.toUpperCase()}</strong> tidak
          ditemukan.
        </div>
      )}

      {hasil && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm font-semibold text-slate-600">
              {hasil.kode}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeStatus(
                hasil.status,
              )}`}
            >
              {hasil.status}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{hasil.judul}</h2>
          <p className="text-sm text-slate-600">{hasil.deskripsi}</p>
          <p className="text-xs text-slate-500">
            Kategori: {hasil.kategori?.nama ?? "Umum"} • Lokasi: {hasil.lokasi}{" "}
            • Pelapor: {hasil.pelapor}
          </p>
          {hasil.tanggapan && (
            <div className="rounded-xl bg-slate-50 p-3.5 text-sm text-slate-700">
              <strong className="font-semibold">Tanggapan Petugas:</strong>{" "}
              {hasil.tanggapan}
            </div>
          )}
          <Link
            href={`/laporan/${hasil.kode}`}
            className="inline-block text-sm font-medium text-slate-900 underline"
          >
            Buka halaman detail & dukungan →
          </Link>
        </div>
      )}
    </>
  );
}

export default function LacakLaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ kode?: string }>;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Lacak Status Laporan
        </h1>
        <p className="text-sm text-slate-600">
          Masukkan kode laporan (contoh:{" "}
          <span className="font-mono">LP-0001</span>) untuk melihat
          perkembangan.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Memuat pencarian kode...
          </div>
        }
      >
        <HasilLacak searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
