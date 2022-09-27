const cookieName = "ab-test-cookie";
const newHomepagePathName = "/test";

const abTest = async ({ request, next, env }) => {
  /*
  Todo: 
  1. Conditional statements to check for the cookie
  */
  const url = new URL(request.url);
  if (url.pathname === "/") {
    // if cookie ab-test-cookie=new then change the request to go to /test
    // if no cookie set, pass x% of traffic and set a cookie value to "current" or "new"

    let cookie = request.headers.get("cookie");
    // is cookie set?
    if (cookie && cookie.includes(`${cookieName}=new`)) {
      // Change the request to go to /test (as set in the newHomepagePathName variable)
      url.pathname = newHomepagePathName;
      return env.ASSETS.fetch(url);
    } else {
      /*
      2. Assign cookies based on percentage, then sever 
      */
      const percentage = Math.floor(Math.random() * 100);
      let version = "current"; // default version
      // change pathname and version name for 50% of traffic
      if (percentage < 50) {
        url.pathname = newHomepagePathName;
        version = "new";
      }
      // get the static file from ASSETS, and attach a cookie
      const asset = await env.ASSETS.fetch(url);
      let response = new Response(asset.body, asset);
      response.headers.append("Set-Cookie", `${cookieName}=${version}; path=/`);
      return response;
    }
  }

  return next();
};

export const onRequest = [abTest];
