const fs = require("fs");

const testUrls = [
  "https://www.youtube.com/watch?v=TQY7-Hfw9Nw&list=PLwLSw1_eDZl0ZiaSDAvwTj-UdetIHI6xm",
  "https://www.youtube.com/watch?v=SfGfH2IkG_U&list=PLwLSw1_eDZl0_pFZjGAyXj8oQkUF566Lq",
  "https://www.youtube.com/watch?v=YDqXKL8SkCI&list=PLwLSw1_eDZl2dEwttp8R56-7BaiquzmWM",
  "https://www.youtube.com/watch?v=k-dz99b8qNo&list=PLwLSw1_eDZl3hnDBJquengxjETgIxDai-",
  "https://www.youtube.com/watch?v=vfX2qO_H2Xw&list=PLwLSw1_eDZl3a6WBPlpPJlaNKNGwHGA08"
];

async function run() {
  for (const u of testUrls) {
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(u)}&format=json`);
      if (res.ok) {
        const json = await res.json();
        console.log("URL:", u, "=> TITLE:", json.title, "THUMB:", json.thumbnail_url);
      } else {
        console.log("Failed:", u, res.status);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

run();
