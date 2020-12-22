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
              Preis: {{checklists_item.price}}
            </p>
            <p v-if="checklists_item.notes">
              Notizen: {{checklists_item.notes}}
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
          <a @click.prevent="downloadImage(image.path)" href="#" class="download-btn" type="button">
            download
          </a>
          <button @click="deleteImg(image.id)" class="delete-btn" type="button">
            <v-icon>delete</v-icon>
          </button>
        </v-list-item-avatar>
      </v-list-item>
    </v-layout>
  </v-layout>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import axios from 'axios';

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
      ...mapActions('checklist', ['getChecklistItem', 'deleteChecklistImage']),
      deleteImg(id) {
        this.deleteChecklistImage({id: id}).then(res => {

        })
      },
      downloadImage(url) {
        axios.get(url, {
          responseType: 'arraybuffer',
        }).then(response => {
          const type = response.headers['content-type']
          const blob = new Blob([response.data], { type: type, encoding: 'UTF-8' })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.setAttribute('download',"image");
          link.click()
          }
        );
      },
    }
  }
</script>
<style>
  .delete-btn{
    position: absolute;
    background: red;
    width: 20px;
    color: #fff;
    top: 0;
    right: 0;
    height: 20px;
    line-height: 20px;
  }
  .download-btn{
    position: absolute;
    background: #94af45;
    color: #fff!important;
    bottom: 0;
    left: 0;
  }
</style>
