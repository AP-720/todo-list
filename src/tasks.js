import { format } from "date-fns";
import { LocalStorage } from "./localStorage";

export class Tasks {
	constructor() {
		this.localStorage = new LocalStorage();
		this.projectsArray = this.localStorage.getProjects();
		this.selectedProjectId = this.localStorage.getSelectedProjectId();
	}

	createNewTask(taskBody, dueDate, priority) {
		const currentDate = new Date();
		const formattedDate = format(currentDate, "yyyy-MM-dd HH:mm:ss");

		return {
			id: formattedDate,
			taskBody: taskBody,
			dueDate: dueDate,
			priority: priority,
			complete: false,
		};
	}

	addNewTask(taskBody, dueDate, priority, projectsArray, selectedProjectId) {
		const newTask = this.createNewTask(taskBody, dueDate, priority);

		const selectedProject = projectsArray.find(
			(project) => project.id === selectedProjectId
		);

		if (selectedProject) {
			selectedProject.tasks.push(newTask);
			this.localStorage.saveProjects(projectsArray);
		}
	}
}
