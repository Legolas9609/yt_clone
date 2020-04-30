<template>
    <b-col>
        <b-col class="p-0" cols="12" sm="12">
            <b-row class="p-0 m-0" cols="12" sm="12">
                <b-col class="m-0 pl-0" cols="9" sm="10">
                    <b-form-textarea
                            :state="textareaError && textareaError === null"
                            aria-describedby="input-comment-live-feedback"
                            class="textarea-no-scrollbars"
                            data-vv-as="Comment"
                            id="textarea"
                            max-rows="4"
                            name="comment-input"
                            placeholder="Enter comment..."
                            rows="3"
                            v-model="comment"
                            v-on:blur="textareaError = null"
                            v-on:input="textareaError = null"
                    />
                    <small class="text-justify" id="input-comment-live-feedback" style="color: red"
                           v-if="textareaError">{{ textareaError}}</small>
                </b-col>
                <b-col class="m-0 p-0" cols="3" sm="2">
                    <b-button :disabled="isAdding" class="mt-3"
                              v-on:blur="textareaError = null"
                              v-on:click="handleAddComment"
                              variant="primary">
                        Submit
                    </b-button>
                </b-col>
            </b-row>
        </b-col>
        <b-col class="p-0 mt-4 mb-4" sm="12">
            <b-row>
                <b-col class="text-justify" cols="7" md="4" sm="5">
                    <p class="m-0">{{content.comments.length + " comments"}}</p>
                </b-col>
                <div cols="2" sm="2">
                    <b-dropdown
                            class="m-dropdown"
                            id="dropdown-button-drop-down"
                            right
                            text="Sort"
                            title="Sort"
                            variant="secondary">

                        <md-ripple>
                            <b-dropdown-item class="m-nav-link" v-on:click="handleSort('creationDate')">By date
                            </b-dropdown-item>
                        </md-ripple>
                        <md-ripple>
                            <b-dropdown-item class="m-nav-link" v-on:click="handleSort('username')">By author name
                            </b-dropdown-item>
                        </md-ripple>
                    </b-dropdown>
                </div>
            </b-row>
        </b-col>
        <b-col :key="`_comment-${index}`" class="p-0 mt-4 comment-holder"
               cols="12"
               v-for="(_comment, index) in content.comments">
            <b-row class="w-100" style="margin: 0">

                <p class="m-0 font-weight-bold">
                    <small class="m-0 font-weight-bold">{{_comment.authorUsername}}</small>
                </p>
                <p style="white-space: pre-wrap;">
                    <small class="m-0">&ensp;{{_comment.createdDate | addSpace}}</small>
                </p>

                <CommentDeleteButton v-bind:comment-id="_comment.id"
                                     v-if="content.isLoggedIn && loggedInUser === _comment.authorID"/>

            </b-row>
            <p class="text-justify">
                <small>{{_comment.text}}</small>
            </p>
        </b-col>

    </b-col>
</template>

<script>
    import service from "../service";
    import {displayDate, getUserId, isMobile} from "../helpers";
    import CommentDeleteButton from "./CommentDeleteButton";
    import EventBus from "../event-bus";

    export default {
        name: "Comments",
        components: {CommentDeleteButton},
        props: {
            comments: Array,
            filmId: String,
            isLoggedIn: Boolean,
        },
        watch: {
            isLoggedIn(isLoggedIn) {
                this.content.isLoggedIn = isLoggedIn;
            },
            comments(newComments) {
                console.log(newComments)
                // this.content.comments = newComments;
            }
        },
        data() {
            return {
                comment: null,
                isAdding: false,
                textareaError: null,
                dir: 1,
                content: {
                    comments: this.comments,
                    isLoggedIn: this.isLoggedIn,
                },
                loggedInUser: null,
                isMobile: isMobile(),
                isActive: false,
            }
        },
        beforeDestroy() {
            EventBus.$off('deleted_comment');
        },
        mounted() {
            EventBus.$on('deleted_comment', (id) => {
                this.handleDeleteComment(id)
            });

            this.loggedInUser = getUserId();
        },
        methods: {
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
            handleAddComment() {
                this.isAdding = true;

                if (!this.comment || this.comment.length < 10) {
                    this.textareaError = 'Comment must be at least 10 characters long';
                    this.isAdding = false;
                    return;
                }

                const comment = {text: this.comment};

                service.createComment(this.filmId, comment)
                    .then(response => {
                        this.comment = null;
                        this.isAdding = false;
                        let _comment = response.data;
                        _comment.createdDate = displayDate(_comment.createdDate);
                        this.content.comments.push(_comment);
                    })
                    .catch(error => {
                        if (error.response) {
                            if (error.response.status !== 401) {
                                this.textareaError = "Failed to create comment";
                                this.isAdding = false;
                                this.comment = null;
                            }
                        }
                    });
            },
            handleDeleteComment(id) {

                service.removeComment(id)
                    .then(response => {
                        console.log(response);
                        this.content.comments = this.content.comments.filter(_comment => _comment.id !== id);
                        this.$emit('deleted', this.content.comments)
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            handleSort(sort) {
                let _sort = sort + '=' + this.dir;
                service.sortComments(this.filmId, _sort)
                    .then(response => {
                        console.log(response);
                        this.content.comments = response.data;
                        this.content.comments.map(comment => comment.createdDate = displayDate(comment.createdDate))
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response);
                        } else {
                            console.log(error);
                        }
                    })
                    .finally(() => this.dir *= -1);
            },
        }
    }
</script>

<style>
    .textarea-no-scrollbars {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .textarea-no-scrollbars::-webkit-scrollbar {
        display: none;
    }

    .comment-dropdown-holder-mobile {
        color: #606060;
        opacity: 1;
    }

    .comment-dropdown-holder {
        color: #606060;
        opacity: 0;
    }

    .comment-holder:hover .comment-dropdown-holder {
        opacity: 0.6;
    }

    .comment-holder:hover .comment-dropdown-holder:hover {
        opacity: 1;
        cursor: pointer;
    }

    .md-list-item-content {
        min-height: 48px;
        padding: 4px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: padding .4s cubic-bezier(.25, .8, .25, 1);
        will-change: padding;
    }

    /*nadpisanie stylow md-menu*/

    .md-menu-content.md-menu-content-leave-active {
        transition: opacity .1s cubic-bezier(.4, 0, .2, 1);
        opacity: 0
    }

    .md-menu-content-container .md-list {
        transition: opacity .1s cubic-bezier(.25, .8, .25, 1);
        will-change: opacity;
    }

    .md-menu-content.md-menu-content-enter.md-menu-content-bottom-end {
        transform-origin: top right;
        transform: translate3d(0, 0px, 0) scaleY(1)
    }
</style>
