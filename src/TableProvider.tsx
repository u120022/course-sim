import {
  createContext,
  ParentComponent,
  useContext,
  onMount,
  Accessor,
  createSignal,
} from "solid-js";
import {
  Hint,
  Course,
  loadCourseArray,
  loadAnalyzer,
  Analyzer,
  Diagnostics,
} from "./TableLoader";

export type TableContextValue = {
  complete: Accessor<boolean>;
  courseArray: Accessor<Course[]>;
  diagnostics: Accessor<Diagnostics>;
  toggleHasCourse: (key: number) => void;
};

const TableContext = createContext<TableContextValue>();

export const TableProvider: ParentComponent<{}> = (props) => {
  const [complete, setComplete] = createSignal<boolean>();
  const [courseArray, setCourseArray] = createSignal<Course[]>();
  const [analyzer, setAnalyzer] = createSignal<Analyzer>();
  const [diagnostics, setDiagnostics] = createSignal<Diagnostics>();

  onMount(async () => {
    const courseArray = await loadCourseArray();
    const analyzer = await loadAnalyzer();
    setCourseArray(() => courseArray);
    setAnalyzer(() => analyzer);
    analyze();
    setComplete(true);
  });

  const toggleHasCourse = (key: number) => {
    const _courseArray = [...courseArray()];
    for (let i = 0; i < _courseArray.length; i++) {
      if (_courseArray[i].key == key) {
        _courseArray[i] = { ..._courseArray[i], has: !_courseArray[i].has };
      }
    }
    setCourseArray(_courseArray);
    analyze();
  };

  const analyze = () => {
    const ref = new Map<number, Course>();
    const _courseArray = [...courseArray()];
    for (let i = 0; i < _courseArray.length; i++) {
      _courseArray[i] = { ..._courseArray[i], hints: [] };
      ref.set(_courseArray[i].key, _courseArray[i]);
    }
    const getActiveUnit = (key: number) => {
      if (ref.get(key).has) return ref.get(key).unit;
      else return 0;
    };
    const setHint = (key: number, hint: Hint) => {
      ref.get(key).hints.push(hint);
    };
    const diagnostics: Diagnostics = { tagArray: [] };
    analyzer()(getActiveUnit, setHint, diagnostics);
    setCourseArray(_courseArray);
    setDiagnostics(diagnostics);
  };

  return (
    <TableContext.Provider
      value={{ complete, courseArray, diagnostics, toggleHasCourse }}
    >
      {props.children}
    </TableContext.Provider>
  );
};

export const useTable = () => useContext(TableContext);
