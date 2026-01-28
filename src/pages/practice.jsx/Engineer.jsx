function Engineer({ employees }) {
    // Step 1: filter only Engineering employees
    const engineeringEmployees = employees.filter(employee => {
        return employee.department === "Engineering";
    });

    return (
        <>
            <h2>Engineering Team</h2>

            {engineeringEmployees.map((employee, index) => (
                employee.active && (
                    <p key={index}>{employee.name}</p>
                )
            ))}
        </>
    );
}

export default Engineer;
