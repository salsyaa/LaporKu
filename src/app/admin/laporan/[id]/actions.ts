"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase";
import type { StatusLaporan } from "@/lib/types";

const URUTAN_STATUS: Record<StatusLaporan, number> = {
  baru: 1,
  diproses: 2,
  selesai: 3,
};

export interface AdminLaporanState {
  error?: string;
  sukses?: string;
}

export async function perbaruiLaporanAdminAction(
  id: number,
  _prevState: AdminLaporanState,
  formData: FormData,
): Promise<AdminLaporanState> {
  const boleh = await isAdminAuthenticated();
  if (!boleh) {
    return { error: "Akses ditolak. Silakan login admin terlebih dahulu." };
  }

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "ID laporan tidak valid." };
  }

  const statusInput = String(
    formData.get("status") ?? "",
  ).trim() as StatusLaporan;
  const tanggapan = String(formData.get("tanggapan") ?? "").trim();

  if (!["baru", "diproses", "selesai"].includes(statusInput)) {
    return { error: "Pilihan status tidak valid." };
  }

  const supabase = createAdminClient();
  const { data: saatIni, error: errAmbil } = await supabase
    .from("laporan")
    .select("id, kode, status, tanggapan")
    .eq("id", id)
    .maybeSingle();

  if (errAmbil || !saatIni) {
    return { error: "Laporan tidak ditemukan." };
  }

  const statusLama = saatIni.status as StatusLaporan;
  const selisihTingkat = URUTAN_STATUS[statusInput] - URUTAN_STATUS[statusLama];

  // Status hanya boleh maju satu tingkat: baru -> diproses -> selesai
  if (selisihTingkat < 0) {
    return {
      error: `Status tidak boleh mundur dari "${statusLama}" ke "${statusInput}".`,
    };
  }
  if (selisihTingkat > 1) {
    return {
      error: `Status tidak boleh meloncat langsung dari "${statusLama}" ke "${statusInput}".`,
    };
  }

  if (statusInput === "selesai" && tanggapan.length < 10) {
    return {
      error: "Status selesai wajib menyertakan tanggapan minimal 10 huruf.",
    };
  }

  const { error: errUpdate } = await supabase
    .from("laporan")
    .update({
      status: statusInput,
      tanggapan: tanggapan.length > 0 ? tanggapan : null,
    })
    .eq("id", id);

  if (errUpdate) {
    return {
      error: "Gagal memperbarui laporan. Periksa kembali aturan tanggapan.",
    };
  }

  revalidatePath("/");
  revalidatePath("/laporan");
  revalidatePath(`/laporan/${saatIni.kode}`);
  revalidatePath("/admin");
  revalidatePath(`/admin/laporan/${id}`);

  return { sukses: "Perubahan status dan tanggapan berhasil disimpan." };
}

export async function hapusLaporanAdminAction(id: number): Promise<void> {
  const boleh = await isAdminAuthenticated();
  if (!boleh) {
    redirect("/login");
  }

  if (!Number.isInteger(id) || id <= 0) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const { data: target } = await supabase
    .from("laporan")
    .select("kode")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("laporan").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/laporan");
  if (target?.kode) {
    revalidatePath(`/laporan/${target.kode}`);
  }
  revalidatePath("/admin");
  redirect("/admin");
}
