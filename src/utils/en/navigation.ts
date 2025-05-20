// An array of links for the navigation bar
const navBarLinks = [
  { name: "Home", url: "/en" },
  { name: "Services", url: "/en/services" },
  { name: "Information", url: "/en/blog" },
  //{ name: "Contact", url: "/en/contact" },
];

// An array of links for the footer
const footerLinks = [
  {
    section: "Ecosystem",
    links: [
      { name: "PartisipasiKu", url: "https://partisipasiku.bphn.go.id" },
      { name: "JDIHN.go.id", url: "https://jdihn.go.id" },
      { name: "Website BPHN", url: "https://bphn.go.id" },
    ],
  },
  {
    "section": "Instansi Terkait",
    "links": [
      { "name": "Kementerian Hukum", "url": "https://kemenkum.go.id" },
      { "name": "Badan Pembinaan Hukum Nasional (BPHN)", "url": "https://bphn.go.id" },
      { "name": "Direktorat Jenderal Administrasi Hukum Umum (AHU)", "url": "https://ahu.go.id" },
      { "name": "Direktorat Jenderal Kekayaan Intelektual (DJKI)", "url": "https://dgip.go.id" },
      { "name": "Kementerian Dalam Negeri (Kemendagri)", "url": "https://www.kemendagri.go.id" },
      { "name": "Mahkamah Agung RI", "url": "https://www.mahkamahagung.go.id" }
    ]
  }

];

// An object of links for social media icons
const socialLinks = {
  facebook: "https://www.facebook.com/",
  x: "https://twitter.com/",
  github: "https://github.com/bphndigitalservice",
  google: "https://www.google.com/",
  slack: "https://slack.com/",
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};
