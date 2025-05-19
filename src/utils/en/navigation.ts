// An array of links for the navigation bar
const navBarLinks = [
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "Information", url: "/blog" },
  { name: "Contact", url: "/contact" },
];

// An array of links for the footer
const footerLinks = [
  {
    section: "Ecosystem",
    links: [
      { name: "Documentation", url: "/welcome-to-docs/" },
      { name: "Tools & Equipment", url: "/products" },
      { name: "Construction Services", url: "/services" },
    ],
  },
  {
    section: "Company",
    links: [
      { name: "About Us", url: "#" },
      { name: "Blog", url: "/blog" },
      { name: "Careers", url: "#" },
      { name: "Customers", url: "#" },
    ],
  },
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
