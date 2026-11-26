import { Suspense } from "react";
import Link from "next/link";
import { ambilDaftarLaporan, ambilSemuaKategori } from "@/lib/queries";
import type { StatusLaporan } from "@/lib/types";

function badgeStatus(status: StatusLaporan) {
  if (status === "selesai") return "bg-emerald-100 text-emerald-800";
  if (status === "diproses") return "bg-amber-100 text-amber-800";
  return "bg-sky-100 text-sky-800";
}

async function KontenDaftarLaporan({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [kategoriList, laporanList] = await Promise.all([
    ambilSemuaKategori(),
    ambilDaftarLaporan({
      kategoriId: params.kategori,
      status: params.status,
      q: params.q,
    }),
  ]);

  return (
    <>
      <form
        method="GET"
        className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4"
      >
        <input
          type="text"
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Cari judul, lokasi, kode..."
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />

        <select
          name="kategori"
          defaultValue={params.kategori ?? ""}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        >
          <option value="">Semua Kategori</option>
          {kategoriList.map((kat) => (
            <option key={kat.id} value={String(kat.id)}>
              {kat.nama}
            </option>
          ))}
        </select>

        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value="baru">Baru</option>
          <option value="diproses">Diproses</option>
          <option value="selesai">Selesai</option>
        </select>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Saring
          </button>
          <Link
            href="/laporan"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Reset
          </Link>
        </div>
      </form>

      {laporanList.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Tidak ada laporan yang sesuai dengan filter saat ini.
        </div>
      ) : (
        <div className="space-y-3">
          {laporanList.map((item) => (
            <Link
              key={item.id}
              href={`/laporan/${item.kode}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {item.kode}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    {item.kategori?.nama ?? "Umum"}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badgeStatus(
                    item.status,
                  )}`}
                >
                  {item.status}
                </span>
              </div>
              <h2 className="mt-2 text-base font-semibold text-slate-900">
                {item.judul}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                {item.deskripsi}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>Lokasi: {item.lokasi}</span>
                <span>{item.dukungan} dukungan</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function DaftarLaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; status?: string; q?: string }>;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Laporan
          </h1>
          <p className="text-sm text-slate-600">
            Saring laporan berdasarkan kategori, status, atau kata kunci.
          </p>
        </div>
        <Link
          href="/lapor"
          className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Buat Laporan
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Memuat daftar laporan...
          </div>
        }
      >
        <KontenDaftarLaporan searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
