import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/store";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";
import { calendarApi } from "../../src/api";


const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState },
            
        }
    });
}

describe('Pruebas en useAuthStore', () => {
    
    beforeEach( () => localStorage.clear() );

    test('debe de regresar los valores por defecto', () => {
        
        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });
        
        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            startLogout: expect.any(Function)
        });
        //console.log(result);
    })

    test('startLogin debe de realizar el login correctamente', async() => {
      
        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        await act( async()=> {
            await result.current.startLogin( testUserCredentials )
        })

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { 
                "name": "Test",
                "uid": "66822f8bd6216f2a082e7757"
            }
        });

        expect( localStorage.getItem('token') ).toEqual( expect.any(String) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );
    })

    test('startLogin debe de fallar la autentificación', async() => {
        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        await act( async()=> {
            await result.current.startLogin({ email: 'test@test.com', password: '123456789' })  
        });
        
        const { errorMessage, status, user } = result.current;
        expect( localStorage.getItem('token') ).toBe(null);
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: "Credenciales incorrectas",
            status: "not-authenticated",
            user: {}
        });

        await waitFor(
            () => expect( result.current.errorMessage ).toBe(undefined),
        );
    })

    test('startRegister debe de crear un usuario', async() => {
        
        const newUser = { email: 'test@test.com', password: '123456789', name: 'Test User' }
        
        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: "123456",
                name: 'Test',
                token: "tokenTest"
            }
        });

        await act( async()=> {
            await result.current.startRegister(newUser)  
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                name: 'Test',
                uid: '123456'
            }
        });

        spy.mockRestore();

    })

    test('startRegister debe de fallar la creación', async() => {
        
        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        await act( async()=> {
            await result.current.startRegister(testUserCredentials)  
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Un usuario existe con ese email',
            status: 'not-authenticated',
            user: {}
        });

    })

    test('checkAuthToken debe de fallar si no  hay token', async() => {
        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        await act( async()=> {
            await result.current.checkAuthToken()  
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });
    })

    test('checkAuthToken debe de autentificar el usuario si hay un token', async() => {
        
        const { data } = await calendarApi.post('/auth', testUserCredentials );
        localStorage.setItem('token', data.token );

        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        await act( async()=> {
            await result.current.checkAuthToken()  
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test', uid: '66822f8bd6216f2a082e7757' }
        });

    })
    
    
    
    
    

})
