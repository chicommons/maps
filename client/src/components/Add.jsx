import React, { Component } from "react";

import { DEFAULT_COUNTRY_CODE } from "../utils/constants";
import FormContainer from "../containers/FormContainer";

const Add = () => {
  const initNewCoop = {
    name: "",
    types: [],
    addresses: [
      {
        formatted: "",
        locality: {
          name: "",
          postal_code: "",
          state: {
            name: "",
            code: "",
            country: {
              name: "",
              code: DEFAULT_COUNTRY_CODE,
            },
          },
        },
        country: {
          code: DEFAULT_COUNTRY_CODE,
        },
      },
    ],
    enabled: true,
    email: {
      email: "",
    },
    phone: {
      phone: "",
    },
    web_site: "",
  };

  return <FormContainer coop={initNewCoop} />;
};

export default Add;
