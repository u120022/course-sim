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
import { FaRegularLightbulb } from "solid-icons/fa";
import { Course, Hint } from "./TableLoader";

const CourseTableRow: Component<{
	course: Accessor<Course>;
	onClick: () => void;
}> = (props) => {
	const [course, setCourse] = createSignal<Course>();
	const [has, setHas] = createSignal<boolean>();
	const [hints, setHints] = createSignal<Hint[]>();

	createEffect(() => {
		if (!course()) setCourse(props.course());
		setHas(props.course().has);
		setHints(props.course().hints);
	});

	const Messages: Component = () => (
		<Show when={0 < hints().length}>
			{/* Sign */}
			<div class="rounded-lg bg-purple-100 px-2 text-center">
				<FaRegularLightbulb class="inline" color="#444444" />
				{hints().length}
			</div>

			{/* Popover */}
			<div class="pointer-events-none absolute top-full z-10 opacity-0 transition group-hover:opacity-100">
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
		</Show>
	);

	return (
		<Show when={course()}>
			<tr
				class={
					has()
						? "cursor-pointer border-b bg-slate-100"
						: "cursor-pointer border-b"
				}
				onClick={props.onClick}
			>
				<td class="group relative p-2">
					<Messages />
				</td>
				<td class="p-2 text-center">{course().name}</td>
				<td class="p-2 text-center">{course().groups.get(1)}</td>
				<td class="p-2 text-center">{course().groups.get(2)}</td>
				<td class="p-2 text-center">{course().unit}</td>
				<For each={Array.from(course().levels.values())}>
					{(level) => (
						<td
							class={
								level
									? "p-2 text-center text-pink-600"
									: "p-2 text-center text-slate-300"
							}
						>
							{level ? "〇" : "×"}
						</td>
					)}
				</For>
			</tr>
		</Show>
	);
};

const CourseTable: Component = () => {
	const table = useTable();

	return (
		<table class="mx-auto border overflow-auto">
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
							onClick={() => table.toggleHasCourse(course().key)}
						/>
					)}
				</Index>
			</tbody>
		</table>
	);
};

const App: Component = () => {
	return (
		<div class="mx-auto py-5 min-w-[1280px]">
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
