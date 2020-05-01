<template>
    <b-col class="p-lg-0 p-md-0 p-4" >
        <b-col :key="`_film-${index}`"
               class="film-preview-holder p-0 mb-4 m-container"
               v-for="(_film, index) in films">
            <b-row  class="m-0">
                <b-col class="p-0" cols="11" sm="11" style="padding-top: 4px !important;" @click="handleFilmChooseNavbar($event, _film.id)">
                    <b-row class="p-0 m-0">
                    <b-col cols="7" sm="7" class="p-0 pr-4">
                        <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
                            <img :src="`${apiUrl}films/${_film.id}/thumbnail/poster`"
                                 :alt="`Film added by ${_film.authorUsername}`"
                                 class="image embed-responsive-item"/>
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
                <b-col class="p-0 d-flex justify-content-end "
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
    import service from "../service";

    export default {
        name: "FilmsNavbar",
        components: {AddToPlaylistButton},
        props: {
            filmId: String,
        },
        watch: {
            filmId(newFilmId) {
                this.loadFilms(newFilmId);
            },
            isLoading(newIsLoading) {
                console.log(newIsLoading);

            },
        },
        data() {
            return {
                films: [],
                apiUrl: config.apiUrl,
                isLoggedIn: false,
                isLoading: true,
            }
        },

        mounted() {
            console.log('addaladladlld')
            EventBus.$on('logged', (arg) => {
                if (arg === 'in') {
                    this.isLoggedIn = true;
                } else if (arg === 'out') {
                    this.isLoggedIn = false;
                }
            });
            console.log(this)
        },

        async created() {
            console.log('zczxcxzcxzczxc')

            this.isLoggedIn = isLoggedIn();

            await this.loadFilms(this.filmId);

        },
        methods: {
            handleFilmChooseNavbar(event, id) {
                this.$router.push(`${publicPath}films/${id}`)
            },
            async loadFilms(id) {

                this.isLoading = true;

                await service.getAllFilms()
                    .then(response => {
                        console.log('daladldal')
                        this.films = response.data.filter(_film => _film.id !== id);
                        this.$emit('filmsLoaded')
                        this.isLoading = false;
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = "Failed to load films";

                        this.isLoading = false;
                    });
            },

        }
    }
</script>

<style>

</style>
