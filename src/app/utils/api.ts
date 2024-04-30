import { getMyCookie } from "./getCookie";
export async function sendTextToDjango(text: any) {
  const csrfToken = getMyCookie("csrftoken");
  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  // Conditionally add the X-CSRFToken header if the csrfToken is defined
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }
  const response = await fetch("http://localhost:8000/api/receive-data/", {
    method: "POST",
    headers: headers,
    body: new URLSearchParams({
      text: text,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.text();
}
function getCookie(arg0: string): string {
  throw new Error("Function not implemented.");
}
