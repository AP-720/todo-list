import { LocalStorage } from "./localStorage";
import { Tasks } from "./tasks";

export class Render {
	constructor(projectsArray) {
		this.localStorage = new LocalStorage();
		this.tasks = new Tasks();

		this.projectsArray = projectsArray;
		this.selectedProjectId = this.localStorage.getSelectedProjectId();

		this.projectContainer = document.querySelector("[data-project-list]");

		this.modal = document.querySelector("[data-task-modal]");
		this.addTaskForm = document.getElementById("add-task");
		this.projectTitle = document.querySelector("[data-project-name-title]");
		this.taskBody = document.querySelector("[data-task-body]");

		this.createTaskBtn = document.querySelector("[data-new-task-btn]");
		this.cancelTaskBtn = document.querySelector("[data-cancel-task-btn]");
		this.deleteProjectBtn = document.querySelector("[data-delete-project-btn]");
		this.addNewTaskBtn = document.querySelector("[data-add-task-btn]");

		this.createTaskBtn.addEventListener("click", () => this.showModal());
		this.cancelTaskBtn.addEventListener("click", () => this.closeModal());
		this.addNewTaskBtn.addEventListener("click", (event) =>
			this.handleAddTask(event)
		);

		this.projectContainer.addEventListener("click", (event) =>
			this.getSelectedProjectId(event)
		);
		this.deleteProjectBtn.addEventListener("click", () => this.deleteProject());
	}

	render() {
		this.renderProject();
	}

	// updateProjectsArray(newProjectsArray) {
	// 	this.projectsArray = newProjectsArray;
	// 	this.renderProject();
	// }

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

		this.updateProjectTitle();
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

			this.updateProjectTitle();

			this.localStorage.saveSelectedProjectId(this.selectedProjectId);
		}
	}

	updateProjectTitle() {
		if (this.selectedProjectId) {
			const selectProject = this.projectsArray.find(
				(project) => project.id === this.selectedProjectId
			);
			if (selectProject) {
				this.projectTitle.innerText = selectProject.name;
			}
		}
	}

	deleteProject() {
		//  Used splice instead of filter as filter was causing issues with stale references
		const projectIndex = this.projectsArray.findIndex(
			(project) => project.id === this.selectedProjectId
		);

		if (projectIndex !== -1) {
			this.projectsArray.splice(projectIndex, 1);
		}

		this.localStorage.saveProjects(this.projectsArray);

		this.selectedProjectId = null;
		this.localStorage.saveSelectedProjectId(this.selectedProjectId);

		this.projectTitle.innerText = "Project Title";

		console.log(this.projectsArray);

		this.render();
	}

	// Tasks

	renderTasks(selectedProject) {
		selectedProject;
	}

	handleAddTask(event) {
		event.preventDefault();

		const taskBody = document.getElementById("task").value;
		const dueDate = document.getElementById("date-due").value;
		const priority = document.getElementById("priority").value;

		this.tasks.addNewTask(
			taskBody,
			dueDate,
			priority,
			this.projectsArray,
			this.selectedProjectId
		);

		this.closeModal();
	}

	// Better way to remove child as doesn't reparse the whole DOM so more efficient
	clearElement(element) {
		element.replaceChildren();
	}

	showModal() {
		this.modal.showModal();
	}

	closeModal() {
		this.addTaskForm.reset();
		this.modal.close();
	}
}
