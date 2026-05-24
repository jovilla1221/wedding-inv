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
import goldMandala from "@/assets/gold-mandala.png";
import cakraJawa from "@/assets/cakra_jawa.png";
import islamicPatternBg from "@/assets/islamic-pattern-bg.png";
import wayangLeft from "@/assets/wayang-left.png";
import wayangRight from "@/assets/wayang-right.png";
import mandiriLogoImg from "@/assets/Mandiri Sahabatku Original.png";
import seabankLogoImg from "@/assets/seabanklogo.png";
import bgWishesAngpaoDesktop from "@/assets/bg_wishes_angpao_desktop.png";
import bgWishesAngpaoMobile from "@/assets/bg_wishes_angpao_mobile.png";
import { supabase } from "@/lib/supabase";
import backgroundMusic from "@/assets/Gending Manten Adat Jawa Kebo Giro.mp3";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { to?: string } => {
    return { to: search.to as string | undefined };
  },
  component: InvitationPage,
});

const WEDDING_DATE = new Date("2026-06-02T08:00:00+07:00");

const MUSIC_START_TIME = 17; // Mulai dari detik ke-17

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
          
          {/* Continuous Background Wrapper for Wishes and E-Angpao */}
          <div className="relative w-full overflow-hidden">
            {/* Desktop Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block" 
              style={{ backgroundImage: `url(${bgWishesAngpaoDesktop})` }} 
            />
            {/* Mobile Background */}
            <div 
              className="absolute inset-0 bg-cover bg-top bg-no-repeat md:hidden" 
              style={{ backgroundImage: `url(${bgWishesAngpaoMobile})` }} 
            />
            {/* Content */}
            <div className="relative z-10">
              <WishesSection />
              <GiftSection />
            </div>
          </div>

          <ThankYouSection />
          <FloatingNav />
          <MusicButton playing={playing} onToggle={toggleMusic} />
        </main>
      )}
    </div>
  );
}

