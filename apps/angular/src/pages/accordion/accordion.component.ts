import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@elementals/elements/accordion";

@Component({
	selector: "app-accordion",
	imports: [],
	templateUrl: "./accordion.component.html",
	styleUrl: "./accordion.component.css",
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccordionComponent {}
