import type { ElAccordion } from "./accordion";

declare global {
	namespace React.JSX {
		interface IntrinsicElements {
			"el-accordion": React.DetailedHTMLProps<
				React.HTMLAttributes<ElAccordion> & {
					controlled?: boolean;
					experimental?: boolean;
					onElShow?: (e: CustomEvent<{ open: boolean; target: HTMLDetailsElement }>) => void;
					onElHide?: (e: CustomEvent<{ open: boolean; target: HTMLDetailsElement }>) => void;
					onElAfterShow?: (e: CustomEvent<{ open: boolean; target: HTMLDetailsElement }>) => void;
					onElAfterHide?: (e: CustomEvent<{ open: boolean; target: HTMLDetailsElement }>) => void;
					children?: React.ReactNode;
				},
				ElAccordion
			>;
		}
	}
}
