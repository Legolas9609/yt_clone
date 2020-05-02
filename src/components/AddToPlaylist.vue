<template>
    <div class="pt-2 playlist-add-container" style="line-height: 1.5;"
         v-on:click="handleClickAddToPlaylistComponent($event)">
        <b-row class="m-0 p-0">
            <b-col cols="8" sm="8">
                <p class="dropdown-item-my pl-2 pr-2">Save to...</p>
            </b-col>
            <b-col cols="4" sm="4" class="d-flex justify-content-end">
                <md-button v-on:click="onClose($event)"
                           aria-label="Close"
                           class="m-0 p-0" style="width: 25px; height: 25px; border-radius: 20px; min-width: auto; outline: 0">
                    <font-awesome-icon icon="times" />
                </md-button>
            </b-col>
        </b-row>
        <b-col class="mt-2 mb-3 dropdown-divider" cols="12"/>


        <b-col class="playlist-add-scroll" cols="12" sm="12"
               style="max-height: 100px; overflow-y: scroll">
            <b-col class="m-0 p-0"
                   v-if="isLoading === false">
                <b-row :key="`_playlist-${index}`"
                       class="d-flex ml-2"
                       v-for="(_playlist, index) in playlists">
                    <b-col class="m-0 p-0" cols="10" sm="10">
                        <b-form-checkbox
                                :checked="_playlist.films.includes(filmId)"
                                class="mt-1 mb-1 d-flex"
                                style="cursor: pointer"
                                v-on:change="handleAddRemoveToPlaylist(_playlist, $event)">
                        <span style="white-space: normal" v-line-clamp:20="1">
                        {{_playlist.title}}
                        </span>
                        </b-form-checkbox>
                    </b-col>
                    <b-col class="m-0 p-0 " cols="2" sm="2">
                        <md-button
                                aria-label="Change publicity"
                                class="align-self-center mr-3 d-flex align-items-center justify-content-center; "
                                   style="width: 25px; height: 25px; border-radius: 20px; margin-left: auto">

                            <font-awesome-icon icon="globe"
                                               v-if="_playlist.public"
                                               v-on:click="handleChangeIsPublic( _playlist.id, _playlist.public)"/>
                            <font-awesome-icon icon="lock"
                                               v-if="_playlist.public === false"
                                               v-on:click="handleChangeIsPublic(_playlist.id, _playlist.public)"/>
                        </md-button>
                    </b-col>
                </b-row>
            </b-col>

            <div class="d-flex justify-content-center">
                <b-spinner label="Spinning" v-if="isLoading === true"></b-spinner>
            </div>
        </b-col>

        <b-col class="mt-2 mb-3 dropdown-divider" cols="12"/>

        <p class="dropdown-item-my pl-4 pr-4">Create a new playlist</p>
        <b-form-input
                @focus="error = null"
                class="dropdown-item-my w-75 ml-auto mr-auto mb-2 mt-2"
                placeholder="Enter playlist name..."
                v-model="form.title"
        />
        <b-form-select :options="options" class="dropdown-item-my w-75 mb-2 mt-2"
                       style="margin-left: 12.5%" v-model="selected"></b-form-select>
        <b-form-invalid-feedback class="dropdown-item-my w-75 ml-auto mr-auto mb-2 mt-2">
        </b-form-invalid-feedback>
        <b-row class="m-0 mb-1 ml-4 mt-2 text-left justify-content-start">
            <b-button
                    aria-label="Create"
                    :disabled="isCreating" v-on:click="handleAddPlaylist">Create</b-button>
            <b-spinner class="ml-2" v-if="isCreating"></b-spinner>
        </b-row>

        <b-alert class="ml-4 mr-4 mt-4" show v-if="error" variant="danger">
            <span style="white-space: normal">
                {{error}}
            </span>
        </b-alert>
    </div>
</template>

<script>
    import EventBus from "../event-bus";
    import {isLoggedIn} from "../helpers";
    import service from "../service";

    export default {
        name: "AddToPlaylist",
        props: {
            filmId: String,
        },

        data() {
            return {
                isLoggedIn: false,
                isLoading: true,
                playlists: [],
                form: {
                    title: null,
                    public: true,
                    films: [],
                    removeFilms: false,
                },
                selected: 'public',
                options: ['public', 'private'],
                isCreating: false,
                error: null,
            }
        },
        async created() {
            this.isLoggedIn = isLoggedIn();
            await this.handleGetMyPlaylists();
        },
        mounted() {
            EventBus.$on('logged', (arg) => {
                if (arg === 'in') {
                    this.isLoggedIn = true;
                } else if (arg === 'out') {
                    this.isLoggedIn = false;
                }
            });
        },
        methods: {
            onClose () {
                EventBus.$emit('closed');
            },
            toast(title, message) {
                this.$root.$bvToast.toast(message, {
                    title: title,
                    toaster: 'b-toaster-bottom-left',
                    solid: true,
                    appendToast: true,
                    autoHideDelay: 1500,
                    variant: 'secondary'
                })
            },
            async handleGetMyPlaylists() {
                await service.getMyPlaylists()
                    .then(response => {
                        this.playlists = response.data;
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response);
                        } else {
                            console.log(error);
                        }
                    })
                    .finally(() => this.isLoading = false);
            },
            handleClickAddToPlaylistComponent(event) {
                this.error = null;
                event.stopPropagation();
            },
            async handleAddPlaylist() {
                this.isCreating = true;
                this.form.public = this.selected === 'public';
                await service.addPlaylist(this.form)
                    .then(response => {
                        this.playlists.push(response.data);
                        this.toast('Toast playlist',
                            `New playlist '${response.data.title}' created`);
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response);
                            this.error = error.response.data.message;
                        } else {
                            console.log(error);
                            this.error = "Cannont create playlist!";
                        }
                    }).finally(() => {
                    this.isCreating = false;
                    this.form = {
                        title: null,
                        public: true,
                        films: [],
                        removeFilms: false,
                    }
                });
            },
            async handleAddRemoveToPlaylist(playlist, remove) {
                const id = playlist.id;
                const _films = [this.filmId];
                const _form = {films: _films, removeFilms: !remove};
                await service.updatePlaylist(id, _form)
                    .then(response => {
                        console.log(response);
                        EventBus.$emit('playlist_changed', remove ? 'add' : 'remove', response.data);
                        EventBus.$emit('playlist_changed_profile', response.data);
                        const value = remove ? 'added to' : 'removed from';
                        this.toast('Toast playlist',
                            `Film ${value} playlist '${playlist.title}'`);
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response);
                        } else {
                            console.log(error);
                        }
                    });
            },
            async handleChangeIsPublic(id, _public) {
                const _form = {isPublic: !_public};
                await service.updatePlaylist(id, _form)
                    .then(response => {
                        console.log(response);
                        console.log(this.playlists[this.playlists.findIndex(el => el.id === id)]);
                        this.playlists[this.playlists.findIndex(el => el.id === id)].public = response.data.public;
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response);
                        } else {
                            console.log(error);
                        }
                    });
            }
        }
    }
</script>

<style>

    .custom-control-label {
        cursor: pointer;
    }

    .custom-control-input {
        cursor: pointer;
    }

    .my-ripple:hover {
        opacity: .5;
        background-color: currentColor;
    }

    .md-button {
        min-width: auto !important;
        outline: none !important;
    }
</style>
