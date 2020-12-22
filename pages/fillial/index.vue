<template>
    <v-layout column justify-center align-center>
        <v-flex xs12 class="fullwidth">
            <v-card class="my-5 elevation-4">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Fliale</v-list-item-title>
                    </v-list-item-content>
                    <v-item>
                        <v-btn to="/fillial/add" depressed color="primary">
                            Filiale hinzufügen
                        </v-btn>
                    </v-item>
                </v-list-item>
            </v-card>
            <v-row v-if="isAdmin">
                <v-col sm="12" md>
                    <v-btn color="primary" @click="checkGmail">Emails prüfen</v-btn>
                </v-col>
            </v-row>
            <v-list v-if="fillials">
                <v-card
                        class="my-5 elevation-4"
                        v-for="fillial in fillials"
                        :key="fillial.id"
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>
                                <v-row>
                                    <div class="col-4">{{fillial.name}} </div>
                                    <div class="col-6">{{fillial.email}}</div>
                                </v-row>
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-chip class="ma-2">
                            <v-btn icon color="primary" :to="`/fillial/`+fillial.id">
                                <v-icon>edit</v-icon>
                            </v-btn>
                        </v-chip>
                        <v-chip class="ma-2">
                            <v-btn icon color="error" @click.prevent="showConfirmDeleteDialog(fillial.id)">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </v-chip>
                    </v-list-item>
                </v-card>
            </v-list>
        </v-flex>
        <v-dialog v-model="confirmDelete" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Filiale löschen</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="confirmDelete = false">No</v-btn>
                    <v-btn color="green darken-1" text @click="acceptDeleteFillial">Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    export default {
        middleware: 'authenticated',
        data() {
            return {
                confirmDelete: false,
                fillial_id: null
            };
        },
        computed: {
            ...mapState({
                fillials: state => state.fillial.fillials,
            }),
        },
        mounted() {
            this.getFillials().then(res => {
            }).catch(err => {
                let error = err.response.data.message;
                this.$toast.error(error).goAway(1500);
            });
        },
        methods: {
            ...mapActions('fillial', ['getFillials', 'deleteFillial']),
            showConfirmDeleteDialog(id) {
                this.confirmDelete = true;
                this.fillial_id = id;
            },
            checkGmail() {
                this.$axios.get('checkGmail').then(res => {
                    this.$toast.success(res.data.message).goAway(1500);
                }).catch(error => {
                    let message = error.response.data.message;
                    this.$toast.error(message).goAway(1500);
                })
            },
            acceptDeleteFillial() {
                this.deleteFillial({id: this.fillial_id}).then(res => {
                    this.$toast.success(res.data.message).goAway(1500);
                    this.confirmDelete = false;
                    this.user_id = null;
                }).catch(err => {
                    this.confirmDelete = false;
                    this.user_id = null;
                    let error = err.response.data.message;
                    this.$toast.error(error).goAway(1500);
                });
            }

        }
    };
</script>
