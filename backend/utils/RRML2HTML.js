const rrmlElementToHtmlElement = {
  body: "p",
  header: "h1",
  subheader: "h2",
  card: "div",
};

const rrmlElementToStyles = {
  card: "style='border: 1px solid black; padding: 20px; margin: 10px 0px; border-radius: 10px;'",
};

const RRML2HTML = (rrml) => {
  let htmlString = rrml;
  for (const [rrmlTag, htmlTag] of Object.entries(rrmlElementToHtmlElement)) {
    const style = rrmlElementToStyles[rrmlTag];
    const openTagRegex = new RegExp(`<${rrmlTag}>`, "g");
    const closeTagRegex = new RegExp(`</${rrmlTag}>`, "g");
    const openHtmlString = style ? `<${htmlTag} ${style}>` : `<${htmlTag}>`;
    htmlString = htmlString.replace(openTagRegex, openHtmlString);
    htmlString = htmlString.replace(closeTagRegex, `</${htmlTag}>`);
  }
  const linkRegex = /<link href="(.*?)">(.*?)<\/link>/g;
  htmlString = htmlString.replace(linkRegex, '<a href="$1">$2</a>');
  return htmlString;
};

/**
 * Parses an RRML string, converts complete sections to HTML,
 * and leaves incomplete sections unchanged. Returns an object
 * containing both complete and incomplete sections.
 *
 * @param {string} rrml - The incomplete RRML string.
 * @returns {object} - An object with `complete` and `incomplete` HTML strings.
 */
const incompleteRRML2HTML = (rrml) => {
  // Define the regex pattern for RRML tags, e.g., <body>,</body>
  const rrmlTagsRegex = /<\/?(body|header|subheader|card)>/g;

  let result;
  const stack = [];
  let completeHtml = "";
  let incompleteHtml = "";
  let lastIndex = 0;

  // Match tags to identify complete and incomplete sections
  while ((result = rrmlTagsRegex.exec(rrml)) !== null) {
    const tag = result[0];
    const tagType = result[1]; // body, header, subheader, or card

    if (tag.startsWith("</")) {
      // End tag
      if (stack.length > 0 && stack[stack.length - 1] === tagType) {
        stack.pop();

        if (stack.length === 0) {
          // We found a complete section
          // Convert the complete section to HTML
          const completeSection = rrml.substring(
            lastIndex,
            rrmlTagsRegex.lastIndex
          );
          completeHtml += RRML2HTML(completeSection);
          lastIndex = rrmlTagsRegex.lastIndex;
        }
      }
    } else {
      // Start tag
      stack.push(tagType);
    }
  }

  // Append any remaining RRML content
  incompleteHtml += rrml.substring(lastIndex);

  return {
    complete: completeHtml,
    incomplete: incompleteHtml,
  };
};

module.exports = {
  RRML2HTML,
  incompleteRRML2HTML,
};
