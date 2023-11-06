import { Elements } from "../utils/utils.js";

export class Table {
  constructor(headerData, tableClass) {
    this.table = this.createTable(headerData, tableClass);
  }

  createTable(headerData, tableClass) {
    const table = Elements.createElement("table", tableClass);
    const tHead = table.createTHead();
    const row = tHead.insertRow(0);
    for (let i = 0; i < headerData.length; i++) {
      const cell = row.insertCell(i);
      cell.outerHTML = `<th class="${headerData[i][1] || ""}">${headerData[i][0]}</th>`;
    }
    table.createTBody();
    return table;
  }

  addRow(rowID, ...elements) {
    const row = this.table.tBodies[0].insertRow(-1);
    row.id = rowID;
    elements.forEach((element, index) => {
      const cell = row.insertCell(index);
      element instanceof HTMLElement ? cell.appendChild(element) : (cell.textContent = element);
    });
  }

  removeRow(id) {
    document.getElementById(id).remove();
  }

  removeAllRows() {
    this.table.tBodies[0].innerHTML = "";
  }

  static resetArrows(element) {
    element.classList.remove("ascending", "descending");
  }

  static setSortType(element) {
    let sortType;
    switch (true) {
      case element.classList.contains("ascending"):
        element.classList.remove("ascending");
        element.classList.add("descending");
        sortType = "descending";
        break;
      case element.classList.contains("descending"):
        element.classList.remove("descending");
        sortType = "none";
        break;
      default:
        element.classList.add("ascending");
        sortType = "ascending";
    }
    return sortType;
  }
}
