/**
 * JSX is the combination of html,css and javscript code 
 * Its an extension created by React
 * 
 * Every component must return single parent single parent node which
 * will be rendered
 */

function Student2(props) {
    return (
       
        <> 
        <p>Student Name: {props.name}
            <br/>
            Roll Number :{props.rollNumber}
        </p>
        </>
    );
}

export default Student2;