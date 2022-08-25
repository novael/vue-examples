<template>
  <v-app>
    <v-main>
      <v-card class="mx-auto" max-width="500">
        <v-card-title class="text-h6 font-weight-regular justify-space-between">
          <span class="mr-4">{{ currentTitle }}</span>
          <v-avatar color="primary" size="24" v-text="step"></v-avatar>
          <v-sheet v-if="!form1Valid || !form2Valid" color="red" class="pl-2">Form has validation errors</v-sheet>
        </v-card-title>

        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-form 
                ref="form1" 
                :model-value="form1Valid"
              >
                <v-text-field 
                  label="Email *"
                  :rules="[rules.required, rules.email]"
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <v-form 
                ref="form2" 
                :model-value="form2Valid"
              >
                <v-text-field 
                  label="Password" 
                  type="password"
                ></v-text-field>
                <v-text-field 
                  label="Confirm Password" 
                  type="password"
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
          <v-btn v-if="step < 3" color="primary" depressed @click="step++">
            Next
          </v-btn>
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

  const step = ref(1);
  const currentTitle = computed(() => {
    switch(step) {
      case 1: return 'Sign-up'
      case 2: return 'Create a password'
      default: return 'Account created'
    }
  });

  const form1 = ref(null)
  const form2 = ref(null)
  const form1Valid = ref(true)
  const form2Valid = ref(true)

  /* Move to separate file */
  const rules = ref({
    required: v => !!v || 'This field is required',
    email: v => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          
      return pattern.test(v) || 'Invalid e-mail.'
    }
  })

  const validate = async () => {
    const form1ValidationResult = await form1.value.validate();
    const form2ValidationResult = await form2.value.validate();

    form1Valid.value = form1ValidationResult.valid;
    form2Valid.value = form2ValidationResult.valid;
  }

</script>
