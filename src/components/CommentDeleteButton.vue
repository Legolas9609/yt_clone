<template>
    <md-menu
            :md-active="isActive"
            @md-closed="handleHide"
            @md-opened="handleShow"
            class="d-flex justify-content-center align-items-center"
            md-direction="bottom-end"
            style="width: 25px; height: 25px; border-radius: 20px; margin-left: auto">
        <md-button class="d-flex justify-content-center align-items-center"
                   md-menu-trigger
                   style="width: 25px; height: 25px; border-radius: 20px; min-width: auto; outline: 0">
            <md-ripple class="d-flex justify-content-center align-items-center"
                       style="width: 25px; height: 25px; border-radius: 20px">
                <font-awesome-icon :class="isMobile ? ' comment-dropdown-holder-mobile' : 'comment-dropdown-holder'"
                                   icon="ellipsis-v"/>
            </md-ripple>
        </md-button>

        <md-menu-content>
            <md-menu-item @click="handleDelete" >Delete</md-menu-item>
        </md-menu-content>
    </md-menu>
</template>

<script>
    import {isMobile} from "../helpers";
    import EventBus from "../event-bus";

    export default {
        name: "CommentDeleteButton",
        props: {
            commentId: String,
        },
        data() {
            return {
                isMobile: isMobile(),
                isActive: false,
            }
        },
        methods: {
            handleDelete () {
                console.log('aldaldlda')
                EventBus.$emit('deleted_comment', this.commentId);
            },
            handleScroll() {
                this.isActive = false;
            },
            handleShow() {
                console.log('show');
                window.addEventListener('scroll', this.handleScroll);
                this.isActive = true;
            },
            handleHide() {
                console.log('hide');
                window.removeEventListener('scroll', this.handleScroll);
                this.isActive = false;
            },
        }
    }
</script>

<style >
    .md-list-item-button {
        outline: none !important;
    }
</style>
