import { StudentsData } from "./students.js";
import { GradebookView } from "./gradebook.js";

class Controller {
  constructor(students) {
    this.model = new StudentsData(students);
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
    this.view.updatePopupAverageGrade(studentID, averageGrade);
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

const students = [
  {
    id: 1,
    name: "Stefan",
    grades: [
      { id: 1, value: 10 },
      { id: 2, value: 10 },
      { id: 3, value: 7 },
    ],
  },
  {
    id: 2,
    name: "Valentin",
    grades: [
      { id: 1, value: 10 },
      { id: 2, value: 9 },
      { id: 3, value: 9 },
    ],
  },
  { id: 3, name: "Maria", grades: [], averageGrade: "-" },
  {
    id: 4,
    name: "Oana",
    grades: [
      { id: 1, value: 8 },
      { id: 2, value: 10 },
      { id: 3, value: 7 },
      { id: 4, value: 10 },
    ],
  },
  {
    id: 5,
    name: "Robert",
    grades: [
      { id: 1, value: 6 },
      { id: 2, value: 7 },
      { id: 3, value: 8 },
    ],
  },
];

const app = new Controller(students);
console.log(app);
