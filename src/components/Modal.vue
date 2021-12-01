<template>
  <transition name="fade">
    <div class="modal" :class="{'show-hilgt': highlightAttrs}" v-if="show">
      <div class="modal__backdrop" @click="closeModal()"/>

      <div class="modal__dialog" ref="modalBody">
        <div class="modal__header border-b border-light-grey">
          <slot name="header"/>
          <button type="button" class="modal__close btn btn--outline-blue btn--sm" @click="closeModal()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
              <path
                fill="currentColor"
                d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
              ></path>
            </svg>
          </button>
        </div>

        <div class="modal__body prose prose-sm">
          <slot name="body"/>
        </div>

        <div class="modal__footer border-t border-light-grey">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// @ts-nocheck
export default {
  name: "Modal",
  data() {
    return {
      show: false,
      highlightAttrs: false
    };
  },
  methods: {
    closeModal() {
      this.show = false;
      this.highlightAttrs = false;
      document.querySelector('body').style.overflow = '';
    },
    openModal() {
      this.show = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    highlightAttributes() {
      this.highlightAttrs = !this.highlightAttrs
    },
  },
};
</script>


<style lang="postcss" scoped>
.modal {
  overflow-x: auto;
  overflow-y: auto;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  &__backdrop {
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
  }
  &__dialog {
    background-color: #ffffff;
    position: relative;
    width: 600px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    z-index: 2;
    font-size: 14px;
    @media screen and (max-width: 992px) {
      width: 90%;
    }
  }
  &__close {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    line-height: 1;
  }
  &__header {
    padding: 20px 20px 10px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  &__body {
    padding: 10px 20px 10px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  &__footer {
    padding: 10px 20px 20px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<style lang="postcss">
/* Customize anchor href as title inside modal */
.modal--preview {
  .modal__dialog {
    width: 840px;
  }
  .modal__body {
    padding-right: 32px;
  }
  .issue-number {
    font-size: 16px;
  }
  img[src], a[href],[title] {
    &:hover {
      z-index: 100;
      background-color: white !important;
      &:after,
      &:before {
        opacity: 1;
        visibility: visible;
      }
    }
    &:after, &:before {
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.4s 0.4s ease;
    }
  }
  &.show-hilgt {
    img[src], a[href],[title] {
      &:after,
      &:before {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  img[src], a[href],[title] {
    &.hilgt:after,
    &.hilgt:before {
      opacity: 1;
      visibility: visible;
    }
  }
  img[src], a[href],[title] {
    &:before {
      content: "⇣";
      font-size: 20px;
      color: indianred;
      position: absolute;
      top: -20px;
      left: 7px;
    }
  }
  img[src], a[href], [title] {
    &:after {
      background-color: #ecffc8;
      color: #333;
      font-size: 10px;
      line-height: 16px;
      position: absolute;
      padding: 3px 6px;
      bottom: 100%;
      left: 0;
      box-shadow: 1px 1px 3px #999;
      border-radius: 4px;
      opacity: 0.9;
      z-index: 99;
      min-height: 24px;
      width: 320px;
      margin-bottom: 10px;
    }
  }
  [href],[title],[src] {
    &:after {
      content: "href=" attr(href) " ● title=" attr(title);
   }
  }
  img[title], img[src], img[alt] {
    &:after {
      content: "src=" attr(src) " ● alt=" attr(alt) " ● title=" attr(title);
   }
  }
  /*
  [href]:after {
    content: "href=" attr(href);
  }
  [title]:after {
    content: "title=" attr(title);
  }
  img[src]:after {
    content: " | src=" attr(src);
  }
  */
  img[src],
  a[href],
  [title] {
    position: relative;
    text-decoration: underline dotted;
  }
}
</style>