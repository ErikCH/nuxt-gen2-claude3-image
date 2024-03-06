import { Amplify } from "aws-amplify";
import {
  fetchAuthSession,
  fetchUserAttributes,
  signIn,
  signOut,
} from "aws-amplify/auth";
import { list } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/api";
import config from "../amplifyconfiguration.json";

const client = generateClient();

export default defineNuxtPlugin({
  name: "AmplifyAPIs",
  enforce: "pre",

  setup() {
    // This configures Amplify on the client side of your Nuxt app
    Amplify.configure(config, { ssr: true });

    return {
      provide: {
        // You can add the Amplify APIs that you will use on the client side
        // of your Nuxt app here.
        //
        // You can call the API by via the composable `useNuxtApp()`. For example:
        // `useNuxtApp().$Amplify.Auth.fetchAuthSession()`
        Amplify: {
          Auth: {
            fetchAuthSession,
            fetchUserAttributes,
            signIn,
            signOut,
          },
          Storage: {
            list,
          },
          GraphQL: {
            client,
          },
        },
      },
    };
  },
});
