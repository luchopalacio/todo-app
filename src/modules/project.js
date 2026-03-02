import { Todo } from './todo.js';
import { storage } from './storage.js';

export class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(index) {
        this.todos.splice(index, 1);
    }
}

export const appData = {
    projects: [], 
    currentProject: 'Inbox',

    // save current state
    save() {
        storage.save(this.projects);
    },

    load() {
        const savedData = storage.load();
        
        if (savedData) {
            this.projects = savedData.map(pData => {
                const project = new Project(pData.name);
                project.todos = pData.todos.map(tData => {
                    const todo = new Todo(
                        tData.title, 
                        tData.description, 
                        tData.dueDate, 
                        tData.priority, 
                        tData.project
                    );
                    todo.completed = tData.completed; 
                    return todo;
                });
                return project;
            });
        } else {
            // first time page is opened
            const inbox = new Project('Inbox');
            const welcomeTask = new Todo(
                'Read me!', 
                'This is my first Todo App, hope you like it!', 
                '2026-03-01', 
                'high',
                'Inbox'
            );
            inbox.addTodo(welcomeTask);
            
            this.projects = [inbox];
            this.save(); 
        }
    },

    removeProject(name) {
        if (name === 'Inbox') return; 
        this.projects = this.projects.filter(p => p.name !== name);
        this.save(); 
    }
};

appData.load();