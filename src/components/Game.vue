<template>
  <div class="game-wrap" v-if="game">
    <div class="game-info-box">
      <div class="gameid">Game ID: {{ game.gameId }}</div>
      <div
        class="champion"
        v-for="participant in sortedParticipants"
        :key="participant.summonerName"
        v-bind:class="{
          blueTeam: participant.teamId == 100,
          redTeam: participant.teamId == 200,
        }"
        v-bind:style="{
          'background-image':
            'url(' +
            settings.static_base_url +
            participant.champion.splashUrl +
            ')',
        }"
      >
        <img
          class="icon"
          :src="settings.static_base_url + participant.champion.iconUrl"
        />
        <span class="summonername">{{ participant.summonerName }}</span>
        <div class="spells">
          <span
            v-on:click="
              timeSpell(game.gameId, participant.champion, participant.spell1Id)
            "
          >
            CD: {{ participant.spell1cd }}
            <img :src="settings.static_base_url + participant.spell1Image" />||
          </span>
          <span
            v-on:click="
              timeSpell(game.gameId, participant.champion, participant.spell2Id)
            "
          >
            CD: {{ participant.spell2cd }}
            <img :src="settings.static_base_url + participant.spell2Image" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import * as annyang from "annyang";
import vueNativeSock from "vue-native-websocket";
import { settings } from "../variables.js";

const responsiveVoice = window.responsiveVoice;
Vue.use(vueNativeSock, settings.websocket_url, {
  connectManually: true,
  format: "json",
});

export default {
  data() {
    return {
      game: false,
      spellnames: [],
      summonerName: "",
      sortedParticipants: [],
      settings: {},
    };
  },
  mounted() {
    annyang.addCallback("result", function (phrases) {
      console.log("Speech recognized. Possible sentences said:");
      console.log(phrases);
    });
    console.log("Created");
    console.log(responsiveVoice);
    responsiveVoice.OnVoiceReady = function () {
      console.log("speech time?");
    };
    this.settings = settings;
    // Connect to the websocket and once connected ask fo the game data
    this.$connect();
    this.$socket.onopen = () => {
      if (this.$route.params.summonerName) {
        this.$socket.sendObj({
          action: "connect",
          summonerName: this.$route.params.summonerName,
        });
      }
    };

    this.$options.sockets.onmessage = (data) => {
      console.log(data.data);
      let message = JSON.parse(data.data);
      if (message.action == "connected") {
        this.game = message.game;
        console.log(message);
        console.log(this.game);
        this.spellnames = message.game.spellnames;
        var indexBlue = 0;
        var indexRed = 1;
        this.game.participants.forEach((participant) => {
          if (annyang) {
            // Let's define our first command. First the text we expect, and then the function it should call
            var key1 =
              participant.champion.name +
              " " +
              this.game.spellnames[participant.spell1Id];
            var key2 =
              participant.champion.name +
              " " +
              this.game.spellnames[participant.spell2Id];
            console.log(key1);
            var commands = {
              [key1]: () => {
                this.timeSpell(
                  this.game.gameId,
                  participant.champion,
                  participant.spell1Id
                );
              },
              [key2]: () => {
                this.timeSpell(
                  this.game.gameId,
                  participant.champion,
                  participant.spell2Id
                );
              },
            };

            // Add our commands to annyang
            annyang.addCommands(commands);

            // Start listening. You can call this here, or attach this call to an event, button, etc.
       /*      annyang.start(); */
          }

          if (participant.teamId == 100) {
            this.sortedParticipants[indexBlue] = participant;
            indexBlue = indexBlue + 2;
          } else {
            this.sortedParticipants[indexRed] = participant;
            indexRed = indexRed + 2;
          }
          setInterval(() => {
            if (participant.spell1cd > 0) {
              participant.spell1cd--;
              if (participant.spell1cd < 0) {
                participant.spell1cd = 0;
              }
              if (participant.spell1cd > 9 && participant.spell1cd < 11) {
                responsiveVoice.speak(
                  participant.champion.name +
                    "'s " +
                    this.spellnames[participant.spell1Id] +
                    " is up in 10 seconds "
                );
              }
            }
            if (participant.spell2cd > 0) {
              participant.spell2cd--;
              if (participant.spell2cd < 0) {
                participant.spell2cd = 0;
              }
              if (participant.spell2cd > 9 && participant.spell2cd < 11) {
                responsiveVoice.speak(
                  participant.champion.name +
                    "'s " +
                    this.spellnames[participant.spell2Id] +
                    " is up in 10 seconds "
                );
              }
            }
          }, 1000);
        });
        if (annyang) {
          annyang.start();
        }
      } else if (message.action == "spell") {
        console.log(message);

        this.game.participants.forEach((participant) => {
          if (participant.championId == message.champKey) {
            console.log(this.spellnames);
            responsiveVoice.speak(
              "Timed " +
                this.spellnames[message.spellId] +
                " for " +
                participant.champion.name
            );

            if (participant.spell1Id == message.spellId) {
              participant.spell1cd = message.cooldown;
            } else if (participant.spell2Id == message.spellId) {
              participant.spell2cd = message.cooldown;
            }
          }
        });
      }
    };
  },

  methods: {
    timeSpell(gameId, champion, spellId) {
      const req = {
        action: "time",
        gameId: gameId,
        champKey: champion.key,
        spellId: spellId,
      };
      this.$socket.sendObj(req);
      console.log(req);
    },
    createConnectJson(summonerName) {
      const sumJson = {
        name: summonerName,
        server: "EUW",
        action: "connect",
      };
      console.log(sumJson);
      return sumJson;
    },
  },
};
</script>
<style scoped>
.champion {
}
.icon {
  display: inline-block;
  float: left;
}
.spells {
  display: inline-block;
  float: right;
  font-weight: bold;
  text-shadow: 1px 1px 1px black, 1px -1px 1px black, -1px 1px 1px black,
    -1px -1px 1px black;
}
.summonername {
  font-weight: bold;
  text-shadow: 1px 1px 1px black, 1px -1px 1px black, -1px 1px 1px black,
    -1px -1px 1px black;
}
</style>
