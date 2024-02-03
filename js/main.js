Vue.component('task-form', {
    props: [],
    template: `
    <div class="content_form">
        <form @submit.prevent="addTask">
            <label for="task-name">Создайте новую задачу:</label>
            <input class="input" id="task-name" type="text" v-model="taskName"><br><br>
            <label for="task-desc">Описание задачи:</label>
            <textarea id="task-desc" v-model="description"></textarea><br><br>
            <label for="deadline">Срок сдачи:</label>
            <input type="date" id="deadline" v-model="deadline" name="deadline-task" min="2024-01-01" max="2025-12-31" required />
            <button type="submit">Создать</button>
        </form>
    </div>
    `,
    data() {
        return {
            taskName: '',
            description: '',
            deadline: ''
        };
    },
    methods: {
        addTask() {
            if (this.taskName !== '') {
                const newTask = {
                    title: this.taskName,
                    description: this.description,
                    deadline: this.deadline,
                    reason: ''
                };
                newTask.createdDate = new Date().toLocaleDateString();
                this.$emit('add', newTask);
                this.taskName = '';
                this.description = '';
                this.deadline = '';
            } else {
                alert("Введите название задачи");
            }
        }
    }
});

Vue.component('task', {
    props: ['task', 'type'],
    data() {
        return {
            editingDescription: false,
            editedDescription: ''
        };
    },
    methods: {
        handleEditDescription() {
            if (this.editingDescription) {
                this.task.description = this.editedDescription;
                this.task.lastEdited = new Date().toLocaleString(); // Обновляем время последнего редактирования
            }
            this.editingDescription = !this.editingDescription;
        },
        handleDeleteTask() {
            this.$emit('delete', this.task);
        },
        handleMoveTask() {
            if (this.type === 'plan') {
                this.$emit('move', this.task);
            } else if (this.type === 'work') {
                this.$emit('move-to-next', this.task);
            }
        },
        handleMoveToNext() {
            if (this.type === 'work') {
                this.$emit('move-to-testing', this.task);
            }
        }
    },
    template: `
    <div class="task">
        <span>Создано: {{ task.createdDate }}</span>
        <h3>{{ task.title }}</h3>
        <p v-if="!editingDescription">{{ task.description }}</p>
        <textarea v-model="editedDescription" v-if="editingDescription"></textarea>
        <span v-if="task.lastEdited">Отредактировано: {{ task.lastEdited }}</span><br><br>
        <span>Срок сдачи: {{ task.deadline }}</span><br><br>
        <button v-if="type !== 'completed'" @click="handleEditDescription">{{ editingDescription ? 'Сохранить' : 'Редактировать' }}</button>
        <button v-if="type !== 'completed'" @click="handleDeleteTask">Удалить</button>
        <button v-if="type === 'plan'" @click="handleMoveTask">Переместить</button>
        <button v-if="type === 'work'" @click="handleMoveToNext">Переместить</button>
    </div>
    `
});

Vue.component('task-column', {
    props: ['title', 'tasks', 'type'],
    template: `
    <div class="column">
        <h2 class="title_column">{{ title }}</h2>
        <task v-for="task in tasks" :key="task.id" :task="task" :type="type" @delete="handleDeleteTask" @move="handleMoveTask" @move-to-next="handleMoveToNext"></task>
    </div>
    `,
    methods: {
        handleDeleteTask(task) {
            this.$emit('delete-task', task);
        },
        handleMoveTask(task) {
            this.$emit('move-task', task);
        },
        handleMoveToNext(task) {
            if (this.type === 'plan') {
                this.$emit('move-to-next', task);
            } else if (this.type === 'work') {
                this.$emit('move-to-testing', task);
            }
        },
    }
});


Vue.component('app', {
    template: `
    <div id="app">
        <task-form @add="addTask"></task-form>
        <div class="board">
            <task-column title="Запланированные задачи" :tasks="planTask" type="plan" @delete-task="deleteTask" @move-task="moveTask" @move-to-next="moveToNext"></task-column>
            <task-column title="В работе" :tasks="workTask" type="work" @delete-task="deleteTask" @move-task="moveTask" @move-to-next="moveToNext"></task-column>
            <task-column title="Тестирование" :tasks="testingTask" type="testing" @delete-task="deleteTask" @move-task="moveTask" @move-to-next="moveToNext"></task-column>
            <task-column title="Выполненные задачи" :tasks="completedTask" type="completed"></task-column>
        </div>
    </div>
    `,
    data() {
        return {
            planTask: [],
            workTask: [],
            testingTask: [],
            completedTask: []
        };
    },
    methods: {
        addTask(task) {
            this.planTask.push(task);
        },
        deleteTask(task) {
            const index = this.planTask.indexOf(task);
            if (index !== -1) {
                this.planTask.splice(index, 1);
            }
            // Implement similar deletion logic for other task types if needed
        },
        moveTask(task) {
            const index = this.planTask.indexOf(task);
            if (index !== -1) {
                this.planTask.splice(index, 1);
                this.workTask.push(task);
            }
        },
        moveToNext(task) {
            if (this.workTask.includes(task)) {
                this.workTask.splice(this.workTask.indexOf(task), 1);
                this.testingTask.push(task);
            } else if (this.testingTask.includes(task)) {
                this.testingTask.splice(this.testingTask.indexOf(task), 1);
                this.completedTask.push(task);
            }
        }
    }
});

new Vue({
    el: '#app'
});
