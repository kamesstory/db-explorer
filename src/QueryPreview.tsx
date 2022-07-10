import "./App.css";
import "./tailwind.css";
import { FunctionComponent, useContext } from "react";
import { TableContext } from "./TableContext";

const QueryPreview: FunctionComponent = () => {
  const { tables } = useContext(TableContext);

  return <div>Yoyoyoyo</div>;
};

export default QueryPreview;
