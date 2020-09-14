<template>
  <main>
    <h1 class="cover-heading">Calibrating Voices</h1>
    <p
      class="lead"
    >By clicking on the button a random champion name will appear. You can then click the record button and say the champion's name out loud (make sure mic usage is allowed). By then clicking the Send button you will submit the spoken words and a new champion will appear. Thanks for helping!</p>
    <p>Please also use champion abbrevations that you frequently use (For example: Trist instead of Tristana).</p>
    <div class="champ" v-if="champion">
      <img
        :src="settings.static_base_url+champion.iconUrl"
        :alt="champion.name"
        class="img-thumbnail"
      />
      <h2>{{champion.name}}</h2>
      <h3 v-if="status">{{status}}</h3>
      <form>
        <button
          type="button"
          class="btn btn-primary btn-space"
          v-on:click="record"
          v-if="!recording"
        >Record...</button>
        <button
          type="button"
          class="btn btn-primary btn-space"
          v-on:click="stopRecord"
          v-if="recording"
        >Stop Recording</button>
        <button type="button" class="btn btn-warning btn-space" v-on:click="reset">Reset what I said</button>
        <button type="button" class="btn btn-success btn-space" v-on:click="send">Send</button>
      </form>

      <p v-if="clickedRecord">
        We understood:
        <span v-if="wordsSaid">{{wordsSaid}}</span>
      </p>
    </div>
    <p class="lead" v-if="!champion">
      <a class="btn btn-lg btn-secondary" v-on:click="getRandomChampion">Get Champion</a>
    </p>
  </main>
</template>
<script>
import { settings } from "../variables.js";
import * as annyang from "annyang";
export default {
  data() {
    return {
      champion: false,
      statusText: "",
      settings: {},
      clickedRecord: false,
      wordsSaid: false,
      recording: false,
      status: false,
      wordsArray: [],
    };
  },
  mounted() {
    this.settings = settings;
  },
  methods: {
    getRandomChampion() {
      this.$http
        .get(settings.request_url + "champion")
        .then(function (response) {
          if (
            response.status == "200" &&
            response.body.action == "randomChamp"
          ) {
            this.champion = response.body;
            console.log(this.champion);
            this.status = false;
          }
        });
    },
    record() {
      console.log("Clicked");
      this.recording = true;
      this.clickedRecord = true;
      if (this.wordsSaid == false) {
        this.wordsSaid = "";
      }

      annyang.addCallback("result", (phrases) => {
        this.wordsArray = this.wordsArray.concat(phrases);
        phrases.forEach((phrase) => {
          this.wordsSaid += "'" + phrase + "' ";
        });

        console.log(phrases);
        console.log(this.wordsSaid);
        this.$forceUpdate();
      });
      annyang.start();
    },
    stopRecord() {
      annyang.removeCallback();
      this.clickedRecord = true;
      this.recording = false;
      annyang.abort();
    },
    reset() {
      this.wordsSaid = "";
      this.wordsArray = [];
    },
    send() {
      if (this.wordsArray.length > 0) {
        this.stopRecord();
        this.status = "Sending data...";
        this.$http
          .post(
            settings.request_url + "champion/" + this.champion.key,
            this.wordsArray
          )
          .then(function (response) {
            if (response.status == "200" && response.body.success) {
              this.reset();
              this.getRandomChampion();
              this.status = "Loading new Champ...";
            } else {
              this.reset();
              this.status =
                "Sorry there has been an error submiting your data :(";
            }
          });
      } else {
        this.status = "You have to record some words first";
      }
    },
  },
};
</script>
<style scoped>
.btn-space {
  margin-right: 5px;
}
</style>