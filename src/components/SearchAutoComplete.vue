<template>
    <div :style="width" class="v-autocomplete" style="margin: 0;">
        <input :value='search'
               @input="onChange($event)"
               @keydown.down="onArrowDown"
               @keydown.enter="onEnter"
               @keydown.up="onArrowUp"
               class="v-autocomplete-input w-100"
               placeholder="Search..."
               type="text"
        />
        <ul class="v-autocomplete-list"
            style="position: absolute; padding: 0; list-style-type: none;"
            v-show="isOpen"
        >
            <li
                    class="v-autocomplete-list-item"
                    v-if="isLoading"
            >
                Loading results...
            </li>
            <li :class="{ 'v-autocomplete-list-item-active': i === arrowCounter }"
                :key="i"
                @click="setResult(result)"
                @mouseover="arrowCounter = i"
                class="v-autocomplete-list-item"
                v-else
                v-for="(result, i) in results"
            >
                <b-row class="m-0 p-0">
                    <b-col class="m-0 p-0" cols="2" sm="2">
                        <md-avatar
                                class="mr-3" variant="primary">
                            <img :src="`${apiUrl}films/${result.id}/thumbnail/preview`"
                                 :alt="`Film added by ${result.authorUsername}`">
                        </md-avatar>
                    </b-col>
                    <b-col cols="10" sm="10">
                        <span v-line-clamp:20="1">{{ result.title }}</span>
                    </b-col>
                </b-row>

            </li>
        </ul>
    </div>

</template>

<script>
    import backendService from "../service";
    import {config} from "../config";
    import {publicPath} from "../../vue.config";

    let _ = require('lodash');

    export default {
        name: "SearchAutoComplete",
        props: {
            width: String
        },
        data() {
            return {
                apiUrl: config.apiUrl,
                item: null,
                isOpen: false,
                results: [],
                search: '',
                isLoading: false,
                arrowCounter: -1,
            }
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside)
        },
        destroyed() {
            document.removeEventListener('click', this.handleClickOutside)
        },
        methods: {
            onChange(event) {
                this.search = event.target.value;
                this.loadMoreResults(this.search)
            },
            setResult(result) {
                this.isOpen = false;
                if (result.title) {
                    this.item = result;
                    this.handleRedirect()
                } else
                    this.search = result;
            },
            onArrowDown() {
                if (this.arrowCounter < this.results.length) {
                    this.arrowCounter = this.arrowCounter + 1;
                }
            },
            onArrowUp() {
                if (this.arrowCounter > 0) {
                    this.arrowCounter = this.arrowCounter - 1;
                }
            },
            onEnter() {
                this.isOpen = false;
                this.item = this.results[this.arrowCounter];
                this.results = [];
                this.arrowCounter = -1;
                this.handleRedirect()
            },
            handleClickOutside(evt) {
                if (!this.$el.contains(evt.target)) {
                    this.isOpen = false;
                    this.arrowCounter = -1;
                }
            },
            handleRedirect() {
                this.isOpen = false;
                if (this.item !== null && this.item !== undefined) {
                    if (window.location.pathname !== `/films/${this.item.id}`)
                        this.$router.push(`${publicPath}films/${this.item.id}`)
                } else {
                    if (!_.isEqual(this.$route.query, {title_starts: this.search}))
                        this.$router.push(`${publicPath}search?title_starts=${this.search}`)
                }
                this.item = null;
                this.search = ''

            },
            async loadMoreResults(value) {
                if (value.length > 1) {
                    await backendService.getAllFilmsAndFilterAndSort('title_starts=' + value)
                        .then(response => {
                            this.isLoading = false;
                            console.log('response.data)');
                            console.log(response.data);
                            this.results = response.data;
                            this.isOpen = this.results.length > 0;
                        })
                        .catch(error => {
                            console.log(error);
                            this.error = "Failed to load films"
                        })
                        .finally(() => this.isLoading = false)
                } else {
                    this.isOpen = false;
                    this.isLoading = false;
                    this.results = []
                }

            },
        }
    }
</script>

<style scoped>
    .v-autocomplete {
        position: relative;
        width: 300px;
    }

    .v-autocomplete-input {
        width: 100%;
        display: block;
        margin: 0 auto;
        padding: .5rem .7rem;
        font-size: .9rem;
        line-height: 1.25;
        color: #464a4c;
        outline: none;
        background-color: #fff;
        background-image: none;
        background-clip: padding-box;
        border: 1px solid #cecece;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    .v-autocomplete-list {
        width: 100%;
        text-align: left;
        max-height: 400px;
        overflow-y: auto;
        position: relative;
    }

    .v-autocomplete-list-item {
        background-color: #fff;
        padding: 10px;
    }

    .v-autocomplete-list-item:last-child {
        border-bottom: none;
    }

    .v-autocomplete-list-item:hover {
        background-color: #eee !important;
    }

    .v-autocomplete-list-item-active {
        background-color: #eee !important;
    }

    .v-autocomplete .v-autocomplete-list,
    .v-autocomplete .v-autocomplete-loading {
        position: absolute;
    }

    .v-autocomplete .v-autocomplete-list .v-autocomplete-list-item {
        cursor: pointer;
    }

    .v-autocomplete .v-autocomplete-list .v-autocomplete-list-item.v-autocomplete-item-active {
        background-color: #f3f6fa;
    }

    .v-autocomplete .v-autocomplete-list {
        -webkit-box-shadow: 0px 18px 22px 5px rgba(0, 0, 0, 0.7);
        box-shadow: 0px 18px 22px 5px rgba(0, 0, 0, 0.7);
    }
</style>
