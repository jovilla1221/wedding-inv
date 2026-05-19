import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart, Music2, VolumeX, Instagram, MapPin, Calendar, Clock,
  Copy, Check, Gift, Send, Home as HomeIcon, Users, CalendarHeart,
  HandHeart, Sparkles, Youtube, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Divider, Gunungan, CornerFloral } from "@/components/Ornament";
import { SceneDecor } from "@/components/SceneDecor";
import { OvalFrame } from "@/components/OvalFrame";
import coupleHero from "@/assets/couple-hero.jpg";
import gununganGold from "@/assets/gunungan-gold.png";
import brideImg from "@/assets/bride.jpg";
import groomImg from "@/assets/groom.jpg";

export const Route = createFileRoute("/")({ component: InvitationPage });

const WEDDING_DATE = new Date("2027-05-08T08:00:00+07:00");

function InvitationPage() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = opened ? "auto" : "hidden";
  }, [opened]);

  const handleOpen = () => {
    // Trigger audio in the same user-gesture tick (required on iOS/Android)
    const a = audioRef.current;
    if (a) {
      a.muted = false;
      a.volume = 0.8;
      const p = a.play();
      if (p && typeof p.then === "function") {
        p.then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    }
    setOpened(true);
  };

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else {
      a.muted = false;
      const p = a.play();
      if (p && typeof p.then === "function") {
        p.then(() => setPlaying(true)).catch(() => toast.error("Ketuk sekali untuk mengaktifkan audio"));
      } else {
        setPlaying(true);
      }
    }
  };

  return (
    <div className="relative">
      <audio
        ref={audioRef}
        loop
        preload="auto"
        playsInline
        // @ts-expect-error - non-standard but widely supported on iOS
        webkit-playsinline="true"
        src="https://cdn.pixabay.com/download/audio/2022/10/18/audio_31c1e5b1ef.mp3?filename=relaxing-mountains-rivers-streams-running-water-18178.mp3"
      />
      <Cover opened={opened} onOpen={handleOpen} />
      {opened && (
        <main className="animate-[fade-in_1.4s_ease-out_both]">
          <HeroSection />
          <CoupleSection />
          <StorySection />
          <EventSection />
          <RSVPSection />
          <WishesSection />
          <GiftSection />
          <ApologySection />
          <StreamingSection />
          <ThankYouSection />
          <FloatingNav />
          <MusicButton playing={playing} onToggle={toggleMusic} />
        </main>
      )}
    </div>
  );
}

