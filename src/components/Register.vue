<template>
    <div>
        <b-modal id="modal-1" title="Register" size="lg" centered v-model="modalShow"
                 :ok-title="'Register'"
                 :ok-only="true"
                 @close="handleClose"
                 @hidden="handleClose">

            <b-form @submit.stop.prevent="onSubmit" @change="error = null">
                <b-form-group
                        id="username-group"
                        label="Username"
                        label-for="username-input"
                >
                    <b-form-input id="username-input"
                                  @focus="error = null"
                                  name="username-input"
                                  v-model="form.username"
                                  v-validate="{required: true, min: 3, max: 50}"
                                  :state="validateState('username-input')"
                                  aria-describedby="input-username-live-feedback"
                                  data-vv-as="Username">
                    </b-form-input>

                    <b-form-invalid-feedback id="input-username-live-feedback">{{ veeErrors.first('username-input') }}</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                        id="email-group"
                        label="Email"
                        label-for="email-input"
                >
                    <b-form-input id="email-input"
                                  @focus="error = null"
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
            <b-form-group
                    id="password-group"
                    label="Password"
                    label-for="password-input">
                <b-form-input
                        id="password-input"
                        @focus="error = null"
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
                        variant="primary"
                        @click="handleOk"
                        :disabled="isRegistering"
                    >
                        Register
                    </b-button>
                    <b-spinner v-if="isRegistering" class="ml-2"></b-spinner>
                    </div>
                </template>

                <b-alert show variant="danger" v-if="error">{{error}}</b-alert>
        </b-modal>

    </div>

</template>

<script>
    import backendService from "../service";
    import {publicPath} from "../../vue.config";

    export default {
        name: "Register",
        data() {
            return {
                modalShow: true,
                prevRoute: null,
                form: {
                    email: null,
                    password: null,
                    username: null,
                },
                isRegistering: false,
                error: null,
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.prevRoute = from
            })
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
            resetModal() {
                this.name = ''
                this.nameState = null
            },
            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault()
                this.onSubmit()
            },
            handleClose() {
                let currentLocation = this.$route.path;
                currentLocation = currentLocation.replace('register', '');
                if (currentLocation === '')
                    currentLocation += publicPath;

                this.$router.push({path: currentLocation, query: this.$route.query})
            },
            onSubmit() {
                this.$validator.validateAll().then(result => {
                    if (!result) {
                        return;
                    }


                    this.isRegistering = true;
                    backendService.register(this.form)
                    .then(() => {
                        if (!this.$route.path.includes('login') &&
                            !this.$route.path.includes('forgot') &&
                            !this.$route.path.includes('reset'))
                                this.$router.push({path: `${publicPath}login`, replace: true, query: this.$route.query});
                    })
                    .catch((error) => {
                        if (error.response) {
                            this.error = error.response.data.message;
                            console.log(error.response);
                        } else {
                            this.error = "Failed to register";
                        }
                        console.log(error);
                        this.isRegistering = false;
                    })
                });
            }
        }
    }
</script>

<style scoped>

</style>
