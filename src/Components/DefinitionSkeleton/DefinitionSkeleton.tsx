import React from "react";
import { ButtonSkeleton, SkeletonPlaceholder } from "@boomerang-io/carbon-addons-boomerang-react";
import styles from "./definitionSkeleton.module.scss";

const DefinitionSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <SkeletonPlaceholder className={styles.titleSkeleton}/>
      <SkeletonPlaceholder className={styles.textSkeleton}/>
      <ButtonSkeleton className={styles.buttonSkeleton}/>
    </div>
  );
};

export default DefinitionSkeleton;