/* ============== COVER ============== */
function Cover({ opened, onOpen }: { opened: boolean; onOpen: () => void }) {
  return (
    <section
      className={`fixed inset-0 z-[60] flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        opened ? "opacity-0 pointer-events-none -translate-y-8" : "opacity-100"
      }`}
    >
      <SceneDecor />
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full pt-20 sm:pt-10">
        <div className="animate-[fade-up_1s_ease-out_both]">
          <OvalFrame src={coupleHero} alt="Baswara &amp; Kirana" size="lg" />
        </div>
        <div className="mt-10 backdrop-blur-[2px] bg-ivory/55 rounded-md px-6 py-8 border border-gold/30 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.4)] animate-[fade-up_1.3s_ease-out_both]">
          <p className="text-navy/80 text-sm tracking-[0.2em]">We invite you to The Wedding of</p>
          <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-navy">Baswara &amp; Kirana</h1>
          <p className="mt-2 text-navy/60 italic text-sm">A Wedding Invitation Experience</p>
          <button
            onClick={onOpen}
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-navy text-ivory px-7 py-3 hover:bg-navy-deep transition-all duration-500 shadow-lg"
          >
            <span className="tracking-widest text-xs uppercase">Open the Invitation</span>
            <Heart size={14} className="group-hover:fill-current" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============== HERO ============== */
function HeroSection() {
  const t = useCountdown(WEDDING_DATE);
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center section-pad overflow-hidden">
      <SceneDecor />
      <div className="relative z-10 max-w-2xl mx-auto text-center pt-32 sm:pt-40">
        <img src={gununganGold} alt="" aria-hidden className="mx-auto w-20 sm:w-28 mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)] animate-[float_6s_ease-in-out_infinite]" loading="lazy" />
        <p className="font-script text-gold text-3xl sm:text-4xl">Our Wedding Day</p>
        <h2 className="mt-2 font-serif text-6xl sm:text-8xl text-navy">Baswara</h2>
        <p className="mt-2 text-navy/70 italic">&amp; Kirana</p>
        <Divider />
        <p className="text-navy font-serif text-xl">Saturday, 08 May 2027</p>

        <div className="mt-10 grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
          {[
            { v: t.days, l: "Days" },
            { v: t.hours, l: "Hours" },
            { v: t.minutes, l: "Min" },
            { v: t.seconds, l: "Sec" },
          ].map((b) => (
            <div key={b.l} className="ornament-frame rounded-md py-4 bg-ivory/75 backdrop-blur-sm">
              <div className="text-2xl sm:text-4xl font-serif text-navy">{String(b.v).padStart(2, "0")}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{b.l}</div>
            </div>
          ))}
        </div>

        <Button
          asChild
          className="mt-10 bg-navy hover:bg-navy-deep text-ivory rounded-full px-8 py-6 tracking-widest text-xs uppercase"
        >
          <a
            href={`data:text/calendar;charset=utf-8,${encodeURIComponent(
              `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Baswara & Kirana Wedding\nDTSTART:20270508T010000Z\nDTEND:20270508T030000Z\nLOCATION:Hotel Shangri-La, Jakarta\nEND:VEVENT\nEND:VCALENDAR`
            )}`}
            download="baswara-wedding.ics"
          >
            <Calendar className="mr-2" size={14} /> Save the Date
          </a>
        </Button>
      </div>
    </section>
  );
}

function useCountdown(date: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, date.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

/* ============== COUPLE ============== */
function CoupleSection() {
  return (
    <section id="couple" className="section-pad bg-gradient-to-b from-ivory to-muted/60">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">The Beloved</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy mt-1">Bride &amp; Groom</h2>
        <Divider />
        <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed italic">
          Dengan penuh rasa syukur dan bahagia, kami mengundang Bapak/Ibu/Saudara/i untuk
          hadir dan memberikan doa restu pada hari bahagia kami.
        </p>

        <div className="mt-14 grid sm:grid-cols-2 gap-10">
          <ProfileCard
            name="Baswara Pratama"
            parents="Putra dari Bapak Arjuna & Ibu Lestari"
            handle="@baswara.p"
            initials="B"
          />
          <ProfileCard
            name="Kirana Ayu"
            parents="Putri dari Bapak Mahendra & Ibu Sekar"
            handle="@kirana.ayu"
            initials="K"
          />
        </div>
      </div>
    </section>
  );
}

function ProfileCard({ name, parents, handle, initials }: { name: string; parents: string; handle: string; initials: string }) {
  const isGroom = initials === "B";
  return (
    <div className="ornament-frame rounded-sm p-8 flex flex-col items-center animate-[fade-up_1s_ease-out_both]">
      <OvalFrame src={isGroom ? groomImg : brideImg} alt={name} size="md" />
      <h3 className="mt-8 font-serif text-3xl text-navy">{name}</h3>
      <p className="mt-2 text-sm text-muted-foreground italic max-w-xs">{parents}</p>
      <a
        href={`https://instagram.com/${handle.replace("@", "")}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-gold hover:text-navy transition-colors text-sm"
      >
        <Instagram size={16} /> {handle}
      </a>
    </div>
  );
}

/* ============== STORY ============== */
function StorySection() {
  const stories = [
    { title: "First Meet", date: "2022", text: "Pertemuan pertama yang tak terduga di sebuah kafe kecil di Yogyakarta — sebuah obrolan ringan yang berubah menjadi awal dari segalanya." },
    { title: "Engagement", date: "2025", text: "Di bawah langit senja, sebuah janji diucapkan dengan tulus. Keluarga kami menyatu dalam doa dan harapan." },
    { title: "Wedding Day", date: "2027", text: "Hari yang kami nantikan tiba. Dengan restu Tuhan dan keluarga, kami melangkah bersama menuju babak baru." },
  ];
  return (
    <section className="section-pad batik-bg">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">A Journey</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy">Our Story</h2>
        <Divider />
        <div className="mt-8 space-y-6">
          {stories.map((s, i) => (
            <div key={s.title}>
              <div className="ornament-frame rounded-sm p-6 sm:p-8 text-left animate-[fade-up_1s_ease-out_both]">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-2xl text-navy">{s.title}</h3>
                  <span className="font-script text-gold text-2xl">{s.date}</span>
                </div>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">{s.text}</p>
              </div>
              {i < stories.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== EVENT ============== */
function EventSection() {
  const events = [
    { title: "Akad Nikah", date: "Saturday, 08 May 2027", time: "08:00 - 10:00 WIB", venue: "Hotel Shangri-La", address: "Jl. Jend. Sudirman No.Kav. 1, Jakarta Pusat" },
    { title: "Resepsi", date: "Selasa, 2 Juni 2026", time: "15:00 - 17:00 WIB", venue: "Hotel Shangri-La", address: "Jl. Jend. Sudirman No.Kav. 1, Jakarta Pusat" },
  ];
  const pastels = ["#F8D7D2", "#D8E6F2", "#E5D9F2", "#E9DFC9", "#D6E7DA", "#F4E2C9"];
  return (
    <section id="event" className="section-pad bg-gradient-to-b from-muted/40 to-ivory">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">When & Where</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy">Lokasi &amp; Acara</h2>
        <Divider />
        <p className="text-muted-foreground max-w-xl mx-auto italic">
          Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {events.map((e) => (
            <div key={e.title} className="ornament-frame rounded-sm p-8 text-center flex flex-col items-center">
              <h3 className="font-serif text-3xl text-navy">{e.title}</h3>
              <Divider className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-navy"><Calendar size={14} className="text-gold" />{e.date}</div>
                <div className="flex items-center justify-center gap-2 text-navy"><Clock size={14} className="text-gold" />{e.time}</div>
                <div className="flex items-center justify-center gap-2 text-navy"><MapPin size={14} className="text-gold" />{e.venue}</div>
                <p className="text-muted-foreground text-xs max-w-xs mx-auto">{e.address}</p>
              </div>
              <Button asChild variant="outline" className="mt-6 border-gold text-navy hover:bg-gold hover:text-navy rounded-full">
                <a href={`https://maps.google.com/?q=${encodeURIComponent(e.venue + " " + e.address)}`} target="_blank" rel="noreferrer">
                  <MapPin size={14} className="mr-2" /> Open Location
                </a>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 ornament-frame rounded-sm p-8 max-w-xl mx-auto">
          <h3 className="font-serif text-2xl text-navy">Dress Code</h3>
          <p className="text-muted-foreground italic mt-1">Any kind of pastel</p>
          <div className="flex justify-center gap-3 mt-5">
            {pastels.map((c) => (
              <span key={c} className="w-8 h-8 rounded-full border border-gold/50 shadow-inner" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============== RSVP ============== */
function RSVPSection() {
  const [form, setForm] = useState({ name: "", attend: "attend", guests: "1", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return toast.error("Mohon isi nama Anda");
    toast.success("Terima kasih! Konfirmasi kehadiran Anda telah kami terima.", {
      description: `${form.name} — ${form.attend === "attend" ? "Hadir" : "Tidak Hadir"} (${form.guests} tamu)`,
    });
    setForm({ name: "", attend: "attend", guests: "1", message: "" });
  };
  return (
    <section id="rsvp" className="section-pad bg-navy text-ivory relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Gunungan className="absolute -top-10 left-1/2 -translate-x-1/2 w-[500px] text-gold" />
      </div>
      <div className="relative max-w-xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">Confirm Attendance</p>
        <h2 className="font-serif text-4xl sm:text-5xl gold-text">RSVP</h2>
        <Divider />
        <form onSubmit={submit} className="mt-8 space-y-5 text-left">
          <div>
            <Label className="text-ivory/80 text-xs tracking-widest uppercase">Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 bg-ivory/5 border-gold/30 text-ivory placeholder:text-ivory/40 focus-visible:ring-gold" />
          </div>
          <div>
            <Label className="text-ivory/80 text-xs tracking-widest uppercase">Confirmation</Label>
            <RadioGroup value={form.attend} onValueChange={(v) => setForm({ ...form, attend: v })}
              className="mt-3 grid grid-cols-2 gap-3">
              {[{ v: "attend", l: "Attend" }, { v: "not", l: "Not Attend" }].map((o) => (
                <Label key={o.v} className={`flex items-center justify-center gap-2 cursor-pointer rounded-md border py-3 transition ${
                  form.attend === o.v ? "border-gold bg-gold/15 text-gold" : "border-ivory/20 text-ivory/70"
                }`}>
                  <RadioGroupItem value={o.v} className="sr-only" />{o.l}
                </Label>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label className="text-ivory/80 text-xs tracking-widest uppercase">Number of Guests</Label>
            <Input type="number" min={1} max={10} value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
              className="mt-2 bg-ivory/5 border-gold/30 text-ivory focus-visible:ring-gold" />
          </div>
          <div>
            <Label className="text-ivory/80 text-xs tracking-widest uppercase">Message</Label>
            <Textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 bg-ivory/5 border-gold/30 text-ivory placeholder:text-ivory/40 focus-visible:ring-gold" />
          </div>
          <Button type="submit" className="w-full bg-gold text-navy hover:bg-gold-soft rounded-full py-6 tracking-widest text-xs uppercase">
            <Send size={14} className="mr-2" /> Send RSVP
          </Button>
        </form>
      </div>
    </section>
  );
}

/* ============== WISHES ============== */
type Wish = { id: number; name: string; message: string; at: string };
function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([
    { id: 1, name: "Dewi & Reza", message: "Selamat menempuh hidup baru! Semoga sakinah, mawaddah, warahmah.", at: "1 jam lalu" },
    { id: 2, name: "Galih Pratomo", message: "Barakallah ya kalian berdua. Bahagia selalu!", at: "3 jam lalu" },
    { id: 3, name: "Maya", message: "Doaku menyertai. Selamat ya untuk hari bahagianya.", at: "kemarin" },
  ]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return toast.error("Lengkapi nama dan ucapan");
    setWishes([{ id: Date.now(), name, message, at: "baru saja" }, ...wishes]);
    setName(""); setMessage("");
    toast.success("Doa dan ucapanmu telah terkirim 🌸");
  };
  return (
    <section className="section-pad bg-gradient-to-b from-ivory to-muted/40">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">Doa & Restu</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy">Wedding Wishes</h2>
        <Divider />
        <form onSubmit={submit} className="mt-6 ornament-frame rounded-sm p-6 sm:p-8 text-left space-y-4">
          <Input placeholder="Nama Anda" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea placeholder="Tulis ucapan & doa..." rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button type="submit" className="w-full bg-navy text-ivory hover:bg-navy-deep rounded-full">
            <HandHeart size={14} className="mr-2" /> Send Wishes
          </Button>
        </form>

        <div className="mt-10 space-y-4 max-h-[420px] overflow-y-auto pr-1 text-left">
          {wishes.map((w) => (
            <div key={w.id} className="rounded-md border border-gold/30 bg-card p-5 animate-[fade-up_0.6s_ease-out_both]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-blush flex items-center justify-center text-ivory font-serif">
                  {w.name[0]}
                </div>
                <div>
                  <div className="font-serif text-navy">{w.name}</div>
                  <div className="text-xs text-muted-foreground">{w.at}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{w.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== GIFT ============== */
const ACCOUNTS = [
  { bank: "BCA", number: "1234567890", name: "Baswara Pratama" },
  { bank: "Mandiri", number: "9876543210", name: "Kirana Ayu" },
];
const GIFTS = [
  { name: "Water Heater", price: "Rp 1.250.000" },
  { name: "Coffee Maker", price: "Rp 850.000" },
  { name: "Honeymoon Fund", price: "Rp 500.000" },
  { name: "Dining Chair", price: "Rp 650.000" },
  { name: "Spring Bed", price: "Rp 3.500.000" },
  { name: "Vacuum Cleaner", price: "Rp 1.100.000" },
];

function GiftSection() {
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [gift, setGift] = useState({ name: "", email: "", note: "" });

  const copy = async (num: string) => {
    try { await navigator.clipboard.writeText(num); setCopied(num); setTimeout(() => setCopied(null), 1800); }
    catch { toast.error("Tidak dapat menyalin"); }
  };
  const sendGift = () => {
    if (!gift.name) return toast.error("Isi nama pengirim");
    toast.success(`Terima kasih atas hadiah "${selected}"!`);
    setSelected(null); setGift({ name: "", email: "", note: "" });
  };

  return (
    <section id="gift" className="section-pad batik-bg">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">Send a Gift</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy">E-Angpao</h2>
        <Divider />
        <p className="text-muted-foreground max-w-xl mx-auto italic">
          Doa restu Anda adalah hadiah terindah. Namun, jika berkenan memberikan tanda kasih, kami menyediakan opsi digital berikut.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          {ACCOUNTS.map((a) => (
            <div key={a.number} className="ornament-frame rounded-sm p-6 text-left">
              <div className="text-xs uppercase tracking-widest text-gold">{a.bank}</div>
              <div className="font-serif text-2xl text-navy mt-1">{a.number}</div>
              <div className="text-sm text-muted-foreground">a.n. {a.name}</div>
              <Button onClick={() => copy(a.number)} size="sm" className="mt-4 bg-navy text-ivory hover:bg-navy-deep rounded-full">
                {copied === a.number ? <><Check size={14} className="mr-2" />Copied</> : <><Copy size={14} className="mr-2" />Copy Account Number</>}
              </Button>
            </div>
          ))}
        </div>

        <h3 className="mt-16 font-serif text-2xl text-navy">Gift Registry</h3>
        <Divider />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {GIFTS.map((g) => (
            <div key={g.name} className="ornament-frame rounded-sm p-4 text-left">
              <div className="aspect-square rounded-sm bg-gradient-to-br from-secondary via-muted to-blush/40 flex items-center justify-center">
                <Gift className="text-gold/70" size={36} />
              </div>
              <div className="mt-3 font-serif text-navy text-lg">{g.name}</div>
              <div className="text-xs text-muted-foreground">{g.price}</div>
              <Button onClick={() => setSelected(g.name)} size="sm" className="mt-3 w-full bg-gold text-navy hover:bg-gold-soft rounded-full">
                Hadiahkan
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-ivory">
          <DialogHeader>
            <DialogTitle className="font-serif text-navy text-2xl">Hadiahkan — {selected}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Nama Anda" value={gift.name} onChange={(e) => setGift({ ...gift, name: e.target.value })} />
            <Input type="email" placeholder="Email" value={gift.email} onChange={(e) => setGift({ ...gift, email: e.target.value })} />
            <Textarea placeholder="Pesan untuk pengantin..." value={gift.note} onChange={(e) => setGift({ ...gift, note: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Batal</Button>
            <Button onClick={sendGift} className="bg-navy text-ivory hover:bg-navy-deep">
              <Gift size={14} className="mr-2" />Konfirmasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ============== APOLOGY ============== */
function ApologySection() {
  return (
    <section className="section-pad bg-navy text-ivory">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">Mohon Maaf</p>
        <h2 className="font-serif text-4xl gold-text">Apology</h2>
        <Divider />
        <p className="text-ivory/80 leading-relaxed italic">
          Tanpa mengurangi rasa hormat, izinkan kami menyampaikan undangan ini secara digital.
          Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kebahagiaan yang sangat berarti bagi kami.
        </p>
        <Divider />
      </div>
    </section>
  );
}

/* ============== STREAMING ============== */
function StreamingSection() {
  return (
    <section className="section-pad bg-gradient-to-b from-ivory to-muted/40">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">Watch Live</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy">Live Streaming</h2>
        <Divider />
        <p className="text-muted-foreground italic">
          Silakan menyaksikan rangkaian acara pernikahan kami melalui YouTube Live.
        </p>
        <div className="mt-8 ornament-frame rounded-sm p-8 inline-block">
          <div className="text-navy font-serif">10:00 — Akad Nikah</div>
          <Button asChild className="mt-5 bg-[#FF0000] hover:bg-[#cc0000] text-white rounded-full">
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <Youtube size={16} className="mr-2" /> Join YouTube
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ============== THANK YOU ============== */
function ThankYouSection() {
  return (
    <section id="thanks" className="relative min-h-screen flex items-center justify-center section-pad text-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, oklch(0.22 0.06 265) 0%, oklch(0.14 0.05 265) 100%)" }}>
      <CornerFloral className="absolute top-4 left-4 w-28 sm:w-44 text-gold/60" />
      <CornerFloral className="absolute top-4 right-4 w-28 sm:w-44 text-gold/60" flip />
      <CornerFloral className="absolute bottom-4 left-4 w-28 sm:w-44 text-gold/60" style={{ transform: "scaleY(-1)" }} />
      <CornerFloral className="absolute bottom-4 right-4 w-28 sm:w-44 text-gold/60" style={{ transform: "scale(-1,-1)" }} />
      <div className="relative max-w-xl">
        <Sparkles className="mx-auto text-gold animate-[float_6s_ease-in-out_infinite]" size={32} />
        <p className="font-script text-gold text-3xl mt-4">With Love</p>
        <h2 className="font-serif text-5xl sm:text-7xl gold-text">Thank You</h2>
        <Divider />
        <p className="text-ivory/80 leading-relaxed italic">
          Terima kasih atas doa, ucapan, dan kehadiran Bapak/Ibu/Saudara/i. Semoga kebaikan
          yang diberikan menjadi berkah bagi kita semua.
        </p>
        <Divider />
        <p className="font-serif text-2xl text-ivory mt-4">Baswara &amp; Kirana</p>
        <p className="text-xs text-ivory/50 mt-10">
          Baswara © 2026. This invitation saves paper and reduces carbon footprint.
        </p>
      </div>
    </section>
  );
}

/* ============== FLOATING NAV ============== */
function FloatingNav() {
  const items = [
    { id: "home", icon: HomeIcon, label: "Home" },
    { id: "couple", icon: Users, label: "Couple" },
    { id: "event", icon: CalendarHeart, label: "Event" },
    { id: "rsvp", icon: HandHeart, label: "RSVP" },
    { id: "gift", icon: Gift, label: "Gift" },
    { id: "thanks", icon: Heart, label: "Thanks" },
  ];
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full border border-gold/40 bg-navy/85 backdrop-blur-md shadow-2xl">
      <ul className="flex items-center gap-1 sm:gap-2">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1.5 rounded-full text-ivory/70 hover:text-gold hover:bg-ivory/5 transition"
              aria-label={it.label}
            >
              <it.icon size={16} />
              <span className="text-[9px] tracking-widest uppercase hidden sm:block">{it.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ============== MUSIC ============== */
function MusicButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-24 right-5 z-40 w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center shadow-xl hover:scale-110 transition animate-[float_4s_ease-in-out_infinite]"
      aria-label="Toggle music"
    >
      {playing ? <Music2 size={18} className="animate-spin [animation-duration:4s]" /> : <VolumeX size={18} />}
    </button>
  );
}
