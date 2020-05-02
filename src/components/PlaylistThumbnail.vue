<template>
     <img
             :alt="`Playlist thumbnail`" v-show="loaded"  :src="thumbnail" class="embed-responsive-item image pr-2"
                           v-on:error="handleImageError" v-on:load="handleImageLoaded"/>
</template>

<script>
    import {config} from "../config";

    export default {
        name: "PlaylistThumbnail",
        props: { thumbnails: Array },
        data() {
            return {
                apiUrl: config.apiUrl,
                notFoundFilmsThumbnail: 'placeholder.png',
                thumbnail: this.thumbnails[0],
                loaded: false,
            }
        },
        watch: {
            // whenever question changes, this function will run
            thumbnails() {
                this.thumbnail = this.thumbnails[0]
            },
        },
        methods: {
            handleImageError() {
                const _index = this.thumbnails.indexOf(this.thumbnail);
                this.thumbnail = this.thumbnails[_index + 1];
            },
            handleImageLoaded() {
                this.loaded = true;
                this.$emit('loaded', this.thumbnail)
            }
        }
    }
</script>

<style scoped>

</style>
