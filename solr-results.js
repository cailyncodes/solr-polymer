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
      docs: String
    }
  }

  connectedCallback() {
    super.connectedCallback();

    window.t1 = this;
    window.t2 = Polymer.dom(this);
    if (this.children[0]) {
      this.shadowRoot.children.list.appendChild(this.children[0]);
    } else {
      this.shadowRoot.children.list.appendChild(this.shadowRoot.children[2].children[0]);
    }
  }

  _updateResults(results) {
    this.shadowRoot.children.list.items = results[this.docs];
  }

}

customElements.define(SolrResults.is, SolrResults);
