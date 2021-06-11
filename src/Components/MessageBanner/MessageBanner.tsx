import React from "react";
import classnames from "classnames";
import { Link } from "@boomerang-io/carbon-addons-boomerang-react";
import { Close16 } from "@carbon/icons-react";
import styles from "./MessageBanner.module.scss";

function NotificationBanner() {
  const [isOpen, setIsOpen] = React.useState(true);

  const closeBanner = () => {
    setIsOpen(false);
  };

  return (
    <section className={classnames(styles.container, { [styles.hidden]: !isOpen })} role="alert">
      <p className={styles.text}>
        Welcome to Boomerang Bosun! We're excited to have an open source release and hope you enjoy using it. You may
        notice a bug or two. Please don't hesitate to reach out to us on GitHub in the{" "}
        <Link href={`https://github.com/boomerang-io`}>boomerang-io</Link> org. Thanks!
      </p>
      <button className={styles.button} onClick={closeBanner}>
        <Close16 className={styles.closeIcon} alt="Close message banner" />
      </button>
    </section>
  );
}

export default NotificationBanner;
