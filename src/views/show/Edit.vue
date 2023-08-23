<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{ pageTitle }}</h5>
        <form @submit="submitForm">
          <div class="mb-3">
            <label for="title" class="form-label">TV Show title</label>
            <input
              class="form-control"
              placeholder="Ex: Friends"
              v-model="show.title"
            />
          </div>
          <div class="mb-3">
            <label for="desc" class="form-label">TV Show Description</label>
            <input
              class="form-control"
              placeholder="Description of show"
              v-model="show.desc"
            />
          </div>
          <div class="mb-3">
            <label for="image" class="form-label">Cover image</label>
            <input
              class="form-control"
              placeholder="Cover thumb img"
              v-model="show.coverImage"
            />
          </div>
          <div class="mb-3">
            <label for="year" class="form-label">Year</label>
            <select
              class="form-select"
              v-model="show.year"
              aria-label="Default select example"
            >
              <option disabled value="">Please select a year</option>
              <option v-for="year in years" :key="`year-${year}`">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="showType" class="form-label">TV Show Type</label>
            <select
              class="form-select"
              v-model="show.category.id"
              aria-label="Default select example"
            >
              <option disabled value="">Please select a TV show type</option>
              <option
                v-for="showType in showTypes"
                :value="showType.id"
                :key="`mty-${showType.id}`"
              >
                {{ showType.name }}
              </option>
            </select>
          </div>

          <div class="my-4">
            <div class="d-flex justify-content-between">
              <h5>Actors</h5>
            </div>

            <div class="row mb-3">
              <div class="col-3">
                <select
                  class="form-select"
                  v-model="selectedActor"
                  aria-label="Default select example"
                >
                  <option disabled value="">Please select an actor</option>
                  <option
                    v-for="actor in filteredActors"
                    :key="`actor-opt-${actor.id}`"
                    :value="actor"
                  >
                    {{ actor.name }} {{ actor.surname }}
                  </option>
                </select>
              </div>
              <div class="col-2">
                <button
                  type="button"
                  class="btn btn-info"
                  @click="addActorToShow"
                >
                  Add
                </button>
              </div>
            </div>
            <div class="row">
              <div
                class="col-3"
                v-for="actor in show.actors"
                :key="`actor-${actor.id}`"
              >
                <div class="card h-100 w-100">
                  <div class="img-wrapper">
                    <img
                      :src="actor.actorImage"
                      class="card-img-top"
                      alt="Card image"
                      height="400"
                    />
                  </div>
                  <div class="card-body">
                    <h5 class="card-title text-truncate" :name="actor.name">
                      {{ actor.name }}
                    </h5>
                    <p class="card-text text-truncate">{{ actor.surname }}</p>
                    <div class="button-wrapper">
                      <button
                        type="button"
                        class="btn btn-danger"
                        @click="deleteShowActor(actor)"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="isShowOver"
                v-model="show.expire"
                :true-value="true" 
                :false-value="false"
              />
              <label class="form-check-label" for="isShowOver">
                This show is over
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-success">Save</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ShowEdit",
  data() {
    return {
      show: {
        title: "",
        year: null,
        desc: "",
        category: { id: -1 },
        coverImage: "",
        actors: [],
        showType: [],
        expire: true,
      },
      selectedActor: null,
      actors: [],
      years: [], // Array to hold the years
      showTypes: [],
    };
  },
  methods: {
    addActorToShow() {
      if (this.selectedActor === null) return;
      this.show.actors.push(this.selectedActor);
      this.selectedActor = null;
    },
    deleteShowActor(actor) {
      const index = this.show.actors.findIndex((x) => x.id === actor.id);
      this.show.actors.splice(index, 1);
    },
    async getActors() {
      await axios
        .get("https://localhost:7092/api/actors")
        .then((response) => {
          this.actors = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getShowById() {
      if (this.routerShowId === 0) return;

      const apiUrl = `https://localhost:7092/api/shows/${this.routerShowId}`;

      axios
        .get(apiUrl)
        .then((response) => {
          this.show = response.data;
          this.selectedIsShowOver = this.show.expire;
          this.selectedShowType = this.show.categoryId; // Film türünü seçili olarak ayarla
        })
        .catch((error) => {
          console.error("Failed to save film:", error);
        });
    },
    async getIsShowOver() {
      await axios
        .get("https://localhost:7092/api/shows")
        .then((response) => {
          this.show.expire = response.data.isShowOver;
        })

        .catch((error) => {
          console.error("Film durumu güncellenemedi:", error);
          // Hata durumunda kullanıcıya uygun bir hata mesajı gösterebilirsiniz
        });
    },

    submitForm(event) {
      event.preventDefault();

      if (this.routerShowId === 0) {
        this.addShow();
      } else {
        // Implement the logic for updating an existing movie
        this.updateShow();
      }
    },

    addShow() {
      const apiUrl = "https://localhost:7092/api/shows";

      const payload = {
        ...this.show,
        actors: this.show.actors.map((x) => x.id),
        categoryId: this.show.category.id,
        expire: this.show.expire,
      };

      axios
        .post(apiUrl, payload)
        .then(() => {
          this.$router.push({ name: "Show" });
        })
        .catch((error) => {
          console.error("Film kaydedilemedi:", error);
        });
    },
    toggleIsShowOver() {
      this.show.expire = !this.show.expire;
      const apiUrl = `https://localhost:7092/api/shows/${this.routerShowId}`;
      const payload = {
        expire: this.show.expire,
      };
      axios
        .put(apiUrl, payload)
        .then(() => {
          console.log("Film durumu güncellendi");
        })
        .catch((error) => {
          console.error("Film durumu güncellenemedi:", error);
          // Hata durumunda kullanıcıya uygun bir hata mesajı gösterebilirsiniz
        });
    },

    updateShow() {
      const apiUrl = `https://localhost:7092/api/shows/${this.routerShowId}`;
      const payload = {
        ...this.show,
        actors: this.show.actors.map((x) => x.id),
        categoryId: this.show.category.id,
        expire: this.show.expire,
      };

      console.log(100, payload);

      axios
        .put(apiUrl, payload)
        .then(() => {
          this.$router.push({ name: "Show" });
          // Perform any additional actions upon successful save
        })
        .catch((error) => {
          console.error("Failed to save film:", error);
        });
    },
    getYears() {
      const currentYear = new Date().getFullYear();
      const startYear = 1920;
      for (let year = currentYear; year >= startYear; year--) {
        this.years.push(year);
      }
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
  },
  computed: {
    filteredActors() {
      return this.actors?.filter(
        (actor) =>
          !this.show.actors.some((showActor) => showActor.id === actor.id)
      );
    },
    routerShowId() {
      console.log(this.$route.params);
      return this.$route.params.id ?? 0;
    },
    pageTitle() {
      return this.routerShowId === 0 ? "Add New Show" : "Edit Show";
    },
  },
  async mounted() {
    await this.getActors();
    await this.getShowType();
    this.getIsShowOver(), this.getShowById();
    this.getYears(); // Call the getYears method when the component is mounted
  },
};
</script>

<style></style>
