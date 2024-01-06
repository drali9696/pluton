import { Readability } from "@mozilla/readability";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import { cleanSourceText } from "../utils/sources.js";

const searchHandler = async (req, res) => {
  try {
    const { query, model } = req.body;

    const sourceCount = 4;

    // GET LINKS
    const response = await fetch(`https://www.google.com/search?q=${query}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    const linkTags = $("a");

    let links = [];

    linkTags.each((i, link) => {
      const href = $(link).attr("href");

      if (href && href.startsWith("/url?q=")) {
        const cleanedHref = href.replace("/url?q=", "").split("&")[0];

        if (!links.includes(cleanedHref)) {
          links.push(cleanedHref);
        }
      }
    });

    const filteredLinks = links.filter((link, idx) => {
      let domain = "";
      try {
        domain = new URL(link).hostname;
      } catch (err) {
        return false;
      }

      const excludeList = [
        "google",
        "facebook",
        "twitter",
        "instagram",
        "youtube",
        "tiktok",
      ];
      if (excludeList.some((site) => domain.includes(site))) return false;

      return (
        links.findIndex((link) => {
          try {
            return new URL(link).hostname === domain;
          } catch (err) {
            return false;
          }
        }) === idx
      );
    });

    const finalLinks = filteredLinks.slice(0, sourceCount);

    // SCRAPE TEXT FROM LINKS
    const sources = await Promise.all(
      finalLinks.map(async (link) => {
        const response = await fetch(link);
        const html = await response.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const parsed = new Readability(doc).parse();

        if (parsed) {
          let sourceText = cleanSourceText(parsed.textContent);

          return { url: link, text: sourceText };
        }
      })
    );

    let filteredSources = sources.filter((source) => source !== undefined);

    for (const source of filteredSources) {
      source.text = source.text.slice(0, 1500);
    }

    res.status(200).json({ sources: filteredSources });
  } catch (err) {
    res.status(500).json({ sources: [] });
  }
};

export default searchHandler;
