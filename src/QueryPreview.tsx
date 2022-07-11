import "./App.css";
import "./tailwind.css";
import { FunctionComponent, useCallback, useContext, useState } from "react";
import { TableContext } from "./TableContext";
import { queryBuilder } from "./queryBuilder";

const QueryPreview: FunctionComponent = () => {
  const { tables, relations, selectedColumns } = useContext(TableContext);
  const [querySql, setQuerySql] = useState<string | null>(null);

  const buildQuery = useCallback(() => {
    const sql = queryBuilder({ tables, relations, selectedColumns });

    console.log(`SQL = `, sql);

    setQuerySql(sql);
  }, [tables, relations, selectedColumns]);

  return (
    <div className="flex flex-col mt-6 px-6">
      <button
        onClick={buildQuery}
        className="border-solid border-2 border-black p-3"
      >
        Preview query
      </button>

      {querySql && <span>{querySql}</span>}
    </div>
  );
};

export default QueryPreview;
