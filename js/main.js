// main.js

Vue.component('board', {
    template: `
        <div class="board">
            <column title="Запланированные задачи" :tasks="planTask" @task-moved="moveTask" @task-added="addTask"></column>
            <column title="Задачи в работе" :tasks="workTask" @task-moved="moveTask"></column>
            <column title="Тестирование" :tasks="testingTask" @task-moved="moveTask"></column>
            <column title="Выполненные задачи" :tasks="completedTask"></column>
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
        moveTask(task, destination) {
            if (destination === 'work') {
                this.workTask.push(task);
                this.planTask.splice(this.planTask.indexOf(task), 1);
            } else if (destination === 'testing') {
                this.testingTask.push(task);
                this.workTask.splice(this.workTask.indexOf(task), 1);
            } else if (destination === 'completed') {
                // Move to completed, handle deadline logic
            }
        },
        addTask(task) {
            this.planTask.push(task);
        }
    }
});

Vue.component('column', {
    props: ['title', 'tasks'],
    data() {
        return {
            newTaskName: '',
            newTaskDescription: '',
            newTaskDeadline: ''
        };
    },
    template: `
        <div class="column">
            <h2 class="title_column">{{ title }}</h2>
            <div v-for="task in tasks" :key="task.id" class="task">
                <card :task="task" @move="moveTask"></card>
            </div>
            <div class="content_form" v-if="title === 'Запланированные задачи'">
                <form @submit.prevent="addTask">
                    <label for="task-name">Создайте новую задачу:</label>
                    <input class="input" id="task-name" type="text" v-model="newTaskName"><br><br>
                    <label for="task-desc">Описание задачи:</label>
                    <textarea id="task-desc" v-model="newTaskDescription"></textarea><br><br>
                    <label for="deadline">Срок сдачи:</label>
                    <input type="date" id="deadline" v-model="newTaskDeadline" name="deadline-task" min="2024-01-01" max="2025-12-31" required />
                    <button type="submit">Создать</button>
                </form>
            </div>
        </div>
    `,
    methods: {
        moveTask(task, destination) {
            this.$emit('task-moved', task, destination);
        },
        addTask() {
            const newTask = {
                id: Math.random().toString(36).substring(7),
                title: this.newTaskName,
                description: this.newTaskDescription,
                deadline: this.newTaskDeadline,
                createdDate: new Date().toLocaleDateString()
            };
            this.$emit('task-added', newTask);
            this.newTaskName = '';
            this.newTaskDescription = '';
            this.newTaskDeadline = '';
        }
    }
});

Vue.component('card', {
    props: ['task'],
    template: `
        <div class="task">
            <span>Создано: {{ task.createdDate }}</span>
            <h3>{{ task.title }}</h3>
            <p>{{ task.description }}</p>
            <span>Срок сдачи: {{ task.deadline }}</span><br><br>
            <button v-on:click="editTask">Редактировать</button>
            <button v-on:click="moveToWork">Переместить в работу</button>
            <!-- Add more buttons for moving to testing, completing, etc. -->
        </div>
    `,
    methods: {
        editTask() {

        },
        moveToWork() {
            this.$emit('move', this.task, 'work');
        }
    }
});

new Vue({
    el: '#app'
});
