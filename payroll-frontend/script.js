const BASE_URL = "http://localhost:8080/employees";

async function addEmployee() {

const name = document.getElementById("name").value;
const department = document.getElementById("department").value;
const salary = document.getElementById("salary").value;

if(!name || !department || !salary){
alert("Please fill all fields");
return;
}

try{

await fetch(BASE_URL + "/add",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name:name,
department:department,
baseSalary:parseFloat(salary)
})

});

alert("Employee Added");

clearForm();
loadEmployees();
loadSummary();

}catch(error){

console.error(error);
alert("Error adding employee");

}

}

function clearForm(){

document.getElementById("name").value="";
document.getElementById("department").value="";
document.getElementById("salary").value="";

}

async function loadEmployees(){

try{

const response=await fetch(BASE_URL+"/all");

const employees=await response.json();

const table=document.querySelector("#employeeTable tbody");

table.innerHTML="";

employees.forEach(emp=>{

const row=`
<tr>
<td>${emp.id}</td>
<td>${emp.name}</td>
<td>${emp.department}</td>
<td>${emp.baseSalary}</td>
</tr>
`;

table.innerHTML+=row;

});

}catch(error){

console.error(error);
alert("Error loading employees");

}

}

async function loadSummary(){

try{

const response=await fetch(BASE_URL+"/payroll-summary");

const data=await response.json();

document.getElementById("summary").innerHTML=
`
Total Employees: ${data.totalEmployees}<br>
Total Payroll: ${data.totalPayroll}<br>
Average Salary: ${data.averageSalary}<br>
Highest Salary: ${data.highestSalary}
`;

}catch(error){

console.error(error);
alert("Error loading summary");

}

}

window.onload=function(){

loadEmployees();
loadSummary();

}