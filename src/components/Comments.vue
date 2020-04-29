<template>
    <b-col>
        <b-col class="p-0" cols="12" sm="12">
            <b-row class="p-0 m-0"  cols="12" sm="12">
                <b-col cols="9" sm="10" class="m-0 pl-0">
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
                <b-col cols="3" sm="2" class="m-0 p-0">
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
                            <b-dropdown-item class="m-nav-link" v-on:click="handleSort('creationDate')">By date</b-dropdown-item>
                        </md-ripple>
                        <md-ripple>
                            <b-dropdown-item class="m-nav-link" v-on:click="handleSort('username')">By author name</b-dropdown-item>
                        </md-ripple>
                    </b-dropdown>
                </div>
            </b-row>
        </b-col>
        <b-col :key="`_comment-${index}`" class="p-0 mt-4 comment-holder"
               cols="12"
               v-for="(_comment, index) in content.comments">
            <b-row style="margin: 0">

                <p class="m-0 font-weight-bold">
                    <small class="m-0 font-weight-bold">{{_comment.authorUsername}}</small>
                </p>
                <p style="white-space: pre-wrap;">
                    <small class="m-0">&ensp;{{_comment.createdDate | addSpace}}</small>
                </p>

                <b-dropdown no-caret  style="margin-left: auto" right
                            variant="link">
                    <template style="width: 25px; height: 25px" v-slot:button-content>
                        <md-ripple class="d-flex justify-content-center align-items-center"
                                   style="width: 25px; height: 25px; border-radius: 20px; margin-left: auto">
                            <font-awesome-icon :class="isMobile ? ' comment-dropdown-holder-mobile' : 'comment-dropdown-holder'"
                                               icon="ellipsis-v" v-if="isLoggedIn && loggedInUser === _comment.authorID"/>
                        </md-ripple>
                    </template>
                    <md-ripple>
                        <b-dropdown-item class="m-nav-link" v-on:click="handleDeleteComment(_comment.id)">
                            Delete
                        </b-dropdown-item>
                    </md-ripple>

                </b-dropdown>
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

    export default {
        name: "Comments",
        props: {
            comments: Array,
            filmId: String,
            isLoggedIn: Boolean,
        },
        watch: {
            // whenever question changes, this function will run
            filmId() {

            },
            comments(newComments) {
                this.content.comments = newComments;
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
                },
                loggedInUser: null,
                isMobile: isMobile(),
            }
        },
        mounted() {
            this.loggedInUser = getUserId();
        },
        methods: {
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

<style scoped>
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
</style>
