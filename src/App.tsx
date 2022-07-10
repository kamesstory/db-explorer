import "./App.css";
import "./tailwind.css";
import { FunctionComponent } from "react";
import Flow from "./Flow";
import { TableContextProvider } from "./TableContext";
import QueryPreview from "./QueryPreview";

const App: FunctionComponent = () => {
  return (
    <TableContextProvider>
      <div className="App">
        <Flow />
        <QueryPreview />
      </div>
    </TableContextProvider>
  );
};

export default App;
