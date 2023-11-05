class Student {
  constructor(student) {
    this.id = student.id;
    this.name = student.name;
    this.grades = student.grades || [];
    this.averageGrade = this.calculateAverage();
  }

  calculateAverage() {
    return this.grades.length
      ? Number((this.grades.reduce((a, b) => a + b.value, 0) / this.grades.length).toFixed(2))
      : 0;
  }
}

class Students {
  students;

  constructor(students) {
    this.students = this.createStudentsList(students);
  }

  createStudentsList(students) {
    const studentsList = [];
    students.forEach((student) => {
      studentsList.push(new Student(student));
    });
    return studentsList;
  }

  addStudent(studentName) {
    const id = this.students.length > 0 ? this.students[this.students.length - 1].id + 1 : 1;
    const student = new Student({ id: id, name: studentName });
    this.students.push(student);
    this.onNewStudent(student);
  }

  removeStudent(id) {
    this.students = this.students.filter((student) => student.id.toString() !== id);
    this.onRemoveStudent(id);
  }

  addGrade(studentID, grade) {
    const student = this.getStudent(studentID);
    const gradeObject = {
      id: student.grades.length > 0 ? student.grades[student.grades.length - 1].id + 1 : 1,
      value: Number(grade),
    };

    student.grades.push(gradeObject);
    const averageGrade = this.updateAverageGrade(student);
    this.onNewGrade(studentID, gradeObject, averageGrade);
  }

  removeGrade(studentID, gradeID) {
    const student = this.getStudent(studentID);
    student.grades = student.grades.filter((grade) => grade.id.toString() !== gradeID);
    const averageGrade = this.updateAverageGrade(student);
    this.onRemoveGrade(studentID, gradeID, averageGrade);
  }

  updateAverageGrade(student) {
    return (student.averageGrade = student.calculateAverage());
  }

  getStudent(id) {
    return this.students.find((student) => student.id.toString() === id);
  }

  getStudentsSortedByName(sortType) {
    return SortStudents.sortByName(this.students, sortType);
  }

  getStudentsSortedByGrade(sortType) {
    return SortStudents.sortByGrade(this.students, sortType);
  }

  getSortedGrades(studentID, sortType) {
    return SortStudents.sortStudentGrades(this.getStudent(studentID), sortType);
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

class SortStudents {
  static sortByName(students, sortType) {
    if (sortType === "ascending") {
      return [...students].sort((student1, student2) => student1.name.localeCompare(student2.name));
    } else if (sortType === "descending") {
      return [...students].sort((student1, student2) => student2.name.localeCompare(student1.name));
    } else {
      return students;
    }
  }

  static sortByGrade(students, sortType) {
    if (sortType === "ascending") {
      return [...students].sort((student1, student2) => student1.averageGrade - student2.averageGrade);
    } else if (sortType === "descending") {
      return [...students].sort((student1, student2) => student2.averageGrade - student1.averageGrade);
    } else {
      return students;
    }
  }

  static sortStudentGrades(student, sortType) {
    if (sortType === "ascending") {
      return [...student.grades].sort((grade1, grade2) => grade1.value - grade2.value);
    } else if (sortType === "descending") {
      return [...student.grades].sort((grade1, grade2) => grade2.value - grade1.value);
    } else {
      return student.grades;
    }
  }
}

export { Students };
