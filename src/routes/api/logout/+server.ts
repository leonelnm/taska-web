import { Constants } from "$lib/constants";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies }) => {

  cookies.delete(Constants.COOKIE_SESSION_NAME, { path: '/' });
  cookies.delete(Constants.COOKIEA_REFRESH_TOKEN, { path: '/' });

  return json({ success: true });
};