import "./App.css";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    dateOfBirth: "",
    email: "",
    salary: "",
    phoneNumber: "",
    gender: "",
  });

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");
  const [reload, setReload] = useState();
  const [showForm, setShowForm] = useState(false);


  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = () => {
    if (sortOrder === "asc") {
      return <i className="bi bi-caret-up-fill ml-1"></i>;
    } else {
      return <i className="bi bi-caret-down-fill ml-1"></i>;
    }
  };

  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    const del = await axios.delete(`/api/employee/${id}`);
    setReload(del);
  };

  const handleEdit = (id, index) => {
    setShowForm(true)
    console.log(index);
    console.log("fdf", id);
    const employee = employees[index];
    setFormData({ ...employee });
    setEditIndex(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      validateId(formData.id) &&
      validateName(formData.name) &&
      validateDateOfBirth(formData.dateOfBirth) &&
      validateEmail(formData.email) &&
      validatePhoneNumber(formData.phoneNumber) &&
      validateSalary(formData.salary) &&
      validateGender(formData.gender)
    ) {
      if (editIndex !== null) {
        const updatedEmployee = {
          id: formData.id,
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          salary: formData.salary,
          gender: formData.gender,
        };

        try {
          const edit = await axios.put(
            `/api/employee/${editIndex}`,
            updatedEmployee
          );
          setShowForm(false)
          setReload(edit);

          const updatedEmployees = [...employees];
          updatedEmployees[editIndex] = updatedEmployee;
          setEmployees(updatedEmployees);
          setEditIndex(null);
        } catch (error) {
          console.error("Error updating employee:", error);
        }
      } else {
        const newEmployee = {
          id: formData.id,
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          salary: formData.salary,
          gender: formData.gender,
        };
        console.log(newEmployee);

        try {
          const response = await axios.post("/api/employee", newEmployee);
          setReload(response);
          setShowForm(false)
          if (response.status === 201) {
            const createdEmployee = response.data;
            setEmployees([...employees, createdEmployee]);
          }
        } catch (error) {
          console.error("Error creating employee:", error);
        }
      }

      setFormData({
        id: "",
        name: "",
        dateOfBirth: "",
        email: "",
        phoneNumber: "",
        salary: "",
        gender: "",
      });
    }
  };
  const filteredEmployees = employees.filter((employee) =>
  employee.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/api/employee");
        const employees = response.data;
        setEmployees(employees);
      } catch (error) {
        console.error("Error getting employees:", error);
      }
    };

    fetchEmployees();
  }, [reload]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateId = (id) => {
    const idRegex = /^\d{1,9}$/;
    return idRegex.test(id);
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    return nameRegex.test(name);
  };

  const validateDateOfBirth = (dateOfBirth) => {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(dateOfBirth);
  };

  const validateSalary = (salary) => {
    const salaryRegex = /^\d{4,6}(\.\d{1,2})?$/;
    return salaryRegex.test(salary);
  };

  const validateGender = (gender) => {
    return gender !== undefined && gender !== "";
  };

  return (
    <div  className="EmployeeApp bg-yellow-50 ">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4 mt-4 text-center">
          EMPLOYEE FORM
        </h1>
        <Container>
  {showForm && (
    <div className="rounded-2xl bg-green-100 w-full ">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-3">
              <label htmlFor="id" className="block mb-1">
                <b>                Employee Id
</b> 

              </label>
              <input
                type="number"
                placeholder="Enter Id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
              {formData.id && !validateId(formData.id) && (
                <p className="text-red-500">Employee ID is Required</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="block  mb-1">
               <b>Name</b> 
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
              {formData.name && !validateName(formData.name) && (
                <p className="text-red-500">Name is Required</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="dateOfBirth" className="block mb-1">
                <b>                Date of Birth
</b> 

              </label>
              <input
                type="text"
                placeholder="Enter Dob"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
              {formData.dateOfBirth && !validateDateOfBirth(formData.dateOfBirth) && (
                <p className="text-red-500">
                  Date of Birth Is Required and should be in format DD/MM/YYYY
                </p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="block mb-1">
                
                <b>Email</b> 

              </label>
              <input
                type="email"
                placeholder="Enter Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
              {formData.email && !validateEmail(formData.email) && (
                <p className="text-red-500">Please enter a valid email address.</p>
              )}
            </div>
          </div>

          <div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="block mb-1">
                <b>                Phone Number
</b> 

              </label>
              <input
                type="number"
                placeholder="Enter Phone number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
              {formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber) && (
                <p className="text-red-500">
                  Please enter a valid 10-digit phone number.
                </p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="salary" className="block mb-1">
                
                <b>Salary</b> 

              </label>
              <input
                type="number"
                placeholder="Enter Salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
              {formData.salary && !validateSalary(formData.salary) && (
                <p className="text-red-500">
                  Salary is Required and should be more than 1000
                </p>
              )}
            </div>

            <div className="mb-3">
              <label className="block mb-1">
                
                <b>Gender</b> 

                </label>
              <div>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleInputChange}
                />
                <label htmlFor="male" className="ml-2">
                  <b>                  Male
</b> 

                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleInputChange}
                />
                <label htmlFor="female" className="ml-2">
                  <b>                  Female
</b> 

                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="Other"
                  checked={formData.gender === "Other"}
                  onChange={handleInputChange}
                />
                <label htmlFor="other" className="ml-2">
                  
                  <b>Other</b> 

                </label>
              </div>
              {formData.gender && !validateGender(formData.gender) && (
                <p className="text-red-500">Please select a gender.</p>
              )}
            </div>

          </div>
        </div>
            <button
              type="submit"
              className="bg-blue-600 px-4 py-2 text-white rounded-md w-full"
            >
              {editIndex !== null ? "Update" : "Submit"}
            </button>
      </form>
    </div>
  )}
</Container>


        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 px-4 py-2 p-6 text-white rounded-md "
          >
            {showForm ? "Hide form 🔼 " : "Show form 🔽"}
          </button>
        </div>
       
      </div>

      <Container>
        <div className="mb-4 ms-4 mt-4 ml-32 ">
          <label htmlFor="search" className="mb-2 text-red-500 font-bold ml-6">
            Search by Name 🔍
          </label>
       

          <br />
          <input
            type="text"
            name="search"
            value={searchQuery}
            onChange={handleSearchChange}
            className=" px-4 py-2 border bg-slate-100 border-green-300 rounded-full"
            placeholder="search name"
          />
        </div>
      </Container>

     
          <Container className="flex justify-center">
      <div className="ml-56 m-5">
        {filteredEmployees.length > 0 ? (
          <div>
            <h1 className="text-2xl font-bold mb-4 mt-4 text-center">
              EMPLOYEE DETAILS
            </h1>
            <table className="w-full border border-black">
              <thead className="border border-black">
                <tr className="border border-black">
                  <th
                    className="py-2 px-4 bg-black  text-white w-96 text-center"
                    onClick={() => handleSort("id")}
                  >
                    ID {sortColumn === "id" && renderSortIcon()}
                  </th>
                  <th
                    className="py-2 px-4 bg-black text-white w-96 text-center"
                    onClick={() => handleSort("name")}
                  >
                    Name {sortColumn === "name" && renderSortIcon()}
                  </th>
                  <th
                    className="py-2 px-4 bg-black text-white w-96 text-center"
                    onClick={() => handleSort("dateOfBirth")}
                  >
                    Date of Birth{" "}
                    {sortColumn === "dateOfBirth" && renderSortIcon()}
                  </th>
                  <th
                    className="py-2 px-4 bg-black text-white w-96 text-center"
                    onClick={() => handleSort("email")}
                  >
                    Email {sortColumn === "email" && renderSortIcon()}
                  </th>
                  <th
                    className="py-2 px-4 bg-black text-white w-96 text-center"
                    onClick={() => handleSort("salary")}
                  >
                    Salary {sortColumn === "salary" && renderSortIcon()}
                  </th>
                  <th
                    className="py-2 px-4 bg-black text-white w-96 text-center"
                    onClick={() => handleSort("phoneNumber")}
                  >
                    Phone Number{" "}
                    {sortColumn === "phoneNumber" && renderSortIcon()}
                  </th>
                  <th
                    className="py-2 px-4 bg-black text-white w-96 text-center"
                    onClick={() => handleSort("gender")}
                  >
                    Gender {sortColumn === "gender" && renderSortIcon()}
                  </th>
                  <th className="py-2 px-4 bg-black text-white w-96 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees
                  .sort((a, b) => {
                    const columnA = a[sortColumn];
                    const columnB = b[sortColumn];

                    if (columnA < columnB) {
                      return sortOrder === "asc" ? -1 : 1;
                    }
                    if (columnA > columnB) {
                      return sortOrder === "asc" ? 1 : -1;
                    }
                    return 0;
                  })
                  .map((employee, index) => (
                    <tr key={index} className="border border-black">
                      <td className="text-center ">{employee.id}</td>
                      <td className="text-center">{employee.name}</td>
                      <td className="text-center">{employee.dateOfBirth}</td>
                      <td className="text-center">{employee.email}</td>
                      <td className="text-center">{employee.salary}</td>
                      <td className="text-center">{employee.phoneNumber}</td>
                      <td className="text-center">{employee.gender}</td>
                      <td className="text-center">
                        <button
                          onClick={() => {
                            handleEdit(employee._id, index);
                          }}
                          className="bg-yellow-400 px-2 py-1 mr-2 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="bg-red-400 px-2 py-1 text-white rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-100 border border-gray-300 rounded-md p-4 text-center">
            <p className="text-lg font-semibold mb-2">No employees found</p>
            <p className="text-gray-500">
              Add new employees to populate the list
            </p>
          </div>
        )}
      </div>
    </Container>

      
    </div>
  );
}

export default App;
