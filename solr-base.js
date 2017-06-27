"use strict";

/**
 * `mirador-viewer`
 * An encapsulation of the mirador viewer into a web component custom element.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SolrBase extends Polymer.Element {
  constructor() {
    super();
    return this;
  }

  static get is() { return "solr-base"; }

  static get JSONP_NOT_ENABLED() { return "JSONP_NOT_ENABLED_" + Math.ceil(Math.random() * 1000000).toString(); }

  static get properties() {
    return {
      solrUrl: String,
      jsonp: {
        type: String,
        default: SolrBase.JSONP_NOT_ENABLED
      },
      results: {
        type: Object,
        observer: 'resultsHandler'
      },
      route: Object
    }
  }

  static get observers() {
    return [
      '_routeChanged(route.*)'
    ]
  }

  _routeChanged(changeRecord) {
    console.log("hello");
    this.children[0].searchQuery = this.route.path.substring(3);
    this.search();
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('search-submit', this.searchSubmitHandler);
    // this.addEventListener('results-changed', this.resultsHandler)

    // window.t = Polymer.dom(this);
    // Polymer.dom(this).node.children[1].shadowRoot.children[1].appendChild(Polymer.dom(this).node.children[1].children[1]);
    // Polymer.dom(this).node.children[1].shadowRoot.children[1].items = this.results.docs;
    if (this.route.path) {
      this.children[0].searchQuery = this.route.path.substring(3);
      this.search();
    }
  }

  searchSubmitHandler(e) {
    e.preventDefault();

    // trigger location change
    let url = this.constructSearchURL(e.detail);
    this.set('route.path', url);

    // trigger search
    this.search();

    return false;
  }

  constructSearchURL(query) {
    let url = "?q=";
    console.log(query);
    url += encodeURI(query);
    return url;
  }

  search() {
    // dispatch ajax request to solr
    console.log("route");
    console.log(this.route);

    let url = this.solrUrl + this.route.path;
    console.log(url);

    // if (this.jsonp == SolrBase.JSONP_NOT_ENABLED) {
    //   console.log("not jsonp");
    //   // let req = new Request(url);
    //   // let headers = new Headers();
    //   // headers.append('Content-Type', 'application/json');
    //   // let init = {
    //   //   method: 'GET',
    //   //   headers: headers,
    //   //   mode: 'cors',
    //   //   cache: 'default'
    //   // };
    // } else {
      fetchJsonp(url, {
        jsonpCallbackFunction: this.jsonp
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.results = data.response;
        return true;
      })
      .catch((err) => {
        console.log(err);
        alert("There was an error fetching your search results. Please try again.");
      });
    // }
  }

  resultsHandler(e) {
    this.children[1]._updateResults(this.results);
  }
}

customElements.define(SolrBase.is, SolrBase);
