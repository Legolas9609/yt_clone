<template>

    <b-dropdown boundary="window" no-caret right variant="link" class="m-add-dropdown"
                style="width: 25px; height: 25px"
                v-if="isLoggedIn" @show="showAddPlaylist = true" @hidden="showAddPlaylist = false">
        <template v-slot:button-content style="width: 25px; height: 25px">
            <md-ripple style="width: 25px; height: 25px; border-radius: 20px" class="d-flex justify-content-center align-items-center">
                <font-awesome-icon icon="ellipsis-v" :class="isMobile ? 'playlist-add-icon-mobile' : 'playlist-add-icon'"/>
            </md-ripple>
        </template>
        <div v-if="showAddPlaylist">
            <AddToPlaylist v-bind:film-id="filmId"/>
        </div>
    </b-dropdown>
</template>

<script>
    import AddToPlaylist from "./AddToPlaylist";
    import {isMobile} from "../helpers";

    export default {
        name: "AddToPlaylistButton",
        components: {AddToPlaylist},
        props: {
            filmId: String,
            isLoggedIn: Boolean,
        },
        data() {
            return {
                showAddPlaylist: false,
                isMobile: isMobile(),
            }
        }
    }
</script>

<style scoped>

</style>
