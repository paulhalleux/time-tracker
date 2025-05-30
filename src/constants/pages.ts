import { GaugeIcon, type Icon, RowsIcon } from "@phosphor-icons/react";
import type { ParseKeys } from "i18next";
import * as React from "react";
import { Outlet } from "react-router";

import { ManagementLayout } from "../layouts/ManagementLayout";
import { CategoriesPage, DashboardPage } from "../pages";

export type MainPageMeta = {
  _type: "main";
};

export type ManagementPageMeta = {
  _type: "management";
  enableCreate?: boolean;
  createLabelI18nKey?: ParseKeys;
};

export type PageMeta = MainPageMeta | ManagementPageMeta;

export type ApplicationLayout = {
  id: string;
  layoutComponent: React.ComponentType;
  pages: ApplicationPage[];
};

export type ApplicationPage = {
  id: string;
  icon?: Icon;
  labelI18nKey: ParseKeys;
  descriptionI18nKey?: ParseKeys;
  path: string;
  component: React.ComponentType;
  meta?: PageMeta;
};

export const LAYOUTS: ApplicationLayout[] = [
  {
    id: "main",
    layoutComponent: Outlet,
    pages: [
      {
        id: "dashboard",
        icon: GaugeIcon,
        labelI18nKey: "page.dashboard.title",
        path: "/",
        component: DashboardPage,
      },
    ],
  },
  {
    id: "management",
    layoutComponent: ManagementLayout,
    pages: [
      {
        id: "categories",
        icon: RowsIcon,
        labelI18nKey: "page.categories.title",
        descriptionI18nKey: "page.categories.description",
        path: "/categories",
        component: CategoriesPage,
        meta: {
          _type: "management",
          enableCreate: true,
          createLabelI18nKey: "page.categories.create.label",
        },
      },
    ],
  },
];

export const PAGES: ApplicationPage[] = LAYOUTS.flatMap(
  (layout) => layout.pages,
);
