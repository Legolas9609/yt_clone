<template>
    <div>
        <b-modal id="modal-1" title="Login" size="lg" centered v-model="modalShow"
                 @close="handleClose"
                 @hidden="handleClose"
                >

            <b-form @submit.stop.prevent="onSubmit" @change="error = null">
                <b-form-group
                        id="email-group"
                        label="Email"
                        label-for="email-input"
                >
                    <b-form-input id="email-input"
                                  @focus="error = null"
                                  name="email-input"
                                  v-model="form.username"
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
            <b-form-group>
                <b-button variant="link" style="padding-left: 0" @click="handleRegisterClick">
                    Register
                </b-button>
                <b-button variant="link" @click="handleForgotClick">
                    Forgot password?
                </b-button>
            </b-form-group>
            <template v-slot:modal-footer>
                    <div class="w-100 d-flex algin-content-center">
                    <b-button
                        variant="primary"
                        @click="handleOk"
                        :disabled="isLoggingIn"
                    >
                        Login
                    </b-button>
                    <b-spinner v-if="isLoggingIn" class="ml-2"></b-spinner>
                    </div>
                </template>
                <b-alert show variant="danger" v-if="error">{{error}}</b-alert>
        </b-modal>

    </div>

</template>

<script>
    import backendService from "../service";
    import EventBus from '../event-bus';
    import {publicPath} from "../../vue.config";

    export default {
        name: "Login",
        data() {
            return {
                modalShow: true,
                form: {
                    username: null,
                    password: null
                },
                isLoggingIn: false,
                error: null,
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
            resetModal() {

            },
            handleOk(bvModalEvt) {
                this.isLoggingIn = true;
                bvModalEvt.preventDefault()
                this.onSubmit()
            },
            handleClose() {
                if (window.history.length > 1) {
                    let _path =this.$route.path;
                    _path = _path.replace('/login', '').replace('/register', '').replace('/forget', '').replace('reset', '');

                    if (_path === '')
                        _path += publicPath;

                    this.$router.push({path: _path, replace: true, query: this.$route.query});
                } else
                    this.$router.push(`${publicPath}`);
            },
            handleRegisterClick() {
                if (!this.$route.path.includes('register') &&
                    !this.$route.path.includes('forgot') &&
                    !this.$route.path.includes('reset'))
                        this.$router.push({path: `${publicPath}register`, replace: true, query: this.$route.query})
            },
            handleForgotClick() {
                if (!this.$route.path.includes('register') &&
                    !this.$route.path.includes('forgot') &&
                    !this.$route.path.includes('reset'))
                        this.$router.push({path: `${publicPath}forgot`, replace: true, query: this.$route.query})
            },
            onSubmit() {
                this.$validator.validateAll().then(result => {
                    if (!result) {
                        this.isLoggingIn = false;
                        return;
                    }

                    backendService.login(this.form)
                        .then(response => {
                            console.log(response)
                            localStorage.setItem("token", response.data.accessToken);
                            EventBus.$emit('logged', 'in')
                            this.handleClose();
                        })
                        .catch(error => {
                            console.log(error);
                            this.error = "Failed to login"
                            this.isLoggingIn = false
                        });
                });
            }
        }
    }
</script>

<style scoped>

</style>
