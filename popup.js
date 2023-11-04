import { Utils, Table } from "./utils.js";

export class Popup {
  popupCloseBtn;
  studentNameField;
  averageGradeField;
  newGradeInput;
  newGradeBtn;
  gradesTable;

  constructor() {
    this.overlay = Utils.createElement("div", "popup-overlay", "hide");
    this.frame = Utils.createElement("div", "popup-frame", "hide");
    this.addPopupElements();
  }

  addPopupElements() {
    this.addCloseButton();
    this.addStudentInfo();
    this.addInput();
    this.addGradesTable();
  }

  addCloseButton() {
    this.popupCloseBtn = Utils.createElement("button", "close-popup-btn");
    this.popupCloseBtn.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
    this.frame.appendChild(this.popupCloseBtn);
  }

  addStudentInfo() {
    const studentNameArea = Utils.createElement("div", "popup-name-area");
    const nameLabel = Utils.createElement("div", "popup-name-label");
    nameLabel.textContent = "Student: ";
    this.studentNameField = Utils.createElement("div", "popup-name-field");
    studentNameArea.append(nameLabel, this.studentNameField);

    const averageGradeArea = Utils.createElement("div", "popup-average-grade-area");
    const averageGradeLabel = Utils.createElement("div", "popup-average-grade-label");
    averageGradeLabel.textContent = "Average grade: ";
    this.averageGradeField = Utils.createElement("div", "popup-average-grade-field");
    averageGradeArea.append(averageGradeLabel, this.averageGradeField);
    this.frame.append(studentNameArea, averageGradeArea);
  }

  addInput() {
    const inputArea = Utils.createElement("div", "newgrade-input-wrapper");
    this.newGradeInput = Utils.createElement("input", "new-grade-input");
    this.newGradeInput.placeholder = "Grade";
    this.newGradeInput.type = "number";
    this.newGradeInput.min = "1";
    this.newGradeInput.max = "10";
    this.newGradeInput.step = ".01";

    this.newGradeBtn = Utils.createElement("button", "new-grade-btn");
    this.newGradeBtn.textContent = "Add grade";
    this.newGradeBtn.disabled = true;
    inputArea.append(this.newGradeInput, this.newGradeBtn);
    this.frame.appendChild(inputArea);
  }

  addGradesTable() {
    this.gradesTable = new Table([["Grades", "grades sortable"], ["Delete"]], "student-grades-table");
    const tableWrapper = Utils.createElement("div", "grades-table-wrapper");
    tableWrapper.appendChild(this.gradesTable.table);
    this.frame.appendChild(tableWrapper);
  }

  showStudentName(name) {
    this.studentNameField.textContent = name;
  }
  showAverageGrade(grade) {
    this.averageGradeField.textContent = grade;
  }

  addGradesToTable(grades) {
    grades.forEach((grade) => this.addGradeToTable(grade.value, grade.id));
  }

  addGradeToTable(grade, id) {
    const deleteBtn = Utils.createElement("button", "delete-btn", "grade");
    deleteBtn.id = `delButton_${id}`;
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    this.gradesTable.addRow(`grade_${id}`, [grade, deleteBtn]);
  }

  removeGradeFromTable(id) {
    this.gradesTable.removeRow(`grade_${id}`);
  }

  clearPopupData() {
    Utils.getElement(".grades").classList = "grades sortable";
    this.studentNameField.textContent = "";
    this.gradesTable.removeAllRows();
    this.clearGradesInput();
  }

  clearGradesInput() {
    this.newGradeInput.value = "";
    this.newGradeBtn.disabled = true;
  }

  popupToggle() {
    this.overlay.classList.toggle("hide");
    this.frame.classList.toggle("hide");
  }
}
