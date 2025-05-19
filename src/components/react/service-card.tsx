import React from "react";
import {
  Search,
  FileText,
  MessageCircle,
  Heart,
  FileIcon as FileList,
  Database,
} from "lucide-react";

const services = [
  {
    title: "Ruang Paralegal",
    description: "Akses informasi dan sumber daya untuk paralegal",
    icon: <Search className="h-12 w-12 text-slate-800" />,
    href: "https://www.ruangparalegal.com/",
  },
  {
    title: "Pos Bantuan Hukum",
    description: "Layanan bantuan hukum untuk masyarakat",
    icon: <FileText className="h-12 w-12 text-slate-800" />,
    href: "https://www.ruangparalegal.com/",
  },
  {
    title: "Peacemaker Justice Award",
    description: "Penghargaan untuk paralegal berprestasi",
    icon: <Heart className="h-12 w-12 text-slate-800" />,
    href: "https://pja.bphn.go.id",
  },
  {
    title: "SIDBANKUM",
    description: "Sistem Informasi Database Bantuan Hukum",
    icon: <Database className="h-12 w-12 text-slate-800" />,
    href: "https://sidbankum.bphn.go.id/",
  },
  {
    title: "LSCC",
    description: "Legal Smart Community Channel",
    icon: <FileList className="h-12 w-12 text-slate-800" />,
    href: "https://lsc.bphn.go.id/",
  },
  {
    title: "Penyuluh Hukum",
    description: "Pembinaan dan pengembangan Penyuluh Hukum di Indonesia",
    icon: <MessageCircle className="h-12 w-12 text-slate-800" />,
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
    <div className="flex flex-col items-center justify-center px-4 2xl:max-w-full my-5">
      <h3 className={"mb-5 text-2xl font-bold"}>Tautan Cepat.</h3>
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
      className="flex flex-col items-center justify-center rounded-3xl border-2 border-[#152553] p-3 transition-shadow duration-300 hover:shadow-md sm:p-6"
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
