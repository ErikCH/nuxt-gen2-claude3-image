<script setup lang="ts">
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const answerText = ref("");
const loading = ref(false);
const image = ref("");
const prompt = ref("");

const client = generateClient<Schema>();

// Handle File Upload
function onFileChange(e: Event) {
  let target = e.target as HTMLInputElement;
  let files = target.files || [];
  if (!files.length || loading.value === true) return;
  loading.value = true;
  const reader = new FileReader();
  reader.onloadend = async function () {
    const base64Image = reader.result as string;
    image.value = base64Image;
    loading.value = false;
  };
  reader.readAsDataURL(files[0]);
}

// Handle Submit
async function onSubmit() {
  if (!image.value || !prompt.value) return;
  loading.value = true;
  answerText.value = "";
  const result = await client.queries.imageBedrock({
    base64Image: image.value,
    prompt: prompt.value,
  });

  answerText.value = result.data?.content ?? "";
  loading.value = false;
}
</script>
<template>
  <main class="m-auto flex w-2/5 flex-col items-center gap-4">
    <h1 class="text-4xl font-extrabold">
      Claude <span class="text-blue-300">V3</span> Demo
    </h1>
    <section
      class="flex w-full flex-col items-center rounded-sm border border-green-400"
      :class="{ 'bg-gray-100 opacity-25': loading }"
    >
      <form
        class="flex flex-col justify-center gap-4"
        @submit.prevent="onSubmit"
      >
        <div class="flex flex-col items-center gap-2">
          <span class="font-extrabold">Enter Prompt</span>
          <label for="prompt" class="hidden">Prompt:</label>

          <div class="relative">
            <div
              class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
            >
              <svg
                class="h-4 w-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              v-model="prompt"
              type="text"
              id="prompt"
              placeholder="Enter Prompt Here"
              class="w-96 rounded bg-gray-50 p-2 ps-10"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="m-auto font-extrabold">Upload File</span>
          <label
            class="mb-2 hidden text-sm font-medium text-gray-900"
            for="file_input"
            >Upload file</label
          >
          <div class="flex gap-4">
            <input
              class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-red-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-red-700 hover:file:bg-red-100"
              id="file_input"
              :disabled="loading"
              type="file"
              @change="onFileChange($event)"
            />
            <img
              v-if="image"
              :src="image"
              alt=""
              class="object-fit max-h-16 max-w-16"
            />
          </div>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="m-auto w-24 rounded-md bg-green-400 p-2 text-white disabled:bg-gray-200"
        >
          GO!
        </button>
      </form>
    </section>

    <LoadingSpinner v-if="loading" />
    <section
      v-if="answerText"
      class="flex flex-col items-center gap-6 rounded bg-gray-200"
    >
      <div class="whitespace-pre-wrap">{{ answerText }}</div>
    </section>
  </main>
</template>
