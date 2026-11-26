import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-slate-900"
        >
          LaporKu
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
          <Link href="/" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
            Beranda
          </Link>
          <Link
            href="/laporan"
            className="rounded-lg px-3 py-1.5 hover:bg-slate-100"
          >
            Daftar Laporan
          </Link>
          <Link
            href="/lapor"
            className="rounded-lg px-3 py-1.5 hover:bg-slate-100"
          >
            Buat Laporan
          </Link>
          <Link
            href="/lacak"
            className="rounded-lg px-3 py-1.5 hover:bg-slate-100"
          >
            Lacak Kode
          </Link>
          <Link
            href="/admin"
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
