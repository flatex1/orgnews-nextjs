/* eslint-disable @next/next/no-img-element */
interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  logo = {
    src: "/logo.svg",
    alt: "Логотип компании",
    title: "TECHNOVA",
    url: "/",
  },
  tagline = "IT-новости и технологии будущего.",
  menuItems = [
    {
      title: "О компании",
      links: [
        { text: "Миссия", url: "#about" },
        { text: "Команда", url: "#team" },
      ],
    },
    {
      title: "Новости",
      links: [{ text: "Лента новостей", url: "/" }],
    },
    {
      title: "Контакты",
      links: [{ text: "Связаться с нами", url: "#contacts" }],
    },
    {
      title: "Документы",
      links: [{ text: "Политика конфиденциальности", url: "#privacy" }],
    },
  ],
  copyright = "© 2025 TechNova. Все права защищены.",
  bottomLinks = [
    { text: "Пользовательское соглашение", url: "#terms" },
    { text: "Политика конфиденциальности", url: "#privacy" },
  ],
}: Footer2Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <a href="https://shadcnblocks.com">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10"
                  />
                </a>
                <p className="text-xl font-normal">{logo.title}</p>
              </div>
              <p className="mt-4 font-normal">{tagline}</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-normal">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-primary">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
