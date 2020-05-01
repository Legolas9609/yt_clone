<template>
    <b-col>
        <b-row>
            <b-col md="8" v-show="isAllLoaded()">
                <b-col class="mt-4" cols="12">
                    <div class="embed-responsive embed-responsive-16by9 z-depth-1-half "
                         ref="filmVideoRef"
                         style="width: 100%">
                        <video :poster="`${apiUrl}films/${filmId}/thumbnail/poster`"
                               :src="`${apiUrl}films/${filmId}/video`"
                               class="embed-responsive-item" controls
                        >
                        </video>
                    </div>
                </b-col>
                <b-col class="pl-3 pr-3 mt-4" sm="12" v-if="film">
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
                                 <read-more :max-chars="100" :text="film.description" less-str="read less" link="#"
                                            more-str="read more"></read-more>

                            </span>
                        </b-col>
                    </b-row>
                </b-col>

                <b-col class="p-0 mt-4 d-none d-md-block" v-show="isAllLoaded()">
                    <Comments v-if="width >= 768" @commentsLoaded="handleCommentsLoaded"
                              v-bind:film-id="filmId" v-bind:is-logged-in="isLoggedIn" />
                </b-col>
            </b-col>
            <b-col class="p-0 mt-4 " cols="12" md="4" style="margin-left: auto">
                <Playlist v-bind:film-id="filmId" v-bind:film-video-height="this.filmVideoHeight"
                          v-bind:list-id="listId"
                          v-if="listId && filmVideoHeight > 0"/>
                <FilmsNavbar @filmsLoaded="handleFilmsLoaded"  v-bind:film-id="filmId"/>
            </b-col>
            <!--Wyswietlanie komentarzy od filmami jesli mala szerokosc-->
            <b-col class="p-0 mt-4 d-block d-md-none" cols="12" v-show="isAllLoaded()">
                <Comments v-if="width < 768" @commentsLoaded="handleCommentsLoaded"
                          v-bind:film-id="film.id" v-bind:is-logged-in="isLoggedIn" />
            </b-col>

        </b-row>
        <b-spinner label="Spinning" type="grow" v-if="!isAllLoaded()"></b-spinner>
        <router-view></router-view>
    </b-col>
</template>

<script>
    import service from '../service';
    import {config} from "../config";
    import Comments from "./Comments";
    import FilmsNavbar from "./FilmsNavbar";
    import {isLoggedIn} from "../helpers";
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
                apiUrl: config.apiUrl,
                content: {
                  loading: true,
                  filmsLoading: true,
                  commentsLoading: true,
                  videoLoading: true,
                },
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

            handleCommentsLoaded() {
                this.content.commentsLoading = false;
            },
            handleFilmsLoaded() {
                this.content.filmsLoading = false;
            },
            isAllLoaded()  {
                const allLoaded = !this.content.loading && !this.content.filmsLoading && !this.content.commentsLoading ;
                if (allLoaded) {
                    this.filmVideoHeight = this.$refs.filmVideoRef.clientHeight;
                }
                return allLoaded;
            },
            async loadFilm(id) {

                await service.updateFilmMetaViews(id, {viewed: true})
                    .then(response => {
                        this.film = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = "Failed to load film"
                    });

                await this.checkUserLikes();

            },
            async checkUserLikes() {
                if (isLoggedIn()) {

                    this.userMeta = {
                        disliked: false,
                        liked: false
                    };

                    await service.getMe()
                        .then(response => {

                            if (response.data.meta.liked.indexOf(this.film.id) > -1) {
                                this.userMeta.liked = true;
                            } else if (response.data.meta.disliked.indexOf(this.film.id) > -1) {
                                this.userMeta.disliked = true;
                            }
                        })
                        .catch(error => {
                            console.log(error.response);
                            this.error = "Failed to load my data"
                        })
                    .finally(() => this.content.loading = false );
                } else this.content.loading = false;
            },
            async handleLike(like) {

                await service.updateFilmMetaLikes(this.film.id, {liked: like})
                    .then(response => {
                        this.film = response.data;
                        if (like === 'liked') {
                            this.userMeta.liked = !this.userMeta.liked;
                            this.userMeta.disliked = false;
                        } else {
                            this.userMeta.disliked = !this.userMeta.disliked;
                            this.userMeta.liked = false;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = "Failed to load film"
                    });
            },
            handleResize() {
                if (!this.content.loading)
                    this.filmVideoHeight = this.$refs.filmVideoRef.clientHeight;
                const width = window.innerWidth || document.documentElement.clientWidth ||
                    document.body.clientWidth;
                this.width = width;
            }

        },
        async beforeRouteUpdate(to, from, next) {
            this.listId = to.query.list;
            this.filmId = to.params.id;

            await this.loadFilm(to.params.id);

            next()
        },
        updated() {
            this.$nextTick(function () {
                if (!this.content.loading && this.$refs.filmVideoRef)
                    this.filmVideoHeight = this.$refs.filmVideoRef.clientHeight;
            })
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize)
        },
        async created() {

            const width = window.innerWidth || document.documentElement.clientWidth ||
                document.body.clientWidth;
            this.width = width;

            this.isLoggedIn = isLoggedIn();

            this.listId = this.$route.query.list;
            this.filmId = this.$route.params.id;

            await service.updateFilmMetaViews(this.$route.params.id, {viewed: true})
                .then(response => {
                    this.film = response.data;
                    this.checkUserLikes();
                })
                .catch(error => {
                    console.log(error);
                    this.$router.back();
                    this.error = "Failed to update film"
                });

            await this.checkUserLikes();

        },
        mounted() {

            const width = window.innerWidth || document.documentElement.clientWidth ||
                document.body.clientWidth;
            this.width = width;


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
        }
    }
</script>

<style scoped>
    .blue {
        color: #06538b;
    }

</style>
