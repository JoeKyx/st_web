<template>
  <div id="app">
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
<script>
import Vue from "vue";
import VueRouter from "vue-router";
import router from "./router";
import vueResource from "vue-resource";
Vue.use(vueResource);
Vue.use(VueRouter);
new Vue({
  router,
});

export default {};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: "montserrat", sans-serif;
  height: 100%;
}


main {
  min-height: 100vh;
  padding: 25px;

/*  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25),
    rgba(0, 0, 0, 0.75)
  );*/
}

.blueTeam {
  color: cornflowerblue;
  float: left;
}
.redTeam {
  color: red;
  float: left;
}
.champion {
  width: 50%;
  height: 100%;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
  background-size: cover;
  background-position: bottom;
  transition: 0.4s;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 0px 16px 0px 16px;
  transition: 0.4s;
}
.game-info-box {
  height: 100%;
}
.game-info-box .gameid {
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}


#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
 /*  background-image: url("assets/Aatrox.jpg");*/
  background-size: cover;
  background-position: bottom;
  transition: 0.4s;
}

@import'~bootstrap/dist/css/bootstrap.css'

</style>
