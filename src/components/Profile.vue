<template>
    <b-col class="m-0 ">
    <b-col class="m-0 " v-if="isLoading === false">
        <b-row class="mt-5">
            <b-col :key="`film-${index}`" class="mb-5 m-container film-preview-holder playlist-remove-container"
                   cols="6"
                   lg="2" md="3" siz sm="4" v-for="(film, index) in films">
                <div class="embed-responsive embed-responsive-16by9 container"
                     @click="handleFilmChoose(film.id)">
                    <img alt="" :src="`${apiUrl}films/${film.id}/thumbnail/preview`" class="embed-responsive-item image pr-2"/>
                    <font-awesome-icon class="middle" icon="play"/>
                </div>
                <b-row class="p-0 m-0 mt-1">
                    <b-col class="p-0 m-0 text-justify pr-2" cols="8" sm="8">
                        <b-col class="p-0 mb-2">
                            <span class="mb-1 mt-1 title" v-line-clamp:20="2">{{film.title}}</span>
                        </b-col>
                        <p class="mb-0 mt-1 film-views">
                            <small>{{film.meta.views}} views</small>
                        </p>
                    </b-col>
                    <b-col class="p-0 m-0 text-justify" cols="4" sm="4">
                        <b-row  class="p-0 m-0">
                            <b-col class="p-0 d-flex justify-content-end"
                                   cols="6"
                                   sm="6"
                                   style="line-height: 0 !important;">
                                <AddToPlaylistButton v-bind:film-id="film.id" v-bind:is-logged-in="isLoggedIn"/>
                            </b-col>
                        <b-col  :class="isMobile ? 'playlist-remove-holder-mobile' : 'playlist-remove-holder'"
                                v-on:click="handleRemoveFilm(film.id)"
                                class="p-0 m-0
                                justify-content-end  d-flex justify-content-end
                                align-self-center
                                align-items-center center-vertically"
                               cols="6"
                               sm="6"
                               style="margin-left: auto; height: 25px; width: 25px !important; line-height: 0 !important">
                            <md-button class="m-0 p-0"
                                       aria-label="Delete"
                                       style="width: 25px; height: 25px; border-radius: 20px">

                                <font-awesome-icon class="fa-sm" icon="trash-alt"/>
                            </md-button>
                        </b-col>
                        </b-row>

                    </b-col>
                </b-row>
            </b-col>

            <b-col :key="`playlist-${index}`" class="mb-5 playlist-remove-container m-container"
                   cols="6" lg="2" md="3" sm="4" v-for="(playlist, index) in playlists">
                <div class="embed-responsive embed-responsive-16by9 z-depth-1-half container"
                   v-on:click="handleClickPlaylist(playlist)">

                   <PlaylistThumbnail  @loaded="onPlaylistThumbnailLoaded($event, index)"
                                       v-bind:thumbnails="playlist.thumbnails" />

                    <b-col v-if="films.length > 0  &&
                                 playlist.thumbnail !== notFoundFilmsThumbnail &&
                                 playlist.loaded" class="middle">
                        <b-row class="d-flex justify-content-center" cols="12" sm="12">
                            <font-awesome-icon icon="play"/>
                        </b-row>
                        <b-row class="d-flex justify-content-center" cols="12" sm="12">
                            <small class="font-weight-bold">Play all</small>
                        </b-row>
                    </b-col>

                </div>
                <b-row class="p-0 m-0 mt-1">
                    <b-col class="p-0 m-0 text-justify" cols="10" sm="10">
                                <span  v-line-clamp:20="2" class="mb-1 mt-1 title">
                                    {{playlist.title}}
                                </span>
                        <p class="mb-0 author-nick">
                            <small>{{playlist.authorUsername}}</small>
                        </p>

                    </b-col>
                    <b-col class="p-0 m-0 text-justify" cols="2" sm="2">
                        <b-col :class="isMobile ? 'playlist-remove-holder-mobile' : 'playlist-remove-holder'"
                                class="m-0 p-0"
                              v-on:click="handleRemovePlaylist(playlist.id)">
                            <md-button class="m-0 p-0"
                                       aria-label="Delete"
                                       style="width: 25px; height: 25px; border-radius: 20px">

                                <font-awesome-icon class="fa-sm" icon="trash-alt"/>
                            </md-button>
                        </b-col>
                    </b-col>
                </b-row>

            </b-col>

        </b-row>
    </b-col>

        <b-spinner label="Spinning" type="grow" v-if="isLoading"></b-spinner>
        <router-view></router-view>
    </b-col>
</template>

