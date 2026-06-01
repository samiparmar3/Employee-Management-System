// ======================================
// DOM ELEMENTS
// ======================================

const addEmployeeBtn =
    document.getElementById("addEmployeeBtn");

const addManagerBtn =
    document.getElementById("addManagerBtn");

const employeeModal =
    document.getElementById("employeeModal");

const closeModalBtn =
    document.getElementById("closeModal");

const employeeForm =
    document.getElementById("employeeForm");

const employeeTableBody =
    document.getElementById("employeeTableBody");

const searchInput =
    document.getElementById("searchInput");

const departmentFilter =
    document.getElementById("departmentFilter");

const darkModeBtn =
    document.getElementById("darkModeBtn");

const employeeIdInput =
    document.getElementById("employeeId");

const employeeTypeInput =
    document.getElementById("employeeType");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const departmentInput =
    document.getElementById("department");

const salaryInput =
    document.getElementById("salary");

const bonusInput =
    document.getElementById("bonus");

const bonusGroup =
    document.getElementById("bonusGroup");

const modalTitle =
    document.getElementById("modalTitle");


// ======================================
// DASHBOARD ELEMENTS
// ======================================

const totalEmployeesElement =
    document.getElementById("totalEmployees");

const totalManagersElement =
    document.getElementById("totalManagers");

const totalDepartmentsElement =
    document.getElementById("totalDepartments");

const totalPayrollElement =
    document.getElementById("totalPayroll");


// ======================================
// APPLICATION DATA
// ======================================

let employees = [];


// ======================================
// EMPLOYEE CLASS
// BASE CLASS
// ======================================

class Employee {

    constructor(
        id,
        name,
        email,
        department,
        salary
    ) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.salary = Number(salary);

        this.role = "Employee";
    }


    // Salary Return Karega

    getSalary() {

        return this.salary;

    }

}


// ======================================
// MANAGER CLASS
// EMPLOYEE KO INHERIT KARTA HAI
// ======================================

class Manager extends Employee {

    constructor(
        id,
        name,
        email,
        department,
        salary,
        bonus
    ) {

        super(
            id,
            name,
            email,
            department,
            salary
        );

        this.bonus =
            Number(bonus);

        this.role = "Manager";

    }


    // Method Overriding
    // Manager Salary = Salary + Bonus

    getSalary() {

        return this.salary +
               this.bonus;

    }

}


// ======================================
// GENERATE UNIQUE ID
// ======================================

function generateId() {

    return Date.now().toString();

}


// ======================================
// SAVE DATA TO LOCAL STORAGE
// ======================================

function saveEmployees() {

    localStorage.setItem(
        "employees",
        JSON.stringify(employees)
    );

}


// ======================================
// LOAD DATA FROM LOCAL STORAGE
// ======================================

function loadEmployees() {

    const storedEmployees =
        localStorage.getItem(
            "employees"
        );

    if (!storedEmployees)
        return;

    const parsedEmployees =
        JSON.parse(storedEmployees);


    employees =
        parsedEmployees.map(emp => {

            if (
                emp.role === "Manager"
            ) {

                return new Manager(

                    emp.id,
                    emp.name,
                    emp.email,
                    emp.department,
                    emp.salary,
                    emp.bonus

                );

            }

            return new Employee(

                emp.id,
                emp.name,
                emp.email,
                emp.department,
                emp.salary

            );

        });

}


// ======================================
// OPEN MODAL
// ======================================

function openModal(type) {

    employeeModal.classList.add(
        "show"
    );

    employeeTypeInput.value =
        type;

    employeeForm.reset();

    employeeIdInput.value = "";


    if (type === "manager") {

        modalTitle.textContent =
            "Add Manager";

        bonusGroup.style.display =
            "block";

    }

    else {

        modalTitle.textContent =
            "Add Employee";

        bonusGroup.style.display =
            "none";

    }

}


// ======================================
// CLOSE MODAL
// ======================================

function closeModal() {

    employeeModal.classList.remove(
        "show"
    );

}


// ======================================
// ADD EMPLOYEE
// ======================================

