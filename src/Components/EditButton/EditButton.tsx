import React from "react";
import cx from "classnames";
import EditButton from "./EditButtonSvg";
import { isAccessibleEvent } from "@boomerang-io/utils";
import styles from "./WorkflowEditButton.module.scss";

type Props = {
    alt?: string;
    className?: string;
    onClick: (...args: any[]) => any;
};

export default function WorkflowEditButton({ alt = "Workflow edit button", className, onClick, ...rest }: Props) {
  return (
    <EditButton
      alt={alt}
      className={cx(styles.button, className)}
      onClick={onClick}
      onKeyDown={(e: any) => isAccessibleEvent(e) && onClick(e)}
      role="button"
      tabIndex="0"
      style={{ willChange: "auto" }}
      {...rest}
    />
  );
}
