$(document).ready(function () {
    const taskList = document.getElementById("tasksList");
    const taskNameInput = document.getElementById("taskName");
    const tasks = [];
    const descAnimTime = 250;
    const inputDelayTime = 200;

    var selectedTaskElem = null;
    var canClick = true;
    var clickTimeout;

    // Class(es)
    class Task {
        constructor(elem, desc) {
            if (typeof desc !== 'string') {
                throw new Error("Task description must be a string.");
            } else if ($(elem).get(0).tagName !== "LI") {
                throw new Error("Task element must be an <li>.");
            }
            this.desc = desc;
        }
    }

    // Event Listeners
    $("#addTaskBtn").on("click", addNewTask);
    $("#hideDescBtn").on("click", hideDesc);
    $("#deleteBtn").on("click", removeSelectedTask);

    $('#taskDesc').find('form').find('textarea').on("input", function () {
        tasks[$(selectedTaskElem).index()].desc = $('#taskDesc').find('form').find('textarea').val();
    });

    $("#taskDesc").hide()

    // Functions
    function isTaskNameInputEmpty() {
        return taskNameInput.value.trim() === "";
    }

    function addNewTask() {
        if (!isTaskNameInputEmpty()) {
            const li = document.createElement("li");

            li.textContent = taskNameInput.value;

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

            taskList.appendChild(li);
            tasks.push(new Task(li, ""));
        }
    }

    function hideDesc() {
        $('#taskDesc').hide(descAnimTime);
    }

    function removeSelectedTask() {
        if (selectedTaskElem !== null) {
            const _selectedTaskElem = selectedTaskElem;
            hideDesc();
            tasks.splice($(_selectedTaskElem).index(), 1);
            _selectedTaskElem.remove();
        }   
    }

    function highlightTask(elem) {
        if (elem !== null) { elem.style.color = "blue"; }
    }

    function resetTaskTextColor(elem) {
        if (elem !== null) { elem.style.color = "black"; }
    }

    function updateDescText() {
        $('#taskDesc').find('form').find('textarea').val(tasks[$(selectedTaskElem).index()].desc);
    }

    function showDesc() {
        updateDescText();
        $('#taskDesc').show(descAnimTime);
    }
     
    // Input Handler Functions
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

    function handleTaskDblClick(taskElem) {
        clearTimeout(clickTimeout);
        $(taskElem).attr('contenteditable', "true")
            .focus()
        $(taskElem).off('click');
    }

    function handleTaskFocusOut(taskElem) {
        $(taskElem).attr('contenteditable', "false")
        $(taskElem).on("click", function () {
            handleTaskClick(taskElem);
        });
    }
});
