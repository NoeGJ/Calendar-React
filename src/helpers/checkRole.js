

export const checkRole = ( roleslist, RoleId ) => {
    const AUTHOR = 1
    
    const roles = Array.isArray(roleslist) ? roleslist : [];
    
    const res = roles.some( (role) => role.id === RoleId || role.id === AUTHOR);

    return res;
}
