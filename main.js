showCurrentNotes();

let taskElement = document.getElementById("task");
let dateElement = document.getElementById("date");
let timeElement = document.getElementById("time");

function onCreateNoteClicked() {
    let task = taskElement.value;
    let date = dateElement.value;
    let time = timeElement.value;
    let notesContainer = document.getElementById("notesContainer");

    try {
        validateInput(task, date, time);
        date = reverseDate(date);

        notesArray = saveNotesToStorage(task, date, time);
        addNoteCard(notesContainer, notesArray, notesArray.length -1);

        onClearInputClicked();

    } catch (err) {
        let errorMessage = document.getElementById("paragraghError");
        errorMessage.innerHTML = err.message;
    }
}


function saveNotesToStorage(task, date, time) {
    let strNotesCounter = localStorage.getItem("notesCounter");
    let notesCounter;
    if(!strNotesCounter) {
        notesCounter = 0;
    }
    else {
        notesCounter = JSON.parse(strNotesCounter);
    }

    let noteObject = {
        id: notesCounter++,
        task: task,
        date: date,
        time: time    
    }
    localStorage.setItem("notesCounter", JSON.stringify(notesCounter));

    let strNotesArray = localStorage.getItem("notesArray");
    let notesArray;
    if(!strNotesArray) {
        notesArray = [];
    }
    else {
        notesArray = JSON.parse(strNotesArray);
    }
    notesArray.push(noteObject);
    localStorage.setItem("notesArray", JSON.stringify(notesArray));
    return notesArray;
}


function showCurrentNotes() {
    let strNotesArray = localStorage.getItem("notesArray");
    if(!strNotesArray) {
        return;
    }
    let notesArray = JSON.parse(strNotesArray);

    let notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = "";

    for (let index=0; index<notesArray.length; index++) {
        addNoteCard(notesContainer, notesArray, index);
    }
}


function addNoteCard(notesContainer, notesArray, index) {
    let noteCard = document.createElement("div");
    createNote(noteCard, notesArray, index);
    createTaskDiv(noteCard, notesArray, index);
    createDateDiv(noteCard, notesArray, index);
    createTimeDiv(noteCard, notesArray, index);
    createDeleteButton(noteCard);
    notesContainer.append(noteCard);
}


function createNote(noteCard, notesArray, index) {
    noteCard.setAttribute("class", "noteCard")
    noteCard.setAttribute("id", notesArray[index].id)
}


function createTaskDiv(noteCard, notesArray, index) {
    let taskDiv = document.createElement("span");
    taskDiv.setAttribute("class", "noteTask");
    taskDiv.append(notesArray[index].task);
    noteCard.append(taskDiv);
}


function createDateDiv(noteCard, notesArray, index) {
    let dateDiv = document.createElement("span");
    dateDiv.setAttribute("class", "noteDate");
    dateDiv.append(notesArray[index].date);
    noteCard.append(dateDiv);
}


function createTimeDiv(noteCard, notesArray, index) {
    let timeDiv = document.createElement("span");
    timeDiv.setAttribute("class", "noteTime");
    timeDiv.append(notesArray[index].time);
    noteCard.append(timeDiv);
}


function createDeleteButton(noteCard) {
    let deleteButton = document.createElement("span");
    deleteButton.setAttribute("class", "glyphicon glyphicon-remove");
    noteCard.append(deleteButton);
    deleteButton.addEventListener("click", function(event) {
        removeNote(noteCard, event);
    });
}


function removeNote(noteObject, event) {
    let notesArray = JSON.parse(localStorage.getItem("notesArray"));
    let noteToRemove = event.target.parentElement;
    removeFadeOut(noteToRemove, 500);
    removeNoteFromStorage(noteObject, notesArray);

}


function removeNoteFromStorage(noteObject, notesArray) {
    for (let i=0; i<notesArray.length; i++) {
        if (notesArray[i].id==noteObject.id) {
            notesArray.splice(i, 1);
        }
    }
    localStorage.setItem("notesArray", JSON.stringify(notesArray));
}


function removeFadeOut(element, speed) {
    let seconds = speed / 1000;
    element.style.transition = "opacity " + seconds + "s ease";
    element.style.transition = 0;
    setTimeout(function () {
        element.parentNode.removeChild(element)
    }, speed);
}


function onClearInputClicked(){
    resetFields();

    taskElement.value = "";
    dateElement.value = "";
    timeElement.value = "";
}


function resetFields() {
    taskElement.style.border = "";
    dateElement.style.border = "";
    timeElement.style.border = "";

    cleanErrorMessage();
}


function cleanErrorMessage() {
    let errorMessage = document.getElementById("paragraghError");
    errorMessage.innerHTML = "";
}


function showError(element) {
    element.style.border = "2px solid red";
}


function validateInput(task, date, time) {
    resetFields();
    let message = "";

    if (task.trim()==""){
        message = "Oops. Your task field is empty.<br>";
        showError(taskElement);
    }
    else if(task.length>250){
        message = "Your task is too long, maximum 250 characters.<br>";
        showError(taskElement);
    }

    if (isEmptyField(date)) {
        message = message + "Oops. Your date field is empty.<br>";
        showError(dateElement);
    } 
    else if (!isValidDate(date,time)){
        message = message + "You entered past date, you need to chose future date.<br>";
        showError(dateElement);
    }

    if (isEmptyField(time)) {
        message = message + "Oops. Your time field is empty.<br>";
        showError(timeElement);
    }

    if (message != "") {
        throw new Error(message);
    }
}


function isEmptyField(id) {
    if (id == "" || id == null) {
        return true;
    }
    return false;
}


function isValidDate(date,time){
    let currentDate = new Date().setHours(0, 0, 0, 0);
    let currentTime = new Date().toLocaleTimeString('en-Gb');
    let selectedDate = new Date(date).setHours(0, 0, 0, 0);
    if (selectedDate<currentDate){
        return false;
    }
    if (selectedDate==currentDate && time<currentTime){
        return false;
    }
    return true;
}


function reverseDate(date) {
    date = date.split("-");
    let reversedDate = date[2]+"/"+date[1]+"/"+date[0]; 
    return reversedDate;
}
