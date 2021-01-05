<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 class="fullwidth">
      <v-row>
        <v-col>
          <v-btn v-if="isManager || isAdmin" color="pink" dark absolute bottom right fab @click="createNew = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-dialog v-model="createNew" center max-width="500">
            <v-form
                ref="form"
                @submit.prevent="submitForm"
                v-model="valid"
                lazy-validation
            >
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar color="green" dark>
                  <v-toolbar-title>Neuer Termin</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-select
                      :items="projects"
                      name="Projekte"
                      v-model="installCalendar.project_id"
                      label="Projekt auswählen"
                      outlined
                      item-text="client_id"
                      item-value="id"
                      class="mt-3"
                  >
                  </v-select>
                  <v-menu
                      v-model="dateMenu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          label="Datum"
                          hint="MM/DD/YYYY format"
                          persistent-hint
                          prepend-icon="event"
                          readonly
                          v-model="installCalendar.date"
                          v-bind="attrs"
                          v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="installCalendar.date" no-title @input="dateMenu = false"></v-date-picker>
                  </v-menu>
                  <v-dialog
                      ref="dialog"
                      v-model="timeModal"
                      :return-value.sync="installCalendar.time"
                      persistent
                      width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          v-model="installCalendar.time"
                          label="Zeit terminieren"
                          prepend-icon="access_time"
                          readonly

                          v-bind="attrs"
                          v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                        format="24hr"
                        v-if="timeModal"
                        v-model="installCalendar.time"
                        full-width
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="timeModal = false">Cancel</v-btn>
                      <v-btn text color="primary" @click="$refs.dialog.save(installCalendar.time)">OK</v-btn>
                    </v-time-picker>
                  </v-dialog>
                  <v-select
                      v-model="installCalendar.brigades"
                      :items="brigades_list"
                      label="Team auswählen"
                      item-text="name"
                      item-value="id"
                      outlined
                      multiple
                  ></v-select>
                  <v-textarea v-model="installCalendar.notes" label="Notizen"></v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="secondary" @click="createNew = false">Schließen</v-btn>
                  <v-btn color="primary" type="submit">Erstellen</v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat color="white">
              <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Heute</v-btn>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>
              <v-toolbar-title>{{ title }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on ,attrs }">
                  <v-btn
                      outlined
                       color="grey darken-2"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <span>{{chosen}}</span>
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title @click="chosen = 'Alle Teams'">Alle Teams</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-for="brigade in brigades_list" :key="brigade.id"  @click="filterBrigad(brigade)">
                    <v-list-item-title>{{brigade.name}}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      outlined
                      color="grey darken-2"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Tag</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Woche</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Monat</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="600" v-if="calendar">
            <v-calendar
              locale="de"
              ref="calendar"
              color="primary"
              :events="events"
              :type="type"
              v-model="focus"
              :event-color="getEventColor"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="updateRange"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-btn icon @click="edit = !edit">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-text-field v-model="selectedEvent.address" label="Adresse" :disabled="!edit"></v-text-field>
                  <v-text-field v-model="selectedEvent.meeting_date" label="Datum" :disabled="!edit"></v-text-field>
                  <v-text-field v-model="selectedEvent.meeting_time" label="Zeit" :disabled="!edit"></v-text-field>
                </v-card-text>
                <v-card-actions>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
import {mapState, mapActions} from 'vuex';

export default {
  middleware: 'authenticated',

  data: () => ({
    valid: false,
    installCalendar: {},
    dateMenu: false,
    timeModal: false,

    edit: false,
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Monat",
      week: "Woche",
      day: "Tag"
    },
    chosen: "Alle Teams",
    chosen1: "Team auswählen",
    start: null,
    end: null,
    createNew: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1"
    ],
    names: [],
    projects: []
  }),
  computed: {
    ...mapState({
      calendar: state => state.projects.calendar,
      brigades_list: state => state.foreman.brigades_list,
    }),
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  mounted() {
    this.getReadyForMontageProjects();
    this.getBrigadeList();

    this.getCalendar().then(res=> {
      this.$nuxt.$loading.finish();
      this.$refs.calendar.checkChange();
    }).catch((error) => {
      let message = error.response.data.message;
      this.$toast.error(message);
    });
  },
  methods: {
    ...mapActions('projects', ['getCalendar', 'installMontage']),
    ...mapActions('foreman', ['getBrigade']),
    submitForm() {
      if(this.$refs.form.validate()){
        this.installMontage({id: this.installCalendar.project_id, data: this.installCalendar}).then(res => {
          this.createNew = false;
          this.installCalendar={};
          this.$refs.calendar.checkChange();
          this.addEvent(res.data.project)
          }).catch(err => {
          let error = err.response.data.message;
          this.$toast.error(error);
        })
      }
    },
    addEvent(calendar) {
      const allDay = this.rnd(0, 3) === 0;
      const rand = this.rnd(0, this.calendar.length - 1);
      this.events.push({
        name: calendar.full_name,
        start: this.formatDate(new Date(calendar.meeting_date), !allDay),
        end: this.formatDate(new Date(calendar.meeting_date), !allDay),
        color: this.colors[rand],
        address: calendar.address,
        meeting_date: calendar.meeting_date,
        meeting_time: calendar.meeting_time,
      });
    },
    getReadyForMontageProjects() {
      this.$axios.get('projects/by-status-code/3').then(res => {
        this.projects = res.data.data;
      }).catch(error => {

      })
    },
    filterBrigad(brigade){
      this.chosen = brigade.name;
      this.getCalendar({brigadir_id: brigade.id}).then(res=> {
        this.$nuxt.$loading.finish();
        this.$refs.calendar.checkChange();
        this.updateRange({start: this.start, end: this.end});
      }).catch((error) => {
        console.log(error);
        // let message = error.response.data.message;
        // this.$toast.error(message);
      });
    },
    getBrigadeList() {
      this.getBrigade();
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },

    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    setToday () {
      this.focus = ''
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];
      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < this.calendar.length; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const rand = this.rnd(0, this.calendar.length - 1);
        events.push({
          name: this.calendar[i].full_name,
          start: this.formatDate(new Date(this.calendar[i].meeting_date), !allDay),
          end: this.formatDate(new Date(this.calendar[i].meeting_date), !allDay),
          color: this.colors[rand],
          address: this.calendar[i].address,
          meeting_date: this.calendar[i].meeting_date,
          meeting_time: this.calendar[i].meeting_time,
        });
      }

      this.start = start;
      this.end = end;
      this.events = events;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    }
  }
};
</script>

<style>
</style>
