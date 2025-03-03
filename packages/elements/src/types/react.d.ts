import type { ElAccordionElement, ElAccordionEventMap } from "../elements/accordion/accordion";

declare global {
	namespace React.JSX {
		interface IntrinsicElements {
			"el-accordion": React.DetailedHTMLProps<
				React.HTMLAttributes<ElAccordionElement> & {
					controlled?: boolean;
					experimental?: boolean;
					onElShow?: (e: ElAccordionEventMap["ElShow"]) => void;
					onElHide?: (e: ElAccordionEventMap["ElHide"]) => void;
					onElAfterShow?: (e: ElAccordionEventMap["ElAfterShow"]) => void;
					onElAfterHide?: (e: ElAccordionEventMap["ElAfterHide"]) => void;
				},
				ElAccordionElement
			>;
		}
	}
}
