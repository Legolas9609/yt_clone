<template>
    <div>
        <b-modal title="Reset" size="lg" centered v-model="modalShow"
                 @close="handleClose"
                 @hidden="handleClose">

            <b-form @submit.stop.prevent="onSubmit">
            <b-form-group
                    id="password-group"
                    label="Password"
                    label-for="password-input">
                <b-form-input
                        id="password-input"
                        type="password"
                        name="password-input"
                        v-model="form.password"
                        v-validate="{required: true, min: 6, max: 25}"
                        :state="validateState('password-input')"
                        aria-describedby="input-password-live-feedback"
                        data-vv-as="Password"
                >
                </b-form-input>
                <b-form-invalid-feedback id="input-password-live-feedback">{{ veeErrors.first('password-input') }}</b-form-invalid-feedback>
            </b-form-group>
            </b-form>
            <template v-slot:modal-footer>
                    <div class="w-100 d-flex algin-content-center">
                    <b-button
                        aria-label="Reset"
                        variant="primary"
                        @click="handleOk"
                        :disabled="isReseting"
                    >
                        Reset
                    </b-button>
                    <b-spinner v-if="isReseting" class="ml-2"></b-spinner>
                    </div>
                </template>
                <b-alert show variant="danger" v-if="messages.error">{{messages.error}}</b-alert>
                <b-alert show variant="success" v-if="messages.success">{{messages.success}}</b-alert>

        </b-modal>
        <router-view></router-view>
    </div>

</template>

<script>
    import backendService from "../service";
    import {publicPath} from "../../vue.config";

    export default {
        name: "ResetPassword",
        data() {
            return {
                modalShow: true,
                form: {
                    password: null
                },
                isReseting: false,
                messages: {
                    success: null,
                    error: null,
                }
            }
        },
        methods: {
            validateState(ref) {
                if (
                    this.veeFields[ref] &&
                    (this.veeFields[ref].dirty || this.veeFields[ref].validated)
                ) {
                    return !this.veeErrors.has(ref);
                }
                return null;
            },
            resetMessages() {
                this.messages = {
                    error: null,
                    success: null
                }
            },
            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault()
                this.onSubmit()
            },
            handleClose() {
                this.$router.push(`${publicPath}`)
            },
            onSubmit() {
                this.$validator.validateAll().then(async result => {
                    if (!result) {
                        return;
                    }

                    this.isReseting = true;

                    await backendService.reset(this.$route.params.token, this.form)
                    .then((response) => {
                        console.log(response);
                        this.messages.success = "Password reseted succesfully! Redirectiong to login!";
                        setTimeout(() => this.$router.push(`${publicPath}login`), 1500 );
                    })
                    .catch((error) => {
                        if (error.response)
                            this.messages.error = error.response.data.message;
                        else
                            this.messages.error = "Cannot send token to this email.";
                    })
                    .finally(() => this.isReseting = false)
                });
            }
        }
    }
</script>

<style scoped>

</style>
