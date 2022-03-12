import { win } from "../global";

export function determineOSAndBrowser(uaStr) {
  if (uaStr.indexOf("Chrome") > -1) {
    win.browser = "Chrome";
  } else if (uaStr.indexOf("Firefox") > -1) {
    win.browser = "Firefox";
  } else if (uaStr.indexOf("MSIE") > -1 || uaStr.indexOf("rv:") > 1) {
    win.browser = "IE";
  } else if (uaStr.indexOf("Safari") > -1) {
    win.browser = "Safari";
  } else if (uaStr.indexOf("OP") > -1) {
    win.browser = "Opera";
  }
  if (uaStr.indexOf("Win") != -1) win.os = "Windows";
  else if (uaStr.indexOf("Mac") != -1) win.os = "Mac";
  else if (uaStr.indexOf("Linux") != -1) win.os = "Linux";
  else if (uaStr.indexOf("Android") != -1) win.os = "Android";
  else if (uaStr.indexOf("like Mac") != -1) win.os = "iOS";
  else if (uaStr.indexOf("iP") != -1) win.os = "iOS";

  win.appleProduct = win.os === "Mac" || win.os === "iOS";
}
