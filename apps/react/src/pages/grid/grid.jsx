import { ArrowDownRight, X } from "lucide-react"; // For icons
import { useCallback, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd"; // For draggable/resizable functionality

export default function GridGenerator() {
	// State management
	const [columns, setColumns] = useState(4);
	const [rows, setRows] = useState(4);
	const [gap, setGap] = useState(8);
	const [items, setItems] = useState([]);
	const [isResizing, setIsResizing] = useState(false);
	const [dragTarget, setDragTarget] = useState(null);
	const [resizeTarget, setResizeTarget] = useState(null);
	const [isDragging, setIsDragging] = useState(false);

	const gridRef = useRef(null);
	const gapPx = gap * 2; // Gap in pixels

	// Helper functions for grid calculations
	const getItemHeight = useCallback(() => 70, []); // Fixed height for grid items

	const getItemWidth = useCallback(() => {
		return (gridRef.current?.clientWidth - gapPx * (columns - 1)) / columns;
	}, [gapPx, columns]);

	const getGridHeight = useCallback(() => {
		return rows * getItemHeight() + gapPx * (rows - 1);
	}, [rows, getItemHeight, gapPx]);

	const getAffectedCells = useCallback((x, y, w, h) => {
		const cells = [];
		for (let row = y; row < y + h; row++) {
			for (let col = x; col < x + w; col++) {
				cells.push(`${col}-${row}`);
			}
		}
		return cells;
	}, []);

	// Position calculations
	const getXPosition = (col) => (col - 1) * getItemWidth() + gapPx * (col - 1);
	const getYPosition = (row) => (row - 1) * getItemHeight() + gapPx * (row - 1);
	const getGridColumn = (x) => Math.round(x / (getItemWidth() + gapPx)) + 1;
	const getGridRow = (y) => Math.round(y / (getItemHeight() + gapPx)) + 1;
	const getWidth = (cols) => cols * getItemWidth() + (cols - 1) * gapPx;
	const getHeight = (rows) => rows * getItemHeight() + (rows - 1) * gapPx;

	// Grid item management
	const addItem = (col, row) => {
		const newItem = {
			id: `item-${items.length + 1}`,
			x: col,
			y: row,
			w: 1,
			h: 1,
		};
		setItems([...items, newItem]);
	};

	const removeItem = (id) => {
		setItems(items.filter((item) => item.id !== id));
	};

	// Handle resize and drag
	const onDragStart = (id) => {
		setIsDragging(true);
		const item = items.find((item) => item.id === id);
		setDragTarget({
			id,
			w: item.w,
			h: item.h,
		});
	};

	const onDrag = (id, data) => {
		if (!dragTarget) return;
		const gridCol = getGridColumn(data.x);
		const gridRow = getGridRow(data.y);
		setDragTarget({
			...dragTarget,
			x: gridCol,
			y: gridRow,
		});
	};

	const onDragStop = (id, data) => {
		if (isResizing) return;
		setIsDragging(false);
		setDragTarget(null);
		setItems(
			items.map((item) => (item.id === id ? { ...item, x: getGridColumn(data.x), y: getGridRow(data.y) } : item)),
		);
	};

	const onResizeStart = (id) => {
		setIsResizing(true);
		const item = items.find((item) => item.id === id);
		setResizeTarget({
			id,
			x: item.x,
			y: item.y,
			w: item.w,
			h: item.h,
		});
	};

	const onResize = (id, ref) => {
		if (!resizeTarget) return;
		const newWidth = Math.round(ref.offsetWidth / (getItemWidth() + gapPx));
		const newHeight = Math.round(ref.offsetHeight / (getItemHeight() + gapPx));
		setResizeTarget({
			...resizeTarget,
			w: newWidth,
			h: newHeight,
		});
	};

	const onResizeStop = (id, direction, ref, delta, position) => {
		const newWidth = Math.round(ref.offsetWidth / (getItemWidth() + gapPx));
		const newHeight = Math.round(ref.offsetHeight / (getItemHeight() + gapPx));

		setItems(items.map((item) => (item.id === id ? { ...item, w: newWidth, h: newHeight } : item)));
		setIsResizing(false);
		setResizeTarget(null);
	};

	// Reset grid
	const resetGrid = () => {
		setItems([]);
	};

	return (
		<div>
			{/* Controls */}
			<div className="grid grid-cols-3 md:grid-cols-3 gap-4 w-full p-4 bg-base-50 rounded-lg">
				<div className="flex flex-col gap-2">
					<label htmlFor="columns" className="text-sm text-base-500 flex justify-between">
						<span>Columns</span>
						<span className="text-accent-500">{columns}</span>
					</label>
					<input
						id="columns"
						type="range"
						min={1}
						max={12}
						value={columns}
						onChange={(e) => setColumns(Number(e.target.value))}
						className="w-full h-2 bg-base-200 rounded-lg appearance-none cursor-pointer accent-accent-500"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="rows" className="text-sm text-base-500 flex justify-between">
						<span>Rows</span>
						<span className="text-accent-500">{rows}</span>
					</label>
					<input
						id="rows"
						type="range"
						min={1}
						max={12}
						value={rows}
						onChange={(e) => setRows(Number(e.target.value))}
						className="w-full h-2 bg-base-200 rounded-lg appearance-none cursor-pointer accent-accent-500"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="gap" className="text-sm text-base-500 flex justify-between">
						<span>Gap</span>
						<span className="text-accent-500">{gap}px</span>
					</label>
					<input
						id="gap"
						type="range"
						min={0}
						max={32}
						value={gap}
						onChange={(e) => setGap(Number(e.target.value))}
						className="w-full h-2 bg-base-200 rounded-lg appearance-none cursor-pointer accent-accent-500"
					/>
				</div>
			</div>

			{/* Grid */}
			<div className="relative rounded-lg w-full my-12">
				<div
					ref={gridRef}
					className={`grid font-mono text-white text-sm text-center font-bold rounded-lg w-full h-full grid-cols-${columns} grid-rows-${rows}`}
					style={{
						gap: `${gapPx}px`,
						minHeight: getGridHeight(),
					}}
				>
					{Array.from({ length: rows * columns }).map((_, i) => {
						const col = (i % columns) + 1;
						const row = Math.floor(i / columns) + 1;
						const cellId = `${col}-${row}`;

						const isAffected =
							(dragTarget &&
								getAffectedCells(dragTarget.x, dragTarget.y, dragTarget.w, dragTarget.h).includes(cellId)) ||
							(resizeTarget &&
								getAffectedCells(resizeTarget.x, resizeTarget.y, resizeTarget.w, resizeTarget.h).includes(cellId));

						return (
							<div
								key={cellId}
								className={`flex items-center justify-center p-4 rounded-lg text-accent-500 cursor-pointer relative border border-base-200 ring-4 ${
									isAffected ? "ring-accent-200 bg-accent-50" : "ring-base-100 bg-white"
								} text-2xl transition-colors duration-200`}
								onClick={() => addItem(col, row)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										addItem(col, row);
									}
								}}
							>
								+
							</div>
						);
					})}
				</div>

				{/* Draggable Items */}
				{items.map((item) => (
					<Rnd
						key={item.id}
						size={{
							width: getWidth(item.w),
							height: getHeight(item.h),
						}}
						position={{
							x: getXPosition(item.x),
							y: getYPosition(item.y),
						}}
						onDragStart={() => onDragStart(item.id)}
						onDrag={(e, data) => onDrag(item.id, data)}
						onDragStop={(e, data) => onDragStop(item.id, data)}
						onResizeStart={(e, direction, ref) => onResizeStart(item.id)}
						onResize={(e, direction, ref, delta, position) => onResize(item.id, ref)}
						onResizeStop={(e, direction, ref, delta, position) =>
							onResizeStop(item.id, direction, ref, delta, position)
						}
						bounds="parent"
						className={`bg-white rounded-lg p-4 flex items-center justify-center relative ring-2 ring-accent-500 transition-opacity duration-200 ${
							(isDragging || isResizing) && item.id === (dragTarget?.id || resizeTarget?.id)
								? "opacity-90"
								: "opacity-100"
						}`}
					>
						<button
							type="button"
							onClick={() => removeItem(item.id)}
							className="absolute top-2 right-2 text-base-500 hover:text-accent-500 z-10"
							aria-label={`Remove item ${item.id}`}
						>
							<X className="size-4" />
						</button>
						<span className="text-accent-500">{item.id.replace("item-", "")}</span>
						<div className="absolute bottom-0 right-0 size-6 rounded-bl flex items-center justify-center">
							<ArrowDownRight className="size-4 text-accent-500" />
						</div>
					</Rnd>
				))}
			</div>
		</div>
	);
}
