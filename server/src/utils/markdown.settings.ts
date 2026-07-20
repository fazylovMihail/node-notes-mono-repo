import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

export const MARKDOWN_CLEAN_OPTIONS = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "strong", "p"],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    strong: ["class"],
    p: ["class"],
  },
  allowedClasses: {
    strong: [
      "markdown__h1",
      "markdown__h2",
      "markdown__h3",
      "markdown__h4",
      "markdown__h5",
      "markdown__h6",
    ],
    p: ["markdown__p"],
  },
};

export const md = new MarkdownIt({ breaks: true });

// Headings
md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx];

  const originalTag = token.tag;

  token.tag = "strong";

  token.attrSet("class", `markdown__${originalTag}`);

  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.heading_close = (tokens, idx, options, env, self) => {
  tokens[idx].tag = "strong";
  return self.renderToken(tokens, idx, options);
};

// Paragrafs
md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet("class", "markdown__p");
  return self.renderToken(tokens, idx, options);
};
