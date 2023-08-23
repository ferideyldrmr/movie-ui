<template>
  <div class="card w-100">
    <div class="card-title px-3 pt-3 d-flex justify-content-between">
      <h5>TV Shows</h5>

      <div class="d-flex flex-row">
        <div class="d-flex flex-row">
          <select
            class="form-control form-control-sm mr-2"
            v-model="sortOrder"
            @change="sortData"
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
          <select
            class="form-control form-control-sm mr-2"
            v-model="categoryType"
            @change="sortData"
          >
            <option value="-1">Tümü</option>
            <option
              v-for="showType in showTypes"
              :value="showType.id"
              :key="`mt-${showType.id}`"
            >
              {{ showType.name }}
            </option>
          </select>
        </div>
        <div class="d-flex flex-row">
          <button
            type="button"
            class="btn btn-warning mr-2"
            @click="exportShows"
          >
            Export TV Show to CSV
          </button>
          <button type="button" class="btn btn-success" @click="addNewShow">
            Add New TV Show
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div
          class="col-lg-2 col-md-4 col-sm-6 col-12 mb-3"
          v-for="show in shows"
          :key="show.id"
        >
          <div class="card h-100 w-100">
            <div class="img-wrapper" @click="openImageModal(show)">
              <img
                :src="show.coverImage"
                class="card-img-top"
                alt="Card image"
              />
            </div>
            <div class="card-body">
              <h5 class="card-title text-truncate" :title="show.title">
                {{ show.title }}
              </h5>
              <p class="card-text text-truncate">{{ show.desc }}</p>
              <div class="button-wrapper">
                <router-link
                  :to="{ name: 'EditShow', params: { id: show.id } }"
                  class="btn btn-custom edit-button"
                  >Edit</router-link
                >
                <button
                  type="button"
                  class="btn btn-custom delete-button"
                  @click="openDeleteModal(show)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- If the movie type is not found -->
        <div v-if="shows.length === 0">
          <p>Aradığınız türde TV şovu bulunamamıştır.</p>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="selectedShow && modalType === 'delete'"
        class="modal fade show"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
        style="display: block"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                {{ selectedShow.title }}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="closeModal"
              ></button>
            </div>
            <div class="modal-body">Are you sure?</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="deleteSelectedShow"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Movie Details Modal -->
      <div
        v-if="selectedShow && modalType === 'view'"
        class="modal fade show modal-lg"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
        style="display: block"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="ShowModalLabel">
                {{ selectedShow.title }}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="closeModal"
              ></button>
            </div>
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-4">
                    <img
                      :src="selectedShow.coverImage"
                      class="card-img-top"
                      alt="Cover Image"
                      style="max-height: 400px; object-fit: contain"
                    />
                  </div>
                  <div class="col-8">
                    <h5>{{ selectedShow.title }}</h5>
                    <p>{{ selectedShow.desc }}</p>
                    <ul type="square">
                      <li>
                        <p>Year: {{ selectedShow.year }}</p>
                      </li>
                      <li>
                        <p>TV Show Type: {{ selectedShow.category.name }}</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <h5 class="my-3">Actors</h5>
                <div class="row">
                  <div class="col" v-if="selectedShow.actors.length === 0">
                    Bu TV şovu için bir aktör bulunamadı
                  </div>
                  <div
                    v-else
                    class="col col-md-4"
                    v-for="actor in selectedShow.actors"
                    :key="actor.id"
                  >
                    <div class="card h-100 w-100">
                      <div class="img-wrapper">
                        <img
                          :src="actor.actorImage"
                          class="card-img-top"
                          alt="Card image"
                        />
                      </div>
                      <div class="card-body">
                        <h5
                          class="card-title text-truncate"
                          :title="`${actor.name} ${actor.surname}`"
                        >
                          {{ actor.name }} {{ actor.surname }}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Eklediğiniz diğer bilgileri buraya ekleyebilirsiniz -->
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckDefault"
          v-model="finishedFilter"
          @change="toggleIsShowOverFilter"
        />
        <label class="form-check-label" for="flexCheckDefault">
          Ending shows
        </label>
      </div>
    </div>
    <div class="card-footer">
      <nav
        aria-label="Page navigation example"
        class="d-flex justify-content-end"
      >
        <ul class="pagination">
          <li class="page-item">
            <a
              class="page-link"
              href="#"
              aria-label="Previous"
              @click="previousPage"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item" v-for="n in totalPages" :key="`page-${n}`">
            <a class="page-link" href="#" @click="changePage(n)">{{ n }}</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Next" @click="nextPage">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ShowView",
  data() {
    return {
      shows: [],
      currentPage: 1,
      pageSize: 6,
      totalCount: 0,
      totalPages: 0,
      selectedShow: null,
      modalType: null,
      sortOrder: "asc",
      categoryType: -1,
      showTypes: [],
      finishedFilter: false,
    };
  },
  beforeDestroy() {
    this.$root.$off("search", this.search);
  },
  mounted() {
    this.$root.$on("search", this.search);
    this.fetchShows();
    this.getShowType();
  },
  computed: {},
  methods: {
    search(searcKeyword) {
      axios
        .get("https://localhost:7092/api/shows", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            searcKeyword,
          },
        })
        .then((response) => {
          this.shows = response.data.shows;
          this.totalCount = response.data.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addNewShow() {
      this.$router.push({ name: "EditShow" });
    },
    openDeleteModal(show) {
      this.selectedShow = show;
      this.modalType = "delete";
    },
    deleteSelectedShow() {
      if (!this.selectedShow) return;

      axios
        .delete(`https://localhost:7092/api/shows/${this.selectedShow.id}`)
        .then(() => {
          // Update the movies list after deletion
          this.shows = this.shows.filter((x) => x.id !== this.selectedShow.id);

          this.closeModal();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    closeModal() {
      this.selectedShow = null;
    },
    fetchShows() {
      axios
        .get("https://localhost:7092/api/shows", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            sortOrder: this.sortOrder,
            categoryType: this.categoryType,
            finishedFilter: this.finishedFilter,
          },
        })
        .then((response) => {
          this.shows = response.data.shows;
          this.totalCount = response.data.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    toggleIsShowOverFilter() {
      this.isShowOverFilter = !this.isShowOverFilter;
      this.fetchShows(); // Yeniden verileri çekmek için
    },
    openImageModal(show) {
      console.log(show);
      this.selectedShow = show;
      this.modalType = "view";
    },
    closeShowModal() {
      this.selectedShow = null;
      this.modalType = null;
    },
    changePage(page) {
      if (page === this.currentPage) return;
      this.currentPage = page;
      this.fetchShows();
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchShows();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchShows();
      }
    },
    sortData() {
      this.currentPage = 1;
      this.fetchShows();
    },

    async getShowType() {
      await axios
        .get("https://localhost:7092/api/categories")
        .then((response) => {
          this.showTypes = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    exportShows() {
      const link = document.createElement("a");
      link.href = "https://localhost:7092/api/shows/export";
      link.download = "shows.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>
<style scoped>
/* Bootstrap style definitions */
.card {
  width: 18rem;
}

.img-wrapper {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-img-top {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.button-wrapper {
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
}

.button-wrapper a {
  margin-right: 20px;
}

.edit-button {
  background-color: green;
  color: white;
}

.delete-button {
  background-color: red;
  color: white;
}

.button-container button {
  margin-bottom: 10px;
  margin-right: 10px;
  color: white;
}

.mr-2 {
  margin-right: 10px;
}
</style>
