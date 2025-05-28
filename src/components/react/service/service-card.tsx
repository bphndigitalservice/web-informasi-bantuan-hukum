import React from "react";
import {
  MessageCircle,
  Database,
} from "lucide-react";

import lsc from "./icon/cerdas-hukum_n.svg?url";
import posbakum from "./icon/POSBANKUM.png?url";
import apregal from "./icon/APREGAL.png?url";
import pja from "./icon/PJA.png?url";
import penyuluhan from "./icon/penyuluhan-hukum.svg?url";
import pkg from "react-lazy-load-image-component";

import "react-lazy-load-image-component/src/effects/blur.css";

const { LazyLoadImage } = pkg;

const services = [
  {
    title: "Ruang Paralegal",
    description: "Akses informasi dan sumber daya untuk paralegal",
    icon: (
      <LazyLoadImage
        alt="Icon Ruang Paralegal"
        src={apregal}
        //effect="blur"
        className="h-20 w-20"
        placeholderSrc={apregal}
      />
    ),
    href: "https://apregal.bphn.go.id/",
  },
  {
    title: "Pos Bantuan Hukum",
    description: "Layanan bantuan hukum untuk masyarakat - di desa",
    icon: (
      <LazyLoadImage
        alt="Icon Ruang Paralegal"
        src={posbakum}
        //effect="blur"
        className="h-20 w-20"
        placeholderSrc={posbakum}
      />
    ),
    href: "https://posbankum.bphn.go.id/",
  },
  {
    title: "Peacemaker Justice Award",
    description: "Penghargaan untuk kepada desa/lurah berprestasi",
    icon: (
      <LazyLoadImage
        alt="Icon Ruang Paralegal"
        src={pja}
        loading={"lazy"}
        className="h-20 w-20"
        placeholderSrc={pja}
      />
    ),
    href: "https://pja.bphn.go.id",
  },
  {
    title: "SIDBANKUM",
    description: "Sistem Informasi Database Bantuan Hukum",
    icon: <Database className="h-12 w-12 text-[#152553]" />,
    href: "https://sidbankum.bphn.go.id/",
  },
  {
    title: "Cerdas Hukum",
    description: "Kanal Informasi dan Konsultasi Hukum untuk masyarakat cerdas hukum",
    icon: (
      <LazyLoadImage
        alt="Icon Ruang Paralegal"
        src={lsc}
        className="h-24 w-24 dark:invert-100"
        placeholderSrc={lsc}
      />
    ),
    href: "https://cerdashukum.bphn.go.id",
  },
  {
    title: "Penyuluhan Hukum",
    description: "Aktivitas penyuluhan Hukum",
    icon: <LazyLoadImage
      alt="Icon Ruang Paralegal"
      src={penyuluhan}
      className="h-24 w-24 dark:invert-100"
      placeholderSrc={penyuluhan}
    />,
    href: "https://cerdashukum.bphn.go.id/Kanalhukum",
  },
];

interface ServiceCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function Services() {
  return (
    <div className="my-5 flex flex-col items-center justify-center px-4 2xl:max-w-full">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            href={service.href}
            icon={service.icon}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </div>
  );
}

function ServiceCard({ href, icon, title, description }: ServiceCardProps) {
  return (
    <a
      href={href}
      target={"_blank"}
      className="flex flex-col items-center justify-center rounded-3xl border border-[#152553] p-3 transition-all duration-300 hover:border-white hover:shadow-md sm:p-6 dark:border-white/80 dark:bg-white/40 dark:backdrop-blur-2xl dark:hover:border-[#FFCB05]/30"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-center text-sm font-bold tracking-wide text-slate-800 uppercase">
        {title}
      </h3>
      <p className="mt-2 text-center text-xs text-slate-600 md:block">
        {description}
      </p>
    </a>
  );
}
