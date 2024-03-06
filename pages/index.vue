<script setup lang="ts">
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const answerText = ref("");
const loading = ref(false);
const image = ref("");
const prompt = ref("");

const client = generateClient<Schema>();
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
          <span>1. Enter Prompt</span>
          <label for="prompt" class="hidden">Prompt:</label>

          <input
            v-model="prompt"
            type="text"
            id="prompt"
            placeholder="Enter Prompt Here"
            class="w-96 rounded bg-gray-200 p-2"
          />
        </div>
        <div class="flex flex-col items-center gap-2">
          <span>2. Upload File</span>
          <label
            class="mb-2 hidden text-sm font-medium text-gray-900"
            for="file_input"
            >Upload file</label
          >
          <input
            class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none disabled:bg-gray-200"
            id="file_input"
            :disabled="loading"
            type="file"
            @change="onFileChange($event)"
          />
          <img v-if="image" :src="image" alt="" class="object-fit max-w-32" />
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
