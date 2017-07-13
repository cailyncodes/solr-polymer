"use strict";

/**
 * `mirador-viewer`
 * An encapsulation of the mirador viewer into a web component custom element.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SolrFacetList extends Polymer.Element {
  constructor() {
    super();
    return this;
  }

  static get is() { return "solr-facet-list"; }

  static get properties() {
    return {
      label: String,
      key: String,
      results: Object,
      facets: Object
    }
  }

  static get observers() {
    return [
    ]
  }

  connectedCallback() {
    super.connectedCallback();

    this.dispatchEvent(new CustomEvent('facet-list-init', {
      bubbles: true,
      composed: true,
      detail: {
        key: this.key
      }
    }));
  }

  facetAssociativeMap(results) {
    let facets = results && results.facet_counts;
    let facetResults = facets && facets.facet_fields && facets.facet_fields[this.key] || [];
    let facetFieldsArray = [];
    for (let i = 0; i < facetResults.length; i+=2) {
      facetFieldsArray.push({
        field: facetResults[i],
        count: facetResults[i+1]
      });
    }
    return facetFieldsArray;
  }

  facetLink(facet) {
    let hash = window.location.hash;
    let url = hash.substring(1);
    let queryString = new URLSearchParams(url);
    if (queryString.getAll('fq').indexOf(`${this.key}:\"${facet.field}\"`) == -1) {
      queryString.append('fq', `${this.key}:\"${facet.field}\"`);
    }
    return `#?${queryString.toString()}`;
  }

  removeFacetFilterLink() {
    let hash = window.location.hash;
    let url = hash.substring(1);
    let queryString = new URLSearchParams(url);
    let values = queryString.getAll('fq');
    queryString.delete('fq');
    for (let value of values) {
      if (!value.startsWith(this.key)) {
        queryString.append('fq', decodeURIComponent(value));
      }
    }
    return `#?${queryString.toString()}`;
  }
}

customElements.define(SolrFacetList.is, SolrFacetList);
