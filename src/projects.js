export class Projects {
	constructor() {
		this.projectsArray = ["test 1", "test 2"];
	}

	getProjects() {
		return this.projectsArray;
	}

	createNewProject(title) {
		this.title = title;
	}
}

const test = new Projects();

// console.log(test.getProjets())
