import {
  createContext,
  ParentComponent,
  useContext,
	onMount,
	Accessor,
	createSignal,
} from "solid-js";
import { Hint, Course, loadCourseArray, loadAnalyzer } from "./TableLoader";

export type TableContextValue = {
  courseArray: Accessor<Course[]>;
  toggleHasCourse: (key: number) => void;
};

const TableContext = createContext<TableContextValue>();

export const TableProvider: ParentComponent<{}> = (props) => {
  const [courseArray, setCourseArray] = createSignal<Course[]>();
  const [analyzer, setAnalyzer] = createSignal<Function>();

	onMount(async () => {
		setCourseArray(await loadCourseArray());
		const analyzer = await loadAnalyzer();
		setAnalyzer((_) => analyzer);
		analyze();
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
    const ref: Map<number, Course> = new Map();
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
    analyzer()(getActiveUnit, setHint);
    setCourseArray(_courseArray);
  };

  return (
    <TableContext.Provider value={{ courseArray, toggleHasCourse }}>
      {props.children}
    </TableContext.Provider>
  );
};

export const useTable = () => useContext(TableContext);
