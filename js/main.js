new Vue({
    el: '#app',

    data() {
        return {
            taskName: '',
            planTask: [],
            workTask: [],
            testingTask: [],
            completedTask: [],
            description: '',
            deadline: '',
            reason: '',
            dateCompleted: Date.now(),
            check: true,
        };
    },
    methods: {

        addTask() {
            if (this.taskName !== '') {
                const newTask = {
                    title: this.taskName,
                    description: this.description,
                    deadline: this.deadline,
                    reason: this.reason
                };
                if (this.taskName !== '') {
                    newTask.createdDate = new Date().toLocaleDateString();
                    this.planTask.push(newTask);
                } else alert("Введите название задачи")

                this.taskName = '';
                this.description = '';
                this.deadline = '';

            }
        },
        removeTask(task, type){
            this.planTask.splice(this.planTask.indexOf(task), 1)

        },
        // updateTask(task){
        //
        // },

        moveFromPlanTask(task){
            this.planTask.splice(this.planTask.indexOf(task), 1)
            this.workTask.push(task)
        },
        moveFromWorkTask(task){
            this.workTask.splice(this.workTask.indexOf(task), 1)
            this.testingTask.push(task)
        },
        moveFromTestingTask(task){
            this.reason=''
            this.testingTask.splice(this.testingTask.indexOf(task), 1)
            this.completedTask.push(task)
            if(this.deadline>=this.dateCompleted){
                this.check=true;
            }
            else{
                this.check=false;
            }
        },
        moveFromTestingTaskBack(task){
            this.testingTask.splice(this.testingTask.indexOf(task), 1)
            this.workTask.push(task)

        }
    },
    computed: {
        checked(){
            return this.check
        }
    }


});