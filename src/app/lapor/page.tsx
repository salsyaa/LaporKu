import { Suspense } from "react";
import { ambilSemuaKategori } from "@/lib/queries";
import { FormLaporan } from "./FormLaporan";

async function KontenBuatLaporan() {
  const kategoriList = await ambilSemuaKategori();
  return <FormLaporan kategoriList={kategoriList} />;
}

export default function BuatLaporanPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Buat Laporan Kerusakan
        </h1>
        <p className="text-sm text-slate-600">
          Isi formulir berikut untuk melaporkan kerusakan fasilitas sekolah.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Memuat formulir laporan...
          </div>
        }
      >
        <KontenBuatLaporan />
      </Suspense>
    </div>
  );
}
