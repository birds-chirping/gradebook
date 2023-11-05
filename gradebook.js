import { Popup } from "./popup.js";
import { Table } from "./table.js";
import { Utils } from "./utils.js";

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
    this.gradebookContainer = Utils.createElement("div", "gradebook");
    this.gradebookContainer.append(this.createHeader(), this.createTable());
    this.parentContainer.appendChild(this.gradebookContainer);
    this.addPopup();
    this.addEvents();
  }

  createHeader() {
    const header = Utils.createElement("div", "gradebook-header");
    const title = Utils.createElement("div", "gradebook-title");
    title.textContent = "Gradebook";
    const newStudentArea = this.createHeaderInputArea();
    header.append(title, newStudentArea);
    return header;
  }

  createHeaderInputArea() {
    const inputArea = Utils.createElement("div", "new-student-wrapper");

    this.newStudentInput = Utils.createElement("input", "new-student-input");
    this.newStudentInput.placeholder = "Add new student";
    this.newStudentInput.type = "text";

    this.newBtn = Utils.createElement("button", "new-student-btn");
    this.newBtn.textContent = "New student";
    this.newBtn.disabled = true;

    inputArea.append(this.newStudentInput, this.newBtn);
    return inputArea;
  }

  createTable() {
    this.gradebookTable = new Table(
      [["Name", "name sortable"], ["Average", "average-grade sortable"], ["Grades"], ["Delete"]],
      "students-table"
    );
    const tableWrapper = Utils.createElement("div", "students-table-wrapper");
    tableWrapper.append(this.gradebookTable.table);
    return tableWrapper;
  }

  addPopup() {
    this.popup = new Popup();
    this.gradebookContainer.append(this.popup.overlayBackground, this.popup.frame);
  }

  //----------------------students table---------------------
  displayStudents(students) {
    this.gradebookTable.removeAllRows();
    students.forEach((student) => this.addStudentToTable(student));
  }

  addStudentToTable(student) {
    const averageGrade = Utils.createElement("div");
    averageGrade.textContent = student.averageGrade != 0 ? student.averageGrade : "-";
    averageGrade.id = `average_${student.id}`;

    const editBtn = Utils.createElement("button", "edit-btn");
    editBtn.setAttribute("data-id", `${student.id}`);
    editBtn.innerHTML = '<i class="fa-regular fa-eye"></i> / <i class="fa-solid fa-user-pen"></i>';

    const deleteBtn = Utils.createElement("button", "delete-btn", "student");
    deleteBtn.setAttribute("data-id", `${student.id}`);
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    this.gradebookTable.addRow(student.id, [student.name, averageGrade, editBtn, deleteBtn]);
  }

  removeStudentFromTable(id) {
    this.gradebookTable.removeRow(id);
  }

  updateGradebookAverageGrade(studentID, averageGrade) {
    const cellToEdit = document.getElementById(`average_${studentID}`);
    cellToEdit.textContent = averageGrade != 0 ? averageGrade : "-";
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

  updatePopupAverageGrade(averageGrade) {
    this.popup.showAverageGrade(averageGrade != 0 ? averageGrade : "-");
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
        this.popup.frame.tabIndex = "0";
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
        this.displayStudents(this.getStudentsSortedByNameHandler(Table.setSortType(e.target)));
        Table.resetArrows(Utils.getElement(".average-grade"));
        break;
      case e.target.classList.contains("average-grade") && e.target.classList.contains("sortable"):
        this.displayStudents(this.getStudentsSortedByGradeHandler(Table.setSortType(e.target)));
        Table.resetArrows(Utils.getElement(".name"));
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
    this.getStudentsSortedByNameHandler = handler;
  }
  bindGetStudentsSortedByGrade(handler) {
    this.getStudentsSortedByGradeHandler = handler;
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
