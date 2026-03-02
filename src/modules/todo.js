import { format } from 'date-fns';

export class Todo {
    constructor(title, description, dueDate, priority, project = 'Inbox', notes = '') {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.notes = notes;
        this.createdDate = format(new Date(), 'dd/MM/yyyy');
        this.completed = false;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }
}