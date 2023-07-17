<template>
  <div class="card w-100">
    <div class="card-title px-3 pt-3 d-flex justify-content-between">
      <h5>Movies</h5>
      <div class="col-1" style="text-align: right">
        <select
          class="form-select form-select-sm ms-2"
          v-model="sortOrder"
          @change="sortData"
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>
      <button type="button" class="btn btn-success" @click="addNewMovie">
        Add New Movie
      </button>
    </div>
    <div class="card-body">
      <div class="row">
        <div
          class="col-lg-2 col-md-4 col-sm-6 col-12 mb-3"
          v-for="movie in movies"
          :key="movie.id"
        >
          <div class="card h-100 w-100">
            <div class="img-wrapper" @click="openImageModal(movie)">
              <img
                :src="movie.coverImage"
                class="card-img-top"
                alt="Card image"
              />
            </div>
            <div class="card-body">
              <h5 class="card-title text-truncate" :title="movie.title">
                {{ movie.title }}
              </h5>
              <p class="card-text text-truncate">{{ movie.desc }}</p>
              <div class="button-wrapper">
                <router-link
                  :to="{ name: 'Edit', params: { id: movie.id } }"
                  class="btn btn-custom edit-button"
                  >Edit</router-link
                >
                <button
                  type="button"
                  class="btn btn-custom delete-button"
                  @click="openDeleteModal(movie)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="selectedMovie && modalType === 'delete'"
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
                {{ selectedMovie.title }}
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
                @click="deleteSelectedMovie"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Movie Details Modal -->
      <div
        v-if="selectedMovie && modalType === 'view'"
        class="modal fade show modal-lg"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
        style="display: block"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="MovieModalLabel">
                {{ selectedMovie.title }}
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
                      :src="selectedMovie.coverImage"
                      class="card-img-top"
                      alt="Cover Image"
                      style="max-height: 400px; object-fit: contain"
                    />
                  </div>
                  <div class="col-8">
                    <h5>{{ selectedMovie.title }}</h5>
                    <p>{{ selectedMovie.desc }}</p>
                  </div>
                </div>
                <h5 class="my-3">Actors</h5>
                <div class="row">
                  <div class="col" v-if="selectedMovie.actors.length === 0">
                    Bu film için bir aktör bulunamadı
                  </div>
                  <div
                    v-else
                    class="col col-md-4"
                    v-for="actor in selectedMovie.actors"
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
  name: "MovieView",
  data() {
    return {
      movies: [],
      currentPage: 1,
      pageSize: 6,
      totalCount: 0,
      totalPages: 0,
      selectedMovie: null,
      modalType: null,
      sortOrder:'asc'
    };
  },
  beforeDestroy() {
    this.$root.$off("search", this.search);
  },
  mounted() {
    this.$root.$on("search", this.search);
    this.fetchMovies();
  },
  computed: {},
  methods: {
    search(searcKeyword) {
      axios
        .get("https://localhost:7092/api/movies", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            searcKeyword,
          },
        })
        .then((response) => {
          this.movies = response.data.movies;
          this.totalCount = response.data.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addNewMovie() {
      console.log("xx");
      this.$router.push({ name: "Edit" });
    },
    openDeleteModal(movie) {
      this.selectedMovie = movie;
      this.modalType = "delete";
    },
    deleteSelectedMovie() {
      if (!this.selectedMovie) return;

      axios
        .delete(`https://localhost:7092/api/movies/${this.selectedMovie.id}`)
        .then(() => {
          // Update the movies list after deletion
          this.movies = this.movies.filter(
            (x) => x.id !== this.selectedMovie.id
          );

          this.closeModal();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    closeModal() {
      this.selectedMovie = null;
    },
    fetchMovies() {
      axios
        .get("https://localhost:7092/api/movies", {
          params: { page: this.currentPage, pageSize: this.pageSize, sortOrder: this.sortOrder },
        })
        .then((response) => {
          this.movies = response.data.movies;
          this.totalCount = response.data.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    openImageModal(movie) {
      console.log(movie);
      this.selectedMovie = movie;
      this.modalType = "view";
    },
    closeMovieModal() {
      this.selectedMovie = null;
      this.modalType = null;
    },
    changePage(page) {
      if (page === this.currentPage) return;
      this.currentPage = page;
      this.fetchMovies();
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchMovies();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchMovies();
      }
    },
   sortData(){
    this.currentPage=1;
    this.fetchMovies();
   }
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
</style>
