import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Music2,
  VolumeX,
  Instagram,
  MapPin,
  Calendar,
  Clock,
  Copy,
  Check,
  Gift,
  Send,
  Home as HomeIcon,
  Users,
  CalendarHeart,
  HandHeart,
  Sparkles,
  Youtube,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Divider, Gunungan, CornerFloral } from "@/components/Ornament";
import { SceneDecor } from "@/components/SceneDecor";
import { OvalFrame } from "@/components/OvalFrame";
import coupleHero from "@/assets/pengantin  both.png";
import gununganGold from "@/assets/gunungan-gold.png";
import brideImg from "@/assets/pengantin wanita.png";
import groomImg from "@/assets/pengantin pria.png";
import rsvpBgNew from "@/assets/rsvp_bg_new.png";
import bgThankYouLandscape from "@/assets/bg thank  you.png";
import bgThankYouPortrait from "@/assets/bg_thank_you_portrait.png";
import floralCorner from "@/assets/floral-corner.png";
import islamicPatternBg from "@/assets/islamic-pattern-bg.png";
import wayangLeft from "@/assets/wayang-left.png";
import wayangRight from "@/assets/wayang-right.png";
import goldMandala from "@/assets/gold-mandala.png";
import { supabase } from "@/lib/supabase";
import backgroundMusic from "@/assets/Gending Manten Adat Jawa Kebo Giro.mp3";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { to?: string } => {
    return { to: search.to as string | undefined };
  },
  component: InvitationPage,
});

const WEDDING_DATE = new Date("2026-06-02T08:00:00+07:00");

const MUSIC_START_TIME = 0; // Mulai dari awal untuk musik gamelan manten

