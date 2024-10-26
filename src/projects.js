import { format } from "date-fns";
import { Render } from "./render";
import { LocalStorage } from "./localStorage";

export class Projects {
	constructor() {
		this.LocalStorage = new LocalStorage();
		this.projectsArray = this.LocalStorage.getProjects();
		this.selectedProjectId = this.LocalStorage.getSelectedProjectId();

		this.render = new Render(this.projectsArray);
		this.render.selectedProjectId = this.selectedProjectId;

		this.newProjectForm = document.querySelector("[data-new-project-form]");
		this.newProjectInput = document.querySelector("[data-new-project-input]");

		this.render.renderProject();

		this.newProjectForm.addEventListener("submit", (e) =>
			this.addNewProject(e)
		);
	}

	createNewProject(name) {
		const currentDate = new Date();
		const formattedDate = format(currentDate, "yyyy-MM-dd HH:mm:ss");

		return { id: formattedDate, name: name, tasks: [] };
	}

	addNewProject(event) {
		event.preventDefault();

		const name = this.newProjectInput.value;
		if (name == null || name === "") return;

		const newProject = this.createNewProject(name);
		this.projectsArray.push(newProject);

		this.selectedProjectId = newProject.id;

		this.LocalStorage.saveProjects(this.projectsArray);
		this.LocalStorage.saveSelectedProjectId(this.selectedProjectId);

		this.render.selectedProjectId = this.selectedProjectId;
		this.render.updateProjectsArray(this.projectsArray);

		this.newProjectForm.reset();
	}
}
