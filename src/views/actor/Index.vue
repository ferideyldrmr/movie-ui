<template>
  <div class="card w-100">
    <div class="card-title px-3 pt-3 d-flex justify-content-between">
      <h5>Actors</h5>
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
        </div>

        <div class="d-flex flex-row">
          <button
            type="button"
            class="btn btn-warning mr-2"
            @click="exportActors"
          >
            Export Actors to CSV
          </button>
          <button type="button" class="btn btn-success" @click="addNewActor">
            Add New Actor
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div
          class="col-lg-2 col-md-4 col-sm-6 col-12 mb-3"
          v-for="actor in actors"
          :key="actor.id"
        >
          <div class="card h-100 w-100">
            <div class="img-wrapper" @click="openImageModal(actor)">
              <img
                :src="actor.actorImage"
                class="card-img-top"
                alt="Card image"
              />
            </div>
            <div class="card-body">
              <h5 class="card-title text-truncate" :name="actor.name">
                {{ actor.name }} {{ actor.surname }}
              </h5>
              <!-- <p class="card-text text-truncate">{{ actor.surname }}</p> -->
              <div class="button-wrapper">
                <router-link
                  :to="{ name: 'EditActor', params: { id: actor.id } }"
                  class="btn btn-custom edit-button"
                  >Edit</router-link
                >
                <button
                  type="button"
                  class="btn btn-custom delete-button"
                  @click="openDeleteModal(actor)"
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
        v-if="selectedActor && modalType === 'delete'"
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
                {{ selectedActor.name }} {{ selectedActor.surname }}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="closeModal"
              ></button>
            </div>
            <div class="modal-body">Do you want to delete this actor?</div>
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
                @click="deleteSelectedActor"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Movie Details Modal -->
      <div
        v-if="selectedActor && modalType === 'view'"
        class="modal fade show"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
        style="display: block"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="ActorModalLabel">
                {{ selectedActor.name }} {{ selectedActor.surname }}
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
                  <div class="col">
                    <img
                      :src="selectedActor.actorImage"
                      class="card-img-top"
                      alt="Cover Image"
                      style="max-height: 400px; object-fit: contain"
                    />
                  </div>
                  <!-- <div class="col">
                    <h5>{{ selectedActor.name }}{{ selectedActor.surname }}</h5>
                    <p>{{ selectedActor.surname }}</p>
                  </div> -->
                </div>
              </div>
              <h5 class="my-3">Movies and Shows</h5>
              <div class="row">
                <div
                  class="col"
                  v-if="
                    !selectedActor.movies.length && !selectedActor.shows.length
                  "
                >
                  Bu aktörün oynadığı film veya şov bulunamadı
                </div>
                <div
                  v-else
                  class="col col-md-4"
                  v-for="movie in selectedActor.movies"
                  :key="movie.id"
                >
                  <div class="card h-100 w-100">
                    <div class="img-wrapper">
                      <img
                        :src="movie.coverImage"
                        class="card-img-top"
                        alt="Card image"
                      />
                    </div>
                    <div class="card-body">
                      <h5
                        class="card-title text-truncate"
                        :title="`${movie.title}`"
                      >
                        {{ movie.title }}
                      </h5>
                    </div>
                  </div>
                </div>
                <!-- <div class="col" v-if="!selectedActor.shows.length ">
                  Bu aktörün oynadığı bir şov bulunamadı
                </div> -->
                <div
                  class="col col-md-4"
                  v-for="show in selectedActor.shows"
                  :key="show.id"
                >
                  <div class="card h-100 w-100">
                    <div class="img-wrapper">
                      <img
                        :src="show.coverImage"
                        class="card-img-top"
                        alt="Card image"
                      />
                    </div>
                    <div class="card-body">
                      <h5
                        class="card-title text-truncate"
                        :title="`${show.title}`"
                      >
                        {{ show.title }}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
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
  name: "ActorView",
  data() {
    return {
      actors: [],
      currentPage: 1,
      pageSize: 6,
      totalCount: 0,
      totalPages: 0,
      selectedActor: null,
      modalType: null,
      sortOrder: "asc",
    };
  },
  beforeDestroy() {
    this.$root.$off("search", this.search);
  },
  mounted() {
    this.$root.$on("search", this.search);
    this.fetchActors();
  },
  computed: {},
  methods: {
    search(searcKeyword) {
      axios
        .get("https://localhost:7092/api/actors", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            searcKeyword,
          },
        })
        .then((response) => {
          this.actors = response.data.actors;
          this.totalCount = response.data.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addNewActor() {
      console.log("xx");
      this.$router.push({ name: "EditActor" });
    },
    openDeleteModal(actor) {
      this.selectedActor = actor;
      this.modalType = "delete";
    },
    deleteSelectedActor() {
      if (!this.selectedActor) return;

      axios
        .delete(`https://localhost:7092/api/actors/${this.selectedActor.id}`)
        .then(() => {
          // Update the movies list after deletion
          this.actors = this.actors.filter(
            (x) => x.id !== this.selectedActor.id
          );

          this.closeModal();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    closeModal() {
      this.selectedActor = null;
    },
    fetchActors() {
      axios
        .get("https://localhost:7092/api/actors", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            sortOrder: this.sortOrder,
          },
        })
        .then((response) => {
          this.actors = response.data.actors;
          this.totalCount = response.data.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    openImageModal(actor) {
      console.log(actor);
      this.selectedActor = actor;
      this.modalType = "view";
    },
    closeActorModal() {
      this.selectedActor = null;
      this.modalType = null;
    },
    changePage(page) {
      if (page === this.currentPage) return;
      this.currentPage = page;
      this.fetchActors();
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchActors();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchActors();
      }
    },
    sortData() {
      this.currentPage = 1;
      this.fetchActors();
    },
    exportActors() {
      const link = document.createElement("a");
      link.href = "https://localhost:7092/api/actors/export";
      link.download = "actors.csv";
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

.mr-2 {
  margin-right: 10px;
}
</style>
