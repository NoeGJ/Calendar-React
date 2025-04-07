import { createSlice } from '@reduxjs/toolkit';


// const tempGroups = [
//     {
//       id: 1,
//       name: 'proyecto',
//       members: [
//         {
//           id: 1,
//           name: 'Antonio'
//         },
//         {
//           id: 2,
//           name: 'Juan'
//         }
//       ],
//       author: 1
//   },
//   {
//     id: 2,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Antonio'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 3,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Antonio'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 4,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Antonio'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 5,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Antonio'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 6,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Antonio'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 7,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Antonio'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 8,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Antonio'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 9,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Antonio'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 10,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Antonio'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 11,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Antonio'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 12,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Angel'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 13,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Angie'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   },
//   {
//     id: 14,
//     name: 'AdminBank',
//     members: [
//       {
//         id: 1,
//         name: 'Luis'
//       },
//       {
//         id: 2,
//         name: 'Juan'
//       }
//     ],
//     author: 2
//   }
// ];

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
        },
        onDeleteGroup: ( state, { payload } ) => {
            
            state.groups = state.groups.filter( group => group.id !== payload.id );
            state.activeGroup = null;
            
        },
        onLoadGroups: (state, { payload = [] }) => {
            state.isLoadingGroups = false;
            console.log( payload );
            
            payload.forEach(group => {
                console.log(group);
                
                const exists = state.groups.some( dbGroup => dbGroup.id === group.id );
                if( !exists ){
                    state.groups.push( group );
                }
            });
        },
        onLoadsubscribedMembers: ( state, { payload } ) => {
            state.isLoadingMembers = false;
            state.subscribedMembers = payload;
        },
        onLoadunsubscribed: ( state, { payload = [] } ) => {
            state.isLoadingMembers = false;
            console.log(payload);
            
            state.unsubscribedMembers = payload;
            console.log(state.unsubscribedMembers);
        },

        onAddNewMember: (state, { payload }) => {   
            
            state.subscribedMembers.push( payload )
        },
        onDeleteMember: ( state, { payload }) => {

        },
        onDeleteUnsubscribed: ( state, { payload } ) => {
            state.unsubscribedMembers = state.unsubscribedMembers.filter( member => member.uid != payload.uid );
        },
        onLogoutGroups: ( state ) => {
            //state.isLoadingGroups = true
            state.groups = []
            state.currentPermissions = {}
            state.activeGroup = null
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


} = groupsSlice.actions;