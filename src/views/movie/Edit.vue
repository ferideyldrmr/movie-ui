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
      },
      years: [], // Array to hold the years
    };
  },

  methods: {
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
      axios
        .post(apiUrl, this.movie)
        .then(() => {
          this.$router.push({ name: "Movie" });
        })
        .catch((error) => {
          console.error("Film kaydedilemedi:", error);
        });
    },

    updateMovie() {
      const apiUrl = `https://localhost:7092/api/movies/${this.routerMovieId}`;
      axios
        .put(apiUrl, this.movie)
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
    routerMovieId() {
      return this.$route.params.id ?? 0;
    },
    pageTitle() {
      return this.routerMovieId === 0 ? "Add New Movie" : "Edit Movie";
    },
  },
  mounted() {
    this.getMovieById();
    this.getYears(); // Call the getYears method when the component is mounted
  },
};
</script>

<style></style>
