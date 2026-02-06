import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function UserHeader() {
  const user = useSelector((state) => state.userDetails);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        
        <Link className="navbar-brand" to="/dashboard">
          ExpenseApp
        </Link>
        <Link className="nav-link" to="/groups">
        My Groups
        </Link>
       

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">

            
              <Link
                className="nav-link active"
                aria-current="page"
                to="/dashboard"
              >
                {user?.name || "Account"}
              </Link>
            </li>



            <li className="nav-item">
              <Link className="dropdown-item py-2 fw-medium" to="/manage-users">
                <i className="bi bi-person-check me-2"></i>{""}
                Manage Users
              </Link>
            </li>



            <li className="nav-item">
              <Link className="nav-link" to="/logout">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default UserHeader;
