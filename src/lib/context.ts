import { getContext, setContext } from 'svelte';

const key = "userIsAdmin";

export function setUserIsAdmin(isAdmin: boolean | undefined) {
  setContext(key, isAdmin ?? false);
}

export function getUserIsAdmin() {
  return getContext(key) as boolean;
}