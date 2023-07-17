<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{ pageTitle }}</h5>
        <form @submit="submitForm">
          <div class="mb-3">
            <label for="title" class="form-label">Movie title</label>
            <input
              class="form-control"
              placeholder="Ex: Esaretin bedeli"
              v-model="movie.title"
            />
          </div>
          <div class="mb-3">
            <label for="desc" class="form-label">Movie Description</label>
            <input
              class="form-control"
              placeholder="Description of movie"
              v-model="movie.desc"
            />
          </div>
          <div class="mb-3">
            <label for="image" class="form-label">Cover image</label>
            <input
              class="form-control"
              placeholder="Cover thumb img"
              v-model="movie.coverImage"
            />
          </div>
          <div class="mb-3">
            <label for="year" class="form-label">Year</label>
            <select
              class="form-select"
              v-model="movie.year"
              aria-label="Default select example"
            >
              <option disabled value="">Please select a year</option>
              <option v-for="year in years" :key="year">{{ year }}</option>
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
                    :key="actor.id"
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
                  @click="addActorToMovie"
                >
                  Add
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col-3" v-for="actor in movie.actors" :key="actor.id">
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
                        @click="deleteMovieActor(actor)"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
  name: "MovieEdit",
  data() {
    return {
      movie: {
        title: "",
        year: null,
        desc: "",
        coverImage: "",
        actors: [],
      },
      selectedActor: null,
      actors: [],
      years: [], // Array to hold the years
    };
  },
  methods: {
    addActorToMovie() {
      if (this.selectedActor === null) return;
      this.movie.actors.push(this.selectedActor);
      this.selectedActor = null;
    },
    deleteMovieActor(actor) {
      const index = this.movie.actors.findIndex((x) => x.id === actor.id);
      this.movie.actors.splice(index, 1);
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
    getMovieById() {
      if (this.routerMovieId === 0) return;

      const apiUrl = `https://localhost:7092/api/movies/${this.routerMovieId}`; // Replace with your API endpoint URL
      axios
        .get(apiUrl)
        .then((response) => {
          this.movie = response.data;
        })
        .catch((error) => {
          console.error("Failed to save film:", error);
        });
    },
    submitForm(event) {
      event.preventDefault();

      if (this.routerMovieId === 0) {
        this.addMovie();
      } else {
        // Implement the logic for updating an existing movie
        this.updateMovie();
      }
    },

    addMovie() {
      const apiUrl = "https://localhost:7092/api/movies";

     const payload = {
        ...this.movie,
        actors: this.movie.actors.map((x) => x.id),
      };

      axios
        .post(apiUrl, payload)
        .then(() => {
          this.$router.push({ name: "Movie" });
        })
        .catch((error) => {
          console.error("Film kaydedilemedi:", error);
        });
    },

    updateMovie() {
      const apiUrl = `https://localhost:7092/api/movies/${this.routerMovieId}`;

      const payload = {
        ...this.movie,
        actors: this.movie.actors.map((x) => x.id),
      };

      console.log(100,payload);

      axios
        .put(apiUrl, payload)
        .then(() => {
          this.$router.push({ name: "Movie" });
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
  },
  computed: {
    filteredActors() {
      return this.actors?.filter(
        (actor) =>
          !this.movie.actors.some((movieActor) => movieActor.id === actor.id)
      );
    },
    routerMovieId() {
      return this.$route.params.id ?? 0;
    },
    pageTitle() {
      return this.routerMovieId === 0 ? "Add New Movie" : "Edit Movie";
    },
  },
  async mounted() {
    await this.getActors();
    this.getMovieById();
    this.getYears(); // Call the getYears method when the component is mounted
  },
};
</script>

<style></style>
