
export const LOGGED_IN_USER_NAVBAR_LINKS = [
  { name: "Home", href: "/" },
  { name: "Add", href: "/directory-additions-updates" },
  { name: "Search", href: "/search" },
  {
    name: "Return",
    href: "https://www.chicommons.coop/cooperative-map/",
  },
];
//TODO verify if this should be button or converted to link like rest of navbar
export const LOGOUT_BUTTON = ["logout"];

export const NEW_USER_NAVBAR_LINKS = [
  { name: "Home", href: "/" },
  { name: "Add", href: "/directory-additions-updates" },
  { name: "Search", href: "/search" },
  {
    name: "Return",
    href: "https://www.chicommons.coop/cooperative-map/",
  },
  { name: "Login", href: "/login" },
];

export const FOOTER_LINKS = [
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
//used at directory-additions-updates view
export const REQUIRED_DIR_ADD_UPDATE_LABELS = [
  "Cooperative/Entity Name",
  "Street Address",
  "City",
  "State",
  "Zip Code",
  "County",
  "Country",
  "Is Address to be public on the map?",
  "Website or Social Media Page (separate multiple links with a comma)",
  "General Contact Phone Number",
  "Type",
  "Is Phone to be public on the map?",
  "Cooperative/Entity Contact First Name",
  "Cooperative/Entity Contact Last Name",
  "Is Contact name to be public on the map?",
  "Contact Person Contact Phone Number",
  "Type",
  "Is Phone to be public on the map?",
  "Entity types",
  "Scope of Service",
  "Add description tags here, separated by commas",
  "Entity Description (English)",
  "Entity Description (Other Language)",

  "Please list your reason for submitting this request",
];

export const REQUIRED_DIR_ADD_UPDATE_BUTTONS = [
  "Add Contact Method",
  "Add Contact Person",
  "Send Addition/Update",
  "Cancel",
];

// used at /search
export const SEARCH_VIEW_LABELS = [
  "Name",
  "Street",
  "City",
  "Postal Code",
  "County",
  "State",
  "Enabled",
];
export const REQUIRED_SEARCH_VIEW_BUTTONS = ["Submit", "Cancel"];
