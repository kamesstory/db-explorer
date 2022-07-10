import "./App.css";
import "./tailwind.css";
import { FunctionComponent } from "react";
import Flow from "./Flow";
import { TableContextProvider } from "./TableContext";

const App: FunctionComponent = () => {
  return (
    <TableContextProvider>
      <div className="App">
        <Flow />
      </div>
    </TableContextProvider>
  );
};

export default App;
