const taskIDDOM = document.querySelector('.task-edit-id')
const taskNameDOM = document.querySelector('.task-edit-name')
const taskDescDOM = document.querySelector('.task-edit-desc')
const taskDateDOM = document.querySelector('.task-edit-date')
const taskCompletedDOM = document.querySelector('.task-edit-completed')
const editFormDOM = document.querySelector('.single-task-form')
const editBtnDOM = document.querySelector('.task-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const params = window.location.search
const id = new URLSearchParams(params).get('id')
let tempName

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/tasks/${id}`)
    const { _id: taskID, completed, name, description, duedate } = task

    taskIDDOM.textContent = taskID
    taskNameDOM.value = name
    taskDescDOM.value = description
    taskDateDOM.value = formatDateToYYYYMMDD(duedate)
    tempName = name
    if (completed) {
      taskCompletedDOM.checked = true
    }
  } catch (error) {
    console.log(error)
  }
}

showTask()

editFormDOM.addEventListener('submit', async (e) => {
  editBtnDOM.textContent = 'Loading...'
  e.preventDefault()
  try {
    const taskName = taskNameDOM.value
    const taskDesc = taskDescDOM.value
    const taskDate = taskDateDOM.value
    const taskCompleted = taskCompletedDOM.checked

    const {
      data: { task },
    } = await axios.patch(`/api/v1/tasks/${id}`, {
      name: taskName,
      description: taskDesc,
      duedate: taskDate,
      completed: taskCompleted,
    })

    const { _id: taskID, completed, name, description } = task

    taskIDDOM.textContent = taskID
    taskNameDOM.value = name
    taskDescDOM.value = description
    taskDateDOM.value = duedate
    tempName = name
    if (completed) {
      taskCompletedDOM.checked = true
    }
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, edited task`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    console.error(error)
    taskNameDOM.value = tempName
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  editBtnDOM.textContent = 'Edit'
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})

function formatDateToYYYYMMDD(date) {
  const duedate = new Date(date)
  const year = duedate.getFullYear();
  const month = (duedate.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero for month
  const day = duedate.getDate().toString().padStart(2, '0'); // Add leading zero for day
  return `${year}-${month}-${day}`;
}