/* ============== FADE IN SECTION ============== */
function FadeInSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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
      { threshold: 0.15 },
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
function Cover({
  opened,
  onOpen,
  guestName,
}: {
  opened: boolean;
  onOpen: () => void;
  guestName: string;
}) {
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
    <section
      id="couple"
      className="section-pad bg-gradient-to-b from-ivory to-muted/60 relative overflow-hidden"
    >
      {/* Left side decoration frame */}
      <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent hidden xl:block pointer-events-none" />
      <div className="absolute left-6 top-8 w-6 h-6 border-t border-l border-gold/50 rounded-tl-sm hidden xl:block pointer-events-none" />
      <div className="absolute left-6 bottom-8 w-6 h-6 border-b border-l border-gold/50 rounded-bl-sm hidden xl:block pointer-events-none" />

      {/* Right side decoration frame */}
      <div className="absolute right-6 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent hidden xl:block pointer-events-none" />
      <div className="absolute right-6 top-8 w-6 h-6 border-t border-r border-gold/50 rounded-tr-sm hidden xl:block pointer-events-none" />
      <div className="absolute right-6 bottom-8 w-6 h-6 border-b border-r border-gold/50 rounded-br-sm hidden xl:block pointer-events-none" />

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
            name="Mohammad Naufal Amru"
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

/* ============== EVENT ============== */
function EventSection() {
  const events = [
    {
      title: "Resepsi",
      date: "Selasa, 2 Juni 2026",
      time: "13:00 - 18:00 WIB",
      address: "Ds. Gilang, Ngunut, Tulungagung Regency, East Java 66292",
    },
  ];
  return (
    <section
      id="event"
      className="section-pad bg-gradient-to-b from-muted/40 to-ivory relative overflow-hidden"
    >
      {/* Left side decoration frame */}
      <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent hidden xl:block pointer-events-none" />
      <div className="absolute left-6 top-8 w-6 h-6 border-t border-l border-gold/50 rounded-tl-sm hidden xl:block pointer-events-none" />
      <div className="absolute left-6 bottom-8 w-6 h-6 border-b border-l border-gold/50 rounded-bl-sm hidden xl:block pointer-events-none" />

      {/* Right side decoration frame */}
      <div className="absolute right-6 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent hidden xl:block pointer-events-none" />
      <div className="absolute right-6 top-8 w-6 h-6 border-t border-r border-gold/50 rounded-tr-sm hidden xl:block pointer-events-none" />
      <div className="absolute right-6 bottom-8 w-6 h-6 border-b border-r border-gold/50 rounded-br-sm hidden xl:block pointer-events-none" />

      <FadeInSection className="max-w-4xl mx-auto text-center">
        <p className="font-script text-gold text-3xl">When & Where</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy">Lokasi &amp; Acara</h2>
        <Divider />
        <p className="text-muted-foreground max-w-xl mx-auto italic">
          Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
        </p>
        <div className="mt-12 max-w-md mx-auto">
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
        </div>
      </FadeInSection>
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
      },
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
    <section
      id="rsvp"
      className="section-pad bg-navy text-ivory relative overflow-hidden min-h-screen flex items-center justify-center"
    >
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
      <FadeInSection className="relative z-10 w-full max-w-xl mx-auto text-center px-4 sm:px-6">
        <p className="font-script text-gold text-3xl">Konfirmasi Kehadiran</p>
        <h2 className="font-serif text-4xl sm:text-5xl gold-text">RSVP</h2>
        <Divider />

        {/* RSVP Card Wrapper */}
        <div className="relative mt-8 rounded-lg p-6 sm:p-8 text-left bg-navy-deep/80 border border-gold backdrop-blur-md shadow-2xl">
          {/* Corner Floral Ornaments inside the card */}
          <CornerFloral className="absolute top-2 left-2 w-6 h-6 text-gold/50" />
          <CornerFloral className="absolute top-2 right-2 w-6 h-6 text-gold/50" flip />
          <CornerFloral
            className="absolute bottom-2 left-2 w-6 h-6 text-gold/50"
            style={{ transform: "scaleY(-1)" }}
          />
          <CornerFloral
            className="absolute bottom-2 right-2 w-6 h-6 text-gold/50"
            style={{ transform: "scale(-1, -1)" }}
          />

          {/* Inner border line */}
          <div className="absolute inset-1.5 border border-gold/20 pointer-events-none rounded-[calc(var(--radius)-3px)]" />

          <form onSubmit={submit} className="relative z-10 space-y-5">
            <div>
              <Label className="text-ivory/80 text-xs tracking-widest uppercase">
                Nama Lengkap
              </Label>
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
              <Label className="text-ivory/80 text-xs tracking-widest uppercase">Jumlah Tamu</Label>
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
              <Label className="text-ivory/80 text-xs tracking-widest uppercase">
                Pesan / Ucapan
              </Label>
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
              {isSubmitting ? (
                "Mengirim..."
              ) : (
                <>
                  <Send size={14} className="mr-2" /> Kirim Konfirmasi
                </>
              )}
            </Button>
          </form>
        </div>
      </FadeInSection>
    </section>
  );
}

/* ============== BANK LOGOS (Inline SVG) ============== */
function BCALogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect rx="4" width="120" height="40" fill="#003d79" />
      <g fill="#fff">
        <circle cx="18" cy="20" r="8" fill="none" stroke="#fff" strokeWidth="1.5" />
        <path d="M14,16 L22,16 L22,24 L14,24 Z" fill="none" stroke="#fff" strokeWidth="1" />
        <text x="15" y="23" fontSize="8" fontWeight="bold" fontFamily="Arial" fill="#fff">
          $
        </text>
      </g>
      <text x="35" y="27" fontSize="18" fontWeight="bold" fontFamily="Arial" fill="#fff">
        BCA
      </text>
    </svg>
  );
}

function MandiriLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <g>
        <path
          d="M8,12 C8,12 14,8 20,12 C26,8 32,12 32,12 L32,28 C32,28 26,32 20,28 C14,32 8,28 8,28 Z"
          fill="#003d79"
        />
        <path d="M14,16 L20,20 L26,16" fill="none" stroke="#ffc72c" strokeWidth="2" />
        <path d="M14,22 L20,26 L26,22" fill="none" stroke="#ffc72c" strokeWidth="2" />
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
      <rect rx="4" width="160" height="40" fill="#00A6E5" />
      <text x="12" y="28" fontSize="18" fontWeight="bold" fontFamily="Arial" fill="#fff">
        Sea
      </text>
      <text x="52" y="28" fontSize="18" fontWeight="bold" fontFamily="Arial" fill="#fff">
        Bank
      </text>
      <path d="M145,10 Q150,20 145,30" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
      <path d="M140,12 Q146,20 140,28" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

function getBankLogo(bank: string) {
  switch (bank) {
    case "BRI":
      return <span className="font-bold text-2xl text-[#00529C] tracking-widest font-sans italic">BRI</span>;
    case "Mandiri":
      return <img src={mandiriLogoImg} alt="Mandiri" className="h-8 w-auto object-contain" />;
    case "SeaBank":
      return <img src={seabankLogoImg} alt="SeaBank" className="h-12 w-auto object-contain origin-left scale-110" />;
    default:
      return null;
  }
}

/* ============== WISHES ORNAMENTS & ICONS ============== */
function InnerCornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      aria-hidden
    >
      <path d="M2 12 C 2 6, 6 2, 12 2" strokeLinecap="round" />
      <path d="M6 18 C 6 10, 10 6, 18 6" strokeLinecap="round" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CrestOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      aria-hidden
    >
      <path d="M16 2 C 12 8, 4 8, 2 14 M16 2 C 20 8, 28 8, 30 14" strokeLinecap="round" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
      <path d="M10 14 Q16 11 22 14" strokeLinecap="round" />
    </svg>
  );
}

function LoopCornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      aria-hidden
    >
      <path d="M2 12 Q12 12 12 2" strokeLinecap="round" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}

function FlowerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <path d="M12 2 Q10 7 12 9.5 Q14 7 12 2 Z" fill="currentColor" />
      <path d="M12 22 Q10 17 12 14.5 Q14 17 12 22 Z" fill="currentColor" />
      <path d="M2 12 Q7 10 9.5 12 Q7 14 2 12 Z" fill="currentColor" />
      <path d="M22 12 Q17 10 14.5 12 Q17 14 22 12 Z" fill="currentColor" />
      <path d="M4.93 4.93 Q8.5 7 10.25 10.25 Q7 8.5 4.93 4.93 Z" fill="currentColor" />
      <path d="M19.07 19.07 Q15.5 17 13.75 13.75 Q17 15.5 19.07 19.07 Z" fill="currentColor" />
      <path d="M19.07 4.93 Q15.5 7 13.75 10.25 Q17 8.5 19.07 4.93 Z" fill="currentColor" />
      <path d="M4.93 19.07 Q8.5 17 10.25 13.75 Q7 15.5 4.93 19.07 Z" fill="currentColor" />
    </svg>
  );
}

function JavaneseSectionDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-12 select-none pointer-events-none w-full max-w-xl mx-auto px-4">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/80" />
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-gold/50 text-xs">✦</span>
        <svg width="64" height="24" viewBox="0 0 64 24" fill="none" className="text-gold shrink-0">
          {/* Central Lotus Flower Ornament */}
          <path
            d="M32 4 C28 12 24 16 16 18 M32 4 C36 12 40 16 48 18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M32 4 C30 10 32 12 32 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="32" cy="12" r="3.5" fill="currentColor" stroke="white" strokeWidth="1" />
          {/* Side buds */}
          <circle cx="20" cy="15" r="1.5" fill="currentColor" />
          <circle cx="44" cy="15" r="1.5" fill="currentColor" />
          {/* Curved Javanese patterns */}
          <path
            d="M22 18 Q32 14 42 18"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-gold/50 text-xs">✦</span>
      </div>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/80" />
    </div>
  );
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
    const { data } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });
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
    <section
      className="relative overflow-hidden py-16 sm:py-20"
    >
      <FadeInSection className="relative z-10 max-w-5xl mx-auto text-center px-4">
        {/* Header */}
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold/50" />
          <p className="font-serif text-gold text-xs uppercase tracking-widest font-semibold">
            ✦ Doa & Restu ✦
          </p>
          <span className="h-px w-8 bg-gold/50" />
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy font-bold mt-2 flex items-center justify-center gap-3">
          <span className="text-gold text-2xl">✦</span> Wedding Wishes{" "}
          <span className="text-gold text-2xl">✦</span>
        </h2>
        <p className="text-navy-deep/70 font-sans text-sm sm:text-base mt-2 tracking-wide">
          Sampaikan doa dan harapan terbaik untuk kami
        </p>
        <div className="flex items-center justify-center gap-2 my-4">
          <span className="h-px w-10 bg-gold/60" />
          <span className="text-gold text-xs">◆</span>
          <span className="h-px w-10 bg-gold/60" />
        </div>

        {/* Responsive Desktop Layout: side-by-side grid on lg, stack on mobile/tablet */}
        <div className="grid lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Form Card */}
          <div className="lg:col-span-5 text-left">
            <form
              onSubmit={submit}
              className="relative rounded-lg p-6 sm:p-8 text-left space-y-4 bg-white/95 border border-gold"
              style={{
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              }}
            >
              {/* Inner double border with ornaments */}
              <div className="absolute inset-1.5 border border-gold/40 pointer-events-none rounded-[calc(var(--radius)-3px)]">
                <InnerCornerOrnament className="absolute top-1 left-1 w-5 h-5 text-gold/80" />
                <InnerCornerOrnament className="absolute top-1 right-1 w-5 h-5 text-gold/80 -scale-x-100" />
                <InnerCornerOrnament className="absolute bottom-1 left-1 w-5 h-5 text-gold/80 -scale-y-100" />
                <InnerCornerOrnament className="absolute bottom-1 right-1 w-5 h-5 text-gold/80 -scale-100" />

                <CrestOrnament className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-4 text-gold/80" />
                <CrestOrnament className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-4 text-gold/80 scale-y-[-1]" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/80 pointer-events-none">
                    <FlowerIcon className="w-4 h-4" />
                  </span>
                  <Input
                    placeholder="Nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-gold/20 focus:border-gold/60 bg-white/50 text-navy placeholder:text-navy/40 rounded-md"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-5 text-gold/80 pointer-events-none">
                    <FlowerIcon className="w-4 h-4" />
                  </span>
                  <Textarea
                    placeholder="Tulis ucapan & doa..."
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="pl-10 pt-4.5 border-gold/20 focus:border-gold/60 bg-white/50 text-navy placeholder:text-navy/40 rounded-md"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1D2D44] hover:bg-[#1D2D44]/90 text-white font-serif font-bold text-sm tracking-wide rounded-md py-6 flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  {isSubmitting ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <FlowerIcon className="w-4 h-4 text-gold" /> Kirim Doa & Ucapan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Wishes List */}
          <div className="lg:col-span-7">
            <div className="space-y-4 max-h-[480px] lg:max-h-[500px] overflow-y-auto pr-2 text-left [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold/35 [&::-webkit-scrollbar-thumb]:rounded-full">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="relative rounded-lg p-5 animate-[fade-up_0.6s_ease-out_both] bg-white/90 border border-gold/25"
                  style={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                  }}
                >
                  {/* Subtle inner double border */}
                  <div className="absolute inset-1 border border-gold/10 pointer-events-none rounded-[6px]" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center text-white font-serif text-sm font-bold shadow-inner">
                        {w.name?.[0] || "?"}
                      </div>
                      <div>
                        <div className="font-serif text-navy font-semibold">{w.name}</div>
                        <div className="text-xs text-navy/55">
                          {new Date(w.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-navy/85 leading-relaxed whitespace-pre-line">
                      {w.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Elegant Javanese crest divider to GiftSection */}
      <JavaneseSectionDivider />
    </section>
  );
}

