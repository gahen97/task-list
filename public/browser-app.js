const tasksDOM = document.querySelector('.tasks')
const formDOM = document.querySelector('.task-form')
const tasksContainerDOM = document.querySelector('.tasks-container')
const taskInputNameDOM = document.querySelector('.task-input-name')
const taskInputDescDOM = document.querySelector('.task-input-desc')
const taskInputDateDOM = document.querySelector('.task-input-date')
const formAlertDOM = document.querySelector('.form-alert')
// Load tasks from /api/tasks
const showTasks = async () => {
  try {
    const { data: { tasks } } = await axios.get('/api/v1/tasks')
    if (tasks.length < 1) {
      formDOM.classList.remove("task-form-left");
      tasksContainerDOM.classList.remove("tasks-container-right");
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>'
      return
    }
    formDOM.classList.add("task-form-left");
    tasksContainerDOM.classList.add("tasks-container-right");
    const allTasks = tasks.map((task) => {
      const { completed, _id: taskID, name, duedate } = task
      const today = new Date()
      const taskDate = new Date(duedate)
      const diffDate = Math.floor((taskDate - today) / (1000 * 60 * 60 * 24)) + 1;
      return `<div class="single-task ${completed && 'task-completed'}
              ${(diffDate < 0) && 'task-overdue'} ${(diffDate == 0) && 'task-duetoday'}
              ${((diffDate > 0) && (diffDate < 4)) && 'task-dueinthreedays'}">
              
                <h5>${name}</h5>
                <p>Due Date: ${taskDate.toLocaleDateString()}</p>
                <div class="task-links">

                  <!-- check link -->
                  <button type="button" class="check-btn" data-id="${taskID}">
                    <i class="fas fa-solid fa-check"></i>
                  </button>

                  <!-- edit link -->
                  <a href="task.html?id=${taskID}" class="edit-link">
                    <i class="fas fa-edit"></i>
                  </a>

                  <!-- delete btn -->
                  <button type="button" class="delete-btn" data-id="${taskID}">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>`
    })
      .join('')
    tasksDOM.innerHTML = allTasks
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
}

showTasks()

// delete task /api/tasks/:id

tasksDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    const id = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/tasks/${id}`)
      showTasks()
    } catch (error) {
      console.log(error)
    }
  }
  else if (el.parentElement.classList.contains('check-btn')) {
    const id = el.parentElement.dataset.id
    const taskCompleted = !el.parentElement.parentElement.parentElement.classList.contains('task-completed')
    try {
      await axios.patch(`/api/v1/tasks/${id}`, { completed: taskCompleted })
      showTasks()
    } catch (error) {
      console.log(error)
    }
  }
})

// form

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = taskInputNameDOM.value
  const description = taskInputDescDOM.value
  const duedate = new Date(taskInputDateDOM.value + "T00:00:00").toISOString()

  console.log(`Hello 1: ${name}`);
  console.log(`Hello : ${duedate}`);
  try {
    await axios.post('/api/v1/tasks', { name, description, duedate })
    showTasks()
    taskInputNameDOM.value = ''
    taskInputDescDOM.value = ''
    taskInputDateDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, task added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})

