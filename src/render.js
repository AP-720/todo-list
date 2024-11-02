import { LocalStorage } from "./localStorage";
import { Tasks } from "./tasks";
import { format, parseISO } from "date-fns";

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
		this.taskTemplate = document.querySelector("[data-task-template]");

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

		this.taskBody.addEventListener("change", (event) =>
			this.toggleTaskCompletion(event)
		);

		this.taskBody.addEventListener("click", (event) =>
			this.handleDeleteTask(event)
		);
	}

	render() {
		this.renderProject();
		this.renderTasks(this.selectedProjectId);
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
			this.render();

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

		this.render();
	}

	// Tasks

	renderTasks(selectedProjectId) {
		this.clearElement(this.taskBody);
		const selectedProject = this.projectsArray.find(
			(project) => project.id === selectedProjectId
		);

		if (selectedProject) {
			selectedProject.tasks.forEach((task) => {
				const newTask = this.taskTemplate.content.cloneNode(true);
				const setTaskId = newTask.querySelector(".task");
				setTaskId.setAttribute("data-task", task.id);
				const checkBox = newTask.querySelector("input");
				checkBox.id = task.id;
				checkBox.checked = task.complete;
				const taskLabel = newTask.querySelector("label");
				taskLabel.htmlFor = task.id;
				taskLabel.textContent = task.taskBody;
				const dateDue = newTask.querySelector("[data-task-dueDate]");
				const formattedDate = format(parseISO(task.dueDate), "dd-MM-yyyy");
				dateDue.textContent = `Due: ${formattedDate}`;
				const taskPriority = newTask.querySelector("[data-task-priority]");
				let priorityText;
				switch (task.priority) {
					case "0":
						priorityText = "Low";
						break;
					case "1":
						priorityText = "Medium";
						break;
					case "2":
						priorityText = "High";
						break;
				}
				taskPriority.textContent = `Priority: ${priorityText}`;
				this.taskBody.append(newTask);
			});
		}
	}

	handleAddTask(event) {
		event.preventDefault();

		const taskBody = document.getElementById("task").value;
		const dueDate = document.getElementById("date-due").value;
		const priority = document.getElementById("priority").value;

		console.log(dueDate);

		this.tasks.addNewTask(
			taskBody,
			dueDate,
			priority,
			this.projectsArray,
			this.selectedProjectId
		);

		this.render();
		this.closeModal();
	}

	toggleTaskCompletion(event) {
		if (event.target.matches("input[type='checkbox']")) {
			const taskId = event.target.id;

			this.tasks.toggleComplete(
				taskId,
				this.projectsArray,
				this.selectedProjectId
			);

			this.localStorage.saveProjects(this.projectsArray);
		}
	}

	handleDeleteTask(event) {
		// Need to use closest because of the icon in the button.
		const deleteButton = event.target.closest("[data-delete-task-btn]");

		const task = event.target.closest(".task");

		const taskId = task.dataset.task;

		if (deleteButton) {
			this.tasks.deleteTask(taskId, this.projectsArray, this.selectedProjectId);

			this.localStorage.saveProjects(this.projectsArray);
			this.render();
		}
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
