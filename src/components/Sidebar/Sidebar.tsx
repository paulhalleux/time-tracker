import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

import { PAGES } from "../../constants/pages.ts";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.sidebar__title}>{t("title")}</h2>
      <nav className={styles.sidebar__nav}>
        {PAGES.map((page) => (
          <NavLink
            key={page.id}
            to={page.path}
            className={({ isActive }) =>
              clsx(styles.sidebar__nav__link, {
                [styles["sidebar__nav__link--active"]]: isActive,
              })
            }
          >
            {page.icon && <page.icon size={16} />}
            {t(page.labelI18nKey)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
