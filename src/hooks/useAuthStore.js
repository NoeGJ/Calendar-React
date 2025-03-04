import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from '../store'


export const useAuthStore = () => {

    const { status, user, message } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async({ email, password }) => {
        dispatch( onChecking() );
        try {
            
            const { data } = await calendarApi.post('/login', { email, password });
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ username: data.username, uid: data.uid }) );

        } catch (error) {
        
            dispatch(onLogout('Credenciales incorrectas') );
            setTimeout(() => {
                dispatch( clearErrorMessage()  );
            }, 10);
        }
    }

    const startRegister = async({ name, email, password }) => {
        dispatch( onChecking() );

        try {
            const { data } = await calendarApi.post('/auth/sign-in', { username: name, email, password });
            

            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ username: data.username, uid: data.uid }) );

        } catch (error) {
            const { password, email, username } = error.response.data;
            let msg = `${ password? password : '' }\n${ email? email : '' }\n${ username? username : '' }`

            
            dispatch( onLogout( msg ) );
            setTimeout(() => {
                dispatch( clearErrorMessage()  );
            }, 10);
        }
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if( !token ) return dispatch( onLogout() );

        try {
            const { data } = await calendarApi.get('/auth/renew');
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ username: data.username, uid: data.uid }) );
        } catch (error) {
            localStorage.clear();
            return dispatch( onLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogoutCalendar() );
        dispatch( onLogout() );
    }

    return {
        status,
        user,
        message,

        checkAuthToken,
        startLogin,
        startRegister,
        startLogout
    }
}