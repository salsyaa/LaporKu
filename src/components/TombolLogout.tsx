import { logoutAdminAction } from "@/app/login/actions";

export function TombolLogout() {
  return (
    <form action={logoutAdminAction}>
      <button
        type="submit"
        className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-100"
      >
        Keluar
      </button>
    </form>
  );
}
