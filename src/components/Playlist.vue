<template>
    <b-col class="p-0 mb-5" v-if="isLoading === false && playlist" :style="`height:${sizes.height}px`"
           style="overflow-y: scroll; overflow-x: hidden">
        <b-col class="playlist-remove-container pt-2 pb-2 playlist-header" sm="12" ref="playlistHeader">
            <b-row class="m-0 p-0 d-flex">
                <b-col class="m-0 p-0 text-justify" cols="10" sm="10">
                    <p class="mb-1">{{playlist.title}}</p>
                    <small>{{playlist.authorUsername}}</small>
                    <small class="playlist-index">
                        {{films.length > 0 ? currentFilmIndex + 1 : 0}}/{{this.films.length}}
                    </small>
                </b-col>
                <b-col class="playlist-remove-holder m-0 p-0 text-center
                              d-flex
                              justify-content-center
                              justify-content-end
                              align-self-center
                              align-items-center center-vertically"
                       cols="2"
                       sm="2"
                       style="height: 24px; width: 24px" v-if="owner === playlist.authorID">
                    <md-button class="p-0 d-flex justify-content-center align-items-center"
                               aria-label="Remove"
                              v-on:click="handleRemovePlaylist"
                              style="height: 24px; width: 24px; border-radius: 20px">
                        <font-awesome-icon icon="trash-alt"/>
                    </md-button>
                </b-col>
            </b-row>
        </b-col>
        <b-col class="p-0 playlist-container playlist-item-container" cols="12" sm="12"
               :style="`height:${sizes.height - sizes.headerHeight}px`">
            <b-row class="pt-3"></b-row>
            <b-row :key="`playlist-${index}`"
                   @click="handleFilmChoosePlaylist(film.id)"
                   class="m-0 p-0 playlist-remove-container pt-2 pb-2 m-container d-flex" cols="12"
                   siz sm="12" v-for="(film, index) in films">
                <b-col cols="10" sm="10">
                    <b-row>
                        <b-col class="text-center justify-content-center d-flex align-items-center p-0 pl-1"
                               cols="1" sm="1">

                            <small v-if="currentFilmIndex === index">
                                <font-awesome-icon icon="play"/>
                            </small>
                            <small v-if="currentFilmIndex !== index">{{index + 1}}</small>
                        </b-col>
                        <b-col class="pr-2 pl-2" cols="6" sm="6">
                            <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
                                <img :src="film.thumbnail"
                                     :alt="`Film added by ${film.authorUsername}`"
                                     class="image embed-responsive-item"/>
                                <font-awesome-icon class="middle" icon="play"/>
                            </div>
                        </b-col>
                        <b-col class="p-0 text-justify" cols="5" sm="5">
                            <span class="mb-0 title font-weight-bold" v-line-clamp:20="1">
                                {{film.title}}
                            </span>
                            <p class="mb-1 author-nick" v-line-clamp:20="1">
                                <small>{{film.authorUsername}}</small>
                            </p>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col class="playlist-remove-holder p-0 m-0 pr-2 d-flex
                              justify-content-end align-items-center"
                       cols="2"
                       sm="2" v-if="owner === playlist.authorID">
                    <md-button class=" p-0 m-0" style="height: 20px; width: 20px; border-radius: 20px"
                               aria-label="Remove"
                              v-on:click="handleRemoveFilmFromPlaylist($event, film.id)">
                        <font-awesome-icon class="fa-sm" icon="trash-alt"/>
                    </md-button>
                </b-col>
            </b-row>
            <b-row class="pb-3"></b-row>
        </b-col>
    </b-col>
</template>

