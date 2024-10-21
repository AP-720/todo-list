import { LocalStorage } from "./localStorage";

export class Render {
	constructor(projectsArray) {
		this.localStorage = new LocalStorage();

		this.projectsArray = projectsArray;
		this.selectedProjectId = null;

		this.projectContainer = document.querySelector("[data-project-list]");
		this.modal = document.querySelector("[data-task-modal]");
		this.addTaskForm = document.getElementById("add-task");
		this.projectList = document.querySelector("[data-project-list]");

		this.createTaskBtn = document.querySelector("[data-new-task-btn]");
		this.cancelTaskBtn = document.querySelector("[data-cancel-task-btn]");

		this.createTaskBtn.addEventListener("click", () => this.showModal());
		this.cancelTaskBtn.addEventListener("click", () => this.closeModal());
		this.projectList.addEventListener("click", (event) =>
			this.getSelectedProjectId(event)
		);
	}

	renderProject() {
		this.clearElement(this.projectContainer);

		const projects = this.projectsArray;

		projects.forEach((project) => {
			const projectElement = document.createElement("li");
			projectElement.dataset.projectId = project.id;
			projectElement.classList.add("project-name");
			projectElement.innerText = project.name;

			if (project.id === this.selectedProjectId) {
				projectElement.classList.add("selected-project");
			}

			this.projectContainer.appendChild(projectElement);
		});
	}

	showModal() {
		this.modal.showModal();
	}

	closeModal() {
		this.addTaskForm.reset();
		this.modal.close();
	}

	getSelectedProjectId(event) {
		if (event.target && event.target.nodeName === "LI") {
			this.selectedProjectId = event.target.getAttribute("data-project-id");

			const allProjectElements =
				this.projectContainer.querySelectorAll(".project-name");
			allProjectElements.forEach((projectElement) => {
				projectElement.classList.remove("selected-project");
			});

			event.target.classList.add("selected-project");

			this.localStorage.saveSelectedProjectId(this.selectedProjectId);
			// this.renderProject()
		}
	}

	// Better way to remove child as doesn't reparse the whole DOM so more efficient
	clearElement(element) {
		element.replaceChildren();
	}
}
