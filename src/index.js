import './styles/main.css';
import './styles/layout.css';
import './styles/sidebar.css';
import './styles/cards.css';
import './styles/forms.css';
import { domRenderer } from './ui/domRenderer.js';
import { initSidebar } from './ui/domController.js';
import { appData } from './modules/project.js';

initSidebar();

domRenderer.renderHome(appData.projects);
domRenderer.renderProjects(appData.projects);



