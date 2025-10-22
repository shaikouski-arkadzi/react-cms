export const serializeDOMToString = (dom) => {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(dom);
};

export const makePathsAbsolute = (html, baseUrl = "http://localhost:3000/") => {
  const doc = parseStringToDom(html);

  doc.querySelectorAll("*").forEach((el) => {
    for (let attr of el.attributes) {
      const name = attr.name;
      const value = attr.value;

      if (
        (["src", "href", "action"].includes(name) || name.endsWith("src")) &&
        value
      ) {
        if (!/^(https?:)?\/\//.test(value)) {
          const newValue =
            baseUrl.replace(/\/$/, "") + "/" + value.replace(/^\/+/, "");
          el.setAttribute(name, newValue);
        }
      }
    }
  });

  return doc.documentElement.outerHTML;
};

export const wrapTextNode = (dom) => {
  const body = dom.body;
  let textNodes = [];

  // Рекурсивно находим текстовые узлы и игнорируем пусты ноды
  function recursy(element) {
    element.childNodes.forEach((node) => {
      if (
        node.nodeName === "#text" &&
        node.nodeValue.replace(/\s+/g, "").length > 0
      ) {
        textNodes.push(node);
      } else {
        recursy(node);
      }
    });
  }

  recursy(body);

  textNodes.forEach((node, i) => {
    // Создаем обертку вокруг ноды для редактирования текста
    // Обертка будет только в админке
    const wrapper = dom.createElement("text-editor");
    node.parentNode.replaceChild(wrapper, node);
    wrapper.appendChild(node);
    wrapper.setAttribute("nodeid", i);
  });

  return dom;
};

export const unwrapTextNodes = (dom) => {
  dom.body.querySelectorAll("text-editor").forEach((element) => {
    element.parentNode.replaceChild(element.firstChild, element);
  });
};

export const parseStringToDom = (string) => {
  const parser = new DOMParser();
  return parser.parseFromString(string, "text/html");
};

export const getTitleTag = (dom) => {
  const head = dom.head;
  let title = dom.head.querySelector("title");
  if (!title) {
    title = head.appendChild(dom.createElement("title"));
  }
  return title;
};

export const getKeywordsTag = (dom) => {
  const head = dom.head;
  let keywords = head.querySelector('meta[name="keywords"]');
  if (!keywords) {
    keywords = head.appendChild(dom.createElement("meta"));
    keywords.setAttribute("name", "keywords");
  }
  return keywords;
};

export const getDescriptionTag = (dom) => {
  const head = dom.head;
  let description = head.querySelector('meta[name="description"]');
  if (!description) {
    description = head.appendChild(dom.createElement("meta"));
    description.setAttribute("name", "description");
  }
  return description;
};
