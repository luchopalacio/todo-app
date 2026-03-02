import { createElement } from "./domUtils.js";
import { appData } from "../modules/project.js";
import { format } from 'date-fns'

export const domRenderer = {
    
    // todo card creation
    createTodoCard(todo, container) {
        const card = createElement('div', container, {
            className: `card priority-${todo.priority} ${todo.completed ? 'status-done' : 'status-pending'}`,
        });

        createElement('div', card, {
            className: 'card-header',
            text: todo.title
        });

        const cardBody = createElement('div', card, { className: 'card-body' });

        createElement('p', cardBody, { text: todo.description , className: '-description'});

        const meta = createElement('div', cardBody, { className: 'card-meta' });

        createElement('span', meta, { 
            text: `Due: ${format(new Date(todo.dueDate + 'T00:00:00'), 'dd/MM/yyyy')}`,
            className: 'card-date' 
        });

        createElement('span', meta, { 
            text: `From: ${todo.project}`,
            className: 'card-project' 
        });

        const footer = createElement('div', card, { className: 'card-footer' });

        createElement('button', footer, {
            text: todo.completed ? '↶' : '✓',
            className: `action-btn ${todo.completed ? 'task-completed' : ''}`,
            events: { 
                click: () => {
                    todo.toggleComplete();
                    appData.save();
                    this.refreshCurrentView();
                } 
            }
        });

        createElement('button', footer, {
            text: '✎',
            className: 'action-btn',
            events: { click: () => this.openEditModal(todo) }
        });

        createElement('button', footer, {
            text: '🗑',
            className: 'action-btn',
            events: { 
                click: () => {
                    this.showConfirmModal(`Delete '${todo.title}' from '${todo.project}'?`, () => {
                        const projectOwner = appData.projects.find(p => p.name === todo.project);
                        if (projectOwner) {
                            const realIndex = projectOwner.todos.indexOf(todo);
                            if (realIndex > -1) {
                                projectOwner.removeTodo(realIndex);
                            }
                        }
                        appData.save();
                        this.refreshCurrentView();
                    });   
                } 
            }
        });
    },

    // add projects to the sidebar list
    renderProjects(projects) {
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = ''; 

        projects.forEach((project, index) => {
            const li = createElement('li', projectsList, {
                text: project.name,
                attributes: { 'data-index': index }
            });
        }); 
    },

    renderTodos(todos, projectTitle, showAddButton = false) { // 
        const container = document.getElementById('cards-container');
        const viewTitle = document.getElementById('current-view-title');
        const headerActions = document.getElementById('header-actions');

        viewTitle.textContent = projectTitle;
        container.innerHTML = ''; 
        headerActions.innerHTML = ''; 

        // add task button only will be shown in a project area
        if (showAddButton) {
            createElement('button', container, {
                text: 'New Task',
                className: 'add-task-btn',
                events: {
                    click: () => {
                        const modal = document.getElementById('task-modal');
                        modal.showModal();
                    }
                }
            });

            // inbox cannot be deleted
            if (projectTitle !== 'Inbox') {
                createElement('button', headerActions, {
                    text: ' 🗑',
                    className: 'delete-project-btn',
                    events: {
                        click: (e) => {
                            e.stopPropagation(); 
                            this.showConfirmModal(`Are you sure to delete project "${projectTitle}"?`, () => {
                                appData.removeProject(projectTitle);
                                this.renderProjects(appData.projects);
                                this.renderHome(appData.projects);
                                appData.save();
                            });
                        }
                    }
                });
            }
        }

        // card rendering in main container
        if (todos.length === 0) {
            createElement('p', container, { text: 'No tasks here yet.', className: 'empty-message' });
        } else {
            todos.forEach((todo, index) => {
                this.createTodoCard(todo, container, index);
            });
        }
    },

    renderHome(allProjects) {
        const container = document.getElementById('cards-container');
        const viewTitle = document.getElementById('current-view-title');
        const headerActions = document.getElementById('header-actions');

        viewTitle.textContent = "Hey There!";
        container.innerHTML = ''; 
        headerActions.innerHTML = '';

        const allTodos = allProjects.flatMap(project => project.todos);
        const highPriorityTodos = allTodos.filter(t => t.priority === 'high' && !t.completed);
        const pendingCount = allTodos.filter(t => !t.completed).length;

        const statsSection = createElement('div', container, { className: 'home-stats' });
        
        createElement('div', statsSection, { 
            className: 'stat-card', 
            text: `📝 ${pendingCount} Pending Tasks` 
        });
        
        createElement('div', statsSection, { 
            className: 'stat-card', 
            text: `🔥 ${highPriorityTodos.length} High Priority` 
        });

        if (highPriorityTodos.length > 0) {
            createElement('h2', container, { 
                text: "Don't forget these!", 
                className: 'home-subtitle' 
            });
            
            highPriorityTodos.slice(0, 3).forEach((todo, index) => {
                this.createTodoCard(todo, container, index);
            });
        } else {
            createElement('p', container, { 
                text: "Relax! No high priority tasks for now.",
                className: 'empty-message'
            });
        }
    },

    // ask for task info
    initTaskModal(onSubmit) {
        if (document.getElementById('task-modal')) return;

        const modal = createElement('dialog', document.body, { attributes: { id: 'task-modal' } });
        const form = createElement('form', modal, { attributes: { id: 'task-form', method: 'dialog' } });

        createElement('h2', form, { text: 'New Task' });

        createElement('label', form, { text: 'Title' });
        const titleInp = createElement('input', form, { attributes: { id: 'task-title', required: '', type: 'text' } });

        createElement('label', form, { text: 'Description' });
        const descInp = createElement('textarea', form, { attributes: { id: 'task-desc' } });

        createElement('label', form, { text: 'Due Date' });
        const today = new Date().toISOString().split('T')[0];
        const dateInp = createElement('input', form, { 
            attributes: { 
                id: 'task-date', 
                required: '', 
                type: 'date',
                min: today  // to make sure the user doesn't input past dates
            } 
        });

        createElement('label', form, { text: 'Priority' });
        const prioSel = createElement('select', form, { attributes: { id: 'task-priority' } });
        ['low', 'medium', 'high'].forEach(p => {
            createElement('option', prioSel, { text: p, attributes: { value: p } });
        });

        const btnContainer = createElement('div', form, { className: 'form-buttons' });
        
        createElement('button', btnContainer, { 
            text: 'Cancel', 
            attributes: { type: 'button' , id : "cancel-btn"},
            events: { click: () => modal.close() } 
        });

        createElement('button', btnContainer, { 
            text: 'Save Task', 
            attributes: { type: 'submit' , id: "submit-btn"} 
        });

        form.addEventListener('submit', (e) => {
            // e.preventDefault(); doesn't work as i thought it would
            const title = titleInp.value;
            const desc = descInp.value;
            const date = dateInp.value;
            const priority = prioSel.value;

        if (form.dataset.mode === 'edit') {
            const todo = form.todoToEdit;
            todo.title = title;
            todo.description = desc;
            todo.dueDate = date;
            todo.priority = priority;
            
            appData.save();
            this.refreshCurrentView(); 
        } else {
            onSubmit({ title, desc, date, priority });
            appData.save();
        }

            this.resetModalState(form, modal);
        });
    },

    // ask for task info for editing
    openEditModal(todo) {
        const modal = document.getElementById('task-modal');
        const form = document.getElementById('task-form');
        
        document.getElementById('task-title').value = todo.title;
        document.getElementById('task-desc').value = todo.description;
        document.getElementById('task-date').value = todo.dueDate;
        document.getElementById('task-priority').value = todo.priority;

        form.dataset.mode = 'edit';
        form.todoToEdit = todo; // save the reference of the object that will be edited

        modal.querySelector('h2').textContent = 'Edit Task';
        document.getElementById('submit-btn').textContent = 'Update Task';

        modal.showModal();
    },

    showConfirmModal(message, onConfirm) {
        const modal = createElement('dialog', document.body, { className: 'confirm-modal' });
        const container = createElement('div', modal, { className: 'confirm-container' });
        
        createElement('p', container, { text: message });
        
        const buttons = createElement('div', container, { className: 'form-buttons' });

        createElement('button', buttons, { 
            text: 'Cancel', 
            events: { 
                click: () => { 
                    modal.close(); 
                    modal.remove(); 
                } 
            } 
        });

        createElement('button', buttons, { 
            text: 'Delete',
            className: 'btn-danger', 
            events: { 
                click: () => {
                    onConfirm();
                    modal.close();
                    modal.remove();
                }
            }
        });

        modal.showModal();
    },

    initProjectModal(onSave) {

        const modal = createElement('dialog', document.body, { attributes: { id: 'project-modal' } });
        const form = createElement('form', modal, { attributes: { method: 'dialog' } });
        
        createElement('h2', form, { text: 'New Project' });
        
        const input = createElement('input', form, { 
            attributes: { 
                type: 'text', 
                placeholder: 'Project Name (e.g. University)', 
                required: '', 
                id: 'project-name-input'
            } 
        });
        
        const buttons = createElement('div', form, { className: 'form-buttons' });
        
        createElement('button', buttons, { 
            text: 'Cancel', 
            attributes: { type: 'button' },
            events: { click: () => modal.close() } 
        });
        
        createElement('button', buttons, { 
            text: 'Create', 
            attributes: { type: 'submit' } 
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const projectName = input.value.trim();

            onSave(projectName, modal); 
            
            input.value = ''; 
        });

        return modal;
    },

    refreshCurrentView() {
        const current = appData.currentProject;
        
        if (current === 'Home') {
            this.renderHome(appData.projects);
        } else if (['all', 'today', 'week', 'month', 'high'].includes(current)) {
            document.querySelector(`[data-filter="${current}"]`).click();
        } else {
            const project = appData.projects.find(p => p.name === current);
            if (project) {
                this.renderTodos(project.todos, project.name, true);
            }
        }
    },

    resetModalState(form, modal) {
        form.reset();
        delete form.dataset.mode;
        delete form.todoToEdit;
        modal.querySelector('h2').textContent = 'New Task';
        document.getElementById('submit-btn').textContent = 'Save Task';
    }
};