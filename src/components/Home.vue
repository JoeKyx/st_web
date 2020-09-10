<template>
  <div>
    <div class="search-box">
      <input
        type="text"
        v-model="summonerName"
        class="search-bar"
        placeholder="Search..."
        @keypress="fetchSummoner"
      />
    </div>
    <div class="status-text">{{statusText}}</div>
  </div>
</template>
<script>
import { settings } from "../variables.js";
export default {
  data() {
    return {
      summonerName: "",
      statusText: "",
    };
  },
  methods: {
    fetchSummoner(e) {
      if (e.key == "Enter") {
        console.log(this);

        this.$http
          .get(settings.request_url +"game/"+ this.summonerName)
          .then(function (response) {
            console.log(response);
            if (response.status == "200") {
              if (response.body.found == true) {
                this.$router.push({
                  name: "game",
                  params: { summonerName: this.summonerName },
                });
              } else {
                this.statusText =
                  this.summonerName + "is currently not ingame.";
              }
            }
          });
        console.log("Good morning");
      }
    },
  },
};
</script>
<style scoped>
.search-box {
  width: 100%;
  margin-bottom: 30px;
}

.search-box .search-bar {
  display: block;
  width: 100%;
  padding: 15px;
  color: #313131;
  font-size: 20px;

  appearance: none;
  border: none;
  outline: none;
  background: none;

  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0px 16px 0px 16px;
  transition: 0.4s;
}

.search-box .search-bar:focus {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 16px 0px 16px 0px;
}
</style>