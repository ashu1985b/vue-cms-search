<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HelloApp",
  components: {}
});
</script>

<style>
/* @import "./assets/main.css"; */
@import "./assets/app-base.css";
</style>
<style lang="postcss">
@define-mixin icon $network, $color: blue {
  .icon.is-$(network) {
    color: $color;
    @mixin-content;
  }
  .icon.is-$(network):hover {
    color: white;
    background: color($color lightness(7%));
  }
}
@mixin icon twitter, lightblue;
.h-tag {
  position: absolute;
  color: tomato;
  bottom: -1.8em;
  left: 0;
  font-size: 10px;
}
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* @mixin media-breakpoint-only-xs {
      background-color: orange;
  } */
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
  }
}
#nav a.router-link-exact-active {
  color: #42b983;
}

$map: (
  1: 1px,
  2: 20px,
  3: 30px,
  4: 50px,
);
$blue: #056ef0;
$column: 200px;
$important: ;
.menu_link {
  background: $blue;
  width: $column;
}
.menu {
  width: calc(4 * $column);
  /* @mixin float-left $(important); */
  /* Use interpolated variable if passing to mixin */
}
.foo {
  color: blue$(important);
  /* @mixin isIE 10px {
    color: color(red a(50%));
  }; */
}
/* .circle {
  @mixin circle 50px;
}
.size-50 {
  @mixin size 50px;
} */
/* .h- {
  @mixin loopMap $map, height;
};
.w- {
  @mixin loopMap $map, width;
}; */
/* a {
  @mixin hover {
    color: red;
  }
} */
@each $icon, $color in (r, g, b), (red, blue, green) {
  .icon-$(icon) {
    background-color: $(color);
  }
}
</style>
