"use strict";

/**
 * `mirador-viewer`
 * An encapsulation of the mirador viewer into a web component custom element.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SolrResults extends Polymer.Element {
  constructor() {
    super();
    return this;
  }

  static get is() { return "solr-results"; }

  static get properties() {
    return {
      results: Object,
      items: Array,
      prev: String,
      next: String
    }
  }

  static get observers() {
    return [
      '_updatePrevNext(results)'
    ]
  }

  connectedCallback() {
    super.connectedCallback();
    window.t1 = this;

    // after
    let afterTemplate;
    if (afterTemplate = this.querySelector("template[slot='after']")) {
      // user supplied
      this.__afterInstance = this._stampTemplate(afterTemplate);
      this.$.afterContainer.appendChild(this.__afterInstance);
    } else {
      // default
      this.__afterInstance = this._stampTemplate(this.shadowRoot.querySelector("slot[name='after']").children[0]);
      this.$.afterContainer.appendChild(this.__afterInstance);
    }

    // list template
    if (this.querySelector("template")) {
      this.$.list.appendChild(this.querySelector("template"));
    } else {
      this.$.list.appendChild(this.$.result);
    }
  }

  static _resultsIndex(index, results) {
    // return the 1-based index in the total results block
    return index + parseInt(results.response.start) + 1;
  }

  _updatePrevNext(results) {
    let numFound = parseInt(results.response.numFound);
    let rows = parseInt(results.responseHeader.params.rows);
    let start = parseInt(results.response.start);

    if (numFound > rows) {
      let prevStart = start - rows;
      let nextStart = start + rows;
      // bounds check the start and end
      prevStart < 0 ? prevStart = 0 : prevStart = prevStart;
      nextStart > (numFound - rows) ? nextStart = (numFound - rows) : nextStart = nextStart;
      let prevUrl = new URLSearchParams(window.location.hash.substring(2));
      let nextUrl = new URLSearchParams(window.location.hash.substring(2));
      prevUrl.set("start", `${prevStart}`);
      nextUrl.set("start", `${nextStart}`);
      this.prev = `#?${prevUrl.toString()}`;
      this.next = `#?${nextUrl.toString()}`;
    } else {
      this.prev = window.location.hash;
      this.next = window.location.hash;
    }
  }
}

customElements.define(SolrResults.is, SolrResults);
