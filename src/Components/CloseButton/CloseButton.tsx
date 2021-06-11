import React from "react";
import cx from "classnames";
import CloseButton from "./CloseButtonSvg";
import { isAccessibleEvent } from "@boomerang-io/utils";
import styles from "./WorkflowCloseButton.module.scss";

type Props = {
    alt?: string;
    className?: string;
    onClick: (...args: any[]) => void;
};

export default function WorkflowCloseButton({ alt = "Workflow close button", className, onClick, ...rest }: Props) {
  return (
    <CloseButton
      alt={alt}
      className={cx(styles.button, className)}
      onClick={onClick}
      onKeyDown={(e: any) => isAccessibleEvent(e) && onClick(e)}
      role="button"
      tabIndex={0}
      {...rest}
    />
  );
}
