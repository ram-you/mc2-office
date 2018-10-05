<template>
  <transition @before-enter="beforeEnter" @enter="enter" @leave="leave" :css="false">
    <slot></slot>
  </transition>
</template>

<script>
import anime from "animejs";

export default {
  props: ["duration"],
  methods: {
    beforeEnter: function (el) {
      if (this.duration > 0) { el.style.transform = "translateY(100%)"; } else { el.style.opacity = 0; }
    },
    enter: function (el, done) {
      if (this.duration > 0) {        anime({
          targets: el,
          translateY: 0,
          opacity: 1,
          duration: this.duration,
          easing: "linear",
          complete: done
        });      } else {
        anime({
          targets: el,
          opacity: 1,
          duration: 300,
          complete: done
        });
      }
    },
    leave: function (el, done) {
      if (this.duration > 0) {        anime({
          targets: el,
          translateY: "-100%",
          opacity: 0,
          duration: this.duration / 2,
          easing: "linear",
          scale: .25,
          complete: done
        });      } else {
        anime({
          targets: el,
          opacity: 0,
          duration: 300,
          complete: done
        });
      }
    }
  }
};
</script>
