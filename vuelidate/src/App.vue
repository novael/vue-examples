<template>
  <div class="root">
    <h2>Create an Account</h2>
    <p>
      <input type="text" placeholder="email" v-model="state.email">
      <span v-if="v$.email.$error">{{ v$.email.$errors[0].$message}}</span>
    </p>
    <p>
      <input type="password" placeholder="password" v-model="state.password.password">
      <span v-if="v$.password.password.$error">{{ v$.password.password.$errors[0].$message}}</span>
    </p>
    <p>
      <input type="password" placeholder="confirm password" v-model="state.password.confirm">
      <span v-if="v$.password.confirm.$error">{{ v$.password.confirm.$errors[0].$message}}</span>
    </p>
    <button @click="submitForm">Submit</button>
  </div>
</template>

<script setup>
  import { reactive, computed } from 'vue';
  import useVuelidate from '@vuelidate/core';
  import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators';

  //Vue 2.x
  // export default {
  //   data() {
  //     return {
  //       v$: useVuelidate(),
  //       email: '',
  //       password: {
  //         password: '',
  //         confirm: ''
  //       }
  //     }
  //   },
  //   validations() {
  //     return {
  //       email: { required },
  //       password: {
  //         password: { required },
  //         confirm: { required }
  //       }
  //     }
  //   },
  //   methods: {
  //     submitForm() {
  //       this.v$.$validate();
  //       if(!this.v$.$error) {
  //         alert("Form submitted successfully");
  //       }
  //       else {
  //         alert("This form has errors");
  //       }
  //     }
  //   }
  // }

  const state = reactive({
    email: '',
    password: {
      password: '',
      confirm: ''
    }
  });

  const mustBeGmail = (value) => value.includes("gmail");

  const rules = computed(() => {
    return {
      email: { 
        required,
        email,
        mustBeGmail: helpers.withMessage("Must be a valid gmail email", mustBeGmail)
      },
      password: {
        password: { required, minLength: minLength(6) },
        confirm: { required, sameAs: sameAs(state.password.password) }
      }
    }
  });

  const v$ = useVuelidate(rules, state);

  const submitForm = () => {
    v$.value.$validate();
    if(!v$.value.$error) {
      alert("Form successfully submitted.");
    }
    else {
      alert("Form submission unsuccessful");
    }
  }
</script>

<style scoped>
.root {
  width: 400px;  
  margin: 0 auto;  
  background-color: #fff;
  padding: 30px;
  margin-top: 100px;  
  border-radius: 20px;
}
input {  
  border: none;  
  outline: none;  
  border-bottom: 1px solid #ddd;  
  font-size: 1em;  padding: 5px 0;  
  margin: 10px 0 5px 0;  
  width: 100%;
}
button {  
  background-color: #3498db;  
  padding: 10px 20px;  
  margin-top: 10px;  
  border: none;  
  color: white;
}
</style>