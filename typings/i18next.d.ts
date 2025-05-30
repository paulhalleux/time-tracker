import "i18next";

import enUS from "../public/locales/en-US.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "en-US";
    resources: {
      "en-US": typeof enUS;
    };
  }
}
