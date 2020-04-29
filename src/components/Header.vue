<template>
    <b-navbar bg="light" class="mb-5" style="z-index: 10" toggleable="lg" type="light" variant="light">
        <b-col cols="6" md="4" sm="2" style="display:flex; justify-content: left">
            <router-link :to="`${publicPath}`">
                <b-navbar-brand>
                    <b-navbar-brand>
                        <img alt=""
                             style="border-radius: 20px; width: 30px; height: 30px"
                             src="https://www.bigstockphoto.com/images/homepage/module-1.jpg"/>
                    </b-navbar-brand>
                    <p class="d-none d-md-inline" style="cursor: pointer;">FilmApp</p>
                </b-navbar-brand>
            </router-link>
        </b-col>
        <b-col class="order-2 order-sm-1" cols="12" lg="4" md="6"
               sm="8"
               style="display:flex; justify-content: center; padding-right: 0; padding-left: 0">
            <b-col class=" d-sm-flex d-none justify-content-center">
                <SearchAutoComplete ref="searchAutocomplete_sm" v-bind:width="``"/>
                <b-button @click="handleRedirect('sm')"
                          class="d-sm-inline ml-1"
                          variant="light">
                    <font-awesome-icon icon="search"/>
                </b-button>
            </b-col>
            <b-row class="d-flex d-sm-none" style="width: 100%; margin: 0">
                <b-col cols="9" sm="10" style="padding-right: 0">
                    <SearchAutoComplete ref="searchAutocomplete_xs" v-bind:width="`width: auto`"/>
                </b-col>
                <b-col class="justify-content-end d-flex pr-2" cols="3" sm="2">
                    <b-button @click="handleRedirect('xs')"
                              class="d-sm-inline ml-1"
                              type="submit"
                              variant="light">
                        <font-awesome-icon icon="search"/>
                    </b-button>
                </b-col>

            </b-row>
        </b-col>

        <b-navbar-toggle class="order-1 order-sm-2" target="login-collapse"></b-navbar-toggle>


        <b-collapse class="order-3 order-sm-2 pt-3 pt-lg-0" id="login-collapse" is-nav>

            <b-nav class="d-inline-block d-lg-flex justify-content-lg-end text-justify" style="width: 100%;">
                <b-nav-item class="pr-2 pl-2 m-nav-link align-self-center" eventKey="playlists" @click="handleShowPlaylists">Playlists</b-nav-item>
                <b-nav-item class="pr-2 pl-2 m-nav-link align-self-center" eventKey="add_film"  @click="handleAddFilm">Add</b-nav-item>
                <b-nav-item class="pr-2 pl-2 m-nav-link align-self-center" eventKey="login" v-if="!isLoggedIn" @click="handleLogin($event)">
                    Login
                </b-nav-item>

                <b-nav-item class="pr-2 pl-2 m-nav-link" v-if="isLoggedIn">
                    <b-dropdown no-caret right  variant="link" class="m-dropdown d-none d-lg-block">
                        <template v-slot:button-content>
                            <md-avatar class="md-avatar-icon">
                                <md-ripple>{{username}}</md-ripple>
                            </md-avatar>
                        </template>
                        <b-dropdown-item v-on:click="handleProfileClick($event)">Profile</b-dropdown-item>
                        <b-dropdown-item @click="handleLogout($event)">Logout</b-dropdown-item>
                    </b-dropdown>
                    <b-dropdown no-caret  variant="link" class="m-dropdown d-block d-lg-none">
                        <template v-slot:button-content>
                            <md-avatar class="md-avatar-icon">
                                <md-ripple>{{username}}</md-ripple>
                            </md-avatar>
                        </template>
                        <b-dropdown-item v-on:click="handleProfileClick($event)">Profile</b-dropdown-item>
                        <b-dropdown-item  @click="handleLogout($event)">Logout</b-dropdown-item>
                    </b-dropdown>
                </b-nav-item>
            </b-nav>

        </b-collapse>


    </b-navbar>
</template>

<script>
    import {config} from "../config";
    import SearchAutoComplete from "./SearchAutoComplete";
    import EventBus from '../event-bus';
    import {getUsername} from "../helpers";
    import {publicPath} from "../../vue.config";

    export default {
        name: "Header",
        components: {SearchAutoComplete},
        data() {
            return {
                apiUrl: config.apiUrl,
                isLoggedIn: false,
                username: "",
                publicPath: publicPath
            }
        },
        mounted() {
            EventBus.$on('logged', (arg) => {
                if (arg === 'in') {
                    this.isLoggedIn = true;
                }else if (arg === 'out') {
                    this.isLoggedIn = false;
                }

                this.username = getUsername();
            });

            if (localStorage.getItem('token'))
                this.isLoggedIn = true;

            this.username = getUsername();

        },
        methods: {
            handleLogin(event) {
                event.stopPropagation();
                if (!this.$route.path.includes('login') &&
                    !this.$route.path.includes('register') &&
                    !this.$route.path.includes('forgot') &&
                    !this.$route.path.includes('reset'))
                        this.$router.push({path: 'login', append: true, query: this.$route.query})
            },
            handleLogout(event) {
                event.stopPropagation();
                if (localStorage.getItem('token')){
                    localStorage.removeItem('token');
                }
                EventBus.$emit('logged', 'out');
                EventBus.$emit('logged_out_profile');
            },
            handleProfileClick() {
                this.$router.push(`${publicPath}profile`)
            },
            handleAddFilm: function () {
                this.$router.push(`${publicPath}add`)
            },
            handleShowPlaylists: function () {
                this.$router.push(`${publicPath}playlists`)
            },
            handleRedirect(ref) {
                if (ref === 'xs')
                    this.$refs.searchAutocomplete_xs.handleRedirect();
                else
                    this.$refs.searchAutocomplete_sm.handleRedirect();

            }
        }
    }
</script>

<style >
    .m-dropdown .dropdown-menu {
        -webkit-box-shadow: 0px 18px 22px 5px rgba(0, 0, 0, 0.7);
        box-shadow: 0px 18px 22px 5px rgba(0, 0, 0, 0.7);
    }

    .btn-link:hover {
        text-decoration: none;
    }

    .btn-link:focus {
        text-decoration: none;
    }
</style>
