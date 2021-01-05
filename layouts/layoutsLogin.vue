<template>
    <v-app dark>
        <v-main>
            <v-container>
                <v-row>
                    <v-col class="logo-col">
                        <div class="logo-content">
                            <img class="logo" src="~assets/img/logo.png" alt="">
                            <h3>CRM admin panel</h3>
                        </div>
                    </v-col>
                </v-row>
                <Nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>
<style lang="scss">
    .logo-col {
        display: flex;
        justify-content: center;
        .logo-content {
            .logo {
                width: 160px;
            }
            h3 {
                text-align: center;
            }
        }
    }
</style>