function addEmployee(data) {

    let employee;


    if (data.type === "manager") {

        employee =
            new Manager(

                generateId(),

                data.name,
                data.email,
                data.department,
                data.salary,
                data.bonus

            );

    }

    else {

        employee =
            new Employee(

                generateId(),

                data.name,
                data.email,
                data.department,
                data.salary

            );

    }


    employees.push(employee);

    saveEmployees();

    renderEmployees();

}


// ======================================
// UPDATE EMPLOYEE
// ======================================

function updateEmployee(data) {

    const index =
        employees.findIndex(
            emp => emp.id === data.id
        );

    if (index === -1)
        return;


    if (data.type === "manager") {

        employees[index] =
            new Manager(

                data.id,

                data.name,
                data.email,
                data.department,
                data.salary,
                data.bonus

            );

    }

    else {

        employees[index] =
            new Employee(

                data.id,

                data.name,
                data.email,
                data.department,
                data.salary

            );

    }


    saveEmployees();

    renderEmployees();

}


// ======================================
// DELETE EMPLOYEE
// ======================================

function deleteEmployee(id) {

    const confirmDelete =
        confirm(
            "Delete this record?"
        );

    if (!confirmDelete)
        return;


    employees =
        employees.filter(
            emp => emp.id !== id
        );

    saveEmployees();

    renderEmployees();

}

// ======================================
// FILTERED EMPLOYEES
// Search + Department Filter
// ======================================

function getFilteredEmployees() {

    let filteredEmployees =
        [...employees];

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();

    const departmentValue =
        departmentFilter.value;


    // Search

    if (searchValue) {

        filteredEmployees =
            filteredEmployees.filter(emp => {

                return (

                    emp.name
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    emp.email
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    emp.department
                        .toLowerCase()
                        .includes(searchValue)

                );

            });

    }


    // Department Filter

    if (
        departmentValue !== "all"
    ) {

        filteredEmployees =
            filteredEmployees.filter(emp => {

                return (
                    emp.department ===
                    departmentValue
                );

            });

    }

    return filteredEmployees;

}



// ======================================
// RENDER EMPLOYEES
// Table Generate Karega
// ======================================

