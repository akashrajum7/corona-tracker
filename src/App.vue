<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import Home from "./components/Home";

export default {
  name: "App",
  components: {
    Home
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Inconsolata&display=swap");
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  font-family: "Inconsolata", monospace;
}
body {
  background-color: beige;
}
</style>
