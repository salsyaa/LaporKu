"use client";

import { useActionState } from "react";
import { buatLaporanAction, type FormLaporState } from "./actions";
import type { Kategori } from "@/lib/types";

const initialState: FormLaporState = {};

export function FormLaporan({ kategoriList }: { kategoriList: Kategori[] }) {
  const [state, formAction, isPending] = useActionState(
    buatLaporanAction,
    initialState,
  );
  const v = state.values;
  const fe = state.fieldErrors;

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {state.errorUmum && (
        <div
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          role="alert"
        >
          {state.errorUmum}
        </div>
      )}

      <div>
        <label
          htmlFor="kategori_id"
          className="block text-sm font-medium text-slate-800"
        >
          Kategori Kerusakan <span className="text-rose-600">*</span>
        </label>
        <select
          id="kategori_id"
          name="kategori_id"
          defaultValue={v?.kategori_id ?? ""}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        >
          <option value="">-- Pilih Kategori --</option>
          {kategoriList.map((k) => (
            <option key={k.id} value={String(k.id)}>
              {k.nama}
            </option>
          ))}
        </select>
        {fe?.kategori_id && (
          <p className="mt-1 text-xs text-rose-600">{fe.kategori_id}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="judul"
          className="block text-sm font-medium text-slate-800"
        >
          Judul Laporan (5–80 huruf) <span className="text-rose-600">*</span>
        </label>
        <input
          id="judul"
          name="judul"
          type="text"
          defaultValue={v?.judul ?? ""}
          placeholder="Contoh: AC ruang kelas 10A tidak dingin"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
        {fe?.judul && <p className="mt-1 text-xs text-rose-600">{fe.judul}</p>}
      </div>

      <div>
        <label
          htmlFor="lokasi"
          className="block text-sm font-medium text-slate-800"
        >
          Lokasi Fasilitas (3–60 huruf) <span className="text-rose-600">*</span>
        </label>
        <input
          id="lokasi"
          name="lokasi"
          type="text"
          defaultValue={v?.lokasi ?? ""}
          placeholder="Contoh: Ruang Kelas 10A"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
        {fe?.lokasi && (
          <p className="mt-1 text-xs text-rose-600">{fe.lokasi}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="pelapor"
          className="block text-sm font-medium text-slate-800"
        >
          Nama Pelapor (3–40 huruf) <span className="text-rose-600">*</span>
        </label>
        <input
          id="pelapor"
          name="pelapor"
          type="text"
          defaultValue={v?.pelapor ?? ""}
          placeholder="Contoh: Raka Pratama"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
        {fe?.pelapor && (
          <p className="mt-1 text-xs text-rose-600">{fe.pelapor}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="deskripsi"
          className="block text-sm font-medium text-slate-800"
        >
          Deskripsi Kerusakan (10–500 huruf){" "}
          <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={4}
          defaultValue={v?.deskripsi ?? ""}
          placeholder="Jelaskan kondisi kerusakan secara singkat dan jelas..."
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
        {fe?.deskripsi && (
          <p className="mt-1 text-xs text-rose-600">{fe.deskripsi}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isPending ? "Mengirim Laporan..." : "Kirim Laporan"}
      </button>
    </form>
  );
}