<script>
    import {config} from "../config";
    import EventBus from "../event-bus";
    import {isLoggedIn, isMobile} from "../helpers";
    import service from "../service";
    import AddToPlaylistButton from "./AddToPlaylistButton";
    import PlaylistThumbnail from "./PlaylistThumbnail";
    import {publicPath} from "../../vue.config";

    export default {
        name: "Profile",
        components: {AddToPlaylistButton, PlaylistThumbnail},
        data() {
            return {
                playlists: [],
                films: [],
                apiUrl: config.apiUrl,
                isLoggedIn: false,
                isLoading: true,
                isMobile: isMobile(),
                notFoundFilmsThumbnail: 'placeholder.png'
            }
        },
        beforeDestroy(){
            EventBus.$off('logged_out_profile');
            EventBus.$off('playlist_changed_profile');
        },
        async created() {
            this.isLoggedIn = await isLoggedIn();

            await service.getMyPlaylists()
                .then(response => {
                    this.playlists = response.data;
                    this.playlists.forEach(_playlist => {
                        _playlist.thumbnails = [];
                        _playlist.films.forEach(_film => {
                            _playlist.thumbnails.push(`${this.apiUrl}films/${_film}/thumbnail/preview`);
                        });
                        _playlist.thumbnails.push(this.notFoundFilmsThumbnail);
                        _playlist.thumbnail = _playlist.thumbnails[0];
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.error = "Failed to load playlists profile"
                });

            await service.getMyFilms()
                .then(response => {
                    this.films = response.data
                })
                .catch(error => {
                    console.log(error);
                    this.error = "Failed to load films profile"
                })
                .finally(() => this.isLoading = false);
        },
        async mounted() {
            EventBus.$on('logged_out_profile', () => {
                    this.isLoggedIn = false;
                    this.$router.push(`${publicPath}`);
            });

            EventBus.$on('playlist_changed_profile', (playlist) => {
                playlist.thumbnails = [];
                playlist.films.forEach(_film => {
                        playlist.thumbnails.push(`${this.apiUrl}films/${_film}/thumbnail/preview`);
                });
                playlist.thumbnails.push(this.notFoundFilmsThumbnail);
                playlist.thumbnails.forEach(_thumbnail => _thumbnail +  "?" + Date.now());
                playlist.thumbnail = playlist.thumbnails[0];
                this.playlists[this.playlists.findIndex(el => el.id === playlist.id)] = playlist;
                this.playlists = this.playlists.filter(_playlist => _playlist.id !== null);
            });


        },
        methods: {

            onPlaylistThumbnailLoaded(value, index) {
                console.log(value);
                this.playlists[index].thumbnail = value;
                this.playlists[index].loaded = true;
                this.playlists = this.playlists.filter(_playlist => _playlist.id !== null);

            },
            handleFilmChoose(id) {
               this.$router.push(`${publicPath}films/${id}`)
            },
            handleClickPlaylist(playlist) {
                if (playlist.films.length > 0 &&
                    playlist.thumbnail !== this.notFoundFilmsThumbnail) {
                    const _index = playlist.thumbnails.indexOf(playlist.thumbnail);
                    const id = playlist.films[_index];
                    this.$router.push(`${publicPath}films/${id}?list=${playlist.id}`)
                }
            },
            async handleRemovePlaylist(id) {
                await service.removePlaylist(id)
                    .then(() => {
                        this.playlists = this.playlists.filter(_playlist => _playlist.id !== id);
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response);
                        } else {
                            console.log(error);
                        }
                    });
            },
            async handleRemoveFilm(id) {
                await service.removeFilm(id)
                    .then(() => {
                        this.playlists.forEach(_playlist => {
                            const _index = _playlist.films.indexOf(id);
                            if(_index > 0) {
                               _playlist.films.splice(_index, 1);
                               _playlist.thumbnails.splice(_index, 1);
                               _playlist.thumbnails.forEach(_thumbnail => _thumbnail +  "?" + Date.now());
                            }
                        });
                        this.playlists = this.playlists.filter(_playlist => _playlist.id !== null);
                        this.films = this.films.filter(_film => _film.id !== id);
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response);
                        } else {
                            console.log(error);
                        }
                    });
            },
        }
    }
</script>

<style scoped>

    .playlist-remove-holder-mobile {
        opacity: 1;
        color: #606060;
    }
    .playlist-remove-holder {
        opacity: 0;
        transition: all .2s ease-in-out;
        color: #606060;
    }

    .playlist-remove-container:hover .playlist-remove-holder {
        opacity: 0.6;
    }

    .playlist-remove-container:hover .playlist-remove-holder:hover {
        opacity: 1;
        cursor: pointer;
    }

</style>
