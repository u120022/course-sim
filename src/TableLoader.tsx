import { parse, ParseResult } from "papaparse";

export type Hint = {
	tag: string;
	message: string;
};

export type Course = {
	key: number;
	name: string;
	groups: Map<number, string>;
	unit: number;
	levels: Map<number, boolean>;
	has: boolean;
	hints: Hint[];
};

const toInt = (value: string) => {
	const parsed = parseInt(value);
	if (isNaN(parsed)) throw new Error("failed to parse");
	return parsed;
};

const toBool = (value: string) => {
	return toInt(value) == 1;
};

export const loadCourseArray = async () => {
	const raw: ParseResult<any> = await fetch("./courses.csv")
		.then((res) => res.text())
		.then((text) => parse(text, { header: true }));

	// validation check
	const fields = raw.meta.fields;
	if (!fields) throw new Error("not found fields");
	[
		"key",
		"name",
		"group_1",
		"group_2",
		"unit",
		"level_1",
		"level_2",
		"level_3",
		"level_4",
		"level_5",
		"level_6",
		"level_7",
		"level_8",
		"default_has",
	].forEach((field) => {
		if (!fields.includes(field)) throw new Error("not found field " + field);
	});

	const courseArray: Course[] = [];
	for (const row of raw.data) {
		const key = toInt(row["key"]);
		const name = row["name"];
		const groups = new Map();
		groups.set(1, row["group_1"]);
		groups.set(2, row["group_2"]);
		const unit = toInt(row["unit"]);
		const levels = new Map();
		levels.set(1, toBool(row["level_1"]));
		levels.set(2, toBool(row["level_2"]));
		levels.set(3, toBool(row["level_3"]));
		levels.set(4, toBool(row["level_4"]));
		levels.set(5, toBool(row["level_5"]));
		levels.set(6, toBool(row["level_6"]));
		levels.set(7, toBool(row["level_7"]));
		levels.set(8, toBool(row["level_8"]));
		const has = toBool(row["default_has"]);
		const hints = [];
		const course = { key, name, groups, unit, levels, has, hints };
		courseArray.push(course);
	}

	return courseArray;
};

export const loadAnalyzer = async () => {
	const fn: Function = await fetch("./analyzer.js")
		.then((res) => res.text())
		.then((text) => new Function(text))
	return fn;
};
