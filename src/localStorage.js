export class LocalStorage {
	constructor() {
		this.LOCAL_STORAGE_PROJECT_KEY = "project.projects";
		this.LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = "project.selectedProjectId";
	}

	getProjects() {
		return (
			JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_PROJECT_KEY)) || []
		);
	}

	saveProjects(projects) {
		localStorage.setItem(
			this.LOCAL_STORAGE_PROJECT_KEY,
			JSON.stringify(projects)
		);
	}

	getSelectedProjectId() {
		return JSON.parse(
			localStorage.getItem(this.LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY)
		);
	}

	saveSelectedProjectId(selectedProjectId) {
		localStorage.setItem(
			this.LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY,
			JSON.stringify(selectedProjectId)
		);
	}
}
