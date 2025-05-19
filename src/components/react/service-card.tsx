import React from "react";
import { Search, FileText, MessageCircle, Heart, FileIcon as FileList, Database } from "lucide-react"


const services = [
  {
    title: "Ruang Paralegal",
    description: "Akses informasi dan sumber daya untuk paralegal",
    icon: <Search className="w-12 h-12 text-slate-800" />,
    href: "https://www.ruangparalegal.com/"
  },
  {
    title: "Pos Bantuan Hukum",
    description: "Layanan bantuan hukum untuk masyarakat",
    icon: <FileText className="w-12 h-12 text-slate-800" />,
    href: "https://www.ruangparalegal.com/"
  },
  {
    title: "Peacemaker Justice Award",
    description: "Penghargaan untuk paralegal berprestasi",
    icon: <Heart className="w-12 h-12 text-slate-800" />,
    href: "https://pja.bphn.go.id"
  },
  {
    title: "SIDBANKUM",
    description: "Sistem Informasi Database Bantuan Hukum",
    icon: <Database className="w-12 h-12 text-slate-800" />,
    href: "https://sidbankum.bphn.go.id/"
  },
  {
    title: "LSCC",
    description: "Legal Smart Community Channel",
    icon: <FileList className="w-12 h-12 text-slate-800" />,
    href: "https://lsc.bphn.go.id/"
  },
  {
    title: "Penyuluh Hukum",
    description: "Pembinaan dan pengembangan Penyuluh Hukum di Indonesia",
    icon: <MessageCircle className="w-12 h-12 text-slate-800" />,
    href: "https://fungsional.bphn.go.id"
  },
]

interface ServiceCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}

export default function Services(){
  return (
    <div className="flex flex-col items-center justify-center px-4 2xl:max-w-full">
      <h3 className={'font-bold text-2xl my-3'}>Tautan Cepat.</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
  )
}

function ServiceCard({ href,icon, title, description }: ServiceCardProps) {
  return (
    <a href={href} target={"_blank"} className="flex flex-col items-center justify-center p-3 sm:p-6 border-2 border-slate-200 rounded-3xl hover:shadow-md transition-shadow duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-center font-medium text-sm uppercase tracking-wide text-slate-800">{title}</h3>
      <p className="text-xs text-center text-slate-600 mt-2 hidden md:block">{description}</p>
    </a>
  )
}
