import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase";
import { FormKelolaLaporan } from "./FormKelolaLaporan";
import type { Laporan } from "@/lib/types";

async function KontenAdminDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const bolehMasuk = await isAdminAuthenticated();
  if (!bolehMasuk) {
    redirect("/login");
  }

  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("laporan")
    .select(
      "id, kode, kategori_id, judul, deskripsi, lokasi, pelapor, status, tanggapan, dukungan, dibuat, diperbarui, kategori:kategori_id(id, nama)",
    )
    .eq("id", Number(id))
    .maybeSingle();

  const laporan = data as unknown as Laporan | null;
  if (!laporan) {
    notFound();
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-slate-600">
            {laporan.kode}
          </span>
          <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">
            {laporan.kategori?.nama ?? "Umum"}
          </span>
        </div>
        <h1 className="mt-2 text-xl font-bold text-slate-900">
          {laporan.judul}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Lokasi: {laporan.lokasi} • Pelapor: {laporan.pelapor} •{" "}
          {laporan.dukungan} dukungan
        </p>
        <p className="mt-3 rounded-xl bg-slate-50 p-3.5 text-sm text-slate-700">
          {laporan.deskripsi}
        </p>
      </div>

      <FormKelolaLaporan
        id={laporan.id}
        statusSaatIni={laporan.status}
        tanggapanSaatIni={laporan.tanggapan}
      />
    </>
  );
}

export default function AdminDetailLaporanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/admin"
        className="inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Kembali ke Panel Admin
      </Link>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Memuat detail laporan...
          </div>
        }
      >
        <KontenAdminDetail params={params} />
      </Suspense>
    </div>
  );
}
