// import { useSelector } from "react-redux";
// import { ROLE_PERMISSIONS } from "../rbac/userPermissions";
// function Can({requiredPermission,children}){
//     const user=useSelector((state)=>state.useDetails);
//     const userPermission=ROLE_PERMISSIONS[user?.role] || {};
//     return userPermission[requiredPermission]?children:null;
// }

// export default Can;



import { usePermissions } from "../rbac/userPermissions";

function Can({ requiredPermission, children }) {
    const permissions = usePermissions();
    console.log("permissions:", permissions);
    console.log("required:", requiredPermission);


    if (!permissions[requiredPermission]) {
        return null;
    }

    return children;
}

export default Can;
