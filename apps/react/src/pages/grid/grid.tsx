import { ArrowDownRight, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import type {
	DirectionDelta,
	DragHandler,
	DragStartHandler,
	DragStopHandler,
	DragTarget,
	GridItem,
	GridPosition,
	ResizeHandler,
	ResizeStartHandler,
	ResizeStopHandler,
	ResizeTarget,
} from "../../types/grid";

export default function GridGenerator() {
	const [columns, setColumns] = useState<number>(4);
	const [rows, setRows] = useState<number>(4);
	const [gap, setGap] = useState<number>(8);
	const [items, setItems] = useState<GridItem[]>([]);
	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
	const [resizeTarget, setResizeTarget] = useState<ResizeTarget | null>(null);
	const [isDragging, setIsDragging] = useState<boolean>(false);

	const gridRef = useRef<HTMLDivElement>(null);
	const gapPx = gap * 2;

	const getItemHeight = useCallback((): number => 70, []);

	const getItemWidth = useCallback((): number => {
		if (!gridRef.current) return 0;
		return (gridRef.current.clientWidth - gapPx * (columns - 1)) / columns;
	}, [gapPx, columns]);

	const getGridHeight = useCallback((): number => {
		return rows * getItemHeight() + gapPx * (rows - 1);
	}, [rows, getItemHeight, gapPx]);

	const getAffectedCells = useCallback((x: number, y: number, w: number, h: number): string[] => {
		const cells: string[] = [];
		for (let row = y; row < y + h; row++) {
			for (let col = x; col < x + w; col++) {
				cells.push(`${col}-${row}`);
			}
		}
		return cells;
	}, []);

	const getXPosition = (col: number): number => (col - 1) * getItemWidth() + gapPx * (col - 1);
	const getYPosition = (row: number): number => (row - 1) * getItemHeight() + gapPx * (row - 1);
	const getGridColumn = (x: number): number => Math.round(x / (getItemWidth() + gapPx)) + 1;
	const getGridRow = (y: number): number => Math.round(y / (getItemHeight() + gapPx)) + 1;
	const getWidth = (cols: number): number => cols * getItemWidth() + (cols - 1) * gapPx;
	const getHeight = (rows: number): number => rows * getItemHeight() + (rows - 1) * gapPx;

	const addItem = (col: number, row: number): void => {
		const newItem: GridItem = {
			id: `item-${items.length + 1}`,
			x: col,
			y: row,
			w: 1,
			h: 1,
		};
		setItems([...items, newItem]);
	};

	const removeItem = (id: string): void => {
		setItems(items.filter((item) => item.id !== id));
	};

	const onDragStart: DragStartHandler = (id) => {
		setIsDragging(true);
		const item = items.find((item) => item.id === id);
		if (!item) return;
		setDragTarget({
			id,
			w: item.w,
			h: item.h,
		});
	};

	const onDrag: DragHandler = (id, data) => {
		if (!dragTarget) return;
		const gridCol = getGridColumn(data.x);
		const gridRow = getGridRow(data.y);
		setDragTarget({
			...dragTarget,
			x: gridCol,
			y: gridRow,
		});
	};

	const checkCollision = useCallback(
		(x: number, y: number, w: number, h: number, excludeId: string | null = null): boolean => {
			if (x < 1 || y < 1 || x + w - 1 > columns || y + h - 1 > rows) {
				return true;
			}

			return items.some((item) => {
				if (item.id === excludeId) return false;

				const xOverlap = !(x + w - 1 < item.x || x > item.x + item.w - 1);
				const yOverlap = !(y + h - 1 < item.y || y > item.y + item.h - 1);

				return xOverlap && yOverlap;
			});
		},
		[items, columns, rows],
	);

	const findNearestAvailablePosition = useCallback(
		(item: GridItem, targetX: number, targetY: number): GridPosition | null => {
			if (!checkCollision(targetX, targetY, item.w, item.h, item.id)) {
				return { x: targetX, y: targetY };
			}

			for (let distance = 1; distance <= Math.max(columns, rows); distance++) {
				for (let dy = -distance; dy <= distance; dy++) {
					for (let dx = -distance; dx <= distance; dx++) {
						if (Math.abs(dx) < distance && Math.abs(dy) < distance) continue;

						const newX = targetX + dx;
						const newY = targetY + dy;

						if (!checkCollision(newX, newY, item.w, item.h, item.id)) {
							return { x: newX, y: newY };
						}
					}
				}
			}

			return null;
		},
		[checkCollision, columns, rows],
	);

	const tryPushItems = useCallback(
		(movingItemId: string, targetX: number, targetY: number, width: number, height: number): GridItem[] | null => {
			let newItems = [...items];
			const movingItem = newItems.find((item) => item.id === movingItemId);
			if (!movingItem) return null;

			const overlappingItems = newItems.filter((item) => {
				if (item.id === movingItemId) return false;

				const xOverlap = !(targetX + width - 1 < item.x || targetX > item.x + item.w - 1);
				const yOverlap = !(targetY + height - 1 < item.y || targetY > item.y + item.h - 1);

				return xOverlap && yOverlap;
			});

			if (overlappingItems.length === 0) {
				return newItems.map((item) => (item.id === movingItemId ? { ...item, x: targetX, y: targetY } : item));
			}

			const directions: DirectionDelta[] = [
				{ dx: width, dy: 0 },
				{ dx: 0, dy: height },
				{ dx: -width, dy: 0 },
				{ dx: 0, dy: -height },
			];

			for (const itemToPush of overlappingItems) {
				for (const { dx, dy } of directions) {
					const newX = itemToPush.x + dx;
					const newY = itemToPush.y + dy;

					if (!checkCollision(newX, newY, itemToPush.w, itemToPush.h, itemToPush.id)) {
						newItems = newItems.map((item) => (item.id === itemToPush.id ? { ...item, x: newX, y: newY } : item));
						break;
					}
				}
			}

			newItems = newItems.map((item) => (item.id === movingItemId ? { ...item, x: targetX, y: targetY } : item));

			const hasCollisions = newItems.some((item1, i) =>
				newItems.some((item2, j) => {
					if (i === j) return false;
					const xOverlap = !(item1.x + item1.w - 1 < item2.x || item1.x > item2.x + item2.w - 1);
					const yOverlap = !(item1.y + item1.h - 1 < item2.y || item1.y > item2.y + item2.h - 1);
					return xOverlap && yOverlap;
				}),
			);

			return hasCollisions ? null : newItems;
		},
		[items, checkCollision],
	);

	const onDragStop: DragStopHandler = (id, data) => {
		if (isResizing) return;
		setIsDragging(false);
		setDragTarget(null);

		const newX = getGridColumn(data.x);
		const newY = getGridRow(data.y);
		const item = items.find((item) => item.id === id);
		if (!item) return;

		const newArrangement = tryPushItems(id, newX, newY, item.w, item.h);

		if (newArrangement) {
			setItems(newArrangement);
		} else {
			const availablePosition = findNearestAvailablePosition(item, newX, newY);
			if (availablePosition) {
				setItems(
					items.map((item) => (item.id === id ? { ...item, x: availablePosition.x, y: availablePosition.y } : item)),
				);
			}
		}
	};

	const onResizeStart: ResizeStartHandler = (id) => {
		setIsResizing(true);
		const item = items.find((item) => item.id === id);
		if (!item) return;
		setResizeTarget(item);
	};

	const onResize: ResizeHandler = (id, ref) => {
		if (!resizeTarget) return;
		const newWidth = Math.round(ref.offsetWidth / (getItemWidth() + gapPx));
		const newHeight = Math.round(ref.offsetHeight / (getItemHeight() + gapPx));
		setResizeTarget({
			...resizeTarget,
			w: newWidth,
			h: newHeight,
		});
	};

	const onResizeStop: ResizeStopHandler = (id, direction, ref, delta, position) => {
		const newWidth = Math.round(ref.offsetWidth / (getItemWidth() + gapPx));
		const newHeight = Math.round(ref.offsetHeight / (getItemHeight() + gapPx));
		const item = items.find((item) => item.id === id);
		if (!item) return;

		if (checkCollision(item.x, item.y, newWidth, newHeight, id)) {
			return;
		}

		setItems(items.map((item) => (item.id === id ? { ...item, w: newWidth, h: newHeight } : item)));
		setIsResizing(false);
		setResizeTarget(null);
	};

	const resetGrid = (): void => {
		setItems([]);
	};

	return (
		<div>
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
								getAffectedCells(dragTarget.x ?? 0, dragTarget.y ?? 0, dragTarget.w, dragTarget.h).includes(cellId)) ||
							(resizeTarget &&
								getAffectedCells(resizeTarget.x, resizeTarget.y, resizeTarget.w, resizeTarget.h).includes(cellId));

						return (
							<button
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
								type="button"
								tabIndex={0}
							>
								+
							</button>
						);
					})}
				</div>

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
						onResize={(e, direction, ref) => onResize(item.id, ref)}
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
