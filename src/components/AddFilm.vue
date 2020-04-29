<template>
    <b-form>
        <b-row class="mt-4 mr-2 ml-2" sm="12">
            <b-col class="mb-4" lg="5" sm="6">

                <b-col class="mb-4 ml-auto mr-auto" cols="10" lg="10" sm="12">
                    <div class="embed-responsive embed-responsive-16by9 z-depth-1-half
                            justify-content-center
                            d-flex
                            align-items-center
                            embed-responsive-item
                            text-center
                            box">
                        <input @change="handleFilmChoose" accept="video/mp4, video/ogg"
                               class="inputfile" id="film" type="file"/>
                        <label for="film">
                            <span>Add film</span>
                        </label>

                        <video :src="preview.film" autoPlay class="embed-responsive-item " loop muted
                               v-if="preview.film.length > 0">
                        </video>
                        <b-col class="add-item-opacity"
                               style="left:0; top: 0; position: absolute; width: 100%; height: 100%"
                               v-if="preview.film.length > 0"/>
                        <font-awesome-icon @click="handleRemoveFile('film')" class="add-item-middle fa-3x"
                                           icon="times" style="color: #ffffff" v-if="preview.film.length > 0"/>
                    </div>
                </b-col>
                <b-col class="ml-auto mr-auto" cols="10" lg="10" sm="12">
                    <div class="embed-responsive embed-responsive-16by9 z-depth-1-half
                            justify-content-center
                            d-flex
                            align-items-center
                            embed-responsive-item
                            text-center
                            box">
                        <input @change="handleThumbnailChoose" accept="image/jpg, image/png, image/jpeg"
                               class="inputfile" id="thumbnail" type="file"/>
                        <label for="thumbnail">
                            <span>Add thumbnail</span>
                        </label>

                        <img :src="preview.thumbnail"
                             class="embed-responsive-item"
                             v-if="preview.thumbnail.length > 0"/>

                        <b-col class="add-item-opacity"
                               style="left:0; top: 0; position: absolute; width: 100%; height: 100%"
                               v-if="preview.thumbnail.length > 0"/>
                        <font-awesome-icon @click="handleRemoveFile(`thumbnail`)"
                                           class="add-item-middle fa-3x"
                                           icon="times" style="color: #ffffff" v-if="preview.thumbnail.length > 0"/>
                    </div>

                </b-col>
            </b-col>
            <b-col class="mb-2" lg="5" sm="6">

                <b-col class="mb-3" sm="12">
                    <b-input
                            aria-label="Title"
                            name="title"
                            placeholder="Title"
                            v-model="form.title"
                    />
                </b-col>

                <b-col class="mb-3" sm="12">
                    <b-form-textarea
                            max-rows="6"
                            name="description"
                            placeholder="Description"
                            rows="3"
                            v-model="form.description"
                    />
                </b-col>

                <b-col class="mb-3 d-flex justify-content-start algin-content-center" sm="12">
                    <b-button @click="handleCreateFilm" variant="primary"
                        :disabled="isAdding">
                        Add
                    </b-button>
                    <b-spinner v-if="isAdding" class="ml-2"></b-spinner>
                </b-col>
                <b-alert :show="showError" variant="danger">{{errorMessage}}</b-alert>
            </b-col>
        </b-row>
        <router-view></router-view>
    </b-form>
</template>

<script>
    import backendService from "../service";
    import {publicPath} from "../../vue.config";

    export default {
        name: "AddFilm",
        data() {
            return {
                errorMessage: null,
                showError: false,
                preview: {
                    thumbnail: "",
                    film: ""
                },
                form: {
                    title: "",
                    description: "",
                    film: null,
                    thumbnail: null
                },
                isAdding: false,
            }
        },
        methods: {
            handleFilmChoose(event) {
                event.preventDefault();
                this.form.film = event.target.files[0];
                this.preview.film = URL.createObjectURL(event.target.files[0])
            },
            handleThumbnailChoose(event) {
                this.form.thumbnail = event.target.files[0];
                this.preview.thumbnail = URL.createObjectURL(event.target.files[0])
            },
            handleCreateFilm() {
                this.isAdding = true;
                this.showError = false;
                this.errorMessage = "";
                const formData = new FormData();
                formData.append('title', this.form.title);
                formData.append('description', this.form.description);
                formData.append('video', this.form.film);
                formData.append('thumbnail', this.form.thumbnail);
                backendService.createNewFilm(formData)
                    .then(response => {
                        console.log(response);
                        this.$router.push(`${publicPath}films/${response.data.id}`)
                    })
                    .catch(error => {
                        if (error.response && error.response.status !== 401) {
                            if (error.response) {
                                console.log(error.response);
                                if (error.response.data.errors) {
                                    this.errorMessage = error.response.data.errors[0];
                                } else {
                                    this.errorMessage = error.response.data.message;
                                }
                                this.showError = true;
                            } else {
                                console.log(error);
                                this.errorMessage = "Something went wrong.";
                                this.showError = true;
                            }
                        } else {
                            console.log(error);
                            this.errorMessage = '';
                            this.showError = false;
                        }
                    })
                    .finally(() => this.isAdding = false)
            },
            handleRemoveFile(type) {
                switch (type) {
                    case "film":
                        this.form.film = null;
                        this.preview.film = "";
                        break;

                    case 'thumbnail':
                        this.form.thumbnail = null;
                        this.preview.thumbnail = "";
                        break
                }
            }
        }
    }
</script>

<style scoped>
    .inputfile {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }

    .inputfile + label {
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        display: inline;
        overflow: hidden;
    }

    .no-js .inputfile + label {
        display: none;
    }

    .inputfile + label:hover {
        color: #3ba8c5;
    }

    .box {
        background-color: #e9ecef;
        border-radius: .3rem;
        display: inline;
    }


    .add-item-opacity {
        background-color: rgba(0, 0, 0, 0.4);
    }

    .add-item-middle {
        cursor: pointer;
        opacity: 0.8;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }

</style>
