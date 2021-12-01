<template>
  <h1 class="text-center mt-0 mb-4">{{ msg }}</h1>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HelloWorld",
  props: {
    msg: String
  }
});
</script>

