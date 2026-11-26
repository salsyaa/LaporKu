"use client";

import { useActionState } from "react";
import { dukungLaporanAction, type AksiDukungState } from "./actions";

const initialState: AksiDukungState = {};

export function TombolDukung({
  kode,
  dukunganAwal,
  sudahDidukungAwal,
}: {
  kode: string;
  dukunganAwal: number;
  sudahDidukungAwal: boolean;
}) {
  const boundAction = dukungLaporanAction.bind(null, kode);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );

  const sudahDidukung = sudahDidukungAwal || Boolean(state.sukses);
  const jumlahTampil = dukunganAwal + (state.sukses ? 1 : 0);

  return (
    <div className="space-y-2">
      <form action={formAction} className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || sudahDidukung}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
        >
          {sudahDidukung
            ? "Sudah Didukung"
            : isPending
              ? "Mengirim..."
              : "Dukung Laporan"}
        </button>
        <span className="text-sm font-medium text-slate-700">
          {jumlahTampil} dukungan
        </span>
      </form>

      {state.error && (
        <p className="text-sm text-rose-600" role="alert">
          {state.error}
        </p>
      )}
      {state.sukses && (
        <p className="text-sm text-emerald-700">
          Terima kasih, dukungan Anda telah tercatat.
        </p>
      )}
    </div>
  );
}
