import { useDispatch, useSelector } from "react-redux"
import { onAddNewGroup, onSetActiveGroup, onSetCurrentPermissions, onLoadGroups, onLoadunsubscribed, onAddNewMember, onLoadsubscribedMembers } from '../store/groups/groupsSlice';
import { calendarApi } from "../api";

export const useGroupsStore = () => {

    const dispatch = useDispatch();

    const { groups, 
        activeGroup,
        currentPermissions,
        unsubscribedMembers,
        subscribedMembers
    } = useSelector( state => state.groups );
    const { user } = useSelector( state => state.auth );

    const setActiveGroup = ( group ) => {
        dispatch( onSetActiveGroup( group ) );
    }

    const setCurrentPermissions = async( groupId ) => {
        try {
            const { data } = await calendarApi.get(`/groups/${ groupId }`);

            dispatch( onSetCurrentPermissions( data ) );

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
            const groupsSlice = data.groups.slice(1)
            //console.log( groupsSlice );
            
            dispatch( onLoadGroups( groupsSlice ));

            
        } catch (error) {
            console.log('Error al cargar los grupos');
            console.log(error);       
        }
    }

    const startAddNewMember = async (  newMember ) => {
        try {
            
            const { data } = await calendarApi.post(`/groups/${ activeGroup.id }/add-member`, null, { params: { newMember: newMember.uid }});
            dispatch( onAddNewMember( newMember ) );
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const loadUnsubscribed = async() => {
        try {
            const { data } = await calendarApi.get(`/groups/${ activeGroup.id }/manage-members`);
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
        hasGroupSelected: !!activeGroup,

        setActiveGroup,
        setCurrentPermissions,
        startCreatingGroup,
        startLoadingGroups,
        startAddNewMember,
        
        loadUnsubscribed,
        unsubscribedMembers,
        subscribedMembers
    }

}


