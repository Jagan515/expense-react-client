import Student3 from "./Student3";

function StudentFilter({students}){
    const filterStudents=students.filter(student =>{
        return student.percentage>33.0;
    });

    return (
        <>
        <h2>Student Pass</h2>
        {filterStudents.map((student,index)=>(
            <Student3
            key ={index}
            name={student.name}
            rollNumber={student.rollNumber}
            percentage={student.percentage}/>

        ))}
        </>
    );
}

export default StudentFilter;