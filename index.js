// Wait for the DOM to be ready before executing the code
$(document).ready(function () {
    // Get references to DOM elements and initialize variables
    const taskList = document.getElementById("tasksList");
    const taskNameInput = document.getElementById("taskName");
    const tasks = [];
    const descAnimTime = 250;
    const inputDelayTime = 200;

    var selectedTaskElem = null;
    var canClick = true;
    var clickTimeout;

    // Class definition for Task
    class Task {
        constructor(elem, desc) {
            // Validate input parameters
            if (typeof desc !== 'string') {
                throw new Error("Task description must be a string.");
            } else if ($(elem).get(0).tagName !== "LI") {
                throw new Error("Task element must be an <li>.");
            }
            this.desc = desc;
        }
    }

    // Event Listeners setup
    $("#addTaskBtn").on("click", addNewTask);
    $("#hideDescBtn").on("click", hideDesc);
    $("#deleteBtn").on("click", removeSelectedTask);

    // Event listener for input changes in the task description textarea
    $('#taskDesc').find('form').find('textarea').on("input", function () {
        tasks[$(selectedTaskElem).index()].desc = $('#taskDesc').find('form').find('textarea').val();
    });

    // Hide the task description initially
    $("#taskDesc").hide();

    // Function to check if the task name input is empty
    function isTaskNameInputEmpty() {
        return taskNameInput.value.trim() === "";
    }

    // Function to add a new task to the list
    function addNewTask() {
        if (!isTaskNameInputEmpty()) {
            const li = document.createElement("li");

            // Set the text content of the new task
            li.textContent = taskNameInput.value;

            // Add event listeners for mouse interactions on the new task
            $(li).on("mouseenter", function () {
                highlightTask(li);
            });
            $(li).on("mouseleave", function () {
                if (li != selectedTaskElem) {
                    resetTaskTextColor(li);
                }
            });
            $(li).on("click", function () {
                handleTaskClick(li);
            });
            $(li).dblclick(function () {
                handleTaskDblClick(li);
            });
            $(li).on("focusout", function () {
                handleTaskFocusOut(li);
            });

            // Append the new task to the task list
            taskList.appendChild(li);

            // Create a new Task object and add it to the tasks array
            tasks.push(new Task(li, ""));
        }
    }

    // Function to hide the task description
    function hideDesc() {
        $('#taskDesc').hide(descAnimTime);
    }

    // Function to remove the selected task
    function removeSelectedTask() {
        if (selectedTaskElem !== null) {
            const _selectedTaskElem = selectedTaskElem;
            hideDesc();
            tasks.splice($(_selectedTaskElem).index(), 1);
            _selectedTaskElem.remove();
        }   
    }

    // Function to highlight the task text
    function highlightTask(elem) {
        if (elem !== null) { elem.style.color = "blue"; }
    }

    // Function to reset the task text color
    function resetTaskTextColor(elem) {
        if (elem !== null) { elem.style.color = "black"; }
    }

    // Function to update the task description text
    function updateDescText() {
        $('#taskDesc').find('form').find('textarea').val(tasks[$(selectedTaskElem).index()].desc);
    }

    // Function to show the task description
    function showDesc() {
        updateDescText();
        $('#taskDesc').show(descAnimTime);
    }
     
    // Input Handler Functions
    // Function to handle a single click on a task
    function handleTaskClick(taskElem) {
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(function () {
            if (canClick) {
                if (selectedTaskElem !== taskElem) {
                    if (selectedTaskElem !== null) { resetTaskTextColor(selectedTaskElem); }                 
                    highlightTask(taskElem);
                    selectedTaskElem = taskElem;
                    showDesc();
                } else {
                    resetTaskTextColor(selectedTaskElem);
                    selectedTaskElem = null;
                    hideDesc();
                }
                canClick = false;
                $('#taskDesc').promise().done(function () {
                    canClick = true;
                });
            }
        }, inputDelayTime);
    }

    // Function to handle a double click on a task
    function handleTaskDblClick(taskElem) {
        clearTimeout(clickTimeout);
        $(taskElem).attr('contenteditable', "true")
            .focus()
        $(taskElem).off('click');
    }

    // Function to handle focus out event on a task
    function handleTaskFocusOut(taskElem) {
        $(taskElem).attr('contenteditable', "false")
        $(taskElem).on("click", function () {
            handleTaskClick(taskElem);
        });
    }
});