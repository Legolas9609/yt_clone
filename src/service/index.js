import axios from 'axios'
import {router} from '../routes';
import {authHeader} from "../helpers";
import EventBus from '../event-bus';
import {config} from '../config'

const SERVER_URL = config.apiUrl;

const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 30000 // 30 sekund
});

instance.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error.response.status == 401) {

        EventBus.$emit('logged', 'out');
        EventBus.$emit('logged_out_profile');

        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
        }

        if (!window.location.pathname.includes('login'))
            router.push({path: 'login', append: true})

    }
    return Promise.reject(error);
});


export default {

    // film actions
    createNewFilm: (form) => instance.post('films',
        form, { timeout: 120000, headers: authHeader()}),
    getAllFilms: () => instance.get('films'),
    removeFilm: (id) => instance.delete('films/' + id, {headers: authHeader()}),
    getFilmById: (id) => instance.get(`films/${id}`),
    getAllFilmsAndFilterAndSort: (path) =>
        instance.get(`films?${path}`),
    updateFilmMetaViews: (id, update) => instance.put(`films/${id}/meta/views`, update),
    updateFilmMetaLikes: (id, update) => instance.put(`films/${id}/meta/likes`, update, {headers: authHeader()}),

    // comments actions
    getAllCommentsByFilmId: (id) => instance.get(`comments?film_id=${id}`),
    createComment: (id, form) => instance.post(`comments?film_id=${id}`,
        form, {headers: authHeader()}),
    sortComments: (id, sort) => instance.get(`comments/sort?film_id=${id}&&${sort}`),
    removeComment: (id) => instance.delete('comments/' + id, {headers: authHeader()}),

    // auth actions
    login: (data) => instance.post(`auth/signin`, data),
    register: (data) => instance.post(`auth/signup`, data),


    // password actions
    forget: (form) => instance.post(`users/password/forgot`, form),
    reset: (token, form) => instance.post(`users/password/reset/${token}`, form),

    // user actions
    getMe: () => instance.get(`users/me`, {headers: authHeader()}),
    getMyPlaylists: () => instance.get(`users/me/playlists`, {headers: authHeader()}),
    getMyFilms: () => instance.get(`users/me/films`, {headers: authHeader()}),

    // Playlist actions
    addPlaylist: (form) => instance.post(`playlists`, form, {headers: authHeader()}),
    updatePlaylist: (id, form) => instance.put(`playlists/${id}`, form, {headers: authHeader()}),
    getAllPlaylists: () => instance.get(`playlists`, {headers: authHeader()}),
    getPlaylistById: (id) => instance.get(`playlists/${id}`, {headers: authHeader()}),
    getPlaylistFilms: (id) => instance.get(`playlists/${id}/films`, {headers: authHeader()}),
    removePlaylist: (id) => instance.delete('playlists/' + id, {headers: authHeader()}),

}
