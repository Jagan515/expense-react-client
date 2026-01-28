import { useState } from "react";

function Student4() {

  const [visible, setVisible] = useState(true);
  const [buttontext,setButtonText]=useState('Hide Student');

  const studentlist = [
    { name: "Rahul", rollNumber: 1, percentage: 5 },
    { name: "Anita", rollNumber: 2, percentage: 90 },
    { name: "Vikram", rollNumber: 3, percentage: 78 },
  ];

  const handleClick = () => {
    if(visible){
        setButtonText('Display Students');
    }else{
        setButtonText('Hide Statements');
    }

    setVisible(!visible);
  };

  return (
    <div>
      <button onClick={handleClick}>{buttontext}</button>

      {visible && (
        <>
          {studentlist.map((s) => (
            <p key={s.rollNumber}>
              RollNumber: {s.rollNumber}
              <br />
              Name: {s.name}
            </p>
          ))}
        </>
      )}
    </div>
  );
}

export default Student4;
