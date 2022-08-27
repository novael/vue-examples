<template>
  <v-app>
    <v-main>
      <v-card class="mx-auto mt-10" max-width="500">
        <v-card-title class="text-h6 font-weight-regular justify-space-between">
          <span class="mr-4">{{ currentTitle }}</span>
          <v-avatar color="primary" size="24" v-text="step"></v-avatar>
        </v-card-title>
        <v-alert :type="validationType" v-if="!!validationMsg">
          {{ validationMsg }}
        </v-alert>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-form :ref="(f) => formRefs[0] = f">
                <v-text-field 
                  v-model="account.firstName"
                  label="First Name *"
                  density="compact"
                  variant="outlined"
                  :rules="[required]"
                ></v-text-field>
                <v-text-field 
                  v-model="account.lastName"
                  label="Last Name *"
                  density="compact"
                  variant="outlined"
                  :rules="[required]"
                ></v-text-field>
                <v-text-field 
                  v-model="account.email"
                  label="Email *"
                  density="compact"
                  variant="outlined"
                  :rules="[required, email]"
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <v-form :ref="(f) => formRefs[1] = f">
                <v-text-field 
                  v-model="account.password"
                  label="Password *" 
                  type="password"
                  density="compact"
                  variant="outlined"
                  :rules="[required]"
                ></v-text-field>
                <v-text-field 
                  v-model="account.confirmPassword"
                  label="Confirm Password *" 
                  type="password"
                  density="compact"
                  variant="outlined"
                  :rules="[required, passwordMatch(account.password)]"
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="3">
            <div class="pa-4 text-center">
              <v-img 
                class="mb-4" 
                contain 
                height="128" 
                src="https://cdn.vuetifyjs.com/images/logos/v.svg"
              ></v-img>
              <h3 class="text-h6 font-weight-light mb-2">
                Welcome to Vuetify
              </h3>
              <span class="text-caption grey--text">
                Thanks for signing up!
              </span>
            </div>
          </v-window-item>
        </v-window>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn v-if="step > 1" text @click="step--">
            Back
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            v-if="step < 3" 
            color="primary" 
            @click="validateStep"
          >Next</v-btn>
          <v-btn 
            v-if="step == 3" 
            color="success" 
            @click="validate"
          >Validate</v-btn>
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { required, passwordMatch, email } from './rules.js'

  /** Refs ***************************/
  const step = ref(1);
  const formRefs = ref([]); /* Pattern to hold a list of template refs */
  const account = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const validationType = ref("");
  const validationMsg = ref("");
  /** End Refs **********************/

  /** Computed refs ********************/
  const currentTitle = computed(() => {
    switch(step) {
      case 1: return 'Sign-up'
      case 2: return 'Create a password'
      default: return 'Account created'
    }
  });
  /** End Computed refs *****************/

  /** Lifecycle hooks */

  /** Methods ***************************/
  const validateStep = async () => {
    const formRef = formRefs.value[step.value - 1];
    const result = await formRef.validate();

    //increment step if valid
    result.valid && step.value++;
  }

  const validate = async () => {

    const results = [];

    /* This is how you iterate over an async iterable */
    for await (const formRef of formRefs.value) {
      const result = await formRef.validate();
      results.push(result)
    }

    const isValid = results.every(b => b);
    validationType.value = isValid ? 'success' : 'error';
    validationMsg.value = isValid ? "Form successfully completed" : "The form has errors"

    isValid && console.log(account.value)
  }
  /** End Methods **************************/

</script>

<style scoped>
  .v-input {
    margin-bottom: 12px;
  }
</style>
