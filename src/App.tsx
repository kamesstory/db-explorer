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
        <div className="h-5/6 border-double border-2 border-black">
          <Flow />
        </div>
        <QueryPreview />
      </div>
    </TableContextProvider>
  );
};

export default App;
