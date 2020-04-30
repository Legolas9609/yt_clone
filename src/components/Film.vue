<template>
    <b-col>
        <b-row v-if="loading === false">
            <b-col md="8">
                <b-col class="mt-4" cols="12">
                    <div class="embed-responsive embed-responsive-16by9 z-depth-1-half " ref="filmVideoRef"
                         style="width: 100%">
                        <video :poster="`${apiUrl}films/${film.id}/thumbnail/poster`"
                               :src="`${apiUrl}films/${film.id}/video`"
                               class="embed-responsive-item" controls preload="none"
                        >
                        </video>
                    </div>
                </b-col>
                <b-col class="pl-3 pr-3 mt-4" sm="12">
                    <b-row>
                        <b-col class="text-justify" sm="12">
                            <p class="font-weight-bold">{{this.film.title}}</p>
                        </b-col>
                        <b-col class="text-justify" cols="4" sm="4">
                            <p style="white-space: pre-wrap;">
                                <font-awesome-icon icon="eye"/>
                                &ensp;
                                {{this.film.meta.views | addSpace}}
                            </p>
                        </b-col>
                        <b-col class="text-right" cols="4" sm="4">
                            <p style="white-space: pre-wrap;">
                                <font-awesome-icon :class="userMeta.liked ? 'blue': ''" icon="thumbs-up"
                                                   style="cursor: pointer"
                                                   v-on:click="handleLike('liked')"/>
                                &ensp;
                                {{this.film.meta.likes | addSpace}}
                            </p>
                        </b-col>
                        <b-col class="text-justify" cols="4" sm="4">
                            <p style="white-space: pre-wrap;">
                                <font-awesome-icon :class="userMeta.disliked ? 'blue': ''" icon="thumbs-down"
                                                   style="cursor: pointer"
                                                   v-on:click="handleLike('disliked')"/>
                                &ensp;{{this.film.meta.dislikes | addSpace}}
                            </p>
                        </b-col>
                        <b-col class="mt-4 mb-4 dropdown-divider" sm="12"/>

                        <b-col class="text-justify" sm="12">

                            <span>
                                 <read-more more-str="read more" :text="film.description" link="#" less-str="read less" :max-chars="100"></read-more>

                            </span>
                        </b-col>
                    </b-row>
                </b-col>

                <b-col class="p-0 mt-4 d-none d-md-block">
                    <Comments  @deleted="handleDeleteComment"
                               v-if="width >= 768" v-bind:comments="comments" v-bind:film-id="film.id" v-bind:is-logged-in="isLoggedIn"/>
                </b-col>
            </b-col>
            <b-col class="p-0 mt-4 " cols="12" md="4">
                <Playlist v-bind:film-id="filmId" v-bind:film-video-height="this.filmVideoHeight" v-bind:list-id="listId"
                          v-if="listId"/>
                <FilmsNavbar v-bind:film="film" v-bind:films="films"/>
            </b-col>
            <!--Wyswietlanie komentarzy od filmami jesli mala szerokosc-->
            <b-col class="p-0 mt-4 d-block d-md-none" cols="12">
                <Comments @deleted="handleDeleteComment"
                        v-if="width < 768" v-bind:comments="comments" v-bind:film-id="film.id" v-bind:is-logged-in="isLoggedIn"/>
            </b-col>

        </b-row>
        <b-spinner label="Spinning" type="grow" v-if="loading"></b-spinner>
        <router-view></router-view>
    </b-col>
</template>

