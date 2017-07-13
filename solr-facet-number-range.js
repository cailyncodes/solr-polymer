"use strict";

/**
 * `mirador-viewer`
 * An encapsulation of the mirador viewer into a web component custom element.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SolrFacetNumberRange extends Polymer.Element {
  constructor() {
    super();
    return this;
  }

  static get is() { return "solr-facet-number-range"; }

  static get properties() {
    return {
      label: String,
      key: String,
      results: Object,
      facets: Object,
      step: Number,
      min: Number,
      max: Number,
      alwaysShowPin: Boolean,
      pin: Boolean
    }
  }

  static get observers() {
    return [
    ]
  }

  connectedCallback() {
    super.connectedCallback();

    this.dispatchEvent(new CustomEvent('facet-number-range-init', {
      bubbles: true,
      composed: true,
      detail: {
        key: this.key,
        start: this.$.range.valueMin,
        end: this.$.range.valueMax,
        step: this.step
      }
    }));

    this.addEventListener('updateValues', (e) => {
      e.preventDefault();
      let self = this.$.range;
      let hash = window.location.hash;
      let url = hash.substring(1);
      let queryString = new URLSearchParams(url);
      // NOTE: this currently works for single range faceting
      // queryString.set('facet.range.start', self.valueMin);
      // queryString.set('facet.range.end', self.valueMax);
      let filters = queryString.getAll('fq');
      queryString.delete('fq');
      console.log(queryString.toString());
      for (let filter of filters) {
        console.log(filter);
        console.log(decodeURIComponent(filter));
        // NOTE: this assumes that one does not facet list and facet range on the same key!
        if (!filter.startsWith(`${this.key}`)) {
          queryString.append('fq', decodeURIComponent(filter));
        }
      }
      queryString.append('fq',`${this.key}:[${self.valueMin} TO ${self.valueMax}]`);
      console.log(queryString.toString());
      this.dispatchEvent(new CustomEvent('facet-number-range-update', {
        bubbles: true,
        composed: true,
        detail: {
          url: `?${queryString.toString()}`
        }
      }));
      return false;
    });
    this.$.range._prevUpdateValues = [this.min, this.max];
  }
}

customElements.define(SolrFacetNumberRange.is, SolrFacetNumberRange);
