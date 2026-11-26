import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ambilLaporanByKode } from "@/lib/queries";
import { TombolDukung } from "./TombolDukung";
import type { StatusLaporan } from "@/lib/types";

function badgeStatus(status: StatusLaporan) {
  if (status === "selesai") return "bg-emerald-100 text-emerald-800";
  if (status === "diproses") return "bg-amber-100 text-amber-800";
  return "bg-sky-100 text-sky-800";
}

async function KontenDetailLaporan({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  const laporan = await ambilLaporanByKode(kode);

  if (!laporan) {
    notFound();
  }

  const cookieStore = await cookies();
  const daftarDidukung = (cookieStore.get("laporku_didukung")?.value ?? "")
    .split(",")
    .map((s) => s.trim().toUpperCase());
  const sudahDidukungAwal = daftarDidukung.includes(laporan.kode.toUpperCase());

  return (
    <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-slate-600">
            {laporan.kode}
          </span>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {laporan.kategori?.nama ?? "Umum"}
          </span>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeStatus(
            laporan.status,
          )}`}
        >
          {laporan.status}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {laporan.judul}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Lokasi:{" "}
          <strong className="font-medium text-slate-700">
            {laporan.lokasi}
          </strong>{" "}
          • Dilaporkan oleh:{" "}
          <strong className="font-medium text-slate-700">
            {laporan.pelapor}
          </strong>
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        {laporan.deskripsi}
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Tanggapan Petugas Sarpras
        </h2>
        {laporan.tanggapan ? (
          <p className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm text-slate-700">
            {laporan.tanggapan}
          </p>
        ) : (
          <p className="mt-1 text-sm italic text-slate-500">
            Belum ada tanggapan dari petugas.
          </p>
        )}
      </div>

      <div className="border-t border-slate-200 pt-4">
        <TombolDukung
          kode={laporan.kode}
          dukunganAwal={laporan.dukungan}
          sudahDidukungAwal={sudahDidukungAwal}
        />
      </div>
    </article>
  );
}

export default function DetailLaporanPage({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  return (
    <div className="space-y-6">
      <Link
        href="/laporan"
        className="inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Kembali ke Daftar Laporan
      </Link>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Memuat detail laporan...
          </div>
        }
      >
        <KontenDetailLaporan params={params} />
      </Suspense>
    </div>
  );
}