<script>
    import service from '../service';
    import {config} from "../config";
    import Comments from "./Comments";
    import FilmsNavbar from "./FilmsNavbar";
    import {displayDate, isLoggedIn} from "../helpers";
    import EventBus from "../event-bus";
    import Playlist from "./Playlist";

    export default {
        name: "Film",
        components: {FilmsNavbar, Comments, Playlist},
        data: function () {
            return {
                film: null,
                listId: null,
                filmId: null,
                films: [],
                comments: [],
                apiUrl: config.apiUrl,
                loading: true,
                userMeta: {
                    liked: false,
                    disliked: false,
                },
                filmVideoHeight: 0,
                width: window.screen.width,
                isLoggedIn: false,
            }
        },
        methods: {
            handleDeleteComment(commentsAfterDelete) {
                this.comments = commentsAfterDelete;
            },
            loadFilm(id) {
                service.updateFilmMetaViews(id, {viewed: true})
                    .then(response => {
                        this.userMeta = {
                            disliked: false,
                            liked: false
                        };
                        this.film = response.data;
                        this.films[this.films.findIndex(el => el.id === this.film.id)] = this.film;
                        this.checkUserLikes();
                        service.getAllCommentsByFilmId(id)
                            .then(response => {
                                this.comments = response.data;
                                this.comments.map(comment => comment.createdDate = displayDate(comment.createdDate))
                            })
                            .catch(error => {
                                console.log(error);
                                this.error = "Failed to load comments"
                            })
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = "Failed to load film"
                    })
                    .finally(() => this.loading = false)
            },
            checkUserLikes() {
                if (isLoggedIn()) {

                    service.getMe()
                        .then(response => {

                            this.userMeta = {
                                disliked: false,
                                liked: false
                            };

                            if (response.data.meta.liked.indexOf(this.film.id) > -1) {
                                this.userMeta.liked = true;
                            } else if (response.data.meta.disliked.indexOf(this.film.id) > -1) {
                                this.userMeta.disliked = true;
                            }
                        })
                        .catch(error => {
                            console.log(error.response);
                            this.error = "Failed to load my data"
                        });
                }
            },
            handleLike(like) {

                service.updateFilmMetaLikes(this.film.id, {liked: like})
                    .then(response => {
                        this.film = response.data;
                        if (like === 'liked') {
                            this.userMeta.liked = !this.userMeta.liked;
                            this.userMeta.disliked = false;
                        } else {
                            this.userMeta.disliked = !this.userMeta.disliked;
                            this.userMeta.liked = false;
                        }
                        this.films[this.films.findIndex(el => el.id === this.film.id)] = this.film;
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = "Failed to load film"
                    })
                    .finally(() => this.loading = false)
            },
            handleResize() {
                this.filmVideoHeight = this.$refs.filmVideoRef.clientHeight;
                const width  = window.innerWidth || document.documentElement.clientWidth ||
                    document.body.clientWidth;
                this.width = width;
            }

        },
        beforeRouteUpdate(to, from, next) {

            this.loadFilm(to.params.id);
            this.listId = to.query.list;
            this.filmId = to.params.id;
            next()
        },
        updated() {
            this.$nextTick(function () {
                this.filmVideoHeight = this.$refs.filmVideoRef.clientHeight;
            })
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize)
        },
        async mounted() {

            const width  = window.innerWidth || document.documentElement.clientWidth ||
            document.body.clientWidth;
            this.width = width;

            console.log('mounted film ');

            window.addEventListener('resize', this.handleResize);
            EventBus.$on('logged', (arg) => {
                if (arg === 'in') {
                    this.isLoggedIn = true;
                } else if (arg === 'out') {
                    this.isLoggedIn = false;
                    this.userMeta = {
                        disliked: false,
                        liked: false
                    };
                }
            });

            this.isLoggedIn = isLoggedIn();
            const id = this.$route.params.id;
            this.listId = this.$route.query.list;
            this.filmId = id;
            await service.updateFilmMetaViews(id, {viewed: true})
                .then(response => {
                    this.film = response.data;
                    this.checkUserLikes();
                })
                .catch(error => {
                    console.log(error);
                    this.$router.back();
                    this.error = "Failed to update film"
                })
                .finally(() => {
                    console.log('Film finally')
                });


            await service.getAllCommentsByFilmId(this.film.id)
                .then(response => {
                    this.comments = response.data;
                    this.comments.map(comment => comment.createdDate = displayDate(comment.createdDate))
                })
                .catch(error => {
                    console.log(error);
                    this.error = "Failed to load comments"
                }).finally(() => {
                    console.log('Comments finally')
                });

            await service.getAllFilms()
                .then(response => {
                    this.films = response.data;
                    this.films[this.films.findIndex(el => el.id === this.film.id)] = this.film;
                })
                .catch(error => {
                    console.log(error);
                    this.error = "Failed to load films"
                })
                .finally(() => {
                    this.loading = false;
                    console.log('Films finally')
                })
        }
    }
</script>

<style scoped>
    .blue {
        color: #06538b;
    }

</style>
