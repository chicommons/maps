import { screen, within } from "@testing-library/react";

export const verifyNavBar = (isLoggedIn: false) => {
  const navBar = screen.getByRole("navigation");

  const expectedLinks = [
    // { name: /Chicommons/i, href: "/add" },
    { name: /Home/i, href: "/" },
    { name: /Add/i, href: "/directory-additions-updates" },
    { name: /Search/i, href: "/search" },
    { name: /Return/i, href: "https://www.chicommons.coop/cooperative-map/" },
    { name: /Login/i, href: "/login" },
  ];

  expectedLinks.forEach(({ name, href }) => {
    expect(within(navBar).getByRole("link", { name })).toHaveAttribute(
      "href",
      href,
    );
  });
};

export const verifyFooter = () => {
  const footer = screen.getByRole("contentinfo");
  //TODO Verify if we want to keep links or just count number of links
  const expectedLinks = [
    {
      name: /Privacy Policy/i,
      href: "https://www.chicommons.coop/privacy-policy/",
    },
    { name: /Dave Alvarado/i, href: "https://github.com/laredotornado" },
    { name: /Davey Anians/i, href: "https://github.com/DaveyDevs" },
    {
      name: /Elena Smith/i,
      href: "https://github.com/ozzysChiefDataScientist",
    },
    { name: /Nick Hou/i, href: "https://github.com/nick-hou" },
  ];

  expectedLinks.forEach(({ name, href }) => {
    expect(within(footer).getByRole("link", { name })).toHaveAttribute(
      "href",
      href,
    );
  });
};
