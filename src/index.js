import "./css/reset.css";
import "./css/styles.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

import { Projects } from "./projects";
import { Render } from "./render";

const project = new Projects();

project.render.render();
project.render.renderAllTasks();
