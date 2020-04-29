<template>
    <b-col class="p-lg-0 p-md-0 p-4">
        <b-col :key="`_film-${index}`"
               class="film-preview-holder p-0 mb-4 m-container"
               v-for="(_film, index) in films.filter(_f => _f.id !== film.id)">
            <b-row @click="handleFilmChooseNavbar($event, _film.id)" class="m-0">
                <b-col class="p-0" cols="11" sm="11" style="padding-top: 4px !important;">
                    <b-row class="p-0 m-0">
                    <b-col cols="7" sm="7" class="p-0 pr-4">
                        <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
                            <img :src="`${apiUrl}films/${_film.id}/thumbnail/poster`" alt=""
                                 class="image embed-responsive-item"
                                 id="s-c-1"/>
                            <font-awesome-icon class="middle" icon="play"/>
                        </div>
                    </b-col>
                    <b-col class="p-0" cols="5" sm="5">
                        <b-row class="m-0">
                            <b-col class="p-0 title" cols="10" sm="10">
                                <span class="mb-1" v-line-clamp:20="1">
                                    {{_film.title}}
                                </span>
                            </b-col>

                        </b-row>
                        <p class="mb-0 author-nick">
                            <small>{{_film.authorUsername}}</small>
                        </p>
                        <p class="film-views">
                            <small>{{_film.meta.views}} views</small>
                        </p>
                    </b-col>
                    </b-row>
                </b-col>
                <b-col class="p-0 pr-2 d-flex justify-content-end "
                       cols="1"
                       sm="1"
                       style="line-height: 0 !important;">
                    <AddToPlaylistButton v-bind:film-id="_film.id" v-bind:is-logged-in="isLoggedIn"/>
                </b-col>
            </b-row>
        </b-col>
    </b-col>
</template>

<script>
    import {config} from "../config";
    import AddToPlaylistButton from "./AddToPlaylistButton";
    import EventBus from "../event-bus";
    import {isLoggedIn} from "../helpers";
    import {publicPath} from "../../vue.config";

    export default {
        name: "FilmsNavbar",
        components: {AddToPlaylistButton},
        data() {
            return {
                apiUrl: config.apiUrl,
                isLoggedIn: false,
            }
        },
        mounted() {
            EventBus.$on('logged', (arg) => {
                if (arg === 'in') {
                    this.isLoggedIn = true;
                } else if (arg === 'out') {
                    this.isLoggedIn = false;
                }
            });
            this.isLoggedIn = isLoggedIn();
        },
        props: {
            film: Object,
            films: Array
        },
        methods: {
            handleFilmChooseNavbar(event, id) {
                this.$router.push(`${publicPath}films/${id}`)
            }
        }
    }
</script>

<style>

</style>
