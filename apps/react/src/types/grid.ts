import type { DraggableData, Position, ResizeDirection, RndResizeCallback } from "react-rnd";

export interface GridItem {
	id: string;
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface DragTarget {
	id: string;
	w: number;
	h: number;
	x?: number;
	y?: number;
}

export interface GridPosition {
	x: number;
	y: number;
}

export interface DirectionDelta {
	dx: number;
	dy: number;
}

export type ResizeTarget = GridItem;

export type DragStartHandler = (id: string) => void;
export type DragHandler = (id: string, data: DraggableData) => void;
export type DragStopHandler = (id: string, data: DraggableData) => void;
export type ResizeStartHandler = (id: string) => void;
export type ResizeHandler = (id: string, ref: HTMLElement) => void;
export type ResizeStopHandler = (
	id: string,
	direction: ResizeDirection,
	ref: HTMLElement,
	delta: Position,
	position: Position,
) => void;
