import { createSlice } from '@reduxjs/toolkit';

export const groupsSlice = createSlice({
    name: 'groups',
    initialState: {
        isLoadingGroups: true,
        groups: [], //tempGroups,
        activeGroup: null,
        currentPermissions: {},
        currentRoles: [],
        unsubscribedMembers: [],
        subscribedMembers: [],
        isLoadingMembers: true,
        categories: [],
    },
    reducers: {
        onSetActiveGroup: (state, { payload }) => {
            state.activeGroup = payload;
        },
        onSetCurrentPermissions: (state, { payload }) => {

            state.currentPermissions = payload.can;
            state.currentRoles = payload.roles;

            //console.log(" slice ",state.currentRoles);
            //console.log(state.currentPermissions);

        },

        onAddNewGroup: (state, { payload }) => {
            state.groups.push( payload );
            state.activeGroup = null;
        },
        onUpdateGroup: (state, { payload }) => {
            state.groups = state.groups.map( group => {
                if( group.id === payload.id ) {
                    return payload;
                }

                return group;
            } );
            state.activeGroup = null;
        },
        onDeleteGroup: ( state, { payload } ) => {

            state.groups = state.groups.filter( group => group.id !== payload );
            state.activeGroup = null;

        },
        onLoadGroups: (state, { payload = [] }) => {
            state.isLoadingGroups = false;

            payload.forEach(group => {

                const exists = state.groups.some( dbGroup => dbGroup.id === group.id );
                if( !exists ){
                    state.groups.push( group );
                }
            });
        },
        onLoadsubscribedMembers: ( state, { payload } ) => {
            state.isLoadingMembers = false;
            state.subscribedMembers = payload;
            state.subscribedMembers = state.subscribedMembers.sort( (a, b) => {
                if( a.uid === state.activeGroup.creatorId ) return -1;
                if( b.uid === state.activeGroup.creatorId ) return 1;
                return 0;
            });
        },
        onLoadunsubscribed: ( state, { payload = [] } ) => {
            state.isLoadingMembers = false;

            state.unsubscribedMembers = payload;
        },

        onAddNewMember: (state, { payload }) => {

            state.subscribedMembers.push( payload )
        },
        onDeleteMember: ( state, { payload }) => {
            state.subscribedMembers = state.subscribedMembers.filter(member => member.uid != payload);

        },
        onAddRole: ( state, { payload } ) => {
            state.subscribedMembers = state.subscribedMembers.map( member => {
                if( member.uid === payload.id ){
                    return {
                        ...member,
                        currentRoles: payload.data
                    }
                }
                return member;
            });
        },
        onDeleteRole: ( state, { payload } ) => {
            state.subscribedMembers = state.subscribedMembers.map( ( member ) => {
                if( payload.id === member.uid ){
                    return {
                        ...member,
                        currentRoles: member.currentRoles.filter((item) => item.id !== payload.roleId ),
                    };
                }
                return member;
            });
        },
        onUpdateRoles: ( state, { payload } ) => {

        },
        onDeleteUnsubscribed: ( state, { payload } ) => {
            state.unsubscribedMembers = state.unsubscribedMembers.filter( member => member.uid != payload.uid );
        },
        onLogoutGroups: ( state ) => {
            //state.isLoadingGroups = true
            state.groups = []
            state.currentPermissions = {}
            state.currentRoles = []
            state.subscribedMembers = []
            state.unsubscribedMembers = []
            state.activeGroup = null
        },
        assignCategories: ( state, {payload} ) => {
            console.log( payload );
            
            state.categories = payload;
        }
    }
});
// Action creators are generated for each case reducer function
export const {
    onSetActiveGroup,
    onSetCurrentPermissions,
    onAddNewGroup,
    onUpdateGroup,
    onDeleteGroup,
    onLoadGroups,
    onLogoutGroups,
    onAddNewMember,

    onLoadunsubscribed,
    onLoadsubscribedMembers,
    onDeleteMember,
    onDeleteUnsubscribed,
    assignCategories,
    onAddRole,
    onDeleteRole,
    onUpdateRoles


} = groupsSlice.actions;