<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  html,
  body,
  div,
  ul,
  li,
  p {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  html,
  body,
  #app {
  	width: 100%;
  	height: 100%;
  }
  #app {
    background-image: url("./assets/img/backgroundimage.jpg");
    background-position: center;
    background-size: cover;
  }
</style>
