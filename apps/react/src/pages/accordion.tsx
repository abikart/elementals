import "@elementals/elements/accordion";
import React from "react";

export default function Accordion() {
	const [open, setOpen] = React.useState(["id3"]);

	return (
		<>
			<h2>Uncontrolled Accordion</h2>
			<el-accordion>
				<details name="uncontrolled-accordion">
					<summary>Graduation Requirements</summary>
					<p>Requires 40 credits, including a passing grade in health, geography, history, economics, and wood shop.</p>
				</details>

				<details name="uncontrolled-accordion">
					<summary>System Requirements</summary>
					<p>
						Requires a computer running an operating system. The computer must have some memory and ideally some kind of
						long-term storage. An input device as well as some form of output device is recommended.
					</p>
				</details>

				<details name="uncontrolled-accordion">
					<summary>Qualifications</summary>
					<p>Should have a degree in computer science or a related field.</p>
				</details>

				<details name="uncontrolled-accordion">
					<summary>
						Job Requirements
						<svg viewBox="0 0 17 8.85" data-slot="indicator">
							<title>open</title>
							<polyline
								data-accordion-icon-shape="true"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								fillRule="evenodd"
								points="15 1.13 8.5 7.72 2 1.13"
							>
								<animate
									attributeName="points"
									values="15 1.13 8.5 7.72 2 1.13; 15.85 4.42 8.5 4.42 1.15 4.42; 15 7.72 8.5 1.13 2 7.72"
									dur="320ms"
									begin="indefinite"
									fill="freeze"
									keyTimes="0;0.5;1"
									calcMode="spline"
									keySplines="0.12, 0, 0.38, 0; 0.2, 1, 0.68, 1"
								/>
								<animate
									attributeName="points"
									values="15 7.72 8.5 1.13 2 7.72; 15.85 4.42 8.5 4.42 1.15 4.42; 15 1.13 8.5 7.72 2 1.13"
									dur="320ms"
									begin="indefinite"
									fill="freeze"
									keyTimes="0;0.5;1"
									calcMode="spline"
									keySplines="0.2, 0, 0.68, 0; 0.2, 1, 0.68, 1"
								/>
							</polyline>
						</svg>
					</summary>
					<div>
						<table>
							<thead>
								<tr>
									<th>Requirement</th>
									<th>Description</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Education</td>
									<td>Bachelor's degree in related field</td>
								</tr>
								<tr>
									<td>Experience</td>
									<td>3+ years in similar role</td>
								</tr>
								<tr>
									<td>Skills</td>
									<td>Project management, communication, leadership</td>
								</tr>
							</tbody>
						</table>
					</div>
				</details>
			</el-accordion>

			<br />
			<h2>Controlled Accordion</h2>
			<el-accordion
				controlled
				onElShow={(e) => {
					console.log("onElShow", e.detail.target.id);
					setOpen([e.detail.target.id]);
				}}
				onElHide={(e) => {
					console.log("onElHide", e.detail.target.id);
					setOpen([]);
				}}
				onElAfterHide={(e) => {
					console.log("onElAfterHide", e.detail.target.id);
				}}
				onElAfterShow={(e) => {
					console.log("onElAfterShow", e.detail.target.id);
				}}
			>
				<details id="id1" open={open.includes("id1")}>
					<summary>
						Graduation Requirements
						<svg data-slot="indicator" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
							<title>closed</title>
							<rect width="256" height="256" fill="none" />
							<polyline
								points="96 48 176 128 96 208"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="24"
							/>
						</svg>
					</summary>
					<p>Requires 40 credits, including a passing grade in health, geography, history, economics, and wood shop.</p>
				</details>

				<details id="id2" aria-disabled={!open.includes("id2")}>
					<summary>System Requirements</summary>
					<p>
						Requires a computer running an operating system. The computer must have some memory and ideally some kind of
						long-term storage. An input device as well as some form of output device is recommended.
					</p>
				</details>

				<details id="id3" open={open.includes("id3")}>
					<summary>Qualifications</summary>
					<p>Should have a degree in computer science or a related field.</p>
				</details>

				<details id="id4" open={open.includes("id4")}>
					<summary>
						Job Requirements
						<svg data-slot="indicator-closed" aria-label="closed">
							<title>closed</title>
							<path d="M2 5l6 6 6-6" />
						</svg>
						<svg data-slot="indicator-open" aria-label="open">
							<title>open</title>
							<path d="M14 11l-6-6-6 6" />
						</svg>
					</summary>
					<div>
						<table>
							<thead>
								<tr>
									<th>Requirement</th>
									<th>Description</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Education</td>
									<td>Bachelor's degree in related field</td>
								</tr>
								<tr>
									<td>Experience</td>
									<td>3+ years in similar role</td>
								</tr>
								<tr>
									<td>Skills</td>
									<td>Project management, communication, leadership</td>
								</tr>
							</tbody>
						</table>
					</div>
				</details>
			</el-accordion>

			<br />
			<h2>Experimental Accordion</h2>
			<el-accordion onElShow={() => {}} experimental>
				<details name="experimental-accordion">
					<summary>Experimental Accordion</summary>
					<p>This is an experimental accordion.</p>
				</details>
			</el-accordion>
		</>
	);
}
