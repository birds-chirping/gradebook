import { StudentsData } from "./student.js";
import { GradebookInterface } from "./gradebook.js";

class Controller {
  constructor(students) {
    this.model = new StudentsData(students);
    this.view = new GradebookInterface(document.querySelector(".container"));
    this.view.bindAddStudent(this.handleAddStudent);
    this.view.bindRemoveStudent(this.handleRemoveStudent);
    this.view.bindAddGrade(this.handleAddGrade);
    this.view.bindRemoveGrade(this.handleRemoveGrade);
    this.view.bindGetStudent(this.handleGetStudent);
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
    this.view.addStudentRow(student);
  };

  onRemoveStudent = (id) => {
    this.view.removeStudentRow(id);
  };

  onNewGrade = (studentID, grade, averageGrade) => {
    this.view.addGradesRow(grade.value, grade.id);
    this.view.updateAverageGrade(studentID, averageGrade);
  };

  onRemoveGrade = (studentID, id, averageGrade) => {
    this.view.removeGradeRow(id);
    this.view.updateAverageGrade(studentID, averageGrade);
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
// console.log(app);
