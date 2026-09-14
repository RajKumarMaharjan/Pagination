class Pagination {
  /**
   * @param {Object} options
   * @param {Array}  options.data           - full dataset
   * @param {Number} options.itemsPerPage   - items shown per page
   * @param {String} options.container      - CSS selector for the item list
   * @param {String} [options.paginationContainer="#pagination"] - CSS selector for pagination controls
   * @param {Function} options.renderItem   - (item) => htmlString
   * @param {Number} [options.maxVisiblePages=5] - caps how many page buttons show at once
   */
  constructor({
    data = [],
    itemsPerPage = 2,
    container,
    paginationContainer = "#pagination",
    renderItem,
    maxVisiblePages = 4,
  }) {
    this.data = Array.isArray(data) ? data : [];
    this.itemsPerPage = this.toPositiveInteger(itemsPerPage, 3);
    this.container = document.querySelector(container);
    this.pagination = document.querySelector(paginationContainer);
    this.renderItem = renderItem;
    this.maxVisiblePages = Math.max(
      this.toPositiveInteger(maxVisiblePages, 5),
      3,
    );

    if (!this.container) {
      throw new Error(`Pagination: container "${container}" not found.`);
    }
    if (!this.pagination) {
      throw new Error(
        `Pagination: paginationContainer "${paginationContainer}" not found.`,
      );
    }
    if (typeof this.renderItem !== "function") {
      throw new Error("Pagination: renderItem must be a function.");
    }

    this.currentPage = 1;

    this.bindEvents(); // bind once — this.pagination node persists across renders
    this.render();
  }

  get totalPage() {
    return Math.max(1, Math.ceil(this.data.length / this.itemsPerPage));
  }

  get currentItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.data.slice(start, end);
  }

  /** Swap in a new dataset (e.g. after search/filter) */
  setData(newData, resetPage = true) {
    this.data = Array.isArray(newData) ? newData : [];
    this.currentPage = resetPage
      ? 1
      : Math.min(this.currentPage, this.totalPage);
    this.render();
  }

  render() {
    this.renderItems();
    this.renderPagination();
  }

  renderItems() {
    this.container.innerHTML = "";

    if (this.currentItems.length === 0) {
      this.container.innerHTML = `<p class="pagination__empty">No results found.</p>`;
      return;
    }

    this.currentItems.forEach((item) => {
      this.container.insertAdjacentHTML("beforeend", this.renderItem(item));
    });
  }

  renderPagination() {
    if (this.data.length === 0) {
      this.pagination.innerHTML = "";
      return;
    }

    this.pagination.innerHTML = `
    <button class="pagination__button" data-page="prev" aria-label="Go to previous page" ${this.currentPage === 1 ? "disabled" : ""}>Previous</button>
    <div class="pagination__pages">${this.createPageButtons()}</div>
    <button class="pagination__button" data-page="next" aria-label="Go to next page" ${this.currentPage === this.totalPage ? "disabled" : ""}>Next</button>
    `;
  }

  /**
   * Builds a short page-number sequence so the bar never grows too long.
   * e.g. total=20, current=8, maxVisiblePages=5 -> 1 ... 7 8 9 ... 20
   */
  createPageButtons() {
    return this.buildButtons(this.getVisiblePages());
  }

  buildButtons(pages) {
    return pages
      .map((page) =>
        page === "..."
          ? `<span class="pagination__ellipsis" aria-hidden="true">&hellip;</span>`
          : `<button class="pagination__page ${page === this.currentPage ? "is-active" : ""}" data-page="${page}" aria-label="Go to page ${page}" aria-current="${page === this.currentPage ? "page" : "false"}">${page}</button>`,
      )
      .join("");
  }

  getVisiblePages() {
    const total = this.totalPage;
    const current = this.currentPage;
    const max = this.maxVisiblePages;

    if (total <= max) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const windowSize = max - 2;
    let start = Math.max(2, current - Math.floor(windowSize / 2));
    let end = Math.min(total - 1, start + windowSize - 1);

    if (end - start + 1 < windowSize) {
      start = end - windowSize + 1;
    }

    const pages = [1];
    if (start > 2) pages.push("...");
    for (let page = start; page <= end; page += 1) pages.push(page);
    if (end < total - 1) pages.push("...");
    pages.push(total);

    return pages;
  }

  bindEvents() {
    this.pagination.addEventListener("click", (event) => {
      const button = event.target.closest("[data-page]");

      if (!button) return;

      const page = button.dataset.page;

      if (page === "prev") {
        this.goToPage(this.currentPage - 1);
        return;
      }

      if (page === "next") {
        this.goToPage(this.currentPage + 1);
        return;
      }

      this.goToPage(Number(page));
    });
  }

  goToPage(page) {
    const nextPage = Number(page);

    if (
      !Number.isInteger(nextPage) ||
      nextPage < 1 ||
      nextPage > this.totalPage
    )
      return;
    if (nextPage === this.currentPage) return;

    this.currentPage = nextPage;

    this.render();
  }

  toPositiveInteger(value, fallback) {
    const integer = Number(value);
    return Number.isInteger(integer) && integer > 0 ? integer : fallback;
  }
}

// Make available for both <script> tags and module bundlers
if (typeof module !== "undefined" && module.exports) {
  module.exports = Pagination;
}
