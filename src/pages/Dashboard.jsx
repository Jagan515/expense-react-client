function Dashboard({user}){
    return (
        <div className="container text-center">
            <h4>Welcome, {user.name} To Expense App Your Expense Friend</h4>
        </div>
    );
}

export default Dashboard;