function InvitationPage() {
  const { to } = Route.useSearch();
  const [guestName, setGuestName] = useState<string>("");
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (to) {
      supabase
        .from("guests")
        .select("name")
        .eq("slug", to)
        .single()
        .then(({ data }) => {
          if (data) {
            setGuestName(data.name);
          } else {
            setGuestName("Tamu Undangan");
          }
        });
    } else {
      setGuestName("Tamu Undangan");
    }
  }, [to]);

  useEffect(() => {
    document.body.style.overflow = opened ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [opened]);

  const handleOpen = () => {
    // Trigger audio in the same user-gesture tick (required on iOS/Android)
    const a = audioRef.current;
    if (a) {
      a.muted = false;
      a.volume = 0.8;
      a.currentTime = MUSIC_START_TIME;
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
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.muted = false;
      if (a.currentTime === 0) {
        a.currentTime = MUSIC_START_TIME;
      }
      const p = a.play();
      if (p && typeof p.then === "function") {
        p.then(() => setPlaying(true)).catch(() =>
          toast.error("Ketuk sekali untuk mengaktifkan audio"),
        );
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
        {...({ "webkit-playsinline": "true", "x5-playsinline": "true" } as Record<string, string>)}
        src={backgroundMusic}
      />
      <Cover opened={opened} onOpen={handleOpen} guestName={guestName} />
      {opened && (
        <main className="animate-[fade-in_1.4s_ease-out_both]">
          <HeroSection />
          <CoupleSection />
          <EventSection />
          <RSVPSection />
          <WishesSection />
          <GiftSection />
          <ThankYouSection />
          <FloatingNav />
          <MusicButton playing={playing} onToggle={toggleMusic} />
        </main>
      )}
    </div>
  );
}

/* ============== FADE IN SECTION ============== */
function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ============== COVER ============== */
function Cover({ opened, onOpen, guestName }: { opened: boolean; onOpen: () => void; guestName: string }) {
  return (
    <section
      className={`fixed inset-0 z-[60] flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        opened ? "opacity-0 pointer-events-none -translate-y-8" : "opacity-100"
      }`}
    >
      <SceneDecor />
      <div className="cover-content relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <div className="animate-[fade-up_1s_ease-out_both]">
          <OvalFrame src={coupleHero} alt="Naufal &amp; Erika" size="lg" />
        </div>
        <div className="cover-card w-full backdrop-blur-[2px] bg-ivory/60 rounded-md border border-gold/30 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.4)] animate-[fade-up_1.3s_ease-out_both] p-6 text-center">
          <p className="cover-eyebrow text-navy/80 mb-1">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <h2 className="font-serif text-2xl text-navy mb-4 font-bold min-h-[32px]">{guestName}</h2>
          <Divider />
          <p className="cover-eyebrow text-navy/80 mt-4">We invite you to The Wedding of</p>
          <h1 className="cover-title mt-3 font-serif text-navy">Naufal &amp; Erika</h1>
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

/* ============== FLOATING BLOSSOMS ============== */
function FloatingBlossoms() {
  const blossoms = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${10 + Math.random() * 10}s`,
      animationDelay: `-${Math.random() * 15}s`,
      size: `${8 + Math.random() * 12}px`,
      opacity: 0.5 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
      {blossoms.map((b) => (
        <div
          key={b.id}
          className="absolute top-0 rounded-full bg-[#dbb34d] blur-[1.5px]"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            animation: `blossom-fall ${b.animationDuration} linear infinite`,
            animationDelay: b.animationDelay,
            boxShadow: "0 0 15px rgba(219, 179, 77, 0.9)",
          }}
        />
      ))}
    </div>
  );
}

/* ============== HERO ============== */
function HeroSection() {
  const t = useCountdown(WEDDING_DATE);
  return (
    <section
      id="home"
      className="screen-section relative flex items-center justify-center section-pad overflow-hidden"
    >
      <SceneDecor />
      <FloatingBlossoms />
      <FadeInSection className="hero-content relative z-10 max-w-2xl mx-auto text-center mt-32 sm:mt-40">
        <img
          src={gununganGold}
          alt=""
          aria-hidden
          className="mx-auto w-20 sm:w-28 mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)] animate-[float_6s_ease-in-out_infinite]"
          loading="lazy"
        />
        <p className="font-script text-gold text-3xl sm:text-4xl">Our Wedding Day</p>
        <h2 className="hero-title mt-2 font-serif text-navy">Naufal &amp; Erika</h2>
        <Divider />
        <p className="text-navy font-serif text-xl">Selasa, 02 Juni 2026</p>

        <div className="countdown-grid mt-10 grid gap-2 sm:gap-4 max-w-md mx-auto">
          {[
            { v: t.days, l: "Days" },
            { v: t.hours, l: "Hours" },
            { v: t.minutes, l: "Min" },
            { v: t.seconds, l: "Sec" },
          ].map((b) => (
            <div key={b.l} className="ornament-frame rounded-md py-4 bg-ivory/75 backdrop-blur-sm">
              <div className="text-2xl sm:text-4xl font-serif text-navy">
                {String(b.v).padStart(2, "0")}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                {b.l}
              </div>
            </div>
          ))}
        </div>

        <Button
          asChild
          className="mt-10 bg-navy hover:bg-navy-deep text-ivory rounded-full px-8 py-6 tracking-widest text-xs uppercase"
        >
          <a
            href={`data:text/calendar;charset=utf-8,${encodeURIComponent(
              `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Naufal & Erika Wedding\nDTSTART:20260602T010000Z\nDTEND:20260602T030000Z\nLOCATION:Hotel Shangri-La, Jakarta\nEND:VEVENT\nEND:VCALENDAR`,
            )}`}
            download="naufal-erika-wedding.ics"
          >
            <Calendar className="mr-2" size={14} /> Save the Date
          </a>
        </Button>
      </FadeInSection>
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
      <FadeInSection className="max-w-4xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">The Beloved</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy mt-1">Bride &amp; Groom</h2>
        <Divider />
        <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed italic">
          Dengan penuh rasa syukur dan bahagia, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan
          memberikan doa restu pada hari bahagia kami.
        </p>

        <div className="mt-14 grid sm:grid-cols-2 gap-10">
          <ProfileCard
            name="Muhammad Naufal Amru"
            parents="Putra dari Bpk Moh. Shohibul Huda (Alm.) & Ibu Yahdi Elfina Yuliyati"
            initials="N"
          />
          <ProfileCard
            name="Erika Putri Rahmahwati "
            parents="Putri dari Bpk. Baroji & Ibu Sunarwati"
            initials="E"
          />
        </div>
      </FadeInSection>
    </section>
  );
}

function ProfileCard({
  name,
  parents,
  initials,
}: {
  name: string;
  parents: string;
  initials: string;
}) {
  const isGroom = initials === "N";
  return (
    <div className="ornament-frame rounded-sm p-8 flex flex-col items-center animate-[fade-up_1s_ease-out_both]">
      <OvalFrame src={isGroom ? groomImg : brideImg} alt={name} size="md" />
      <h3 className="mt-8 font-serif text-3xl text-navy">{name}</h3>
      <p className="mt-2 text-sm text-muted-foreground italic max-w-xs">{parents}</p>
    </div>
  );
}

/* ============== STORY ============== */
function StorySection() {
  const stories = [
    {
      title: "First Meet",
      date: "2022",
      text: "Pertemuan pertama yang tak terduga di sebuah kafe kecil di Yogyakarta — sebuah obrolan ringan yang berubah menjadi awal dari segalanya.",
    },
    {
      title: "Engagement",
      date: "2025",
      text: "Di bawah langit senja, sebuah janji diucapkan dengan tulus. Keluarga kami menyatu dalam doa dan harapan.",
    },
    {
      title: "Wedding Day",
      date: "2027",
      text: "Hari yang kami nantikan tiba. Dengan restu Tuhan dan keluarga, kami melangkah bersama menuju babak baru.",
    },
  ];
  return (
    <section className="section-pad batik-bg">
      <FadeInSection className="max-w-3xl mx-auto text-center">
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
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {s.text}
                </p>
              </div>
              {i < stories.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  );
}

/* ============== EVENT ============== */
function EventSection() {
  const events = [
    {
      title: "Akad Nikah",
      date: "Selasa, 2 Juni 2026",
      time: "08:00 - 10:00 WIB",
      address: "Ds. Gilang, Ngunut, Tulungagung Regency, East Java 66292",
    },
    {
      title: "Resepsi",
      date: "Selasa, 2 Juni 2026",
      time: "15:00 - 17:00 WIB",
      address: "Ds. Gilang, Ngunut, Tulungagung Regency, East Java 66292",
    },
  ];
  return (
    <section id="event" className="section-pad bg-gradient-to-b from-muted/40 to-ivory">
      <FadeInSection className="max-w-4xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">When & Where</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy">Lokasi &amp; Acara</h2>
        <Divider />
        <p className="text-muted-foreground max-w-xl mx-auto italic">
          Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {events.map((e) => (
            <div
              key={e.title}
              className="ornament-frame rounded-sm p-8 text-center flex flex-col items-center"
            >
              <h3 className="font-serif text-3xl text-navy">{e.title}</h3>
              <Divider className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-navy">
                  <Calendar size={14} className="text-gold" />
                  {e.date}
                </div>
                <div className="flex items-center justify-center gap-2 text-navy">
                  <Clock size={14} className="text-gold" />
                  {e.time}
                </div>
                <p className="flex items-start justify-center gap-2 text-muted-foreground text-xs max-w-xs mx-auto">
                  <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                  {e.address}
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="mt-6 border-gold text-navy hover:bg-gold hover:text-navy rounded-full"
              >
                <a
                  href="https://maps.app.goo.gl/LN1oGyi7scf9B35EA?g_st=ac"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin size={14} className="mr-2" /> Open Location
                </a>
              </Button>
            </div>
          ))}
        </div>      </FadeInSection>
    </section>
  );
}

/* ============== RSVP ============== */
function RSVPSection() {
  const [form, setForm] = useState({ name: "", attend: "attend", guests: "1", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return toast.error("Mohon isi nama Anda");
    
    setIsSubmitting(true);
    const { error } = await supabase.from("rsvps").insert([
      {
        name: form.name,
        is_attending: form.attend === "attend",
        guest_count: parseInt(form.guests) || 1,
        message: form.message,
      }
    ]);
    setIsSubmitting(false);

    if (error) {
      toast.error("Gagal mengirim RSVP. Coba lagi nanti.");
      return;
    }

    toast.success("Terima kasih! Konfirmasi kehadiran Anda telah kami terima.", {
      description: `${form.name} — ${form.attend === "attend" ? "Hadir" : "Tidak Hadir"} (${form.guests} tamu)`,
    });
    setForm({ name: "", attend: "attend", guests: "1", message: "" });
  };
  return (
    <section id="rsvp" className="section-pad bg-navy text-ivory relative overflow-hidden min-h-screen flex items-center justify-center">
      {/* New Javanese Gunungan Background */}
      <div className="absolute inset-0 z-0 bg-[#070b19]">
        <img 
          src={rsvpBgNew} 
          alt="Luxury RSVP Background" 
          className="w-full h-full object-cover object-top opacity-85"
        />
        {/* Soft overlay to ensure text readability */}
        <div className="absolute inset-0 bg-[#070b19]/30"></div>
      </div>
      <FadeInSection className="relative z-10 w-full max-w-xl mx-auto text-center px-6">
        <p className="font-script text-gold text-3xl">Konfirmasi Kehadiran</p>
        <h2 className="font-serif text-4xl sm:text-5xl gold-text">RSVP</h2>
        <Divider />
        <form onSubmit={submit} className="mt-8 space-y-5 text-left">
          <div>
            <Label className="text-ivory/80 text-xs tracking-widest uppercase">Nama Lengkap</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 bg-ivory/5 border-gold/30 text-ivory placeholder:text-ivory/40 focus-visible:ring-gold"
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>
          <div>
            <Label className="text-ivory/80 text-xs tracking-widest uppercase">Kehadiran</Label>
            <RadioGroup
              value={form.attend}
              onValueChange={(v) => setForm({ ...form, attend: v })}
              className="mt-3 grid grid-cols-2 gap-3"
            >
              {[
                { v: "attend", l: "Hadir" },
                { v: "not", l: "Tidak Hadir" },
              ].map((o) => (
                <Label
                  key={o.v}
                  className={`flex items-center justify-center gap-2 cursor-pointer rounded-md border py-3 transition ${
                    form.attend === o.v
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-ivory/20 text-ivory/70"
                  }`}
                >
                  <RadioGroupItem value={o.v} className="sr-only" />
                  {o.l}
                </Label>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label className="text-ivory/80 text-xs tracking-widest uppercase">
              Jumlah Tamu
            </Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
              className="mt-2 bg-ivory/5 border-gold/30 text-ivory focus-visible:ring-gold"
            />
          </div>
          <div>
            <Label className="text-ivory/80 text-xs tracking-widest uppercase">Pesan / Ucapan</Label>
            <Textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 bg-ivory/5 border-gold/30 text-ivory placeholder:text-ivory/40 focus-visible:ring-gold"
              placeholder="Tulis ucapan atau pesan doa restu Anda di sini..."
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold text-navy hover:bg-gold-soft rounded-full py-6 tracking-widest text-xs uppercase"
          >
            {isSubmitting ? "Mengirim..." : <><Send size={14} className="mr-2" /> Kirim Konfirmasi</>}
          </Button>
        </form>
      </FadeInSection>
    </section>
  );
}

/* ============== BANK LOGOS (Inline SVG) ============== */
function BCALogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect rx="4" width="120" height="40" fill="#003d79"/>
      <g fill="#fff">
        <circle cx="18" cy="20" r="8" fill="none" stroke="#fff" strokeWidth="1.5"/>
        <path d="M14,16 L22,16 L22,24 L14,24 Z" fill="none" stroke="#fff" strokeWidth="1"/>
        <text x="15" y="23" fontSize="8" fontWeight="bold" fontFamily="Arial" fill="#fff">$</text>
      </g>
      <text x="35" y="27" fontSize="18" fontWeight="bold" fontFamily="Arial" fill="#fff">BCA</text>
    </svg>
  );
}

function MandiriLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M8,12 C8,12 14,8 20,12 C26,8 32,12 32,12 L32,28 C32,28 26,32 20,28 C14,32 8,28 8,28 Z" fill="#003d79"/>
        <path d="M14,16 L20,20 L26,16" fill="none" stroke="#ffc72c" strokeWidth="2"/>
        <path d="M14,22 L20,26 L26,22" fill="none" stroke="#ffc72c" strokeWidth="2"/>
      </g>
      <text x="38" y="28" fontSize="16" fontWeight="bold" fontFamily="Arial">
        <tspan fill="#003d79">mandiri</tspan>
      </text>
    </svg>
  );
}

function SeaBankLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect rx="4" width="160" height="40" fill="#00A6E5"/>
      <text x="12" y="28" fontSize="18" fontWeight="bold" fontFamily="Arial" fill="#fff">Sea</text>
      <text x="52" y="28" fontSize="18" fontWeight="bold" fontFamily="Arial" fill="#fff">Bank</text>
      <path d="M145,10 Q150,20 145,30" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5"/>
      <path d="M140,12 Q146,20 140,28" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.3"/>
    </svg>
  );
}

function getBankLogo(bank: string) {
  switch (bank) {
    case "BCA": return <BCALogo className="h-8 w-auto" />;
    case "Mandiri": return <MandiriLogo className="h-8 w-auto" />;
    case "SeaBank": return <SeaBankLogo className="h-8 w-auto" />;
    default: return null;
  }
}

/* ============== WISHES ============== */
type Wish = { id: string; name: string; message: string; created_at: string };
function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    const { data } = await supabase.from("wishes").select("*").order("created_at", { ascending: false });
    if (data) setWishes(data);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return toast.error("Lengkapi nama dan ucapan");
    
    setIsSubmitting(true);
    const { error } = await supabase.from("wishes").insert([{ name, message }]);
    setIsSubmitting(false);

    if (error) {
      return toast.error("Gagal mengirim ucapan: " + error.message);
    }

    setName("");
    setMessage("");
    toast.success("Doa dan ucapanmu telah terkirim 🌸");
    fetchWishes();
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20" style={{ background: "linear-gradient(180deg, #f7f0e3 0%, #efe6d5 50%, #f0e8d8 100%)" }}>
      {/* Islamic Arch Top Border */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-24">
        <svg viewBox="0 0 1440 96" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 L0,60 Q360,96 720,60 Q1080,24 1440,60 L1440,0 Z" fill="#c9a96e" opacity="0.15"/>
          <path d="M0,0 L0,50 Q360,86 720,50 Q1080,14 1440,50 L1440,0 Z" fill="#c9a96e" opacity="0.08"/>
        </svg>
      </div>

      {/* Gunungan decorations (left & right) */}
      <img src={gununganGold} alt="" className="absolute left-0 top-1/2 -translate-y-1/2 w-32 sm:w-48 opacity-15 pointer-events-none" />
      <img src={gununganGold} alt="" className="absolute right-0 top-1/2 -translate-y-1/2 w-32 sm:w-48 opacity-15 pointer-events-none scale-x-[-1]" />

      {/* Floral corners */}
      <img src={floralCorner} alt="" className="absolute top-0 left-0 w-28 sm:w-40 opacity-60 pointer-events-none" />
      <img src={floralCorner} alt="" className="absolute top-0 right-0 w-28 sm:w-40 opacity-60 pointer-events-none scale-x-[-1]" />
      <img src={floralCorner} alt="" className="absolute bottom-0 left-0 w-28 sm:w-40 opacity-60 pointer-events-none rotate-180 scale-x-[-1]" />
      <img src={floralCorner} alt="" className="absolute bottom-0 right-0 w-28 sm:w-40 opacity-60 pointer-events-none rotate-180" />

      <FadeInSection className="relative z-10 max-w-3xl mx-auto text-center px-4">
        {/* Header */}
        <p className="font-script text-gold text-2xl sm:text-3xl">✦ Doa & Restu ✦</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy mt-1">Wedding Wishes</h2>
        <p className="text-muted-foreground mt-3 italic text-sm sm:text-base">Sampaikan doa dan harapan terbaik untuk kami</p>
        <Divider />

        {/* Form Card with Gold Border */}
        <form
          onSubmit={submit}
          className="mt-6 relative rounded-md p-6 sm:p-8 text-left space-y-4"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "2px solid #c9a96e",
            boxShadow: "0 0 0 4px rgba(201,169,110,0.12), 0 8px 32px rgba(0,0,0,0.06)",
          }}
        >
          {/* Gold corner accents */}
          <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold rounded-tl-sm" />
          <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold rounded-tr-sm" />
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold rounded-bl-sm" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold rounded-br-sm" />

          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-gold shrink-0" />
            <Input
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gold/30 focus:border-gold bg-white/60"
            />
          </div>
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="text-gold shrink-0 mt-3" />
            <Textarea
              placeholder="Tulis ucapan & doa..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-gold/30 focus:border-gold bg-white/60"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-navy text-ivory hover:bg-navy/90 rounded-full py-5"
          >
            {isSubmitting ? "Mengirim..." : <><Sparkles size={14} className="mr-2" /> Kirim Doa & Ucapan</>}
          </Button>
        </form>

        {/* Wishes List */}
        <div className="mt-10 space-y-4 max-h-[420px] overflow-y-auto pr-1 text-left">
          {wishes.map((w) => (
            <div
              key={w.id}
              className="rounded-md p-5 animate-[fade-up_0.6s_ease-out_both]"
              style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(201,169,110,0.25)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-blush flex items-center justify-center text-ivory font-serif text-sm">
                  {w.name[0]}
                </div>
                <div>
                  <div className="font-serif text-navy">{w.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(w.created_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{w.message}</p>
            </div>
          ))}
        </div>
      </FadeInSection>

      {/* Gold ornament separator at bottom */}
      <div className="flex justify-center mt-10">
        <img src={goldMandala} alt="" className="w-12 h-12 opacity-60" />
      </div>
    </section>
  );
}

/* ============== GIFT / E-ANGPAO ============== */
const ACCOUNTS = [
  { bank: "BCA", number: "1234567890", name: "Naufal" },
  { bank: "Mandiri", number: "9876543210", name: "Erika" },
  { bank: "SeaBank", number: "9012345678", name: "Naufal" },
];

function GiftSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (num: string) => {
    try {
      await navigator.clipboard.writeText(num);
      setCopied(num);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error("Tidak dapat menyalin");
    }
  };

  return (
    <section id="gift" className="relative overflow-hidden py-16 sm:py-20" style={{ background: "linear-gradient(180deg, #f0e8d8 0%, #ebe2d0 50%, #f0e8d8 100%)" }}>
      {/* Batik pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: `url(${islamicPatternBg})`, backgroundSize: "300px", backgroundRepeat: "repeat" }} />

      {/* Animated Wayang Left */}
      <div className="absolute left-0 bottom-0 w-28 sm:w-44 pointer-events-none" style={{ animation: "wayang-sway 4s ease-in-out infinite" }}>
        <img src={wayangLeft} alt="" className="w-full opacity-70" />
      </div>

      {/* Animated Wayang Right */}
      <div className="absolute right-0 bottom-0 w-28 sm:w-44 pointer-events-none" style={{ animation: "wayang-sway 4s ease-in-out infinite 0.5s" }}>
        <img src={wayangRight} alt="" className="w-full opacity-70" />
      </div>

      <FadeInSection className="relative z-10 max-w-4xl mx-auto text-center px-4">
        {/* Header */}
        <p className="font-script text-gold text-2xl sm:text-3xl">✦ Tanda Kasih ✦</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy mt-1">E-Angpao</h2>
        <Divider />
        <p className="text-muted-foreground max-w-xl mx-auto italic text-sm sm:text-base">
          Doa restu Anda adalah hadiah terindah.<br />
          Namun, jika berkenan memberikan tanda kasih,<br />
          kami menyediakan opsi digital berikut.
        </p>

        {/* Bank Cards Grid */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACCOUNTS.map((a) => (
            <div
              key={a.number}
              className="relative rounded-md p-6 text-left overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(247,240,227,0.95) 100%)",
                border: "2px solid #c9a96e",
                boxShadow: "0 0 0 3px rgba(201,169,110,0.1), 0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              {/* Gold corner accents */}
              <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-gold" />
              <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-gold" />
              <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-gold" />
              <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-gold" />

              {/* Gold mandala decoration */}
              <img src={goldMandala} alt="" className="absolute top-3 right-3 w-14 h-14 opacity-20 pointer-events-none" />

              {/* Bank Logo */}
              <div className="mb-3">{getBankLogo(a.bank)}</div>

              {/* Account Details */}
              <div className="font-serif text-xl sm:text-2xl text-navy tracking-wider mt-2">
                {a.number.replace(/(\d{4})/g, "$1 ").trim()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">a.n. <span className="font-semibold text-navy/80">{a.name}</span></div>

              {/* Copy Button */}
              <Button
                onClick={() => copy(a.number)}
                className="w-full mt-4 bg-navy text-ivory hover:bg-navy/90 rounded-full py-4 text-xs tracking-wide"
              >
                {copied === a.number ? (
                  <><Check size={14} className="mr-2" /> Tersalin!</>
                ) : (
                  <><Copy size={14} className="mr-2" /> Salin Nomor Rekening</>
                )}
              </Button>
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  );
}

/* ============== APOLOGY ============== */
function ApologySection() {
  return (
    <section className="section-pad bg-navy text-ivory">
      <FadeInSection className="max-w-2xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">Mohon Maaf</p>
        <h2 className="font-serif text-4xl gold-text">Apology</h2>
        <Divider />
        <p className="text-ivory/80 leading-relaxed italic">
          Tanpa mengurangi rasa hormat, izinkan kami menyampaikan undangan ini secara digital.
          Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kebahagiaan yang sangat berarti bagi
          kami.
        </p>
        <Divider />
      </FadeInSection>
    </section>
  );
}

/* ============== STREAMING ============== */
function StreamingSection() {
  return (
    <section className="section-pad bg-gradient-to-b from-ivory to-muted/40">
      <FadeInSection className="max-w-2xl mx-auto text-center">
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
      </FadeInSection>
    </section>
  );
}

/* ============== THANK YOU ============== */
function ThankYouSection() {
  return (
    <section
      id="thanks"
      className="thank-you-bg screen-section relative flex items-center justify-center section-pad text-center overflow-hidden"
    >
      <img
        src={bgThankYouLandscape}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center hidden sm:block pointer-events-none"
      />
      <img
        src={bgThankYouPortrait}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center sm:hidden pointer-events-none"
      />
      <CornerFloral className="absolute top-4 left-4 w-28 sm:w-44 text-gold/60" />
      <CornerFloral className="absolute top-4 right-4 w-28 sm:w-44 text-gold/60" flip />
      <CornerFloral
        className="absolute bottom-4 left-4 w-28 sm:w-44 text-gold/60"
        style={{ transform: "scaleY(-1)" }}
      />
      <CornerFloral
        className="absolute bottom-4 right-4 w-28 sm:w-44 text-gold/60"
        style={{ transform: "scale(-1,-1)" }}
      />
      <FadeInSection className="relative max-w-xl">
        <Sparkles className="mx-auto text-gold animate-[float_6s_ease-in-out_infinite]" size={32} />
        <p className="font-script text-gold text-3xl mt-4">With Love</p>
        <h2 className="font-serif text-5xl sm:text-7xl gold-text">Thank You</h2>
        <Divider />
        <p className="text-ivory/80 leading-relaxed italic">
          Terima kasih atas doa, ucapan, dan kehadiran Bapak/Ibu/Saudara/i. Semoga kebaikan yang
          diberikan menjadi berkah bagi kita semua.
        </p>
        <Divider />
        <p className="font-serif text-2xl text-ivory mt-4">Naufal &amp; Erika</p>
        <p className="text-xs text-ivory/50 mt-10">
          Baswara Creative © 2026. This invitation saves paper and reduces carbon footprint.
        </p>
      </FadeInSection>
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
    <nav className="floating-nav fixed left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full border border-gold/40 bg-navy/85 backdrop-blur-md shadow-2xl">
      <ul className="flex items-center gap-1 sm:gap-2">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1.5 rounded-full text-ivory/70 hover:text-gold hover:bg-ivory/5 transition"
              aria-label={it.label}
            >
              <it.icon size={16} />
              <span className="text-[9px] tracking-widest uppercase hidden sm:block">
                {it.label}
              </span>
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
      className="music-button fixed z-40 w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center shadow-xl hover:scale-110 transition animate-[float_4s_ease-in-out_infinite]"
      aria-label="Toggle music"
    >
      {playing ? (
        <Music2 size={18} className="animate-spin [animation-duration:4s]" />
      ) : (
        <VolumeX size={18} />
      )}
    </button>
  );
}
