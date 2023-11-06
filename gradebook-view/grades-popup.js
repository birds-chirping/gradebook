import { Elements } from "../utils/utils.js";
import { Table } from "../components/table.js";
import { Popup } from "../components/popup.js";

export class GradesPopup extends Popup {
  studentNameField;
  averageGradeField;
  newGradeInput;
  newGradeBtn;
  gradesTable;

  constructor(...args) {
    super(...args);
    this.addPopupElements(this.addStudentName(), this.addStudentAverageGrade(), this.addInput(), this.addGradesTable());
  }

  addStudentName() {
    const studentNameArea = Elements.createElement("div", "popup-name-area");
    const nameLabel = Elements.createElement("div", "popup-name-label");
    nameLabel.textContent = "Student: ";
    this.studentNameField = Elements.createElement("div", "popup-name-field");
    studentNameArea.append(nameLabel, this.studentNameField);
    return studentNameArea;
  }

  addStudentAverageGrade() {
    const averageGradeArea = Elements.createElement("div", "popup-average-grade-area");
    const averageGradeLabel = Elements.createElement("div", "popup-average-grade-label");
    averageGradeLabel.textContent = "Average grade: ";
    this.averageGradeField = Elements.createElement("div", "popup-average-grade-field");
    averageGradeArea.append(averageGradeLabel, this.averageGradeField);
    return averageGradeArea;
  }

  addInput() {
    const inputArea = Elements.createElement("div", "newgrade-input-wrapper");
    this.newGradeInput = Elements.createElement("input", "new-grade-input");
    this.newGradeInput.placeholder = "Grade";
    this.newGradeInput.type = "number";
    this.newGradeInput.min = "1";
    this.newGradeInput.max = "10";
    this.newGradeInput.step = ".01";
    this.newGradeBtn = Elements.createElement("button", "new-grade-btn");
    this.newGradeBtn.textContent = "Add grade";
    this.newGradeBtn.disabled = true;
    inputArea.append(this.newGradeInput, this.newGradeBtn);
    return inputArea;
  }

  addGradesTable() {
    this.gradesTable = new Table([["Grades", "grades sortable"], ["Delete"]], "student-grades-table");
    const tableWrapper = Elements.createElement("div", "grades-table-wrapper");
    tableWrapper.appendChild(this.gradesTable.table);
    return tableWrapper;
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
    const deleteBtn = Elements.createElement("button", "delete-btn", "grade");
    deleteBtn.id = `delButton_${id}`;
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    this.gradesTable.addRow(`grade_${id}`, grade, deleteBtn);
  }
  removeGradeFromTable(id) {
    this.gradesTable.removeRow(`grade_${id}`);
  }
  clearGradesInput() {
    this.newGradeInput.value = "";
    this.newGradeBtn.disabled = true;
  }
  clearTableData() {
    this.gradesTable.removeAllRows();
  }
  clearPopupData() {
    Elements.getElement(".grades").classList = "grades sortable";
    this.studentNameField.textContent = "";
    this.clearGradesInput();
    this.clearTableData();
  }

  closePopup() {
    super.closePopup();
    this.clearPopupData();
  }
}
