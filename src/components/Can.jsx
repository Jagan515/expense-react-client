// import { useSelector } from "react-redux";
// import { ROLE_PERMISSIONS } from "../rbac/userPermissions";
// function Can({requiredPermission,children}){
//     const user=useSelector((state)=>state.useDetails);
//     const userPermission=ROLE_PERMISSIONS[user?.role] || {};
//     return userPermission[requiredPermission]?children:null;
// }

// export default Can;


import { usePermissions } from "../rbac/userPermissions";

// Permission-based render guard
function Can({ requiredPermission = "", children }) {
    const permissions = usePermissions();

    if (!requiredPermission) {
        return null;
    }

    if (!permissions[requiredPermission]) {
        return null;
    }

    return children;
}

export default Can;
