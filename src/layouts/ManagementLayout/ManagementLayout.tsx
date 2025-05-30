import { PlusIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { Outlet, useMatches } from "react-router";

import { Button } from "../../components";
import type { ApplicationPage } from "../../constants/pages.ts";
import styles from "./ManagementLayout.module.css";

export function ManagementLayout() {
  const { t } = useTranslation();

  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];

  if (!matches || !currentRoute) {
    return "No match found";
  }

  const currentPage = currentRoute.handle as ApplicationPage;

  if (currentPage.meta && currentPage.meta._type !== "management") {
    return "This layout is only for management pages.";
  }

  return (
    <div className={styles.layout}>
      <header className={styles.layout__header}>
        <div className={styles.layout__header__main}>
          <h1 className={styles.layout__title}>
            {t(currentPage.labelI18nKey)}
          </h1>
          {currentPage.descriptionI18nKey && (
            <p className={styles.layout__description}>
              {t(currentPage.descriptionI18nKey)}
            </p>
          )}
        </div>
        <div className={styles.layout__header__actions}>
          {currentPage.meta?.enableCreate && (
            <Button.Link to={`${currentPage.path}/new`} variant="secondary">
              <PlusIcon size={12} />
              {currentPage.meta.createLabelI18nKey
                ? t(currentPage.meta.createLabelI18nKey)
                : "Create New"}
              {/*<Keybind binding="Ctrl+N" />*/}
            </Button.Link>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}
