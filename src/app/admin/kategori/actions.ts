"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase";

export interface KategoriActionState {
  error?: string;
  sukses?: string;
}

export async function tambahKategoriAction(
  _prevState: KategoriActionState,
  formData: FormData,
): Promise<KategoriActionState> {
  const boleh = await isAdminAuthenticated();
  if (!boleh) {
    return { error: "Akses ditolak. Silakan login admin terlebih dahulu." };
  }

  const nama = String(formData.get("nama") ?? "").trim();
  if (nama.length < 3 || nama.length > 30) {
    return { error: "Nama kategori harus terdiri dari 3 sampai 30 huruf." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("kategori").insert({ nama });

  if (error) {
    if (error.code === "23505") {
      return { error: "Kategori dengan nama tersebut sudah ada." };
    }
    return { error: "Gagal menambahkan kategori baru." };
  }

  revalidatePath("/lapor");
  revalidatePath("/laporan");
  revalidatePath("/admin/kategori");

  return { sukses: `Kategori "${nama}" berhasil ditambahkan.` };
}

export async function hapusKategoriAction(
  id: number,
  _prevState: KategoriActionState,
): Promise<KategoriActionState> {
  void _prevState;
  const boleh = await isAdminAuthenticated();
  if (!boleh) {
    return { error: "Akses ditolak. Silakan login admin terlebih dahulu." };
  }

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "ID kategori tidak valid." };
  }

  const supabase = createAdminClient();
  const { count, error: errCek } = await supabase
    .from("laporan")
    .select("id", { count: "exact", head: true })
    .eq("kategori_id", id);

  if (errCek) {
    return { error: "Gagal memeriksa keterkaitan kategori dengan laporan." };
  }

  if ((count ?? 0) > 0) {
    return {
      error:
        "Kategori tidak dapat dihapus karena masih digunakan oleh laporan yang ada.",
    };
  }

  const { error: errHapus } = await supabase
    .from("kategori")
    .delete()
    .eq("id", id);
  if (errHapus) {
    return {
      error:
        "Kategori tidak dapat dihapus karena masih dipakai laporan atau sedang digunakan.",
    };
  }

  revalidatePath("/lapor");
  revalidatePath("/laporan");
  revalidatePath("/admin/kategori");

  return { sukses: "Kategori berhasil dihapus." };
}