<script>
    import EventBus from "../event-bus";
    import service from "../service";
    import {config} from "../config";
    import {getUserId, isLoggedIn} from "../helpers";
    import {publicPath} from "../../vue.config";

    export default {
        name: "Playlist",
        props: ['filmId', 'listId', 'filmVideoHeight'],
        data() {
            return {
                playlist: null,
                owner: null,
                films: [],
                apiUrl: config.apiUrl,
                isLoggedIn: false,
                isLoading: true,
                currentFilmIndex: null,
                sizes: { height: 0, headerHeight: 0 },
                content: {
                    listId: null,
                    filmId: null,
                }
            }
        },
        methods: {
            handleFilmChoosePlaylist(id) {
                this.$router.push(`${publicPath}films/${id}?list=${this.content.listId}`)
            },
            async handleLoadFilms(id) {
                await service.getPlaylistFilms(id)
                    .then(response => {
                        this.films = response.data;
                        console.log(this.films);
                        this.films.forEach(_film => {
                            _film.thumbnails = [];
                            _film.thumbnails.push(`${this.apiUrl}films/${_film.id}/thumbnail/preview`);
                            _film.thumbnails.push('placeholder.png');
                            _film.thumbnail = _film.thumbnails[0];
                        });
                        const _playlist = this.playlist;
                        this.films.sort(function (a, b) {
                            return _playlist.films.indexOf(a.id) - _playlist.films.indexOf(b.id);
                        });
                        this.currentFilmIndex = this.films.findIndex(_film => _film.id === this.content.filmId);
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = "Failed to load films"
                    }).finally(() => {
                    this.isLoading = false;
                })
            },
            async handleLoadPlaylist() {
                await service.getPlaylistById(this.content.listId)
                    .then(response => {
                        this.playlist = response.data;})
                    .catch(error => {
                        console.log(error);
                        this.playlist = null;
                        this.error = "Failed to load films"
                    });
            },
            async handleRemoveFilmFromPlaylist(event, id) {
                event.stopPropagation();
                const _films = [id];
                const _form = {films: _films, removeFilms: true};
                await service.updatePlaylist(this.playlist.id, _form)
                    .then(response => {
                        this.playlist = response.data;
                        this.films = this.films.filter(el => el.id !== id);
                        this.currentFilmIndex = this.films.findIndex(_film => _film.id === this.content.filmId);

                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response);
                        } else {
                            console.log(error);
                        }
                    });
            },
            async handleRemovePlaylist() {
                await service.removePlaylist(this.playlist.id)
                    .then(() => {
                        this.playlist = null;
                        this.films = [];
                        this.currentFilmIndex = null;
                        this.sizes = { height: 0 };
                        this.content = {
                            listId: null,
                            filmId: null,
                        }
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response);
                        } else {
                            console.log(error);
                        }
                    });
            },
        },
        watch: {
            filmVideoHeight(newFilmVideoHeight) {
                this.sizes.height = newFilmVideoHeight;
                console.log(newFilmVideoHeight)
                if (this.isLoading === false && this.playlist)
                    this.sizes.headerHeight = this.$refs.playlistHeader.clientHeight;
            },
            filmId(newFilmId) {
                this.content.filmId = newFilmId;
                if (this.playlist)
                    this.currentFilmIndex = this.films.findIndex(_film => _film.id === newFilmId);
            },
            listId(newListId) {
                this.content.listId = newListId;
                this.owner = getUserId();
                this.isLoggedIn = isLoggedIn();

                this.handleLoadPlaylist();
                this.handleLoadFilms(this.content.listId);
            }
        }, updated() {
            this.$nextTick(function () {
                this.sizes.headerHeight = this.$refs.playlistHeader.clientHeight;
            })
        },
        async created() {

            this.sizes.height = this.filmVideoHeight;

            this.content = {
                filmId: this.filmId,
                listId: this.listId
            };

            this.owner = await getUserId();
            this.isLoggedIn = await isLoggedIn();

            await this.handleLoadPlaylist();

            await this.handleLoadFilms(this.content.listId);
        },
        mounted() {


            EventBus.$on('logged', (arg) => {
                if (arg === 'in') {
                    this.isLoggedIn = true;
                    this.owner = getUserId();
                } else if (arg === 'out') {
                    this.isLoggedIn = false;
                    this.owner = null;
                }
            });

            EventBus.$on('playlist_changed', (arg, playlist) => {
                if (playlist.id === this.playlist.id) {
                    if (arg === 'remove') {
                        this.playlist = playlist;
                        this.handleLoadFilms(playlist.id);
                    } else if (arg === 'add') {
                        this.playlist = playlist;
                        this.handleLoadFilms(playlist.id);
                    }

                    this.currentFilmIndex = this.films.findIndex(_film => _film.id === this.content.filmId);
                }
            });

        }

    }
</script>

<style scoped>
    .playlist-header {
        background-color: rgba(233, 236, 239, 0.80);

    }

    .playlist-container {
        background-color: rgba(239, 242, 245, 0.88);

    }

    .playlist-index {
        color: hsla(0, 0%, 6.7%, .6);
    }

    .playlist-remove-holder {
        opacity: 0;
        transition: all .2s ease-in-out;
        color: #606060;
    }

    .playlist-item-container {
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
