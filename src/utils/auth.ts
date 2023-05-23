/** @format */

import { reactive } from 'vue';

interface Auth {
  isLoggedIn: boolean;
  [propName: string]: any;
}

function isLoggedIn(): boolean {
  return true;
}

const Auth: Auth = reactive({
  isLoggedIn: isLoggedIn(),
});

export default Auth;
