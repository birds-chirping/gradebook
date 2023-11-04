import { Popup } from "./popup.js";
import { Table } from "./Table.js";

class GradebookView {
  parentContainer;
  gradebookContainer;
  gradebookTable;
  newStudentInput;
  newBtn;
  shownStudent;
  popup;
  constructor(parentContainer) {
    this.parentContainer = parentContainer;
    this.init();
  }

  init() {
    this.gradebookContainer = this._createElement("div", "gradebook");
    this.gradebookTable = this.createTable(
      [["Name", "name sortable"], ["Average", "average-grade sortable"], ["Grades"], ["Delete"]],
      "students-table"
    );
    const tableWrapper = this._createElement("div", "students-table-wrapper");
    tableWrapper.append(this.gradebookTable);
    this.gradebookContainer.append(this.createHeader(), tableWrapper);
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
    return document.querySelector(selector);
  }

  //--------------------------gradeboook interface---------------------------

  createHeader() {
    const header = this._createElement("div", "gradebook-header");
    const title = this._createElement("div", "gradebook-title");
    title.textContent = "Gradebook";

    const newStudentArea = this.createHeaderInputArea();

    header.append(title, newStudentArea);
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
      const cell = row.insertCell(i);
      cell.outerHTML = `<th class="${headerData[i][1] || ""}">${headerData[i][0]}</th>`;
    }
    table.createTBody();
    return table;
  }

  addPopup() {
    this.popup = new Popup();
    this.gradebookContainer.append(this.popup.overlayBackground, this.popup.frame);
  }

  //----------------------students table---------------------
  displayStudents(students) {
    this.gradebookTable.tBodies[0].innerHTML = "";
    students.forEach((student) => this.addStudentRow(student));
  }

  addStudentRow(student) {
    const row = this.gradebookTable.tBodies[0].insertRow(-1);
    row.setAttribute("data-id", `${student.id}`);

    row.insertCell(0).textContent = student.name;
    const averageCell = row.insertCell(1);
    averageCell.textContent = student.averageGrade != 0 ? student.averageGrade : "-";
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

  //-----------------------popup--------------------------
  fillPopup(student) {
    this.popup.showStudentName(student.name);
    this.popup.showAverageGrade(student.averageGrade != 0 ? student.averageGrade : "-");
    this.popup.addGradesToTable(student.grades);
  }

  updateAverageGrade(studentID, averageGrade) {
    const grade = averageGrade != 0 ? averageGrade : "-";
    this.popup.showAverageGrade(grade);
    const cellToEdit = document.getElementById(`average_${studentID}`);
    cellToEdit.textContent = grade;
  }
  addGradeToTable(grade, id) {
    this.popup.addGradeToTable(grade, id);
  }
  removeGradeFromTable(id) {
    this.popup.removeGradeFromTable(id);
  }

  //------------------------events-----------------------
  addEvents() {
    this.newStudentInput.addEventListener("input", this.onType.bind(this, this.newBtn, this.newStudentInput));
    this.popup.newGradeInput.addEventListener(
      "input",
      this.onType.bind(this, this.popup.newGradeBtn, this.popup.newGradeInput)
    );
    document.addEventListener("click", this.onClick.bind(this));
    this.gradebookContainer.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyUp(e) {
    if (e.key === "Escape" && !this.popup.overlayBackground.classList.contains("hide")) {
      this.popup.clearPopupData();

      this.popup.popupToggle();
    } else if (e.key === "Enter" && this.popup.newGradeInput.value && this.popup.newGradeInput.validity.valid) {
      this.onNewGradeButtonClick();
    } else if (e.key === "Enter" && this.newStudentInput.value.trim().length !== 0) {
      this.onNewStudentBtnClick();
    }
  }

  onType(button, input) {
    button.disabled = input.value.trim().length === 0 || !input.validity.valid;
  }

  onClick(e) {
    switch (true) {
      case e.target.classList.contains("new-student-btn"):
        this.onNewStudentBtnClick();
        break;
      case e.target.classList.contains("delete-btn"):
        if (e.target.classList.contains("student")) this.removeStudentHandler(e.target.getAttribute("data-id"));
        else if (e.target.classList.contains("grade"))
          this.removeGradeHandler(this.shownStudent, e.target.id.split("_")[1]);
        break;
      case e.target.classList.contains("edit-btn"):
        this.popup.popupToggle();
        this.popup.frame.tabIndex = "0"; //bug fix
        this.shownStudent = e.target.getAttribute("data-id");
        this.fillPopup(this.getStudent(this.shownStudent));
        break;
      case e.target.classList.contains("popup-overlay-background") || e.target.classList.contains("close-popup-btn"):
        this.popup.clearPopupData();
        this.popup.popupToggle();
        break;
      case e.target.classList.contains("new-grade-btn"):
        this.onNewGradeButtonClick();
        break;
      case e.target.classList.contains("name") && e.target.classList.contains("sortable"):
        this.displayStudents(this.getStudentsSortedByName(Table.setSortType(e.target)));
        Table.resetArrows(this._getElement(".average-grade"));
        break;
      case e.target.classList.contains("average-grade") && e.target.classList.contains("sortable"):
        this.displayStudents(this.getStudentsSortedByGrade(Table.setSortType(e.target)));
        Table.resetArrows(this._getElement(".name"));
        break;
      case e.target.classList.contains("grades") && e.target.classList.contains("sortable"):
        this.popup.clearTableData();
        this.popup.addGradesToTable(this.getSortedGrades(this.shownStudent, Table.setSortType(e.target)));
        break;
    }
  }

  onNewStudentBtnClick() {
    this.addStudentHandler(this.newStudentInput.value);
    this.clearStudentInput();
  }

  onNewGradeButtonClick() {
    this.addGradeHandler(this.shownStudent, this.popup.newGradeInput.value);
    this.popup.clearGradesInput();
  }

  // ------------------------handlers------------------------

  bindAddStudent(handler) {
    this.addStudentHandler = handler;
  }
  bindRemoveStudent(handler) {
    this.removeStudentHandler = handler;
  }
  bindGetStudent(handler) {
    this.getStudent = handler;
  }
  bindGetStudentsSortedByName(handler) {
    this.getStudentsSortedByName = handler;
  }
  bindGetStudentsSortedByGrade(handler) {
    this.getStudentsSortedByGrade = handler;
  }
  bindGetSortedGrades(handler) {
    this.getSortedGrades = handler;
  }
  bindAddGrade(handler) {
    this.addGradeHandler = handler;
  }
  bindRemoveGrade(handler) {
    this.removeGradeHandler = handler;
  }
}

export { GradebookView };
