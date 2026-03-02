# To-Do List App
A dynamic task management application built with Webpack, vanilla JavaScript, HTML, and CSS featuring a clean, modular architecture and persistent data storage.

## Live Demo
[View Live Demo](https://luchopalacio.github.io/todo-app/) (Hosted in GitHub Pages)

## Overview
This project is part of 'The Odin Project' curriculum, specifically from the Todo List assignment. It demonstrates advanced web development concepts including the Module Pattern, separation of concerns (Logic vs. UI), and handling complex application states.

## Features
- **Task Management**: Full CRUD (Create, Read, Update, Delete) functionality for tasks.
- **Project Organization**: Ability to group tasks into custom projects or use the default "Inbox".
- **Smart Filters**: Dynamic views for "Today", "This Week", "This Month", and "High Priority" tasks.
- **Data Persistence**: Uses localStorage to ensure your tasks and projects remain available after closing the browser.
- **Dynamic UI**: Responsive design with CSS Grid and interactive modals for a seamless user experience.

## Tech Stack
- **HTML5 & CSS3**: Custom variables, Flexbox, and Grid layout.
- **JavaScript (ES6+)**: Modular architecture using ES6 Modules.
- **Webpack**: Module bundling, asset management, and development server.
- **date-fns**: Professional library for date manipulation and formatting.

## Installation
1) Clone the repository:
```Bash
git clone https://github.com/your-username/todo-list.git
```
2) Navigate to the folder:
```Bash
cd todo-list
```
3) Install dependencies:
```Bash
npm install
```
4) Run the development server:
```Bash
npm start
```
5) Build for production:
```Bash
npm run build
```

## Current Project Structure
```
todo-list/
├── src/
│   ├── modules/         # Business logic (project.js, todo.js, storage.js)
│   ├── ui/              # DOM logic (domRenderer.js, domController.js, domUtils.js)
│   ├── styles/          # Modular CSS files (main, sidebar, cards, forms, layout)
│   ├── index.js         # Application entry point and initialization
│   └── index.html       # HTML Skeleton        
├── dist/                # Distribution folder for production
├── webpack.config.js    # Bundler configuration
└── package.json         # Dependencies and project scripts
```

## Future Enhancements
This project is planned to evolve with:
- Refactoring & Optimization: Implementing more efficient data structures and cleaner logic flows.
- UI/UX Enhancements: Drag-and-drop task reordering and more advanced animations.
- Advanced Features: Task reminders, sub-tasks, and categorization tags.
- Testing: Adding unit tests to ensure reliability of the core logic.

## Disclaimer
Please note that there might be some bugs, and the code may be a bit 'messy' in certain areas. This is simply the first version of the project, representing a significant milestone in my learning journey with JavaScript architecture.

## Author
Luciano Palacio