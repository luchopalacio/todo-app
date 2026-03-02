import { domRenderer } from './domRenderer.js';
import { Project, appData } from '../modules/project.js';
import { format } from 'date-fns';
import { isSameWeek } from 'date-fns';
import { isSameMonth } from 'date-fns';
import { Todo } from '../modules/todo.js';

export function initSidebar() {
    const tasksToggle = document.getElementById('open-tasks');
    const projectsToggle = document.getElementById('open-projects');
    const tasksMenu = document.getElementById('tasks-menu');
    const projectsMenu = document.getElementById('projects-list');
    const newProjectBtn = document.getElementById('new-project');

    // modal
    domRenderer.initTaskModal((data) => {
        const targetProjectName = ['all', 'today', 'week', 'month', 'high', 'Home'].includes(appData.currentProject) 
        ? 'Inbox' 
        : appData.currentProject;

        const newTodo = new Todo(
            data.title, 
            data.desc, 
            data.date, 
            data.priority, 
            targetProjectName 
        );

        const project = appData.projects.find(p => p.name === targetProjectName);
        
        if (project) {
            project.addTodo(newTodo);
            domRenderer.refreshCurrentView();
            domRenderer.renderTodos(project.todos, project.name, true);
        }
    });

    // SIDEBAR:

    // colapse/expand sidebar items
    tasksToggle.addEventListener('click', () => {
        tasksMenu.classList.toggle('hidden');
        tasksToggle.classList.toggle('open');
    });

    projectsToggle.addEventListener('click', () => {
        projectsMenu.classList.toggle('hidden');
        projectsToggle.classList.toggle('open');
    });

    projectsMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const projectIndex = e.target.dataset.index;

            if (projectIndex === undefined) return;
            
            const selectedProject = appData.projects[projectIndex];

            appData.currentProject = selectedProject.name;
            
            domRenderer.renderTodos(selectedProject.todos, selectedProject.name, true);
            
            document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
            e.target.classList.add('active');
        }
    });

    // tasks
    document.getElementById('tasks-menu').addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const filter = e.target.dataset.filter;
            const allTodos = appData.projects.flatMap(p => p.todos);
            let filteredTodos = [];
            let title = "";

            switch (filter) {
                case 'all':
                    filteredTodos = allTodos;
                    title = "All My Tasks";
                    appData.currentProject = 'all';
                    break;
                case 'today':
                    const today = format(new Date(), 'yyyy-MM-dd'); 
                    filteredTodos = allTodos.filter(t => t.dueDate === today);
                    title = "Today's Tasks";
                    appData.currentProject = 'today';
                    break;
                case 'high':
                    filteredTodos = allTodos.filter(t => t.priority === 'high');
                    title = "High Priority";
                    appData.currentProject = 'high';
                    break;
                case 'week':
                    const now = new Date();
                    filteredTodos = allTodos.filter(t => {
                        const taskDate = new Date(t.dueDate);
                        return isSameWeek(taskDate, now, { weekStartsOn: 1 });
                    });
                    title = "This Week's Tasks";
                    appData.currentProject = 'week';
                    break;
                case 'month':
                    const nowMonth = new Date();
                    filteredTodos = allTodos.filter(t => {
                        const taskDate = new Date(t.dueDate);
                        return isSameMonth(taskDate, nowMonth);
                    });
                    title = "This Month's Tasks";
                    appData.currentProject = 'month';
                    break;
                default:
                    filteredTodos = allTodos;
                    title = "Tasks";
            }

            domRenderer.renderTodos(filteredTodos, title);
            
            document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
            e.target.classList.add('active');
        }
    });

    // home
    document.getElementById('open-home').addEventListener('click', () => {
        appData.currentProject = 'Home';
        domRenderer.renderHome(appData.projects);
        document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
    });

    const projectModal = domRenderer.initProjectModal((projectName, modal) => {
        const exists = appData.projects.some(
            (p) => p.name.toLowerCase() === projectName.toLowerCase()
        );

        if (exists) {
            alert("This project already exists!");
            return; 
        }

        const newProject = new Project(projectName);
        appData.projects.push(newProject);
        appData.save();
        
        domRenderer.renderProjects(appData.projects);
        modal.close(); // Cerramos solo si tuvo éxito
    });

    // new project 
    newProjectBtn.addEventListener("click", () => {
        projectModal.showModal(); // Simplemente abrimos el modal creado
    });
}