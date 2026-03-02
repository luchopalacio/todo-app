export const storage = {
    save(projects) {
        localStorage.setItem('todoAppData', JSON.stringify(projects));
    },

    load() {
        const data = localStorage.getItem('todoAppData');
        return data ? JSON.parse(data) : null;
    }
};