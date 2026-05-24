import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Trash2, Link as LinkIcon, Plus } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Guest = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

type Rsvp = {
  id: string;
  name: string;
  is_attending: boolean;
  guest_count: number;
  message: string;
  created_at: string;
};

type Wish = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRsvps, setLoadingRsvps] = useState(true);
  const [loadingWishes, setLoadingWishes] = useState(true);

  useEffect(() => {
    fetchGuests();
    fetchRsvps();
    fetchWishes();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal mengambil data tamu: " + error.message);
    } else {
      setGuests(data || []);
    }
    setLoading(false);
  };

  const fetchRsvps = async () => {
    setLoadingRsvps(true);
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal mengambil data RSVP: " + error.message);
    } else {
      setRsvps(data || []);
    }
    setLoadingRsvps(false);
  };

  const fetchWishes = async () => {
    setLoadingWishes(true);
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal mengambil data Ucapan: " + error.message);
    } else {
      setWishes(data || []);
    }
    setLoadingWishes(false);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Generate slug from name
    const slug = newName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Cek jika slug sudah ada, tambahkan random string pendek agar unik
    const uniqueSlug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;

    const { error } = await supabase
      .from("guests")
      .insert([{ name: newName.trim(), slug: uniqueSlug }]);

    if (error) {
      toast.error("Gagal menambah tamu: " + error.message);
    } else {
      toast.success(`Berhasil menambah tamu: ${newName}`);
      setNewName("");
      fetchGuests();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus tamu ini?")) return;

    const { error } = await supabase.from("guests").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus: " + error.message);
    } else {
      toast.success("Tamu berhasil dihapus");
      setGuests(guests.filter((g) => g.id !== id));
    }
  };

  const handleDeleteWish = async (id: string) => {
    if (!confirm("Yakin ingin menghapus ucapan ini?")) return;

    const { error } = await supabase.from("wishes").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus ucapan: " + error.message);
    } else {
      toast.success("Ucapan berhasil dihapus");
      setWishes(wishes.filter((w) => w.id !== id));
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/?to=${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link berhasil disalin!");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Tamu Undangan</h1>
            <p className="text-slate-500 mt-1">
              Kelola daftar tamu dan buat link unik untuk dibagikan.
            </p>
          </div>
          <Button variant="outline" onClick={() => window.open("/", "_blank")}>
            <LinkIcon className="mr-2 h-4 w-4" /> Lihat Undangan
          </Button>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Tambah Tamu Baru</h2>
          <form onSubmit={handleAddGuest} className="flex gap-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Contoh: Budi Santoso & Keluarga"
              className="flex-1"
            />
            <Button type="submit" disabled={!newName.trim()}>
              <Plus className="mr-2 h-4 w-4" /> Tambah
            </Button>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Daftar Link Tamu</h2>
            <span className="bg-slate-100 text-slate-600 text-sm py-1 px-3 rounded-full">
              {guests.length} Tamu
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Memuat data tamu...</div>
          ) : guests.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Belum ada tamu yang ditambahkan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm">
                    <th className="p-4 font-medium">Nama Tamu</th>
                    <th className="p-4 font-medium">Link Unik (Slug)</th>
                    <th className="p-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {guests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">{guest.name}</td>
                      <td className="p-4 text-slate-500 text-sm font-mono">/?to={guest.slug}</td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCopyLink(guest.slug)}
                          className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-0"
                        >
                          <Copy className="h-4 w-4 mr-2" /> Salin Link
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(guest.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RSVP Section */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold">Data RSVP (Konfirmasi Kehadiran)</h2>
              <div className="flex gap-4 mt-2 text-sm text-slate-600">
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-200">
                  Hadir:{" "}
                  {rsvps
                    .filter((r) => r.is_attending)
                    .reduce((acc, curr) => acc + curr.guest_count, 0)}{" "}
                  Orang
                </span>
                <span className="bg-red-50 text-red-700 px-2 py-1 rounded-md border border-red-200">
                  Tidak Hadir: {rsvps.filter((r) => !r.is_attending).length}
                </span>
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200">
                  Total Responden: {rsvps.length}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={fetchRsvps}>
              Refresh Data
            </Button>
          </div>

          {loadingRsvps ? (
            <div className="p-12 text-center text-slate-400">Memuat data RSVP...</div>
          ) : rsvps.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Belum ada RSVP yang masuk.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm">
                    <th className="p-4 font-medium">Tanggal</th>
                    <th className="p-4 font-medium">Nama Tamu</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-center">Jumlah</th>
                    <th className="p-4 font-medium max-w-[200px]">Pesan/Ucapan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-500 text-sm">
                        {new Date(rsvp.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-4 font-medium text-slate-700">{rsvp.name}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            rsvp.is_attending
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {rsvp.is_attending ? "Hadir" : "Tidak Hadir"}
                        </span>
                      </td>
                      <td className="p-4 text-center text-slate-600 font-medium">
                        {rsvp.is_attending ? rsvp.guest_count : "-"}
                      </td>
                      <td
                        className="p-4 text-slate-600 text-sm italic max-w-[200px] truncate"
                        title={rsvp.message}
                      >
                        {rsvp.message || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Wishes Section */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Daftar Ucapan & Doa</h2>
            <div className="flex items-center gap-4">
              <span className="bg-slate-100 text-slate-600 text-sm py-1 px-3 rounded-full">
                {wishes.length} Ucapan
              </span>
              <Button variant="outline" size="sm" onClick={fetchWishes}>
                Refresh Data
              </Button>
            </div>
          </div>

          {loadingWishes ? (
            <div className="p-12 text-center text-slate-400">Memuat data ucapan...</div>
          ) : wishes.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Belum ada ucapan yang masuk.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm">
                    <th className="p-4 font-medium">Tanggal</th>
                    <th className="p-4 font-medium">Nama Tamu</th>
                    <th className="p-4 font-medium max-w-[300px]">Pesan/Ucapan</th>
                    <th className="p-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {wishes.map((wish) => (
                    <tr key={wish.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-500 text-sm">
                        {new Date(wish.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-4 font-medium text-slate-700">{wish.name}</td>
                      <td className="p-4 text-slate-600 text-sm max-w-[300px] whitespace-pre-wrap">
                        {wish.message}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWish(wish.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
