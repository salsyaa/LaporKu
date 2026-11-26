"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase";

export interface FieldErrorsLapor {
  kategori_id?: string;
  judul?: string;
  deskripsi?: string;
  lokasi?: string;
  pelapor?: string;
}

export interface FormLaporState {
  errorUmum?: string;
  fieldErrors?: FieldErrorsLapor;
  values?: {
    kategori_id: string;
    judul: string;
    deskripsi: string;
    lokasi: string;
    pelapor: string;
  };
}

export async function buatLaporanAction(
  _prevState: FormLaporState,
  formData: FormData,
): Promise<FormLaporState> {
  const kategoriRaw = String(formData.get("kategori_id") ?? "").trim();
  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim();
  const lokasi = String(formData.get("lokasi") ?? "").trim();
  const pelapor = String(formData.get("pelapor") ?? "").trim();

  const values = {
    kategori_id: kategoriRaw,
    judul,
    deskripsi,
    lokasi,
    pelapor,
  };

  const fieldErrors: FieldErrorsLapor = {};

  if (!/^\d+$/.test(kategoriRaw)) {
    fieldErrors.kategori_id = "Silakan pilih kategori kerusakan.";
  }
  if (judul.length < 5 || judul.length > 80) {
    fieldErrors.judul = "Judul harus terdiri dari 5 sampai 80 huruf.";
  }
  if (deskripsi.length < 10 || deskripsi.length > 500) {
    fieldErrors.deskripsi = "Deskripsi harus terdiri dari 10 sampai 500 huruf.";
  }
  if (lokasi.length < 3 || lokasi.length > 60) {
    fieldErrors.lokasi = "Lokasi harus terdiri dari 3 sampai 60 huruf.";
  }
  if (pelapor.length < 3 || pelapor.length > 40) {
    fieldErrors.pelapor = "Nama pelapor harus terdiri dari 3 sampai 40 huruf.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  const supabase = createAdminClient();

  const { data: kat } = await supabase
    .from("kategori")
    .select("id")
    .eq("id", Number(kategoriRaw))
    .maybeSingle();

  if (!kat) {
    return {
      fieldErrors: { kategori_id: "Kategori yang dipilih tidak tersedia." },
      values,
    };
  }

  // Cek batas maksimal 3 laporan berstatus "baru" per pelapor (case-insensitive)
  const { data: laporanPelapor, error: errCek } = await supabase
    .from("laporan")
    .select("id, pelapor, status")
    .eq("status", "baru");

  if (errCek) {
    return {
      errorUmum: "Gagal memeriksa batas laporan pelapor. Silakan coba lagi.",
      values,
    };
  }

  const jumlahBaruPelapor = (laporanPelapor ?? []).filter(
    (row) =>
      String(row.pelapor ?? "")
        .trim()
        .toLowerCase() === pelapor.toLowerCase(),
  ).length;

  if (jumlahBaruPelapor >= 3) {
    return {
      fieldErrors: {
        pelapor:
          "Nama pelapor ini sudah memiliki 3 laporan berstatus baru. Tunggu hingga laporan diproses atau selesai.",
      },
      values,
    };
  }

  const kodeSementara = `TEMP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const { data: dibuat, error: errInsert } = await supabase
    .from("laporan")
    .insert({
      kode: kodeSementara,
      kategori_id: Number(kategoriRaw),
      judul,
      deskripsi,
      lokasi,
      pelapor,
      status: "baru",
      tanggapan: null,
      dukungan: 0,
    })
    .select("kode")
    .single();

  if (errInsert || !dibuat) {
    return {
      errorUmum: "Laporan gagal disimpan. Pastikan semua isian sesuai aturan.",
      values,
    };
  }

  revalidatePath("/");
  revalidatePath("/laporan");
  redirect(`/laporan/${dibuat.kode}`);
}
