import React from "react";
import { AppContextProps } from "Types";

const AppContext = React.createContext<AppContextProps>({
  teams: [],
  activeTeam: null,
});
export default AppContext;
