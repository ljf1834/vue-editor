<script setup>
console.log('Hello world!');
</script>

<template>
  <div class="wrapper">
    <editor-toolbar :uploadOptions="{
        action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
      }"/>
    <editor-item/>
    <editor-item/>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
