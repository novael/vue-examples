<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card>
          <v-card-title>Select Demo</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form ref="form">
              <v-select
                label="NBA Teams *"
                v-model="team"
                :items="items"
                item-title="fullName"
                :no-data-text="isLoading ? 'Loading...' : 'No Data Found'"
                :menu-props="menuProps"
                :rules="[(v) => !!v || 'This field is required']"
                @update:menu="onMenuOpen"
                clearable
                return-object
              >
              </v-select>
            </v-form>
            <v-btn class="mb-4" @click="validate">Toggle Validation</v-btn>
            <v-divider></v-divider>
            <pre>{{ team }}</pre>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>Autocomplete Demo</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-autocomplete
              label="NBA Teams"
              variant="outlined"
              v-model="autocompleteTeam"
              v-model:search="search"
              :items="autoItems"
              :loading="isLoadingAuto"
              item-title="fullName"
              item-value="teamId"
              :menu-props="{ height: '300' }"
              hide-no-data
              clearable
              return-object
            ></v-autocomplete>
            <v-divider></v-divider>
            <pre>{{ autocompleteTeam }}</pre>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

/** Refs */
const team = ref(null)
const autocompleteTeam = ref(null)
const search = ref(null)
const items = ref([]);
const autoItems = ref([]);
const isLoading = ref(false)
const isLoadingAuto = ref(false)
const menuProps = { height: '300' }
const isValid = ref(true)
const form = ref()
const select = ref()

/** Lifecycle Methods */

/** Methods */
async function onMenuOpen(isOpen) {
  if(isOpen) isLoading.value = true;

  if(items.value.length > 0) {
    isLoading.value = false;
  }
  else {

    items.value = await getItems();
    isLoading.value = false;
  }
}

async function getItems() {
  const response = await axios.get("http://localhost:3000/teams");
  return response.data;
}

async function validate() {
  const resp = await form.value.validate();
  isValid.value = resp.valid;
}

/** Watchers */
watch(search, async (val) => {
  if(autoItems.value.length > 0) return;
  if(isLoadingAuto.value) return;

  autoItems.value = await getItems();
  isLoadingAuto.value = false;
})
</script>

<style scoped>
  .error-label {
    color: rgb(var(--v-theme-error));
  }
</style>
