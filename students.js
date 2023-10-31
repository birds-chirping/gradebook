class StudentsData {
  constructor(students) {
    this.students = this.createStudentsList(students);
  }

  createStudentsList(students) {
    const studentsList = [];
    students.forEach((student) => {
      studentsList.push(new Student(student));
    });
    console.log(studentsList);
    return studentsList;
  }

  addStudent(studentName) {
    const id = this.students.length > 0 ? this.students[this.students.length - 1].id + 1 : 1;
    const student = new Student({ id: id, name: studentName });
    this.students.push(student);
    this.onNewStudent(student);
  }

  removeStudent(id) {
    this.students = this.students.filter((student) => student.id != id);
    this.onRemoveStudent(id);
  }

  addGrade(studentID, grade) {
    const student = this.students.find((student) => student.id == studentID);
    const gradeObject = {
      id: student.grades.length > 0 ? student.grades[student.grades.length - 1].id + 1 : 1,
      value: Number(grade),
    };

    student.grades.push(gradeObject);
    const averageGrade = this.updateAverageGrade(student);
    this.onNewGrade(studentID, gradeObject, averageGrade);
  }

  removeGrade(studentID, gradeID) {
    const student = this.students.find((student) => student.id == studentID);
    student.grades = student.grades.filter((grade) => grade.id != gradeID);
    const averageGrade = this.updateAverageGrade(student);
    this.onRemoveGrade(studentID, gradeID, averageGrade);
  }

  updateAverageGrade(student) {
    return (student.averageGrade = student.calculateAverage());
  }

  getStudent(id) {
    return this.students.find((student) => student.id == id);
  }

  bindNewStudent(callback) {
    this.onNewStudent = callback;
  }

  bindNewGrade(callback) {
    this.onNewGrade = callback;
  }

  bindRemoveStudent(callback) {
    this.onRemoveStudent = callback;
  }

  bindRemoveGrade(callback) {
    this.onRemoveGrade = callback;
  }
}

class Student {
  constructor(student) {
    this.id = student.id;
    this.name = student.name;
    this.grades = student.grades || [];
    this.averageGrade = this.calculateAverage();
  }

  calculateAverage() {
    return this.grades.length ? (this.grades.reduce((a, b) => a + b.value, 0) / this.grades.length).toFixed(2) : "-";
  }
}

export { StudentsData };
