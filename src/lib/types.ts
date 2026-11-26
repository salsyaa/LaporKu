export type StatusLaporan = "baru" | "diproses" | "selesai";

export interface Kategori {
  id: number;
  nama: string;
}

export interface Laporan {
  id: number;
  kode: string;
  kategori_id: number;
  judul: string;
  deskripsi: string;
  lokasi: string;
  pelapor: string;
  status: StatusLaporan;
  tanggapan: string | null;
  dukungan: number;
  dibuat: string;
  diperbarui: string;
  kategori?: {
    id: number;
    nama: string;
  } | null;
}

export interface RingkasanStatus {
  total: number;
  baru: number;
  diproses: number;
  selesai: number;
}
