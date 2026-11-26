"use client";

import { useActionState } from "react";
import { loginAdminAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function FormLogin() {
  const [state, formAction, isPending] = useActionState(
    loginAdminAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {state.error && (
        <div
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          role="alert"
        >
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-800"
        >
          Kata Sandi Admin
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Masukkan kata sandi petugas sarpras"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isPending ? "Memverifikasi..." : "Masuk ke Panel Admin"}
      </button>
    </form>
  );
}
