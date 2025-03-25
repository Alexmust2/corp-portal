<template>
    <div v-if="show" class="role-modal">
      <div class="role-modal-content">
        <h2>{{ title }}</h2>
        <button class="role-modal-close" @click="closeModal">&times;</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    props: ['title'],
    setup(props, { emit }) {
      const show = ref(false);
  
      const closeModal = () => {
        show.value = false;
        emit('close');
      };
  
      return {
        show,
        closeModal
      };
    }
  }
  </script>

  <style scoped>
  .role-modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .role-modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    position: relative;
  }
  
  .role-modal-close {
    position: absolute;
    top: 10px;
    right: 20px;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .role-modal-close:hover,
  .role-modal-close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  </style>