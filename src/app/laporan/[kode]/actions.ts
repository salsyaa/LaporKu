"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase";

const COOKIE_DUKUNGAN = "laporku_didukung";

export interface AksiDukungState {
  error?: string;
  sukses?: boolean;
}

export async function dukungLaporanAction(
  kode: string,
  _prevState: AksiDukungState,
): Promise<AksiDukungState> {
  void _prevState;
  const bersih = kode.trim().toUpperCase();
  if (!/^LP-\d{4,}$/.test(bersih)) {
    return { error: "Kode laporan tidak valid." };
  }

  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(COOKIE_DUKUNGAN)?.value ?? "";
  const daftarDidukung = rawCookie
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  if (daftarDidukung.includes(bersih)) {
    return { error: "Anda sudah pernah mendukung laporan ini." };
  }

  const supabase = createAdminClient();
  const { data: laporan, error: errCari } = await supabase
    .from("laporan")
    .select("id, kode, dukungan")
    .eq("kode", bersih)
    .maybeSingle();

  if (errCari || !laporan) {
    return { error: "Laporan tidak ditemukan." };
  }

  const dukunganBaru = Number(laporan.dukungan ?? 0) + 1;
  const { error: errUpdate } = await supabase
    .from("laporan")
    .update({ dukungan: dukunganBaru })
    .eq("id", laporan.id);

  if (errUpdate) {
    return { error: "Gagal mencatat dukungan. Silakan coba lagi." };
  }

  const daftarBaru = [...daftarDidukung, bersih];
  cookieStore.set(COOKIE_DUKUNGAN, daftarBaru.join(","), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/");
  revalidatePath("/laporan");
  revalidatePath(`/laporan/${bersih}`);

  return { sukses: true };
}
