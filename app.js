import { studentsData } from "./student-data/students-data.js";
import { Students } from "./student-data/students.js";
import { GradebookView } from "./gradebook-view/gradebook.js";

class Controller {
  constructor(students) {
    this.model = new Students(students);
    this.view = new GradebookView(document.querySelector(".container"));
    this.view.bindAddStudent(this.handleAddStudent);
    this.view.bindRemoveStudent(this.handleRemoveStudent);
    this.view.bindAddGrade(this.handleAddGrade);
    this.view.bindRemoveGrade(this.handleRemoveGrade);
    this.view.bindGetStudent(this.handleGetStudent);
    this.view.bindGetStudentsSortedByName(this.handleGetStudentsSortedByName);
    this.view.bindGetStudentsSortedByGrade(this.handleGetStudentsSortedByGrade);
    this.view.bindGetSortedGrades(this.handleGetSortedGrades);
    this.model.bindNewStudent(this.onNewStudent);
    this.model.bindRemoveStudent(this.onRemoveStudent);
    this.model.bindNewGrade(this.onNewGrade);
    this.model.bindRemoveGrade(this.onRemoveGrade);
    this.addExistingStudents();
  }

  addExistingStudents() {
    this.view.displayStudents(this.model.students);
  }

  onNewStudent = (student) => {
    this.view.addStudentToTable(student);
  };

  onRemoveStudent = (id) => {
    this.view.removeStudentFromTable(id);
  };

  onNewGrade = (studentID, grade, averageGrade) => {
    this.view.addGradeToTable(grade.value, grade.id);
    this.view.updatePopupAverageGrade(averageGrade);
    this.view.updateGradebookAverageGrade(studentID, averageGrade);
  };

  onRemoveGrade = (studentID, id, averageGrade) => {
    this.view.removeGradeFromTable(id);
    this.view.updatePopupAverageGrade(averageGrade);
    this.view.updateGradebookAverageGrade(studentID, averageGrade);
  };

  handleAddStudent = (studentName) => {
    this.model.addStudent(studentName);
  };

  handleRemoveStudent = (id) => {
    this.model.removeStudent(id);
  };

  handleGetStudent = (id) => {
    return this.model.getStudent(id);
  };

  handleGetStudentsSortedByName = (sortType) => {
    return this.model.getStudentsSortedByName(sortType);
  };

  handleGetStudentsSortedByGrade = (sortType) => {
    return this.model.getStudentsSortedByGrade(sortType);
  };

  handleGetSortedGrades = (studentID, sortType) => {
    return this.model.getSortedGrades(studentID, sortType);
  };
  handleAddGrade = (id, grade) => {
    this.model.addGrade(id, grade);
  };

  handleRemoveGrade = (studentId, gradeId) => {
    this.model.removeGrade(studentId, gradeId);
  };
}

const app = new Controller(studentsData);
console.log(app);
