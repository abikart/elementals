import "@elementals/elements/accordion";

export default function Accordion() {
	return (
		<el-accordion>
			<details name="group1">
				<summary>Graduation Requirements</summary>
				<div>
					<p>Requires 40 credits, including a passing grade in health, geography, history, economics, and wood shop.</p>
				</div>
			</details>

			<details name="group1" aria-disabled>
				<summary>System Requirements</summary>
				<div>
					<p>
						Requires a computer running an operating system. The computer must have some memory and ideally some kind of
						long-term storage. An input device as well as some form of output device is recommended.
					</p>
				</div>
			</details>

			<details name="group1" open>
				<summary>Qualifications</summary>
				<div>
					<p>Should have a degree in computer science or a related field.</p>
				</div>
			</details>

			<details name="group1">
				<summary>
					Job Requirements
					<svg data-slot="indicator-closed" width="16" height="16" aria-label="closed">
						<title>closed</title>
						<path d="M2 5l6 6 6-6" />
					</svg>
					<svg data-slot="indicator-open" width="16" height="16" aria-label="open">
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
	);
}
