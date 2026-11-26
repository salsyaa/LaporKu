-- 1. Tabel kategori
create table if not exists public.kategori (
  id bigint generated always as identity primary key,
  nama text not null unique check (char_length(btrim(nama)) between 3 and 30)
);

-- 2. Tabel laporan
create table if not exists public.laporan (
  id bigint generated always as identity primary key,
  kode text not null unique,
  kategori_id bigint not null references public.kategori(id) on delete restrict,
  judul text not null check (char_length(btrim(judul)) between 5 and 80),
  deskripsi text not null check (char_length(btrim(deskripsi)) between 10 and 500),
  lokasi text not null check (char_length(btrim(lokasi)) between 3 and 60),
  pelapor text not null check (char_length(btrim(pelapor)) between 3 and 40),
  status text not null default 'baru' check (status in ('baru', 'diproses', 'selesai')),
  tanggapan text,
  dukungan integer not null default 0 check (dukungan >= 0),
  dibuat timestamptz not null default now(),
  diperbarui timestamptz not null default now(),
  constraint cek_selesai_tanggapan check (
    status <> 'selesai'
    or char_length(btrim(coalesce(tanggapan, ''))) >= 10
  )
);

-- 3. Pembentukan kode otomatis LP-0001 dari id setelah insert
create or replace function public.set_kode_laporan()
returns trigger
language plpgsql
as $$
begin
  new.kode := 'LP-' || lpad(new.id::text, 4, '0');
  new.diperbarui := now();
  return new;
end;
$$;

drop trigger if exists trg_laporan_kode on public.laporan;
create trigger trg_laporan_kode
before insert or update on public.laporan
for each row
execute function public.set_kode_laporan();

-- 4. Lapis 1 (Revoke izin kunci publik) & Lapis 2 (RLS + policy)
revoke all on public.kategori from anon, authenticated;
revoke all on public.laporan from anon, authenticated;

alter table public.kategori enable row level security;
alter table public.laporan enable row level security;

-- Kunci publik (anon/authenticated): hanya boleh baca kategori
grant select on public.kategori to anon, authenticated;

drop policy if exists "kategori boleh dibaca siapa saja" on public.kategori;
create policy "kategori boleh dibaca siapa saja"
  on public.kategori
  for select
  to anon, authenticated
  using (true);

-- Kunci rahasia (service_role) tetap punya akses penuh di server
grant all on public.kategori to service_role;
grant all on public.laporan to service_role;

-- 5. Data contoh: 5 kategori & 10 laporan (campuran baru, diproses, selesai)
insert into public.kategori (nama) values
  ('Pendingin Ruangan'),
  ('Proyektor & Audio'),
  ('Sanitasi & Air'),
  ('Meubel Kelas'),
  ('Pencahayaan')
on conflict (nama) do nothing;

insert into public.laporan (kategori_id, judul, deskripsi, lokasi, pelapor, status, tanggapan, dukungan)
select
  k.id,
  v.judul,
  v.deskripsi,
  v.lokasi,
  v.pelapor,
  v.status,
  v.tanggapan,
  v.dukungan
from (
  values
    ('Pendingin Ruangan', 'AC ruang kelas 10A tidak dingin', 'AC split menyala tetapi hembusan udara hangat sejak pagi dan air menetes sedikit.', 'Ruang Kelas 10A', 'Raka Pratama', 'baru', null, 3),
    ('Proyektor & Audio', 'Proyektor lab komputer buram', 'Gambar presentasi terlihat redup dan kekuningan sehingga sulit dibaca dari baris belakang.', 'Lab Komputer 1', 'Deni Kurniawan', 'baru', null, 5),
    ('Sanitasi & Air', 'Kran wastafel lantai 2 macet', 'Tuas kran seret dan air tidak keluar saat diputar ketika jam istirahat.', 'Toilet Timur Lt. 2', 'Salsa Wijaya', 'baru', null, 2),
    ('Meubel Kelas', 'Kursi siswa kaki patah di 11B', 'Salah satu kaki besi kursi goyah dan berpotensi membuat siswa terjatuh saat duduk.', 'Ruang Kelas 11B', 'Bagas Saputra', 'diproses', 'Teknisi sarpras sudah menjadwalkan pengelasan ulang kursi.', 4),
    ('Pencahayaan', 'Lampu neon koridor barat mati', 'Dua lampu utama di lorong menuju perpustakaan padam sehingga area cukup gelap.', 'Koridor Barat', 'Nadia Putri', 'diproses', 'Sedang menunggu penggantian ballast dan lampu baru.', 6),
    ('Pendingin Ruangan', 'AC ruang guru berisik bergetar', 'Unit AC mengeluarkan suara dengung keras saat kompresor aktif bekerja.', 'Ruang Guru Utama', 'Pak Hendra', 'selesai', 'Baut dudukan unit luar telah dikencangkan dan dibersihkan.', 1),
    ('Proyektor & Audio', 'Speaker aula suara pecah', 'Pengeras suara utama berdengung saat volume dinaikkan untuk acara sekolah.', 'Aula Serbaguna', 'Raka Pratama', 'selesai', 'Kabel audio longgar sudah diperbaiki dan diuji coba normal.', 7),
    ('Sanitasi & Air', 'Saluran air halaman belakang tergenang', 'Air hujan menggenang cukup tinggi karena saluran pembuangan tersumbat daun.', 'Halaman Belakang', 'Deni Kurniawan', 'selesai', 'Saluran drainase sudah dibersihkan dan aliran air lancar.', 2),
    ('Meubel Kelas', 'Meja guru laci macet di 12A', 'Laci meja tidak bisa ditarik penuh karena rel kayu sedikit melengkung.', 'Ruang Kelas 12A', 'Salsa Wijaya', 'baru', null, 1),
    ('Pencahayaan', 'Lampu taman depan kedip-kedip', 'Lampu taman berkedip terus saat malam hari sehingga pencahayaan tidak stabil.', 'Taman Depan', 'Bagas Saputra', 'diproses', 'Petugas sedang memeriksa koneksi sakelar otomatis malam.', 3)
) as v(nama_kategori, judul, deskripsi, lokasi, pelapor, status, tanggapan, dukungan)
join public.kategori k on k.nama = v.nama_kategori
where not exists (
  select 1 from public.laporan l where l.judul = v.judul
);