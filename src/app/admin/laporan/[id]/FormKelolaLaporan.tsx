"use client";

import { useActionState } from "react";
import {
  hapusLaporanAdminAction,
  perbaruiLaporanAdminAction,
  type AdminLaporanState,
} from "./actions";
import type { StatusLaporan } from "@/lib/types";

const initialState: AdminLaporanState = {};

export function FormKelolaLaporan({
  id,
  statusSaatIni,
  tanggapanSaatIni,
}: {
  id: number;
  statusSaatIni: StatusLaporan;
  tanggapanSaatIni: string | null;
}) {
  const boundUpdate = perbaruiLaporanAdminAction.bind(null, id);
  const boundDelete = hapusLaporanAdminAction.bind(null, id);
  const [state, formAction, isPending] = useActionState(
    boundUpdate,
    initialState,
  );

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <form action={formAction} className="space-y-4">
        {state.error && (
          <div
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            role="alert"
          >
            {state.error}
          </div>
        )}
        {state.sukses && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {state.sukses}
          </div>
        )}

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-slate-800"
          >
            Status Laporan (hanya boleh maju: baru → diproses → selesai)
          </label>
          <select
            id="status"
            name="status"
            defaultValue={statusSaatIni}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          >
            <option value="baru">Baru</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="tanggapan"
            className="block text-sm font-medium text-slate-800"
          >
            Tanggapan Petugas (wajib minimal 10 huruf jika status Selesai)
          </label>
          <textarea
            id="tanggapan"
            name="tanggapan"
            rows={4}
            defaultValue={tanggapanSaatIni ?? ""}
            placeholder="Tuliskan tindakan perbaikan atau keterangan petugas..."
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>

      <div className="border-t border-slate-200 pt-4">
        <form action={boundDelete}>
          <button
            type="submit"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
          >
            Hapus Laporan Ini
          </button>
        </form>
      </div>
    </div>
  );
}
