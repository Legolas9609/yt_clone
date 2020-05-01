<template>
    <b-col>
        <b-col class="d-flex justify-content-start mt-3 mb-3 ">
            <b-button class="p-2" v-b-toggle.collapse-filter
                      aria-label="Filter">
                <font-awesome-icon icon="filter"/>
            </b-button>
        </b-col>
        <b-collapse id="collapse-filter">
            <b-row class="text-justify" id="filter-collapse">
                <b-col class="mt-4" sm="4">
                    <p class="unselectable" style="font-weight: 500">UPLOAD DATE</p>

                    <b-col class="mt-3 mb-3 dropdown-divider" sm="8"/>
                    <p :class="currents.filter === filter.id ? 'currents-picked' : 'currents-non-picked'" :key="`filter-${index}`"
                       @click="handleFilmsSearch('filter', filter)"
                       class="filter-search unselectable"
                       v-for="(filter, index) in filters"
                    >
                        {{filter.title}}
                    </p>
                </b-col>

                <b-col class="mt-4" sm="4">
                    <p style="font-weight: 500">SORT BY</p>

                    <b-col class="mt-3 mb-3 dropdown-divider" sm="8"/>

                    <b-row :key="`sort-${index}`" class="ml-0" v-for="(sort, index) in sorts">
                        <p :class="currents.sort.id === sort.id ? 'currents-picked' : 'currents-non-picked'"
                           @click="handleFilmsSearch('sort', sort)"
                           class="filter-search unselectable">
                            {{sort.title}}
                        </p>
                        <font-awesome-icon class="ml-2" icon="sort-up"
                                           v-if="sort.id === currents.sort.id && currents.sort.dir === 1"/>
                        <font-awesome-icon class="ml-2" icon="sort-down"
                                           v-if="sort.id === currents.sort.id && currents.sort.dir === -1"/>
                    </b-row>
                </b-col>

            </b-row>
        </b-collapse>

        <b-col class="mt-2 mb-3 dropdown-divider" cols="12"/>

        <b-row v-if="isLoading === false">
            <b-col v-on:click="handleFilmChooseFilmsSearch(film.id)"
                    :key="`film-${index}`" class="mt-4 film-preview-holder m-0 mb-1 m-container text-justify" cols="12"
                   lg="8" siz v-for="(film, index) in films">
                <b-row class="d-sm-none mb-4">
                    <b-col cols="8" sm="4">
                        <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
                            <img :src="`${apiUrl}films/${film.id}/thumbnail/preview`"
                                 :alt="`Film added by ${film.authorUsername}`"
                                 class="image embed-responsive-item"/>
                            <font-awesome-icon class="middle" icon="play"/>
                        </div>
                    </b-col>
                    <b-col class="p-0" cols="4" sm="8">
                        <b-row class="m-0">
                            <b-col class="p-0" cols="8" sm="8">

                                <span class="mb-1 title-search font-weight-bold" v-line-clamp:20="1">
                                    {{film.title}}
                                </span>

                            </b-col>

                        </b-row>
                        <p class="mb-0 author-nick">
                            <small>{{film.authorUsername}} &#183; {{film.meta.views}} views</small>
                        </p>

                    </b-col>
                </b-row>

                <b-col class="d-none d-sm-inline">
                    <b-row class="style-search">
                        <b-col cols="8" sm="4">
                            <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
                                <img :src="`${apiUrl}films/${film.id}/thumbnail/preview`"
                                     :alt="`Film added by ${film.authorUsername}`"
                                     class="image embed-responsive-item"/>
                                <font-awesome-icon class="middle" icon="play"/>
                            </div>
                        </b-col>
                        <b-col class="p-0" cols="4" sm="8">
                            <b-row class="m-0">
                                <b-col class="p-0 mb-1" cols="10" sm="10">
                                    <span class="mb-0 title-search font-weight-bold">
                                        {{film.title}}
                                    </span>
                                </b-col>

                            </b-row>
                            <p class="mb-1 author-nick-search">
                                <small>{{film.authorUsername}} &#183; {{film.meta.views}} views</small>
                            </p>

                            <small>
                                        <span class="mb-0 author-nick-search">
                                           {{film.description}}
                                        </span>
                            </small>

                        </b-col>
                    </b-row>
                </b-col>
            </b-col>
        </b-row>
        <b-spinner label="Spinning" type="grow" v-if="isLoading === true" class="mt-2"></b-spinner>
        <router-view></router-view>
    </b-col>
</template>

<script>
    import {config} from "../config";
    import backendService from "../service";
    import {buildSearchPath, extractFromRoute} from "../helpers";
    import {publicPath} from "../../vue.config";

    export default {
        name: "FilmsSearch",
        data() {
            return {
                films: [],
                apiUrl: config.apiUrl,
                isLoading: true,
                currents: {
                    sort: {
                        id: null,
                        dir: 1,
                    },
                    filter: null,
                },
                title_starts: null,
                filters: [
                    {id: 'last_hour', title: 'Last hour'},
                    {id: 'today', title: 'Today'},
                    {id: 'this_week', title: 'This week'},
                    {id: 'this_month', title: 'This month'},
                    {id: 'this_year', title: 'This year'},
                ],
                sorts: [
                    {id: 'creation_date', title: 'Upload date', dir: 1},
                    {id: 'views', title: 'View count', dir: 1},
                    {id: 'likes', title: 'Likes', dir: 1},
                ]
            }
        },
        async created() {
            await this.loadFilms()
        },
        async beforeRouteUpdate(to, from, next) {
            await this.loadFilms(to.query);
            next()
        },
        methods: {
            handleFilmChooseFilmsSearch(id) {
                this.$router.push(`${publicPath}films/${id}`)
            },
            handleFilmsSearch(action, data) {
                let {query, filter, sort} = buildSearchPath(action, data, this.title_starts, this.currents.filter, this.currents.sort);
                this.currents.filter = filter;
                this.currents.sort = sort;
                this.$router.push( {path: `${publicPath}search`, query: query})
            },
            async loadFilms(queryParams = this.$route.query) {
                this.isLoading = true;

                let {path, title_starts, filter, sort} = extractFromRoute(queryParams, this.filters, this.sorts);
                this.currents.filter = filter;
                this.currents.sort = sort;
                this.title_starts = title_starts;

                await backendService.getAllFilmsAndFilterAndSort(path)
                    .then(response => {
                        this.films = response.data
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = "Failed to load films"
                    })
                    .finally(() => this.isLoading = false)
            }
        },
    }
</script>

<style scoped>

    .unselectable {
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }

    .currents-picked {
        font-weight: 700;
        font-size: 80%;
    }

    .currents-non-picked {
        font-weight: 400;
        font-size: 80%;
    }

    .title-search {
        font-size: 1.6rem;
        line-height: 1.05;
        font-weight: 400 !important;
    }

    .film-views-search {
        color: #606060;
    }

    .filter-search {
        color: #606060;
        cursor: pointer;
    }

    .style-search {
        cursor: pointer;
    }

</style>
