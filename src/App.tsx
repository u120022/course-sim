import {
	Accessor,
	Component,
	createEffect,
	createSignal,
	For,
	Index,
	Show,
} from "solid-js";
import { TableProvider, useTable } from "./TableProvider";
import { HiOutlinePlus, HiOutlinePlusCircle, HiSolidCursorClick, HiSolidSearch } from "solid-icons/hi";
import { Course, Hint } from "./TableLoader";

const CourseTableRow: Component<{
	course: Accessor<Course>;
	tagSet: Accessor<Set<string>>;
	point: Accessor<number>;
	onClick: () => void;
}> = (props) => {
	const [course] = createSignal<Course>(props.course());
	const [has, setHas] = createSignal<boolean>(props.course().has);
	const [hints, setHints] = createSignal<Hint[]>(props.course().hints);

	createEffect(() => {
		const _has = props.course().has;
		setHas(_has);
		const _hints = props
			.course()
			.hints.filter((hint) => props.tagSet().has(hint.tag));
		setHints(_hints);
	});

	const Hints: Component = () => (
		<>
			{/* Sign */}
			<div class="rounded-lg bg-purple-100 px-2 text-center">
				<HiSolidSearch class="inline" color="#444444" />
				{hints().length}
			</div>

			{/* Popover */}
			<div class="pointer-events-none absolute top-full z-10 opacity-0 group-hover:opacity-100">
				<div class="mt-2 rounded-lg border bg-slate-50 p-2">
					<ul class="list-inside list-decimal">
						<Index each={hints()}>
							{(hint) => (
								<li class="whitespace-nowrap">
									{hint().message}({hint().tag})
								</li>
							)}
						</Index>
					</ul>
				</div>
			</div>
		</>
	);

	return (
		<tr
			class={
				has()
					? "border-b bg-slate-100"
					: "border-b"
			}
		>
			<td class="group relative p-2">
				<Show when={0 < hints().length}>
					<Hints />
				</Show>
			</td>
			<td class="p-2 text-center cursor-pointer" onClick={props.onClick} tabindex={0}><HiOutlinePlusCircle class="inline" color="#444444" />{course().name}</td>
			<td class="p-2 text-center">{course().groups.get(1)}</td>
			<td class="p-2 text-center">{course().groups.get(2)}</td>
			<td class="p-2 text-center">{course().unit}</td>
			<For each={Array.from(course().levels)}>
				{([key, level]) => (
					<td
						class={(() => {
							if (level) {
								if (props.point() == key) {
									return "p-2 text-center font-bold text-purple-600";
								} else if (props.point() < key) {
									return "p-2 text-center text-purple-600";
								} else {
									return "p-2 text-center text-slate-400";
								}
							} else {
								return "p-2 text-center text-slate-300";
							}
						})()}
					>
						{level ? "〇" : "×"}
					</td>
				)}
			</For>
		</tr>
	);
};

const CourseTable: Component = () => {
	const table = useTable();

	const [point, setPoint] = createSignal(4);
	const [tagSet, setTagSet] = createSignal(new Set<string>());

	createEffect(() => {
		if (!table.diagnostics()) return;
		setTagSet(new Set(table.diagnostics().tagArray));
	});

	const hasTag = (tag: string) => tagSet().has(tag);
	const toggleTag = (tag: string) => {
		const _tagSet = new Set(tagSet());
		if (_tagSet.has(tag)) _tagSet.delete(tag);
		else _tagSet.add(tag);
		setTagSet(_tagSet);
	};

	return (
		<Show
			when={table.complete()}
			fallback={
				<div class="flex justify-center">
					<div class="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
				</div>
			}
		>
			{/* tag filter */}
			<div class="mb-4 text-center">
				<span class="font-bold mx-2">タグ</span>
				<For each={table.diagnostics().tagArray}>
					{(tag) => (
						<span
							tabindex={0}
							class={
								hasTag(tag)
									? "mx-2 cursor-pointer rounded-lg bg-slate-100 p-2"
									: "mx-2 cursor-pointer rounded-lg p-2"
							}
							onClick={() => toggleTag(tag)}
						>
							{tag}
						</span>
					)}
				</For>
			</div>

			{/* highlight */}
			<div class="mb-4 text-center">
				<span class="font-bold mx-2">ハイライト</span>
				<select
					class="mx-2 rounded-lg bg-slate-100 p-2"
					value={point()}
					onChange={(e) => setPoint(Number(e.currentTarget.value))}
				>
					<option value={1}>1年前期</option>
					<option value={2}>1年後期</option>
					<option value={3}>2年前期</option>
					<option value={4}>2年後期</option>
					<option value={5}>3年前期</option>
					<option value={6}>3年後期</option>
					<option value={7}>4年前期</option>
					<option value={8}>4年後期</option>
				</select>
			</div>

			{/* table */}
			<table class="mx-auto overflow-auto border">
				<thead>
					<tr class="border-b">
						<th class="p-2 text-center">解析</th>
						<th class="p-2 text-center">講義名</th>
						<th class="p-2 text-center">区分1</th>
						<th class="p-2 text-center">区分2</th>
						<th class="p-2 text-center">単位数</th>
						<th class="p-2 text-center">1年前期</th>
						<th class="p-2 text-center">1年後期</th>
						<th class="p-2 text-center">2年前期</th>
						<th class="p-2 text-center">2年後期</th>
						<th class="p-2 text-center">3年前期</th>
						<th class="p-2 text-center">3年後期</th>
						<th class="p-2 text-center">4年前期</th>
						<th class="p-2 text-center">4年後期</th>
					</tr>
				</thead>
				<tbody>
					<Index each={table.courseArray()}>
						{(course) => (
							<CourseTableRow
								course={course}
								tagSet={tagSet}
								point={point}
								onClick={() => table.toggleHasCourse(course().key)}
							/>
						)}
					</Index>
				</tbody>
			</table>
		</Show>
	);
};

const App: Component = () => {
	return (
		<div class="mx-auto min-w-[1280px] py-5">
			<div class="mb-8">
				<h1 class="mb-3 text-center text-4xl">Uny📎</h1>
				<p class="text-center">獲得単位が条件を満たすか確認します</p>
			</div>
			<TableProvider>
				<CourseTable />
			</TableProvider>
		</div>
	);
};

export default App;
