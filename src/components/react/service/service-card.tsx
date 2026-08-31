import React from "react";
import { Database } from "lucide-react";

import lsc from "./icon/literasi-hukum-monochrome.svg?url";
import posbakum from "./icon/posbankum.png?url";
import pja from "./icon/PJA.png?url";
import penyuluhan from "./icon/ph.png?url";
import pkg from "react-lazy-load-image-component";

import "react-lazy-load-image-component/src/effects/blur.css";

const { LazyLoadImage } = pkg;

const services = [
  {
    title: "Pos Bantuan Hukum & Ruang Paralegal",
    description: "Layanan bantuan hukum untuk masyarakat - di desa/kelurahan",
    icon: (
      <LazyLoadImage
        alt="Icon Ruang Paralegal"
        src={posbakum}
        //effect="blur"
        className="h-24 w-24"
        placeholderSrc={posbakum}
      />
    ),
    href: "https://posbankum.bphn.go.id/",
  },
  {
    title: "Peacemaker Training",
    description: "Penguatan Kapasitas Kepala Desa dan Lurah sebagai Juru Damai (Non Litigation Peacemaker)",
    icon: (
      <LazyLoadImage
        alt="Icon Ruang Paralegal"
        src={pja}
        loading={"lazy"}
        className="h-20 w-20"
        placeholderSrc={pja}
      />
    ),
    href: "https://plp.bphn.go.id",
  },
  {
    title: "SIDBANKUM",
    description: "Sistem Informasi Database Bantuan Hukum",
    icon: <Database className="h-16 w-16 text-[#152553]" />,
    href: "https://sidbankum.bphn.go.id/",
  },
  {
    title: "Literasi Hukum",
    description: "Kanal Informasi dan Konsultasi Hukum untuk masyarakat cerdas hukum",
    icon: (
      <LazyLoadImage
        alt="Icon Literasi Hukum"
        src={lsc}
        className="h-20 w-20 dark:invert-100 my-2"
        placeholderSrc={lsc}
      />
    ),
    href: "https://literasihukum.bphn.go.id",
  },
  {
    title: "Penyuluhan Hukum",
    description: "Aktivitas penyuluhan Hukum",
    icon: <LazyLoadImage
      alt="Icon Penyuluhan Hukum"
      src={penyuluhan}
      className="h-24 w-24 dark:invert-100"
      placeholderSrc={penyuluhan}
    />,
    href: "https://fungsional.bphn.go.id",
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
    <div className="my-5 mx-auto w-full max-w-[85rem] px-4 sm:px-6 lg:px-8 2xl:max-w-full">
      <div className="grid w-full grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
        {services.map((service) => (
          <ServiceCard
            key={service.href}
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
      className="flex h-full flex-col items-center justify-start rounded-3xl border border-[#152553] p-3 transition-all duration-300 hover:border-[#FA5A15] hover:shadow-md sm:p-6 dark:border-[#FFCB05]/50 dark:bg-[#FFCB05]/50"
    >
      <div className="mb-4 flex h-24 items-center justify-center">{icon}</div>
      <h3 className="text-center text-sm font-bold tracking-wide text-slate-800 uppercase">
        {title}
      </h3>
      <p className="mt-2 text-center text-xs text-slate-600 md:block">
        {description}
      </p>
    </a>
  );
}
