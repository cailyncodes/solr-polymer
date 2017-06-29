"use strict";

/**
 * `mirador-viewer`
 * An encapsulation of the mirador viewer into a web component custom element.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SolrSearchfield extends Polymer.Element {
  constructor() {
    super();
    return this;
  }

  static get is() { return "solr-searchfield"; }

  static get properties() {
    return {
      searchQuery: String,
      rows: Number,
      showAdvanced : {
        type: Boolean,
        default: false
      },
      advanced : {
        type: Boolean,
        default: false
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();

    // attach submit handlers
    this.attachSubmitBtnHandler();
    this.attachSubmitEnterHandler();
    this.attachSubmitFormHandler();

    // attach other handlers
    this.attachToggleAdvancedHandler();
  }

  attachSubmitBtnHandler() {
    let submitBtn = this.$['searchSubmit'];

    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let form = this.$['searchForm'];
      form.dispatchEvent(new CustomEvent('iron-form-presubmit'));
      return false;
    });
  }

  attachSubmitEnterHandler() {
    this.addEventListener('keypress', (e) => {
      if (e.key == "Enter") {
        e.preventDefault();
        let form = this.$['searchForm'];
        form.dispatchEvent(new CustomEvent('iron-form-presubmit'));
        return false;
      }
    });
  }

  attachSubmitFormHandler() {
    let searchForm = this.$['searchForm'];

    searchForm.addEventListener('iron-form-presubmit', (e) => {
      e.preventDefault();
      if (!this.searchQuery) {
        return false;
      } else {
        let searchOptions = {};
        searchOptions.q = this.searchQuery || '';
        searchOptions.wt = "json";
        searchOptions.rows = this.rows || 10;
        let locationChangeEvent = new CustomEvent('search-submit', { bubbles: true, composed: true, detail: searchOptions });
        this.dispatchEvent(locationChangeEvent);
        return false;
      }
    });
  }

  _displayAdvanced(advanced, showAdvanced) {
    return advanced && showAdvanced;
  }

  attachToggleAdvancedHandler() {
    let advancedBtn = this.$['advancedToggle'];

    advancedBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.showAdvanced = !this.showAdvanced;
      return false;
    });
  }

//   jsonp(that.solrUrl, {params: that.buildSearchParams(), cache:true})
//   .success(function(data) {
//     that.facet_fields = data.facet_counts.facet_fields;
//     $scope.docs = data.response.docs;
//     $scope.numFound = data.response.numFound;
//     that.selected_facets = that.getSelectedFacets();
//     that.selected_facets_obj = that.getSelectedFacetsObjects();
//   });
// };
//
// $scope.search = that.search;
//
// this.setFacetGroup = function(newGroup){
//   $scope.facet_group = newGroup;
// };
//
// this.getSelectedFacetsObjects = function(){
//   var retValue = [];
//   this.selected_facets.forEach( function(value, key){
//     split_val = value.split(":");
//     retValue.push({
//       field: split_val[0],
//       value: split_val[1].replace(/"/g, "")
//
//     });
//   });
//   return retValue;
// };
//
// this.getSelectedFacets = function(){
//   selected = $location.search().selected_facets;
//   selectedFacets =[];
//   if (angular.isArray(selected)) {
//     selectedFacets = selected;
//   } else {
//     if (selected){
//       selectedFacets.push(selected);
//     }
//   }
//   return selectedFacets;
//
// };
}

customElements.define(SolrSearchfield.is, SolrSearchfield);
