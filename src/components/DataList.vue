<template>
  <div>
    <span
      class="rounded-t-full rounded-r-full inline-block font-bold
      bg-blue text-white py-1 px-2 mb-2"
    >
      @ {{ $props.index}}
    </span>
    <a
      v-if="url"
      :href="url"
      class="inline-block text-blue text-sm mb-2 ml-2"
      target="_blank"
    >
      <i class="mr-2">🔗</i>
      <span class="underline">{{ url }}</span>
    </a>
    <div class="py-2 rounded-md mb-8 border border-light-grey">
      <NodeTree v-for="(elem, i) in list" v-bind="elem" :key="i" />
    </div>
  </div>
</template>

<script>
// @ts-nocheck
import Vue from "vue";
import NodeTree from "@/components/NodeTree.vue";

export default Vue.extend({
  name: "DataList",
  components: {
    NodeTree,
  },
  props: ['data', 'api', 'index'],
  data() {
    return {
      url: null
    }
  },
  computed: {
    list() {
      const { data, api } = this.$props;
      const {openPreview, isObject, isArray, isPreviewable} = this;
      return Object.keys(data).map((key) => {
        const val = data[key]
        let k = key
        const keyFilterCount = data.keyFilterCount && data.keyFilterCount[key]
        const hasPreview = isPreviewable(val)
        if (keyFilterCount) {
          k = `
            ${key}
            <small class="text-black pt-2 block issue-number">
              ⛔ Keyword Found: ${keyFilterCount}
            </small>
          `
        }
        const {baseUrl, prop = ''} = api && api.urlProps || {}
        const t = prop.split('.')
        if (baseUrl && t[0] === key) {
          let bfr = data
          for (const i of t) {
            if(!bfr[i]) {break}
            bfr = bfr[i]
          }
          if (bfr && this.isString(bfr)) {
            this.url = baseUrl + bfr
          }
        }
        return {
          label: k,
          val,
          hasPreview,
          openPreview,
          isObject,
          isArray,
          isPreviewable
        }
      });
    }
  },
  methods: {
    openPreview(field, html) {
      this.$emit('open-preview', {field, html})
    },
    isObject(val) { return (typeof val === 'object') && !this.isArray(val) && val !== null },
    isArray(val) { return Array.isArray(val) },
    isPreviewable(val) {
      return !this.isObject(val) && /<\/?[a-z][\s\S]*>/i.test(val)
    },
    isString(v) {
      return typeof v === 'string' || v instanceof String
    }
  }
});
</script>
