class GradebookInterface {
  constructor(parentContainer) {
    this.parentContainer = parentContainer;
    this.gradebookContainer;
    this.gradebookTable;
    this.newStudentInput;
    this.newBtn;
    this.popupBackground;
    this.gradesPopup;
    this.shownStudent;
    this.init();
  }

  init() {
    this.gradebookContainer = this._createElement("div", "gradebook");
    this.gradebookTable = this.createTable(["Name", "Average", "Grades", "Delete students"], "students-table");
    this.gradebookContainer.append(this.createHeader(), this.gradebookTable);
    this.addPopup();
    this.addEvents();
    this.parentContainer.appendChild(this.gradebookContainer);
  }

  _createElement(tag, ...className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(...className);
    return element;
  }

  _getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }

  //--------------------------gradeboook interface---------------------------

  createHeader() {
    const header = this._createElement("div", "gradebook-header");
    const title = this._createElement("div", "gradebook-title");
    title.textContent = "Gradebook";

    const newStudentWrapper = this.createHeaderInputArea();

    header.append(title, newStudentWrapper);
    return header;
  }

  createHeaderInputArea() {
    const inputArea = this._createElement("div", "new-student-wrapper");

    this.newStudentInput = this._createElement("input", "new-student-input");
    this.newStudentInput.placeholder = "Add new student";
    this.newStudentInput.type = "text";

    this.newBtn = this._createElement("button", "new-student-btn");
    this.newBtn.textContent = "New student";
    this.newBtn.disabled = true;

    inputArea.append(this.newStudentInput, this.newBtn);
    return inputArea;
  }

  createTable(headerData, tableClass) {
    const table = this._createElement("table", tableClass);
    const tHead = table.createTHead();
    const row = tHead.insertRow(0);
    for (let i = 0; i < headerData.length; i++) {
      row.insertCell(i).outerHTML = `<th>${headerData[i]}</th>`;
    }
    table.createTBody();
    return table;
  }

  addPopup() {
    this.popupBackground = this._createElement("div", "popup-background", "hide");
    this.gradesPopup = this._createElement("div", "grades-popup", "hide");
    this.gradebookContainer.append(this.popupBackground, this.gradesPopup);
    this.addPopupStructure();
  }

  addPopupStructure() {
    //buton close:
    this.popupCloseBtn = this._createElement("button", "close-popup-btn");
    this.popupCloseBtn.textContent = "Close";
    //name
    const popupNameArea = this._createElement("div", "popup-name-area");
    const popupNameLabel = this._createElement("h2", "popup-name-label");
    popupNameLabel.textContent = "Student: ";
    this.popupNameField = this._createElement("div", "popup-name-field");
    popupNameArea.append(popupNameLabel, this.popupNameField);
    //input area
    const inputArea = this._createElement("div", "grades-input-wrapper");
    this.newGradeInput = this._createElement("input", "new-grade-input");
    this.newGradeInput.placeholder = "Grade";
    this.newGradeInput.type = "number";
    this.newGradeBtn = this._createElement("button", "new-grade-btn");
    this.newGradeBtn.textContent = "Add grade";
    this.newGradeBtn.disabled = true;
    inputArea.append(this.newGradeInput, this.newGradeBtn);
    //grades table
    this.studentGradesTable = this.createTable(["Grades", "Delete"], "student-grades-table");

    this.gradesPopup.append(this.popupCloseBtn, popupNameArea, inputArea, this.studentGradesTable);
  }

  //----------------------students table---------------------
  displayStudents(students) {
    students.forEach((student) => this.addStudentRow(student));
  }
  addStudentRow(student) {
    const row = this.gradebookTable.tBodies[0].insertRow(-1);
    row.setAttribute("data-id", `${student.id}`);

    row.insertCell(0).textContent = student.name;
    const averageCell = row.insertCell(1);
    averageCell.textContent = student.averageGrade;
    averageCell.id = `average_${student.id}`;

    const editBtn = this._createElement("button", "edit-btn");
    editBtn.setAttribute("data-id", `${student.id}`);
    editBtn.innerHTML = '<i class="fa-regular fa-eye"></i> / <i class="fa-solid fa-user-pen"></i>';
    row.insertCell(2).appendChild(editBtn);
    const deleteBtn = this._createElement("button", "delete-btn", "student");
    deleteBtn.setAttribute("data-id", `${student.id}`);
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    row.insertCell(3).appendChild(deleteBtn);
  }

  removeStudentRow(id) {
    this._getElement(`tr[data-id="${id}"]`).remove();
  }

  clearStudentInput() {
    this.newStudentInput.value = "";
    this.newBtn.disabled = true;
  }

  //-------------------------popup table-------------------------
  addGradesToTable(grades) {
    grades.forEach((grade) => this.addGradesRow(grade.value, grade.id));
  }

  addGradesRow(grade, id) {
    const row = this.studentGradesTable.tBodies[0].insertRow(-1);
    row.id = `grade_${id}`;
    row.insertCell(0).textContent = grade;
    const deleteBtn = this._createElement("button", "delete-btn", "grade");
    deleteBtn.id = `delButton_${id}`;
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    row.insertCell(1).appendChild(deleteBtn);
  }

  updateAverageGrade(studentID, averageGrade) {
    const cellToEdit = document.getElementById(`average_${studentID}`);
    cellToEdit.textContent = averageGrade;
  }

  removeGradeRow(id) {
    console.log(document.getElementById(`grade_${id}`));
    document.getElementById(`grade_${id}`).remove();
  }

  //-----------------------popup--------------------------
  fillPopup(student) {
    this.popupNameField.textContent = student.name;
    this.addGradesToTable(student.grades);
  }

  clearPopupData() {
    this.popupNameField.textContent = "";
    this.studentGradesTable.tBodies[0].innerHTML = "";
    this.clearGradesInput();
  }

  clearGradesInput() {
    this.newGradeInput.value = "";
    this.newGradeBtn.disabled = true;
  }

  popupToggle() {
    this.popupBackground.classList.toggle("hide");
    this.gradesPopup.classList.toggle("hide");
  }

  //------------------------events-----------------------
  addEvents() {
    this.newStudentInput.addEventListener("input", this.onType.bind(this, this.newBtn, this.newStudentInput));
    this.newGradeInput.addEventListener("input", this.onType.bind(this, this.newGradeBtn, this.newGradeInput));
    window.addEventListener("click", this.onClick.bind(this));

    this.gradebookContainer.addEventListener("keyup", (e) => {
      if (e.key === "Escape" && !this.popupBackground.classList.contains("hide")) {
        this.popupToggle();
      } else if (
        e.key === "Enter" &&
        !this.popupBackground.classList.contains("hide") &&
        this.newGradeInput.value.trim()
      ) {
        this.onNewGradeButtonClick();
      } else if (e.key === "Enter" && this.newStudentInput.value !== 0) {
        this.onNewButtonClick();
      }
    });
  }

  onType(button, input) {
    button.disabled = input.value.trim().length === 0;
  }

  onClick(e) {
    switch (true) {
      case e.target.classList.contains("new-student-btn"):
        this.onNewButtonClick();
        break;
      case e.target.classList.contains("delete-btn"):
        if (e.target.classList.contains("student")) this.removeStudentHandler(e.target.getAttribute("data-id"));
        else if (e.target.classList.contains("grade"))
          this.removeGradeHandler(this.shownStudent, e.target.id.split("_")[1]);
        break;
      case e.target.classList.contains("edit-btn"):
        this.popupToggle();
        this.shownStudent = e.target.getAttribute("data-id");
        this.fillPopup(this.getStudent(this.shownStudent));
        break;
      case e.target.classList.contains("popup-background") || e.target.classList.contains("close-popup-btn"):
        this.clearPopupData();
        this.popupToggle();
        break;
      case e.target.classList.contains("new-grade-btn"):
        this.onNewGradeButtonClick();
        break;
    }
  }

  onNewButtonClick() {
    this.addStudentHandler(this.newStudentInput.value);
    this.clearStudentInput();
  }

  onNewGradeButtonClick() {
    this.addGradeHandler(this.shownStudent, this.newGradeInput.value);
    this.clearGradesInput();
  }

  bindAddStudent(handler) {
    this.addStudentHandler = handler;
  }

  bindRemoveStudent(handler) {
    this.removeStudentHandler = handler;
  }

  bindGetStudent(handler) {
    this.getStudent = handler;
  }

  bindAddGrade(handler) {
    this.addGradeHandler = handler;
  }

  bindRemoveGrade(handler) {
    this.removeGradeHandler = handler;
  }
}

export { GradebookInterface };
