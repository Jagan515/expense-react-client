
import Student from "./pages/examples/Student";
import Student1 from "./pages/examples/Student1";
import Student2 from "./pages/examples/Student2";
import Student3 from "./pages/examples/Student3";
import Student4 from "./pages/examples/Student4"
import StudentList from "./pages/examples/Studentlist";
import UseCard from "./pages/practice.jsx/UseCard";
import Renderlist from "./pages/practice.jsx/Renderlist";
import StudentFilter from "./pages/examples/Studentfilter";
import Engineer  from "./pages/practice.jsx/Engineer";
function App(){
   const students = [
  { name: "Rahul", rollNumber: 1, percentage: 5 },
  { name: "Anita", rollNumber: 2, percentage: 90 },
  { name: "Vikram", rollNumber: 3, percentage: 78 },
];
 const products = [
  { id: 1, name: "Laptop", price: 999, category: "Electronics" },
  { id: 2, name: "Coffee Maker", price: 49, category: "Home" },
  { id: 3, name: "Smartphone", price: 699, category: "Electronics" }
];

const employees = [
        { id: 101, name: "Alice", department: "Engineering", active: true },
        { id: 102, name: "Bob", department: "Design", active: false },
        { id: 103, name: "Charlie", department: "Engineering", active: true },
        { id: 104, name: "David", department: "HR", active: true }
    ];
  return (
    <>
        <h1>Welcome to Expense App</h1>
        <Student />
        <Student1 name="Ashutosh"></Student1>
        <Student2 name="Rahul" rollNumber={23}></Student2>
        <Student3 name="Nitish" rollNumber={21} percentage={34}></Student3>
      

        <StudentList students={students} />

        <StudentFilter students={students}/>

        <UseCard name={"jagan"} location={"cuttack"} isPremium={true}/>
        <Renderlist products={products}></Renderlist>
        <Student4/>
        <h1>Employee Directory</h1>
        <Engineer employees={employees} />
        
    </>
  );
}


// export default App;
// import Login from "./Login";

// function App() {
//   return <Login />;
// }

export default App;
