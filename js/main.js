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
            editedDescription: '',
            returnReason: ''
        };
    },
    methods: {
        handleEditDescription() {
            if (this.editingDescription) {
                this.task.description = this.editedDescription;
                this.task.lastEdited = new Date().toLocaleString();
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
                this.$emit('move-to-next', this.task);
            }
        },
        handleReturnToPrevious() {
            if (this.returnReason !== '') {
                this.task.reason = this.returnReason;
                this.$emit('return', this.task);
            } else {
                alert("Введите причину возврата");
            }
        },
        handleCompleteTask() {
            this.$emit('complete', this.task);
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
        <button v-if="type === 'plan'" @click="handleDeleteTask">Удалить</button>
        <button v-if="type !== 'completed'" @click="handleEditDescription">{{ editingDescription ? 'Сохранить' : 'Редактировать' }}</button>
        <button v-if="type === 'plan'" @click="handleMoveTask">Переместить</button>
        <button v-if="type === 'work'" @click="handleMoveToNext">Переместить</button>
        <button v-if="type === 'testing'" @click="handleReturnToPrevious">Вернуть</button>
        <button v-if="type === 'testing'" @click="handleCompleteTask">Выполнено</button>
        <br>
        <textarea v-if="type === 'testing'" v-model="returnReason" placeholder="Введите причину возврата"></textarea>
        <span v-if="type === 'work' && task.reason">Причина возврата: {{ task.reason }}</span>
        <span v-if="type === 'completed'">{{ task.check }}</span>
    </div>
    `
});

Vue.component('task-column', {
    props: ['title', 'tasks', 'type'],
    template: `
    <div class="column">
        <h2 class="title_column">{{ title }}</h2>
        <task v-for="task in tasks" :key="task.id" :task="task" :type="type" @delete="handleDeleteTask" @move="moveTask" @move-to-next="moveToNext" @return="returnTask" @complete="completeTask"></task>
    </div>
    `,
    methods: {
        handleDeleteTask(task) {
            this.$emit('delete-task', task);
        },
        moveTask(task) {
            this.$emit('move-task', task);
        },
        moveToNext(task) {
            const indexTesting = this.tasks.indexOf(task);
            if (this.type === 'work' && indexTesting !== -1 && task.reason) {
                task.reason = '';
            }
            this.$emit('move-to-next', task);
        },
        returnTask(task) {
            this.$emit('return-task', task);
        },
        completeTask(task) {
            this.$emit('complete-task', task);
        }
    }
});

Vue.component('app', {
    template: `
    <div id="app">
        <task-form @add="addTask"></task-form>
        <div class="board">
            <task-column title="Запланированные задачи" :tasks="planTask" type="plan" @delete-task="deleteTask" @move-task="moveTask" @move-to-next="moveToNext" @return-task="returnTask" @complete-task="completeTask"></task-column>
            <task-column title="В работе" :tasks="workTask" type="work" @delete-task="deleteTask" @move-task="moveTask" @move-to-next="moveToNext" @return-task="returnTask" @complete-task="completeTask"></task-column>
            <task-column title="Тестирование" :tasks="testingTask" type="testing" @delete-task="deleteTask" @move-task="moveTask" @move-to-next="moveToNext" @return-task="returnTask" @complete-task="completeTask"></task-column>
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
            const indexPlan = this.planTask.indexOf(task);
            const indexWork = this.workTask.indexOf(task);
            const indexTesting = this.testingTask.indexOf(task);
            const indexCompleted = this.completedTask.indexOf(task);

            if (indexPlan !== -1) {
                this.planTask.splice(indexPlan, 1);
            } else if (indexWork !== -1) {
                this.workTask.splice(indexWork, 1);
            } else if (indexTesting !== -1) {
                this.testingTask.splice(indexTesting, 1);
            } else if (indexCompleted !== -1) {
                this.completedTask.splice(indexCompleted, 1);
            }
        },
        moveTask(task) {
            const indexPlan = this.planTask.indexOf(task);
            const indexWork = this.workTask.indexOf(task);
            const indexTesting = this.testingTask.indexOf(task);

            if (indexPlan !== -1) {
                this.planTask.splice(indexPlan, 1);
                this.workTask.push(task);
            } else if (indexWork !== -1) {
                this.workTask.splice(indexWork, 1);
                this.testingTask.push(task);
            } else if (indexTesting !== -1) {
                this.testingTask.splice(indexTesting, 1);
                this.completedTask.push(task);
                if (task.deadline >= task.createdDate) {
                    task.check = 'Выполнено в срок';
                } else {
                    task.check = 'Просрочено';
                }
            }
        },
        moveToNext(task) {
            const indexWork = this.workTask.indexOf(task);
            const indexTesting = this.testingTask.indexOf(task);

            if (indexWork !== -1) {
                this.workTask.splice(indexWork, 1);
                this.testingTask.push(task);
            } else if (indexTesting !== -1) {
                this.testingTask.splice(indexTesting, 1);
                this.completedTask.push(task);
                if (task.deadline >= task.createdDate) {
                    task.check = 'Выполнено в срок';
                } else {
                    task.check = 'Просрочено';
                }
            }
        },
        returnTask(task) {
            this.testingTask.splice(this.testingTask.indexOf(task), 1);
            this.workTask.push(task);
        },
        completeTask(task) {
            this.testingTask.splice(this.testingTask.indexOf(task), 1);
            this.completedTask.push(task);
            if (task.deadline >= task.createdDate) {
                task.check = 'Выполнено в срок';
            } else {
                task.check = 'Просрочено';
            }
        }
    }
});

new Vue({
    el: '#app'
});
