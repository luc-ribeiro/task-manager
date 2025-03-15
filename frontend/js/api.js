/**
 * Module for managing API calls
 */
const API = {
    // Base URL of the API
    baseUrl: 'http://localhost:9000/tasks',
    
    /**
     * Get all tasks
     * @returns {Promise<Array>} Promise with an array of tasks
     */
    async getAllTasks() {
        try {
            const response = await fetch(this.baseUrl);
            
            if (!response.ok) {
                throw new Error(`Error fetching tasks: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },
    
    /**
     * Get a task by ID
     * @param {number} id - ID of the task
     * @returns {Promise<Object>} Promise with the task data
     */
    async getTaskById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`);
            
            if (!response.ok) {
                throw new Error(`Error fetching task: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching task ${id}:`, error);
            throw error;
        }
    },
    
    /**
     * Create a new task
     * @param {Object} taskData - Data of the task to be created
     * @returns {Promise<Object>} Promise with the created task data
     */
    async createTask(taskData) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
            
            if (!response.ok) {
                throw new Error(`Error creating task: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },
    
    /**
     * Update an existing task
     * @param {number} id - ID of the task
     * @param {Object} taskData - New data of the task
     * @returns {Promise<Object>} Promise with the updated task data
     */
    async updateTask(id, taskData) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
            
            if (!response.ok) {
                throw new Error(`Error updating task: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error updating task ${id}:`, error);
            throw error;
        }
    },
    
    /**
     * Delete a task
     * @param {number} id - ID of the task to be deleted
     * @returns {Promise<void>}
     */
    async deleteTask(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Error deleting task: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error deleting task ${id}:`, error);
            throw error;
        }
    }
}; 