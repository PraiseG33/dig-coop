import { ref, watch } from 'vue';

const STORAGE_KEY = 'cooperativeMembers';

const members = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

watch(members, val => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
}, { deep: true });

export function useMembers() {
  return { members };
}
