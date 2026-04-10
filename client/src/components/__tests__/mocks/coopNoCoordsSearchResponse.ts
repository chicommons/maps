export interface NoCoordResponse {
  id: number;
  name: string;
  addresses: [
    {
      id: number;
      street_number: string;
      route: string;
      raw: string;
      formatted: string;
      latitude: null;
      longitude: null;
      locality: {
        id: number;
        name: string;
        postal_code: string;
        state: {
          id: number;
          code: string;
          name: string;
          country: { id: number; name: "United States"; code: "US" };
        };
      };
    },
  ];
}

export const coopNoCoordsSearchResponse: NoCoordResponse[] = [
  {
    id: 9,
    name: "2840 N. Francisco",
    addresses: [
      {
        id: 9,
        street_number: "2840",
        route: "Francisco",
        raw: "2840 N Francisco",
        formatted: "2840 N Francisco",
        latitude: null,
        longitude: null,
        locality: {
          id: 66,
          name: "Chicago",
          postal_code: "60618",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 78,
    name: "BCU",
    addresses: [
      {
        id: 75,
        street_number: "6409",
        route: "B-2",
        raw: "6409 Grand Ave Unit B-2",
        formatted: "6409 Grand Ave Unit B-2",
        latitude: null,
        longitude: null,
        locality: {
          id: 89,
          name: "Gurnee",
          postal_code: "60031",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 82,
    name: "Bethel Terrace",
    addresses: [
      {
        id: 79,
        street_number: "900",
        route: "Pkwy",
        raw: "900 W 63rd Pkwy",
        formatted: "900 W 63rd Pkwy",
        latitude: null,
        longitude: null,
        locality: {
          id: 48,
          name: "Chicago",
          postal_code: "60621",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 97,
    name: "Bleux Financial Solutions Inc.",
    addresses: [
      {
        id: 94,
        street_number: "1751D",
        route: "Street",
        raw: "1751D W Howard Street",
        formatted: "1751D W Howard Street",
        latitude: null,
        longitude: null,
        locality: {
          id: 74,
          name: "Chicago",
          postal_code: "60626",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 139,
    name: "Carmen Marine Cooperative",
    addresses: [
      {
        id: 133,
        street_number: "5030",
        route: "Drive",
        raw: "5030 N Marine Drive",
        formatted: "5030 N Marine Drive",
        latitude: null,
        longitude: null,
        locality: {
          id: 60,
          name: "Chicago",
          postal_code: "60640",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 148,
    name: "Central CU of Illinois",
    addresses: [
      {
        id: 142,
        street_number: "9850",
        route: "St",
        raw: "9850 W 159th St",
        formatted: "9850 W 159th St",
        latitude: null,
        longitude: null,
        locality: {
          id: 38,
          name: "Orland Park",
          postal_code: "60467",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 151,
    name: "Centro Comunitario Juan Diego",
    addresses: [
      {
        id: 145,
        street_number: "8812",
        route: "Ave",
        raw: "8812 S Commercial Ave",
        formatted: "8812 S Commercial Ave",
        latitude: null,
        longitude: null,
        locality: {
          id: 91,
          name: "Chicago",
          postal_code: "60617",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 173,
    name: "Chicago Food Policy Action Council",
    addresses: [
      {
        id: 164,
        street_number: "1",
        route: "St",
        raw: "1 N State St",
        formatted: "1 N State St",
        latitude: null,
        longitude: null,
        locality: {
          id: 24,
          name: "Chicago",
          postal_code: "60602",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 200,
    name: "Chicago Volunter Doulas",
    addresses: [
      {
        id: 191,
        street_number: "POBox",
        route: "5851",
        raw: "POBox 5851",
        formatted: "POBox 5851",
        latitude: null,
        longitude: null,
        locality: {
          id: 73,
          name: "Chicago",
          postal_code: "60680",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 205,
    name: "ChiFresh Kitchen",
    addresses: [
      {
        id: 196,
        street_number: "135",
        route: "Ave",
        raw: "135 N Kedzie Ave",
        formatted: "135 N Kedzie Ave",
        latitude: null,
        longitude: null,
        locality: {
          id: 72,
          name: "Chicago",
          postal_code: "60612",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 234,
    name: "Covenantal Community of University Church",
    addresses: [
      {
        id: 223,
        street_number: "5655",
        route: "Ave",
        raw: "5655 S University Ave",
        formatted: "5655 S University Ave",
        latitude: null,
        longitude: null,
        locality: {
          id: 96,
          name: "Chicago",
          postal_code: "60637",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 248,
    name: "Cumberland Green Cooperative",
    addresses: [
      {
        id: 235,
        street_number: "1798",
        route: "Dr",
        raw: "1798 Cumberland Green Dr",
        formatted: "1798 Cumberland Green Dr",
        latitude: null,
        longitude: null,
        locality: {
          id: 22,
          name: "St. Charles",
          postal_code: "60174",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 256,
    name: "The Dill Pickle Food Co-op",
    addresses: [
      {
        id: 241,
        street_number: "2746",
        route: "Ave",
        raw: "2746 N Milwaukee Ave",
        formatted: "2746 N Milwaukee Ave",
        latitude: null,
        longitude: null,
        locality: {
          id: 93,
          name: "Chicago",
          postal_code: "60647",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 297,
    name: "Emma Goldman Cooperative",
    addresses: [
      {
        id: 281,
        street_number: "2449",
        route: "Ave",
        raw: "2449 N Monticello Ave",
        formatted: "2449 N Monticello Ave",
        latitude: null,
        longitude: null,
        locality: {
          id: 93,
          name: "Chicago",
          postal_code: "60647",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 326,
    name: "Freedom Road Co-op",
    addresses: [
      {
        id: 308,
        street_number: "4441",
        route: "Street",
        raw: "4441 N Malden Street",
        formatted: "4441 N Malden Street",
        latitude: null,
        longitude: null,
        locality: {
          id: 60,
          name: "Chicago",
          postal_code: "60640",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 346,
    name: "Ginger Ridge MHA",
    addresses: [
      {
        id: 327,
        street_number: "1954",
        route: "Drive",
        raw: "1954 Memorial Drive",
        formatted: "1954 Memorial Drive",
        latitude: null,
        longitude: null,
        locality: {
          id: 21,
          name: "Calumet City",
          postal_code: "60409",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 368,
    name: "GreenRise Intentional Community",
    addresses: [
      {
        id: 348,
        street_number: "4750",
        route: "Rd",
        raw: "4750 N Sheridan Rd",
        formatted: "4750 N Sheridan Rd",
        latitude: null,
        longitude: null,
        locality: {
          id: 60,
          name: "Chicago",
          postal_code: "60640",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 420,
    name: "IWW",
    addresses: [
      {
        id: 397,
        street_number: "PO",
        route: "180195",
        raw: "PO Box 180195",
        formatted: "PO Box 180195",
        latitude: null,
        longitude: null,
        locality: {
          id: 66,
          name: "Chicago",
          postal_code: "60618",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 497,
    name: "LSG Cleaning Services",
    addresses: [
      {
        id: 462,
        street_number: "2030",
        route: "Ave",
        raw: "2030 S 7th Ave",
        formatted: "2030 S 7th Ave",
        latitude: null,
        longitude: null,
        locality: {
          id: 10,
          name: "Maywood",
          postal_code: "60153",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 860,
    name: "The Vetrinary Cooperative",
    addresses: [
      {
        id: 773,
        street_number: "2906",
        route: "116",
        raw: "2906 Central Street_ STE 116",
        formatted: "2906 Central Street_ STE 116",
        latitude: null,
        longitude: null,
        locality: {
          id: 43,
          name: "Evanston",
          postal_code: "60201",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 861,
    name: "REJUVaNATION Equity Development Cooperative",
    addresses: [
      {
        id: 774,
        street_number: "7956",
        route: "King",
        raw: "7956 S King",
        formatted: "7956 S King",
        latitude: null,
        longitude: null,
        locality: {
          id: 31,
          name: "Chicago",
          postal_code: "60619",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 862,
    name: "Wild Onion Market",
    addresses: [
      {
        id: 775,
        street_number: "7007",
        route: "Street",
        raw: "7007 N Clark Street",
        formatted: "7007 N Clark Street",
        latitude: null,
        longitude: null,
        locality: {
          id: 74,
          name: "Chicago",
          postal_code: "60626",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 863,
    name: "Southside Food Co-op",
    addresses: [
      {
        id: 776,
        street_number: "400",
        route: "St",
        raw: "400 E 71st St",
        formatted: "400 E 71st St",
        latitude: null,
        longitude: null,
        locality: {
          id: 31,
          name: "Chicago",
          postal_code: "60619",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 864,
    name: "pure support",
    addresses: [
      {
        id: 777,
        street_number: "3770",
        route: "N",
        raw: "3770 COUNTY ROAD F N",
        formatted: "3770 COUNTY ROAD F N",
        latitude: null,
        longitude: null,
        locality: {
          id: 81,
          name: "Delavan",
          postal_code: "53115",
          state: {
            id: 19351,
            code: "WI",
            name: "Wisconsin",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 865,
    name: "Chicago Cane Cooperative",
    addresses: [
      {
        id: 778,
        street_number: "1856",
        route: "Rd",
        raw: "1856 Elmhurst Rd",
        formatted: "1856 Elmhurst Rd",
        latitude: null,
        longitude: null,
        locality: {
          id: 28,
          name: "Mt. Prospect",
          postal_code: "60056",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
  {
    id: 867,
    name: "The Chicago Tool Library",
    addresses: [
      {
        id: 779,
        street_number: "4015",
        route: "101",
        raw: "4015 W Carroll Ave Ste 101",
        formatted: "4015 W Carroll Ave Ste 101",
        latitude: null,
        longitude: null,
        locality: {
          id: 82,
          name: "Chicago",
          postal_code: "60624",
          state: {
            id: 19313,
            code: "IL",
            name: "Illinois",
            country: { id: 484, name: "United States", code: "US" },
          },
        },
      },
    ],
  },
];
