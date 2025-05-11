import { useDispatch, useSelector } from "react-redux"
import { 
    onAddNewGroup, 
    onSetActiveGroup, 
    onSetCurrentPermissions, 
    onLoadGroups, 
    onLoadunsubscribed, 
    onAddNewMember, 
    onLoadsubscribedMembers,
    onDeleteUnsubscribed,
    onLoadPendingUsers,
    onDeleteMember,
    onUpdateGroup,
    onDeleteGroup,
    assignCategories,
    onAddRole,
    onDeleteRole
} from '../store/groups/groupsSlice';
import { calendarApi } from "../api";

export const useGroupsStore = () => {

    const dispatch = useDispatch();

    const { groups, 
        activeGroup,
        currentPermissions,
        currentRoles,
        unsubscribedMembers,
        subscribedMembers,
        categories
    } = useSelector( state => state.groups );
    const { user } = useSelector( state => state.auth );

    const setActiveGroup = ( group ) => {
        dispatch( onSetActiveGroup( group ) );

        localStorage.setItem( 'group', JSON.stringify(group) );
        
    }

    const loadCurrentPermissions = async() => {
        try {
            const { data } = await calendarApi.get(`/groups/${ activeGroup.id }`);
            
            const {  can, grupo } = data;

            const myRoles = grupo?.members.find( member => member.uid == user.uid );
            
            dispatch( onSetCurrentPermissions( { can, roles: myRoles.currentRoles  } ) );

        } catch (error) {
            console.log(error);
                        
        }
    }

    const startCreatingGroup = async ( groupName ) => {                
        try {

            if( activeGroup?.id ){                
                const { data } = await calendarApi.put(`/groups/${ activeGroup.id }`, { name: groupName });
                
                dispatch( onUpdateGroup( data ) );
                return;
            }
            
            const { data } = await calendarApi.post('/groups', { name: groupName  });         
            
            dispatch( onAddNewGroup({ ...data, creatorId: user.uid  }) );
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const startLoadingGroups = async () => {
        try {
            const { data } = await calendarApi.get('/users/logged');           
            dispatch( onLoadGroups( data.groups ));
            
        } catch (error) {
            console.log('Error al cargar los grupos');
            console.log(error);       
        }
    }

    // descontinuado
    const editGroup = async ( groupId ) => {
        try {
            const { data } = await calendarApi.put(`/groups/${ groupId }`);

            //dispatch( onUpdateGroup( data ) );
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const deleteGroup = async( groupId ) => {
        try {
            await calendarApi.delete(`/groups/${ groupId }`);

            dispatch( onDeleteGroup( groupId ) );
        } catch (error) {
            console.log(error);
            
        }
    }

    const startAddNewMember = async (  newMember ) => {
        try {
            
            const { data } = await calendarApi.post(`/groups/${ activeGroup.id }/add-member`,null, { params: { newMember: newMember.uid }});
                        
            dispatch( onAddNewMember( data ) );

            dispatch( onDeleteUnsubscribed( data ) );
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const loadUnsubscribed = async() => {
        try {
            const { data } = await calendarApi.get(`/groups/${ activeGroup.id }/manage-members`);
            console.log( data );
            
            dispatch( onLoadunsubscribed(  data.unsubscribedUsers ))
            dispatch( onLoadsubscribedMembers( data.members ) );

            dispatch( onLoadPendingUsers( data.usersWithPendingInvitation ) );
            
        } catch (error) {
            console.log(error);
            
        }
        
    }

    const addRole = async( memberId, roleId ) => {
        try {
            
            const { data } = await calendarApi.post(`/groups/${ activeGroup.id }/add-role/${ memberId }`,null, { params: { roleId: roleId } });
            dispatch( onAddRole({ id: memberId, roleId: roleId, data }) );

            if( memberId == user.uid )
                await loadCurrentPermissions()
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const deleteRole = async( memberId, roleId ) => {
        try {
            
            await calendarApi.post(`/groups/${ activeGroup.id }/delete-role/${ memberId }`, null, { params: { roleId } });         
            
            dispatch( onDeleteRole({ id: memberId, roleId: roleId }) );
            
            if( memberId == user.uid )
                await loadCurrentPermissions();

        } catch (error) {
            console.log(error);
            
        }
    }

    const kickMember = async( memberId ) => {
         
        try {
            await calendarApi.post(`/groups/${ activeGroup.id }/kick-member`, null, { params: { memberId  } })
            
            dispatch( onDeleteMember( memberId ) );

        } catch (error) {
            console.log(error);
            
        }
    }

    const loadCategories = async() => {
        try {
            
            const { data } = await calendarApi.get(`/groups/${ activeGroup.id }/categories`);
            dispatch( assignCategories( data ) );
            
        } catch (error) {
            console.log(error);
            
        }
    }


    return {
        groups,
        activeGroup,
        currentPermissions,
        currentRoles,
        hasGroupSelected: !!activeGroup,

        setActiveGroup,
        loadCurrentPermissions,
        startCreatingGroup,
        startLoadingGroups,
        editGroup,
        deleteGroup,
        startAddNewMember,
        
        loadUnsubscribed,
        unsubscribedMembers,
        subscribedMembers,

        addRole,
        deleteRole,
        kickMember,
        loadCategories,
        categories
    }

}


