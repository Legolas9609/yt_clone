<template>
    <b-col class="m-0 ">
        <b-spinner label="Spinning" type="grow" v-if="isLoading"></b-spinner>
        <b-row class="mt-5" v-if="isLoading === false">
            <b-col v-show="playlist.films.length > 0  &&
                           playlist.thumbnail !== notFoundFilmsThumbnail &&
                           playlist.loaded"  class="mb-5 film-preview-holder" cols="6"
                   lg="2" md="3" siz sm="4"
                   v-on:click="handleClickPlaylist(playlist)"
                   v-for="(playlist, index) in playlists" :key="`playlist-${index}`" >
                <div  class="embed-responsive embed-responsive-16by9 z-depth-1-half container m-container">
                     <PlaylistThumbnail  @loaded="onPlaylistThumbnailLoaded($event, index)"
                                       v-bind:thumbnails="playlist.thumbnails" />

                    <b-col v-if="playlist.films.length > 0  &&
                                 playlist.thumbnail !== notFoundFilmsThumbnail &&
                                 playlist.loaded" class="middle">
                        <b-row cols="12" sm="12" class="d-flex justify-content-center">
                            <font-awesome-icon icon="play"/>
                        </b-row>
                        <b-row cols="12" sm="12" class="d-flex justify-content-center">
                            <small class="font-weight-bold">Play all</small>
                        </b-row>
                    </b-col>
                </div>

                <b-col class="p-0 d-flex" cols="12" sm="12">
                    <span v-line-clamp:20="2" class="mb-1 mt-1 title justify-content-start">
                        {{playlist.title}}
                    </span>
                </b-col>
                <p class="mb-0 author-nick">
                    <small>{{playlist.authorUsername}}</small>
                </p>

            </b-col>
        </b-row>
        <router-view></router-view>
    </b-col>

</template>

<script>
    import service from '../service';
    import {config} from "../config";
    import EventBus from "../event-bus";
    import {isLoggedIn} from "../helpers";
    import PlaylistThumbnail from "./PlaylistThumbnail";
    import {publicPath} from "../../vue.config";

    export default {
        name: "PlaylistsHomepage",
        components: {PlaylistThumbnail},
        data() {
            return {
                playlists: [],
                apiUrl: config.apiUrl,
                isLoggedIn: false,
                isLoading: true,
                notFoundFilmsThumbnail: 'placeholder.png'
            }
        },
        methods: {
            onPlaylistThumbnailLoaded(value, index) {
                console.log(value);
                this.playlists[index].thumbnail = value;
                this.playlists[index].loaded = true;
                this.playlists = this.playlists.filter(_playlist => _playlist.id !== null);

            },
            handleImageError(playlist, index) {
                const _index = playlist.thumbnails.indexOf(playlist.thumbnail);
                playlist.thumbnail = playlist.thumbnails[_index + 1];
                this.playlists[index] = playlist;
                this.playlists = this.playlists.filter(_playlist => _playlist.id !== index);

            },
            handleClickPlaylist(playlist) {
                if (playlist.films.length > 0 &&
                    playlist.thumbnail !== this.notFoundFilmsThumbnail) {
                    const _index = playlist.thumbnails.indexOf(playlist.thumbnail);
                    const id = playlist.films[_index];
                    this.$router.push(`${publicPath}films/${id}?list=${playlist.id}`)
                }
            },
        },
        async created() {
            this.isLoggedIn = isLoggedIn();
            await service.getAllPlaylists()
                .then(response => {
                    this.playlists = response.data;
                    this.playlists.forEach(_playlist => {
                        _playlist.thumbnails = [];
                        _playlist.films.forEach(_film => {
                            _playlist.thumbnails.push(`${this.apiUrl}films/${_film}/thumbnail/preview`);
                        });
                        _playlist.thumbnails.push('placeholder.png');
                        _playlist.thumbnail = _playlist.thumbnails[0];
                    });
                    this.playlists = this.playlists.filter(_playlist => _playlist.films.length > 0);
                })
                .catch(error => {
                    console.log(error);
                    this.error = "Failed to load playlists"
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