/* ============== GIFT / E-ANGPAO ============== */
const ACCOUNTS = [
  { bank: "BRI", number: "174601003963503", name: "MOHAMMAD NAUFAL AMRU" },
  { bank: "Mandiri", number: "1710019520108", name: "MOHAMMAD NAUFAL AMRU" },
  { bank: "SeaBank", number: "901448980693", name: "MOHAMMAD NAUFAL AMRU" },
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
    <section
      id="gift"
      className="relative overflow-hidden py-16 sm:py-20"
    >
      <FadeInSection className="relative z-10 max-w-4xl mx-auto text-center px-4">
        {/* Header */}
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold/50" />
          <p className="font-serif text-gold text-xs uppercase tracking-widest font-semibold">
            ✦ Tanda Kasih ✦
          </p>
          <span className="h-px w-8 bg-gold/50" />
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl text-navy font-bold mt-2 flex items-center justify-center gap-3">
          <span className="text-gold text-2xl">✦</span> E-Angpao{" "}
          <span className="text-gold text-2xl">✦</span>
        </h2>
        <p className="text-navy-deep/70 font-sans text-sm sm:text-base mt-2 max-w-xl mx-auto tracking-wide leading-relaxed">
          Doa restu Anda adalah hadiah terindah. Namun, jika berkenan memberikan tanda kasih, kami
          menyediakan opsi digital berikut.
        </p>
        <div className="flex items-center justify-center gap-2 my-4">
          <span className="h-px w-10 bg-gold/60" />
          <span className="text-gold text-xs">◆</span>
          <span className="h-px w-10 bg-gold/60" />
        </div>

        {/* Bank Cards Grid */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 px-2">
          {ACCOUNTS.map((a) => (
            <div
              key={a.number}
              className="relative w-full max-w-[280px] sm:max-w-[320px] rounded-lg pt-6 px-6 pb-16 text-left overflow-hidden bg-white/95 border border-gold transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              }}
            >
              {/* Inner double border with corner loops */}
              <div className="absolute inset-1.5 border border-gold/40 pointer-events-none rounded-[6px]">
                <LoopCornerOrnament className="absolute top-1 left-1 w-4 h-4 text-gold/80" />
                <LoopCornerOrnament className="absolute top-1 right-1 w-4 h-4 text-gold/80 -scale-x-100" />
                <LoopCornerOrnament className="absolute bottom-1 left-1 w-4 h-4 text-gold/80 -scale-y-100" />
                <LoopCornerOrnament className="absolute bottom-1 right-1 w-4 h-4 text-gold/80 -scale-100" />
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  {/* Bank Logo & Mandala ornament */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-8 flex items-center">{getBankLogo(a.bank)}</div>
                    <img
                      src={cakraJawa}
                      alt=""
                      className="w-16 h-16 pointer-events-none -mt-3 -mr-3 drop-shadow-sm"
                    />
                  </div>

                  {/* Account Details */}
                  <div className="font-sans text-xl sm:text-2xl font-bold text-[#1D2D44] tracking-wider mt-4">
                    {a.number.replace(/(\d{4})/g, "$1 ").trim()}
                  </div>
                  <div className="text-xs text-navy/60 mt-1 font-sans">
                    a.n. <span className="font-bold text-[#1D2D44]">{a.name}</span>
                  </div>
                </div>
              </div>

              {/* Copy Button flush at bottom */}
              <button
                onClick={() => copy(a.number)}
                className={`absolute bottom-0 left-0 right-0 w-full font-sans font-bold text-xs uppercase tracking-wider py-4 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-t ${
                  copied === a.number
                    ? "bg-[#2D4A3E] text-white border-emerald-500/20"
                    : "bg-[#1D2D44] hover:bg-[#1C2D40] text-white border-gold/20"
                }`}
                style={{
                  borderBottomLeftRadius: "7px",
                  borderBottomRightRadius: "7px",
                }}
              >
                {copied === a.number ? (
                  <>
                    <Check size={14} className="text-gold" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy size={14} className="text-gold/80" /> Salin Nomor Rekening
                  </>
                )}
              </button>
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
          <div className="text-navy font-serif">13:00 — Resepsi</div>
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
