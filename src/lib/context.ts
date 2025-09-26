import { getContext, setContext } from 'svelte';

const key = "userIsAdmin";

export function setUserIsAdmin(isAdmin: boolean | undefined) {
  setContext(key, isAdmin ?? false);
}

export function getUserIsAdmin() {
  return getContext(key) as boolean;
}

export function setUserIsEncargado(isEncargado: boolean | undefined) {
  setContext("userIsEncargado", isEncargado ?? false);
}

export function getUserIsEncargado() {
  return getContext("userIsEncargado") as boolean;
}