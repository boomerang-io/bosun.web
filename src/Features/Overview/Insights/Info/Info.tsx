import React from "react";
import { Tile } from "@boomerang-io/carbon-addons-boomerang-react";
import { Info as InfoProps } from "Types";
import styles from "./info.module.scss";

type Props = {
  info: InfoProps;
};

export function Info({ info }: Props) {
  return (
    <Tile
      style={{
        display: "flex",
        width: "100%",
        height: "10rem",
        alignItems: "center",
        padding: "0",
        marginBottom: "1rem",
        marginLeft: info.type === "gates" ? "0" : "1rem",
      }}
      data-testid="tile-info"
    >
      <div className={styles.counter} style={{ color: info.type === "gates" ? "#047cc0" : "#ffaa9d" }}>
        {info.count}
      </div>
      <div className={styles.divider} />
      <div className={styles.text}>
        <h3 className={styles.title}>{info.title}</h3>
        <p className={styles.content}>{info.content}</p>
      </div>
    </Tile>
  );
}

export default Info;
