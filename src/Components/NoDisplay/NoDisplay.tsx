import React from "react";
import cx from "classnames";
import NoGraphic from "./NoGraphic";
import styles from "./noDisplay.module.scss";

const TEXT_LOCATIONS = {
  ABOVE: "above",
  BELOW: "below"
};

interface Props {
  className?: string;
  style?: any;
  text?: string;
  textLocation?: "above" | "below";
};

const NoDisplay = ({ className, text="Nothing to display here", textLocation="below", style, ...rest }: Props) => {
  return (
    <div className={cx(styles.container, className)} style={style} {...rest}>
      {textLocation === TEXT_LOCATIONS.ABOVE && <p className={cx(styles.text, styles.above)}>{text}</p>}
      <NoGraphic className={styles.graphic} alt="No content to display" />
      {textLocation === TEXT_LOCATIONS.BELOW && <p className={cx(styles.text, styles.below)}>{text}</p>}
    </div>
  );
};

export default NoDisplay;
