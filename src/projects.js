import { format } from "date-fns";
import { Render } from "./render";

export class Projects {
	constructor() {
		this.projectsArray = [
			{
				id: 1,
				name: "test 1",
			},
			{
				id: 2,
				name: "test 2",
			},
		];

		this.render = new Render(this.projectsArray);

		this.currentDate = new Date();
		this.formattedDate = format(this.currentDate, "yyyy-MM-dd HH:mm:ss");

		this.newProjectForm = document.querySelector("[data-new-project-form]");
		this.newProjectInput = document.querySelector("[data-new-project-input]");

		this.render.renderProject();

		this.newProjectForm.addEventListener("submit", (e) =>
			this.addNewProject(e)
		);
	}

	getProjects() {
		return this.projectsArray;
	}

	createNewProject(name) {
		return { id: this.formattedDate, name: name, tasks: [] };
	}

	addNewProject(event) {
		event.preventDefault();

		const name = this.newProjectInput.value;
		if (name == null || name === "") return;
		const newProject = this.createNewProject(name);
		this.projectsArray.push(newProject);

		console.log(this.projectsArray);

		this.render.renderProject();

		this.newProjectForm.reset();
	}
}
