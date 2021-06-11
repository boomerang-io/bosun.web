import React from "react";
import "./styles.scss";
import CastleDrawbridgeGraphic from "Assets/svg/undraw_yacht.svg";

function Welcome() {
  return (
    <div className="c-welcome">
      <div className="b-welcome">
        <img className="b-welcome__img" src={CastleDrawbridgeGraphic} alt="Castle Drawbridge" />
        <h1 className="b-welcome__title">
          Welcome to <span style={{ fontStyle: "italic" }}>Boomerang Bosun</span>
        </h1>
        <p className="b-welcome__text">Select a team to get started</p>
      </div>
    </div>
  );
}

export default Welcome;
