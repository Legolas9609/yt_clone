<template>
    <md-menu
            :md-offset-x="-10"
            :md-active="isActive"
            @md-closed="handleHide"
            @md-opened="handleShow"
            class="d-flex justify-content-center align-items-center"
            md-direction="bottom-end"
            style="width: 25px; height: 25px; border-radius: 20px; position: relative"
            v-if="isLoggedIn">
        <md-button
                aria-label="Playlist"
                class="d-flex justify-content-center align-items-center"
                   md-menu-trigger
                   style="width: 25px; height: 25px; border-radius: 20px; min-width: auto; outline: 0">
            <md-ripple class="d-flex justify-content-center align-items-center"
                       style="width: 25px; height: 25px; border-radius: 20px">
                <font-awesome-icon :class="isMobile ? 'playlist-add-icon-mobile' : 'playlist-add-icon'"
                                   icon="ellipsis-v"/>
            </md-ripple>
        </md-button>

        <md-menu-content>
            <AddToPlaylist v-bind:film-id="filmId"/>
        </md-menu-content>
    </md-menu>

</template>

<script>
    import AddToPlaylist from "./AddToPlaylist";
    import {isMobile} from "../helpers";
    import EventBus from "../event-bus";

    export default {
        name: "AddToPlaylistButton",
        components: {AddToPlaylist},
        props: {
            filmId: String,
            isLoggedIn: Boolean,
        },
        mounted() {
            EventBus.$on('closed', () => {
                if (this.isActive)
                    this.handleHide();
            });
        },
        beforeDestroy() {
            this.handleHide();
        },
        methods: {
            handleScroll() {
                this.isActive = false;
            },
            handleShow() {
               // window.addEventListener('scroll', this.handleScroll);
                setTimeout(() => document.body.classList.add('modal-open'), 250);
                this.isActive = true;
            },
            handleHide() {
                //window.removeEventListener('scroll', this.handleScroll);
                document.body.classList.remove('modal-open')
                this.isActive = false;
            },
        },
        data() {
            return {
                isMobile: isMobile(),
                isActive: false,
            }
        }
    }
</script>

<style >
    .md-menu-content {
        max-height: 50vh;
        z-index: 100;
    }

    .modal-open {
        overscroll-behavior: contain;
    }
</style>
