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
    onDeleteMember,
    onUpdateGroup,
    onDeleteGroup
} from '../store/groups/groupsSlice';
import { calendarApi } from "../api";

export const useGroupsStore = () => {

    const dispatch = useDispatch();

    const { groups, 
        activeGroup,
        currentPermissions,
        currentRoles,
        unsubscribedMembers,
        subscribedMembers
    } = useSelector( state => state.groups );
    const { user } = useSelector( state => state.auth );

    const setActiveGroup = ( group ) => {
        dispatch( onSetActiveGroup( group ) );
        
    }

    const loadCurrentPermissions = async() => {
        try {
            const { data } = await calendarApi.get(`/groups/${ activeGroup.id }`);

            //console.log( data );
            

            const {  can, grupo } = data;

            const myRoles = grupo?.members.find( member => member.uid == user.uid );
            console.log( myRoles );
            

            dispatch( onSetCurrentPermissions( { can, roles: myRoles.currentRoles  } ) );

        } catch (error) {
            console.log(error);
                        
        }
    }

    const startCreatingGroup = async ( groupName ) => {
        
        
        try {

            if( activeGroup?.id ){
                console.log("update");
                
                const { data } = await calendarApi.put(`/groups/${ activeGroup.id }`, { name: groupName });
                
                dispatch( onUpdateGroup( data ) );
                return;
            }
            
            console.log("create");
            const { data } = await calendarApi.post('/groups', { name: groupName  });

            console.log(data);
            
            
            dispatch( onAddNewGroup({ ...data, creatorId: user.uid  }) );
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const startLoadingGroups = async () => {
        try {
            const { data } = await calendarApi.get('/users/logged');
            console.log( data );

            
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
            console.log(data);

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
            console.log( data );
            
            
            dispatch( onAddNewMember( data ) );

            dispatch( onDeleteUnsubscribed( data ) );
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const loadUnsubscribed = async() => {
        try {
            const { data } = await calendarApi.get(`/groups/${ activeGroup.id }/manage-members`);
            console.log(data);
            dispatch( onLoadunsubscribed(  data.unsubscribedUsers ))
            dispatch( onLoadsubscribedMembers( data.members ) );
            
        } catch (error) {
            console.log(error);
            
        }
        
    }

    const addRole = async( memberId, roleId ) => {
        try {
            console.log(memberId, roleId);
            
            const { data } = await calendarApi.post(`/groups/${ activeGroup.id }/add-role/${ memberId }`,null, { params: { roleId: roleId } });
            console.log( data );
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const deleteRole = async( memberId, roleId ) => {
        try {
            console.log(memberId, roleId);
            
            const { data } = await calendarApi.post(`/groups/${ activeGroup.id }/delete-role/${ memberId }`, null, { params: { roleId } });
            console.log( data );
            
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
        kickMember
    }

}


