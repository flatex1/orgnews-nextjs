import { Menu, LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import { formatName, getRoleRu } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = async ({
  logo = {
    url: "/",
    src: "/logo.svg",
    alt: "Логотип компании",
    title: "TECHNOVA",
  },
  menu = [
    { title: "Главная", url: "/" },
    { title: "Новости", url: "/news" },
    { title: "О компании", url: "#about" },
    { title: "Контакты", url: "#contacts" },
  ],
  auth = {
    login: { title: "Войти", url: "/auth/login" },
    signup: { title: "Регистрация", url: "/auth/register" },
  },
}: Navbar1Props) => {
  // Получаем сессию из куки
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  let user = null;
  if (session) {
    try {
      const { userId } = JSON.parse(session);
      user = await fetchQuery(api.auth.getUserPublicById, { userId });
    } catch {}
  }
  return (
    <section className="py-4">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={32}
                height={32}
                priority
                className="max-h-8"
              />
              <span className="text-lg font-normal tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base text-black">
                  {formatName(user.fullName)}
                </span>
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  {getRoleRu(user.role)}
                </span>
                <form action="/auth/logout" method="post">
                  <button
                    type="submit"
                    className="ml-2 p-1 rounded-full hover:bg-muted transition-colors"
                    title="Выйти"
                  >
                    <LogOut className="w-5 h-5 text-muted-foreground" />
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <a href={auth.login.url}>{auth.login.title}</a>
                </Button>
                <Button asChild size="sm">
                  <a href={auth.signup.url}>{auth.signup.title}</a>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={32}
                height={32}
                priority
                className="max-h-8"
              />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={32}
                        height={32}
                        priority
                        className="max-h-8"
                      />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  <div className="flex flex-col gap-3">
                    {user ? (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base text-black">
                          {formatName(user.fullName)}
                        </span>
                        <span className="text-xs text-muted-foreground font-normal ml-1">
                          {getRoleRu(user.role)}
                        </span>
                        <form action="/auth/logout" method="post">
                          <button
                            type="submit"
                            className="ml-2 p-1 rounded-full hover:bg-muted transition-colors flex items-center gap-1"
                            title="Выйти"
                          >
                            <LogOut className="w-5 h-5 text-muted-foreground" />
                            <span className="text-xs hidden sm:inline">
                              Выйти
                            </span>
                          </button>
                        </form>
                      </div>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <a href={auth.login.url}>{auth.login.title}</a>
                        </Button>
                        <Button asChild>
                          <a href={auth.signup.url}>{auth.signup.title}</a>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-normal hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-normal">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-normal">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
