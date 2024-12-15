/// <reference types="react" />
import type { ElAccordionElement } from "@elementals/elements/accordion";

declare global {
	namespace React.JSX {
		interface IntrinsicElements {
			"el-accordion": React.DetailedHTMLProps<React.HTMLAttributes<ElAccordionElement>, ElAccordionElement>;
		}
	}
}