function renderEmployees() {

    employeeTableBody.innerHTML = "";

    const filteredEmployees =
        getFilteredEmployees();


    filteredEmployees.forEach(emp => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${emp.id}
            </td>

            <td>
                ${emp.name}
            </td>

            <td>

                <span class="
                    role
                    ${emp.role.toLowerCase()}
                ">

                    ${emp.role}

                </span>

            </td>

            <td>
                ${emp.department}
            </td>

            <td>

                ₹${emp.getSalary().toLocaleString()}

            </td>

            <td>
                ${emp.email}
            </td>

            <td>

                <button
                    class="
                    action-btn
                    edit-btn
                    "
                    data-id="${emp.id}"
                >

                    Edit

                </button>

                <button
                    class="
                    action-btn
                    delete-btn
                    "
                    data-id="${emp.id}"
                >

                    Delete

                </button>

            </td>

        `;

        employeeTableBody.appendChild(
            row
        );

    });


    updateDashboard();

}



// ======================================
// UPDATE DASHBOARD
// ======================================

function updateDashboard() {

    const totalEmployees =
        employees.filter(emp =>
            emp.role === "Employee"
        ).length;

    const totalManagers =
        employees.filter(emp =>
            emp.role === "Manager"
        ).length;


    const departments =
        new Set(
            employees.map(
                emp => emp.department
            )
        );


    const totalPayroll =
        employees.reduce(

            (total, emp) => {

                return (
                    total +
                    emp.getSalary()
                );

            },

            0

        );


    totalEmployeesElement.textContent =
        totalEmployees;

    totalManagersElement.textContent =
        totalManagers;

    totalDepartmentsElement.textContent =
        departments.size;

    totalPayrollElement.textContent =
        `₹${totalPayroll.toLocaleString()}`;

}



// ======================================
// EDIT EMPLOYEE
// ======================================

function editEmployee(id) {

    const employee =
        employees.find(
            emp => emp.id === id
        );

    if (!employee)
        return;


    employeeIdInput.value =
        employee.id;

    employeeTypeInput.value =
        employee.role.toLowerCase();

    nameInput.value =
        employee.name;

    emailInput.value =
        employee.email;

    departmentInput.value =
        employee.department;

    salaryInput.value =
        employee.salary;


    if (
        employee.role ===
        "Manager"
    ) {

        bonusGroup.style.display =
            "block";

        bonusInput.value =
            employee.bonus;

        modalTitle.textContent =
            "Edit Manager";

    }

    else {

        bonusGroup.style.display =
            "none";

        modalTitle.textContent =
            "Edit Employee";

    }

    employeeModal.classList.add(
        "show"
    );

}



// ======================================
// DARK MODE
// ======================================

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );

    const darkEnabled =
        document.body.classList.contains(
            "dark"
        );

    localStorage.setItem(
        "darkMode",
        darkEnabled
    );

}



// ======================================
// LOAD DARK MODE
// ======================================

function loadDarkMode() {

    const darkMode =
        localStorage.getItem(
            "darkMode"
        );

    if (
        darkMode === "true"
    ) {

        document.body.classList.add(
            "dark"
        );

    }

}



// ======================================
// FORM SUBMIT
// ======================================

employeeForm.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();

        const data = {

            id:
                employeeIdInput.value,

            type:
                employeeTypeInput.value,

            name:
                nameInput.value.trim(),

            email:
                emailInput.value.trim(),

            department:
                departmentInput.value,

            salary:
                salaryInput.value,

            bonus:
                bonusInput.value || 0

        };


        // Edit

        if (data.id) {

            updateEmployee(data);

        }

        // Add

        else {

            addEmployee(data);

        }

        closeModal();

    }

);



// ======================================
// OPEN EMPLOYEE MODAL
// ======================================

addEmployeeBtn.addEventListener(

    "click",

    function() {

        openModal(
            "employee"
        );

    }

);



// ======================================
// OPEN MANAGER MODAL
// ======================================

addManagerBtn.addEventListener(

    "click",

    function() {

        openModal(
            "manager"
        );

    }

);



// ======================================
// CLOSE MODAL
// ======================================

closeModalBtn.addEventListener(

    "click",

    closeModal

);



// ======================================
// OUTSIDE MODAL CLICK
// ======================================

window.addEventListener(

    "click",

    function(event) {

        if (
            event.target ===
            employeeModal
        ) {

            closeModal();

        }

    }

);



// ======================================
// EDIT & DELETE BUTTONS
// Event Delegation
// ======================================

document.addEventListener(

    "click",

    function(event) {

        const editButton =
            event.target.closest(
                ".edit-btn"
            );

        const deleteButton =
            event.target.closest(
                ".delete-btn"
            );


        if (editButton) {

            const id =
                editButton.dataset.id;

            editEmployee(id);

        }


        if (deleteButton) {

            const id =
                deleteButton.dataset.id;

            deleteEmployee(id);

        }

    }

);



// ======================================
// SEARCH
// ======================================

searchInput.addEventListener(

    "input",

    renderEmployees

);



// ======================================
// DEPARTMENT FILTER
// ======================================

departmentFilter.addEventListener(

    "change",

    renderEmployees

);



// ======================================
// DARK MODE BUTTON
// ======================================

darkModeBtn.addEventListener(

    "click",

    toggleDarkMode

);



// ======================================
// DEMO DATA
// ======================================

function createDemoData() {

    if (
        employees.length > 0
    )
        return;


    employees.push(

        new Employee(

            generateId(),

            "Rahul Sharma",

            "rahul@gmail.com",

            "IT",

            50000

        ),

        new Employee(

            generateId(),

            "Priya Singh",

            "priya@gmail.com",

            "HR",

            45000

        ),

        new Manager(

            generateId(),

            "Amit Verma",

            "amit@gmail.com",

            "Finance",

            80000,

            20000

        )

    );

    saveEmployees();

}



// ======================================
// APP INITIALIZATION
// ======================================

function initializeApp() {

    loadEmployees();

    loadDarkMode();

    createDemoData();

    renderEmployees();

}



// ======================================
// START APP
// ======================================

initializeApp();