import Vue from 'vue'
import {mapGetters} from 'vuex'

const User = {
    install(Vue, options) {
        Vue.mixin({
            computed: {
                ...mapGetters({
                    user: 'user',
                    authenticated: 'authenticated',
                    userRole: 'userRole',
                    isManager: 'isManager',
                    isObinspector: 'isObinspector',
                    isForeman: 'isForeman',
                    isAdmin: 'isAdmin',
                    isStorekeeper: 'isStorekeeper',
                })
            }
        })
    }
};

Vue.use(User);
