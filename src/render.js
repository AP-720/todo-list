// import { Projects } from "./projects";

export class Render {
	constructor(projectsArray) {
		this.projectsArray = projectsArray;

		this.projectContainer = document.querySelector("[data-project-list]");
	}

	renderProject() {
		this.clearElement(this.projectContainer);

		const projects = this.projectsArray;

		projects.forEach((project) => {
			const projectElement = document.createElement("li");
			projectElement.dataset.projectId = project.id;
			projectElement.classList.add("project-name");
			projectElement.innerText = project.name;

			this.projectContainer.appendChild(projectElement);
		});
	}

	// Better way to remove child as doesn't reparse the whole DOM so more efficient
	clearElement(element) {
		element.replaceChildren();
	}
}
