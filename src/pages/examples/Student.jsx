/**
 * JSX is the combination of html,css and javscript code 
 * Its an extension created by React
 * 
 * Every component must return single parent single parent node which
 * will be rendered
 */

function Student() {
     let name="Ram";
     let rollNumber =18;
    return (
       
        <> 
        <p>Student Name: {name}
            <br/>
            Roll Number :{rollNumber}
        </p>
        </>
    );
}

export default Student;