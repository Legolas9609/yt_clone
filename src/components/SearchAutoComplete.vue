<template>
    <div class="v-autocomplete" style="margin: 0;" :style="width">
        <input @input="onChange"
               @keydown.down="onArrowDown"
               @keydown.enter="onEnter"
               @keydown.up="onArrowUp"
               class="v-autocomplete-input w-100"
               placeholder="Search..."
               type="text"
               v-model="search"
        />
        <ul class="v-autocomplete-list"
            id="autocomplete-results"
            style="position: absolute; padding: 0; list-style-type: none;"
            v-show="isOpen"
        >
            <li
                    class="v-autocomplete-list-item"
                    v-if="isLoading"
            >
                Loading results...
            </li>
            <li     :class="{ 'v-autocomplete-list-item-active': i === arrowCounter }"
                    :key="i"
                    @click="setResult(result)"
                    @mouseover="arrowCounter = i"
                    class="v-autocomplete-list-item"
                    v-else
                    v-for="(result, i) in results"
            >
                <md-avatar
                        class="mr-3" variant="primary">
                    <img :src="`${apiUrl}films/${result.id}/thumbnail/preview`" alt="">
                </md-avatar>
                <span>{{ result.title }}</span>
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
            onChange() {
                this.isOpen = true;
                console.log('changed');
                // this.$emit('input', this); // .search
                this.loadMoreResults(this.search)
            },
            setResult(result) {
                if (result.title) {
                    this.item = result;
                    this.handleRedirect()
                } else
                    this.search = result;
                this.isOpen = false;
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
                //this.search = this.results[this.arrowCounter];
                this.item = this.results[this.arrowCounter];
                this.arrowCounter = -1;
                this.handleRedirect()
            },
            handleClickOutside(evt) {
                console.log('outside');
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
            loadMoreResults(value) {
                // this.isLoading = true;
                console.log(value);
                console.log('Value');

                if (value.length > 1) {
                    backendService.getAllFilmsAndFilterAndSort('title_starts=' + value)
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
