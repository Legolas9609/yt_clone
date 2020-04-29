import VueRouter from "vue-router";
import FilmsHomepage from "../components/FilmsHomepage";
import Login from "../components/Login";
import Register from "../components/Register";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import AddFilm from "../components/AddFilm";
import Film from "../components/Film";
import FilmsSearch from "../components/FilmsSearch";
import PlaylistsHomepage from "../components/PlaylistsHomepage";
import Profile from "../components/Profile";
import {publicPath} from "../../vue.config";

export const router = new VueRouter({
    mode: 'history',
    scrollBehavior() {
        return {x: 0, y: 0};
    },
    routes: [
        {
            path: `${publicPath}`, component: FilmsHomepage,
            children: [
                {
                    path: 'login',
                    component: Login
                },
                {
                    path: 'register',
                    component: Register
                },
                {
                    path: 'forgot',
                    component: ForgotPassword
                },
            ]

        },
        {
            path: `${publicPath}reset/:token`,
            components: {
              default: FilmsHomepage,
              reset: ResetPassword,
            }

        },
        {
            path: `${publicPath}add`, component: AddFilm,
            children: [
                {
                    path: 'login',
                    component: Login
                },
                {
                    path: 'register',
                    component: Register
                },
                {
                    path: 'forgot',
                    component: ForgotPassword
                },
            ]
        },
        {
            path: `${publicPath}films/:id`, component: Film,

            children: [
                {
                    path: 'login',
                    component: Login
                },
                {
                    path: 'register',
                    component: Register
                },
                {
                    path: 'forgot',
                    component: ForgotPassword
                },
            ]
        },
        {
            path: `${publicPath}search`, component: FilmsSearch,

            children: [
                {
                    path: 'login',
                    component: Login
                },
                {
                    path: 'register',
                    component: Register
                },
                {
                    path: 'forgot',
                    component: ForgotPassword
                },
            ]
        },
        {
            path: `${publicPath}playlists`, component: PlaylistsHomepage,

            children: [
                {
                    path: 'login',
                    component: Login
                },
                {
                    path: 'register',
                    component: Register
                },
                {
                    path: 'forgot',
                    component: ForgotPassword
                },
            ]
        },
        {
            path: `${publicPath}profile`, component: Profile,

            children: [
                {
                    path: 'login',
                    component: Login
                },
                {
                    path: 'register',
                    component: Register
                },
                {
                    path: 'forgot',
                    component: ForgotPassword
                },
            ]
        },
    ]
});
