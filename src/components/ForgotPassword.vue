<template>
    <div>
        <b-modal id="modal-1" title="Forgot" size="lg" centered v-model="modalShow"
                 @close="handleClose"
                 @hidden="handleClose">

            <b-form @submit.stop.prevent="onSubmit" @change="resetMessages">
                <b-form-group
                        id="email-group"
                        label="Email"
                        label-for="email-input"
                >
                    <b-form-input id="email-input"
                                  @focus="resetMessages"
                                  name="email-input"
                                  v-model="form.email"
                                  type="email"
                                  v-validate="'required|email'"
                                  :state="validateState('email-input')"
                                  aria-describedby="input-email-live-feedback"
                                  data-vv-as="Email">
                    </b-form-input>

                    <b-form-invalid-feedback id="input-email-live-feedback">{{ veeErrors.first('email-input') }}</b-form-invalid-feedback>
                </b-form-group>
            </b-form>
            <template v-slot:modal-footer>
                    <div class="w-100 d-flex algin-content-center">
                    <b-button
                        variant="primary"
                        @click="handleOk"
                        :disabled="isSending"
                    >
                        Send token to an email
                    </b-button>
                    <b-spinner v-if="isSending" class="ml-2"></b-spinner>
                    </div>
                </template>
                <b-alert show variant="danger" v-if="error">{{error}}</b-alert>
                <b-alert show variant="success" v-if="success">{{success}}</b-alert>

        </b-modal>

    </div>

</template>

<script>
    import backendService from "../service";
    import {publicPath} from "../../vue.config";

    export default {
        name: "ForgotPassword",
        data() {
            return {
                modalShow: true,
                form: {
                    email: null,
                },
                isSending: false,
                success: null,
                error: null,
            }
        },
        methods: {
            resetMessages() {
                this.error = null;
                this.success = null;
            },
            validateState(ref) {
                if (
                    this.veeFields[ref] &&
                    (this.veeFields[ref].dirty || this.veeFields[ref].validated)
                ) {
                    return !this.veeErrors.has(ref);
                }
                return null;
            },
            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault()
                this.onSubmit()
            },
             handleClose() {
                let currentLocation = this.$route.path;
                currentLocation = currentLocation.replace('forgot', '');

                if (currentLocation === '')
                    currentLocation += publicPath;

                this.$router.push({path: currentLocation, query: this.$route.query})
            },
            onSubmit() {
                this.$validator.validateAll().then(result => {
                    if (!result) {
                        return;
                    }

                    this.isSending = true;

                    backendService.forget(this.form)
                    .then((response) => {
                        console.log(response);
                        this.success = response.data;
                    })
                    .catch((error) => {
                        console.log(error.response)
                        console.log(error);
                        if (error.response)
                            this.error = error.response.data.message;
                        else
                            this.error = "Cannot send token to this email.";
                    })
                    .finally(() => this.isSending = false);
                });
            }
        }
    }
</script>

<style scoped>

</style>
