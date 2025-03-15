/**
 * Task Manager - Main application
 */
document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const saveTaskBtn = document.getElementById('saveTask');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const loadingElement = document.getElementById('loading');
    const emptyMessageElement = document.getElementById('emptyMessage');
    
    const taskIdInput = document.getElementById('taskId');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const statusInput = document.getElementById('status');
    
    const toastElement = document.getElementById('toast');
    const toast = new bootstrap.Toast(toastElement);
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    let currentTaskId = null;
    let tasks = [];
    
    /**
     * Initialize the application
     */
    function init() {
        loadTasks();
        setupEventListeners();
    }
    
    /**
     * Configure the event listeners
     */
    function setupEventListeners() {
        saveTaskBtn.addEventListener('click', handleSaveTask);
        
        confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
        
        document.getElementById('taskModal').addEventListener('hidden.bs.modal', () => {
            resetForm();
        });
        
        titleInput.addEventListener('input', function() {
            updateCharCounter(this, 100, 'titleCounter');
        });
        
        descriptionInput.addEventListener('input', function() {
            updateCharCounter(this, 500, 'descriptionCounter');
        });
    }
    
    /**
     * Update the character counter for a field
     * @param {HTMLElement} inputElement - The input element
     * @param {number} maxLength - The maximum number of characters
     * @param {string} counterId - The ID of the counter element
     */
    function updateCharCounter(inputElement, maxLength, counterId) {
        const currentLength = inputElement.value.length;
        const remainingChars = maxLength - currentLength;
        
        let counterElement = document.getElementById(counterId);
        if (!counterElement) {
            counterElement = document.createElement('small');
            counterElement.id = counterId;
            counterElement.classList.add('form-text', 'text-muted');
            inputElement.parentNode.appendChild(counterElement);
        }
        
        counterElement.textContent = `${currentLength}/${maxLength} caracteres`;
        
        if (remainingChars < 20) {
            counterElement.classList.remove('text-muted');
            counterElement.classList.add('text-danger');
        } else {
            counterElement.classList.remove('text-danger');
            counterElement.classList.add('text-muted');
        }
    }
    
    /**
     * Load the tasks from the API
     */
    async function loadTasks() {
        showLoading(true);
        
        try {
            tasks = await API.getAllTasks();
            renderTasks();
        } catch (error) {
            showNotification('Erro', 'Não foi possível carregar as tarefas. Tente novamente mais tarde.', 'danger');
        } finally {
            showLoading(false);
        }
    }
    
    /**
     * Render the tasks in the table
     */
    function renderTasks() {
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            emptyMessageElement.classList.remove('d-none');
            return;
        }
        
        emptyMessageElement.classList.add('d-none');
        
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.classList.add('fade-in');
            
            const statusClass = task.status.replace(' ', '-');
            const statusDisplay = task.status.charAt(0).toUpperCase() + task.status.slice(1);
            
            row.innerHTML = `
                <td>
                    <div class="text-truncate-container" title="${task.title}">
                        <p>${task.title}</p>
                    </div>
                </td>
                <td>
                    <div class="text-truncate-container" title="${task.description || '-'}">
                        <p>${task.description || '-'}</p>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${statusClass}">${statusDisplay}</span>
                </td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary edit-task" data-id="${task.id}">
                        <i class="bi bi-pencil-square"></i> <span class="btn-text">Editar</span>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-task" data-id="${task.id}" data-title="${task.title}">
                        <i class="bi bi-trash"></i> <span class="btn-text">Excluir</span>
                    </button>
                    ${getStatusButtons(task)}
                </td>
            `;
            
            row.querySelector('.edit-task').addEventListener('click', () => openEditModal(task.id));
            row.querySelector('.delete-task').addEventListener('click', () => openDeleteModal(task.id, task.title));
            
            const statusButtons = row.querySelectorAll('.status-action');
            statusButtons.forEach(button => {
                button.addEventListener('click', () => updateTaskStatus(task.id, button.dataset.status));
            });
            
            taskList.appendChild(row);
        });
    }
    
    /**
     * Generate the status action buttons based on the current task status
     * @param {Object} task - The task
     * @returns {string} HTML of the status action buttons
     */
    function getStatusButtons(task) {
        if (task.status === 'pendente') {
            return `
                <button class="btn btn-sm btn-outline-info status-action" data-id="${task.id}" data-status="em andamento">
                    <i class="bi bi-play-fill"></i> <span class="btn-text">Iniciar</span>
                </button>
            `;
        } else if (task.status === 'em andamento') {
            return `
                <button class="btn btn-sm btn-outline-success status-action" data-id="${task.id}" data-status="concluída">
                    <i class="bi bi-check-lg"></i> <span class="btn-text">Concluir</span>
                </button>
            `;
        } else if (task.status === 'concluída') {
            return `
                <button class="btn btn-sm btn-outline-warning status-action" data-id="${task.id}" data-status="pendente">
                    <i class="bi bi-arrow-counterclockwise"></i> <span class="btn-text">Reabrir</span>
                </button>
            `;
        }
        return '';
    }
    
    /**
     * Open the modal to edit a task
     * @param {number} id - ID of the task
     */
    async function openEditModal(id) {
        try {
            const task = await API.getTaskById(id);
            
            taskIdInput.value = task.id;
            titleInput.value = task.title;
            descriptionInput.value = task.description || '';
            statusInput.value = task.status;
            
            updateCharCounter(titleInput, 100, 'titleCounter');
            updateCharCounter(descriptionInput, 500, 'descriptionCounter');
            
            document.getElementById('taskModalLabel').textContent = 'Editar Tarefa';
            
            currentTaskId = task.id;
            
            taskModal.show();
        } catch (error) {
            showNotification('Erro', 'Não foi possível carregar os dados da tarefa.', 'danger');
        }
    }
    
    /**
     * Open the modal to create a new task
     */
    function openCreateModal() {
        resetForm();
        
        document.getElementById('taskModalLabel').textContent = 'Nova Tarefa';
        
        taskModal.show();
    }
    
    /**
     * Open the confirmation modal to delete a task
     * @param {number} id - ID of the task
     * @param {string} title - Title of the task
     */
    function openDeleteModal(id, title) {
        const deleteTaskTitleElement = document.getElementById('deleteTaskTitle');
        deleteTaskTitleElement.textContent = title;
        deleteTaskTitleElement.parentElement.setAttribute('title', title);
        currentTaskId = id;
        deleteModal.show();
    }
    
    /**
     * Handle the save task event (create or update)
     */
    async function handleSaveTask() {
        if (titleInput.value.trim().length > 100) {
            titleInput.classList.add('is-invalid');
            let feedbackElement = titleInput.nextElementSibling;
            if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
                feedbackElement = document.createElement('div');
                feedbackElement.classList.add('invalid-feedback');
                titleInput.parentNode.insertBefore(feedbackElement, titleInput.nextSibling);
            }
            feedbackElement.textContent = 'O título deve ter no máximo 100 caracteres.';
            return;
        }
        
        if (descriptionInput.value.trim().length > 500) {
            descriptionInput.classList.add('is-invalid');
            let feedbackElement = descriptionInput.nextElementSibling;
            if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
                feedbackElement = document.createElement('div');
                feedbackElement.classList.add('invalid-feedback');
                descriptionInput.parentNode.insertBefore(feedbackElement, descriptionInput.nextSibling);
            }
            feedbackElement.textContent = 'A descrição deve ter no máximo 500 caracteres.';
            return;
        }
        
        if (!taskForm.checkValidity()) {
            taskForm.classList.add('was-validated');
            return;
        }
        
        const taskData = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim() || null,
            status: statusInput.value
        };
        
        try {
            if (currentTaskId) {
                await API.updateTask(currentTaskId, taskData);
                showNotification('Sucesso', 'Tarefa atualizada com sucesso!', 'success');
            } else {
                await API.createTask(taskData);
                showNotification('Sucesso', 'Tarefa criada com sucesso!', 'success');
            }
            
            taskModal.hide();
            
            loadTasks();
        } catch (error) {
            showNotification('Erro', 'Não foi possível salvar a tarefa.', 'danger');
        }
    }
    
    /**
     * Handle the confirm delete event
     */
    async function handleConfirmDelete() {
        if (!currentTaskId) return;
        
        try {
            await API.deleteTask(currentTaskId);
            
            deleteModal.hide();
            
            loadTasks();
            
            showNotification('Sucesso', 'Tarefa excluída com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro', 'Não foi possível excluir a tarefa.', 'danger');
        }
    }
    
    /**
     * Update the status of a task
     * @param {number} id - ID of the task
     * @param {string} newStatus - New status
     */
    async function updateTaskStatus(id, newStatus) {
        try {
            const task = await API.getTaskById(id);
            
            await API.updateTask(id, { ...task, status: newStatus });
            
            loadTasks();
            
            showNotification('Sucesso', 'Status da tarefa atualizado com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro', 'Não foi possível atualizar o status da tarefa.', 'danger');
        }
    }
    
    /**
     * Reset the form
     */
    function resetForm() {
        taskForm.reset();
        taskForm.classList.remove('was-validated');
        taskIdInput.value = '';
        currentTaskId = null;
        
        titleInput.classList.remove('is-invalid');
        descriptionInput.classList.remove('is-invalid');
        
        const titleCounter = document.getElementById('titleCounter');
        if (titleCounter) titleCounter.textContent = '0/100 caracteres';
        
        const descriptionCounter = document.getElementById('descriptionCounter');
        if (descriptionCounter) descriptionCounter.textContent = '0/500 caracteres';
    }
    
    /**
     * Show or hide the loading indicator
     * @param {boolean} show - Indicates whether to show or hide
     */
    function showLoading(show) {
        if (show) {
            loadingElement.classList.remove('d-none');
        } else {
            loadingElement.classList.add('d-none');
        }
    }
    
    /**
     * Show a toast notification
     * @param {string} title - Title of the notification
     * @param {string} message - Message of the notification
     * @param {string} type - Type of the notification (success, danger, warning, info)
     */
    function showNotification(title, message, type = 'info') {
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        toastElement.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
        
        toastElement.classList.add(`bg-${type}`);
        
        toastElement.classList.add('text-white');
        
        toast.show();
    }
    
    document.querySelector('[data-bs-target="#taskModal"]').addEventListener('click', openCreateModal);
    
    init();
}); 