<template>
  <v-layout>
    <v-layout column>
      <v-row>
        <v-col>
          <v-card class="pa-4">
            <p v-if="checklists_item.name">
              Name: {{checklists_item.name}}
            </p>
            <p v-if="checklists_item.price">
              Price: {{checklists_item.price}}
            </p>
            <p v-if="checklists_item.notes">
              Notes: {{checklists_item.notes}}
            </p>
          </v-card>
        </v-col>
      </v-row>
      <p v-if="checklists_item.images && checklists_item.images.length">Files</p>
      <v-list-item three-line>
        <v-list-item-avatar tile size="150" color="grey" v-for="image in checklists_item.images">
          <img
            :key="image.id"
            :src="image.path"
            alt
          />
        </v-list-item-avatar>
      </v-list-item>
    </v-layout>
  </v-layout>
</template>

<script>
  import {mapActions, mapState} from 'vuex';

  export default {
    components: {},
    data() {
      return {}
    },
    computed: {
      ...mapState({
        checklists_item: state => state.checklist.checklists_item,
      }),
    },
    mounted() {
      this.getChecklistItem({id: this.$route.params.id}).then().catch(err => {
      })
    },
    methods: {
      ...mapActions('checklist', ['getChecklistItem']),
    }
  }
</script>
