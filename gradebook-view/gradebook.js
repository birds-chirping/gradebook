import { GradesPopup } from "./grades-popup.js";
import { Table } from "../components/table.js";
import { Elements } from "../utils/elements.js";
import { AlertPopup } from "./alert-popup.js";

class GradebookView {
  parentContainer;
  gradebookContainer;
  gradebookTable;
  newStudentInput;
  newBtn;
  shownStudent;
  gradesPopup;
  alertPopup;

  constructor(parentContainer) {
    this.parentContainer = parentContainer;
    this.init();
  }

  init() {
    this.gradebookContainer = Elements.createElement("div", "gradebook");
    this.gradebookContainer.append(this.createHeader(), this.createTable());
    this.parentContainer.appendChild(this.gradebookContainer);
    this.addGradesPopup();
    this.addAlertPopup();
    this.addEvents();
  }

  createHeader() {
    const header = Elements.createElement("div", "gradebook-header");
    const title = Elements.createElement("div", "gradebook-title");
    title.textContent = "Gradebook";
    const newStudentArea = this.createHeaderInputArea();
    header.append(title, newStudentArea);
    return header;
  }

  createHeaderInputArea() {
    const inputArea = Elements.createElement("div", "new-student-wrapper");

    this.newStudentInput = Elements.createElement("input", "new-student-input");
    this.newStudentInput.placeholder = "Add new student";
    this.newStudentInput.type = "text";

    this.newBtn = Elements.createElement("button", "new-student-btn");
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
    const tableWrapper = Elements.createElement("div", "students-table-wrapper");
    tableWrapper.append(this.gradebookTable.table);
    return tableWrapper;
  }

  addGradesPopup() {
    this.gradesPopup = new GradesPopup("grades-popup");
    this.gradesPopup.addTo(this.gradebookContainer);
  }

  addAlertPopup() {
    this.alertPopup = new AlertPopup("alert-popup");
    this.alertPopup.addTo(this.gradebookContainer);
  }

  //----------------------students table---------------------
  displayStudents(students) {
    this.gradebookTable.removeAllRows();
    students.forEach((student) => this.addStudentToTable(student));
  }

  addStudentToTable(student) {
    const averageGrade = Elements.createElement("div");
    averageGrade.textContent = student.averageGrade != 0 ? student.averageGrade : "-";
    averageGrade.id = `average_${student.id}`;

    const editBtn = Elements.createElement("button", "edit-btn");
    editBtn.setAttribute("data-id", `${student.id}`);
    editBtn.innerHTML = '<i class="fa-regular fa-eye"></i> / <i class="fa-solid fa-user-pen"></i>';

    const deleteBtn = Elements.createElement("button", "delete-btn", "student");
    deleteBtn.setAttribute("data-id", `${student.id}`);
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    this.gradebookTable.addRow(student.id, student.name, averageGrade, editBtn, deleteBtn);
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
    this.gradesPopup.showStudentName(student.name);
    this.gradesPopup.showAverageGrade(student.averageGrade != 0 ? student.averageGrade : "-");
    this.gradesPopup.addGradesToTable(student.grades);
  }

  updatePopupAverageGrade(averageGrade) {
    this.gradesPopup.showAverageGrade(averageGrade != 0 ? averageGrade : "-");
  }

  addGradeToTable(grade, id) {
    this.gradesPopup.addGradeToTable(grade, id);
  }
  removeGradeFromTable(id) {
    this.gradesPopup.removeGradeFromTable(id);
  }

  //------------------------events-----------------------
  addEvents() {
    this.newStudentInput.addEventListener("input", this.onType.bind(this, this.newBtn, this.newStudentInput));
    this.gradesPopup.newGradeInput.addEventListener(
      "input",
      this.onType.bind(this, this.gradesPopup.newGradeBtn, this.gradesPopup.newGradeInput)
    );
    document.addEventListener("click", this.onClick.bind(this));
    this.gradebookContainer.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyUp(e) {
    if (e.key === "Enter" && this.gradesPopup.newGradeInput.value && this.gradesPopup.newGradeInput.validity.valid) {
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
        if (e.target.classList.contains("student")) {
          const student = this.getStudent(e.target.getAttribute("data-id"));
          this.alertPopup.alert(`Are you sure you want to remove ${student.name} from gradebook?`);
          this.alertPopup.bindAction(this.removeStudentHandler, student.id.toString());
        } else if (e.target.classList.contains("grade")) {
          const gradeID = e.target.id.split("_")[1];
          this.alertPopup.alert(`Are you sure you want to remove this grade?`);
          this.alertPopup.bindAction(this.removeGradeHandler, this.shownStudent, gradeID);
        }
        break;
      case e.target.classList.contains("edit-btn"):
        this.gradesPopup.popupToggle();
        this.gradesPopup.frame.tabIndex = "0";
        this.shownStudent = e.target.getAttribute("data-id");
        this.fillPopup(this.getStudent(this.shownStudent));
        break;
      case e.target.classList.contains("new-grade-btn"):
        this.onNewGradeButtonClick();
        break;
      case e.target.classList.contains("name") && e.target.classList.contains("sortable"):
        this.displayStudents(this.getStudentsSortedByNameHandler(Table.setSortType(e.target)));
        Table.resetArrows(Elements.getElement(".average-grade"));
        break;
      case e.target.classList.contains("average-grade") && e.target.classList.contains("sortable"):
        this.displayStudents(this.getStudentsSortedByGradeHandler(Table.setSortType(e.target)));
        Table.resetArrows(Elements.getElement(".name"));
        break;
      case e.target.classList.contains("grades") && e.target.classList.contains("sortable"):
        this.gradesPopup.clearTableData();
        this.gradesPopup.addGradesToTable(this.getSortedGrades(this.shownStudent, Table.setSortType(e.target)));
        break;
    }
  }

  onNewStudentBtnClick() {
    this.addStudentHandler(this.newStudentInput.value);
    this.clearStudentInput();
  }

  onNewGradeButtonClick() {
    this.addGradeHandler(this.shownStudent, this.gradesPopup.newGradeInput.value);
    this.gradesPopup.clearGradesInput();
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
