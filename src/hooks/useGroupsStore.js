import { useDispatch, useSelector } from "react-redux"
import { onAddNewGroup, onSetActiveGroup, onSetCurrentPermissions, onLoadGroups, onLoadunsubscribed, onAddNewMember, onLoadsubscribedMembers } from '../store/groups/groupsSlice';
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
            const { data } = await calendarApi.post('/groups', { name: groupName  });
            
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

    const startAddNewMember = async (  newMember ) => {
        try {
            
            const { data } = await calendarApi.post(`/groups/${ activeGroup.id }/add-member`, null, { params: { newMember: newMember.uid }});
            console.log('addmember',data);
            dispatch( onAddNewMember( newMember ) );
            
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
        startAddNewMember,
        
        loadUnsubscribed,
        unsubscribedMembers,
        subscribedMembers
    }

}


