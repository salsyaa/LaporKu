"use client";

import { useActionState } from "react";
import {
  hapusKategoriAction,
  tambahKategoriAction,
  type KategoriActionState,
} from "./actions";
import type { Kategori } from "@/lib/types";

const initialState: KategoriActionState = {};

function BarisKategori({ kategori }: { kategori: Kategori }) {
  const boundHapus = hapusKategoriAction.bind(null, kategori.id);
  const [state, formAction, isPending] = useActionState(
    boundHapus,
    initialState,
  );

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="font-medium text-slate-900">{kategori.nama}</span>
        {state.error && (
          <p className="mt-1 text-xs text-rose-600">{state.error}</p>
        )}
        {state.sukses && (
          <p className="mt-1 text-xs text-emerald-700">{state.sukses}</p>
        )}
      </div>
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
        >
          {isPending ? "Menghapus..." : "Hapus"}
        </button>
      </form>
    </div>
  );
}

export function DaftarKategoriAdmin({
  kategoriList,
}: {
  kategoriList: Kategori[];
}) {
  const [stateTambah, formTambah, isPendingTambah] = useActionState(
    tambahKategoriAction,
    initialState,
  );

  return (
    <div className="space-y-6">
      <form
        action={formTambah}
        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <label
          htmlFor="nama-kategori"
          className="block text-sm font-medium text-slate-800"
        >
          Tambah Kategori Baru (3–30 huruf)
        </label>
        <div className="flex gap-2">
          <input
            id="nama-kategori"
            name="nama"
            type="text"
            placeholder="Contoh: Jaringan & Wi-Fi"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPendingTambah}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {isPendingTambah ? "Menyimpan..." : "Tambah"}
          </button>
        </div>
        {stateTambah.error && (
          <p className="text-xs text-rose-600">{stateTambah.error}</p>
        )}
        {stateTambah.sukses && (
          <p className="text-xs text-emerald-700">{stateTambah.sukses}</p>
        )}
      </form>

      <div className="space-y-2.5">
        <h2 className="text-sm font-semibold text-slate-700">
          Daftar Kategori Saat Ini
        </h2>
        {kategoriList.map((kat) => (
          <BarisKategori key={kat.id} kategori={kat} />
        ))}
      </div>
    </div>
  );
}
