import { createAdminClient, createPublicClient } from "./supabase";
import type { Kategori, Laporan, RingkasanStatus } from "./types";

export async function ambilSemuaKategori(): Promise<Kategori[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("kategori")
    .select("id, nama")
    .order("nama", { ascending: true });

  if (error) {
    throw new Error(`Gagal memuat kategori: ${error.message}`);
  }

  return data ?? [];
}

export async function ambilRingkasanBeranda(): Promise<{
  ringkasan: RingkasanStatus;
  terbaru: Laporan[];
}> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("laporan")
    .select(
      "id, kode, kategori_id, judul, deskripsi, lokasi, pelapor, status, tanggapan, dukungan, dibuat, diperbarui, kategori:kategori_id(id, nama)",
    )
    .order("dibuat", { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat ringkasan laporan: ${error.message}`);
  }

  const semua = (data ?? []) as unknown as Laporan[];
  const ringkasan: RingkasanStatus = {
    total: semua.length,
    baru: semua.filter((item) => item.status === "baru").length,
    diproses: semua.filter((item) => item.status === "diproses").length,
    selesai: semua.filter((item) => item.status === "selesai").length,
  };

  return {
    ringkasan,
    terbaru: semua.slice(0, 6),
  };
}

export async function ambilDaftarLaporan(filter: {
  kategoriId?: string;
  status?: string;
  q?: string;
}): Promise<Laporan[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("laporan")
    .select(
      "id, kode, kategori_id, judul, deskripsi, lokasi, pelapor, status, tanggapan, dukungan, dibuat, diperbarui, kategori:kategori_id(id, nama)",
    )
    .order("dibuat", { ascending: false });

  if (filter.kategoriId && /^\d+$/.test(filter.kategoriId)) {
    query = query.eq("kategori_id", Number(filter.kategoriId));
  }

  if (
    filter.status &&
    ["baru", "diproses", "selesai"].includes(filter.status.toLowerCase())
  ) {
    query = query.eq("status", filter.status.toLowerCase());
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Gagal memuat daftar laporan: ${error.message}`);
  }

  let hasil = (data ?? []) as unknown as Laporan[];
  const kataKunci = filter.q?.trim().toLowerCase();

  if (kataKunci) {
    hasil = hasil.filter(
      (item) =>
        item.judul.toLowerCase().includes(kataKunci) ||
        item.deskripsi.toLowerCase().includes(kataKunci) ||
        item.lokasi.toLowerCase().includes(kataKunci) ||
        item.kode.toLowerCase().includes(kataKunci),
    );
  }

  return hasil;
}

export async function ambilLaporanByKode(
  kode: string,
): Promise<Laporan | null> {
  const bersih = kode.trim().toUpperCase();
  if (!/^LP-\d{4,}$/.test(bersih)) {
    return null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("laporan")
    .select(
      "id, kode, kategori_id, judul, deskripsi, lokasi, pelapor, status, tanggapan, dukungan, dibuat, diperbarui, kategori:kategori_id(id, nama)",
    )
    .eq("kode", bersih)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal memuat detail laporan: ${error.message}`);
  }

  return (data as unknown as Laporan | null) ?? null;
}
