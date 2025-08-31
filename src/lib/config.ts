import { env } from "$env/dynamic/private";

export const config = {

  BASE_PATH: env.API_BASE_PATH ?? 'NOT_DEFINED'

}