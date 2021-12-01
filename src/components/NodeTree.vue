<template>
  <div
    class="dl border-b border-light-grey border-dotted text-sm"
    :class="{
      'w-flat-wrapper': node.flatLabel,
      'flex': !node.flatLabel
    }"
  >
    <label class="flex items-start justify-between px-3 py-1"
      :class="[node.flatLabel ? 'w-flat-label' : 'w-label']"
    >
      <span class="label-style" v-html="node.label"></span>
      <span
        v-if="node.hasPreview"
        class="btn btn--outline-blue btn--sm c-preview py-0 ml-2 flex-shrink-0"
        @click="openPreview(node.label, node.val)"
        title="See Preview"
      >
        <img :src="require('@/assets/images/eye-40.png')" width="20" height="20" alt="">
      </span>
    </label>
    <div v-if="isNonIterable" class="flex-1 px-3 py-1">
      {{ node.val || '⚠ Null' }}
    </div>
    <div v-else class="flex-1 border-l border-dotted border-light-grey h-data">
      <span v-if="node.displayVal" class="px-3 py-1 inline-block">{{ node.displayVal }}</span>
      <node v-for="(child, i) in node.val" :key="i" v-bind="child" />
    </div>
  </div>
</template>

<script>
// @ts-nocheck
import Vue from "vue";

export default Vue.extend({
  name: 'node',
  props: [
    'label','val',
    'displayLabel', 'displayVal',
    'isArray', 'isObject',
    'openPreview', 'hasPreview',
    'isPreviewable', 'flatLabel',
  ],
  computed: {
    node() {
      const {label, val, ...rest} = this.$props
      const k = label
      let v = val
      let displayLabel = ''
      let displayVal = ''
      let preview = null
      let flatLabel = false
      if (!this.isNonIterable && rest.isObject(v)) {
        const objKeys = Object.keys(v)
        displayLabel = `📌 Object { <b class="tc">${objKeys.length} Items</b> }`
        flatLabel = false
        // object map
        v = objKeys.map((i) => {
          return {
            ...rest,
            label: i,
            val: val[i],
          }
        })
        if (!objKeys.length) {
          displayVal = '⚠ Empty { }'
        }
      }
      else if (!this.isNonIterable && rest.isArray(v)) {
        displayLabel = `📌 Array [ <b class="tc">${v.length} Items</b> ]`
        flatLabel = true
        // array map
        v = v.map((i, idx) => {
          return {
            ...rest,
            label: `<div class="arr-label">
              ${k}
              <b class="ml-2">↳ [${(idx+1).toString()}]</b>
            </div>`,
            val: i,
          }
        })
        if (!v.length) {
          displayVal = '⚠ Empty [ ]'
        }
      }
      else {
        preview = rest.hasPreview || rest.isPreviewable(val)
      }
      return {
        ...rest,
        label: displayLabel ? `
          ${k}
          <small class="w-lbl block mt-2 text-black">
            ${displayLabel}
          </small>
          `
          : k,
        val: v,
        displayVal,
        hasPreview: preview,
        flatLabel
      }
    },
    isNonIterable() {
      const { val, isArray, isObject } = this.$props
      return !val || !(isArray(val) || isObject(val))
    }
  }
});
</script>

<style lang="postcss">
.dl {
  line-height: 1.5;
}
.label-style {
  color: #022b73;
  font-weight: 600;
}
.w-label {
  width: 160px;
}
.w-flat-label {
  justify-content: flex-start !important;
  padding: 8px 12px !important;
  margin: 0 !important;
  background-color: #f7f7fa !important;
  .label-style {
    display: flex;
    align-items: center;
  }
  .w-lbl {
    margin: 0 12px !important;
  }
  .issue-number {
    display: none !important;
  }
}
.w-flat-wrapper {
  & > .h-data {
    border: none !important;
    padding-left: 0 !important;
  }
}
.tc {
  color: #999;
}
.arr-label {
  display: flex;
  flex-direction: column;
  .issue-number {
    order: 100;
  }
}
</style>