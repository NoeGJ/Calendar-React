

export const checkRole = ( roleslist, RoleId ) => {
    console.log(" sda",roleslist);
    
    
    const roles = Array.isArray(roleslist) ? roleslist : [];
    
    const res = roles.some( (role) => role.id === RoleId );
    console.log("CHECKROLE", res);

    return res;
}
