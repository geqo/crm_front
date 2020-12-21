<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Login form</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <ValidationObserver ref="form" tag="div">
            <v-form>
              <ValidationProvider rules="required" v-slot="{ classes }" tag="div" class="modal-form registration-form form-group">
                <v-text-field v-model="email" label="Login" name="login" prepend-icon="person" type="text" />
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ classes }" tag="div" class="modal-form registration-form form-group">
                <v-text-field
                  v-model="password"
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="lock"
                  type="password"
                />
              </ValidationProvider>
            </v-form>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="handleLogin">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
    import {mapActions} from 'vuex';
    import {ValidationObserver, ValidationProvider} from "vee-validate/dist/vee-validate.full";

    export default {
        layout: 'layoutsLogin',
        middleware: 'guest',
        components: {
            ValidationObserver: ValidationObserver,
            ValidationProvider: ValidationProvider
        },
        data () {
            return {
                email: "",
                password: "",
            }
        },
        methods: {
          ...mapActions('login', ['login']),
          handleLogin() {
              let params = {
                  "email": this.email,
                  "password": this.password,
              };
              this.$refs.form.validate().then(success => {
                  if (success) {
                      this.$auth.login({ data: params }).then(res => {
                          this.$auth.setToken('local', 'Bearer ' + res.data.token);
                          this.$axios.setHeader('Authorization', 'Bearer ' + res.data.token);
                          this.$auth.ctx.app.$axios.setHeader('Authorization', 'Bearer ' + res.data.token);
                          this.getUser();
                      }).catch(err => {
                          let error = err.response.data.message;
                          this.$toast.error(error).goAway(1500);
                      })
                  }
              });
            
          },
          getUser() {
            this.$axios.get('/auth/me').then((resp) => {
              this.$auth.setUser(resp.data);
              this.$router.push({ name: 'index' });
            })
          }
        }
    };
</script>

<style>
</style>
