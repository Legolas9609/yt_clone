
<template>
    <b-col class="m-0 ">
        <b-spinner label="Spinning" type="grow" v-if="isLoading"></b-spinner>
        <b-row v-if="isLoading === false">
            <b-col siz v-for="(film, index) in films" :key="`film-${index}`" cols="6" sm="4" md="3" lg="2"
                   class="mb-4 film-preview-holder">
                <div class="embed-responsive embed-responsive-16by9 z-depth-1-half container m-container"
                     @click="handleFilmChooseFilmsHomepage(film.id)">
                    <img :alt="`Film added by ${film.authorUsername}`" :src="`${apiUrl}films/${film.id}/thumbnail/preview`" class="embed-responsive-item image pr-2"/>
                    <font-awesome-icon icon="play"  class="middle"/>
                </div>
                <b-row class="m-0 mt-2">
                    <b-col cols="10" sm="10" class="title p-0">
                        <span v-line-clamp:20="2">{{film.title}}</span>

                    </b-col>
                    <b-col class="p-0 d-flex justify-content-end"
                           style="line-height: 0 !important;"
                           cols="2"
                           sm="2">
                        <AddToPlaylistButton v-bind:film-id="film.id" v-bind:is-logged-in="isLoggedIn"/>
                    </b-col>
                </b-row>
                <p class="mb-0 author-nick">
                    <small>{{film.authorUsername}}</small>
                </p>
                <p class="mb-0 film-views">
                    <small>{{film.meta.views}} views</small>
                </p>
            </b-col>
        </b-row>
        <router-view></router-view>
    </b-col>
</template>

<script>
    import service from '../service';
    import {config} from "../config";
    import AddToPlaylistButton from "./AddToPlaylistButton";
    import EventBus from "../event-bus";
    import {isLoggedIn} from "../helpers";
    import {publicPath} from "../../vue.config";

    export default {

        name: "FilmsHomepage",
        components: {AddToPlaylistButton},
        data() {
            return {
                films: [],
                apiUrl: config.apiUrl,
                isLoggedIn: false,
                isLoading: true ,
            }
        },
        methods: {
            handleFilmChooseFilmsHomepage(id) {
               this.$router.push(`${publicPath}films/${id}`)
            },
        },
        async created() {

            this.isLoggedIn = isLoggedIn();

            this.isLoading = true;

            await service.getAllFilms()
                .then(response => {
                    this.films = response.data
                })
                .catch(error => {
                    console.log(error)
                    this.error = "Failed to load todos"
                })
                .finally(() => this.isLoading = false)
        },
        mounted() {
            EventBus.$on('logged', (arg) => {
                if (arg === 'in') {
                    this.isLoggedIn = true;
                } else if (arg === 'out') {
                    this.isLoggedIn = false;
                }
            });
        }
    }
</script>

<style scoped>


</style>
