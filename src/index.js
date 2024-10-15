import "./css/reset.css";
import "./css/styles.css";

import { Projects } from "./projects";

class Render {
	constructor() {
		this.projects = new Projects();

		this.projectContainer = document.querySelector("[data-project-list]");
	}

	renderProject() {
		this.clearElement(this.projectContainer);

		const projectArray = this.projects.getProjects();

		projectArray.forEach((project) => {
			const projectElement = document.createElement("li");
			projectElement.classList.add("project-name");
			projectElement.innerText = project;

			this.projectContainer.appendChild(projectElement);
		});
	}

	clearElement(element) {
		element.innerText = "";
	}
}

const test = new Render();

test.renderProject();
